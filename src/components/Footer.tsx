"use client";

import React from "react";
import Link from "next/link";
import PotatoFitLogo from "./PotatoFitLogo";
import ThemeToggleGlide from "./ThemeToggleGlide";

export default function Footer() {
  return (
    <footer className="bg-[#EAEFEA] dark:bg-[#0B0E0C] border-t border-[#757761]/20 dark:border-[#757761]/25 pt-14 pb-12 text-[#262A21] dark:text-[#CBD2C7] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#757761]/20">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <PotatoFitLogo size="sm" variant="dark" />

            <p className="text-xs sm:text-sm text-[#505445] dark:text-[#A0A493] leading-relaxed max-w-sm">
              Science-backed longevity, hybrid strength protocols, and restorative recovery engineered for everyday human performance.
            </p>

            <div className="pt-2">
              <span className="text-xs font-semibold text-[#7A5A00] dark:text-[#f7fe72] uppercase tracking-wider block mb-2 font-mono">
                Seamless Wearable Biomarker Sync
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#121815] dark:text-[#CBD2C7]">
                {["Apple Health", "WHOOP 4.0", "Garmin Connect", "Oura Ring Gen3", "Polar"].map((device) => (
                  <span
                    key={device}
                    className="px-2.5 py-1 rounded-md bg-white dark:bg-[#121815] border border-[#757761]/25 dark:border-[#757761]/35 text-[11px] text-[#121815] dark:text-[#E2E7DE] shadow-xs"
                  >
                    {device}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Links Column 1: Protocols */}
          <div>
            <h4 className="text-xs font-bold text-[#121815] dark:text-white uppercase tracking-wider mb-4 font-mono">
              Strength &amp; Protocols
            </h4>
            <ul className="space-y-2.5 text-xs text-[#505445] dark:text-[#A0A493] font-medium">
              <li><a href="#programs" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Adaptive Hypertrophy</a></li>
              <li><a href="#programs" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Olympic Barbell Lifts</a></li>
              <li><a href="#programs" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Home Dumbbell Circuits</a></li>
              <li><a href="#programs" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Progressive Overload Scheme</a></li>
              <li><a href="#programs" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Velocity-Based Training</a></li>
            </ul>
          </div>

          {/* Links Column 2: Recovery */}
          <div>
            <h4 className="text-xs font-bold text-[#121815] dark:text-white uppercase tracking-wider mb-4 font-mono">
              Sleep &amp; Recovery
            </h4>
            <ul className="space-y-2.5 text-xs text-[#505445] dark:text-[#A0A493] font-medium">
              <li><a href="#recovery" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Circadian Phase Tuning</a></li>
              <li><a href="#recovery" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Box Breathwork Protocol</a></li>
              <li><a href="#recovery" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Sauna &amp; Cold Plunge Logs</a></li>
              <li><a href="#nutrition" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Metabolic Nutrient Timing</a></li>
              <li><a href="#nutrition" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Electrolyte Partitioning</a></li>
            </ul>
          </div>

          {/* Links Column 3: Platform */}
          <div>
            <h4 className="text-xs font-bold text-[#121815] dark:text-white uppercase tracking-wider mb-4 font-mono">
              Specialists &amp; Trust
            </h4>
            <ul className="space-y-2.5 text-xs text-[#505445] dark:text-[#A0A493] font-medium">
              <li><a href="#coaches" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Board Certified Coaches</a></li>
              <li><a href="/leaderboards" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Member Leaderboard</a></li>
              <li><a href="/rewards" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Digital Rewards &amp; Perks</a></li>
              <li><a href="#community" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Peer Support Network</a></li>
              <li><a href="#" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">Clinical Advisory Board</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-[#505445] dark:text-[#757761]">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <p>© 2026 Uchitatvam Inc. All rights reserved.</p>
            <span className="hidden sm:inline text-[#757761]/40">•</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#505445] dark:text-[#A0A594]">Theme:</span>
              <ThemeToggleGlide size="sm" />
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
            <Link href="/privacy" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy#section-6" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">
              Biometric Security
            </Link>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
                }
              }}
              className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors cursor-pointer"
            >
              Cookie Preferences
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
