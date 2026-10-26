"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Trophy,
  Crown,
  Lock,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Store,
} from "lucide-react";
import CanvasBadge, { BadgeTier, BadgeRarity, EmblemType } from "./CanvasBadge";
import { fireTierUnlockConfetti, fireBadgeEquipGlint } from "@/lib/confetti";

export interface RewardBadgeItem {
  id: string;
  name: string;
  tier: BadgeTier;
  rarity: BadgeRarity;
  emblem: EmblemType;
  requirement: string;
  lore: string;
  isUnlocked: boolean;
}

export interface DigitalPerkItem {
  id: string;
  title: string;
  type: "voucher" | "aura" | "feature" | "perk";
  valueDescription: string;
  voucherCode?: string;
  isUnlocked: boolean;
  isClaimed: boolean;
}

export interface TierData {
  id: BadgeTier;
  tierNumber: number;
  name: string;
  title: string;
  xpThreshold: number;
  rankThreshold: string;
  accentGlow: string;
  gradientText: string;
  tagline: string;
  badges: RewardBadgeItem[];
  perks: DigitalPerkItem[];
}

interface RewardTiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentXp: number;
  currentRank: number;
  equippedBadgeId?: string;
  onEquipBadge?: (badgeId: string, badgeName: string) => void;
  onTriggerConfetti?: () => void;
}

export default function RewardTiersModal({
  isOpen,
  onClose,
  currentXp,
  currentRank,
  equippedBadgeId = "apex_contender",
  onEquipBadge,
  onTriggerConfetti,
}: RewardTiersModalProps) {
  // Selected tier for inspection
  const [selectedTierId, setSelectedTierId] = useState<BadgeTier>("gold");

  // Selected badge for deep inspection within tier
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>("apex_contender");

  // Active equipped badge
  const [activeBadge, setActiveBadge] = useState<string>(equippedBadgeId);

  // Claimed Rewards state tracking with simulated persistence
  const [claimedCodes, setClaimedCodes] = useState<Record<string, string>>({
    rew_kirana_50: "KIRANA-BRONZE-50",
    rew_avatar_ring: "ACTIVATED",
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keyboard shortcut (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Master Tier Data Structure
  const tiers: TierData[] = [
    {
      id: "bronze",
      tierNumber: 1,
      name: "Bronze Pioneer",
      title: "Foundational Vitality",
      xpThreshold: 0,
      rankThreshold: "Open to All Contenders",
      accentGlow: "rgba(217, 119, 6, 0.25)",
      gradientText: "from-amber-400 via-amber-200 to-amber-500",
      tagline: "Foundational mastery of hyper-local nutrition & introductory mobility habits.",
      badges: [
        {
          id: "kirana_scout",
          name: "Kirana Scout",
          tier: "bronze",
          rarity: "Common",
          emblem: "leaf",
          requirement: "Log 3 meals sourced directly from neighborhood vendors or street markets.",
          lore: "Recognizes athletes who uncover pure local power in roasted sattu, seasonal mustard greens, and market paneer.",
          isUnlocked: true,
        },
        {
          id: "pacer_novice",
          name: "Pacer Novice",
          tier: "bronze",
          rarity: "Common",
          emblem: "compass",
          requirement: "Complete first 3 verified hypertrophy or mobility routines in FitMeal.",
          lore: "Neuromuscular adaptation begins here. The initial sessions forge the motor patterns of a champion.",
          isUnlocked: true,
        },
      ],
      perks: [
        {
          id: "rew_radar_basic",
          title: "FitMeal Hyper-Local Macro Radar",
          type: "feature",
          valueDescription: "Unlocks live ingredient swap matrix & radius pricing within 5km.",
          isUnlocked: true,
          isClaimed: true,
        },
        {
          id: "rew_kirana_50",
          title: "₹50 Kirana Fuel Grocery Voucher",
          type: "voucher",
          valueDescription: "Redeemable at South Delhi grain merchants & fresh street vendors.",
          voucherCode: "KIRANA-BRONZE-50",
          isUnlocked: true,
          isClaimed: true,
        },
      ],
    },
    {
      id: "silver",
      tierNumber: 2,
      name: "Silver Vanguard",
      title: "Progressive Overload",
      xpThreshold: 2500,
      rankThreshold: "Top 200 Contenders",
      accentGlow: "rgba(226, 231, 222, 0.25)",
      gradientText: "from-[#E2E7DE] via-[#CBD2C7] to-[#A0A594]",
      tagline: "Demonstrated discipline, compound mechanical tension, and strict hydration adherence.",
      badges: [
        {
          id: "hypertrophy_grinder",
          name: "Hypertrophy Grinder",
          tier: "silver",
          rarity: "Rare",
          emblem: "dumbbell",
          requirement: "Accumulate 15,000kg of cumulative mechanical work across squat, deadlift, and press.",
          lore: "Forged in compound iron. Every rep verified through progressive overload logs.",
          isUnlocked: currentXp >= 2500,
        },
        {
          id: "hydration_disciplined",
          name: "Hydration Disciplined",
          tier: "silver",
          rarity: "Rare",
          emblem: "lightning",
          requirement: "Hit 3.0L daily water intake for 10 consecutive logged days.",
          lore: "Cellular hydration drives protein synthesis, cognitive latency, and muscular recovery.",
          isUnlocked: currentXp >= 2500,
        },
      ],
      perks: [
        {
          id: "rew_avatar_ring",
          title: "Silver Vanguard Avatar Ring",
          type: "aura",
          valueDescription: "Brushed platinum and silver contour surrounding your arena nameplate.",
          isUnlocked: currentXp >= 2500,
          isClaimed: true,
        },
        {
          id: "rew_audio_breath",
          title: "Box Breathing Guided Frequencies",
          type: "perk",
          valueDescription: "Unlocks 4 binaural recovery frequencies inside the 5-minute parasympathetic visualizer.",
          isUnlocked: currentXp >= 2500,
          isClaimed: !!claimedCodes["rew_audio_breath"],
        },
      ],
    },
    {
      id: "gold",
      tierNumber: 3,
      name: "Gold Champion",
      title: "Apex Contender",
      xpThreshold: 5000,
      rankThreshold: "Top 50 Global (Active Tier)",
      accentGlow: "rgba(245, 158, 11, 0.3)",
      gradientText: "from-amber-200 via-yellow-400 to-amber-500",
      tagline: "Elite contenders dominating South Delhi regional and global competitive boards.",
      badges: [
        {
          id: "apex_contender",
          name: "Apex Contender",
          tier: "gold",
          rarity: "Epic",
          emblem: "trophy",
          requirement: "Breach the Global Top 50 (#42 active) with 5,000+ verified Arena XP.",
          lore: "Reserved for the upper 1% of athletes who master kitchen precision and floor discipline in synergy.",
          isUnlocked: currentXp >= 5000,
        },
        {
          id: "sourcing_maestro",
          name: "Sourcing Maestro",
          tier: "gold",
          rarity: "Epic",
          emblem: "leaf",
          requirement: "Prepare 15 high-protein meals under ₹120 using seasonal greens and street pulses.",
          lore: "Proving world-class hypertrophy does not demand imported synthetic isolates.",
          isUnlocked: currentXp >= 5000,
        },
        {
          id: "unbroken_steel",
          name: "Unbroken Steel",
          tier: "gold",
          rarity: "Epic",
          emblem: "flame",
          requirement: "Maintain a 14-day unbroken vitality streak with daily mobility & sleep logs.",
          lore: "Consistency triumphs over circumstance. The streak burns unwavering.",
          isUnlocked: currentXp >= 5000,
        },
      ],
      perks: [
        {
          id: "rew_kirana_250",
          title: "₹250 Local Kirana Fuel Voucher",
          type: "voucher",
          valueDescription: "Direct grocery balance for sattu, paneer, sprouts, and nuts at verified Delhi merchants.",
          voucherCode: "KIRANA-APEX-8420",
          isUnlocked: currentXp >= 5000,
          isClaimed: !!claimedCodes["rew_kirana_250"],
        },
        {
          id: "rew_arena_glow",
          title: "Gold Shimmer Arena Row Glow",
          type: "aura",
          valueDescription: "Illuminates your position on live leaderboards with an animated golden shimmer halo.",
          isUnlocked: currentXp >= 5000,
          isClaimed: !!claimedCodes["rew_arena_glow"],
        },
        {
          id: "rew_coach_priority",
          title: "Coach Priority Video Queue",
          type: "perk",
          valueDescription: "Guaranteed same-day booking window with Coach Sarah Jenkins & Dr. Marcus Vance.",
          isUnlocked: currentXp >= 5000,
          isClaimed: !!claimedCodes["rew_coach_priority"],
        },
      ],
    },
    {
      id: "emerald",
      tierNumber: 4,
      name: "Emerald Titan",
      title: "Biomechanical Vanguard",
      xpThreshold: 10000,
      rankThreshold: "Top 25 Contenders",
      accentGlow: "rgba(247, 254, 114, 0.35)",
      gradientText: "from-[#CBD2C7] via-[#f7fe72] to-[#f4e76e]",
      tagline: "Masters of physical resilience, sustainable clean fueling, and local community leadership.",
      badges: [
        {
          id: "sub_25_elite",
          name: "Sub-25 Elite",
          tier: "emerald",
          rarity: "Epic",
          emblem: "shield",
          requirement: "Reach and defend a Top 25 ranking globally for at least 7 consecutive days.",
          lore: "Dictating the tournament pace. You inspire the entire South Delhi cohort.",
          isUnlocked: currentXp >= 10000,
        },
        {
          id: "centurion_lifter",
          name: "Centurion Lifter",
          tier: "emerald",
          rarity: "Legendary",
          emblem: "dumbbell",
          requirement: "Log over 50,000kg cumulative volume in compound movements.",
          lore: "Fifty tons moved with textbook precision, zero ego lifting, and perfect cadence.",
          isUnlocked: currentXp >= 10000,
        },
      ],
      perks: [
        {
          id: "rew_emerald_particles",
          title: "Emerald Particle Profile Halo",
          type: "aura",
          valueDescription: "Continuous floating jade embers orbiting your profile badge across the entire platform.",
          isUnlocked: currentXp >= 10000,
          isClaimed: !!claimedCodes["rew_emerald_particles"],
        },
        {
          id: "rew_farm_box",
          title: "₹500 Organic Farm Direct Credit",
          type: "voucher",
          valueDescription: "Covers cold-pressed oils, unpolished farm lentils, and artisanal tofu deliveries.",
          voucherCode: "FARM-DIRECT-TITAN",
          isUnlocked: currentXp >= 10000,
          isClaimed: !!claimedCodes["rew_farm_box"],
        },
      ],
    },
    {
      id: "apex",
      tierNumber: 5,
      name: "Apex Legend",
      title: "Immortal Pantheon",
      xpThreshold: 20000,
      rankThreshold: "Top 10 Grandmasters",
      accentGlow: "rgba(247, 254, 114, 0.45)",
      gradientText: "from-[#f7fe72] via-[#f4e76e] to-[#CBD2C7]",
      tagline: "The immortal pantheon of FitMeal athletes. Absolute perfection of nutrition & power output.",
      badges: [
        {
          id: "crown_of_olympus",
          name: "Crown of Olympus",
          tier: "apex",
          rarity: "Legendary",
          emblem: "crown",
          requirement: "Finish in the Top 3 of an official 30-day global tournament season.",
          lore: "Permanent inscription in the FitMeal Hall of Champions for all future seasons.",
          isUnlocked: currentXp >= 20000,
        },
        {
          id: "omni_master",
          name: "Omni-Discipline Master",
          tier: "apex",
          rarity: "Legendary",
          emblem: "star",
          requirement: "Score 95%+ simultaneously in Sleep Readiness, Nutrition Adherence, and Volume.",
          lore: "A bio-harmonized athlete functioning at the peak of human capability.",
          isUnlocked: currentXp >= 20000,
        },
      ],
      perks: [
        {
          id: "rew_physical_trophy",
          title: "Custom Cast-Iron Apex Trophy",
          type: "perk",
          valueDescription: "Laser-engraved steel crest with your name and season rank shipped to your home.",
          isUnlocked: currentXp >= 20000,
          isClaimed: !!claimedCodes["rew_physical_trophy"],
        },
        {
          id: "rew_grocery_stipend",
          title: "₹2,000 Monthly Kirana Stipend",
          type: "voucher",
          valueDescription: "Sponsored recurring monthly grocery credit for your optimal high-protein meal prep.",
          voucherCode: "APEX-STIPEND-LEGEND",
          isUnlocked: currentXp >= 20000,
          isClaimed: !!claimedCodes["rew_grocery_stipend"],
        },
      ],
    },
  ];

  // Current active tier (for David Kim: Gold Champion with 8,420 XP)
  const activeTier = tiers.find((t) => currentXp >= t.xpThreshold && (t.id === "apex" || currentXp < 10000)) || tiers[2];
  const inspectedTier = tiers.find((t) => t.id === selectedTierId) || activeTier;

  // Find inspected badge object
  const allBadges = tiers.flatMap((t) => t.badges);
  const activeInspectedBadge =
    allBadges.find((b) => b.id === selectedBadgeId) || inspectedTier.badges[0];

  // Milestone progression mathematics
  const nextTierIndex = tiers.findIndex((t) => t.id === activeTier.id) + 1;
  const nextTier = nextTierIndex < tiers.length ? tiers[nextTierIndex] : null;
  const xpNeeded = nextTier ? Math.max(0, nextTier.xpThreshold - currentXp) : 0;
  const tierSpan = nextTier ? nextTier.xpThreshold - activeTier.xpThreshold : 10000;
  const tierProgressPercent = nextTier
    ? Math.min(100, Math.max(0, ((currentXp - activeTier.xpThreshold) / tierSpan) * 100))
    : 100;

  // Claim digital reward handler
  const handleClaim = (perk: DigitalPerkItem) => {
    if (!perk.isUnlocked) return;
    const code = perk.voucherCode || `KIRANA-${perk.id.replace("rew_", "").toUpperCase()}`;
    setClaimedCodes((prev) => ({ ...prev, [perk.id]: code }));
    setToastMessage(`🎁 Claimed ${perk.title}!`);
    fireTierUnlockConfetti();
    if (onTriggerConfetti) onTriggerConfetti();
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Equip badge handler
  const handleEquip = (badge: RewardBadgeItem) => {
    if (!badge.isUnlocked) return;
    setActiveBadge(badge.id);
    if (onEquipBadge) {
      onEquipBadge(badge.id, badge.name);
    }
    setToastMessage(`🛡️ Equipped "${badge.name}" to your athlete profile!`);
    fireBadgeEquipGlint();
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Copy code handler
  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <dialog
      open
      aria-modal="true"
      aria-labelledby="reward-tiers-modal-title"
      className="fixed inset-0 z-50 m-0 w-screen h-screen max-w-none max-h-none p-2 sm:p-4 md:p-6 lg:p-8 bg-black/85 backdrop-blur-xl flex items-center justify-center animate-in fade-in duration-200 border-none overflow-hidden"
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-60 bg-[#121815] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-2xl border border-[#f7fe72]/50 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f7fe72] animate-spin" />
          <span className="text-[11px] sm:text-xs text-white">{toastMessage}</span>
        </div>
      )}

      {/* Main Semantic Card Container */}
      <div className="relative w-full max-w-5xl max-h-[96vh] sm:max-h-[92vh] rounded-2xl sm:rounded-3xl bg-[#121815] text-[#E2E7DE] shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-[#757761]/40 flex flex-col overflow-hidden font-sans">
        
        {/* Radial Ambient Lighting Glows */}
        <div
          className="absolute -top-32 -right-32 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-700"
          style={{ background: inspectedTier.accentGlow }}
        />
        <div className="absolute -bottom-24 -left-24 w-60 sm:w-80 h-60 sm:h-80 bg-[#757761]/15 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Semantic Header with Responsive Sizing */}
        <header className="relative z-10 px-4 sm:px-6 md:px-8 py-3.5 sm:py-5 border-b border-[#757761]/25 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#757761]/20 border border-[#757761]/40 flex items-center justify-center shadow-inner shrink-0">
              <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-[#f7fe72]" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.2em] font-bold text-[#f7fe72] truncate">
                  GLOBAL ARENA // SEASON 4
                </span>
                <span className="text-white/30 text-xs hidden sm:inline">/</span>
                <span className="text-[10px] sm:text-xs text-[#A0A594] font-medium hidden sm:inline">Prestige Progression</span>
              </div>
              <h2
                id="reward-tiers-modal-title"
                className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-white mt-0.5 truncate"
              >
                Reward Tiers &amp; Badges
              </h2>
            </div>
          </div>

          {/* User Live Rank Badge & Close button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop / Tablet status badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B0E0C] border border-[#757761]/35 backdrop-blur-md">
              <span className="text-xs text-[#CBD2C7] font-medium">David Kim</span>
              <span className="w-1 h-1 rounded-full bg-[#f7fe72]" />
              <span className="text-xs font-mono font-bold text-[#f7fe72]">#{currentRank} Global</span>
              <span className="w-1 h-1 rounded-full bg-[#757761]" />
              <span className="text-xs font-mono font-bold text-[#f4e76e]">{currentXp.toLocaleString()} XP</span>
            </div>

            {/* Mobile compact badge */}
            <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0B0E0C] border border-[#757761]/35 text-[10px] font-mono">
              <span className="font-bold text-[#f7fe72]">#{currentRank}</span>
              <span className="text-white/20">·</span>
              <span className="font-bold text-[#f4e76e]">{currentXp.toLocaleString()} XP</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-[#A0A594] hover:text-white border border-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </header>

        {/* 2. Semantic Milestone Beam Track with Responsive Scales */}
        <nav aria-label="Reward Tiers Progression" className="relative z-10 px-3 sm:px-6 md:px-8 py-2.5 sm:py-4 bg-[#0B0E0C]/60 border-b border-[#757761]/20 shrink-0">
          <div className="grid grid-cols-5 gap-1 sm:gap-3 md:gap-4 relative">
            
            {/* Background connecting track */}
            <div className="absolute top-5 sm:top-6 left-6 right-6 h-0.5 bg-white/10 -z-10" />
            {/* Active filled connecting line */}
            <div
              className="absolute top-5 sm:top-6 left-6 h-0.5 bg-gradient-to-r from-[#757761] via-[#f7fe72] to-[#f4e76e] -z-10 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(10, ((activeTier.tierNumber - 0.5) / 5) * 100))}%` }}
            />

            {tiers.map((tier) => {
              const isSelected = selectedTierId === tier.id;
              const isUserCurrent = activeTier.id === tier.id;
              const isUnlocked = currentXp >= tier.xpThreshold;

              return (
                <button
                  key={tier.id}
                  onClick={() => {
                    setSelectedTierId(tier.id);
                    setSelectedBadgeId(tier.badges[0].id);
                  }}
                  className={`group flex flex-col items-center gap-1 p-1 sm:p-2 rounded-xl sm:rounded-2xl transition-all cursor-pointer text-center relative ${
                    isSelected
                      ? "bg-[#757761]/25 border border-[#f7fe72]/50 shadow-lg scale-102"
                      : "hover:bg-white/5"
                  }`}
                >
                  {/* Canvas Mini Node */}
                  <div className="relative">
                    <CanvasBadge
                      tier={tier.id}
                      emblem={tier.badges[0].emblem}
                      size={38}
                      isUnlocked={isUnlocked}
                      interactive={false}
                    />

                    {isUserCurrent && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#f7fe72] ring-2 ring-[#121815] animate-pulse" />
                    )}
                  </div>

                  <div className="space-y-0.5 w-full">
                    <span
                      className={`text-[10px] sm:text-xs font-bold block truncate ${
                        isSelected ? "text-white" : isUnlocked ? "text-[#CBD2C7]" : "text-[#757761]"
                      }`}
                    >
                      {tier.name.split(" ")[0]} <span className="hidden sm:inline">{tier.name.split(" ")[1]}</span>
                    </span>

                    <span className="text-[8px] sm:text-[10px] font-mono text-[#A0A594] block truncate">
                      {tier.xpThreshold >= 1000 ? `${tier.xpThreshold / 1000}k` : tier.xpThreshold} XP
                    </span>
                  </div>

                  {isUserCurrent && (
                    <span className="text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider px-1 py-0.2 sm:px-1.5 rounded bg-[#757761]/30 text-[#f7fe72] border border-[#757761]/50">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Linear Progress Sub-bar for Current Milestone */}
          {nextTier && (
            <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-3 border-t border-[#757761]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
              <div className="flex items-center gap-1.5 text-[#CBD2C7] truncate">
                <Sparkles className="w-3.5 h-3.5 text-[#f7fe72] shrink-0" />
                <span className="truncate">
                  Target: <strong className="text-white">{nextTier.name}</strong> ({nextTier.xpThreshold.toLocaleString()} XP)
                </span>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2.5">
                <span className="font-mono text-[#f7fe72] font-bold text-[10px] sm:text-xs">
                  {xpNeeded.toLocaleString()} XP left ({Math.round(tierProgressPercent)}%)
                </span>
                <div className="w-24 sm:w-36 h-1.5 sm:h-2 bg-[#0B0E0C] border border-[#757761]/30 rounded-full overflow-hidden p-0.5 shrink-0">
                  <div
                    className="h-full bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] rounded-full transition-all duration-500"
                    style={{ width: `${tierProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* 3. Main Split View: Left Showcase (Canvas Medal) + Right Unlocks */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8">
          
          {/* Left Column: Canvas Medal Showcase & Lore (5 cols) */}
          <section
            aria-labelledby="medal-showcase-heading"
            className="lg:col-span-5 rounded-2xl sm:rounded-3xl bg-[#0B0E0C]/70 border border-[#757761]/35 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-md"
          >
            <div className="space-y-4 sm:space-y-5">
              
              {/* Header inside showcase */}
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.2em] font-bold text-[#f7fe72] block truncate">
                    TIER {inspectedTier.tierNumber} EMBLEM
                  </span>
                  <h3 id="medal-showcase-heading" className="text-lg sm:text-xl font-black text-white mt-0.5 truncate">
                    {inspectedTier.name}
                  </h3>
                </div>

                <div className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-mono text-[#CBD2C7] shrink-0">
                  {inspectedTier.rankThreshold}
                </div>
              </div>

              {/* Central Canvas Badge Display */}
              <div className="flex flex-col items-center justify-center py-2 sm:py-4 relative">
                {/* Metallic Bloom Ring */}
                <div
                  className="absolute w-36 sm:w-44 h-36 sm:h-44 rounded-full blur-2xl pointer-events-none opacity-50"
                  style={{ background: inspectedTier.accentGlow }}
                />

                <CanvasBadge
                  tier={activeInspectedBadge.tier}
                  rarity={activeInspectedBadge.rarity}
                  emblem={activeInspectedBadge.emblem}
                  size={115}
                  isUnlocked={activeInspectedBadge.isUnlocked}
                  className="z-10"
                />

                <div className="text-center mt-2.5 sm:mt-3 z-10">
                  <div className="flex items-center justify-center gap-1.5">
                    <h4 className="text-base sm:text-lg font-bold text-white">{activeInspectedBadge.name}</h4>
                    {activeBadge === activeInspectedBadge.id && (
                      <span className="text-[9px] sm:text-[10px] bg-[#f7fe72]/20 text-[#f7fe72] border border-[#f7fe72]/30 px-2 py-0.2 rounded-full font-mono">
                        EQUIPPED
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] sm:text-xs font-mono text-[#f4e76e] font-semibold">
                    {activeInspectedBadge.rarity} Medal
                  </span>
                </div>
              </div>

              {/* Badge Switcher Row */}
              <div className="space-y-1.5">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-[#A0A594] block">
                  Badges in this Tier ({inspectedTier.badges.length})
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {inspectedTier.badges.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBadgeId(b.id)}
                      className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer text-left shrink-0 ${
                        selectedBadgeId === b.id
                          ? "bg-[#757761]/25 border-[#f7fe72]/60 shadow-md"
                          : "bg-white/5 border-white/5 hover:bg-white/10 opacity-70"
                      }`}
                    >
                      <CanvasBadge
                        tier={b.tier}
                        emblem={b.emblem}
                        size={28}
                        isUnlocked={b.isUnlocked}
                        interactive={false}
                      />
                      <div className="text-[11px] sm:text-xs">
                        <span className="font-bold text-white block truncate max-w-[85px] sm:max-w-[100px]">{b.name}</span>
                        <span className="text-[9px] sm:text-[10px] text-[#A0A594]">{b.rarity}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirement & Lore Text with Responsive Typographic Scale */}
              <div className="space-y-2 text-[11px] sm:text-xs">
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#0B0E0C] border border-[#757761]/25">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase text-[#A0A594] block mb-1">
                    Unlock Requirement
                  </span>
                  <p className="text-[#E2E7DE] leading-relaxed font-medium">
                    {activeInspectedBadge.requirement}
                  </p>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-[#757761]/15 border border-[#757761]/30">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase text-[#A0A594] block mb-1">
                    Prestige Lore
                  </span>
                  <p className="text-[#E2E7DE] italic leading-relaxed">
                    &ldquo;{activeInspectedBadge.lore}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Equip Action */}
            <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-white/10">
              {activeInspectedBadge.isUnlocked ? (
                <button
                  onClick={() => handleEquip(activeInspectedBadge)}
                  className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                    activeBadge === activeInspectedBadge.id
                      ? "bg-white/10 text-[#CBD2C7] border border-white/20"
                      : "bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:brightness-110 text-[#0B0E0C] font-black shadow-[#f7fe72]/20"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {activeBadge === activeInspectedBadge.id ? "Currently Equipped on Profile" : "Equip Badge to Arena Profile"}
                  </span>
                </button>
              ) : (
                <div className="w-full py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-[#A0A594] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#757761]" />
                  <span>Locked — Reach {inspectedTier.xpThreshold.toLocaleString()} XP to Unlock</span>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Digital Perks, Fuel Vouchers & Tier Privileges (7 cols) */}
          <section aria-labelledby="tier-perks-heading" className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* Tier Overview Banner */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#0B0E0C]/70 border border-[#757761]/35 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold">
                <span className="text-[#f7fe72]">TIER {inspectedTier.tierNumber} PRIVILEGES</span>
                <span className="text-white/20">·</span>
                <span className="text-[#CBD2C7] truncate">{inspectedTier.title}</span>
              </div>
              <h3 id="tier-perks-heading" className="text-lg sm:text-2xl font-black text-white">
                Unlockable Perks &amp; Fuel Credits
              </h3>
              <p className="text-[11px] sm:text-xs md:text-sm text-[#A0A594] leading-relaxed">
                {inspectedTier.tagline}
              </p>
            </div>

            {/* Perks Listing */}
            <div className="space-y-2.5 sm:space-y-3">
              {inspectedTier.perks.map((perk) => {
                const isClaimed = !!claimedCodes[perk.id] || perk.isClaimed;
                const code = claimedCodes[perk.id] || perk.voucherCode;
                const isUnlocked = perk.isUnlocked;

                return (
                  <article
                    key={perk.id}
                    className={`p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${
                      isClaimed
                        ? "bg-white/[0.02] border-white/5"
                        : isUnlocked
                        ? "bg-[#0B0E0C] border-[#757761]/35 hover:border-[#f7fe72]/50"
                        : "bg-white/[0.01] border-white/5 opacity-55"
                    }`}
                  >
                    <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 border ${
                          isUnlocked
                            ? "bg-[#757761]/20 text-[#f7fe72] border-[#757761]/40 shadow-inner"
                            : "bg-white/5 text-[#757761] border-white/5"
                        }`}
                      >
                        {perk.type === "voucher" ? (
                          <Store className="w-4 h-4 sm:w-5 sm:h-5 text-[#f7fe72]" />
                        ) : perk.type === "aura" ? (
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#f4e76e]" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#f7fe72]" />
                        )}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-white truncate">{perk.title}</h4>
                          <span className="text-[9px] sm:text-[10px] font-mono uppercase px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded bg-white/10 text-[#CBD2C7] shrink-0">
                            {perk.type}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-[#A0A594] leading-relaxed line-clamp-2 sm:line-clamp-none max-w-md">
                          {perk.valueDescription}
                        </p>
                      </div>
                    </div>

                    {/* Claim Button / Voucher code */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      {isClaimed && code ? (
                        <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-[#0B0E0C] border border-[#757761]/40 text-[11px] sm:text-xs font-mono font-bold text-[#f7fe72]">
                          <span>{code}</span>
                          <button
                            onClick={() => handleCopy(perk.id, code)}
                            className="p-1 hover:bg-white/10 rounded text-[#A0A594] hover:text-white cursor-pointer"
                            title="Copy code"
                          >
                            {copiedId === perk.id ? (
                              <Check className="w-3.5 h-3.5 text-[#f7fe72]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => handleClaim(perk)}
                          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:brightness-110 text-[#0B0E0C] font-black text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shadow-md flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#0B0E0C]" />
                          <span>Claim Reward</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/5 border border-white/5 text-[11px] sm:text-xs font-medium text-[#757761]">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Season 4 Apex Ring Guarantee Callout */}
            <aside aria-label="End of season reward" className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#18201A] via-[#121815] to-[#0B0E0C] border border-[#757761]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[#f7fe72] shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    Season 4 Apex Ring Guarantee
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#A0A594] mt-0.5 leading-relaxed">
                    Athletes maintaining Gold Champion tier through season conclusion receive the commemorative brass ring.
                  </div>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-auto text-right">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase text-[#757761] block">Qualifier Status</span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-[#f7fe72] flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#f7fe72]" /> QUALIFIED
                </span>
              </div>
            </aside>
          </section>
        </main>

        {/* 4. Semantic Footer */}
        <footer className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-[#0B0E0C]/80 border-t border-[#757761]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#A0A594]">
            <span className="w-2 h-2 rounded-full bg-[#f7fe72] shrink-0" />
            <span className="truncate">
              Real-time synchronization with <strong>Uchitatvam</strong> global verified consensus ledger.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/15 text-xs sm:text-sm font-bold text-white transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </footer>
      </div>
    </dialog>
  );
}
