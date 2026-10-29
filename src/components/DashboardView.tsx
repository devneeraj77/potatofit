"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dropdown, Button, Label, Description } from "@heroui/react";
import {
  Calendar,
  Check,
  Flame,
  Droplets,
  Zap,
  Moon,
  Plus,
  Dumbbell,
  Utensils,
  Camera,
  Play,
  Pause,
  Video,
  Clock,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Award,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Target,
  Trophy,
  Loader2,
  CheckCircle2,
  Sliders,
  Database,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  CalendarDays,
  Compass,
  ArrowLeft,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import RewardTiersModal from "@/components/RewardTiersModal";
import CanvasBadge from "@/components/CanvasBadge";
import PotatoFitLogo from "@/components/PotatoFitLogo";
import RecoveryInsightCard from "@/components/RecoveryInsightCard";
import FitnessInsightsChart from "@/components/FitnessInsightsChart";
import ActivityCalendarHeatmap from "@/components/ActivityCalendarHeatmap";
import { useHealthSync } from "@/hooks/useHealthSync";

interface DashboardViewProps {
  onBackToHome?: () => void;
  onOpenGuidedSession?: () => void;
}

export default function DashboardView({ onBackToHome, onOpenGuidedSession }: DashboardViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userName = session?.user?.name || "David Kim";
  const {
    hasAnyConnected,
    primaryProvider,
    activeBurnExtraKcal,
    restingHeartRate,
    sleepFormatted,
    recoveryScore,
  } = useHealthSync();

  const [activeTab, setActiveTab] = useState("schedule");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Daily Water Intake & Goals State
  const [waterVolume, setWaterVolume] = useState(2.4); // in Liters
  const [waterTarget, setWaterTarget] = useState(3.0);

  // Energy Burned & Goals State
  const [caloriesBurned, setCaloriesBurned] = useState(720);
  const [caloriesTarget, setCaloriesTarget] = useState(850);

  // 'Set Daily Goals' Module Input State
  const [isGoalsOpen, setIsGoalsOpen] = useState(true);
  const [inputCalories, setInputCalories] = useState(850);
  const [inputWater, setInputWater] = useState(3.0);
  const [isSavingGoals, setIsSavingGoals] = useState(false);
  const [goalsSaveStatus, setGoalsSaveStatus] = useState<string | null>(null);
  const [goalsLastSynced, setGoalsLastSynced] = useState<string | null>("Today, at 07:00 AM");

  // Load saved preferences from Supabase API on mount
  useEffect(() => {
    fetch("/api/user/goals")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          if (data.target_calories) {
            setCaloriesTarget(data.target_calories);
            setInputCalories(data.target_calories);
          }
          if (data.target_water_liters) {
            setWaterTarget(data.target_water_liters);
            setInputWater(data.target_water_liters);
          }
          setGoalsLastSynced("Synced with Supabase database");
        }
      })
      .catch((err) => console.warn("Notice loading goals from Supabase:", err));
  }, []);

  // Save updated preferences to Supabase
  const handleSaveGoalsToSupabase = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingGoals(true);
    setGoalsSaveStatus(null);

    try {
      const res = await fetch("/api/user/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_calories: inputCalories,
          target_water_liters: inputWater,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        setCaloriesTarget(data.target_calories);
        setWaterTarget(data.target_water_liters);
        setGoalsSaveStatus("Preferences successfully saved to Supabase database!");
        setGoalsLastSynced("Just now");
      } else {
        setGoalsSaveStatus("Failed to save goals. Please try again.");
      }
    } catch {
      setGoalsSaveStatus("Network notice while saving to Supabase.");
    } finally {
      setIsSavingGoals(false);
    }
  };

  // Morning Routine state
  const [morningCompleted, setMorningCompleted] = useState(true);

  // Main Session Workout State
  const [squatWeight, setSquatWeight] = useState(120);
  const [squatSets, setSquatSets] = useState([true, true, true, false]);

  const [rdlWeight, setRdlWeight] = useState(105);
  const [rdlSets, setRdlSets] = useState([true, true, false]);

  const [splitSquatWeight, setSplitSquatWeight] = useState(24);
  const [splitSquatSets, setSplitSquatSets] = useState([true, false, false]);

  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Calculate dynamic volume
  const calculateVolume = () => {
    let vol = 0;
    vol += squatSets.filter(Boolean).length * 8 * squatWeight;
    vol += rdlSets.filter(Boolean).length * 10 * rdlWeight;
    vol += splitSquatSets.filter(Boolean).length * 12 * splitSquatWeight * 2;
    return vol;
  };

  // Nutrition meal photo log state
  const [meals, setMeals] = useState([
    {
      id: "breakfast",
      name: "Poached Eggs, Sourdough & Hass Avocado",
      time: "08:15 AM",
      calories: 520,
      protein: 38,
      carbs: 45,
      fats: 22,
      photoLogged: true,
    },
    {
      id: "lunch",
      name: "Wild Salmon Quinoa Recovery Bowl",
      time: "01:00 PM",
      calories: 740,
      protein: 54,
      carbs: 68,
      fats: 24,
      photoLogged: false,
    },
    {
      id: "dinner",
      name: "Grass-Fed Ribeye, Sweet Potato & Broccolini",
      time: "07:30 PM",
      calories: 680,
      protein: 58,
      carbs: 42,
      fats: 26,
      photoLogged: false,
    },
  ]);

  const [activePhotoModal, setActivePhotoModal] = useState<string | null>(null);

  const handlePhotoLog = (mealId: string) => {
    setMeals((prev) =>
      prev.map((m) => (m.id === mealId ? { ...m, photoLogged: true } : m))
    );
    setActivePhotoModal(null);
  };

  // Box Breathing Visualizer Player State
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold (Full)" | "Exhale" | "Hold (Empty)">("Inhale");
  const [breathSeconds, setBreathSeconds] = useState(4);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev > 1) return prev - 1;
          setBreathPhase((curr) => {
            if (curr === "Inhale") return "Hold (Full)";
            if (curr === "Hold (Full)") return "Exhale";
            if (curr === "Exhale") return "Hold (Empty)";
            return "Inhale";
          });
          return 4;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  const toggleBreathing = () => {
    if (isBreathing) {
      setIsBreathing(false);
      setBreathSeconds(4);
      setBreathPhase("Inhale");
    } else {
      setIsBreathing(true);
    }
  };

  // Coach Video Call Modal State
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  const sidebarLinks = [
    { id: "schedule", label: "Today's Schedule", icon: Calendar },
    { id: "insights", label: "Fitness Insights", icon: TrendingUp },
    { id: "consistency", label: "Activity Heatmap", icon: CalendarDays },
    { id: "workouts", label: "Workout Logs", icon: Dumbbell },
    { id: "nutrition", label: "Meal & Macros", icon: Utensils },
    { id: "metrics", label: "Body Metrics", icon: Activity },
    { id: "recovery", label: "Recovery Score", icon: Moon },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F5] dark:bg-[#0B0E0C] text-[#121815] dark:text-[#E2E7DE] flex flex-col lg:flex-row font-sans transition-colors">
      
      {/* Mobile Top App Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#121815]/95 backdrop-blur-md border-b border-[#757761]/30 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-[#CBD2C7] hover:text-white rounded-lg hover:bg-[#181f1b] cursor-pointer"
            aria-label="Toggle Navigation Sidebar"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <PotatoFitLogo size="sm" variant="dark" />
        </div>

        {/* Unified HeroUI Dropdown for Mobile Navigation */}
        <div className="flex items-center gap-2">
          <Dropdown>
            <Button
              variant="secondary"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e8ef63] border border-[#f7fe72]/50 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Navigation Menu"
            >
              <Compass className="w-3.5 h-3.5 text-[#0B0E0C]" />
              <span>Menu</span>
              <ChevronDown className="w-3 h-3 text-[#0B0E0C]" />
            </Button>
            <Dropdown.Popover className="min-w-[210px] z-[70] p-1.5 bg-[#121815]/95 backdrop-blur-xl border border-[#757761]/40 rounded-2xl shadow-2xl">
              <Dropdown.Menu
                aria-label="Dashboard Navigation"
                onAction={(key) => {
                  if (key === "home") {
                    if (onBackToHome) {
                      onBackToHome();
                    } else {
                      router.push("/");
                    }
                  } else {
                    router.push(String(key));
                  }
                }}
                className="space-y-1 outline-none"
              >
                <Dropdown.Item
                  id="/leaderboards"
                  textValue="Live Leaderboards"
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer outline-none"
                >
                  <Trophy className="w-4 h-4 text-[#f7fe72] shrink-0" />
                  <div className="flex flex-col text-left">
                    <Label className="text-xs font-bold text-white">Live Leaderboards</Label>
                    <Description className="text-[10px] text-[#A0A594]">Global rankings & streak race</Description>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item
                  id="/rewards"
                  textValue="Rewards & Tiers"
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer outline-none"
                >
                  <Award className="w-4 h-4 text-[#f7fe72] shrink-0" />
                  <div className="flex flex-col text-left">
                    <Label className="text-xs font-bold text-white">Rewards &amp; Tiers</Label>
                    <Description className="text-[10px] text-[#A0A594]">Prestige vault & badges</Description>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item
                  id="home"
                  textValue="Public Site"
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer outline-none border-t border-[#757761]/20 mt-1 pt-2"
                >
                  <ArrowLeft className="w-4 h-4 text-[#CBD2C7] shrink-0" />
                  <div className="flex flex-col text-left">
                    <Label className="text-xs font-bold text-white">Public Site</Label>
                    <Description className="text-[10px] text-[#A0A594]">Return to landing page</Description>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>
      </div>

      {/* 1. Left Sidebar (Fixed 240px on desktop) */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-[240px] bg-[#121815] border-r border-[#757761]/30 flex flex-col justify-between p-5 transition-transform duration-200 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Platform Wordmark */}
          <div className="flex items-center justify-between pb-2">
            <PotatoFitLogo size="sm" variant="dark" />
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                title="Return to Public Homepage"
                className="text-[11px] font-semibold text-[#A0A493] hover:text-[#f7fe72] transition-colors"
              >
                Home
              </button>
            )}
          </div>

          {/* Profile Badge */}
          <div className="p-3.5 rounded-2xl bg-[#0B0E0C] border border-[#757761]/30">
            <div className="flex items-center gap-3 mb-2.5">
              <Link
                href="/rewards"
                className="relative transition-transform hover:scale-105 cursor-pointer shrink-0"
                title="View Arena Reward Tiers & Badges"
              >
                <CanvasBadge tier="gold" emblem="trophy" size={42} className="shrink-0" />
              </Link>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-white truncate">{userName}</h3>
                <Link
                  href="/rewards"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-[#f7fe72] bg-[#757761]/20 hover:bg-[#757761]/30 border border-[#757761]/40 px-2 py-0.5 rounded cursor-pointer transition-all shadow-2xs"
                  title="View Dedicated Rewards Page"
                >
                  <Award className="w-2.5 h-2.5 text-[#f7fe72]" />
                  <span>Level 4 Mover</span>
                </Link>
              </div>
            </div>

            {/* Daily Hydration Quick-Add Button (+250ml) */}
            <button
              onClick={() => {
                setWaterVolume((prev) => parseFloat((prev + 0.25).toFixed(2)));
              }}
              className="w-full py-1.5 px-2 bg-[#121815] hover:bg-[#181f1b] border border-[#757761]/40 hover:border-[#f7fe72] text-[#f7fe72] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <Droplets className="w-3.5 h-3.5 text-[#f7fe72] fill-[#f7fe72]/20" />
              <span>Quick Add +250ml</span>
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileSidebarOpen(false);
                    if (link.id === "insights") {
                      setTimeout(() => {
                        document.getElementById("fitness-insights-module")?.scrollIntoView({ behavior: "smooth" });
                      }, 50);
                    } else if (link.id === "consistency") {
                      setTimeout(() => {
                        document.getElementById("activity-heatmap-module")?.scrollIntoView({ behavior: "smooth" });
                      }, 50);
                    } else if (link.id === "settings") {
                      setIsGoalsOpen(true);
                      setTimeout(() => {
                        document.getElementById("daily-goals-module")?.scrollIntoView({ behavior: "smooth" });
                      }, 50);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#757761]/25 text-[#f7fe72] border border-[#757761]/40 shadow-xs font-bold"
                      : "text-[#A0A493] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#f7fe72]" : "text-[#757761]"}`} />
                    <span>{link.label}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#f7fe72] shadow-[0_0_6px_#f7fe72]" />}
                </button>
              );
            })}
          </nav>

          {/* Arena & Leaderboard Shortcut */}
          <div className="pt-2">
            <a
              href="/leaderboards"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#f7fe72] bg-[#757761]/20 hover:bg-[#757761]/30 border border-[#757761]/40 transition-all shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#f7fe72] group-hover:scale-110 transition-transform" />
                <span>Arena &amp; Leaderboards</span>
              </div>
              <span className="text-[10px] bg-[#f7fe72] text-[#0B0E0C] font-mono px-1.5 py-0.5 rounded font-black">
                LIVE
              </span>
            </a>
          </div>
        </div>

        {/* Bottom Sidebar Status / Back */}
        <div className="pt-4 border-t border-[#757761]/25 space-y-1.5">
          {session?.user && (
            <button
              onClick={() => {
                signOut({ redirect: false });
                if (onBackToHome) onBackToHome();
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-[#A0A493] hover:text-white rounded-lg hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4 text-[#757761]" />
              <span>Sign Out (NextAuth)</span>
            </button>
          )}
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="w-full py-2 px-3 text-xs font-semibold text-[#A0A493] hover:text-white rounded-lg hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Back to Landing Page</span>
            </button>
          )}
          <div className="flex items-center justify-between text-[11px] text-[#757761] font-mono pt-1">
            <span>SUPABASE AUTH DB</span>
            <span className="text-[#f7fe72] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f7fe72] shadow-[0_0_6px_#f7fe72]" />
              Synced
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#757761] font-mono">
            <span>BIOMARKER SYNC</span>
            <span className={`font-semibold flex items-center gap-1.5 ${hasAnyConnected ? "text-[#f7fe72]" : "text-amber-400"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${hasAnyConnected ? "bg-[#f7fe72] shadow-[0_0_6px_#f7fe72]" : "bg-amber-400"}`} />
              {hasAnyConnected ? `${primaryProvider?.name || 'Tracker'} Synced` : "Disconnected"}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Canvas: Obsidian canvas background (#0B0E0C) with modular card widgets */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#A0A493] uppercase tracking-wider font-mono">
              <span>Thursday, October 22</span>
              <span>•</span>
              <span className="text-[#f7fe72]">Active Training Block 2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
              Personal Vitality Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              href="/leaderboards"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] shadow-md text-xs font-black cursor-pointer transition-all active:scale-95 hover:brightness-110"
            >
              <Trophy className="w-3.5 h-3.5 text-[#0B0E0C]" />
              <span>Global Arena (#42)</span>
            </a>

            <Link
              href="/rewards"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#757761]/20 hover:bg-[#757761]/30 border border-[#757761]/40 text-[#f7fe72] shadow-2xs text-xs font-bold cursor-pointer transition-all active:scale-95"
              title="Inspect Reward Tiers & Arena Badges"
            >
              <Award className="w-3.5 h-3.5 text-[#f7fe72]" />
              <span>Reward Tiers</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                document.getElementById("fitness-insights-module")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121815] hover:bg-[#181f1b] border border-[#757761]/35 shadow-2xs text-xs font-semibold text-[#E2E7DE] hover:text-white cursor-pointer transition-all active:scale-95"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#f7fe72]" />
              <span>Fitness Insights</span>
            </button>

            <button
              type="button"
              onClick={() => {
                document.getElementById("activity-heatmap-module")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121815] hover:bg-[#181f1b] border border-[#757761]/35 shadow-2xs text-xs font-semibold text-[#E2E7DE] hover:text-white cursor-pointer transition-all active:scale-95"
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#f7fe72]" />
              <span>Activity Heatmap</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsGoalsOpen(true);
                document.getElementById("daily-goals-module")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121815] hover:bg-[#181f1b] border border-[#757761]/35 shadow-2xs text-xs font-semibold text-[#E2E7DE] hover:text-white cursor-pointer transition-all active:scale-95"
            >
              <Target className="w-3.5 h-3.5 text-[#f7fe72]" />
              <span>Set Daily Goals</span>
            </button>

            {hasAnyConnected ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#121815] border border-emerald-500/30 shadow-2xs text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10B981]" />
                <span className="font-semibold text-emerald-400">{primaryProvider?.name || "Fitness App"} Synced</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (onBackToHome) onBackToHome();
                  setTimeout(() => {
                    document.getElementById("health-sync-section")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] shadow-md text-xs font-black cursor-pointer transition-all active:scale-95 hover:brightness-110"
                title="Connect your fitness tracker"
              >
                <Activity className="w-3.5 h-3.5 text-[#0B0E0C]" />
                <span>Connect Your Tracker</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Top Daily Vitality Strip: 4-Card Horizontal KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Card 1: Daily Energy Burned */}
          <div className="bg-[#121815] rounded-2xl p-4 sm:p-5 border border-[#757761]/30 shadow-xl shadow-black/40 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#A0A493] uppercase tracking-wider">
                  Daily Energy Burned
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white font-mono tabular-nums">
                  {caloriesBurned + (hasAnyConnected ? activeBurnExtraKcal : 0)}
                </span>
                <span className="text-xs text-[#757761] font-medium">/ {caloriesTarget} kcal</span>
              </div>
              {hasAnyConnected ? (
                <span className="text-[10px] text-emerald-400 font-mono block">
                  ● +{activeBurnExtraKcal} kcal {primaryProvider?.name || 'tracker'} synced
                </span>
              ) : null}
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#f7fe72]">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#f7fe72] fill-[#f7fe72]" />
                  <span>
                    {(caloriesBurned + (hasAnyConnected ? activeBurnExtraKcal : 0)) >= caloriesTarget
                      ? "Target reached!"
                      : `${caloriesTarget - (caloriesBurned + (hasAnyConnected ? activeBurnExtraKcal : 0))} kcal to target`}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsGoalsOpen(true);
                    document.getElementById("daily-goals-module")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-[#757761] hover:text-white transition-colors cursor-pointer ml-1"
                  title="Adjust goal in Supabase module"
                >
                  <Sliders className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-[#757761]/25 stroke-current stroke-[3.5] fill-none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#f7fe72] stroke-current stroke-[3.5] stroke-linecap-round fill-none transition-all duration-500"
                  strokeDasharray={`${Math.min(100, Math.round((caloriesBurned / caloriesTarget) * 100))}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-black text-white font-mono">
                {Math.round((caloriesBurned / caloriesTarget) * 100)}%
              </span>
            </div>
          </div>

          {/* Card 2: Water Intake */}
          <div className="bg-[#121815] rounded-2xl p-4 sm:p-5 border border-[#757761]/30 shadow-xl shadow-black/40 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#A0A493] uppercase tracking-wider">
                Water Intake
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white font-mono tabular-nums">
                  {waterVolume.toFixed(1)}L
                </span>
                <span className="text-xs text-[#757761] font-medium">/ {waterTarget.toFixed(1)}L</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWaterVolume((v) => parseFloat((v + 0.25).toFixed(2)))}
                  className="text-[11px] font-semibold text-[#f7fe72] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Log +250ml</span>
                </button>
                <span className="text-[#757761]">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsGoalsOpen(true);
                    document.getElementById("daily-goals-module")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-[11px] font-semibold text-[#A0A493] hover:text-white flex items-center gap-0.5 cursor-pointer"
                  title="Adjust goal in Supabase module"
                >
                  <Sliders className="w-2.5 h-2.5" />
                  <span>Adjust</span>
                </button>
              </div>
            </div>

            {/* Droplet Fill Animation Indicator */}
            <div className="relative w-14 h-14 shrink-0 rounded-2xl bg-[#0B0E0C] border border-[#757761]/30 flex flex-col items-center justify-end overflow-hidden">
              <div
                className="w-full bg-gradient-to-t from-[#757761] to-[#f7fe72]/60 transition-all duration-500 flex items-center justify-center"
                style={{ height: `${Math.min(100, (waterVolume / waterTarget) * 100)}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-[#f7fe72] fill-[#f7fe72]/20" />
              </div>
            </div>
          </div>

          {/* Card 3: Sleep Readiness */}
          <div className="bg-[#121815] rounded-2xl p-4 sm:p-5 border border-[#757761]/30 shadow-xl shadow-black/40 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#A0A493] uppercase tracking-wider">
                Sleep Readiness
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white font-mono">
                  {hasAnyConnected ? `${recoveryScore || 88}%` : "--%"}
                </span>
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded border ${
                    hasAnyConnected
                      ? "text-[#f7fe72] bg-[#757761]/20 border-[#757761]/30"
                      : "text-amber-300 bg-amber-500/10 border-amber-500/20"
                  }`}
                >
                  {hasAnyConnected ? "Optimal" : "Disconnected"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#A0A493] font-mono">
                {hasAnyConnected ? (
                  <>
                    <span>RHR: {restingHeartRate || 52} bpm</span>
                    <span>·</span>
                    <span>{sleepFormatted || "7h 24m"}</span>
                  </>
                ) : (
                  <span>Tracker unlinked</span>
                )}
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#757761]/20 border border-[#757761]/40 flex items-center justify-center text-[#f7fe72] shrink-0">
              <Moon className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Active Habit Streak */}
          <div className="bg-[#121815] rounded-2xl p-4 sm:p-5 border border-[#757761]/30 shadow-xl shadow-black/40 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#A0A493] uppercase tracking-wider">
                Active Habit Streak
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#f7fe72] font-mono">14 Days</span>
              </div>
              <span className="text-[11px] font-semibold text-[#A0A493]">
                Unbroken daily consistency
              </span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#757761]/20 border border-[#757761]/40 flex items-center justify-center text-[#f7fe72] shrink-0">
              <Flame className="w-7 h-7 fill-[#f7fe72] text-[#f7fe72]" />
            </div>
          </div>

        </div>
 
        {/* Recovery Insight & Adaptive Prescription Card */}
        <RecoveryInsightCard
          onStartRecoverySession={onOpenGuidedSession}
          onApplyDietAdjustments={() => {
            setCaloriesBurned((prev) => prev + 150);
          }}
        />

        {/* 7-Day Fitness Insights (Recharts Telemetry Visualization) */}
        <FitnessInsightsChart />

        {/* 365-Day Activity & Training Goals Heatmap (D3.js Visualization) */}
        <ActivityCalendarHeatmap />

        {/* 'Set Daily Goals' Module (Supabase Connected) */}
        <section
          id="daily-goals-module"
          aria-label="Set Daily Goals"
          className="bg-[#121815] rounded-3xl border border-[#757761]/30 shadow-xl p-5 sm:p-6 mb-8 transition-all scroll-mt-20 sm:scroll-mt-24"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#757761]/25">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#757761]/20 border border-[#757761]/40 flex items-center justify-center text-[#f7fe72] shrink-0">
                <Target className="w-5 h-5 text-[#f7fe72]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-white">
                    Set Daily Vitality Goals
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#f7fe72] bg-[#757761]/20 border border-[#757761]/30 px-2 py-0.5 rounded-full">
                    <Database className="w-3 h-3" />
                    Supabase Connected
                  </span>
                </div>
                <p className="text-xs text-[#A0A493] mt-0.5">
                  Define your daily energy burn and hydration targets. Preferences are saved to your Supabase profile and dynamically update live progress cards.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              {goalsLastSynced && (
                <span className="text-[11px] font-mono text-[#757761] hidden md:inline">
                  {goalsLastSynced}
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsGoalsOpen(!isGoalsOpen)}
                className="p-1.5 rounded-lg text-[#A0A493] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title={isGoalsOpen ? "Collapse module" : "Expand module"}
              >
                {isGoalsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isGoalsOpen && (
            <form onSubmit={handleSaveGoalsToSupabase} className="mt-5 space-y-6">
              {goalsSaveStatus && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    goalsSaveStatus.includes("successfully")
                      ? "bg-[#757761]/25 text-[#f7fe72] border border-[#757761]/40"
                      : "bg-[#0B0E0C] text-[#E2E7DE] border border-[#757761]/35"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#f7fe72] shrink-0" />
                  <span>{goalsSaveStatus}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                {/* 1. Target Calorie Burn Card */}
                <div className="rounded-2xl bg-[#0B0E0C] border border-[#757761]/25 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#757761]/20 text-[#f7fe72] flex items-center justify-center">
                        <Flame className="w-4 h-4 fill-[#f7fe72] text-[#f7fe72]" />
                      </div>
                      <span className="text-sm font-bold text-white">
                        Target Calorie Burn
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black font-mono text-white">
                        {inputCalories}
                      </span>
                      <span className="text-xs text-[#A0A493] ml-1 font-medium">kcal/day</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#A0A493]">
                    Active goal: <strong className="text-white font-mono">{caloriesTarget} kcal</strong>. Currently burned today: <span className="font-mono text-[#f7fe72]">{caloriesBurned} kcal</span> ({Math.round((caloriesBurned / caloriesTarget) * 100)}%).
                  </p>

                  {/* Range Slider + Quick Steps */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#757761]">
                      <span>400 kcal</span>
                      <span className="text-[#f7fe72]">Target: {inputCalories} kcal</span>
                      <span>1,800 kcal</span>
                    </div>
                    <input
                      type="range"
                      min={400}
                      max={1800}
                      step={25}
                      value={inputCalories}
                      onChange={(e) => setInputCalories(Number(e.target.value))}
                      className="w-full accent-[#f7fe72] cursor-pointer"
                    />
                  </div>

                  {/* Quick Adjust Buttons & Numeric Input */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInputCalories((v) => Math.max(400, v - 50))}
                      className="px-2.5 py-1 text-xs font-bold text-[#CBD2C7] bg-[#121815] border border-[#757761]/35 rounded-lg hover:text-white cursor-pointer"
                    >
                      -50
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputCalories((v) => Math.min(2000, v + 50))}
                      className="px-2.5 py-1 text-xs font-bold text-[#CBD2C7] bg-[#121815] border border-[#757761]/35 rounded-lg hover:text-white cursor-pointer"
                    >
                      +50
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        min={300}
                        max={2500}
                        step={10}
                        value={inputCalories}
                        onChange={(e) => setInputCalories(Number(e.target.value))}
                        className="w-full text-right pr-12 pl-3 py-1 text-xs font-mono font-bold bg-[#121815] border border-[#757761]/35 rounded-lg text-white focus:outline-none focus:border-[#f7fe72]"
                      />
                      <span className="absolute right-3 top-1 text-[11px] text-[#757761] pointer-events-none">
                        kcal
                      </span>
                    </div>
                  </div>

                  {/* Preset Pills */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#A0A493] tracking-wider block mb-1.5">
                      Recommended Presets
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "Light (650)", val: 650 },
                        { label: "Standard (850)", val: 850 },
                        { label: "Athletic (1,050)", val: 1050 },
                        { label: "Peak (1,250)", val: 1250 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setInputCalories(preset.val)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                            inputCalories === preset.val
                              ? "bg-[#f7fe72] text-[#0B0E0C] font-black"
                              : "bg-[#121815] text-[#A0A493] border border-[#757761]/30 hover:border-[#f7fe72]"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Target Water Intake Card */}
                <div className="rounded-2xl bg-[#0B0E0C] border border-[#757761]/25 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#757761]/20 text-[#f7fe72] flex items-center justify-center">
                        <Droplets className="w-4 h-4 text-[#f7fe72] fill-[#f7fe72]/20" />
                      </div>
                      <span className="text-sm font-bold text-white">
                        Target Water Intake
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black font-mono text-white">
                        {inputWater.toFixed(1)}
                      </span>
                      <span className="text-xs text-[#A0A493] ml-1 font-medium">L/day</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#A0A493]">
                    Active goal: <strong className="text-white font-mono">{waterTarget.toFixed(1)}L</strong>. Logged today: <span className="font-mono text-[#f7fe72]">{waterVolume.toFixed(1)}L</span> (~{Math.round(inputWater * 4)} glasses @ 250ml).
                  </p>

                  {/* Range Slider + Quick Steps */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#757761]">
                      <span>1.5 L</span>
                      <span className="text-[#f7fe72]">Target: {inputWater.toFixed(1)} L</span>
                      <span>5.0 L</span>
                    </div>
                    <input
                      type="range"
                      min={1.5}
                      max={5.0}
                      step={0.1}
                      value={inputWater}
                      onChange={(e) => setInputWater(parseFloat(parseFloat(e.target.value).toFixed(2)))}
                      className="w-full accent-[#f7fe72] cursor-pointer"
                    />
                  </div>

                  {/* Quick Adjust Buttons & Numeric Input */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInputWater((v) => parseFloat(Math.max(1.0, v - 0.25).toFixed(2)))}
                      className="px-2.5 py-1 text-xs font-bold text-[#CBD2C7] bg-[#121815] border border-[#757761]/35 rounded-lg hover:text-white cursor-pointer"
                    >
                      -0.25L
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputWater((v) => parseFloat(Math.min(6.0, v + 0.25).toFixed(2)))}
                      className="px-2.5 py-1 text-xs font-bold text-[#CBD2C7] bg-[#121815] border border-[#757761]/35 rounded-lg hover:text-white cursor-pointer"
                    >
                      +0.25L
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="number"
                        min={1.0}
                        max={6.0}
                        step={0.1}
                        value={inputWater}
                        onChange={(e) => setInputWater(parseFloat(parseFloat(e.target.value).toFixed(2)))}
                        className="w-full text-right pr-8 pl-3 py-1 text-xs font-mono font-bold bg-[#121815] border border-[#757761]/35 rounded-lg text-white focus:outline-none focus:border-[#f7fe72]"
                      />
                      <span className="absolute right-3 top-1 text-[11px] text-[#757761] pointer-events-none">
                        L
                      </span>
                    </div>
                  </div>

                  {/* Preset Pills */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#A0A493] tracking-wider block mb-1.5">
                      Hydration Presets
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "Baseline (2.5L)", val: 2.5 },
                        { label: "Standard (3.0L)", val: 3.0 },
                        { label: "High Activity (3.5L)", val: 3.5 },
                        { label: "Endurance (4.0L)", val: 4.0 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setInputWater(preset.val)}
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                            Math.abs(inputWater - preset.val) < 0.05
                              ? "bg-[#f7fe72] text-[#0B0E0C] font-black"
                              : "bg-[#121815] text-[#A0A493] border border-[#757761]/30 hover:border-[#f7fe72]"
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#757761]/25">
                <div className="text-xs text-[#A0A493] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#f7fe72]" />
                  <span>Saves to athlete profile in Supabase table <code className="font-mono bg-[#0B0E0C] text-[#f7fe72] px-1 py-0.5 rounded">profiles</code></span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setInputCalories(850);
                      setInputWater(3.0);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-semibold text-[#A0A493] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Reset Defaults
                  </button>

                  <button
                    type="submit"
                    disabled={isSavingGoals}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] text-xs font-black shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-95"
                  >
                    {isSavingGoals ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0B0E0C]" />
                        <span>Save Preferences to Supabase</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </section>

        {/* 3. Main Content Split (2 Columns: 65% left, 35% right on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN (65% width / 8 cols on 12-col grid): Today's Action Plan */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Today&#39;s Action Plan</span>
                <span className="text-xs font-mono font-bold text-[#f7fe72] bg-[#757761]/20 border border-[#757761]/30 px-2 py-0.5 rounded">
                  3 Protocols Scheduled
                </span>
              </h2>
              <span className="text-xs font-mono font-bold text-[#A0A493]">
                Est. Session Vol: {calculateVolume().toLocaleString()} kg
              </span>
            </div>

            {/* Morning Routine: Checked-off 10-minute mobility flow */}
            <div className="bg-[#121815] rounded-2xl p-5 border border-[#757761]/30 shadow-xl transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMorningCompleted(!morningCompleted)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      morningCompleted
                        ? "bg-[#f7fe72] text-[#0B0E0C] shadow-xs"
                        : "border-2 border-[#757761]/40 hover:border-[#f7fe72] bg-[#0B0E0C]"
                    }`}
                  >
                    {morningCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-bold ${morningCompleted ? "line-through text-[#757761]" : "text-white"}`}>
                        Morning Routine: 10-Minute Mobility Flow
                      </h3>
                      <span className="text-[10px] font-bold text-[#f7fe72] bg-[#757761]/20 px-1.5 py-0.5 rounded uppercase font-mono border border-[#757761]/30">
                        {morningCompleted ? "Completed 07:15 AM" : "Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-[#A0A493] mt-0.5">
                      Thoracic spine extension, 90/90 hip capsule rotations, and diaphragmatic breathing.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono text-[#757761] shrink-0">10 min</span>
              </div>
            </div>

            {/* Main Session — Lower Body Hypertrophy Card */}
            <div className="bg-[#121815] rounded-2xl p-5 sm:p-6 border border-[#757761]/30 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-[#757761]/25">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#757761]/20 text-[#f7fe72] flex items-center justify-center border border-[#757761]/40">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Main Session: Lower Body Hypertrophy
                    </h3>
                    <p className="text-xs text-[#A0A493]">
                      Strength block focus: Posterior chain &amp; knee stability
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#f7fe72] bg-[#757761]/20 px-2.5 py-1 rounded-md border border-[#757761]/30">
                    Volume: {calculateVolume().toLocaleString()} kg
                  </span>
                </div>
              </div>

              {/* Exercise Checklist with Weights & Checkmark buttons */}
              <div className="space-y-4">
                
                {/* Exercise 1: Barbell Back Squat */}
                <div className="p-4 rounded-xl bg-[#0B0E0C] border border-[#757761]/25 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">1. Barbell Back Squat</h4>
                      <p className="text-xs text-[#A0A493]">4 sets × 8 reps • 90s rest • Tempo 3-1-X-1</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-[#A0A493]">Load:</label>
                      <input
                        type="number"
                        value={squatWeight}
                        onChange={(e) => setSquatWeight(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 px-2 py-1 rounded-lg border border-[#757761]/40 bg-[#121815] text-xs font-mono font-bold text-right text-white focus:outline-none focus:ring-1 focus:ring-[#f7fe72]"
                      />
                      <span className="text-xs text-[#A0A493] font-mono">kg</span>
                    </div>
                  </div>

                  {/* Set Checkboxes */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#757761] w-12 font-mono">Sets:</span>
                    <div className="flex items-center gap-2">
                      {squatSets.map((checked, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const next = [...squatSets];
                            next[idx] = !next[idx];
                            setSquatSets(next);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
                            checked
                              ? "bg-[#f7fe72] text-[#0B0E0C] font-black shadow-xs"
                              : "bg-[#121815] border border-[#757761]/35 text-[#A0A493] hover:text-white"
                          }`}
                        >
                          <span>S{idx + 1}</span>
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Exercise 2: Romanian Deadlifts */}
                <div className="p-4 rounded-xl bg-[#0B0E0C] border border-[#757761]/25 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">2. Romanian Deadlift</h4>
                      <p className="text-xs text-[#A0A493]">3 sets × 10 reps • 75s rest • Hip hinge focus</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-[#A0A493]">Load:</label>
                      <input
                        type="number"
                        value={rdlWeight}
                        onChange={(e) => setRdlWeight(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 px-2 py-1 rounded-lg border border-[#757761]/40 bg-[#121815] text-xs font-mono font-bold text-right text-white focus:outline-none focus:ring-1 focus:ring-[#f7fe72]"
                      />
                      <span className="text-xs text-[#A0A493] font-mono">kg</span>
                    </div>
                  </div>

                  {/* Set Checkboxes */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#757761] w-12 font-mono">Sets:</span>
                    <div className="flex items-center gap-2">
                      {rdlSets.map((checked, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const next = [...rdlSets];
                            next[idx] = !next[idx];
                            setRdlSets(next);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
                            checked
                              ? "bg-[#f7fe72] text-[#0B0E0C] font-black shadow-xs"
                              : "bg-[#121815] border border-[#757761]/35 text-[#A0A493] hover:text-white"
                          }`}
                        >
                          <span>S{idx + 1}</span>
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Exercise 3: Bulgarian Split Squats */}
                <div className="p-4 rounded-xl bg-[#0B0E0C] border border-[#757761]/25 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">3. Bulgarian Split Squats</h4>
                      <p className="text-xs text-[#A0A493]">3 sets × 12 reps/leg • 60s rest • Glute focus</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-[#A0A493]">Load (each DB):</label>
                      <input
                        type="number"
                        value={splitSquatWeight}
                        onChange={(e) => setSplitSquatWeight(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 px-2 py-1 rounded-lg border border-[#757761]/40 bg-[#121815] text-xs font-mono font-bold text-right text-white focus:outline-none focus:ring-1 focus:ring-[#f7fe72]"
                      />
                      <span className="text-xs text-[#A0A493] font-mono">kg</span>
                    </div>
                  </div>

                  {/* Set Checkboxes */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#757761] w-12 font-mono">Sets:</span>
                    <div className="flex items-center gap-2">
                      {splitSquatSets.map((checked, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            const next = [...splitSquatSets];
                            next[idx] = !next[idx];
                            setSplitSquatSets(next);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1 cursor-pointer ${
                            checked
                              ? "bg-[#f7fe72] text-[#0B0E0C] font-black shadow-xs"
                              : "bg-[#121815] border border-[#757761]/35 text-[#A0A493] hover:text-white"
                          }`}
                        >
                          <span>S{idx + 1}</span>
                          {checked && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Complete Workout Action */}
              <div className="mt-5 pt-4 border-t border-[#757761]/25 flex items-center justify-between">
                <span className="text-xs text-[#A0A493]">
                  {sessionCompleted ? "Workout finished & logged to health graph" : "Log all sets to update weekly load accumulation"}
                </span>
                <button
                  onClick={() => {
                    setSessionCompleted(!sessionCompleted);
                    if (!sessionCompleted) {
                      setCaloriesBurned((prev) => prev + 180);
                    }
                  }}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                    sessionCompleted
                      ? "bg-[#757761]/30 text-[#f7fe72] border border-[#757761]"
                      : "bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] font-black hover:brightness-110"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{sessionCompleted ? "Session Completed ✓" : "Finish & Log Session"}</span>
                </button>
              </div>
            </div>

            {/* Nutrition Planner: Breakfast, Lunch, and Dinner cards with macro tags and quick photo-log trigger */}
            <div className="bg-[#121815] rounded-2xl p-5 sm:p-6 border border-[#757761]/30 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#757761]/20 text-[#f7fe72] flex items-center justify-center border border-[#757761]/30">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Nutrition &amp; Macro Planner</h3>
                    <p className="text-xs text-[#A0A493]">Target: 180g Protein • 240g Carbs • 70g Fats</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-3.5 rounded-xl bg-[#0B0E0C] border border-[#757761]/25 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold text-[#A0A493] mb-1">
                        <span className="uppercase tracking-wider font-mono font-bold text-[#f7fe72]">
                          {meal.id}
                        </span>
                        <span>{meal.time}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 mb-2">
                        {meal.name}
                      </h4>

                      {/* Macro Tags */}
                      <div className="flex flex-wrap gap-1 text-[10px] font-mono font-bold mb-3">
                        <span className="px-1.5 py-0.5 rounded bg-[#f7fe72]/15 text-[#f7fe72] border border-[#f7fe72]/30">
                          {meal.protein}g P
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#757761]/20 text-[#CBD2C7] border border-[#757761]/30">
                          {meal.carbs}g C
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#f4e76e]/15 text-[#f4e76e] border border-[#f4e76e]/30">
                          {meal.fats}g F
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-white/10 text-[#CBD2C7]">
                          {meal.calories} kcal
                        </span>
                      </div>
                    </div>

                    {/* Quick Photo Log Trigger */}
                    <div className="pt-2 border-t border-[#757761]/20">
                      {meal.photoLogged ? (
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#f7fe72]">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Photo Verified ✓</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActivePhotoModal(meal.id)}
                          className="w-full py-1.5 px-2 bg-[#121815] hover:bg-[#181f1b] border border-[#757761]/35 text-[#CBD2C7] hover:text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#A0A493]" />
                          <span>Quick Photo Log</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (35% width / 4 cols on 12-col grid): Recovery & Habit Insights */}
          <div className="lg:col-span-4 space-y-6">
            
            <h2 className="text-lg font-bold text-white">
              Recovery &amp; Habit Insights
            </h2>

            {/* Weekly Habit Consistency Heatmap (Mon-Sun check-in grid) */}
            <div className="bg-[#121815] rounded-2xl p-5 border border-[#757761]/30 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#CBD2C7] uppercase tracking-wider font-mono">
                  Weekly Habit Heatmap
                </span>
                <span className="text-xs font-bold text-[#f7fe72] font-mono">94% Adherence</span>
              </div>

              {/* Heatmap Grid */}
              <div className="space-y-2 text-xs">
                {/* Header days */}
                <div className="grid grid-cols-8 gap-1.5 text-center text-[11px] font-semibold text-[#757761] font-mono">
                  <span className="text-left">Habit</span>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                  <span>S</span>
                </div>

                {[
                  { name: "Lift", days: [true, true, false, true, false, false, false] },
                  { name: "3L H2O", days: [true, true, true, true, false, false, false] },
                  { name: "Sleep", days: [true, true, true, true, false, false, false] },
                  { name: "Sauna", days: [true, true, true, false, false, false, false] },
                ].map((row, idx) => (
                  <div key={idx} className="grid grid-cols-8 gap-1.5 items-center text-center">
                    <span className="text-left font-semibold text-[#CBD2C7] text-[11px] truncate">
                      {row.name}
                    </span>
                    {row.days.map((done, dIdx) => (
                      <div
                        key={dIdx}
                        className={`h-6 rounded-md flex items-center justify-center transition-colors ${
                          done
                            ? "bg-[#f7fe72] text-[#0B0E0C]"
                            : dIdx === 3
                            ? "bg-[#0B0E0C] text-[#f7fe72] border border-[#f7fe72]/60"
                            : "bg-[#0B0E0C] text-[#757761]"
                        }`}
                      >
                        {done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        {!done && dIdx === 3 && <span className="text-[10px] font-bold">•</span>}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Guided Recovery Player: 5-minute Box Breathing Visualizer */}
            <div className="bg-[#121815] rounded-2xl p-5 border border-[#757761]/30 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#CBD2C7] uppercase tracking-wider font-mono">
                  5-Min Box Breathing
                </span>
                <span className="text-[10px] font-bold text-[#f7fe72] bg-[#757761]/20 border border-[#757761]/30 px-2 py-0.5 rounded">
                  HRV Cadence
                </span>
              </div>

              {/* Animated Expanding/Contracting Circle Guide */}
              <div className="py-6 flex flex-col items-center justify-center bg-[#0B0E0C] rounded-xl border border-[#757761]/25 mb-4 overflow-hidden relative">
                {/* Visual Circle Guide */}
                <div
                  className={`w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all duration-1000 shadow-inner ${
                    isBreathing
                      ? breathPhase.includes("Inhale")
                        ? "scale-125 border-[#f7fe72] bg-[#f7fe72]/20 shadow-[0_0_15px_rgba(247,254,114,0.3)] text-[#f7fe72]"
                        : breathPhase.includes("Exhale")
                        ? "scale-90 border-[#757761] bg-[#757761]/20 shadow-inner text-white"
                        : "scale-110 border-[#f4e76e] bg-[#f4e76e]/15 text-[#f4e76e]"
                      : "border-[#757761]/40 bg-[#121815] text-[#A0A493]"
                  }`}
                >
                  <span className="text-2xl font-black font-mono">
                    {breathSeconds}s
                  </span>
                </div>

                <div className="text-center mt-4">
                  <p className="text-sm font-bold text-white">
                    {isBreathing ? breathPhase : "Ready for Recovery Flow"}
                  </p>
                  <p className="text-[11px] text-[#A0A493]">
                    {isBreathing ? "Sync diaphragm with visual cadence" : "Tap Start to trigger parasympathetic tone"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={toggleBreathing}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
                >
                  {isBreathing ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-[#0B0E0C] text-[#0B0E0C]" />
                      <span>Pause Breathing Visualizer</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-[#0B0E0C] text-[#0B0E0C] ml-0.5" />
                      <span>Start Guided Recovery</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Upcoming Coach Check-in Appointment Card */}
            <div className="bg-gradient-to-br from-[#18201A] via-[#121815] to-[#0B0E0C] text-white rounded-2xl p-5 border border-[#757761]/40 shadow-xl">
              <div className="flex items-center justify-between text-xs text-[#f7fe72] font-semibold mb-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Today at 4:30 PM</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-[#f4e76e] text-[10px] border border-white/10">
                  In 42 mins
                </span>
              </div>

              <h4 className="text-base font-bold text-white">
                1-on-1 Consultation: Marcus Vance
              </h4>
              <p className="text-xs text-[#A0A493] mt-1">
                CSCS*D, USAW-L2 • Head Strength Coach
              </p>
              <p className="text-xs text-[#CBD2C7] mt-2 bg-[#0B0E0C]/60 p-2.5 rounded-lg border border-[#757761]/30">
                <strong className="text-[#f7fe72]">Focus:</strong> Block 2 load adjustment &amp; knee patellar biomechanics review.
              </p>

              <button
                onClick={() => setIsVideoCallOpen(true)}
                className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] text-xs font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:brightness-110"
              >
                <Video className="w-4 h-4 text-[#0B0E0C]" />
                <span>Join Video Call Room</span>
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Quick Photo Log Modal Simulation */}
      {activePhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-[#121815] rounded-3xl p-6 shadow-2xl border border-[#757761]/40 text-center text-white">
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-4 right-4 p-2 text-[#757761] hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#757761]/20 text-[#f7fe72] border border-[#757761]/40 flex items-center justify-center mx-auto mb-3">
              <Camera className="w-6 h-6 text-[#f7fe72]" />
            </div>

            <h3 className="text-lg font-bold text-white">
              Photo Meal Verification
            </h3>
            <p className="text-xs text-[#A0A493] mt-1 mb-5">
              AI camera scans portion size and macronutrient ratios automatically.
            </p>

            <div className="border-2 border-dashed border-[#757761]/40 rounded-2xl p-6 bg-[#0B0E0C] mb-5 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#121815] border border-[#757761]/40 shadow-xs flex items-center justify-center mb-2">
                <Utensils className="w-7 h-7 text-[#f7fe72]" />
              </div>
              <span className="text-xs font-semibold text-[#E2E7DE]">Ready to capture meal plate</span>
              <span className="text-[10px] text-[#A0A493] mt-0.5">Simulated instant AI macro recognition</span>
            </div>

            <button
              onClick={() => handlePhotoLog(activePhotoModal)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-2 hover:brightness-110 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Verify &amp; Log Photo</span>
            </button>
          </div>
        </div>
      )}

      {/* Video Call Simulation Modal */}
      {isVideoCallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#121815] rounded-3xl overflow-hidden shadow-2xl border border-[#757761]/40 text-white">
            
            {/* Call Header */}
            <div className="p-4 bg-[#0B0E0C] border-b border-[#757761]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f7fe72] animate-pulse shadow-[0_0_8px_#f7fe72]" />
                <div>
                  <h3 className="text-sm font-bold text-white">1-on-1 Consultation: Marcus Vance</h3>
                  <p className="text-[11px] text-[#A0A493]">Encrypted HD Clinical Stream • 00:04:12</p>
                </div>
              </div>

              <span className="text-xs font-mono font-semibold text-[#f7fe72] bg-[#757761]/25 border border-[#757761]/40 px-2 py-0.5 rounded">
                720p HD 60fps
              </span>
            </div>

            {/* Video Canvas Simulation */}
            <div className="relative aspect-[16/9] bg-gradient-to-br from-[#0B0E0C] via-[#18201A] to-[#121815] flex items-center justify-center p-6">
              
              {/* Main Coach Window */}
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-[#121815] border-2 border-[#757761]/60 flex items-center justify-center text-3xl font-black text-[#f7fe72] mx-auto mb-3 shadow-lg">
                  MV
                </div>
                <h4 className="text-lg font-bold text-white">Coach Marcus Vance</h4>
                <p className="text-xs text-[#f7fe72]">&ldquo;Let&#39;s review your knee bar-path on set 2 squats.&rdquo;</p>
              </div>

              {/* User PiP Preview */}
              <div className="absolute bottom-4 right-4 w-32 aspect-[4/3] rounded-xl bg-[#0B0E0C] border border-[#757761]/40 overflow-hidden flex items-center justify-center text-center p-2 shadow-lg">
                {!isVideoDisabled ? (
                  <div>
                    <div className="w-8 h-8 rounded-full bg-[#121815] text-[#f7fe72] text-xs font-bold flex items-center justify-center mx-auto mb-1 border border-[#757761]/30">
                      DK
                    </div>
                    <span className="text-[10px] text-[#CBD2C7] font-semibold">David (You)</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-[#757761]">Camera Off</span>
                )}
              </div>
            </div>

            {/* Call Control Strip */}
            <div className="p-4 bg-[#0B0E0C] flex items-center justify-center gap-4 border-t border-[#757761]/30">
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  isMicMuted ? "bg-[#757761]/30 text-[#f7fe72]" : "bg-[#121815] hover:bg-[#181f1b] text-white border border-[#757761]/30"
                }`}
                title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoDisabled(!isVideoDisabled)}
                className={`p-3 rounded-full transition-colors cursor-pointer ${
                  isVideoDisabled ? "bg-[#757761]/30 text-[#f7fe72]" : "bg-[#121815] hover:bg-[#181f1b] text-white border border-[#757761]/30"
                }`}
                title={isVideoDisabled ? "Enable Video" : "Disable Video"}
              >
                {isVideoDisabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setIsVideoCallOpen(false)}
                className="px-6 py-3 rounded-full bg-[#18201A] hover:bg-[#202b23] border border-[#757761]/40 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <PhoneOff className="w-4 h-4 text-white" />
                <span>End Call</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Reward Tiers Modal */}
      <RewardTiersModal
        isOpen={isRewardModalOpen}
        onClose={() => setIsRewardModalOpen(false)}
        currentXp={8420}
        currentRank={42}
        equippedBadgeId="apex_contender"
      />

    </div>
  );
}
