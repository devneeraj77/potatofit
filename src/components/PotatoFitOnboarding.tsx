"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Droplets,
  Footprints,
  Dumbbell,
  Flame,
  Zap,
  Trophy,
  ArrowRight,
  MapPin,
  Compass,
  CheckCircle2,
  Radar,
  ShoppingBag,
  Store,
  ChevronRight,
  Shield,
  Activity,
  Layers,
  Award,
  Globe2,
  X,
  RefreshCw,
  Search,
  Sparkle
} from "lucide-react";
import PotatoFitLogo from "./PotatoFitLogo";
import { fireTierUnlockConfetti } from "@/lib/confetti";

export type AthleteLevelId = "spud-rookie" | "street-athlete" | "apex-competitor";

export interface AthleteLevel {
  id: AthleteLevelId;
  name: string;
  tagline: string;
  tag: string;
  badgeColor: string;
  borderColor: string;
  glowColor: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  metrics: {
    hydration: string;
    movement: string;
    macroFocus: string;
    radiusTarget: string;
  };
  dailyQuestSnippet: string;
  targetUserGroup: string;
  xpBonus: string;
}

const ATHLETE_LEVELS: AthleteLevel[] = [
  {
    id: "spud-rookie",
    name: "Spud Rookie",
    tagline: "Just getting started, focusing on hitting water and step goals.",
    tag: "TIER 01 • FOUNDATION",
    badgeColor: "bg-[#757761]/20 text-[#f7fe72] border-[#757761]/35",
    borderColor: "hover:border-[#757761]/60",
    glowColor: "rgba(117, 119, 97, 0.25)",
    icon: Droplets,
    iconBg: "bg-[#757761]/20 text-[#f7fe72] border border-[#757761]/30",
    iconColor: "text-[#f7fe72]",
    metrics: {
      hydration: "3.0L Water / day",
      movement: "8,000 Baseline Steps",
      macroFocus: "2x Fresh Local Veggie Servings",
      radiusTarget: "2.5 km Local Produce Stalls",
    },
    dailyQuestSnippet: "Quest: Drink 1L before 10 AM & secure 1 seasonal green bunch.",
    targetUserGroup: "Zero intimidation, sustainable habit formation",
    xpBonus: "+250 XP Starting Surge",
  },
  {
    id: "street-athlete",
    name: "Street Athlete",
    tagline: "Workouts established, need hyper-local macro planning.",
    tag: "TIER 02 • OPTIMIZATION",
    badgeColor: "bg-[#f4e76e]/15 text-[#f4e76e] border-[#f4e76e]/30",
    borderColor: "hover:border-[#f4e76e]/70",
    glowColor: "rgba(244, 231, 110, 0.25)",
    icon: Dumbbell,
    iconBg: "bg-[#f4e76e]/15 text-[#f4e76e] border border-[#f4e76e]/30",
    iconColor: "text-[#f4e76e]",
    metrics: {
      hydration: "3.8L Water / day",
      movement: "4x Weekly Strength & Conditioning",
      macroFocus: "160g High-Bioavailability Protein",
      radiusTarget: "5.0 km Local Vendor Radar",
    },
    dailyQuestSnippet: "Quest: High-protein meal prep mapped to nearby farm eggs & legumes.",
    targetUserGroup: "Gym-goers, calisthenics & hybrid runners",
    xpBonus: "+450 XP Athlete Surge",
  },
  {
    id: "apex-competitor",
    name: "Apex Competitor",
    tagline: "Aiming for top 5% on the global leaderboard.",
    tag: "TIER 03 • GLOBAL APEX",
    badgeColor: "bg-gradient-to-r from-[#757761]/30 to-[#f7fe72]/20 text-[#f7fe72] border-[#f7fe72]/40",
    borderColor: "hover:border-[#f7fe72]",
    glowColor: "rgba(247, 254, 114, 0.35)",
    icon: Trophy,
    iconBg: "bg-gradient-to-tr from-[#757761]/30 via-[#18201A] to-[#f7fe72]/20 text-[#f7fe72] border border-[#f7fe72]/40",
    iconColor: "text-[#f7fe72]",
    metrics: {
      hydration: "4.5L Electrolyte Water",
      movement: "Daily Periodized Performance & PvP",
      macroFocus: "Precision Nutrient Timing & Root Carbs",
      radiusTarget: "10.0 km Full Producer Network",
    },
    dailyQuestSnippet: "Quest: Pre-exhaustion workout + apex recovery bowl from 3 local vendors.",
    targetUserGroup: "Competitive athletes, top 5% leaderboard contenders",
    xpBonus: "+800 XP Apex Crown Surge",
  },
];

interface LocalVendor {
  id: string;
  name: string;
  type: string;
  distance: string;
  freshHighlight: string;
  macroMatch: string;
  verifiedLocal: boolean;
}

const SAMPLE_VENDORS: LocalVendor[] = [
  {
    id: "v1",
    name: "Sunburst Organic Farm Stand",
    type: "Local Vegetable Grower",
    distance: "0.8 km (9 min walk)",
    freshHighlight: "Heirloom sweet potatoes, baby spinach & organic kale",
    macroMatch: "Apex Complex Carbohydrates & Fiber",
    verifiedLocal: true,
  },
  {
    id: "v2",
    name: "Highland Pastures Dairy & Eggs",
    type: "Cooperative Grocer",
    distance: "1.4 km (4 min cycle)",
    freshHighlight: "Pasture-raised farm eggs, raw curd, artisanal cottage cheese",
    macroMatch: "High-Bioavailability Leucine & Protein",
    verifiedLocal: true,
  },
  {
    id: "v3",
    name: "Verdant Valley Green Grocers",
    type: "Neighborhood Produce Market",
    distance: "2.1 km (7 min cycle)",
    freshHighlight: "Beetroot juice, organic avocados, fresh citrus electrolytes",
    macroMatch: "Nitric Oxide Booster & Healthy Monounsaturates",
    verifiedLocal: true,
  },
  {
    id: "v4",
    name: "Pioneer Grain & Sprout Depot",
    type: "Bulk Organic Wholesaler",
    distance: "3.2 km (9 min drive)",
    freshHighlight: "Sprouted black lentils, steel-cut oats, organic chia seeds",
    macroMatch: "Low-GI Energy & Sustained Glycogen Replenishment",
    verifiedLocal: true,
  },
];

interface UchitatvamOnboardingProps {
  onContinueToDashboard?: () => void;
  onExploreFullPlatform?: () => void;
}

export type PotatoFitOnboardingProps = UchitatvamOnboardingProps;

export default function UchitatvamOnboarding({
  onContinueToDashboard,
  onExploreFullPlatform,
}: UchitatvamOnboardingProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<AthleteLevelId>("street-athlete");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionStep, setDetectionStep] = useState<number>(0);
  const [isRadarModalOpen, setIsRadarModalOpen] = useState(false);
  const [userLocationName, setUserLocationName] = useState("Downtown District • 3.2km Radius");
  const [radarSweepAngle, setRadarSweepAngle] = useState(0);

  const selectedLevel = ATHLETE_LEVELS.find((lvl) => lvl.id === selectedLevelId) || ATHLETE_LEVELS[1];

  // Subtle radar sweep effect when modal opens
  useEffect(() => {
    if (!isRadarModalOpen) return;
    const interval = setInterval(() => {
      setRadarSweepAngle((prev) => (prev + 4) % 360);
    }, 20);
    return () => clearInterval(interval);
  }, [isRadarModalOpen]);

  // Handle Primary Action: "Detect My Local Food Radius & Begin →"
  const handleDetectRadius = () => {
    setIsDetecting(true);
    setDetectionStep(1);

    // Simulated scanning sequence for thrilling athletic feedback
    setTimeout(() => {
      setDetectionStep(2);
    }, 600);

    setTimeout(() => {
      setDetectionStep(3);
    }, 1300);

    setTimeout(() => {
      setIsDetecting(false);
      setDetectionStep(0);
      setIsRadarModalOpen(true);
      fireTierUnlockConfetti();
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F6F5] dark:bg-[#0B0E0C] text-[#121815] dark:text-[#E2E7DE] font-sans selection:bg-[#f7fe72]/30 selection:text-[#f7fe72] flex flex-col relative overflow-x-hidden transition-colors">
      {/* Dynamic Ambient Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-[#757761]/15 rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/4 w-[450px] h-[450px] bg-[#f7fe72]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#f4e76e]/5 rounded-full blur-[160px]" />
        {/* Subtle athletic coordinate grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #f7fe72 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* 1. Header Bar */}
      <header className="relative z-10 w-full border-b border-[#757761]/25 bg-white/80 dark:bg-[#121815]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Modern PotatoFit Faceted Logo */}
          <PotatoFitLogo size="md" variant="dark" />

          {/* Quick Nav Links / Status */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B0E0C] border border-[#757761]/35 text-xs font-semibold text-[#CBD2C7]">
              <span className="w-2 h-2 rounded-full bg-[#f7fe72] animate-ping" />
              <span className="text-[#f7fe72]">Vendor Radar Active</span>
              <span className="text-[#757761]">|</span>
              <span className="text-[#f4e76e] font-mono">5.2k+ Grocers Mapped</span>
            </div>

            <Link
              href="/leaderboards"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#CBD2C7] hover:text-white bg-[#0B0E0C] hover:bg-[#181f1b] border border-[#757761]/35 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-[#f7fe72]" />
              <span>Global Ladder</span>
            </Link>

            {onContinueToDashboard ? (
              <button
                onClick={onContinueToDashboard}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black text-[#0B0E0C] bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:brightness-110 transition-all shadow-md active:scale-95"
              >
                <span>Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black text-[#0B0E0C] bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:brightness-110 transition-all shadow-md active:scale-95"
              >
                <span>Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero & Onboarding Flow */}
      <main className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        {/* Athletic Badge Tag */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#757761]/15 border border-[#757761]/30 text-[#f7fe72] text-xs sm:text-sm font-semibold tracking-wide shadow-[0_0_15px_rgba(247,254,114,0.15)] animate-fade-in">
            <Zap className="w-4 h-4 text-[#f7fe72] fill-[#f7fe72]/20" />
            <span>HYPER-LOCAL ATHLETIC NUTRITION PLATFORM</span>
            <span className="hidden sm:inline text-[#757761]">•</span>
            <span className="hidden sm:inline text-[#f4e76e] font-mono">SEASON 04 LIVE</span>
          </div>
        </div>

        {/* 2. Central Value Proposition */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1] mb-5">
            Precision Fuel to{" "}
            <span className="bg-gradient-to-r from-[#121815] via-[#505445] to-[#7A5A00] dark:from-[#FFFFFF] dark:via-[#f4e76e] dark:to-[#f7fe72] bg-clip-text text-transparent drop-shadow-sm">
              Global Apex.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#A0A493] leading-relaxed font-normal max-w-2xl mx-auto">
            AI-driven nutrition mapped to your nearest vegetable vendors and local grocers. Fuel
            smart, track daily quests, and compete with athletes worldwide.
          </p>

          {/* Quick Feature Pillars */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-[#CBD2C7]">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121815] border border-[#757761]/35">
              <MapPin className="w-3.5 h-3.5 text-[#f7fe72]" />
              Local Farm Radius
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121815] border border-[#757761]/35">
              <Sparkles className="w-3.5 h-3.5 text-[#f7fe72]" />
              AI Macro Calibration
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121815] border border-[#757761]/35">
              <Activity className="w-3.5 h-3.5 text-[#f4e76e]" />
              Daily Habit Quests
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121815] border border-[#757761]/35">
              <Globe2 className="w-3.5 h-3.5 text-[#f7fe72]" />
              Global Leaderboard
            </span>
          </div>
        </div>

        {/* 3. Interactive Starting Level Selector */}
        <section className="mb-8 sm:mb-10" aria-label="Starting Level Selector">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 gap-2">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-[#f7fe72] uppercase">
                Step 01 / Calibrate Baseline
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Select Your Starting Level
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#A0A493] font-medium">
              You can adjust this anytime as your physical fitness transforms.
            </p>
          </div>

          {/* The 3 Clickable Level Cards with Subtle Hover Lift */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {ATHLETE_LEVELS.map((level) => {
              const isSelected = selectedLevelId === level.id;
              const IconComponent = level.icon;

              return (
                <div
                  key={level.id}
                  onClick={() => setSelectedLevelId(level.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedLevelId(level.id);
                    }
                  }}
                  className={`relative group rounded-2xl p-6 sm:p-7 flex flex-col justify-between cursor-pointer transition-all duration-300 transform text-left select-none outline-none focus-visible:ring-2 focus-visible:ring-[#f7fe72] ${
                    isSelected
                      ? "bg-[#121815] border-2 border-[#f7fe72] shadow-[0_0_35px_rgba(247,254,114,0.25)] -translate-y-2 ring-1 ring-[#f7fe72]/50"
                      : "bg-[#121815]/80 border border-[#757761]/30 hover:border-[#f7fe72]/70 hover:shadow-[0_0_28px_rgba(247,254,114,0.2)] hover:-translate-y-1.5"
                  }`}
                >
                  {/* Glowing selection corner accent */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#f7fe72]/20 via-transparent to-transparent rounded-tr-2xl pointer-events-none" />
                  )}

                  <div>
                    {/* Header Row: Tier Badge & Selection Radio/Check */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`text-[11px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-md border ${level.badgeColor}`}
                      >
                        {level.tag}
                      </span>

                      {/* Interactive Radio / Check indicator */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isSelected
                            ? "bg-[#f7fe72] text-[#0B0E0C] shadow-md shadow-[#f7fe72]/40"
                            : "border-2 border-[#757761]/40 group-hover:border-[#f7fe72]/60"
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-[#757761]/40 group-hover:bg-[#f7fe72]/60 transition-colors" />
                        )}
                      </div>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-3.5 mb-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${level.iconBg}`}
                      >
                        <IconComponent className={`w-6 h-6 ${level.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight group-hover:text-[#f7fe72] transition-colors">
                          {level.name}
                        </h3>
                        <span className="text-[11px] font-mono font-bold text-[#f7fe72]">
                          {level.xpBonus}
                        </span>
                      </div>
                    </div>

                    {/* Value Proposition Description */}
                    <p className="text-sm text-[#A0A493] leading-relaxed font-normal mb-5">
                      {level.tagline}
                    </p>

                    {/* Target Metrics Blueprint */}
                    <div className="space-y-2 pt-3 border-t border-[#757761]/25 text-xs">
                      <div className="flex items-center justify-between text-[#A0A493]">
                        <span className="flex items-center gap-1.5">
                          <Droplets className="w-3.5 h-3.5 text-[#f7fe72]" />
                          Hydration Target
                        </span>
                        <span className="font-semibold text-[#E2E7DE]">
                          {level.metrics.hydration}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[#A0A493]">
                        <span className="flex items-center gap-1.5">
                          <Footprints className="w-3.5 h-3.5 text-[#f4e76e]" />
                          Movement Baseline
                        </span>
                        <span className="font-semibold text-[#E2E7DE]">
                          {level.metrics.movement}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[#A0A493]">
                        <span className="flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-[#f7fe72]" />
                          Macro Planning
                        </span>
                        <span className="font-semibold text-[#E2E7DE]">
                          {level.metrics.macroFocus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[#A0A493]">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#f7fe72]" />
                          Vendor Distance
                        </span>
                        <span className="font-semibold text-[#E2E7DE]">
                          {level.metrics.radiusTarget}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Active Status / Click Indication */}
                  <div className="mt-5 pt-3.5 border-t border-[#757761]/25 flex items-center justify-between text-xs font-semibold">
                    <span
                      className={`transition-colors ${
                        isSelected ? "text-[#f7fe72] font-bold" : "text-[#757761] group-hover:text-[#E2E7DE]"
                      }`}
                    >
                      {isSelected ? "✓ Active Selected Path" : "Click to calibrate"}
                    </span>
                    <span className="text-[11px] font-mono text-[#A0A493]">
                      {level.targetUserGroup}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Selected Tier Dynamic Summary Banner */}
        <div className="mb-6 p-4 rounded-xl bg-[#121815] border border-[#757761]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#CBD2C7]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f7fe72] animate-pulse shadow-[0_0_8px_#f7fe72]" />
            <span>
              Configured Level:{" "}
              <strong className="text-white font-bold">{selectedLevel.name}</strong>{" "}
              <span className="text-[#A0A493]">({selectedLevel.tag})</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#f7fe72] font-medium">
            <Sparkles className="w-4 h-4 text-[#f7fe72] shrink-0" />
            <span>{selectedLevel.dailyQuestSnippet}</span>
          </div>
        </div>

        {/* 4. Primary Action: Full-width cyber-lime pill button */}
        <div className="w-full flex flex-col items-center">
          <button
            onClick={handleDetectRadius}
            disabled={isDetecting}
            className="w-full relative group overflow-hidden rounded-full bg-gradient-to-r from-[#f7fe72] via-[#f4e76e] to-[#f7fe72] hover:brightness-110 text-[#0B0E0C] font-black text-base sm:text-lg tracking-wide py-4 sm:py-5 px-8 shadow-[0_10px_35px_rgba(247,254,114,0.3)] hover:shadow-[0_15px_45px_rgba(247,254,114,0.45)] transform active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-80 flex items-center justify-center gap-3"
            title="Scan nearby vegetable stalls, farmer markets & start your customized daily quest"
          >
            {/* Shimmer sweep animation across pill button */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

            {isDetecting ? (
              <>
                <RefreshCw className="w-5 h-5 text-[#0B0E0C] animate-spin" />
                <span>
                  {detectionStep === 1 && "Acquiring GPS Coordinates & Radius..."}
                  {detectionStep === 2 && "Triangulating Local Produce Stalls..."}
                  {detectionStep === 3 && "Calibrating Day 1 Quest for " + selectedLevel.name + "..."}
                </span>
              </>
            ) : (
              <>
                <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B0E0C] group-hover:rotate-45 transition-transform duration-300" />
                <span>{"Detect My Local Food Radius & Begin →"}</span>
              </>
            )}
          </button>

          {/* Micro-guarantee & trust markers under button */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#A0A493] font-medium">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#f7fe72]" />
              Zero ads, 100% verified local grocers
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#f4e76e]" />
              Hyper-local 3km to 10km radar
            </span>
            <span className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#f7fe72]" />
              Global Leaderboard Sync Included
            </span>
          </div>
        </div>
      </main>

      {/* Footer Details */}
      <footer className="relative z-10 w-full border-t border-[#757761]/25 bg-[#0B0E0C] py-6 text-center text-xs text-[#757761]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#CBD2C7]">UCHITATVAM</span>
            <span>&bull;</span>
            <span>Precision Athletic Fuel &amp; Biometrics</span>
          </div>
          <div className="flex items-center gap-4 text-[#A0A493]">
            <Link href="/dashboard" className="hover:text-[#f7fe72] transition-colors">
              Athlete Dashboard
            </Link>
            <span>&bull;</span>
            <Link href="/leaderboards" className="hover:text-[#f7fe72] transition-colors">
              Leaderboards
            </Link>
            {onExploreFullPlatform && (
              <>
                <span>&bull;</span>
                <button
                  onClick={onExploreFullPlatform}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Full Platform View
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* 5. Interactive Radar Modal: Triggered after "Detect My Local Food Radius & Begin →" */}
      {isRadarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#121815] border-2 border-[#f7fe72]/60 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(247,254,114,0.2)] flex flex-col max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#757761]/20 border border-[#757761]/40 text-[#f7fe72] flex items-center justify-center">
                  <Radar className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#757761]/20 text-[#f7fe72] border border-[#757761]/30 uppercase">
                      Radius Locked
                    </span>
                    <span className="text-xs text-[#A0A493] font-mono">GPS 30.2672° N, 97.7431° W</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Local Food Radar Calibrated!
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsRadarModalOpen(false)}
                className="p-2 rounded-xl bg-[#0B0E0C] hover:bg-[#181f1b] border border-[#757761]/30 text-[#A0A594] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Radar Visualizer Animation */}
            <div className="relative w-full h-44 rounded-2xl bg-[#0B0E0C] border border-[#757761]/30 overflow-hidden flex items-center justify-center mb-6">
              {/* Radar concentric range circles */}
              <div className="absolute w-24 h-24 rounded-full border border-[#757761]/30" />
              <div className="absolute w-44 h-44 rounded-full border border-[#757761]/20" />
              <div className="absolute w-64 h-64 rounded-full border border-[#757761]/10" />

              {/* Crosshairs */}
              <div className="absolute w-full h-[1px] bg-[#757761]/20" />
              <div className="absolute h-full w-[1px] bg-[#757761]/20" />

              {/* Sweeping radar line */}
              <div
                className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left pointer-events-none"
                style={{
                  transform: `rotate(${radarSweepAngle}deg)`,
                  background:
                    "conic-gradient(from 180deg at 0% 100%, transparent 60deg, rgba(247, 254, 114, 0.45) 90deg)",
                }}
              />

              {/* Center user dot (You) */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-[#f7fe72] border-2 border-[#0B0E0C] shadow-[0_0_12px_#f7fe72] animate-ping" />
                <span className="text-[10px] font-bold text-[#f7fe72] mt-1 bg-[#121815] border border-[#757761]/30 px-1.5 py-0.5 rounded">
                  YOU ({selectedLevel.name})
                </span>
              </div>

              {/* Detected Vendor Pings on Radar */}
              <div className="absolute top-10 left-16 flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f7fe72] shadow-[0_0_8px_#f7fe72]" />
                <span className="text-[9px] font-mono text-[#f7fe72] bg-[#121815] px-1 rounded border border-[#757761]/30">
                  Sunburst Farm (0.8km)
                </span>
              </div>

              <div className="absolute bottom-10 right-20 flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f4e76e] shadow-[0_0_8px_#f4e76e]" />
                <span className="text-[9px] font-mono text-[#f4e76e] bg-[#121815] px-1 rounded border border-[#757761]/30">
                  Highland Eggs (1.4km)
                </span>
              </div>

              <div className="absolute top-8 right-24 flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f7fe72] shadow-[0_0_8px_#f7fe72]" />
                <span className="text-[9px] font-mono text-[#f7fe72] bg-[#121815] px-1 rounded border border-[#757761]/30">
                  Verdant Valley (2.1km)
                </span>
              </div>
            </div>

            {/* Found Vendors List */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#f7fe72]" />
                  Discovered Fresh Food Partners in Your Radius
                </h4>
                <span className="text-xs font-mono text-[#f7fe72] font-bold">4 Verified</span>
              </div>

              <div className="space-y-2.5">
                {SAMPLE_VENDORS.map((v) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl bg-[#0B0E0C] border border-[#757761]/25 hover:border-[#f7fe72]/50 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#757761]/20 border border-[#757761]/30 text-[#f7fe72] flex items-center justify-center shrink-0 mt-0.5">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="text-sm font-bold text-white">{v.name}</h5>
                          <span className="text-[10px] font-mono text-[#f7fe72] bg-[#757761]/20 px-1.5 py-0.2 rounded border border-[#757761]/30">
                            {v.distance}
                          </span>
                        </div>
                        <p className="text-xs text-[#A0A493] mt-0.5">{v.freshHighlight}</p>
                        <span className="text-[11px] font-semibold text-[#f4e76e]">
                          Match: {v.macroMatch}
                        </span>
                      </div>
                    </div>

                    <span className="hidden sm:inline-flex text-[11px] font-bold text-[#f7fe72] px-2 py-1 rounded bg-[#121815] border border-[#757761]/30">
                      Open Today
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Day 1 Quest Card */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#757761]/20 via-[#121815] to-[#f7fe72]/10 border border-[#757761]/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-[#f7fe72] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#f7fe72]" />
                  Your Day 01 Quest: &quot;{selectedLevel.name}&quot; Kickoff
                </span>
                <span className="text-xs font-mono font-bold text-[#f4e76e]">
                  {selectedLevel.xpBonus}
                </span>
              </div>
              <p className="text-sm text-[#E2E7DE] font-medium">
                {selectedLevel.dailyQuestSnippet}
              </p>
              <div className="mt-2 text-xs text-[#A0A493] flex items-center gap-4">
                <span>💧 Target: {selectedLevel.metrics.hydration}</span>
                <span>👟 Target: {selectedLevel.metrics.movement}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link
                href="/dashboard"
                onClick={() => {
                  if (onContinueToDashboard) onContinueToDashboard();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] font-black text-center text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:brightness-110 active:scale-95"
              >
                <span>Enter Athlete Dashboard</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/leaderboards"
                className="w-full py-3.5 px-4 rounded-xl bg-[#0B0E0C] hover:bg-[#181f1b] text-white font-bold text-center text-sm border border-[#757761]/40 transition-colors flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4 text-[#f7fe72]" />
                <span>Join Global Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export { UchitatvamOnboarding as PotatoFitOnboarding };
