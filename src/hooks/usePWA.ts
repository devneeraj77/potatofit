"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [permissionOverride, setPermissionOverride] = useState<NotificationPermission | null>(null);

  const notificationPermission = useSyncExternalStore(
    () => () => {},
    () => {
      if (permissionOverride) return permissionOverride;
      if (typeof window === "undefined" || !("Notification" in window)) return "default";
      return Notification.permission;
    },
    () => "default"
  );

  // Modern React 19 external store subscribers for browser-only capabilities
  const isInstalled = useSyncExternalStore(
    () => () => {},
    () => {
      if (typeof window === "undefined") return false;
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
      );
    },
    () => false
  );

  const isIOS = useSyncExternalStore(
    () => () => {},
    () => {
      if (typeof window === "undefined") return false;
      return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Install prompt listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Register Service Worker
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

  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
      return "denied";
    }
    try {
      const permission = await Notification.requestPermission();
      setPermissionOverride(permission);
      return permission;
    } catch {
      return "denied";
    }
  }, []);

  const triggerNotification = useCallback(
    async (title: string, options?: NotificationOptions) => {
      if (!("Notification" in window)) return false;

      let currentPerm = Notification.permission;
      if (currentPerm === "default") {
        currentPerm = await requestNotificationPermission();
      }

      if (currentPerm !== "granted") {
        return false;
      }

      // 1. Try via active Service Worker registration
      if (swRegistration && "showNotification" in swRegistration) {
        try {
          await swRegistration.showNotification(title, {
            icon: "/android-chrome-192x192.png",
            badge: "/android-chrome-192x192.png",
            ...options,
          });
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
        });
        return true;
      }

      // 3. Fallback to browser Notification constructor
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

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isOnline,
    install,
    notificationPermission,
    requestNotificationPermission,
    triggerNotification,
  };
}
