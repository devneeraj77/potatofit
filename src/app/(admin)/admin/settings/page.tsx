"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Download,
  Lock,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [siteName, setSiteName] = useState("Uchitatvam");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [announcement, setAnnouncement] = useState(
    "Season 4 Apex Arena is now live: ₹50,000 Grand Prize Pool!"
  );
  const [requireWearableVerification, setRequireWearableVerification] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExportData = () => {
    alert("Exporting Uchitatvam database snapshot (JSON format)...");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#757761]/25">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Global Configuration
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs text-[#A0A493]">Uchitatvam Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            Platform Settings &amp; Governance
          </h1>
          <p className="text-xs sm:text-sm text-[#505445] dark:text-[#A0A493] mt-0.5">
            Manage operational parameters, live announcement banners, and anti-cheat policies.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportData}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#121815] dark:text-[#CBD2C7] bg-white dark:bg-[#18211C] border border-[#757761]/35 hover:bg-[#757761]/15 transition-colors cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Backup JSON</span>
        </button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        {/* Brand & Announcement */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#121815] dark:text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#f7fe72]" />
            Brand &amp; Broadcast Parameters
          </h2>

          <div>
            <label className="block font-mono text-[#505445] dark:text-[#A0A493] mb-1">
              Public Platform Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[#505445] dark:text-[#A0A493] mb-1">
              Global Notification Banner
            </label>
            <input
              type="text"
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Security & Arena Anti-Tampering */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#121815] dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#60a5fa]" />
            Arena Anti-Tampering &amp; Wearable Guard
          </h2>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/25">
            <div>
              <div className="font-semibold text-[#121815] dark:text-white">
                Require Cryptographic BLE Packet Signatures
              </div>
              <p className="text-[11px] text-[#505445] dark:text-[#A0A493] mt-0.5">
                Rejects manual spoofing and validates real-time heart rate streams from Apple Health / WHOOP.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRequireWearableVerification(!requireWearableVerification)}
              className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${
                requireWearableVerification ? "bg-[#f7fe72]" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  requireWearableVerification ? "translate-x-4 bg-black" : "translate-x-0 bg-white"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/25">
            <div>
              <div className="font-semibold text-[#121815] dark:text-white">
                Maintenance Mode (Ops Only)
              </div>
              <p className="text-[11px] text-[#505445] dark:text-[#A0A493] mt-0.5">
                Displays system maintenance landing page to regular athletes while admins work in proxy.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${
                maintenanceMode ? "bg-amber-400" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  maintenanceMode ? "translate-x-4 bg-black" : "translate-x-0 bg-white"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Platform Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
