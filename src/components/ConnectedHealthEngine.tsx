"use client";

import React, { useState } from "react";
import { Tabs } from "@heroui/react";
import {
  Activity,
  Heart,
  Flame,
  Zap,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Bell,
  Utensils,
  Moon,
  ShieldCheck,
  Link2,
  Unlink,
  AlertCircle,
  ArrowRightLeft,
  ChevronRight,
  Gauge,
  Footprints,
} from "lucide-react";
import { usePWA } from "@/hooks/usePWA";
import { useHealthSync, HealthProvider } from "@/hooks/useHealthSync";

export function ProviderAppIcon({
  id,
  className = "w-10 h-10",
}: {
  id: string;
  className?: string;
}) {
  switch (id) {
    case "applehealth":
      return (
        <div
          className={`${className} rounded-2xl bg-gradient-to-br from-[#FF2D55] to-[#D61439] flex items-center justify-center text-white shadow-md shadow-[#FF2D55]/25 shrink-0`}
          title="Apple Health"
        >
          <Heart className="w-5 h-5 fill-white text-white" />
        </div>
      );
    case "googlefit":
      return (
        <div
          className={`${className} rounded-2xl bg-gradient-to-br from-[#4285F4] to-[#1A73E8] flex items-center justify-center text-white shadow-md shadow-[#4285F4]/25 shrink-0 relative overflow-hidden`}
          title="Google Fit / Health Connect"
        >
          <Activity className="w-5 h-5 text-white" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#34A853]" />
        </div>
      );
    case "strava":
      return (
        <div
          className={`${className} rounded-2xl bg-gradient-to-br from-[#FC4C02] to-[#E34402] flex items-center justify-center text-white shadow-md shadow-[#FC4C02]/25 shrink-0`}
          title="Strava"
        >
          <Flame className="w-5 h-5 fill-white text-white" />
        </div>
      );
    case "whoop":
      return (
        <div
          className={`${className} rounded-2xl bg-gradient-to-br from-[#1E2621] to-[#0E1310] border border-[#f7fe72]/40 flex items-center justify-center text-[#f7fe72] shadow-md shadow-black/50 shrink-0`}
          title="WHOOP"
        >
          <Gauge className="w-5 h-5 text-[#f7fe72]" />
        </div>
      );
    default:
      return (
        <div
          className={`${className} rounded-2xl bg-[#1D2520] flex items-center justify-center text-white shrink-0`}
        >
          <Activity className="w-5 h-5" />
        </div>
      );
  }
}

interface ConnectedHealthEngineProps {
  onOpenLocalMeals?: () => void;
  className?: string;
}

export default function ConnectedHealthEngine({
  onOpenLocalMeals,
  className = "",
}: ConnectedHealthEngineProps) {
  const {
    triggerNotification,
    notificationPermission,
    requestNotificationPermission,
    triggerBothNotifications,
    openMobilePermissionDialog,
  } = usePWA();
  const {
    providers,
    hasAnyConnected,
    primaryProvider,
    isSyncing,
    syncStatusMsg,
    activeBurnExtraKcal,
    baselineCalories,
    totalDailyExpenditure,
    proteinTargetGrams,
    dailySteps,
    restingHeartRate,
    hrvMs,
    sleepFormatted,
    recoveryScore,
    activeWorkoutName,
    connectProvider,
    disconnectProvider,
    disconnectAll,
    syncAll,
  } = useHealthSync();

  const [activeTab, setActiveTab] = useState<"overview" | "diet_analysis" | "providers" | "notifications">("overview");

  // Calculated macro & diet adjustment based on synced metrics from the single chosen app
  const dietAnalysis = {
    baselineCalories,
    activeBurnExtra: activeBurnExtraKcal,
    totalDailyExpenditure,
    proteinTargetGrams,
    carbTargetGrams: hasAnyConnected ? 310 : 250,
    fatTargetGrams: hasAnyConnected ? 68 : 60,
    hydrationLiters: hasAnyConnected ? 3.6 : 2.5,
    recoveryWindow: hasAnyConnected
      ? `Next 45 minutes (Post-${activeWorkoutName ? activeWorkoutName.split(" ")[0] : "Workout"} Glycogen Prime)`
      : "Standard Routine (No Active Workout Detected)",
    recommendations: [
      {
        title: "Post-Workout Glycogen & Muscle Rebuild Bowl",
        protein: "42g Protein",
        calories: "520 kcal",
        cost: "₹95",
        ingredients: "Unpasteurized Fresh Sattu, Market Paneer Bhurji, Himalayan Rock Salt, Roasted Chana Whey",
        source: "Aggarwal Dairy & Kirana • 850m away",
        reason: hasAnyConnected
          ? `Compensates for your ${activeWorkoutName || "session"} and replenishes glycogen stores synced via ${primaryProvider?.name}.`
          : "Standard high-protein recovery meal for resistance training.",
      },
      {
        title: "Restorative Sleep & HRV Recovery Dinner",
        protein: "34g Protein",
        calories: "440 kcal",
        cost: "₹80",
        ingredients: "Sprouted Moong Khichdi, Steamed Spinach, Cold-Pressed Mustard Ghee, A2 Curd with Cumin",
        source: "Gupta Sabzi Mandi • 600m away",
        reason: hasAnyConnected
          ? `Rich in magnesium & tryptophan to support ${sleepFormatted || "7h+"} sleep cycle and ${hrvMs ? `${hrvMs}ms HRV` : "autonomic recovery"} logged via ${primaryProvider?.name}.`
          : "Restorative micro-nutrient dense dinner supporting sleep architecture.",
      },
    ],
  };

  const handleTestNotification = async (type: "macro" | "recovery" | "tier") => {
    if (notificationPermission !== "granted") {
      await requestNotificationPermission();
    }

    if (type === "macro") {
      await triggerNotification("Uchitatvam Nutrition Alert", {
        body: `Post-Workout Window: Consume 42g protein within 45 mins. Calories adjusted for ${primaryProvider?.name || "daily workout"}!`,
        icon: "/android-chrome-192x192.png",
      });
    } else if (type === "recovery") {
      await triggerNotification("Parasympathetic Recovery Alert", {
        body: `HRV baseline steady at ${hrvMs || 70}ms. 5-min Box Breathing session recommended at 9:30 PM.`,
        icon: "/android-chrome-192x192.png",
      });
    } else {
      await triggerNotification("Leaderboard Rival Watch", {
        body: "Contender @Rohan_K has logged a 10km run and is 80 XP ahead of you in Sector 4!",
        icon: "/android-chrome-192x192.png",
      });
    }
  };

  return (
    <div className={`w-full bg-[#121815] border border-[#757761]/35 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#f7fe72]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-1.5 rounded-lg bg-[#f7fe72]/20 text-[#f7fe72]">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Biometric Health &amp; Fitness Sync Hub
            </h2>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border font-mono transition-colors ${
                hasAnyConnected
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/30"
              }`}
            >
              {hasAnyConnected
                ? `● ${primaryProvider?.name.toUpperCase()} (100% TELEMETRY SYNCED)`
                : "NO APP CONNECTED (CHOOSE ONE)"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
            Choose the single fitness app you use. Whichever app you pick (Google Fit, Apple Health, Strava, or Whoop) automatically supplies <strong>all your data</strong>: daily steps, active calorie burn, heart rate, HRV, and sleep architecture. No fragmentation, no need to connect multiple apps.
          </p>
        </div>

        {/* Sync Controls & Test Alert */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {hasAnyConnected && (
            <button
              onClick={syncAll}
              disabled={isSyncing}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-[#f7fe72]" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync Telemetry"}</span>
            </button>
          )}

          <button
            onClick={() => handleTestNotification("macro")}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-slate-200 font-bold text-xs active:scale-95 transition-all cursor-pointer"
            title="Send test alert notification"
          >
            <Bell className="w-3.5 h-3.5 text-[#f7fe72]" />
            <span>PWA Alert</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {syncStatusMsg && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{syncStatusMsg}</span>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono">LIVE UPDATE</span>
        </div>
      )}

      {/* HeroUI Navigation Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as "overview" | "diet_analysis" | "providers" | "notifications")}
        className="w-full mt-5"
      >
        <Tabs.ListContainer className="overflow-x-auto pb-2 border-b border-white/10">
          <Tabs.List aria-label="Connected Health Engine Navigation" className="flex items-center gap-1.5 p-1 bg-[#121815] border border-white/10 rounded-xl">
            <Tabs.Tab id="overview" className="cursor-pointer">
              <span>Telemetry Overview {hasAnyConnected ? `(${primaryProvider?.name})` : "(Choose App)"}</span>
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="diet_analysis" className="cursor-pointer">
              <span>Adaptive Diet &amp; Macros ({hasAnyConnected ? `+${activeBurnExtraKcal} kcal` : "Baseline"})</span>
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="providers" className="cursor-pointer">
              <span>{hasAnyConnected ? `Switch App (${primaryProvider?.name} Active)` : "Choose Fitness App"}</span>
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="notifications" className="cursor-pointer">
              <span>PWA Service Worker Alerts</span>
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        {/* Tab 1: Overview */}
        <Tabs.Panel id="overview" className="mt-5 space-y-6 animate-in fade-in duration-300">
          {/* STATE A: NO TRACKER CONNECTED -> Streamlined 1-Choice App Picker */}
          {!hasAnyConnected && (
            <div className="p-5 sm:p-7 rounded-3xl bg-[#0B0E0C] border border-[#f7fe72]/30 text-white relative overflow-hidden shadow-2xl">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1 rounded-md bg-[#f7fe72]/20 text-[#f7fe72]">
                    <Zap className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-mono font-bold text-[#f7fe72] uppercase tracking-wider">
                    SINGLE-APP SYNC ARCHITECTURE
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Which single fitness app do you use?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                  Every modern fitness app already captures all your health metrics. Select <strong>the one app you actually use</strong> — it immediately pulls all your daily steps, active calorie burn, heart rate, HRV, and sleep. You never need to connect multiple apps.
                </p>
              </div>

              {/* 4 Modern Compact Tracker Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5">
                {providers.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-[#121815] hover:bg-[#161F1A] border border-[#757761]/35 hover:border-[#f7fe72]/70 transition-all duration-200 flex flex-col justify-between group hover:shadow-xl hover:shadow-black/60"
                  >
                    <div>
                      {/* Top Row: Authentic App Icon + Category Tag */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <ProviderAppIcon id={p.id} className="w-10 h-10" />
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                          {p.category.split(" ")[0]}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-base group-hover:text-[#f7fe72] transition-colors leading-snug">
                        {p.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>

                      {/* Visual Metric Coverage Strip (No walls of text) */}
                      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10" title="Steps Telemetry">
                          <Footprints className="w-3 h-3 text-[#4285F4]" />
                          <span>Steps</span>
                        </span>
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10" title="Active Calorie Burn">
                          <Flame className="w-3 h-3 text-[#FC4C02]" />
                          <span>Burn</span>
                        </span>
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10" title="Heart Rate & HRV">
                          <Heart className="w-3 h-3 text-[#FA2D48]" />
                          <span>HR</span>
                        </span>
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10" title="Sleep Architecture">
                          <Moon className="w-3 h-3 text-[#A855F7]" />
                          <span>Sleep</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => connectProvider(p.id)}
                      disabled={isSyncing}
                      className="mt-3.5 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] font-bold text-xs hover:brightness-110 active:scale-98 transition-all shadow-md shadow-[#f7fe72]/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Link2 className="w-3.5 h-3.5 text-[#0B0E0C]" />
                      <span>Use {p.name.split(" ")[0]} Only</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Secure read-only connection • Zero passwords stored • Switch or revoke anytime</span>
                </span>
                <span className="text-[11px] text-[#f7fe72] font-mono font-semibold">
                  Only 1 app needed
                </span>
              </div>
            </div>
          )}

          {/* STATE B: APP CONNECTED -> Clean Single-App Showcase */}
          {hasAnyConnected && primaryProvider && (
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#121815] via-[#14231b] to-[#121815] border border-emerald-500/40 text-white relative overflow-hidden shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-white/10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10B981]" />
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      ALL TELEMETRY POWERED BY {primaryProvider.name.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      100% UNIFIED DATA STREAM
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <ProviderAppIcon id={primaryProvider.id} className="w-11 h-11" />
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        {primaryProvider.name} Live Biometric Stream
                      </h3>
                      <p className="text-xs text-slate-300">
                        All steps, burn, heart rate, and sleep architecture streamed from this single app • Last synced {primaryProvider.lastSync}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0 flex-wrap">
                  <button
                    onClick={syncAll}
                    disabled={isSyncing}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-[#f7fe72]" : ""}`} />
                    <span>Sync Now</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("providers")}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 text-[#f7fe72]" />
                    <span>Switch App</span>
                  </button>
                  <button
                    onClick={() => disconnectProvider(primaryProvider.id)}
                    className="px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Disconnect this tracker"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>

              {/* Active Stream Live Metrics Row - All 4 metrics populated from this one app */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5">
                {primaryProvider.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between"
                  >
                    <span className="text-[11px] text-slate-400 font-mono uppercase font-semibold truncate">
                      {metric.label}
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-white font-mono my-1 truncate">
                      {metric.value}
                    </div>
                    <span className="text-[11px] text-emerald-400 font-mono line-clamp-1">
                      ● {metric.sub}
                    </span>
                  </div>
                ))}
              </div>

              {/* 1-Click Tracker Switcher Bar */}
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-[#f7fe72]" />
                  <span>Changed your fitness app? Switch to another tracker with 1 click:</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {providers
                    .filter((p) => p.id !== primaryProvider.id)
                    .map((p) => (
                      <button
                        key={p.id}
                        onClick={() => connectProvider(p.id)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/15 text-slate-200 text-xs font-medium transition-all cursor-pointer hover:text-white"
                      >
                        Switch to {p.name.split(" ")[0]}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Unified 4 Telemetry KPI Cards - Sourced 100% from the single chosen app */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            
            {/* Card 1: Active Burn Today */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Active Burn Today</span>
                  <Flame className="w-4 h-4 text-[#f7fe72]" />
                </div>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  {hasAnyConnected ? (
                    <>
                      +{activeBurnExtraKcal} <span className="text-xs text-[#f7fe72] font-sans">kcal</span>
                    </>
                  ) : (
                    <span className="text-slate-500 text-lg">-- kcal</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  {hasAnyConnected ? (
                    <span className="text-emerald-400">● Synced via {primaryProvider?.name}</span>
                  ) : (
                    <span>Awaiting app connection</span>
                  )}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                {hasAnyConnected ? (
                  <span>Workout: {activeWorkoutName || "Cardio / Strength"}</span>
                ) : (
                  <span>Pick any 1 app above to stream</span>
                )}
              </div>
            </div>

            {/* Card 2: Daily Steps */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Daily Steps</span>
                  <TrendingUp className="w-4 h-4 text-[#4285F4]" />
                </div>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  {hasAnyConnected ? (
                    (dailySteps || 10450).toLocaleString()
                  ) : (
                    <span className="text-slate-500 text-lg">-- steps</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  {hasAnyConnected ? (
                    <span className="text-emerald-400">● Synced via {primaryProvider?.name}</span>
                  ) : (
                    <span>Awaiting app connection</span>
                  )}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                {hasAnyConnected ? (
                  <span>Target: 10,000 steps (100%+ Met)</span>
                ) : (
                  <span>Pick any 1 app above to stream</span>
                )}
              </div>
            </div>

            {/* Card 3: Heart Rate & HRV Autonomic */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Heart Rate &amp; HRV</span>
                  <Heart className="w-4 h-4 text-[#FA2D48]" />
                </div>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  {hasAnyConnected ? (
                    <>
                      {restingHeartRate || 54} <span className="text-xs text-slate-400 font-sans">bpm</span> • {hrvMs || 70} <span className="text-xs text-slate-400 font-sans">ms</span>
                    </>
                  ) : (
                    <span className="text-slate-500 text-lg">-- bpm / -- ms</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  {hasAnyConnected ? (
                    <span className="text-emerald-400">● Synced via {primaryProvider?.name}</span>
                  ) : (
                    <span>Awaiting app connection</span>
                  )}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                {hasAnyConnected ? (
                  <span>Autonomic Recovery: {recoveryScore || 88}%</span>
                ) : (
                  <span>Pick any 1 app above to stream</span>
                )}
              </div>
            </div>

            {/* Card 4: Sleep Architecture */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Sleep Architecture</span>
                  <Moon className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono mt-1">
                  {hasAnyConnected ? (
                    sleepFormatted || "7h 24m"
                  ) : (
                    <span className="text-slate-500 text-lg">-- h -- m</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  {hasAnyConnected ? (
                    <span className="text-emerald-400">● Synced via {primaryProvider?.name}</span>
                  ) : (
                    <span>Awaiting app connection</span>
                  )}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                {hasAnyConnected ? (
                  <span>Deep Sleep: ~1h 45m Restorative</span>
                ) : (
                  <span>Pick any 1 app above to stream</span>
                )}
              </div>
            </div>
          </div>
        </Tabs.Panel>

        {/* Tab 2: Adaptive Diet & Macros */}
        <Tabs.Panel id="diet_analysis" className="mt-5 space-y-5 animate-in fade-in duration-300">
          
          {/* Telemetry Status Banner */}
          {hasAnyConnected ? (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Live Biometric Diet Calibration Active:</strong> Calibrated exclusively with your {primaryProvider?.name}. Active workout burn (+{activeBurnExtraKcal} kcal) and {proteinTargetGrams}g protein target dynamically applied to your daily Kirana grocery cart.
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 shrink-0 self-start sm:self-auto">
                100% READY
              </span>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Baseline Diet Mode:</strong> Choose your single fitness tracker to automatically calculate active workout burn (+490 to +540 kcal) and elevate your protein target.
                </span>
              </div>
              <button
                onClick={() => setActiveTab("overview")}
                className="px-3 py-1.5 rounded-lg bg-amber-400 text-[#0B0E0C] font-black text-xs shrink-0 hover:brightness-110 cursor-pointer"
              >
                Choose Your Tracker
              </button>
            </div>
          )}

          {/* Caloric Expenditure Formula */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#143427] to-[#121815] border border-emerald-500/30 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-[#f7fe72] uppercase tracking-wider font-mono">
                  BIOMETRIC METABOLIC CALCULATION
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Dynamic Energy Budget: {totalDailyExpenditure.toLocaleString()} kcal
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-black/40 text-slate-300 border border-white/10">
                  Base: {baselineCalories} kcal
                </span>
                <span className="text-[#f7fe72] font-black">+</span>
                <span className={`px-2.5 py-1 rounded border ${
                  activeBurnExtraKcal > 0
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-white/5 text-slate-400 border-white/10"
                }`}>
                  Burn: +{activeBurnExtraKcal} kcal
                </span>
              </div>
            </div>

            {/* Macro targets adjusted */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-center">
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Protein Target</span>
                <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">
                  {proteinTargetGrams}g
                </div>
                <span className="text-[10px] text-slate-400">
                  {hasAnyConnected ? "+25g for workout repair" : "Standard baseline"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Carbohydrates</span>
                <div className="text-xl font-black text-[#f7fe72] font-mono mt-0.5">
                  {dietAnalysis.carbTargetGrams}g
                </div>
                <span className="text-[10px] text-slate-400">
                  {hasAnyConnected ? "Glycogen recharge" : "Daily maintenance"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Healthy Fats</span>
                <div className="text-xl font-black text-white font-mono mt-0.5">
                  {dietAnalysis.fatTargetGrams}g
                </div>
                <span className="text-[10px] text-slate-400">Hormonal balance</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Hydration + Salts</span>
                <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">
                  {dietAnalysis.hydrationLiters} L
                </div>
                <span className="text-[10px] text-slate-400">Electrolyte retention</span>
              </div>
            </div>
          </div>

          {/* Tailored Kirana Meals Based On Biometrics */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-[#f7fe72]" />
              <span>Tailored Hyper-Local Kirana Meals for Today&apos;s Burn</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dietAnalysis.recommendations.map((meal, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#f7fe72]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold text-white text-sm sm:text-base">{meal.title}</h5>
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono shrink-0">
                        {meal.cost}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs font-mono text-slate-300">
                      <span className="text-[#f7fe72] font-bold">{meal.protein}</span>
                      <span>•</span>
                      <span>{meal.calories}</span>
                      <span>•</span>
                      <span className="text-emerald-400">{meal.source}</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 font-medium">
                      <strong>Ingredients:</strong> {meal.ingredients}
                    </p>

                    <p className="text-[11px] text-slate-400 mt-2 italic bg-black/30 p-2 rounded-lg border border-white/5">
                      💡 {meal.reason}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 font-mono">100% Real Whole Food</span>
                    {onOpenLocalMeals ? (
                      <button
                        onClick={onOpenLocalMeals}
                        className="text-xs font-bold text-[#f7fe72] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>View in Nutrition Engine</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Tabs.Panel>

        {/* Tab 3: Choose / Switch Fitness App */}
        <Tabs.Panel id="providers" className="mt-5 space-y-4 animate-in fade-in duration-300">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Single-App Architecture:</strong> All your data comes from whichever 1 app you choose. Switching apps updates all your biometrics immediately.
              </span>
            </div>
            {hasAnyConnected && (
              <button
                onClick={disconnectAll}
                className="text-xs font-medium text-slate-400 hover:text-rose-400 cursor-pointer shrink-0"
              >
                Disconnect App
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {providers.map((provider: HealthProvider) => {
              const isPrimary = provider.id === primaryProvider?.id;
              return (
                <div
                  key={provider.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isPrimary
                      ? "bg-gradient-to-br from-[#14231b] to-[#121815] border-emerald-500/40 shadow-lg"
                      : "bg-[#121815] hover:bg-[#161F1A] border-white/10 hover:border-white/25"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <ProviderAppIcon id={provider.id} className="w-9 h-9" />
                        <div>
                          <h4 className="font-bold text-white text-sm">{provider.name}</h4>
                          <span className="text-[11px] text-slate-400">{provider.category}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono ${
                          isPrimary
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "bg-white/5 text-slate-400 border-white/10"
                        }`}
                      >
                        {isPrimary ? "ACTIVE" : "READY"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {provider.description}
                    </p>

                    {/* Compact Visual Telemetry Indicators */}
                    <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-white/5 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                        <Footprints className="w-3 h-3 text-[#4285F4]" />
                        <span>Steps</span>
                      </span>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                        <Flame className="w-3 h-3 text-[#FC4C02]" />
                        <span>Burn</span>
                      </span>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                        <Heart className="w-3 h-3 text-[#FA2D48]" />
                        <span>HR</span>
                      </span>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                        <Moon className="w-3 h-3 text-[#A855F7]" />
                        <span>Sleep</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {isPrimary ? `Synced: ${provider.lastSync}` : "Ready to connect"}
                    </span>

                    {isPrimary ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => disconnectProvider(provider.id)}
                          className="px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold cursor-pointer"
                        >
                          Disconnect
                        </button>
                        <button
                          onClick={syncAll}
                          disabled={isSyncing}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                          <span>Sync</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => connectProvider(provider.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] text-xs font-black shadow hover:brightness-110 active:scale-95 cursor-pointer inline-flex items-center gap-1"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>{hasAnyConnected ? `Switch to ${provider.name.split(" ")[0]}` : `Choose ${provider.name.split(" ")[0]}`}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Tabs.Panel>

        {/* Tab 4: PWA Service Worker Alerts */}
        <Tabs.Panel id="notifications" className="mt-5 space-y-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-[#f7fe72]/20 text-[#f7fe72]">
                  <Bell className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    PWA Service Worker Notification System
                  </h4>
                  <p className="text-xs text-slate-300">
                    Background push alerts and workout sync reminders delivered directly through your browser service worker.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border font-mono ${
                    notificationPermission === "granted"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}
                >
                  {notificationPermission === "granted" ? "PERMISSIONS GRANTED (BOTH STREAMS)" : "PERMISSION REQUIRED"}
                </span>
                <button
                  onClick={openMobilePermissionDialog}
                  className="px-3 py-1 rounded-xl text-xs font-bold font-mono text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-all cursor-pointer"
                >
                  Policy Dialog
                </button>
              </div>
            </div>

            {/* Test Both Dual Stream Button */}
            <div className="mt-4 p-3.5 rounded-2xl bg-black/40 border border-[#757761]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white text-xs block">
                  Dual-Stream Verification (Biometrics + Daily Quests)
                </span>
                <span className="text-[11px] text-[#A0A493]">
                  Dispatches both Channel 1 (Recovery HRV Alert) and Channel 2 (Mandi Produce Harvest) to your notification tray.
                </span>
              </div>
              <button
                onClick={triggerBothNotifications}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold font-mono text-[#0B0E0C] bg-gradient-to-r from-[#34d399] to-[#2ecc71] hover:brightness-110 transition-all shrink-0 cursor-pointer shadow-sm"
              >
                Trigger Both Alerts Now
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleTestNotification("macro")}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Glycogen Post-Workout Alert</span>
                  <Utensils className="w-3.5 h-3.5 text-[#f7fe72]" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Alerts user when post-workout glycogen recharge window opens for Sattu and Paneer.
                </p>
                <span className="text-[10px] text-[#f7fe72] font-mono mt-2 block group-hover:underline">
                  Send Test Notification →
                </span>
              </button>

              <button
                onClick={() => handleTestNotification("recovery")}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Parasympathetic Wind-down</span>
                  <Moon className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Notifies user at 9:30 PM to begin 5-min Box Breathing based on HRV recovery metrics.
                </p>
                <span className="text-[10px] text-[#f7fe72] font-mono mt-2 block group-hover:underline">
                  Send Test Notification →
                </span>
              </button>

              <button
                onClick={() => handleTestNotification("tier")}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Arena Contender Alert</span>
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Live alert when another user logs a workout and moves up in the Season 4 leaderboard.
                </p>
                <span className="text-[10px] text-[#f7fe72] font-mono mt-2 block group-hover:underline">
                  Send Test Notification →
                </span>
              </button>
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
