"use client";

import React, { useState, useMemo } from "react";
import {
  Trophy,
  Dumbbell,
  Utensils,
  Droplets,
  Wind,
  CheckCircle2,
  Lock,
  Zap,
  Flame,
  ShieldCheck,
  Gift,
  Clock,
  Target,
  TrendingUp,
  Store,
  Headphones,
  Video,
  Crown,
  Check,
  Copy,
} from "lucide-react";
import { fireTierUnlockConfetti } from "@/lib/confetti";
import { TierData } from "@/app/rewards/page";

export interface MilestoneWaypoint {
  id: string;
  name: string;
  perkTitle: string;
  type: "voucher" | "aura" | "audio" | "clinic" | "tier";
  xpThreshold: number;
  description: string;
  valueTag: string;
  icon: React.ComponentType<{ className?: string }>;
  voucherCode?: string;
}

export interface RoadmapToNextTierProps {
  userXp: number;
  userRank: number;
  activeTier: TierData;
  nextTier: TierData | null;
  onAddXp: (amount: number, reason: string) => void;
  onClaimPerk?: (perkId: string, title: string) => void;
  claimedCodes?: Record<string, string>;
  className?: string;
}

export default function RoadmapToNextTier({
  userXp,
  userRank,
  activeTier,
  nextTier,
  onAddXp,
  onClaimPerk,
  claimedCodes = {},
  className = "",
}: RoadmapToNextTierProps) {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [actionCategory, setActionCategory] = useState<"all" | "strength" | "nutrition" | "recovery">("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Dynamic milestone generation tailored to current tier & next tier
  const milestones: MilestoneWaypoint[] = useMemo(() => {
    const base = activeTier.xpThreshold;
    const target = nextTier ? nextTier.xpThreshold : base + 5000;
    const span = target - base;

    // Generate 4 progressive milestone nodes
    const m1Xp = Math.round(base + span * 0.25);
    const m2Xp = Math.round(base + span * 0.55);
    const m3Xp = Math.round(base + span * 0.8);
    const m4Xp = target;

    if (activeTier.id === "bronze") {
      return [
        {
          id: "m_bronze_1",
          name: "Sprint Ignition",
          perkTitle: "Hyper-Local Ingredient Swap Radar",
          type: "voucher",
          xpThreshold: m1Xp || 600,
          description: "Unlocks real-time price & macro swaps within 5km of your location.",
          valueTag: "Radar Tool",
          icon: Store,
        },
        {
          id: "m_bronze_2",
          name: "Kirana Novice",
          perkTitle: "₹50 Kirana Grocery Voucher",
          type: "voucher",
          xpThreshold: m2Xp || 1400,
          description: "Redeemable at verified neighborhood grain and legume merchants.",
          valueTag: "₹50 Voucher",
          icon: Gift,
          voucherCode: "KIRANA-BOOST-50",
        },
        {
          id: "m_bronze_3",
          name: "Hydration Anchor",
          perkTitle: "Cellular Hydration Tracker & Electrolyte Matrix",
          type: "audio",
          xpThreshold: m3Xp || 2000,
          description: "Smart algorithmic fluid timing based on real-time ambient heat and sweat rate.",
          valueTag: "Smart Feature",
          icon: Droplets,
        },
        {
          id: "m_bronze_4",
          name: "Silver Threshold",
          perkTitle: "Silver Vanguard Tier & Brushed Platinum Avatar Ring",
          type: "tier",
          xpThreshold: m4Xp || 2500,
          description: "Complete progression to Tier 2 with leaderboard aura and Top 200 contention.",
          valueTag: "Tier Promotion",
          icon: Crown,
        },
      ];
    }

    if (activeTier.id === "silver") {
      return [
        {
          id: "m_silver_1",
          name: "Iron Rhythm",
          perkTitle: "Progressive Overload Barbell Matrix",
          type: "aura",
          xpThreshold: m1Xp || 3200,
          description: "Automatic RPE to percentage load calculator for primary compound lifts.",
          valueTag: "Analytics Tool",
          icon: Dumbbell,
        },
        {
          id: "m_silver_2",
          name: "Market Pioneer",
          perkTitle: "₹150 Fresh Street Fuel Voucher",
          type: "voucher",
          xpThreshold: m2Xp || 3900,
          description: "Redeemable for paneer, sprouted chickpeas & seasonal greens at verified vendors.",
          valueTag: "₹150 Voucher",
          icon: Store,
          voucherCode: "KIRANA-SILVER-150",
        },
        {
          id: "m_silver_3",
          name: "Autonomic Mastery",
          perkTitle: "4 Binaural Parasympathetic Recovery Frequencies",
          type: "audio",
          xpThreshold: m3Xp || 4500,
          description: "Audio frequencies engineered for post-workout nervous system down-regulation.",
          valueTag: "Audio Pack",
          icon: Headphones,
        },
        {
          id: "m_silver_4",
          name: "Apex Gate",
          perkTitle: "Gold Champion Tier & Golden Shimmer Leaderboard Halo",
          type: "tier",
          xpThreshold: m4Xp || 5000,
          description: "Unlocks official Top 50 Global Arena standing and ₹250 Kirana vouchers.",
          valueTag: "Tier Promotion",
          icon: Trophy,
        },
      ];
    }

    // Default / Gold Tier (5,000 -> 10,000 XP)
    if (activeTier.id === "gold") {
      return [
        {
          id: "m_gold_1",
          name: "Vitality Burst",
          perkTitle: "Box Breathing Guided Sonic Visualizer",
          type: "audio",
          xpThreshold: m1Xp || 6250,
          description: "4-4-4-4 autonomic nervous reset with haptic pacing and alpha wave frequencies.",
          valueTag: "Audio Protocol",
          icon: Headphones,
        },
        {
          id: "m_gold_2",
          name: "High-Protein Fuel",
          perkTitle: "₹350 Local Kirana Booster Voucher",
          type: "voucher",
          xpThreshold: m2Xp || 7750,
          description: "Instant grocery balance for sattu, artisanal tofu, and dry-roasted almonds at Delhi stalls.",
          valueTag: "₹350 Voucher",
          icon: Store,
          voucherCode: "KIRANA-GOLD-350",
        },
        {
          id: "m_gold_3",
          name: "Specialist Access",
          perkTitle: "Coach Priority Video Clinic Queue",
          type: "clinic",
          xpThreshold: m3Xp || 9000,
          description: "Direct priority booking window for biomechanical lifting review with head strength coaches.",
          valueTag: "VIP Access",
          icon: Video,
        },
        {
          id: "m_gold_4",
          name: "Titan Ascent",
          perkTitle: "Emerald Titan Tier Promotion & Solar Kinetic Profile Halo",
          type: "tier",
          xpThreshold: m4Xp || 10000,
          description: "Official Top 25 global ranking qualification, ₹500 organic farm box, and titanium badge.",
          valueTag: "Tier Promotion",
          icon: Crown,
        },
      ];
    }

    // Emerald Tier (10,000 -> 20,000 XP)
    if (activeTier.id === "emerald") {
      return [
        {
          id: "m_emerald_1",
          name: "Centurion Pacing",
          perkTitle: "50-Ton Cumulative Volume Crest",
          type: "aura",
          xpThreshold: m1Xp || 12500,
          description: "Permanent metallic crest displayed on public athlete card and routine exports.",
          valueTag: "Digital Crest",
          icon: ShieldCheck,
        },
        {
          id: "m_emerald_2",
          name: "Direct Harvest",
          perkTitle: "₹750 Organic Farm-Direct Produce Basket",
          type: "voucher",
          xpThreshold: m2Xp || 15500,
          description: "Direct doorstep delivery voucher for cold-pressed seed oils & unpolished farm grains.",
          valueTag: "₹750 Voucher",
          icon: Gift,
          voucherCode: "FARM-DIRECT-750",
        },
        {
          id: "m_emerald_3",
          name: "Master Clinician",
          perkTitle: "1-on-1 Blood Biomarker & HRV Advisory Session",
          type: "clinic",
          xpThreshold: m3Xp || 18000,
          description: "45-minute clinical consultation on circadian sleep tuning and recovery metrics.",
          valueTag: "Clinical Clinic",
          icon: Video,
        },
        {
          id: "m_emerald_4",
          name: "Apex Immortal",
          perkTitle: "Apex Legend Tier Promotion & Custom Cast-Iron Trophy",
          type: "tier",
          xpThreshold: m4Xp || 20000,
          description: "Physical laser-engraved steel crest shipped to your door and permanent Hall of Champions entry.",
          valueTag: "Apex Immortality",
          icon: Crown,
        },
      ];
    }

    // Max Tier Apex fallback milestones
    return [
      {
        id: "m_apex_1",
        name: "Grandmaster Surge",
        perkTitle: "₹1,000 Monthly High-Protein Stipend",
        type: "voucher",
        xpThreshold: 22500,
        description: "Sponsored monthly grocery credit for elite whole-food recovery.",
        valueTag: "₹1,000 Voucher",
        icon: Store,
        voucherCode: "APEX-STIPEND-22K",
      },
      {
        id: "m_apex_2",
        name: "Omni-Legend",
        perkTitle: "Immortal Gold & Emerald Dual-Orbit Avatar Aura",
        type: "aura",
        xpThreshold: 25000,
        description: "Dual concentric rotating orbital particles on every leaderboard.",
        valueTag: "God-Tier Aura",
        icon: Crown,
      },
    ];
  }, [activeTier, nextTier]);

  // Determine current active milestone (first locked milestone)
  const nextMilestone = useMemo(() => {
    return milestones.find((m) => userXp < m.xpThreshold) || milestones[milestones.length - 1];
  }, [milestones, userXp]);

  // Fallback to active milestone if none inspected
  const inspectedMilestone = useMemo(() => {
    if (selectedMilestoneId) {
      return milestones.find((m) => m.id === selectedMilestoneId) || nextMilestone;
    }
    return nextMilestone;
  }, [selectedMilestoneId, milestones, nextMilestone]);

  // Overall roadmap progress between active tier base and target tier
  const tierBaseXp = activeTier.xpThreshold;
  const tierTargetXp = nextTier ? nextTier.xpThreshold : tierBaseXp + 5000;
  const totalTierSpan = Math.max(1, tierTargetXp - tierBaseXp);
  const currentProgressPercent = Math.min(
    100,
    Math.max(0, ((userXp - tierBaseXp) / totalTierSpan) * 100)
  );

  // Remaining XP to target next tier and to inspected milestone
  const xpToNextTier = Math.max(0, tierTargetXp - userXp);
  const xpToInspected = Math.max(0, inspectedMilestone.xpThreshold - userXp);

  // Recommended Actions tailored to closing the milestone gap
  const recommendedActions = useMemo(() => {
    const workoutsNeeded = Math.max(1, Math.ceil(xpToInspected / 250));
    const mealsNeeded = Math.max(1, Math.ceil(xpToInspected / 100));

    return [
      {
        id: "act_workout",
        title: `Log ${workoutsNeeded > 1 ? `${workoutsNeeded} Compound Sessions` : "1 Heavy Compound Session"}`,
        subtitle: "+250 XP per session • Squat, Deadlift, or Bench Press",
        category: "strength",
        xpValue: 250,
        icon: Dumbbell,
        badgeText: "High XP Yield",
        badgeColor: "bg-[#f7fe72] text-[#0B0E0C]",
        actionPrompt: "Log Heavy Iron (+250 XP)",
        impactDesc: `Completing 1 session closes ${Math.min(100, Math.round((250 / Math.max(1, xpToInspected)) * 100))}% of the milestone gap`,
        buttonColor: "bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C]",
      },
      {
        id: "act_meal",
        title: `Prepare ${mealsNeeded > 1 ? `${mealsNeeded} Kirana High-Protein Bowls` : "1 High-Protein Kirana Bowl"}`,
        subtitle: "+100 XP • Sourced sattu, fresh paneer or sprouted pulses",
        category: "nutrition",
        xpValue: 100,
        icon: Utensils,
        badgeText: "Daily Fuel",
        badgeColor: "bg-[#18201A] text-[#f7fe72] border border-[#757761]/40",
        actionPrompt: "Log Kirana Fuel (+100 XP)",
        impactDesc: `Direct whole-food fuel adherence pushes you +100 XP closer`,
        buttonColor: "bg-[#18201A] hover:bg-[#202b23] text-[#f7fe72] border border-[#757761]/50",
      },
      {
        id: "act_breathwork",
        title: "Complete 5-Min Box Breathing Reset",
        subtitle: "+120 XP • 4-4-4-4 Parasympathetic nervous down-regulation",
        category: "recovery",
        xpValue: 120,
        icon: Wind,
        badgeText: "Recovery Boost",
        badgeColor: "bg-[#757761]/25 text-[#CBD2C7]",
        actionPrompt: "Start Protocol (+120 XP)",
        impactDesc: "Reduces autonomic stress and accelerates muscle recovery score",
        buttonColor: "bg-[#121815] hover:bg-[#18201A] text-white border border-[#757761]/40",
      },
      {
        id: "act_water",
        title: "Hit 3.0L Daily Hydration Target",
        subtitle: "+80 XP • Cellular hydration and joint fluid lubrication",
        category: "recovery",
        xpValue: 80,
        icon: Droplets,
        badgeText: "Vitality Habit",
        badgeColor: "bg-[#757761]/20 text-[#A0A594]",
        actionPrompt: "Log 3.0L Water (+80 XP)",
        impactDesc: "Maintains optimal muscle protein synthesis and mental clarity",
        buttonColor: "bg-[#121815] hover:bg-[#18201A] text-white border border-[#757761]/40",
      },
      {
        id: "act_steps",
        title: "Sync 10,000 Daily Zone 1 Steps",
        subtitle: "+150 XP • Active metabolic burn & low-impact aerobic baseline",
        category: "strength",
        xpValue: 150,
        icon: Flame,
        badgeText: "Endurance",
        badgeColor: "bg-[#f7fe72]/20 text-[#f7fe72] border border-[#f7fe72]/30",
        actionPrompt: "Sync 10k Steps (+150 XP)",
        impactDesc: "Strengthens cardiovascular recovery without neuromuscular fatigue",
        buttonColor: "bg-gradient-to-r from-[#18201A] to-[#121815] text-[#f7fe72] border border-[#f7fe72]/40",
      },
    ];
  }, [xpToInspected]);

  // Filtered actions based on category tab
  const filteredActions = useMemo(() => {
    if (actionCategory === "all") return recommendedActions;
    return recommendedActions.filter((a) => a.category === actionCategory);
  }, [recommendedActions, actionCategory]);

  const handleActionClick = (action: (typeof recommendedActions)[0]) => {
    onAddXp(action.xpValue, action.title);
    fireTierUnlockConfetti();
  };

  const handleClaim = (milestone: MilestoneWaypoint) => {
    if (onClaimPerk) {
      onClaimPerk(milestone.id, milestone.perkTitle);
    }
    fireTierUnlockConfetti();
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const InspectedIcon = inspectedMilestone.icon;
  const isInspectedUnlocked = userXp >= inspectedMilestone.xpThreshold;
  const isInspectedClaimed = !!claimedCodes[inspectedMilestone.id];

  return (
    <section
      aria-labelledby="roadmap-heading"
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#18201A] via-[#121815] to-[#0B0E0C] border border-[#757761]/35 p-6 sm:p-8 lg:p-10 shadow-2xl text-white ${className}`}
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#f7fe72]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#757761]/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header & Trajectory Stats */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#757761]/25">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121815] border border-[#f7fe72]/40 text-[#f7fe72] text-[11px] font-mono font-bold uppercase tracking-wider shadow-xs">
            <Target className="w-3.5 h-3.5 text-[#f7fe72]" />
            <span>ROADMAP TO NEXT TIER • {nextTier ? nextTier.name : "APEX SUPREMACY"}</span>
            <span className="text-[#757761]">·</span>
            <span className="text-[#CBD2C7]">GLOBAL #{userRank}</span>
          </div>

          <h2 id="roadmap-heading" className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Perk Unlocking Milestones &amp; Actions
          </h2>

          <p className="text-xs sm:text-sm text-[#CBD2C7] leading-relaxed">
            Your clear trajectory from <strong className="text-white">{activeTier.name}</strong> to{" "}
            <strong className="text-[#f7fe72]">{nextTier ? nextTier.name : "Max Tier"}</strong>. Inspect upcoming
            milestones, track unlock progress, and perform recommended daily actions to accelerate your promotion.
          </p>
        </div>

        {/* Velocity & Gap Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#0B0E0C]/80 border border-[#757761]/30 p-4 rounded-2xl shrink-0 backdrop-blur-md">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#A0A594] block font-semibold">
              Remaining to Next Tier
            </span>
            <span className="text-lg sm:text-xl font-black font-mono text-[#f7fe72] tabular-nums mt-0.5 block">
              {xpToNextTier.toLocaleString()} <span className="text-xs font-normal text-[#A0A594]">XP</span>
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-[#A0A594] block font-semibold">
              Current Progress
            </span>
            <span className="text-lg sm:text-xl font-black font-mono text-white tabular-nums mt-0.5 block">
              {Math.round(currentProgressPercent)}%
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-[#757761]/20 pt-2 sm:pt-0 sm:pl-3">
            <span className="text-[10px] font-mono uppercase text-[#A0A594] block font-semibold">
              Training Velocity
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#E2E7DE] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#f7fe72]" />
              ~380 XP/day
            </span>
            <span className="text-[10px] text-[#A0A594] block">
              Est. {Math.max(1, Math.ceil(xpToNextTier / 380))} days to tier unlock
            </span>
          </div>
        </div>
      </div>

      {/* 2. Visual Stepper / Interactive Milestone Rail */}
      <div className="relative z-10 py-8 border-b border-[#757761]/25">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#f7fe72]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Milestone Rail Waypoints
            </h3>
          </div>
          <span className="text-xs text-[#A0A594]">
            Click any node below to inspect rewards &amp; fast-track steps
          </span>
        </div>

        {/* Connected Milestone Progress Track */}
        <div className="relative pt-4 pb-2">
          {/* Background Connecting Rail */}
          <div className="absolute top-10 left-4 right-4 h-1.5 bg-black/60 rounded-full -translate-y-1/2 z-0 hidden sm:block">
            <div
              className="h-full bg-gradient-to-r from-[#757761] via-[#f4e76e] to-[#f7fe72] rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(247,254,114,0.4)]"
              style={{ width: `${currentProgressPercent}%` }}
            />
          </div>

          {/* Stepper Nodes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-3 relative z-10">
            {milestones.map((milestone, idx) => {
              const isUnlocked = userXp >= milestone.xpThreshold;
              const isNext = milestone.id === nextMilestone.id;
              const isSelected = milestone.id === inspectedMilestone.id;
              const MilestoneIcon = milestone.icon;
              const gap = Math.max(0, milestone.xpThreshold - userXp);

              return (
                <button
                  key={milestone.id}
                  onClick={() => setSelectedMilestoneId(milestone.id)}
                  className={`group relative text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-3 ${
                    isSelected
                      ? "bg-[#18201A] border-[#f7fe72] shadow-[0_0_25px_rgba(247,254,114,0.2)] scale-[1.02]"
                      : isUnlocked
                      ? "bg-black/40 border-[#757761]/40 hover:border-[#f7fe72]/50 hover:bg-[#18201A]/60"
                      : isNext
                      ? "bg-gradient-to-b from-[#18201A]/80 to-[#121815] border-[#f4e76e]/60 shadow-md"
                      : "bg-black/60 border-white/5 opacity-65 hover:opacity-90"
                  }`}
                >
                  {/* Node Icon Badge with Status Ring */}
                  <div className="flex items-center gap-3 sm:w-full sm:justify-between">
                    <div
                      className={`relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 ${
                        isUnlocked
                          ? "bg-[#f7fe72] text-[#0B0E0C] border-[#f7fe72] shadow-[0_0_15px_rgba(247,254,114,0.4)]"
                          : isNext
                          ? "bg-[#121815] text-[#f7fe72] border-[#f7fe72] animate-pulse"
                          : "bg-[#121815] text-[#757761] border-[#757761]/35"
                      }`}
                    >
                      <MilestoneIcon className="w-5 h-5" />
                      {isUnlocked && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#121815] border border-[#f7fe72] text-[#f7fe72] flex items-center justify-center text-[9px] font-black">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#CBD2C7] shrink-0">
                      Step 0{idx + 1}
                    </span>
                  </div>

                  {/* Title & XP */}
                  <div className="flex-1 sm:w-full min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs sm:text-sm text-white truncate block">
                        {milestone.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#f7fe72] block mt-0.5">
                      {milestone.xpThreshold.toLocaleString()} XP
                    </span>
                    <span className="text-[11px] text-[#A0A594] line-clamp-1 mt-0.5">
                      {milestone.perkTitle}
                    </span>
                  </div>

                  {/* Bottom Pill Status */}
                  <div className="shrink-0 sm:w-full sm:pt-2 sm:border-t sm:border-white/5">
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#f7fe72]">
                        <CheckCircle2 className="w-3 h-3 text-[#f7fe72]" />
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#A0A594]">
                        <Lock className="w-2.5 h-2.5" />
                        {gap.toLocaleString()} XP left
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Split Grid: Left Active Milestone Spotlight + Right Fast-Track Action Cards */}
      <div className="relative z-10 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Inspected Milestone Spotlight (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#0B0E0C]/90 border border-[#757761]/35 p-6 space-y-5 shadow-xl relative overflow-hidden backdrop-blur-md">
          {/* Ambient Corner Glint */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#f7fe72]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-[#757761]/25 pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A594] block font-semibold">
                MILESTONE SPOTLIGHT
              </span>
              <h4 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {inspectedMilestone.name}
              </h4>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-[#f7fe72]/15 border border-[#f7fe72]/40 text-[#f7fe72] text-[10px] font-mono font-bold uppercase tracking-wider">
              {inspectedMilestone.valueTag}
            </span>
          </div>

          {/* Perk Highlight Display */}
          <div className="p-4 rounded-2xl bg-[#121815] border border-[#757761]/40 flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#18201A] to-[#121815] border border-[#757761]/50 text-[#f7fe72] flex items-center justify-center shrink-0 shadow-inner">
              <InspectedIcon className="w-6 h-6" />
            </div>

            <div className="space-y-1 min-w-0">
              <span className="text-[10px] font-mono uppercase text-[#f7fe72] font-bold block">
                UNLOCKED REWARD
              </span>
              <h5 className="font-bold text-sm sm:text-base text-white leading-tight">
                {inspectedMilestone.perkTitle}
              </h5>
              <p className="text-xs text-[#CBD2C7] leading-relaxed pt-1">
                {inspectedMilestone.description}
              </p>
            </div>
          </div>

          {/* Progress / Status Block */}
          <div className="p-4 rounded-2xl bg-black/40 border border-[#757761]/25 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A0A594]">Milestone Target:</span>
              <span className="font-mono font-bold text-white">
                {inspectedMilestone.xpThreshold.toLocaleString()} XP
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#A0A594]">Your Current XP:</span>
              <span className="font-mono font-bold text-[#f7fe72]">
                {userXp.toLocaleString()} XP
              </span>
            </div>

            <div className="pt-2 border-t border-[#757761]/20">
              {isInspectedUnlocked ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#f7fe72]">
                    <CheckCircle2 className="w-4 h-4 text-[#f7fe72]" />
                    <span>Threshold Achieved! Perk is Ready</span>
                  </div>

                  {inspectedMilestone.voucherCode && (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-black/60 border border-[#757761]/50 text-xs font-mono font-bold text-[#f7fe72]">
                      <span className="truncate">{inspectedMilestone.voucherCode}</span>
                      <button
                        onClick={() => handleCopyCode(inspectedMilestone.voucherCode!)}
                        className="p-1 hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Copy voucher code"
                      >
                        {copiedCode === inspectedMilestone.voucherCode ? (
                          <Check className="w-3.5 h-3.5 text-[#f7fe72]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-[#A0A594]" />
                        )}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleClaim(inspectedMilestone)}
                    disabled={isInspectedClaimed}
                    className={`w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                      isInspectedClaimed
                        ? "bg-white/10 text-[#A0A594] border border-white/10 cursor-default"
                        : "bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:brightness-110 text-[#0B0E0C] active:scale-95"
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>{isInspectedClaimed ? "Reward Claimed" : "Claim Milestone Perk"}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A0A594]">Remaining to Unlock:</span>
                    <span className="font-mono font-bold text-[#f4e76e]">
                      {xpToInspected.toLocaleString()} XP
                    </span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#757761] to-[#f7fe72] rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            ((userXp - (inspectedMilestone.xpThreshold - 1500)) / 1500) * 100
                          )
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-[#A0A594] italic pt-1">
                    ⚡ Tip: Complete {Math.max(1, Math.ceil(xpToInspected / 250))} compound workouts or{" "}
                    {Math.max(1, Math.ceil(xpToInspected / 100))} Kirana meals to trigger this reward!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Fast-Track Recommended Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#f7fe72]" />
                <h4 className="text-base sm:text-lg font-black text-white">
                  Recommended Actions to Reach Next Tier
                </h4>
              </div>
              <p className="text-xs text-[#A0A594] mt-0.5">
                Execute specific training and nutrition protocols to bridge the {xpToInspected.toLocaleString()} XP gap.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-[#757761]/30 shrink-0">
              {(["all", "strength", "nutrition", "recovery"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActionCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    actionCategory === cat
                      ? "bg-[#f7fe72] text-[#0B0E0C] shadow-xs"
                      : "text-[#A0A594] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Action Cards Listing */}
          <div className="space-y-3">
            {filteredActions.map((action) => {
              const ActionIcon = action.icon;

              return (
                <article
                  key={action.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#121815] border border-[#757761]/35 hover:border-[#f7fe72]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md group"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#18201A] border border-[#757761]/40 text-[#f7fe72] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      <ActionIcon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-bold text-sm sm:text-base text-white leading-tight">
                          {action.title}
                        </h5>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${action.badgeColor}`}>
                          {action.badgeText}
                        </span>
                      </div>

                      <p className="text-xs text-[#CBD2C7]">
                        {action.subtitle}
                      </p>

                      <p className="text-[11px] text-[#A0A594] flex items-center gap-1 pt-0.5 font-mono">
                        <TrendingUp className="w-3 h-3 text-[#f7fe72]" />
                        <span>{action.impactDesc}</span>
                      </p>
                    </div>
                  </div>

                  {/* Interactive Quick-Log Action Button */}
                  <div className="shrink-0 flex items-center justify-end sm:border-l sm:border-[#757761]/25 sm:pl-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#757761]/20">
                    <button
                      onClick={() => handleActionClick(action)}
                      className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md ${action.buttonColor}`}
                      title={`Add ${action.xpValue} XP to your athlete account`}
                    >
                      <Zap className="w-3.5 h-3.5 shrink-0" />
                      <span>{action.actionPrompt}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Quick Velocity Footer Advice */}
          <div className="p-4 rounded-2xl bg-black/40 border border-[#757761]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#CBD2C7]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#f7fe72] shrink-0" />
              <span>
                <strong>Smart Pacing:</strong> 2 Compound Workouts + 1 Kirana Meal daily unlocks the next tier within 4 days.
              </span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#f4e76e]">
              <span>Arena Global Consensus</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#f7fe72] animate-ping" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
