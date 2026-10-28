"use client";

import React, { useState } from "react";
import {
  BellRing,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Trophy,
  ShieldCheck,
  Smartphone,
  Sparkles,
  RefreshCw,
  X,
  Volume2,
} from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

export default function MobileNotificationPermissionDialog() {
  const {
    isMobileDialogOpen,
    dismissMobilePermissionDialog,
    notificationPermission,
    requestNotificationPermission,
    checkMobileReallow,
    triggerBiometricNotification,
    triggerQuestNotification,
    triggerBothNotifications,
    isInstalled,
    isIOS,
  } = usePWA();

  const [policyAccepted, setPolicyAccepted] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [testSent, setTestSent] = useState<string | null>(null);
  const [showFullPolicy, setShowFullPolicy] = useState(false);

  if (!isMobileDialogOpen) {
    return null;
  }

  const handleAcceptAndAllow = async () => {
    setIsRequesting(true);
    const permission = await requestNotificationPermission(policyAccepted);
    setIsRequesting(false);

    if (permission === "granted") {
      setTestSent("both");
      await triggerBothNotifications();
      setTimeout(() => {
        dismissMobilePermissionDialog();
      }, 2500);
    }
  };

  const handleTestAlert1 = async () => {
    setTestSent("biometrics");
    await triggerBiometricNotification();
    setTimeout(() => setTestSent(null), 3000);
  };

  const handleTestAlert2 = async () => {
    setTestSent("quests");
    await triggerQuestNotification();
    setTimeout(() => setTestSent(null), 3000);
  };

  const handleRecheckStatus = () => {
    const updated = checkMobileReallow();
    if (updated === "granted") {
      setTestSent("reallowed");
      setTimeout(() => {
        dismissMobilePermissionDialog();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0E1310] border-t sm:border border-[#757761]/40 rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl text-white max-h-[92vh] overflow-y-auto space-y-5 animate-in slide-in-from-bottom duration-300">
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#757761]/25">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-2xl bg-[#18211C] border border-[#f7fe72]/40 text-[#f7fe72]">
              <BellRing className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#34d399] border-2 border-[#0E1310]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Allow PWA Notifications
                </h3>
                {isInstalled && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#18211C] text-[#34d399] border border-[#34d399]/40 font-bold">
                    Mobile Standalone
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A0A493]">
                Enable essential background alerts under our verified athlete policy.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={dismissMobilePermissionDialog}
            className="p-1.5 text-[#757761] hover:text-white rounded-xl hover:bg-[#18211C] cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications Showcase: Both Channels */}
        <div className="space-y-2.5">
          <div className="text-[11px] font-mono text-[#757761] uppercase tracking-wider font-semibold">
            Two Active Notification Streams:
          </div>

          {/* Stream 1: Biometric Recovery Alerts */}
          <div className="p-3.5 rounded-2xl bg-[#141A16] border border-[#757761]/30 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-[#34d399] border border-emerald-500/20 shrink-0 mt-0.5">
                <Activity className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-white">
                    1. Biometric Readiness &amp; Recovery Sync
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/15 text-[#34d399] font-bold">
                    Channel 1
                  </span>
                </div>
                <p className="text-[11px] text-[#A0A493] leading-relaxed">
                  Real-time HRV alerts, post-exercise glycogen refueling windows, and 5-min Box Breathing rest cues.
                </p>
              </div>
            </div>

            {notificationPermission === "granted" && (
              <button
                type="button"
                onClick={handleTestAlert1}
                className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-[#18211C] text-[#34d399] border border-[#34d399]/30 hover:bg-[#202C24] shrink-0 cursor-pointer"
              >
                Test Alert
              </button>
            )}
          </div>

          {/* Stream 2: Daily Quests & Mandi Fuel */}
          <div className="p-3.5 rounded-2xl bg-[#141A16] border border-[#757761]/30 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-white">
                    2. Daily Quests &amp; Local Mandi Fuel
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 font-bold">
                    Channel 2
                  </span>
                </div>
                <p className="text-[11px] text-[#A0A493] leading-relaxed">
                  Morning produce arrivals at your regional mandi (Indore, Bhopal, Delhi NCR), token harvest reminders, and streak tracking.
                </p>
              </div>
            </div>

            {notificationPermission === "granted" && (
              <button
                type="button"
                onClick={handleTestAlert2}
                className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold bg-[#18211C] text-[#f7fe72] border border-[#f7fe72]/30 hover:bg-[#202C24] shrink-0 cursor-pointer"
              >
                Test Alert
              </button>
            )}
          </div>
        </div>

        {/* State: Permission Blocked / Denied -> Show Mobile Re-Allow Instructions */}
        {notificationPermission === "denied" && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Mobile Notification Re-Allow Required</span>
            </div>
            <p className="text-[11px] text-[#CBD2C7] leading-relaxed">
              Notifications were previously blocked by your mobile browser. Under mobile operating system security rules, the browser cannot display the permission prompt again directly.
            </p>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-[11px]">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-[#f7fe72]" />
                <span>How to Re-Allow on your device:</span>
              </div>

              {isIOS ? (
                <ol className="list-decimal list-inside space-y-1 text-[#CBD2C7]">
                  <li>Open iPhone <strong>Settings</strong> app.</li>
                  <li>Scroll down and tap <strong>Uchitatvam</strong> (or <strong>Safari</strong>).</li>
                  <li>Tap <strong>Notifications</strong> and switch <strong>Allow Notifications</strong> to ON.</li>
                  <li>Return here and tap <strong>Check Status</strong> below.</li>
                </ol>
              ) : (
                <ol className="list-decimal list-inside space-y-1 text-[#CBD2C7]">
                  <li>Tap the <strong>Lock / Settings icon</strong> in your browser address bar (or Android Settings &gt; Apps &gt; Uchitatvam &gt; Permissions).</li>
                  <li>Tap <strong>Permissions</strong> or <strong>Site Settings</strong>.</li>
                  <li>Set <strong>Notifications</strong> to <strong>Allow</strong>.</li>
                  <li>Return here and tap <strong>Check Status</strong> below.</li>
                </ol>
              )}
            </div>

            <button
              type="button"
              onClick={handleRecheckStatus}
              className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Check Re-Allowed Status</span>
            </button>
          </div>
        )}

        {/* Athletic Notification Policy Consent Section */}
        <div className="p-4 rounded-2xl bg-[#141A16] border border-[#757761]/30 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#34d399]" />
              <span>Athletic Notification Policy &amp; Terms</span>
            </span>
            <button
              type="button"
              onClick={() => setShowFullPolicy(!showFullPolicy)}
              className="text-[10px] font-mono text-[#f7fe72] hover:underline cursor-pointer"
            >
              {showFullPolicy ? "Hide Policy Details" : "View Full Policy"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-mono text-[#CBD2C7]">
            <div className="p-2 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
              <span className="text-[#34d399] font-bold block">● Zero Ad Spam</span>
              <span>No marketing or affiliate ads.</span>
            </div>
            <div className="p-2 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
              <span className="text-[#34d399] font-bold block">● Circadian Pacing</span>
              <span>1–2 alerts/day, quiet 10PM–7AM.</span>
            </div>
            <div className="p-2 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
              <span className="text-[#34d399] font-bold block">● Full User Control</span>
              <span>Revoke anytime in mobile settings.</span>
            </div>
          </div>

          {showFullPolicy && (
            <div className="p-3 rounded-xl bg-black/50 border border-[#757761]/30 text-[11px] text-[#A0A493] space-y-2 animate-in fade-in duration-200">
              <p>
                <strong>Data Minimization:</strong> All heart-rate variability, sleep architecture, and daily quest calculations are computed locally or on encrypted session tokens. We never store personal biometrics unencrypted.
              </p>
              <p>
                <strong>Delivery Mechanism:</strong> Notifications are delivered through W3C Web Push and the Uchitatvam Service Worker (<code className="text-[#f7fe72]">sw.js</code>) on standalone mobile PWAs.
              </p>
            </div>
          )}

          {/* Policy Acceptance Checkbox */}
          <label className="flex items-start gap-2.5 pt-1 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={policyAccepted}
              onChange={(e) => setPolicyAccepted(e.target.checked)}
              className="rounded border-[#757761]/40 text-[#f7fe72] focus:ring-0 mt-0.5 cursor-pointer"
            />
            <span className="text-[#CBD2C7] text-[11px] leading-tight">
              I accept the Uchitatvam Notification &amp; Biometric Privacy Policy for mobile alerts.
            </span>
          </label>
        </div>

        {/* Confirmation banner if test alert sent */}
        {testSent && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
              <span>
                {testSent === "both"
                  ? "✓ Both notification streams successfully enabled & sent!"
                  : testSent === "reallowed"
                  ? "✓ Permissions verified! Mobile notifications are now live."
                  : `✓ Test alert sent for ${testSent}. Check your device notification tray!`}
              </span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={dismissMobilePermissionDialog}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs text-[#A0A493] hover:text-white transition-colors cursor-pointer text-center"
          >
            Maybe Later
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {notificationPermission === "granted" ? (
              <button
                type="button"
                onClick={triggerBothNotifications}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-gradient-to-r from-[#34d399] to-[#2ecc71] hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test Both Notifications</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={!policyAccepted || isRequesting}
                onClick={handleAcceptAndAllow}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-black text-[#0B0E0C] bg-gradient-to-r from-[#f7fe72] to-[#e7ee62] hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Volume2 className="w-4 h-4" />
                <span>{isRequesting ? "Prompting Device..." : "Accept Policy & Allow Notifications"}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
