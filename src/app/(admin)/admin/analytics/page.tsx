"use client";

import React from "react";
import { HeartPulse } from "lucide-react";

export default function AdminAnalyticsPage() {
  const syncDevices = [
    { name: "Apple HealthKit", status: "Operational", uptime: "99.98%", latency: "14ms" },
    { name: "WHOOP 4.0 BLE / Cloud", status: "Operational", uptime: "99.92%", latency: "28ms" },
    { name: "Garmin Connect SDK", status: "Operational", uptime: "99.95%", latency: "19ms" },
    { name: "Oura Gen3 Ring API", status: "Operational", uptime: "99.89%", latency: "34ms" },
    { name: "Polar Flow Webhooks", status: "Operational", uptime: "99.91%", latency: "22ms" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#757761]/25">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Telemetry &amp; Infrastructure
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs text-[#A0A493]">Real-Time Health Ingestion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            System Telemetry &amp; Biomarker Ingestion
          </h1>
          <p className="text-xs sm:text-sm text-[#505445] dark:text-[#A0A493] mt-0.5">
            Monitor wearable API endpoints, server memory usage, and nearest vegetable vendor geocoding response latency.
          </p>
        </div>
      </div>

      {/* Wearable Sync Status Cards */}
      <div className="rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#757761]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#f7fe72]" />
            <h2 className="text-sm font-bold text-[#121815] dark:text-white">
              Wearable Device Synchronization Feeds
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            All 5 Pipes Active
          </span>
        </div>

        <div className="divide-y divide-[#757761]/15">
          {syncDevices.map((dev) => (
            <div
              key={dev.name}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-[#121815] dark:text-white">{dev.name}</span>
                <span className="text-[#505445] dark:text-[#A0A493] ml-2 font-mono text-[11px]">
                  Latency: {dev.latency}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
                  {dev.uptime} uptime
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {dev.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Server & DB Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 space-y-2">
          <div className="text-xs font-mono uppercase text-[#757761]">Mandi Geocoding Latency</div>
          <div className="text-2xl font-black font-mono text-[#121815] dark:text-white">18.4 ms</div>
          <div className="text-xs text-[#505445] dark:text-[#A0A493]">Local vegetable vendor quad cache</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 space-y-2">
          <div className="text-xs font-mono uppercase text-[#757761]">NextAuth v5 Session Health</div>
          <div className="text-2xl font-black font-mono text-emerald-500">100% OK</div>
          <div className="text-xs text-[#505445] dark:text-[#A0A493]">Proxy guard active via proxy.ts</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 space-y-2">
          <div className="text-xs font-mono uppercase text-[#757761]">Arena Daily Quests Logged</div>
          <div className="text-2xl font-black font-mono text-[#121815] dark:text-white">41,290</div>
          <div className="text-xs text-[#505445] dark:text-[#A0A493]">Zero sensor manipulation flags</div>
        </div>
      </div>
    </div>
  );
}
