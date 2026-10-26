"use client";

import React, { useState } from "react";
import {
  Moon,
  Sparkles,
  Activity,
  Utensils,
  Play,
  CheckCircle2,
  Sliders,
  Bell,
  RefreshCw,
} from "lucide-react";
import { usePWA } from "@/hooks/usePWA";
import { useHealthSync } from "@/hooks/useHealthSync";

interface RecoveryInsightCardProps {
  onStartRecoverySession?: () => void;
  onApplyDietAdjustments?: () => void;
  className?: string;
}

export default function RecoveryInsightCard({
  onStartRecoverySession,
  onApplyDietAdjustments,
  className = "",
}: RecoveryInsightCardProps) {
  const { triggerNotification } = usePWA();
  const {
    hasAnyConnected,
    primaryProvider,
    hrvMs: hookHrvMs,
    sleepHours: hookSleepHours,
    activeBurnExtraKcal,
    connectProvider,
  } = useHealthSync();

  const isTrackerConnected = hasAnyConnected;

  // User's recent training volume & sleep metrics state (interactive simulator overrides)
  const [customSleepHours, setCustomSleepHours] = useState<number | null>(null);
  const [customDeepSleepPercent, setCustomDeepSleepPercent] = useState<number | null>(null);
  const [customHrvMs, setCustomHrvMs] = useState<number | null>(null);
  const [customActiveBurnKcal, setCustomActiveBurnKcal] = useState<number | null>(null);
  const [trainingTonnageKg, setTrainingTonnageKg] = useState(21600);
  const [isSimulating, setIsSimulating] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  // Derived metrics dynamically reflect connected wearable/tracker state unless customized via simulator
  const sleepHours = customSleepHours ?? (hookSleepHours ?? (isTrackerConnected ? 7.4 : 6.2));
  const deepSleepPercent = customDeepSleepPercent ?? (isTrackerConnected ? 24 : 14);
  const hrvMs = customHrvMs ?? (hookHrvMs ?? (isTrackerConnected ? 72 : 48));
  const activeBurnKcal = customActiveBurnKcal ?? (activeBurnExtraKcal > 0 ? activeBurnExtraKcal : 250);

  // Dynamic calculation of autonomic recovery readiness score
  // Factors: HRV baseline (ideal 65-85), Sleep duration (ideal 7.5-8.5), Deep sleep (ideal >20%)
  // Penalties: Heavy training volume without adequate sleep
  const calculateRecovery = () => {
    let score = 50;

    // Sleep hours contribution (max 25)
    if (sleepHours >= 7.5) score += 25;
    else if (sleepHours >= 6.5) score += 18;
    else score += 10;

    // Deep sleep contribution (max 15)
    if (deepSleepPercent >= 20) score += 15;
    else if (deepSleepPercent >= 15) score += 10;
    else score += 5;

    // HRV contribution (max 25)
    if (hrvMs >= 70) score += 25;
    else if (hrvMs >= 55) score += 18;
    else score += 10;

    // Training load penalty (high tonnage with low sleep)
    if (trainingTonnageKg > 20000 && sleepHours < 7.0) {
      score -= 15;
    }

    return Math.min(98, Math.max(35, score));
  };

  const recoveryScore = calculateRecovery();

  const getStatusDetails = () => {
    if (recoveryScore >= 80) {
      return {
        level: "Optimal Readiness",
        badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        summary:
          "Autonomic nervous system is primed for peak progressive overload. Your sleep architecture provided complete neuromuscular restoration.",
        nutritionAdjustments: {
          proteinDelta: "+25g Protein",
          proteinAdvice: "Maintain high nitrogen balance for continued myofibrillar hypertrophy.",
          carbAdvice: "Standard complex carbohydrate recharge (3.5g per kg bodyweight).",
          hydrationAdvice: "3.2L baseline hydration with 500mg sodium booster.",
          suggestedMeal: "Sattu & Market Paneer Power Bowl (42g Protein • ₹95)",
        },
        recoveryAdjustments: {
          trainingAdvice: "Cleared for heavy compound lifts (RPE 8.5–9.0). Full power output available.",
          breathworkAdvice: "Optional 5-min Box Breathing post-training for rapid cortisol clearing.",
          sleepWindowAdvice: "Target 7.5h sleep tonight to consolidate today's volume adaptations.",
        },
      };
    } else if (recoveryScore >= 60) {
      return {
        level: "Moderate / Elevated Strain",
        badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        summary:
          "Mild autonomic depletion detected. High training tonnage has taxed glycogen stores while deep sleep fell slightly below the 20% restorative threshold.",
        nutritionAdjustments: {
          proteinDelta: "+35g Protein",
          proteinAdvice: "Accelerate amino acid pool replenishment to prevent exercise-induced catabolism.",
          carbAdvice: "Increase fast-acting unrefined carbs by +45g within 45 mins of training.",
          hydrationAdvice: "3.6L hydration + potassium/magnesium electrolyte salt boost.",
          suggestedMeal: "Sprouted Moong & Curd Khichdi with Ashwagandha (36g Protein • ₹85)",
        },
        recoveryAdjustments: {
          trainingAdvice: "Cap intensity at RPE 7.5. Shift focus to tempo control rather than 1RM loads.",
          breathworkAdvice: "Mandatory 5-min Parasympathetic Box Breathing before evening meal.",
          sleepWindowAdvice: "Advance bedtime by 30 minutes to repay 14-min sleep deficit.",
        },
      };
    } else {
      return {
        level: "High Fatigue / Deload Triggered",
        badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
        summary:
          "Sympathetic dominance and depressed HRV detected. Accumulated volume exceeds physiological recovery capacity.",
        nutritionAdjustments: {
          proteinDelta: "+40g Anti-Inflammatory Protein",
          proteinAdvice: "Prioritize easily digestible collagen and plant-based protein blends.",
          carbAdvice: "Anti-inflammatory nutrient-dense carbs with turmeric and ginger infusions.",
          hydrationAdvice: "4.0L fluid intake with isotonic coconut water and trace minerals.",
          suggestedMeal: "Warm Sattu Elixir + Steamed Greens & Market Tofu (38g Protein • ₹78)",
        },
        recoveryAdjustments: {
          trainingAdvice: "Deload active: Swap heavy resistance for mobility flows and Zone 2 walks.",
          breathworkAdvice: "10-min 4-7-8 sedative breathing flow before sleep.",
          sleepWindowAdvice: "Aim for 8.5h uninterrupted sleep in complete darkness (<18°C).",
        },
      };
    }
  };

  const status = getStatusDetails();

  const handleApplyDiet = () => {
    setAppliedNotice(`Applied ${status.nutritionAdjustments.proteinDelta} to today's macro targets!`);
    if (onApplyDietAdjustments) onApplyDietAdjustments();
    setTimeout(() => setAppliedNotice(null), 3500);

    // Fire PWA Notification alert
    triggerNotification("Uchitatvam Recovery Insight", {
      body: `⚡ Nutrition updated: ${status.nutritionAdjustments.proteinDelta} & ${status.nutritionAdjustments.suggestedMeal} added to today's plan.`,
      icon: "/android-chrome-192x192.png",
    });
  };

  return (
    <div
      className={`w-full bg-[#121815] border border-[#757761]/35 rounded-3xl p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden mb-8 transition-all ${className}`}
    >
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#f7fe72]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row: Title, Readiness Gauge & Simulator Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#757761]/25 relative z-10">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#757761]/20 border border-[#757761]/40 flex items-center justify-center text-[#f7fe72] shrink-0 shadow-xs">
            <Sparkles className="w-6 h-6 text-[#f7fe72]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Recovery Insight &amp; Adaptive Prescription
              </h2>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${status.badgeColor}`}
              >
                {status.level.toUpperCase()}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A0A493] mt-0.5">
              Bio-harmonic synthesis of your recent {trainingTonnageKg.toLocaleString()} kg volume, {activeBurnKcal} kcal burn, and {sleepHours}h sleep architecture.
            </p>
          </div>
        </div>

        {/* Readiness Circular Ring & Simulator Toggle */}
        <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsSimulating(!isSimulating)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-[#757761]/35 text-xs font-semibold text-[#CBD2C7] hover:text-white transition-colors cursor-pointer"
            title="Adjust metrics to simulate insights"
          >
            <Sliders className="w-3.5 h-3.5 text-[#f7fe72]" />
            <span>{isSimulating ? "Close Metrics" : "Simulate Metrics"}</span>
          </button>

          {/* Readiness Score Gauge */}
          <div className="flex items-center gap-3 bg-[#0B0E0C] border border-[#757761]/30 py-1.5 px-3 rounded-2xl shadow-inner">
            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
              <svg className="w-11 h-11 -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-[#757761]/25 stroke-current stroke-[3.5] fill-none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`stroke-current stroke-[3.5] stroke-linecap-round fill-none transition-all duration-700 ${
                    recoveryScore >= 80 ? "text-emerald-400" : recoveryScore >= 60 ? "text-[#f7fe72]" : "text-rose-400"
                  }`}
                  strokeDasharray={`${recoveryScore}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-black text-white font-mono">
                {recoveryScore}%
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 font-mono uppercase font-bold">Autonomic</span>
              <span className="text-xs font-bold text-white leading-none">Readiness</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tracker Connection Gate Banner */}
      {!isTrackerConnected && (
        <div className="mt-4 p-4 rounded-2xl bg-[#0B0E0C] border border-[#f7fe72]/30 text-white text-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
              <span className="font-bold text-[#f7fe72] uppercase font-mono tracking-wider text-[11px]">
                CHOOSE YOUR FITNESS APP (1 APP SUPPLIES ALL METRICS)
              </span>
            </div>
            <span className="text-[11px] text-[#f7fe72] font-semibold">
              Only 1 app needed
            </span>
          </div>

          <p className="text-slate-300 text-xs">
            Pick whichever app you use daily. A single app streams all your sleep architecture, HRV recovery, and workout volume without needing secondary devices.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => connectProvider("googlefit")}
              className="px-3 py-1.5 rounded-xl bg-[#4285F4]/20 hover:bg-[#4285F4]/30 border border-[#4285F4]/40 text-[#4285F4] text-xs font-bold transition-all hover:scale-102 cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span>Use Google Fit</span>
            </button>

            <button
              type="button"
              onClick={() => connectProvider("applehealth")}
              className="px-3 py-1.5 rounded-xl bg-[#FA2D48]/20 hover:bg-[#FA2D48]/30 border border-[#FA2D48]/40 text-[#FA2D48] text-xs font-bold transition-all hover:scale-102 cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#FA2D48]" />
              <span>Use Apple Health</span>
            </button>

            <button
              type="button"
              onClick={() => connectProvider("strava")}
              className="px-3 py-1.5 rounded-xl bg-[#FC4C02]/20 hover:bg-[#FC4C02]/30 border border-[#FC4C02]/40 text-[#FC4C02] text-xs font-bold transition-all hover:scale-102 cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#FC4C02]" />
              <span>Use Strava</span>
            </button>

            <button
              type="button"
              onClick={() => connectProvider("whoop")}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold transition-all hover:scale-102 cursor-pointer flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Use Whoop</span>
            </button>
          </div>
        </div>
      )}

      {isTrackerConnected && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              Live Biometrics Active: All data streamed from <strong className="text-white font-sans">{primaryProvider?.name || "Fitness App"}</strong> ({hrvMs}ms HRV • {sleepHours}h Sleep • +{activeBurnKcal} kcal Burn)
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 self-start sm:self-auto">
            100% TELEMETRY READY
          </span>
        </div>
      )}

      {/* Applied Banner Feedback */}
      {appliedNotice && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{appliedNotice}</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-300/80">UPDATED</span>
        </div>
      )}

      {/* Metric Simulation Sliders Drawer */}
      {isSimulating && (
        <div className="mt-4 p-4 rounded-2xl bg-[#0B0E0C] border border-[#757761]/40 text-xs space-y-4 animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#f7fe72] uppercase tracking-wider text-[11px] font-mono">
              BIOMETRIC &amp; TRAINING VOLUME SIMULATOR
            </span>
            <button
              onClick={() => {
                setCustomSleepHours(null);
                setCustomDeepSleepPercent(null);
                setCustomHrvMs(null);
                setCustomActiveBurnKcal(null);
                setTrainingTonnageKg(21600);
              }}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Sleep Duration</span>
                <span className="font-mono text-white font-bold">{sleepHours} hrs</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.5"
                step="0.1"
                value={sleepHours}
                onChange={(e) => setCustomSleepHours(parseFloat(e.target.value))}
                className="w-full accent-[#f7fe72] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Deep Sleep Share</span>
                <span className="font-mono text-white font-bold">{deepSleepPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                step="1"
                value={deepSleepPercent}
                onChange={(e) => setCustomDeepSleepPercent(parseInt(e.target.value, 10))}
                className="w-full accent-[#f7fe72] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>HRV Baseline</span>
                <span className="font-mono text-white font-bold">{hrvMs} ms</span>
              </div>
              <input
                type="range"
                min="35"
                max="95"
                step="1"
                value={hrvMs}
                onChange={(e) => setCustomHrvMs(parseInt(e.target.value, 10))}
                className="w-full accent-[#f7fe72] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Synthesis Summary Bar */}
      <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
        <Activity className="w-4 h-4 text-[#f7fe72] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Physiological Synthesis: </strong>
          {status.summary}
        </p>
      </div>

      {/* Two Column Grid: Specific Nutrition vs Specific Recovery Adjustments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        
        {/* Column 1: Specific Nutrition Adjustments */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0E0C] border border-[#757761]/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#f7fe72]/20 text-[#f7fe72]">
                  <Utensils className="w-4 h-4" />
                </span>
                <h3 className="font-black text-white text-sm sm:text-base">
                  Prescribed Nutrition Adjustments
                </h3>
              </div>
              <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {status.nutritionAdjustments.proteinDelta}
              </span>
            </div>

            <div className="space-y-3 mt-3.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f7fe72] mt-2 shrink-0" />
                <div>
                  <strong className="text-white">Nitrogen &amp; Muscle Repair: </strong>
                  <span>{status.nutritionAdjustments.proteinAdvice}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f7fe72] mt-2 shrink-0" />
                <div>
                  <strong className="text-white">Carbohydrate Strategy: </strong>
                  <span>{status.nutritionAdjustments.carbAdvice}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <div>
                  <strong className="text-white">Hydration &amp; Osmolality: </strong>
                  <span>{status.nutritionAdjustments.hydrationAdvice}</span>
                </div>
              </div>

              {/* Recommended Hyper-Local Whole-Food Plate */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-[#f7fe72] block mb-1">
                  RECOMMENDED HYPER-LOCAL FUEL
                </span>
                <p className="font-bold text-white text-sm">
                  {status.nutritionAdjustments.suggestedMeal}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Engineered to compensate for today&apos;s {trainingTonnageKg.toLocaleString()}kg session volume and replenish glycogen depleted in Block 2.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApplyDiet}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:brightness-110 active:scale-98 text-[#0B0E0C] text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#f7fe72]/15 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Macros to Today&apos;s Diet Plan</span>
          </button>
        </div>

        {/* Column 2: Specific Recovery & Protocol Adjustments */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0B0E0C] border border-[#757761]/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <Moon className="w-4 h-4" />
                </span>
                <h3 className="font-black text-white text-sm sm:text-base">
                  Prescribed Recovery Protocols
                </h3>
              </div>
              <span className="text-xs font-black font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {hrvMs} ms HRV
              </span>
            </div>

            <div className="space-y-3 mt-3.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                <div>
                  <strong className="text-white">Training Intensity Prescription: </strong>
                  <span>{status.recoveryAdjustments.trainingAdvice}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                <div>
                  <strong className="text-white">Autonomic Nervous Reset: </strong>
                  <span>{status.recoveryAdjustments.breathworkAdvice}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                <div>
                  <strong className="text-white">Sleep Window Architecture: </strong>
                  <span>{status.recoveryAdjustments.sleepWindowAdvice}</span>
                </div>
              </div>

              {/* Box Breathing Quick Launch Card */}
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/25 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-purple-300 block">
                    RECOMMENDED PARASYMPATHETIC FLOW
                  </span>
                  <p className="font-bold text-white text-xs sm:text-sm mt-0.5">
                    4-4-4-4 Box Breathing Visualizer (5 min)
                  </p>
                </div>
                {onStartRecoverySession && (
                  <button
                    type="button"
                    onClick={onStartRecoverySession}
                    className="px-3 py-1.5 rounded-lg bg-purple-500 text-white font-bold text-xs hover:bg-purple-600 transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onStartRecoverySession && (
              <button
                type="button"
                onClick={onStartRecoverySession}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Guided Recovery (5 min)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                triggerNotification("Uchitatvam Recovery Alert", {
                  body: `⚡ Optimal sleep window recommended at 10:15 PM. Consume ${status.nutritionAdjustments.proteinDelta} to maximize recovery score!`,
                  icon: "/android-chrome-192x192.png",
                });
                setAppliedNotice("Recovery notification alert sent via Service Worker!");
                setTimeout(() => setAppliedNotice(null), 3000);
              }}
              title="Send recovery alert via PWA service worker"
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-[#f7fe72] transition-colors cursor-pointer"
              aria-label="Send PWA alert"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
