"use client";

import React, { useState } from "react";
import {
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Zap,
} from "lucide-react";

interface SyncDevicePipe {
  id: string;
  name: string;
  protocol: string;
  status: "Operational" | "Degraded" | "Investigating";
  uptime: string;
  latency: number; // in milliseconds
  sampleRate: string;
}

const INITIAL_PIPES: SyncDevicePipe[] = [
  {
    id: "apple-health",
    name: "Apple HealthKit",
    protocol: "Native HealthKit SDK / CoreMotion",
    status: "Operational",
    uptime: "99.98%",
    latency: 14,
    sampleRate: "1 Hz Heart Rate & HRV",
  },
  {
    id: "whoop-cloud",
    name: "WHOOP 4.0 BLE / Cloud",
    protocol: "WebSocket Strain API v2",
    status: "Operational",
    uptime: "99.92%",
    latency: 28,
    sampleRate: "Raw 52Hz PPG Telemetry",
  },
  {
    id: "garmin-connect",
    name: "Garmin Connect SDK",
    protocol: "Garmin Health API Webhooks",
    status: "Operational",
    uptime: "99.95%",
    latency: 19,
    sampleRate: "Push Events & Activity Blocks",
  },
  {
    id: "oura-ring",
    name: "Oura Gen3 Ring API",
    protocol: "REST OAuth 2.0 PKCE",
    status: "Operational",
    uptime: "99.89%",
    latency: 34,
    sampleRate: "Sleep Hypnograms & HRV Trends",
  },
  {
    id: "polar-flow",
    name: "Polar Flow Webhooks",
    protocol: "Polar Open AccessLink",
    status: "Operational",
    uptime: "99.91%",
    latency: 22,
    sampleRate: "Cardio Load & Recovery Pro",
  },
];

const LATENCY_THRESHOLD_MS = 100;

export default function AdminAnalyticsPage() {
  const [pipes, setPipes] = useState<SyncDevicePipe[]>(INITIAL_PIPES);

  const degradedPipes = pipes.filter((p) => p.latency > LATENCY_THRESHOLD_MS);
  const isSyncHealthy = degradedPipes.length === 0;

  const handleSimulateSpike = (pipeId: string, spikeLatency: number) => {
    setPipes((prev) =>
      prev.map((p) =>
        p.id === pipeId
          ? {
              ...p,
              latency: spikeLatency,
              status: spikeLatency > LATENCY_THRESHOLD_MS ? "Degraded" : "Operational",
            }
          : p
      )
    );
  };

  const handleResetOptimal = () => {
    setPipes(INITIAL_PIPES);
  };

  const handleSimulateMultipleDegradation = () => {
    setPipes((prev) =>
      prev.map((p) => {
        if (p.id === "whoop-cloud") {
          return { ...p, latency: 148, status: "Degraded" };
        }
        if (p.id === "oura-ring") {
          return { ...p, latency: 122, status: "Degraded" };
        }
        return p;
      })
    );
  };

  const updateIndividualLatency = (id: string, delta: number) => {
    setPipes((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextVal = Math.max(5, p.latency + delta);
          return {
            ...p,
            latency: nextVal,
            status: nextVal > LATENCY_THRESHOLD_MS ? "Degraded" : "Operational",
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
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

        {/* Proactive Simulator Quick Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleResetOptimal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#121815] dark:text-[#CBD2C7] bg-white dark:bg-[#18211C] border border-[#757761]/35 hover:bg-[#757761]/15 transition-colors cursor-pointer"
            title="Reset all latencies to baseline optimal"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Baseline (&lt;35ms)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSimulateSpike("whoop-cloud", 145)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-500/30 transition-colors cursor-pointer"
            title="Inject simulated latency spike on WHOOP pipe"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulate Spike (145ms)</span>
          </button>
        </div>
      </div>

      {/* DYNAMIC PROACTIVE SYNC HEALTH VISUAL INDICATOR BANNER */}
      <div
        className={`p-5 rounded-2xl border transition-all duration-300 shadow-sm ${
          isSyncHealthy
            ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-950 dark:text-emerald-100"
            : "bg-amber-500/15 border-amber-500/60 text-amber-950 dark:text-amber-100 shadow-amber-500/10"
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`p-2.5 rounded-xl shrink-0 mt-0.5 border ${
                isSyncHealthy
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-300"
                  : "bg-amber-500/25 border-amber-500/60 text-amber-600 dark:text-amber-300 animate-pulse"
              }`}
            >
              {isSyncHealthy ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isSyncHealthy
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/30 text-amber-800 dark:text-amber-200 border border-amber-500/50"
                  }`}
                >
                  Sync Health: {isSyncHealthy ? "Optimal" : "Degraded (SLA Exceeded)"}
                </span>
                <span className="text-xs font-mono opacity-60">·</span>
                <span className="text-xs font-mono opacity-80 font-semibold">
                  Threshold: {LATENCY_THRESHOLD_MS}ms SLA
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {isSyncHealthy
                  ? "All 5 wearable sync ingestion pipes are responding within the nominal 100ms SLA budget. Heart rate variability (HRV), sleep staging, and active workout tonnage are streaming smoothly with zero packet buffering."
                  : `Proactive Watchdog Alert: ${degradedPipes
                      .map((p) => `${p.name} (${p.latency}ms)`)
                      .join(
                        ", "
                      )} exceeded the 100ms threshold limit! Automatic retry queue engaged to protect live leaderboard validation.`}
              </p>
            </div>
          </div>

          {/* Quick Trigger Buttons */}
          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-[#757761]/20">
            {!isSyncHealthy ? (
              <button
                type="button"
                onClick={handleResetOptimal}
                className="w-full md:w-auto px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0B0E0C] text-[#f7fe72] hover:bg-[#18211C] transition-colors shadow-xs cursor-pointer"
              >
                Acknowledge &amp; Restore
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSimulateMultipleDegradation}
                className="w-full md:w-auto px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15 border border-[#757761]/25 transition-colors cursor-pointer"
              >
                Test Alert Trigger →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Wearable Sync Status Cards */}
      <div className="rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#757761]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#f7fe72]" />
            <h2 className="text-sm font-bold text-[#121815] dark:text-white">
              Wearable Device Synchronization Feeds
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#505445] dark:text-[#A0A493]">
              Active Pipes: 5/5
            </span>
            <span
              className={`flex items-center gap-1.5 font-bold ${
                isSyncHealthy ? "text-emerald-500" : "text-amber-500"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSyncHealthy
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-amber-500 animate-ping"
                }`}
              />
              {isSyncHealthy ? "Nominal Ingestion" : "Latency Warning Active"}
            </span>
          </div>
        </div>

        {/* 5 Sync Pipes List */}
        <div className="divide-y divide-[#757761]/15">
          {pipes.map((dev) => {
            const isPipeExceeded = dev.latency > LATENCY_THRESHOLD_MS;
            return (
              <div
                key={dev.id}
                className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-colors ${
                  isPipeExceeded
                    ? "bg-amber-500/10 dark:bg-amber-950/20"
                    : "hover:bg-[#F4F6F5]/50 dark:hover:bg-[#18211C]/50"
                }`}
              >
                {/* Pipe Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#121815] dark:text-white">
                      {dev.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#757761] hidden sm:inline">
                      ({dev.protocol})
                    </span>
                  </div>
                  <div className="text-[11px] text-[#505445] dark:text-[#A0A493]">
                    {dev.sampleRate}
                  </div>
                </div>

                {/* Right side metrics & latency controls */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-between md:justify-end">
                  {/* Uptime */}
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-[#757761] block">
                      Uptime
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#121815] dark:text-[#CBD2C7]">
                      {dev.uptime}
                    </span>
                  </div>

                  {/* Interactive Latency Indicator with threshold color shift */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-[#757761] block">
                        Latency
                      </span>
                      <span
                        className={`font-mono text-xs sm:text-sm font-black tabular-nums ${
                          isPipeExceeded
                            ? "text-red-500 dark:text-red-400"
                            : dev.latency > 60
                            ? "text-amber-500"
                            : "text-[#7A5A00] dark:text-[#f7fe72]"
                        }`}
                      >
                        {dev.latency}ms
                      </span>
                    </div>

                    {/* Latency Adjusters */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => updateIndividualLatency(dev.id, 25)}
                        className="px-1.5 py-0.2 rounded bg-[#757761]/20 hover:bg-[#757761]/35 font-mono text-[9px] text-[#121815] dark:text-white cursor-pointer"
                        title="Increase latency (+25ms)"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => updateIndividualLatency(dev.id, -25)}
                        className="px-1.5 py-0.2 rounded bg-[#757761]/20 hover:bg-[#757761]/35 font-mono text-[9px] text-[#121815] dark:text-white cursor-pointer"
                        title="Decrease latency (-25ms)"
                      >
                        -
                      </button>
                    </div>
                  </div>

                  {/* Status Pill Badge */}
                  <div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase border ${
                        isPipeExceeded
                          ? "bg-red-500/20 text-red-600 dark:text-red-300 border-red-500/40 animate-pulse"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      }`}
                    >
                      {isPipeExceeded ? (
                        <>
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          <span>&gt;100ms Warning</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{dev.status}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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
