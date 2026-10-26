"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, ShieldCheck, X, SlidersHorizontal } from "lucide-react";

interface CookiePreferences {
  essential: boolean;
  biometrics: boolean;
  localKirana: boolean;
  analytics: boolean;
  timestamp: string;
}

const STORAGE_KEY = "uchitatvam_cookie_consent_v1";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true,
    biometrics: true,
    localKirana: true,
    analytics: false,
    timestamp: "",
  });

  useEffect(() => {
    // Check consent asynchronously to avoid cascading synchronous render
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
          setIsVisible(true);
        } else {
          const parsed = JSON.parse(saved);
          setPrefs(parsed);
        }
      } catch {
        setIsVisible(true);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // Listen for open-cookie-preferences custom event from footer
  useEffect(() => {
    const handleOpen = () => {
      setIsVisible(true);
      setShowPreferences(true);
    };
    window.addEventListener("open-cookie-preferences", handleOpen);
    return () => window.removeEventListener("open-cookie-preferences", handleOpen);
  }, []);

  const saveConsent = (updatedPrefs: CookiePreferences) => {
    const record = {
      ...updatedPrefs,
      essential: true,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (e) {
      console.warn("Could not save cookie preferences", e);
    }
    setPrefs(record);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent({
      essential: true,
      biometrics: true,
      localKirana: true,
      analytics: true,
      timestamp: "",
    });
  };

  const handleRejectNonEssential = () => {
    saveConsent({
      essential: true,
      biometrics: false,
      localKirana: false,
      analytics: false,
      timestamp: "",
    });
  };

  const handleSavePreferences = () => {
    saveConsent(prefs);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          role="region"
          aria-label="Cookie consent and privacy preferences"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 32 }}
          className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 md:p-5 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto w-full pointer-events-auto">
            <div className="relative overflow-hidden rounded-2xl bg-[#0E1310]/95 dark:bg-[#0B0E0C]/95 backdrop-blur-md border border-[#757761]/35 shadow-2xl text-[#E2E7DE]">
              {/* Subtle accent highlight line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#f7fe72]/50 to-transparent" />

              {!showPreferences ? (
                /* Compact Banner View */
                <div className="p-4 sm:p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5 max-w-2xl">
                    <div className="p-2.5 rounded-xl bg-[#18211C] border border-[#757761]/30 text-[#f7fe72] shrink-0 mt-0.5">
                      <Cookie className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs uppercase tracking-wider font-mono font-bold text-[#f7fe72]">
                          Privacy &amp; Data Transparency
                        </span>
                        <span className="text-xs text-[#757761]">·</span>
                        <span className="text-xs text-[#A0A493]">Uchitatvam</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#CBD2C7] leading-relaxed">
                        We use strictly essential cookies for secure authentication and optional local storage
                        to synchronize your wearable biometrics and map nearest local vegetable vendors.
                        We never sell your health metrics.
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-[#A0A493]">
                        <Link
                          href="/privacy"
                          className="hover:text-[#f7fe72] underline underline-offset-4 transition-colors"
                        >
                          Privacy Policy
                        </Link>
                        <span>·</span>
                        <Link
                          href="/terms"
                          className="hover:text-[#f7fe72] underline underline-offset-4 transition-colors"
                        >
                          Terms of Service
                        </Link>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => setShowPreferences(true)}
                          className="hover:text-[#f7fe72] flex items-center gap-1 transition-colors"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                          <span>Customize Preferences</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto shrink-0 pt-1 md:pt-0">
                    <button
                      type="button"
                      onClick={handleRejectNonEssential}
                      className="flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold text-[#CBD2C7] bg-[#18211C] hover:bg-[#202B24] border border-[#757761]/35 transition-colors whitespace-nowrap"
                    >
                      Essential Only
                    </button>
                    <button
                      type="button"
                      onClick={handleAcceptAll}
                      className="flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-sm whitespace-nowrap"
                    >
                      Accept All
                    </button>
                  </div>
                </div>
              ) : (
                /* Preferences Modal / Detail View */
                <div className="p-5 sm:p-6 md:p-7 space-y-5 max-h-[80vh] overflow-y-auto">
                  <div className="flex items-start justify-between gap-4 border-b border-[#757761]/25 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-[#18211C] border border-[#757761]/30 text-[#f7fe72]">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                          Manage Your Cookie &amp; Data Preferences
                        </h3>
                        <p className="text-xs text-[#A0A493] mt-0.5">
                          Configure how Uchitatvam processes local storage and device sync
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPreferences(false)}
                      className="p-1.5 rounded-lg text-[#A0A493] hover:text-white hover:bg-[#18211C] transition-colors"
                      aria-label="Close preferences view"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Options List */}
                  <div className="space-y-3">
                    {/* Item 1: Strictly Necessary */}
                    <div className="p-3.5 rounded-xl bg-[#141A16] border border-[#757761]/25 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">Strictly Necessary Cookies</span>
                          <span className="text-[10px] font-mono uppercase bg-[#1D2520] text-[#CBD2C7] px-2 py-0.5 rounded border border-[#757761]/30">
                            Always Active
                          </span>
                        </div>
                        <p className="text-xs text-[#A0A493] leading-relaxed">
                          Required for secure authentication, session persistence, CSRF security, and theme settings. Cannot be disabled.
                        </p>
                      </div>
                      <div className="shrink-0 pt-1">
                        <div className="w-9 h-5 bg-[#757761]/40 rounded-full flex items-center px-1 cursor-not-allowed">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#f7fe72]" />
                        </div>
                      </div>
                    </div>

                    {/* Item 2: Biometric Sync & Wearables */}
                    <div className="p-3.5 rounded-xl bg-[#141A16] border border-[#757761]/25 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-white">Wearable Biometric Synchronization</span>
                        <p className="text-xs text-[#A0A493] leading-relaxed">
                          Caches high-frequency telemetry (heart rate zones, HRV, sleep metrics from Apple Health, WHOOP, Garmin, Oura) locally in browser memory for real-time coach feedback.
                        </p>
                      </div>
                      <div className="shrink-0 pt-1">
                        <button
                          type="button"
                          onClick={() => setPrefs((p) => ({ ...p, biometrics: !p.biometrics }))}
                          className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7fe72] ${
                            prefs.biometrics ? "bg-[#f7fe72]" : "bg-[#253028]"
                          }`}
                          aria-label="Toggle wearable biometrics synchronization"
                          aria-pressed={prefs.biometrics}
                        >
                          <div
                            className={`w-4 h-4 rounded-full transition-transform ${
                              prefs.biometrics ? "translate-x-4 bg-[#0B0E0C]" : "translate-x-0 bg-[#A0A493]"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Item 3: Local Kirana & Vendor Geolocation */}
                    <div className="p-3.5 rounded-xl bg-[#141A16] border border-[#757761]/25 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-white">Local Kirana &amp; Whole-Food Mapping</span>
                        <p className="text-xs text-[#A0A493] leading-relaxed">
                          Saves your localized grocery search quadrant so our algorithm can match seasonal vegetables and regional protein sources at your neighborhood mandis.
                        </p>
                      </div>
                      <div className="shrink-0 pt-1">
                        <button
                          type="button"
                          onClick={() => setPrefs((p) => ({ ...p, localKirana: !p.localKirana }))}
                          className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7fe72] ${
                            prefs.localKirana ? "bg-[#f7fe72]" : "bg-[#253028]"
                          }`}
                          aria-label="Toggle local kirana grocery cache"
                          aria-pressed={prefs.localKirana}
                        >
                          <div
                            className={`w-4 h-4 rounded-full transition-transform ${
                              prefs.localKirana ? "translate-x-4 bg-[#0B0E0C]" : "translate-x-0 bg-[#A0A493]"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Item 4: Analytics */}
                    <div className="p-3.5 rounded-xl bg-[#141A16] border border-[#757761]/25 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-white">Experience Diagnostics &amp; Analytics</span>
                        <p className="text-xs text-[#A0A493] leading-relaxed">
                          Anonymous application telemetry to detect rendering latency, failed workout logs, and optimize mobile responsive viewport performance.
                        </p>
                      </div>
                      <div className="shrink-0 pt-1">
                        <button
                          type="button"
                          onClick={() => setPrefs((p) => ({ ...p, analytics: !p.analytics }))}
                          className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7fe72] ${
                            prefs.analytics ? "bg-[#f7fe72]" : "bg-[#253028]"
                          }`}
                          aria-label="Toggle anonymous analytics"
                          aria-pressed={prefs.analytics}
                        >
                          <div
                            className={`w-4 h-4 rounded-full transition-transform ${
                              prefs.analytics ? "translate-x-4 bg-[#0B0E0C]" : "translate-x-0 bg-[#A0A493]"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preference Controls */}
                  <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#757761]/25">
                    <button
                      type="button"
                      onClick={() => setShowPreferences(false)}
                      className="text-xs text-[#A0A493] hover:text-white transition-colors"
                    >
                      Back to Overview
                    </button>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleRejectNonEssential}
                        className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-medium text-[#CBD2C7] bg-[#18211C] hover:bg-[#202B24] border border-[#757761]/35 transition-colors"
                      >
                        Reject All Optional
                      </button>
                      <button
                        type="button"
                        onClick={handleSavePreferences}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
