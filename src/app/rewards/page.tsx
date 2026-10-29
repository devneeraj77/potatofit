"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dropdown, Button, Label, Description } from "@heroui/react";
import {
  Trophy,
  Lock,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Store,
  ArrowRight,
  Dumbbell,
  LayoutDashboard,
  Gift,
  Utensils,
  ChevronDown,
  Compass,
  ArrowLeft,
} from "lucide-react";
import CanvasBadge, { BadgeTier, BadgeRarity, EmblemType } from "@/components/CanvasBadge";
import PotatoFitLogo from "@/components/PotatoFitLogo";
import { fireTierUnlockConfetti, fireBadgeEquipGlint } from "@/lib/confetti";
import RoadmapToNextTier from "@/components/RoadmapToNextTier";

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

export default function RewardsPage() {
  const router = useRouter();
  const [userXp, setUserXp] = useState(8420);
  const [userRank, setUserRank] = useState(42);
  const [selectedTierId, setSelectedTierId] = useState<BadgeTier>("gold");
  const [selectedBadgeId, setSelectedBadgeId] = useState<string>("apex_contender");
  const [equippedBadge, setEquippedBadge] = useState<{ id: string; name: string }>({
    id: "apex_contender",
    name: "Apex Contender",
  });

  const [claimedCodes, setClaimedCodes] = useState<Record<string, string>>({
    rew_kirana_50: "KIRANA-BRONZE-50",
    rew_avatar_ring: "ACTIVATED",
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
          isUnlocked: userXp >= 2500,
        },
        {
          id: "hydration_disciplined",
          name: "Hydration Disciplined",
          tier: "silver",
          rarity: "Rare",
          emblem: "lightning",
          requirement: "Hit 3.0L daily water intake for 10 consecutive logged days.",
          lore: "Cellular hydration drives protein synthesis, cognitive latency, and muscular recovery.",
          isUnlocked: userXp >= 2500,
        },
      ],
      perks: [
        {
          id: "rew_avatar_ring",
          title: "Silver Vanguard Avatar Ring",
          type: "aura",
          valueDescription: "Brushed platinum and silver contour surrounding your arena nameplate.",
          isUnlocked: userXp >= 2500,
          isClaimed: true,
        },
        {
          id: "rew_audio_breath",
          title: "Box Breathing Guided Frequencies",
          type: "perk",
          valueDescription: "Unlocks 4 binaural recovery frequencies inside the 5-minute parasympathetic visualizer.",
          isUnlocked: userXp >= 2500,
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
      accentGlow: "rgba(247, 254, 114, 0.35)",
      gradientText: "from-[#f4e76e] via-[#f7fe72] to-[#f4e76e]",
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
          isUnlocked: userXp >= 5000,
        },
        {
          id: "sourcing_maestro",
          name: "Sourcing Maestro",
          tier: "gold",
          rarity: "Epic",
          emblem: "leaf",
          requirement: "Prepare 15 high-protein meals under ₹120 using seasonal greens and street pulses.",
          lore: "Proving world-class hypertrophy does not demand imported synthetic isolates.",
          isUnlocked: userXp >= 5000,
        },
        {
          id: "unbroken_steel",
          name: "Unbroken Steel",
          tier: "gold",
          rarity: "Epic",
          emblem: "flame",
          requirement: "Maintain a 14-day unbroken vitality streak with daily mobility & sleep logs.",
          lore: "Consistency triumphs over circumstance. The streak burns unwavering.",
          isUnlocked: userXp >= 5000,
        },
      ],
      perks: [
        {
          id: "rew_kirana_250",
          title: "₹250 Local Kirana Fuel Voucher",
          type: "voucher",
          valueDescription: "Direct grocery balance for sattu, paneer, sprouts, and nuts at verified Delhi merchants.",
          voucherCode: "KIRANA-APEX-8420",
          isUnlocked: userXp >= 5000,
          isClaimed: !!claimedCodes["rew_kirana_250"],
        },
        {
          id: "rew_arena_glow",
          title: "Gold Shimmer Arena Row Glow",
          type: "aura",
          valueDescription: "Illuminates your position on live leaderboards with an animated golden shimmer halo.",
          isUnlocked: userXp >= 5000,
          isClaimed: !!claimedCodes["rew_arena_glow"],
        },
        {
          id: "rew_coach_priority",
          title: "Coach Priority Video Queue",
          type: "perk",
          valueDescription: "Guaranteed same-day booking window with Coach Sarah Jenkins & Dr. Marcus Vance.",
          isUnlocked: userXp >= 5000,
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
      accentGlow: "rgba(117, 119, 97, 0.35)",
      gradientText: "from-[#A0A594] via-[#CBD2C7] to-[#f7fe72]",
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
          isUnlocked: userXp >= 10000,
        },
        {
          id: "centurion_lifter",
          name: "Centurion Lifter",
          tier: "emerald",
          rarity: "Legendary",
          emblem: "dumbbell",
          requirement: "Log over 50,000kg cumulative volume in compound movements.",
          lore: "Fifty tons moved with textbook precision, zero ego lifting, and perfect cadence.",
          isUnlocked: userXp >= 10000,
        },
      ],
      perks: [
        {
          id: "rew_emerald_particles",
          title: "Solar Kinetic Profile Halo",
          type: "aura",
          valueDescription: "Continuous floating solar embers and sage kinetic particles orbiting your profile badge across the entire platform.",
          isUnlocked: userXp >= 10000,
          isClaimed: !!claimedCodes["rew_emerald_particles"],
        },
        {
          id: "rew_farm_box",
          title: "₹500 Organic Farm Direct Credit",
          type: "voucher",
          valueDescription: "Covers cold-pressed oils, unpolished farm lentils, and artisanal tofu deliveries.",
          voucherCode: "FARM-DIRECT-TITAN",
          isUnlocked: userXp >= 10000,
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
      gradientText: "from-[#CBD2C7] via-[#f4e76e] to-[#f7fe72]",
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
          isUnlocked: userXp >= 20000,
        },
        {
          id: "omni_master",
          name: "Omni-Discipline Master",
          tier: "apex",
          rarity: "Legendary",
          emblem: "star",
          requirement: "Score 95%+ simultaneously in Sleep Readiness, Nutrition Adherence, and Volume.",
          lore: "A bio-harmonized athlete functioning at the peak of human capability.",
          isUnlocked: userXp >= 20000,
        },
      ],
      perks: [
        {
          id: "rew_physical_trophy",
          title: "Custom Cast-Iron Apex Trophy",
          type: "perk",
          valueDescription: "Laser-engraved steel crest with your name and season rank shipped to your home.",
          isUnlocked: userXp >= 20000,
          isClaimed: !!claimedCodes["rew_physical_trophy"],
        },
        {
          id: "rew_grocery_stipend",
          title: "₹2,000 Monthly Kirana Stipend",
          type: "voucher",
          valueDescription: "Sponsored recurring monthly grocery credit for your optimal high-protein meal prep.",
          voucherCode: "APEX-STIPEND-LEGEND",
          isUnlocked: userXp >= 20000,
          isClaimed: !!claimedCodes["rew_grocery_stipend"],
        },
      ],
    },
  ];

  const activeTier =
    tiers.find(
      (t) => userXp >= t.xpThreshold && (t.id === "apex" || userXp < (tiers[tiers.indexOf(t) + 1]?.xpThreshold || Infinity))
    ) || tiers[2];

  const inspectedTier = tiers.find((t) => t.id === selectedTierId) || activeTier;

  const allBadges = tiers.flatMap((t) => t.badges);
  const activeInspectedBadge =
    allBadges.find((b) => b.id === selectedBadgeId) || inspectedTier.badges[0];

  const nextTierIndex = tiers.findIndex((t) => t.id === activeTier.id) + 1;
  const nextTier = nextTierIndex < tiers.length ? tiers[nextTierIndex] : null;
  const xpNeeded = nextTier ? Math.max(0, nextTier.xpThreshold - userXp) : 0;
  const tierSpan = nextTier ? nextTier.xpThreshold - activeTier.xpThreshold : 10000;
  const tierProgressPercent = nextTier
    ? Math.min(100, Math.max(0, ((userXp - activeTier.xpThreshold) / tierSpan) * 100))
    : 100;

  const handleBoostWorkout = () => {
    const newXp = userXp + 250;
    setUserXp(newXp);
    setUserRank((prev) => Math.max(8, prev - 3));
    setToastMessage("⚡ Logged Compound Session! +250 Arena XP awarded.");
    fireTierUnlockConfetti();
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBoostMeal = () => {
    const newXp = userXp + 100;
    setUserXp(newXp);
    setUserRank((prev) => Math.max(8, prev - 1));
    setToastMessage("🥗 Logged Local Kirana High-Protein Fuel! +100 XP awarded.");
    fireTierUnlockConfetti();
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClaim = (perk: DigitalPerkItem) => {
    if (!perk.isUnlocked) return;
    const code = perk.voucherCode || `KIRANA-${perk.id.replace("rew_", "").toUpperCase()}`;
    setClaimedCodes((prev) => ({ ...prev, [perk.id]: code }));
    setToastMessage(`🎁 Successfully Claimed ${perk.title}!`);
    fireTierUnlockConfetti();
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEquip = (badge: RewardBadgeItem) => {
    if (!badge.isUnlocked) return;
    setEquippedBadge({ id: badge.id, name: badge.name });
    setToastMessage(`🛡️ Equipped "${badge.name}" to your athlete profile!`);
    fireBadgeEquipGlint();
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddXpFromRoadmap = (amount: number, reason: string) => {
    const newXp = userXp + amount;
    setUserXp(newXp);
    setUserRank((prev) => Math.max(8, prev - Math.max(1, Math.ceil(amount / 90))));
    setToastMessage(`⚡ ${reason} (+${amount} Arena XP)`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClaimMilestonePerk = (perkId: string, title: string) => {
    const code = `KIRANA-MILESTONE-${Math.floor(1000 + Math.random() * 9000)}`;
    setClaimedCodes((prev) => ({ ...prev, [perkId]: code }));
    setToastMessage(`🎁 Successfully Claimed ${title}! Voucher Code: ${code}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopy = (id: string, code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F5] dark:bg-[#0B0E0C] text-[#121815] dark:text-[#E2E7DE] font-sans selection:bg-[#f7fe72] selection:text-[#0B0E0C] pb-24 transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-60 bg-gradient-to-r from-[#18201A] via-[#121815] to-[#18201A] text-[#f7fe72] px-5 py-2.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.8)] border border-[#f7fe72]/50 text-xs sm:text-sm font-bold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#f7fe72]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0B0E0C]/90 backdrop-blur-md border-b border-[#757761]/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7fe72] rounded-lg p-1"
            aria-label="Uchitatvam Home"
          >
            <PotatoFitLogo size="sm" variant="dark" />
          </Link>

          {/* HeroUI Arena Navigation Dropdown - Eliminates navbar overlaying & crowding */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Dropdown>
              <Button
                variant="secondary"
                className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e8ef63] border border-[#f7fe72]/50 rounded-xl transition-all shadow-[0_0_15px_rgba(247,254,114,0.2)] cursor-pointer active:scale-95"
                aria-label="Arena Portals & Navigation"
              >
                <Compass className="w-3.5 h-3.5 text-[#0B0E0C]" />
                <span>Arena Portals</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#0B0E0C]" />
              </Button>
              <Dropdown.Popover className="min-w-[240px] z-[70] p-1.5 bg-[#121815]/95 backdrop-blur-xl border border-[#757761]/40 rounded-2xl shadow-2xl">
                <Dropdown.Menu
                  aria-label="Arena Navigation Portals"
                  onAction={(key) => router.push(String(key))}
                  className="space-y-1 outline-none"
                >
                  <Dropdown.Item
                    id="/leaderboards"
                    textValue="Live Leaderboards"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer outline-none"
                  >
                    <div className="p-1.5 rounded-lg bg-[#f7fe72]/15 text-[#f7fe72] shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <Label className="text-xs font-bold text-white">Live Leaderboards</Label>
                      <Description className="text-[11px] text-[#A0A594]">Global rankings, streak race & tier stats</Description>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="/dashboard"
                    textValue="Personal Dashboard"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer outline-none"
                  >
                    <div className="p-1.5 rounded-lg bg-[#f4e76e]/15 text-[#f4e76e] shrink-0">
                      <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <Label className="text-xs font-bold text-white">Personal Dashboard</Label>
                      <Description className="text-[11px] text-[#A0A594]">Daily goals, health sync & workout logs</Description>
                    </div>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="/"
                    textValue="Public Home"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer outline-none border-t border-[#757761]/20 mt-1 pt-2"
                  >
                    <div className="p-1.5 rounded-lg bg-white/10 text-[#CBD2C7] shrink-0">
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <Label className="text-xs font-bold text-white">Public Homepage</Label>
                      <Description className="text-[11px] text-[#A0A594]">Return to Uchitatvam platform home</Description>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* 1. Hero Prestige Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EAEFEA] via-[#FFFFFF] to-[#F4F6F5] dark:from-[#18201A] dark:via-[#141A16] dark:to-[#0B0E0C] border border-[#757761]/30 dark:border-[#757761]/35 text-[#121815] dark:text-white p-6 sm:p-8 lg:p-10 shadow-2xl">
          {/* Subtle Ambient Glow Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#757761]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#f7fe72]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold tracking-wider">
                <span className="px-3 py-1 rounded-full bg-[#f7fe72] text-[#0B0E0C] font-black uppercase text-[11px] shadow-xs">
                  SEASON 4 PRESTIGE VAULT
                </span>
                <span className="text-[#505445] dark:text-white/30">·</span>
                <span className="text-[#7A5A00] dark:text-[#f4e76e] flex items-center gap-1.5 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#7A5A00] dark:text-[#f7fe72]" />
                  Hyper-Local Rewards &amp; Vouchers
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#121815] dark:text-white">
                Arena Reward Tiers &amp; Medals
              </h1>

              <p className="text-sm sm:text-base text-[#262A21] dark:text-[#CBD2C7] leading-relaxed">
                Elevate your athlete status through real-world biomechanical output and raw neighborhood fueling.
                Unlock high-protein Kirana grocery vouchers, digital aura rings, custom cast-iron trophies, and priority coaching queues.
              </p>

              {/* Quick Actions to Test XP Progression */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleBoostWorkout}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:from-[#f4e76e] hover:to-[#dfd158] text-[#0B0E0C] font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Dumbbell className="w-4 h-4 text-[#0B0E0C]" />
                  <span>Log Heavy Iron (+250 XP)</span>
                </button>

                <button
                  onClick={handleBoostMeal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#18201A] hover:bg-[#202b23] text-[#f7fe72] font-bold text-xs border border-[#757761]/40 transition-all cursor-pointer"
                >
                  <Utensils className="w-4 h-4 text-[#f7fe72]" />
                  <span>Log Kirana Fuel (+100 XP)</span>
                </button>
              </div>
            </div>

            {/* Active Athlete Scorecard */}
            <div className="bg-white dark:bg-[#101512]/80 backdrop-blur-md border border-[#757761]/25 dark:border-[#757761]/30 rounded-3xl p-5 sm:p-6 lg:w-96 space-y-4 shadow-xl dark:shadow-none">
              <div className="flex items-center justify-between border-b border-[#757761]/25 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#505445] dark:text-[#A0A594] block font-semibold">
                    ACTIVE ATHLETE
                  </span>
                  <div className="text-lg font-black text-[#121815] dark:text-white flex items-center gap-2 mt-0.5">
                    <span>David Kim</span>
                    <span className="text-[10px] bg-[#f7fe72] text-[#0B0E0C] px-2 py-0.5 rounded font-mono font-bold">
                      YOU
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#505445] dark:text-[#A0A594] block font-semibold">
                    GLOBAL RANK
                  </span>
                  <div className="text-xl font-black font-mono text-[#7A5A00] dark:text-[#f7fe72] mt-0.5">
                    #{userRank}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#A0A594]">Total Arena XP:</span>
                  <span className="font-black font-mono text-[#f7fe72] text-sm">
                    {userXp.toLocaleString()} XP
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#A0A594]">Active Tier:</span>
                  <span className="font-bold text-[#f7fe72]">{activeTier.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#A0A594]">Equipped Badge:</span>
                  <span className="font-bold text-[#E2E7DE] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#f7fe72]" />
                    {equippedBadge.name}
                  </span>
                </div>
              </div>

              {/* Progress to Next Tier */}
              {nextTier ? (
                <div className="pt-2 border-t border-[#757761]/25 space-y-2">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#CBD2C7]">
                      Next: <strong className="text-white">{nextTier.name}</strong>
                    </span>
                    <span className="font-mono text-[#f7fe72] font-bold">
                      {xpNeeded.toLocaleString()} XP left ({Math.round(tierProgressPercent)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#757761] to-[#f7fe72] rounded-full transition-all duration-500"
                      style={{ width: `${tierProgressPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-[#757761]/25 text-xs text-center font-bold text-[#f7fe72]">
                  👑 Max Tier Unlocked: Apex Legend!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2. Visual Roadmap to Next Tier & Milestone Quests */}
        <RoadmapToNextTier
          userXp={userXp}
          userRank={userRank}
          activeTier={activeTier}
          nextTier={nextTier}
          onAddXp={handleAddXpFromRoadmap}
          onClaimPerk={handleClaimMilestonePerk}
          claimedCodes={claimedCodes}
        />

        {/* 3. Interactive Tier Beam Progression */}
        <section className="bg-[#121815] border border-[#757761]/30 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#757761]/25 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#f7fe72] font-bold">
                PRESTIGE HIERARCHY
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Select Tier to Inspect Badges &amp; Perks
              </h2>
            </div>
            <span className="text-xs text-[#A0A594]">
              Click any tier below to browse its unlockable rewards
            </span>
          </div>

          {/* 5-Tier Clickable Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative">
            {tiers.map((tier) => {
              const isSelected = selectedTierId === tier.id;
              const isUserCurrent = activeTier.id === tier.id;
              const isUnlocked = userXp >= tier.xpThreshold;

              return (
                <button
                  key={tier.id}
                  onClick={() => {
                    setSelectedTierId(tier.id);
                    setSelectedBadgeId(tier.badges[0].id);
                  }}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all cursor-pointer text-center ${
                    isSelected
                      ? "bg-gradient-to-b from-[#18201A] to-[#121815] border-[#f7fe72] shadow-[0_0_25px_rgba(247,254,114,0.18)] scale-[1.02]"
                      : isUnlocked
                      ? "bg-black/40 border-[#757761]/30 hover:border-[#757761]/60"
                      : "bg-black/60 border-white/5 opacity-55 hover:opacity-75"
                  }`}
                >
                  <div className="relative">
                    <CanvasBadge
                      tier={tier.id}
                      emblem={tier.badges[0].emblem}
                      size={52}
                      isUnlocked={isUnlocked}
                      interactive={false}
                    />

                    {isUserCurrent && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#f7fe72] ring-4 ring-[#0B0E0C] animate-pulse" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">{tier.name}</h3>
                    <span className="text-[11px] font-mono text-[#f4e76e] block mt-0.5">
                      {tier.xpThreshold >= 1000 ? `${tier.xpThreshold / 1000}k` : tier.xpThreshold} XP
                    </span>
                  </div>

                  {isUserCurrent ? (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#f7fe72] text-[#0B0E0C]">
                      Active Tier
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#757761]/30 text-[#CBD2C7] border border-[#757761]/40">
                      Unlocked
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-[#757761] flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Locked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Split Showcase: Left Medal Showcase + Right Perks & Vouchers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Canvas Medal Showcase (5 cols) */}
          <section
            aria-labelledby="medal-showcase-heading"
            className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-[#FFFFFF] to-[#F4F6F5] dark:from-[#18201B] dark:to-[#101512] border border-[#757761]/25 dark:border-[#757761]/35 p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-md space-y-6 shadow-xl dark:shadow-none"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A5A00] dark:text-[#f7fe72] font-bold block">
                    TIER {inspectedTier.tierNumber} MEDAL
                  </span>
                  <h3 id="medal-showcase-heading" className="text-xl sm:text-2xl font-black text-[#121815] dark:text-white mt-0.5">
                    {inspectedTier.name}
                  </h3>
                </div>

                <div className="px-3 py-1 rounded-full bg-white/5 border border-[#757761]/30 text-xs font-mono text-[#CBD2C7]">
                  {inspectedTier.rankThreshold}
                </div>
              </div>

              {/* Big Canvas Badge */}
              <div className="flex flex-col items-center justify-center py-6 relative">
                <div
                  className="absolute w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-40 transition-all duration-700"
                  style={{ background: inspectedTier.accentGlow }}
                />

                <CanvasBadge
                  tier={activeInspectedBadge.tier}
                  rarity={activeInspectedBadge.rarity}
                  emblem={activeInspectedBadge.emblem}
                  size={140}
                  isUnlocked={activeInspectedBadge.isUnlocked}
                  className="z-10"
                />

                <div className="text-center mt-4 z-10 space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <h4 className="text-lg font-black text-white">{activeInspectedBadge.name}</h4>
                    {equippedBadge.id === activeInspectedBadge.id && (
                      <span className="text-[10px] bg-[#f7fe72] text-[#0B0E0C] px-2.5 py-0.5 rounded-full font-mono font-black">
                        EQUIPPED
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-[#f4e76e] font-semibold block">
                    {activeInspectedBadge.rarity} Heraldic Medal
                  </span>
                </div>
              </div>

              {/* Badges in this tier selection list */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#A0A594] block font-semibold">
                  Medals Available in This Tier ({inspectedTier.badges.length})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {inspectedTier.badges.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBadgeId(b.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                        selectedBadgeId === b.id
                          ? "bg-[#18201A] border-[#f7fe72] shadow-md"
                          : "bg-black/30 border-[#757761]/30 hover:bg-white/5 opacity-70"
                      }`}
                    >
                      <CanvasBadge
                        tier={b.tier}
                        emblem={b.emblem}
                        size={32}
                        isUnlocked={b.isUnlocked}
                        interactive={false}
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-white block truncate">{b.name}</span>
                        <span className="text-[10px] text-[#A0A594]">{b.rarity}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Requirement & Lore Text */}
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-[#757761]/25 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#A0A594] block font-semibold">
                    Unlock Requirement
                  </span>
                  <p className="text-[#E2E7DE] leading-relaxed font-medium">
                    {activeInspectedBadge.requirement}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#18201A] border border-[#757761]/30 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#A0A594] block font-semibold">
                    Prestige Lore
                  </span>
                  <p className="text-[#CBD2C7] italic leading-relaxed">
                    &ldquo;{activeInspectedBadge.lore}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Equip Button Action */}
            <div className="pt-4 border-t border-[#757761]/25">
              {activeInspectedBadge.isUnlocked ? (
                <button
                  onClick={() => handleEquip(activeInspectedBadge)}
                  className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                    equippedBadge.id === activeInspectedBadge.id
                      ? "bg-white/10 text-[#CBD2C7] border border-white/20"
                      : "bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:from-[#f4e76e] hover:to-[#dfd158] text-[#0B0E0C] shadow-[0_0_20px_rgba(247,254,114,0.2)]"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-[#0B0E0C]" />
                  <span>
                    {equippedBadge.id === activeInspectedBadge.id
                      ? "Currently Equipped on Public Profile"
                      : "Equip Badge to Leaderboard Profile"}
                  </span>
                </button>
              ) : (
                <div className="w-full py-3 rounded-xl bg-black/40 border border-[#757761]/30 text-[#A0A594] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4 text-[#757761]" />
                  <span>Locked — Reach {inspectedTier.xpThreshold.toLocaleString()} XP to Unlock</span>
                </div>
              )}
            </div>
          </section>

          {/* Right Column: Digital Perks & Grocery Vouchers (7 cols) */}
          <section aria-labelledby="tier-perks-heading" className="lg:col-span-7 space-y-6">
            
            {/* Tier Privileges Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#F4F6F5] via-[#FFFFFF] to-[#F4F6F5] dark:from-[#18201A] dark:via-[#121815] dark:to-transparent border border-[#757761]/25 dark:border-[#757761]/35 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span className="text-[#505445] dark:text-[#f7fe72]">TIER {inspectedTier.tierNumber} PRIVILEGES</span>
                <span className="text-white/20">·</span>
                <span className="text-[#CBD2C7] truncate">{inspectedTier.title}</span>
              </div>
              <h3 id="tier-perks-heading" className="text-2xl sm:text-3xl font-black text-[#121815] dark:text-white">
                Unlockable Perks &amp; Fuel Credits
              </h3>
              <p className="text-xs sm:text-sm text-[#A0A594] leading-relaxed">
                {inspectedTier.tagline}
              </p>
            </div>

            {/* Perks Listing */}
            <div className="space-y-4">
              {inspectedTier.perks.map((perk) => {
                const isClaimed = !!claimedCodes[perk.id] || perk.isClaimed;
                const code = claimedCodes[perk.id] || perk.voucherCode;
                const isUnlocked = perk.isUnlocked;

                return (
                  <article
                    key={perk.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isClaimed
                        ? "bg-black/30 border-[#757761]/20"
                        : isUnlocked
                        ? "bg-gradient-to-r from-[#18201A]/60 to-[#121815] border-[#757761]/40 hover:border-[#f7fe72]/50"
                        : "bg-black/40 border-[#757761]/20 opacity-55"
                    }`}
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                          isUnlocked
                            ? "bg-[#757761]/20 text-[#f7fe72] border-[#757761]/40 shadow-inner"
                            : "bg-white/5 text-[#757761] border-white/5"
                        }`}
                      >
                        {perk.type === "voucher" ? (
                          <Store className="w-6 h-6 text-[#f7fe72]" />
                        ) : perk.type === "aura" ? (
                          <Sparkles className="w-6 h-6 text-[#f4e76e]" />
                        ) : (
                          <ShieldCheck className="w-6 h-6 text-[#f7fe72]" />
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-white truncate">
                            {perk.title}
                          </h4>
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-[#A0A594] border border-white/10 shrink-0">
                            {perk.type}
                          </span>
                        </div>
                        <p className="text-xs text-[#A0A594] leading-relaxed">
                          {perk.valueDescription}
                        </p>
                      </div>
                    </div>

                    {/* Perk Action Buttons */}
                    <div className="shrink-0 flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#757761]/25">
                      {isClaimed ? (
                        <div className="flex items-center gap-2">
                          {code && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 border border-[#757761]/50 text-xs font-mono font-bold text-[#f7fe72]">
                              <span>{code}</span>
                              <button
                                onClick={() => handleCopy(perk.id, code)}
                                className="p-1 hover:text-white transition-colors cursor-pointer"
                                title="Copy voucher code"
                              >
                                {copiedId === perk.id ? (
                                  <Check className="w-3.5 h-3.5 text-[#f7fe72]" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-[#A0A594]" />
                                )}
                              </button>
                            </div>
                          )}
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#f7fe72]">
                            <CheckCircle2 className="w-4 h-4" />
                            Claimed
                          </span>
                        </div>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => handleClaim(perk)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:from-[#f4e76e] hover:to-[#dfd158] text-[#0B0E0C] font-black text-xs transition-all active:scale-95 cursor-pointer shadow-md flex items-center gap-1.5"
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>Claim Reward</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 text-[#757761] text-xs font-medium border border-[#757761]/25">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Kirana Voucher Explainer Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#18201A]/60 to-[#121815] border border-[#757761]/30 p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <Store className="w-5 h-5 text-[#f7fe72]" />
                <h4 className="text-base font-bold text-white">
                  How Hyper-Local Kirana Fuel Redemption Works
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#CBD2C7]">
                <div className="bg-black/40 p-3.5 rounded-2xl border border-[#757761]/30 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#f7fe72] text-[#0B0E0C] flex items-center justify-center text-[10px] font-black">1</span>
                    Claim Voucher
                  </div>
                  <p className="text-[#A0A594]">
                    Reach target XP threshold to unlock verified Kirana fuel vouchers in your city.
                  </p>
                </div>

                <div className="bg-black/40 p-3.5 rounded-2xl border border-[#757761]/30 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#f7fe72] text-[#0B0E0C] flex items-center justify-center text-[10px] font-black">2</span>
                    Visit Merchant
                  </div>
                  <p className="text-[#A0A594]">
                    Present your alphanumeric voucher at 5,200+ partner grocery &amp; street vendors.
                  </p>
                </div>

                <div className="bg-black/40 p-3.5 rounded-2xl border border-[#757761]/30 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#f7fe72] text-[#0B0E0C] flex items-center justify-center text-[10px] font-black">3</span>
                    Fuel &amp; Overload
                  </div>
                  <p className="text-[#A0A594]">
                    Take home fresh roasted sattu, seasonal greens, paneer, and lentils for peak recovery.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 4. Bottom Navigation CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-[#121815] border border-[#757761]/30">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-white">Ready to battle on the leaderboard?</h4>
            <p className="text-xs text-[#A0A594]">
              Check live standings, bump rivals, and see your rank climb in real time.
            </p>
          </div>

          <Link
            href="/leaderboards"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:from-[#f4e76e] hover:to-[#dfd158] text-[#0B0E0C] font-black text-xs sm:text-sm transition-all active:scale-95 shadow-lg cursor-pointer"
          >
            <span>Return to Live Standings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
