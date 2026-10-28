"use client";

import React, { useState } from "react";
import {
  Download,
  Smartphone,
  X,
  CheckCircle2,
  Bell,
  BellRing,
  Sparkles,
} from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

interface PWAInstallButtonProps {
  className?: string;
  variant?: "pill" | "banner" | "icon";
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = "",
  variant = "pill",
}) => {
  const {
    isInstallable,
    isInstalled,
    isIOS,
    install,
    notificationPermission,
    triggerBothNotifications,
    openMobilePermissionDialog,
  } = usePWA();

  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [isNotifLoading, setIsNotifLoading] = useState(false);
  const [testSentMsg, setTestSentMsg] = useState<string | null>(null);

  const handleTestBothAlerts = async () => {
    setIsNotifLoading(true);
    if (notificationPermission !== "granted") {
      openMobilePermissionDialog();
      setIsNotifLoading(false);
      return;
    }
    const success = await triggerBothNotifications();
    setIsNotifLoading(false);
    if (success) {
      setTestSentMsg("Both Alerts Sent ✓");
      setTimeout(() => setTestSentMsg(null), 3000);
    }
  };

  // iOS Safari Guide Modal
  const iosModal = showIOSGuide && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#121815] border border-[#757761]/40 p-6 shadow-2xl text-white animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#f7fe72]" />
            <h3 className="text-base font-bold text-white">Install Uchitatvam on iOS</h3>
          </div>
          <button
            onClick={() => setShowIOSGuide(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ol className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300">
          <li className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f7fe72]/20 text-[#f7fe72] font-bold text-xs">
              1
            </span>
            <span>
              Tap the <strong>Share button</strong> (square with arrow up) at the bottom of Safari.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f7fe72]/20 text-[#f7fe72] font-bold text-xs">
              2
            </span>
            <span>
              Scroll down and tap <strong>Add to Home Screen</strong>.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f7fe72]/20 text-[#f7fe72] font-bold text-xs">
              3
            </span>
            <span>
              Confirm <strong>Add</strong>. Launch from Home Screen to enable Web Push &amp; background alerts under iOS policies.
            </span>
          </li>
        </ol>

        <button
          onClick={() => setShowIOSGuide(false)}
          className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer"
        >
          Got It
        </button>
      </div>
    </div>
  );

  // Banner variant when already installed in standalone mode
  if (variant === "banner" && isInstalled) {
    if (bannerDismissed) return null;

    return (
      <>
        {iosModal}
        <div className="bg-[#0E1310] border-b border-[#757761]/35 py-2 px-4 text-white text-xs shadow-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 rounded-lg bg-emerald-500/15 text-[#34d399] items-center justify-center shrink-0 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white text-xs">
                    Uchitatvam PWA Standalone Active
                  </p>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                      notificationPermission === "granted"
                        ? "bg-emerald-500/15 text-[#34d399] border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {notificationPermission === "granted"
                      ? "Both Notifications Allowed ✓"
                      : "Notifications Pending"}
                  </span>
                </div>
                <p className="text-[11px] text-[#A0A493] hidden sm:block">
                  Biometric readiness tracking &amp; daily vegetable mandi nutrition alerts.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {notificationPermission === "granted" ? (
                <button
                  onClick={handleTestBothAlerts}
                  disabled={isNotifLoading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#f7fe72]" />
                  <span>{testSentMsg || (isNotifLoading ? "Sending..." : "Test Both Alerts")}</span>
                </button>
              ) : (
                <button
                  onClick={openMobilePermissionDialog}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] text-xs font-black shadow hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Allow Notifications (Under Policy)</span>
                </button>
              )}

              <button
                onClick={() => setBannerDismissed(true)}
                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Banner variant before installation
  if (variant === "banner" && !bannerDismissed && (isInstallable || isIOS || !isInstalled)) {
    return (
      <>
        {iosModal}
        <div className="bg-[#121815] border-b border-[#757761]/35 py-2.5 px-4 text-white text-xs sm:text-sm shadow-md">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 rounded-lg bg-[#f7fe72]/15 text-[#f7fe72] items-center justify-center shrink-0 border border-[#f7fe72]/30">
                <Smartphone className="w-4 h-4" />
              </span>
              <div>
                <p className="font-bold text-white text-xs sm:text-sm">
                  Install Uchitatvam Web App
                </p>
                <p className="text-[11px] text-[#A0A493] hidden sm:block">
                  Offline biometric caching, instant workout pacing, and dual push notifications.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={openMobilePermissionDialog}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
                title="Manage notification policies and alerts"
              >
                <Bell className="w-3.5 h-3.5 text-[#f7fe72]" />
                <span>
                  {notificationPermission === "granted"
                    ? "Notifications Active"
                    : "Notification Policy"}
                </span>
              </button>

              {isInstallable ? (
                <button
                  onClick={install}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] text-xs font-black shadow hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install App</span>
                </button>
              ) : isIOS ? (
                <button
                  onClick={() => setShowIOSGuide(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] text-xs font-black shadow hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Install on iOS</span>
                </button>
              ) : null}

              <button
                onClick={() => setBannerDismissed(true)}
                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                aria-label="Dismiss install banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Pill variant
  return (
    <>
      {iosModal}
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {notificationPermission === "granted" ? (
          <button
            onClick={handleTestBothAlerts}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono hover:bg-emerald-500/25 transition-all cursor-pointer"
            title="Test both notifications"
          >
            <Bell className="w-3 h-3 text-[#34d399]" />
            <span>Alerts Active ✓</span>
          </button>
        ) : (
          <button
            onClick={openMobilePermissionDialog}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#18211C] border border-[#f7fe72]/30 text-[#f7fe72] text-[11px] font-mono hover:bg-[#222E26] transition-all cursor-pointer"
            title="Configure notifications under policy"
          >
            <BellRing className="w-3 h-3" />
            <span>Allow Alerts</span>
          </button>
        )}

        {isInstallable ? (
          <button
            onClick={install}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:brightness-110 text-[#0B0E0C] text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        ) : isIOS && !isInstalled ? (
          <button
            onClick={() => setShowIOSGuide(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install PWA</span>
          </button>
        ) : isInstalled ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>Installed PWA</span>
          </span>
        ) : null}
      </div>
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400/40 animate-in slide-in-from-bottom duration-300">
      <span className="h-2 w-2 rounded-full bg-white animate-ping" />
      <span>Offline Mode — Cached athlete protocols active</span>
    </div>
  );
};
