"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import { Tabs, Dropdown, Button, Label } from "@heroui/react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  Flame,
  Footprints,
  Moon,
  HeartPulse,
  Activity,
  TrendingUp,
  ArrowRight,
  Zap,
  ChevronDown,
  Check,
} from "lucide-react";
import { useHealthSync, DailyActivityRecord } from "@/hooks/useHealthSync";

const emptySubscribe = () => () => {};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number | string;
    color: string;
    dataKey: string;
  }>;
  label?: string;
  activeMetricView?: "activity" | "sleep_hrv" | "recovery";
  historyData: DailyActivityRecord[];
}

function CustomTooltip({ active, payload, label, historyData }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const currentDayData = historyData.find(
    (d) => d.day === label || d.dateLabel === label
  );

  return (
    <div className="bg-[#0B0E0C]/95 backdrop-blur-md border border-[#757761]/40 rounded-xl p-3.5 shadow-2xl text-xs space-y-2 min-w-[210px]">
      <div className="flex items-center justify-between border-b border-[#757761]/25 pb-1.5">
        <span className="font-mono font-bold text-white text-sm">
          {currentDayData?.dateLabel || label}
        </span>
        {currentDayData?.isToday && (
          <span className="text-[10px] font-mono font-black uppercase text-[#f7fe72] bg-[#757761]/30 px-1.5 py-0.5 rounded">
            Today
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3">
            <span className="text-[#A0A493] flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}:</span>
            </span>
            <span className="font-mono font-bold text-white">
              {typeof entry.value === "number"
                ? entry.dataKey === "sleepHours"
                  ? `${entry.value.toFixed(1)} hrs`
                  : entry.dataKey === "hrvMs"
                  ? `${entry.value} ms`
                  : entry.dataKey === "recoveryScore"
                  ? `${entry.value}%`
                  : entry.dataKey === "steps"
                  ? `${entry.value.toLocaleString()} steps`
                  : `${entry.value} kcal`
                : entry.value}
            </span>
          </div>
        ))}
      </div>

      {currentDayData?.workoutTitle && (
        <div className="pt-2 border-t border-[#757761]/25">
          <span className="text-[10px] text-[#A0A493] uppercase font-mono block">
            Workout Telemetry
          </span>
          <span className="text-xs font-semibold text-[#f7fe72] flex items-center gap-1 mt-0.5">
            <Zap className="w-3 h-3 text-[#f7fe72] shrink-0" />
            <span className="truncate">{currentDayData.workoutTitle}</span>
          </span>
        </div>
      )}
    </div>
  );
}

export default function FitnessInsightsChart() {
  const {
    hasAnyConnected,
    primaryProvider,
    sevenDayHistory,
    providers,
    connectProvider,
    isSyncing,
  } = useHealthSync();

  const [activeMetricView, setActiveMetricView] = useState<"activity" | "sleep_hrv" | "recovery">("activity");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(6); // Default to today (last index)

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Compute 7-day aggregate metrics
  const stats = useMemo(() => {
    if (!sevenDayHistory || sevenDayHistory.length === 0) {
      return {
        totalBurn: 0,
        avgSteps: 0,
        avgSleep: 0,
        avgHrv: 0,
        avgRecovery: 0,
        completedWorkouts: 0,
      };
    }

    const totalBurn = sevenDayHistory.reduce((sum, d) => sum + d.activeBurnKcal, 0);
    const totalSteps = sevenDayHistory.reduce((sum, d) => sum + d.steps, 0);
    const totalSleep = sevenDayHistory.reduce((sum, d) => sum + d.sleepHours, 0);
    const totalHrv = sevenDayHistory.reduce((sum, d) => sum + d.hrvMs, 0);
    const totalRecovery = sevenDayHistory.reduce((sum, d) => sum + d.recoveryScore, 0);

    return {
      totalBurn,
      avgSteps: Math.round(totalSteps / sevenDayHistory.length),
      avgSleep: parseFloat((totalSleep / sevenDayHistory.length).toFixed(1)),
      avgHrv: Math.round(totalHrv / sevenDayHistory.length),
      avgRecovery: Math.round(totalRecovery / sevenDayHistory.length),
      completedWorkouts: sevenDayHistory.length,
    };
  }, [sevenDayHistory]);

  const selectedDay = sevenDayHistory[selectedDayIndex] || sevenDayHistory[sevenDayHistory.length - 1];

  return (
    <section
      id="fitness-insights-module"
      aria-label="7-Day Fitness Insights"
      className="bg-[#121815] rounded-3xl border border-[#757761]/30 shadow-2xl p-5 sm:p-7 mb-8 transition-all scroll-mt-20 sm:scroll-mt-24"
    >
      {/* Top Header: Title, Active Provider Badge, and View Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#757761]/25">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f7fe72] bg-[#757761]/20 border border-[#757761]/35 px-2.5 py-0.5 rounded">
              Continuous Biometrics
            </span>
            <span className="text-xs text-[#A0A493] font-mono">
              Last 7 Days Rolling Window
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-[#f7fe72]" />
            <span>Fitness &amp; Biometric Insights</span>
          </h2>
          <p className="text-xs text-[#A0A493]">
            Comprehensive multi-stream visualization of energy expenditure, daily locomotion cadence, autonomic HRV, and sleep architecture.
          </p>
        </div>

        {/* View Switcher Controls (HeroUI Dropdown on Mobile + HeroUI Tabs on Desktop) */}
        <div className="self-start lg:self-center">
          {/* Mobile HeroUI Dropdown */}
          <div className="sm:hidden">
            <Dropdown>
              <Button
                variant="secondary"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#E2E7DE] bg-[#0B0E0C] hover:bg-black/60 border border-[#757761]/40 rounded-xl cursor-pointer"
                aria-label="Select Metric View"
              >
                {activeMetricView === "activity" ? (
                  <Flame className="w-3.5 h-3.5 text-[#f7fe72]" />
                ) : activeMetricView === "sleep_hrv" ? (
                  <Moon className="w-3.5 h-3.5 text-[#f7fe72]" />
                ) : (
                  <HeartPulse className="w-3.5 h-3.5 text-[#f7fe72]" />
                )}
                <span>
                  {activeMetricView === "activity"
                    ? "Burn & Steps"
                    : activeMetricView === "sleep_hrv"
                    ? "Sleep & HRV"
                    : "Readiness Score"}
                </span>
                <ChevronDown className="w-3 h-3 text-[#A0A594]" />
              </Button>
              <Dropdown.Popover className="min-w-[190px] z-[70] p-1.5 bg-[#121815]/95 backdrop-blur-xl border border-[#757761]/40 rounded-2xl shadow-2xl">
                <Dropdown.Menu
                  aria-label="Select Metric View"
                  selectionMode="single"
                  selectedKeys={new Set([activeMetricView])}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    if (selected) setActiveMetricView(String(selected) as "activity" | "sleep_hrv" | "recovery");
                  }}
                  className="space-y-1 outline-none"
                >
                  <Dropdown.Item
                    id="activity"
                    textValue="Burn & Steps"
                    className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer outline-none data-[selected=true]:bg-[#f7fe72]/15 data-[selected=true]:text-[#f7fe72]"
                  >
                    <div className="flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-[#f7fe72]" />
                      <Label className="text-xs font-semibold">Burn &amp; Steps</Label>
                    </div>
                    {activeMetricView === "activity" && <Check className="w-3.5 h-3.5 text-[#f7fe72]" />}
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="sleep_hrv"
                    textValue="Sleep & HRV"
                    className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer outline-none data-[selected=true]:bg-[#f7fe72]/15 data-[selected=true]:text-[#f7fe72]"
                  >
                    <div className="flex items-center gap-2">
                      <Moon className="w-3.5 h-3.5 text-[#f7fe72]" />
                      <Label className="text-xs font-semibold">Sleep &amp; HRV</Label>
                    </div>
                    {activeMetricView === "sleep_hrv" && <Check className="w-3.5 h-3.5 text-[#f7fe72]" />}
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="recovery"
                    textValue="Readiness Score"
                    className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer outline-none data-[selected=true]:bg-[#f7fe72]/15 data-[selected=true]:text-[#f7fe72]"
                  >
                    <div className="flex items-center gap-2">
                      <HeartPulse className="w-3.5 h-3.5 text-[#f7fe72]" />
                      <Label className="text-xs font-semibold">Readiness Score</Label>
                    </div>
                    {activeMetricView === "recovery" && <Check className="w-3.5 h-3.5 text-[#f7fe72]" />}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>

          {/* Desktop HeroUI Tabs */}
          <div className="hidden sm:block">
            <Tabs
              selectedKey={activeMetricView}
              onSelectionChange={(key) => setActiveMetricView(key as "activity" | "sleep_hrv" | "recovery")}
              className="w-auto"
            >
              <Tabs.ListContainer className="p-0 bg-transparent">
                <Tabs.List aria-label="Metric views" className="flex items-center gap-1.5 p-1 bg-[#0B0E0C] border border-[#757761]/35 rounded-xl">
                  <Tabs.Tab id="activity" className="cursor-pointer">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Burn &amp; Steps</span>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="sleep_hrv" className="cursor-pointer">
                    <Moon className="w-3.5 h-3.5" />
                    <span>Sleep &amp; HRV</span>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="recovery" className="cursor-pointer">
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>Readiness Score</span>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Provider Connectivity Banner */}
      <div className="mt-4 p-3 rounded-2xl bg-[#0B0E0C] border border-[#757761]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-[11px] ${
              primaryProvider ? primaryProvider.iconBg : "bg-[#757761]/30 text-[#A0A493]"
            }`}
          >
            {primaryProvider ? primaryProvider.name.charAt(0) : "T"}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">
                {hasAnyConnected
                  ? `${primaryProvider?.name} Data Stream`
                  : "Baseline Biometric Preview"}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                  hasAnyConnected
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                    : "text-amber-400 bg-amber-500/10 border-amber-500/30"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    hasAnyConnected
                      ? "bg-emerald-400 animate-pulse shadow-[0_0_6px_#10B981]"
                      : "bg-amber-400"
                  }`}
                />
                {hasAnyConnected ? "Live Wearable Sync" : "Tracker Unlinked"}
              </span>
            </div>
            <p className="text-[11px] text-[#A0A493] mt-0.5">
              {hasAnyConnected
                ? `Synchronized with ${primaryProvider?.name} • All 7 days populated from single chosen provider.`
                : "Showing estimated reference profile. Select your preferred fitness app to stream real continuous telemetry."}
            </p>
          </div>
        </div>

        {/* Quick Connection Action / Tracker Selector */}
        {!hasAnyConnected ? (
          <div className="flex items-center gap-2 flex-wrap">
            {providers.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => connectProvider(p.id)}
                disabled={isSyncing}
                className="px-2.5 py-1 text-[11px] font-bold text-[#E2E7DE] hover:text-white bg-[#121815] hover:bg-[#181f1b] border border-[#757761]/40 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Connect {p.name.split(" ")[0]}</span>
                <ArrowRight className="w-2.5 h-2.5 text-[#f7fe72]" />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#757761]">
              Switch tracker:
            </span>
            <select
              value={primaryProvider?.id || ""}
              onChange={(e) => connectProvider(e.target.value)}
              className="bg-[#121815] border border-[#757761]/40 text-white text-[11px] font-semibold rounded-lg px-2 py-1 focus:outline-none focus:border-[#f7fe72] cursor-pointer"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 4 Rolling Aggregate Metric Chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
        {/* Metric 1 */}
        <div className="bg-[#0B0E0C] rounded-2xl p-3.5 border border-[#757761]/25 space-y-1">
          <div className="flex items-center justify-between text-[#A0A493]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              7-Day Active Burn
            </span>
            <Flame className="w-3.5 h-3.5 text-[#f7fe72]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black font-mono text-white">
              {stats.totalBurn.toLocaleString()}
            </span>
            <span className="text-xs text-[#757761] font-mono">kcal</span>
          </div>
          <span className="text-[10px] text-[#A0A493] block">
            ~{Math.round(stats.totalBurn / 7)} kcal/day avg
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0B0E0C] rounded-2xl p-3.5 border border-[#757761]/25 space-y-1">
          <div className="flex items-center justify-between text-[#A0A493]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Daily Avg Steps
            </span>
            <Footprints className="w-3.5 h-3.5 text-[#10B981]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black font-mono text-white">
              {stats.avgSteps.toLocaleString()}
            </span>
            <span className="text-xs text-[#757761] font-mono">steps</span>
          </div>
          <span className="text-[10px] text-emerald-400 block font-mono">
            {stats.avgSteps >= 10000 ? "● Target (10k) Met" : "94% of 10k target"}
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0B0E0C] rounded-2xl p-3.5 border border-[#757761]/25 space-y-1">
          <div className="flex items-center justify-between text-[#A0A493]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Mean Restorative Sleep
            </span>
            <Moon className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black font-mono text-white">
              {stats.avgSleep}
            </span>
            <span className="text-xs text-[#757761] font-mono">hrs/night</span>
          </div>
          <span className="text-[10px] text-[#A0A493] block">
            Target 7.0-8.5 hrs optimal
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0B0E0C] rounded-2xl p-3.5 border border-[#757761]/25 space-y-1">
          <div className="flex items-center justify-between text-[#A0A493]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Mean Autonomic HRV
            </span>
            <HeartPulse className="w-3.5 h-3.5 text-[#A78BFA]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black font-mono text-white">
              {stats.avgHrv}
            </span>
            <span className="text-xs text-[#757761] font-mono">ms</span>
          </div>
          <span className="text-[10px] text-[#A78BFA] block font-mono">
            Avg Readiness: {stats.avgRecovery}%
          </span>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="bg-[#0B0E0C] rounded-2xl border border-[#757761]/25 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#f7fe72]" />
            <h3 className="text-sm font-bold text-white">
              {activeMetricView === "activity" && "Daily Active Burn (kcal) & Locomotion Cadence (Steps)"}
              {activeMetricView === "sleep_hrv" && "Sleep Duration (Hours) vs Autonomic HRV Recovery (ms)"}
              {activeMetricView === "recovery" && "Biometric Recovery Readiness Score (%) Over 7 Days"}
            </h3>
          </div>
          <div className="text-[11px] font-mono text-[#A0A493] flex items-center gap-3">
            {activeMetricView === "activity" && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#f7fe72] rounded-xs" />
                  <span>Burn (kcal)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#10B981] rounded-full" />
                  <span>Steps (locomotion)</span>
                </span>
              </>
            )}
            {activeMetricView === "sleep_hrv" && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#38BDF8] rounded-xs" />
                  <span>Sleep (hrs)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#A78BFA] rounded-full" />
                  <span>HRV (ms)</span>
                </span>
              </>
            )}
            {activeMetricView === "recovery" && (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-xs" />
                  <span>Recovery %</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 border-t border-dashed border-[#f7fe72]" />
                  <span>85% Optimal line</span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* Recharts Chart Rendering */}
        <div className="h-64 sm:h-72 w-full">
          {!isMounted ? (
            <div className="w-full h-full rounded-xl bg-[#121815] animate-pulse flex items-center justify-center text-xs text-[#757761]">
              Loading biometric telemetry graph...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {activeMetricView === "activity" ? (
                <ComposedChart
                  data={sevenDayHistory}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  onClick={(state) => {
                    if (state && typeof state.activeTooltipIndex === "number") {
                      setSelectedDayIndex(state.activeTooltipIndex);
                    }
                  }}
                >
                  <defs>
                    <linearGradient id="burnGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f7fe72" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#f4e76e" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#757761" strokeDasharray="3 3" opacity={0.2} vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#757761"
                    tick={{ fill: "#A0A493", fontSize: 11, fontFamily: "monospace" }}
                    axisLine={{ stroke: "#757761", opacity: 0.3 }}
                    tickLine={false}
                  />
                  {/* Left Y-axis: Active Burn kcal */}
                  <YAxis
                    yAxisId="burn"
                    stroke="#757761"
                    tick={{ fill: "#A0A493", fontSize: 10, fontFamily: "monospace" }}
                    domain={[0, 800]}
                    tickCount={5}
                    axisLine={false}
                    tickLine={false}
                  />
                  {/* Right Y-axis: Steps */}
                  <YAxis
                    yAxisId="steps"
                    orientation="right"
                    stroke="#757761"
                    tick={{ fill: "#10B981", fontSize: 10, fontFamily: "monospace" }}
                    domain={[0, 16000]}
                    tickCount={5}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        activeMetricView="activity"
                        historyData={sevenDayHistory}
                      />
                    }
                  />
                  <Bar
                    yAxisId="burn"
                    dataKey="activeBurnKcal"
                    name="Active Burn"
                    fill="url(#burnGradient)"
                    radius={[6, 6, 0, 0]}
                    barSize={28}
                  />
                  <Area
                    yAxisId="steps"
                    type="monotone"
                    dataKey="steps"
                    name="Daily Steps"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fill="url(#stepsGradient)"
                    dot={{ fill: "#10B981", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#f7fe72", stroke: "#0B0E0C", strokeWidth: 2 }}
                  />
                </ComposedChart>
              ) : activeMetricView === "sleep_hrv" ? (
                <ComposedChart
                  data={sevenDayHistory}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  onClick={(state) => {
                    if (state && typeof state.activeTooltipIndex === "number") {
                      setSelectedDayIndex(state.activeTooltipIndex);
                    }
                  }}
                >
                  <defs>
                    <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#757761" strokeDasharray="3 3" opacity={0.2} vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#757761"
                    tick={{ fill: "#A0A493", fontSize: 11, fontFamily: "monospace" }}
                    axisLine={{ stroke: "#757761", opacity: 0.3 }}
                    tickLine={false}
                  />
                  {/* Left Axis: Sleep hours (5h to 10h) */}
                  <YAxis
                    yAxisId="sleep"
                    stroke="#757761"
                    tick={{ fill: "#38BDF8", fontSize: 10, fontFamily: "monospace" }}
                    domain={[5, 10]}
                    tickCount={6}
                    axisLine={false}
                    tickLine={false}
                  />
                  {/* Right Axis: HRV ms (40 to 100) */}
                  <YAxis
                    yAxisId="hrv"
                    orientation="right"
                    stroke="#757761"
                    tick={{ fill: "#A78BFA", fontSize: 10, fontFamily: "monospace" }}
                    domain={[40, 100]}
                    tickCount={6}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        activeMetricView="sleep_hrv"
                        historyData={sevenDayHistory}
                      />
                    }
                  />
                  <ReferenceLine yAxisId="sleep" y={7.0} stroke="#38BDF8" strokeDasharray="3 3" opacity={0.4} />
                  <Area
                    yAxisId="sleep"
                    type="monotone"
                    dataKey="sleepHours"
                    name="Sleep Duration"
                    stroke="#38BDF8"
                    strokeWidth={2.5}
                    fill="url(#sleepGradient)"
                    dot={{ fill: "#38BDF8", r: 3 }}
                    activeDot={{ r: 5, fill: "#38BDF8", stroke: "#0B0E0C", strokeWidth: 2 }}
                  />
                  <Line
                    yAxisId="hrv"
                    type="monotone"
                    dataKey="hrvMs"
                    name="Autonomic HRV"
                    stroke="#A78BFA"
                    strokeWidth={2.5}
                    dot={{ fill: "#A78BFA", r: 3 }}
                    activeDot={{ r: 5, fill: "#f7fe72", stroke: "#0B0E0C", strokeWidth: 2 }}
                  />
                </ComposedChart>
              ) : (
                <ComposedChart
                  data={sevenDayHistory}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  onClick={(state) => {
                    if (state && typeof state.activeTooltipIndex === "number") {
                      setSelectedDayIndex(state.activeTooltipIndex);
                    }
                  }}
                >
                  <defs>
                    <linearGradient id="recoveryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.85} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#757761" strokeDasharray="3 3" opacity={0.2} vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="#757761"
                    tick={{ fill: "#A0A493", fontSize: 11, fontFamily: "monospace" }}
                    axisLine={{ stroke: "#757761", opacity: 0.3 }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#757761"
                    tick={{ fill: "#A0A493", fontSize: 10, fontFamily: "monospace" }}
                    domain={[50, 100]}
                    tickCount={6}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        activeMetricView="recovery"
                        historyData={sevenDayHistory}
                      />
                    }
                  />
                  <ReferenceLine y={85} stroke="#f7fe72" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "Optimal (85%+)", fill: "#f7fe72", fontSize: 10, position: "insideTopLeft" }} />
                  <Bar
                    dataKey="recoveryScore"
                    name="Recovery Score"
                    fill="url(#recoveryGradient)"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Interactive 7-Day Day Selector Strip */}
        <div className="mt-4 pt-3 border-t border-[#757761]/25">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-[#A0A493] uppercase font-bold">
              Inspect Day-by-Day Telemetry
            </span>
            <span className="text-[11px] text-[#757761]">
              Tap any day card to view full session biometric log
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {sevenDayHistory.map((dayItem, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`p-2 rounded-xl text-center transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-[#18201A] border-[#f7fe72] shadow-sm shadow-[#f7fe72]/10"
                      : "bg-[#121815] border-[#757761]/30 hover:border-[#757761] hover:bg-[#181f1b]"
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold text-[#A0A493] uppercase">
                    {dayItem.day}
                  </div>
                  <div className={`text-xs font-black font-mono mt-0.5 ${isSelected ? "text-[#f7fe72]" : "text-white"}`}>
                    {dayItem.dateLabel}
                  </div>
                  <div className="mt-1 text-[10px] font-mono font-semibold text-[#CBD2C7] truncate hidden sm:block">
                    +{dayItem.activeBurnKcal}k
                  </div>
                  <div
                    className={`mt-1 h-1 w-full rounded-full ${
                      dayItem.recoveryScore >= 88
                        ? "bg-emerald-400"
                        : dayItem.recoveryScore >= 80
                        ? "bg-[#f7fe72]"
                        : "bg-amber-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Day Expanded Detail Card */}
      {selectedDay && (
        <div className="mt-4 p-4 rounded-2xl bg-[#0B0E0C] border border-[#757761]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#757761]/25 border border-[#757761]/40 flex items-center justify-center text-[#f7fe72] shrink-0">
              <Zap className="w-5 h-5 text-[#f7fe72]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-[#f7fe72]">
                  {selectedDay.dateLabel} Breakdown
                </span>
                {selectedDay.isToday && (
                  <span className="text-[10px] font-bold text-[#0B0E0C] bg-[#f7fe72] px-1.5 py-0.2 rounded font-mono">
                    LIVE
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                {selectedDay.workoutTitle}
              </h4>
              <p className="text-xs text-[#A0A493]">
                Telemetry recorded via {primaryProvider?.name || "Direct Wearable Sensor"}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono flex-wrap">
            <div className="bg-[#121815] px-3 py-1.5 rounded-xl border border-[#757761]/30">
              <span className="text-[#A0A493] block text-[10px]">Burn</span>
              <span className="font-bold text-white">+{selectedDay.activeBurnKcal} kcal</span>
            </div>
            <div className="bg-[#121815] px-3 py-1.5 rounded-xl border border-[#757761]/30">
              <span className="text-[#A0A493] block text-[10px]">Steps</span>
              <span className="font-bold text-white">{selectedDay.steps.toLocaleString()}</span>
            </div>
            <div className="bg-[#121815] px-3 py-1.5 rounded-xl border border-[#757761]/30">
              <span className="text-[#A0A493] block text-[10px]">Sleep</span>
              <span className="font-bold text-white">{selectedDay.sleepHours} hrs</span>
            </div>
            <div className="bg-[#121815] px-3 py-1.5 rounded-xl border border-[#757761]/30">
              <span className="text-[#A0A493] block text-[10px]">HRV</span>
              <span className="font-bold text-white">{selectedDay.hrvMs} ms</span>
            </div>
            <div className="bg-[#121815] px-3 py-1.5 rounded-xl border border-[#757761]/30">
              <span className="text-[#A0A493] block text-[10px]">Readiness</span>
              <span className="font-bold text-emerald-400">{selectedDay.recoveryScore}%</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
