"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export type PwaNotificationCategory = "biometrics" | "quests" | "general";

const POLICY_STORAGE_KEY = "uchitatvam_notif_policy_accepted";
const DISMISSED_STORAGE_KEY = "uchitatvam_notif_dialog_dismissed_at";

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [permissionOverride, setPermissionOverride] = useState<NotificationPermission | null>(null);
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState<boolean>(false);
  const [isPolicyAccepted, setIsPolicyAccepted] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(POLICY_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  // Read permission dynamically with useSyncExternalStore
  const notificationPermission = useSyncExternalStore(
    () => () => {},
    () => {
      if (permissionOverride) return permissionOverride;
      if (typeof window === "undefined" || !("Notification" in window)) return "default";
      return Notification.permission;
    },
    () => "default"
  );

  // Standalone PWA detection (Android WebAPK, Chrome standalone, iOS Safari home screen)
  const isInstalled = useSyncExternalStore(
    () => () => {},
    () => {
      if (typeof window === "undefined") return false;
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: window-controls-overlay)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
      );
    },
    () => false
  );

  // iOS Safari detection
  const isIOS = useSyncExternalStore(
    () => () => {},
    () => {
      if (typeof window === "undefined") return false;
      return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    },
    () => false
  );

  // General mobile device detection
  const isMobile = useSyncExternalStore(
    () => () => {},
    () => {
      if (typeof window === "undefined") return false;
      const ua = window.navigator.userAgent.toLowerCase();
      const mobileUa = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
      const touchScreen = window.navigator.maxTouchPoints > 0;
      const smallViewport = window.innerWidth <= 768;
      return mobileUa || (touchScreen && smallViewport);
    },
    () => false
  );

  const isOnline = useSyncExternalStore(
    (notify) => {
      window.addEventListener("online", notify);
      window.addEventListener("offline", notify);
      return () => {
        window.removeEventListener("online", notify);
        window.removeEventListener("offline", notify);
      };
    },
    () => (typeof navigator !== "undefined" ? navigator.onLine : true),
    () => true
  );

  // Register Service Worker and manage install prompt listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      // Auto open policy consent dialog once installed on mobile
      setTimeout(() => {
        setIsMobileDialogOpen(true);
      }, 1200);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setSwRegistration(reg);
        })
        .catch((err) => {
          console.warn("ServiceWorker registration error:", err);
        });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // After install in mobile: automatically show dialog box for accept under policy
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Conditions to prompt mobile dialog:
    // 1. Mobile device
    // 2. Installed standalone mode
    // 3. Notification permission not yet granted
    // 4. Not dismissed in the last 2 hours
    if (isInstalled && isMobile && notificationPermission !== "granted") {
      let recentlyDismissed = false;
      try {
        const dismissedAt = localStorage.getItem(DISMISSED_STORAGE_KEY);
        if (dismissedAt) {
          const hoursAgo = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60);
          if (hoursAgo < 2) {
            recentlyDismissed = true;
          }
        }
      } catch {
        // ignore
      }

      if (!recentlyDismissed) {
        const timer = setTimeout(() => {
          setIsMobileDialogOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isInstalled, isMobile, notificationPermission]);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  // Re-check permission (especially after mobile user returns from phone settings)
  const checkMobileReallow = useCallback((): NotificationPermission => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "denied";
    }
    const current = Notification.permission;
    setPermissionOverride(current);
    if (current === "granted") {
      setIsMobileDialogOpen(false);
      try {
        localStorage.setItem(POLICY_STORAGE_KEY, "true");
        setIsPolicyAccepted(true);
      } catch {
        // ignore
      }
    }
    return current;
  }, []);

  // Request notification permission with policy consent record
  const requestNotificationPermission = useCallback(
    async (acceptedUnderPolicy = true): Promise<NotificationPermission> => {
      if (!("Notification" in window)) {
        return "denied";
      }

      try {
        const permission = await Notification.requestPermission();
        setPermissionOverride(permission);

        if (permission === "granted" && acceptedUnderPolicy) {
          try {
            localStorage.setItem(POLICY_STORAGE_KEY, "true");
            localStorage.setItem("uchitatvam_policy_timestamp", new Date().toISOString());
            setIsPolicyAccepted(true);
          } catch {
            // ignore storage error
          }
        }

        return permission;
      } catch {
        return "denied";
      }
    },
    []
  );

  // Trigger single notification with category tags
  const triggerNotification = useCallback(
    async (
      title: string,
      options?: NotificationOptions,
      category: PwaNotificationCategory = "general"
    ) => {
      if (!("Notification" in window)) return false;

      let currentPerm = Notification.permission;
      if (currentPerm === "default") {
        currentPerm = await requestNotificationPermission(true);
      }

      if (currentPerm !== "granted") {
        return false;
      }

      // 1. Try via active Service Worker registration
      if (swRegistration && "showNotification" in swRegistration) {
        try {
          const isBiometric = category === "biometrics";
          const isQuest = category === "quests";

          await swRegistration.showNotification(title, {
            icon: "/android-chrome-192x192.png",
            badge: "/android-chrome-192x192.png",
            tag: isBiometric ? "uchitatvam-biometrics" : isQuest ? "uchitatvam-quests" : "uchitatvam-alert",
            renotify: true,
            vibrate: isBiometric ? [150, 60, 150] : [200, 80, 200, 80],
            actions: isBiometric
              ? [
                  { action: "open_biometrics", title: "View Telemetry" },
                  { action: "close", title: "Dismiss" },
                ]
              : isQuest
              ? [
                  { action: "open_quests", title: "Claim Tokens" },
                  { action: "close", title: "Dismiss" },
                ]
              : undefined,
            ...options,
          } as unknown as NotificationOptions);
          return true;
        } catch {
          // fallback
        }
      }

      // 2. Try via service worker controller message
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "SHOW_NOTIFICATION",
          title,
          options,
          notificationCategory: category,
        });
        return true;
      }

      // 3. Fallback to standard browser Notification constructor
      try {
        new Notification(title, {
          icon: "/android-chrome-192x192.png",
          badge: "/android-chrome-192x192.png",
          ...options,
        });
        return true;
      } catch {
        return false;
      }
    },
    [swRegistration, requestNotificationPermission]
  );

  // Notification 1: Biometric Recovery & Readiness Alert
  const triggerBiometricNotification = useCallback(async () => {
    return triggerNotification(
      "⚡ Biometric Readiness Alert",
      {
        body: "Recovery readiness score 92%. Optimal window for Box Breathing protocol and HRV sync.",
        data: { url: "/#health-sync-section" },
      },
      "biometrics"
    );
  }, [triggerNotification]);

  // Notification 2: Daily Quests & Local Mandi Fuel Alert
  const triggerQuestNotification = useCallback(async () => {
    return triggerNotification(
      "🥕 Daily Quests & Mandi Harvest",
      {
        body: "Morning produce fresh arrival! Claim +150 Potato Tokens and log your seasonal spinach & beetroot.",
        data: { url: "/rewards" },
      },
      "quests"
    );
  }, [triggerNotification]);

  // Trigger BOTH notifications sequentially so the user can verify both channels
  const triggerBothNotifications = useCallback(async () => {
    if (swRegistration && navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_BOTH_NOTIFICATIONS",
        biometrics: {
          title: "⚡ Biometric Readiness Alert",
          body: "Recovery readiness score 92%. Optimal window for Box Breathing protocol and HRV sync.",
        },
        quests: {
          title: "🥕 Daily Quests & Mandi Harvest",
          body: "Morning produce fresh arrival! Claim +150 Potato Tokens and log your seasonal spinach & beetroot.",
        },
      });
      return true;
    }

    const firstSuccess = await triggerBiometricNotification();
    await new Promise((resolve) => setTimeout(resolve, 800));
    const secondSuccess = await triggerQuestNotification();
    return firstSuccess || secondSuccess;
  }, [swRegistration, triggerBiometricNotification, triggerQuestNotification]);

  const dismissMobilePermissionDialog = useCallback(() => {
    setIsMobileDialogOpen(false);
    try {
      localStorage.setItem(DISMISSED_STORAGE_KEY, Date.now().toString());
    } catch {
      // ignore
    }
  }, []);

  const openMobilePermissionDialog = useCallback(() => {
    setIsMobileDialogOpen(true);
  }, []);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isMobile,
    isOnline,
    install,
    notificationPermission,
    isPolicyAccepted,
    isMobileDialogOpen,
    openMobilePermissionDialog,
    dismissMobilePermissionDialog,
    requestNotificationPermission,
    checkMobileReallow,
    triggerNotification,
    triggerBiometricNotification,
    triggerQuestNotification,
    triggerBothNotifications,
  };
}
