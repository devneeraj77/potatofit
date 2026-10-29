"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Tabs } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Flame,
  Award,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  CheckCircle2,
  Sparkles,
  MapPin,
  Utensils,
  Dumbbell,
  ArrowLeft,
  Clock,
  LayoutDashboard,
  Crown,
  Medal,
  ChevronDown,
  TrendingUp,
  Users,
} from "lucide-react";
import CanvasBadge from "@/components/CanvasBadge";
import PotatoFitLogo from "@/components/PotatoFitLogo";
import {
  ArenaToastProvider,
} from "@/components/ArenaToastSystem";

// Self-contained high-performance confetti particle burst harmonized with 60-30-10 palette
function triggerArenaConfetti(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
    alpha: number;
  }> = [];

  // Strict 3-color palette: Electric Lime #f7fe72, Solar Gold #f4e76e, Smoked Olive #757761, White #ffffff
  const colors = ["#f7fe72", "#f4e76e", "#757761", "#ffffff"];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight * 0.45;

  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 11 + 4;
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3.5,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 14,
      alpha: 1,
    });
  }

  const startTime = Date.now();

  function render() {
    if (!ctx || !canvas) return;
    const elapsed = Date.now() - startTime;
    if (elapsed > 2400) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22;
      p.vx *= 0.985;
      p.rotation += p.rotationSpeed;
      p.alpha = Math.max(0, 1 - elapsed / 2200);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      ctx.restore();
    }

    requestAnimationFrame(render);
  }

  render();
}

export interface Contender {
  id: string;
  rank: number;
  prevRank: number;
  name: string;
  handle: string;
  avatarText: string;
  location: string;
  tier: "Apex Diamond" | "Diamond II" | "Platinum I" | "Platinum III" | "Gold I" | "Silver I" | "Bronze Vanguard";
  xp: number;
  streak: number;
  volumeKg: number;
  nutritionScore: number;
  isCurrentUser?: boolean;
  favDish: string;
  fistBumps: number;
  hasFistBumped?: boolean;
}

// Deterministic generator for 100+ registered athletes in global base
function generateGlobalBaseContenders(currentUserXp: number, currentUserRank: number): Contender[] {
  const curatedTop10: Contender[] = [
    {
      id: "c1",
      rank: 1,
      prevRank: 1,
      name: "Aarav Sharma",
      handle: "@aarav_fit",
      avatarText: "AS",
      location: "South Delhi / Lajpat Nagar",
      tier: "Apex Diamond",
      xp: 18450,
      streak: 42,
      volumeKg: 48600,
      nutritionScore: 99,
      favDish: "Sattu High-Protein Bowl (₹85)",
      fistBumps: 342,
    },
    {
      id: "c2",
      rank: 2,
      prevRank: 3,
      name: "Maya Patel",
      handle: "@mayalifts",
      avatarText: "MP",
      location: "Koramangala, Bangalore",
      tier: "Apex Diamond",
      xp: 16890,
      streak: 38,
      volumeKg: 42100,
      nutritionScore: 96,
      favDish: "Spiced Lentil & Tofu Medley (₹72)",
      fistBumps: 289,
    },
    {
      id: "c3",
      rank: 3,
      prevRank: 2,
      name: "Rohan Verma",
      handle: "@rohan_v",
      avatarText: "RV",
      location: "Bandra West, Mumbai",
      tier: "Apex Diamond",
      xp: 15220,
      streak: 29,
      volumeKg: 39500,
      nutritionScore: 94,
      favDish: "Paneer & Spinach Power Scramble (₹92)",
      fistBumps: 215,
    },
    {
      id: "c4",
      rank: 4,
      prevRank: 6,
      name: "Elena Rostova",
      handle: "@elena_mover",
      avatarText: "ER",
      location: "Indiranagar, Bangalore",
      tier: "Diamond II",
      xp: 13900,
      streak: 24,
      volumeKg: 36200,
      nutritionScore: 92,
      favDish: "Millet & Roasted Gram Porridge",
      fistBumps: 164,
    },
    {
      id: "c5",
      rank: 5,
      prevRank: 4,
      name: "Vikram Malhotra",
      handle: "@vikram_iron",
      avatarText: "VM",
      location: "Saket, South Delhi",
      tier: "Diamond II",
      xp: 13420,
      streak: 31,
      volumeKg: 38900,
      nutritionScore: 91,
      favDish: "Curd & Chia Seed Sattu Shake",
      fistBumps: 148,
    },
    {
      id: "c6",
      rank: 6,
      prevRank: 7,
      name: "Ananya Iyer",
      handle: "@ananya_run",
      avatarText: "AI",
      location: "Powai, Mumbai",
      tier: "Platinum I",
      xp: 11840,
      streak: 21,
      volumeKg: 28400,
      nutritionScore: 97,
      favDish: "Spiced Chickpea & Beetroot Salad",
      fistBumps: 119,
    },
    {
      id: "c7",
      rank: 7,
      prevRank: 5,
      name: "Kabir Mehta",
      handle: "@kabir_lift",
      avatarText: "KM",
      location: "Greater Kailash, Delhi",
      tier: "Platinum I",
      xp: 11210,
      streak: 19,
      volumeKg: 31200,
      nutritionScore: 89,
      favDish: "Soya Chunk & Mustard Leaf Bhurji",
      fistBumps: 96,
    },
    {
      id: "c8",
      rank: 8,
      prevRank: 8,
      name: "Zoya Chen",
      handle: "@zoya_zen",
      avatarText: "ZC",
      location: "Whitefield, Bangalore",
      tier: "Platinum III",
      xp: 9940,
      streak: 16,
      volumeKg: 24800,
      nutritionScore: 95,
      favDish: "Organic Farm Tempeh Bowl",
      fistBumps: 82,
    },
    {
      id: "c9",
      rank: 9,
      prevRank: 10,
      name: "Tenzin Norbu",
      handle: "@tenzin_power",
      avatarText: "TN",
      location: "Hauz Khas, Delhi",
      tier: "Platinum III",
      xp: 9620,
      streak: 18,
      volumeKg: 26300,
      nutritionScore: 93,
      favDish: "Tibetan Roasted Barley & Yak Whey",
      fistBumps: 77,
    },
    {
      id: "c10",
      rank: 10,
      prevRank: 9,
      name: "Priyanshu Das",
      handle: "@priyanshu_fit",
      avatarText: "PD",
      location: "Salt Lake, Kolkata",
      tier: "Platinum III",
      xp: 9350,
      streak: 15,
      volumeKg: 23900,
      nutritionScore: 90,
      favDish: "Sprouted Moong & Curd Medley",
      fistBumps: 68,
    },
  ];

  const names = [
    { name: "Meera Joshi", handle: "@meeraj", loc: "South Delhi / Hauz Khas", dish: "Sprouted Chana & Lemon Chat" },
    { name: "Arjun Singhania", handle: "@arjun_s", loc: "Gurgaon Cyber City", dish: "Grilled Tofu & Brown Rice" },
    { name: "Devika Nair", handle: "@devikan", loc: "Indiranagar, Bangalore", dish: "Steamed Ragi Idli & Sambar" },
    { name: "Siddharth Rao", handle: "@sid_iron", loc: "Jubilee Hills, Hyderabad", dish: "High-Protein Horsegram Khichdi" },
    { name: "Pooja Kapoor", handle: "@pooja_k", loc: "Saket, South Delhi", dish: "Curd Rice with Sautéed Flaxseed" },
    { name: "Sameer Khan", handle: "@sameer_k", loc: "Bandra West, Mumbai", dish: "Spiced Paneer Tikka (240g)" },
    { name: "Tara Deshmukh", handle: "@tara_fit", loc: "Kothrud, Pune", dish: "Rajma Masala & Quinoa Bowl" },
    { name: "Neil Sen", handle: "@neil_lift", loc: "South Delhi / Lajpat Nagar", dish: "Sattu & Buttermilk Refuel Shake" },
    { name: "Fatima Zahra", handle: "@fatima_z", loc: "Alwarpet, Chennai", dish: "Moong Sprouts & Grated Coconut" },
    { name: "Aditya Varma", handle: "@aditya_v", loc: "Vasant Kunj, Delhi", dish: "Egg White Bhurji & Multigrain Roti" },
    { name: "Sneha Nambiar", handle: "@sneha_fit", loc: "HSR Layout, Bangalore", dish: "Tempeh Stir Fry with Greens" },
    { name: "Rahul Bhatia", handle: "@rahul_b", loc: "Connaught Place, Delhi", dish: "Boiled Chickpea Chaat" },
    { name: "Priya Reddy", handle: "@priya_r", loc: "Banjara Hills, Hyderabad", dish: "Paneer & Spinach Green Salad" },
    { name: "Harsh Vardhan", handle: "@harsh_v", loc: "Noida Sector 62", dish: "Peanut Butter Oatmeal with Sattu" },
    { name: "Kavita Rao", handle: "@kavita_r", loc: "Aundh, Pune", dish: "Soyabean Curry & Brown Rice" },
    { name: "Manish Tiwari", handle: "@manish_t", loc: "South Delhi / Malviya Nagar", dish: "Roasted Chana & Almonds Bowl" },
    { name: "Rhea Chawla", handle: "@rhea_c", loc: "Bandra, Mumbai", dish: "Chia Seed Berry Sattu Smoothie" },
    { name: "Divya Sundaram", handle: "@divya_s", loc: "Mylapore, Chennai", dish: "Curd & Flaxseed Power Mix" },
    { name: "Kunal Ghosh", handle: "@kunal_g", loc: "Park Street, Kolkata", dish: "Steamed Fish & Green Veggies" },
    { name: "Ishaan Gupta", handle: "@ishaan_g", loc: "South Delhi / GK-2", dish: "Paneer Scramble with Spinach" },
    { name: "Nisha Singhal", handle: "@nisha_s", loc: "Viman Nagar, Pune", dish: "Ragi Dosa with Peanut Chutney" },
    { name: "Alok Kumar", handle: "@alok_k", loc: "South Delhi / Lajpat Nagar", dish: "High-Protein Dal Makhani (Fit)" },
    { name: "Simran Gill", handle: "@simran_g", loc: "Sector 17, Chandigarh", dish: "Sattu Shake with Pistachio" },
    { name: "Varun Nair", handle: "@varun_n", loc: "Whitefield, Bangalore", dish: "Grilled Tofu Salad" },
    { name: "Ananya Sen", handle: "@ananya_s", loc: "Salt Lake, Kolkata", dish: "Sprouted Green Moong Bowl" },
    { name: "Deepak Mehta", handle: "@deepak_m", loc: "Andheri West, Mumbai", dish: "Chicken Breast & Broccoli" },
    { name: "Shreya Roy", handle: "@shreya_r", loc: "New Town, Kolkata", dish: "Soyabean Bhurji with Peas" },
    { name: "Gautam Malhotra", handle: "@gautam_m", loc: "South Delhi / Saket", dish: "Paneer Tikka with Mint Dip" },
    { name: "Tanvi Saxena", handle: "@tanvi_s", loc: "DLF Phase 5, Gurgaon", dish: "Mushroom & Cottage Cheese Salad" },
    { name: "Akash Chopra", handle: "@akash_c", loc: "Juhu, Mumbai", dish: "Egg & Avocado Sourdough" },
    { name: "Juhi Aggarwal", handle: "@juhi_a", loc: "Civil Lines, Delhi", dish: "Moong Chilla with Tofu Stuffing" },
  ];

  const fullList: Contender[] = [...curatedTop10];
  let currentXpCounter = 9200;

  for (let r = 11; r <= 100; r++) {
    if (r === currentUserRank) {
      fullList.push({
        id: "c_current_user",
        rank: currentUserRank,
        prevRank: currentUserRank + 3,
        name: "David Kim (You)",
        handle: "@davidk",
        avatarText: "DK",
        location: "South Delhi / Lajpat Nagar",
        tier: "Gold I",
        xp: currentUserXp,
        streak: 14,
        volumeKg: 21400,
        nutritionScore: 93,
        favDish: "Sattu Spiced Protein Bowl (₹85)",
        isCurrentUser: true,
        fistBumps: 46,
      });
      continue;
    }

    const nameIdx = (r - 11) % names.length;
    const item = names[nameIdx];
    const initials = item.name
      .split(" ")
      .map((n) => n[0])
      .join("");

    currentXpCounter -= 40 + ((r * 19) % 55);
    const tier =
      r <= 15
        ? "Platinum III"
        : r <= 35
        ? "Gold I"
        : r <= 70
        ? "Silver I"
        : "Bronze Vanguard";

    fullList.push({
      id: `c_gen_${r}`,
      rank: r,
      prevRank: r + (r % 3 === 0 ? 1 : r % 2 === 0 ? -1 : 0),
      name: `${item.name} ${r > 40 ? `II` : ""}`.trim(),
      handle: `${item.handle}_${r}`,
      avatarText: initials,
      location: item.loc,
      tier,
      xp: currentXpCounter,
      streak: Math.max(3, 20 - Math.floor(r / 6)),
      volumeKg: Math.max(12000, 30000 - r * 160),
      nutritionScore: Math.max(75, 96 - Math.floor(r / 5)),
      favDish: item.dish,
      fistBumps: Math.max(8, 70 - Math.floor(r * 0.6)),
    });
  }

  if (!fullList.some((c) => c.isCurrentUser)) {
    fullList.push({
      id: "c_current_user",
      rank: currentUserRank,
      prevRank: currentUserRank + 2,
      name: "David Kim (You)",
      handle: "@davidk",
      avatarText: "DK",
      location: "South Delhi / Lajpat Nagar",
      tier: "Gold I",
      xp: currentUserXp,
      streak: 14,
      volumeKg: 21400,
      nutritionScore: 93,
      favDish: "Sattu Spiced Protein Bowl (₹85)",
      isCurrentUser: true,
      fistBumps: 46,
    });
  }

  return fullList;
}

export default function LeaderboardsPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filter & View States
  const [scope, setScope] = useState<"global" | "squad" | "regional" | "local">("global");
  const [metric, setMetric] = useState<"xp" | "volume" | "nutrition" | "streak">("xp");
  const [timeframe, setTimeframe] = useState<"weekly" | "season" | "alltime">("weekly");
  const [searchQuery, setSearchQuery] = useState("");

  // Mode: Top 10 + Slot 11 vs Continuous Infinite Stream of 100+ Contenders
  const [viewMode, setViewMode] = useState<"top10_and_user" | "continuous">("top10_and_user");
  const [visibleCount, setVisibleCount] = useState<number>(30);

  // User Interactive Progress State
  const [userXp, setUserXp] = useState(8420);
  const [userRank, setUserRank] = useState(42);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [equippedBadge] = useState<{ id: string; name: string }>({
    id: "apex_contender",
    name: "Apex Contender",
  });

  // Active Quests
  const [quests, setQuests] = useState([
    {
      id: "hypertrophy",
      title: "7-Day Hypertrophy Sprint",
      subtitle: "Complete 5 heavy compound sessions with volume tracking",
      current: 4,
      target: 5,
      unit: "sessions",
      rewardXp: 250,
      claimed: false,
    },
    {
      id: "kirana",
      title: "FitMeal Kirana Clean Fuel Gauntlet",
      subtitle: "Log 7 hyper-local meals sourced via street vendors & kiranas",
      current: 6,
      target: 7,
      unit: "days",
      rewardXp: 200,
      claimed: false,
    },
    {
      id: "cold_reset",
      title: "Box Breathing & Parasympathetic Reset",
      subtitle: "Complete 5 guided recovery breathing visualizer cycles",
      current: 5,
      target: 5,
      unit: "cycles",
      rewardXp: 150,
      claimed: false,
    },
  ]);

  // Season Countdown Timer
  const [secondsRemaining, setSecondsRemaining] = useState(3 * 86400 + 14 * 3600 + 22 * 60 + 45);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const d = Math.floor(totalSec / 86400);
    const h = Math.floor((totalSec % 86400) / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${d}d ${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  // Generate 100+ global contenders
  const [contenders, setContenders] = useState<Contender[]>(() =>
    generateGlobalBaseContenders(userXp, userRank)
  );

  const dynamicContenders = useMemo(() => {
    return contenders.map((c) =>
      c.isCurrentUser ? { ...c, xp: userXp, rank: userRank } : c
    );
  }, [contenders, userXp, userRank]);

  // Handle Quest Claiming
  const handleClaimQuest = (questId: string, rewardXp: number) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, claimed: true } : q))
    );
    setUserXp((prev) => prev + rewardXp);
    setUserRank((prev) => Math.max(10, prev - 3));
    setActionNotice(`🎉 Claimed +${rewardXp} XP! Climbed to Rank #${Math.max(10, userRank - 3)}!`);
    triggerArenaConfetti(canvasRef.current);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Quick XP Actions
  const handleLogWorkoutXP = () => {
    setUserXp((prev) => prev + 150);
    setUserRank((prev) => Math.max(8, prev - 2));
    setActionNotice("⚡ Session Logged! +150 XP awarded to Arena Leaderboard.");
    triggerArenaConfetti(canvasRef.current);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleLogMealXP = () => {
    setUserXp((prev) => prev + 50);
    setUserRank((prev) => Math.max(8, prev - 1));
    setActionNotice("🥗 FitMeal Local Recipe Logged! +50 XP and Kirana Fuel points added.");
    triggerArenaConfetti(canvasRef.current);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleFistBump = (contenderId: string) => {
    setContenders((prev) =>
      prev.map((c) => {
        if (c.id === contenderId && !c.hasFistBumped) {
          return { ...c, fistBumps: c.fistBumps + 1, hasFistBumped: true };
        }
        return c;
      })
    );
    setActionNotice("👊 Fist bump sent! +5 Community Karma awarded.");
    setTimeout(() => setActionNotice(null), 2500);
  };

  // Filter & Sorting Logic
  const filteredContenders = useMemo(() => {
    return dynamicContenders
      .filter((c) => {
        if (searchQuery.trim() === "") return true;
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
        );
      })
      .filter((c) => {
        if (scope === "global") return true;
        if (scope === "regional") return c.location.toLowerCase().includes("delhi");
        if (scope === "local") return c.location.toLowerCase().includes("lajpat nagar");
        if (scope === "squad") return c.isCurrentUser || c.rank <= 5;
        return true;
      })
      .sort((a, b) => {
        if (metric === "xp") return b.xp - a.xp;
        if (metric === "volume") return b.volumeKg - a.volumeKg;
        if (metric === "nutrition") return b.nutritionScore - a.nutritionScore;
        if (metric === "streak") return b.streak - a.streak;
        return a.rank - b.rank;
      });
  }, [dynamicContenders, searchQuery, scope, metric]);

  const currentUserObj = useMemo(() => {
    return (
      dynamicContenders.find((c) => c.isCurrentUser) || {
        id: "c_current_user",
        rank: userRank,
        prevRank: 45,
        name: "David Kim (You)",
        handle: "@davidk",
        avatarText: "DK",
        location: "South Delhi / Lajpat Nagar",
        tier: "Gold I" as const,
        xp: userXp,
        streak: 14,
        volumeKg: 21400,
        nutritionScore: 93,
        favDish: "Sattu Spiced Protein Bowl (₹85)",
        isCurrentUser: true,
        fistBumps: 46,
      }
    );
  }, [dynamicContenders, userRank, userXp]);

  const displayedRows = useMemo(() => {
    if (searchQuery.trim() !== "") {
      return filteredContenders.slice(0, visibleCount);
    }

    if (viewMode === "top10_and_user") {
      const top10 = filteredContenders.slice(0, 10);
      const userInTop10 = top10.some((c) => c.isCurrentUser);

      if (userInTop10) {
        return filteredContenders.slice(0, 11);
      }

      return [...top10, currentUserObj];
    }

    return filteredContenders.slice(0, visibleCount);
  }, [filteredContenders, viewMode, currentUserObj, visibleCount, searchQuery]);

  const top3 = dynamicContenders.slice(0, 3);
  const isUserSlot11 =
    viewMode === "top10_and_user" &&
    displayedRows.length === 11 &&
    displayedRows[10]?.isCurrentUser &&
    searchQuery.trim() === "";

  return (
    <ArenaToastProvider
      userXp={userXp}
      userRank={userRank}
      onOpenTiersModal={() => {
        router.push("/rewards");
      }}
      onLogWorkout={() => handleLogWorkoutXP()}
      onUserClimb={(newRank) => {
        setUserRank(newRank);
        triggerArenaConfetti(canvasRef.current);
      }}
      onUserRankDrop={(newRank) => {
        setUserRank(newRank);
      }}
    >
      {/* 
        ========================================================================
        60-30-10 PALETTE HARMONY APPLIED:
        - 60% Dominant: Deep luxury smoked obsidian slate (#0B0E0C / #121815)
        - 30% Secondary: Smoked Olive Sage (#757761) & tonal hierarchy
        - 10% Accent: Electric Solar Lime (#f7fe72) & Radiant Gold (#f4e76e)
        ========================================================================
      */}
      <div className="min-h-screen bg-[#F4F6F5] dark:bg-[#0B0E0C] text-[#121815] dark:text-[#E2E7DE] font-sans selection:bg-[#f7fe72] selection:text-[#0B0E0C] pb-28 transition-colors">
        
        {/* Confetti Overlay Canvas */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none fixed inset-0 z-50 w-full h-full"
        />

        {/* Floating Action Notice */}
        {actionNotice && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-[#18201A] via-[#121815] to-[#18201A] text-[#f7fe72] px-5 py-2.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.8)] border border-[#f7fe72]/50 text-xs font-bold flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-[#f7fe72]" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* 1. Global Navigation Bar */}
        <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0B0E0C]/95 backdrop-blur-md border-b border-[#757761]/25 shadow-2xs">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-[3.75rem] sm:h-20 py-2 sm:py-0 flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Brand Mark */}
            <Link
              href="/"
              className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7fe72] rounded-lg p-0.5 shrink-0"
              aria-label="Uchitatvam Home"
            >
              <PotatoFitLogo size="sm" variant="dark" />
            </Link>

            {/* Quick Route Switches (Optimized for Mobile) */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <Link
                href="/"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#CBD2C7] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Public Site</span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold text-[#E2E7DE] bg-white/5 hover:bg-white/10 border border-[#757761]/30 rounded-xl transition-all shadow-2xs shrink-0"
                title="Personal Athlete Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#f4e76e]" />
                <span className="hidden sm:inline">Personal </span>
                <span>Dashboard</span>
              </Link>

              {/* DEDICATED REWARDS PAGE LINK */}
              <Link
                href="/rewards"
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-black text-[#0B0E0C] bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:from-[#f4e76e] hover:to-[#dfd158] rounded-xl transition-all shadow-[0_0_15px_rgba(247,254,114,0.25)] active:scale-95 cursor-pointer shrink-0"
                title="Dedicated Rewards & Tiers"
              >
                <Award className="w-3.5 h-3.5 text-[#0B0E0C]" />
                <span>Rewards</span>
                <span className="hidden sm:inline"> &amp; Tiers</span>
              </Link>

              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18201A] border border-[#757761]/30 text-[11px] font-mono text-[#CBD2C7]">
                <span className="w-2 h-2 rounded-full bg-[#f7fe72] animate-pulse" />
                <span>ARENA LIVE</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          
          {/* 2. Season 4 Apex Protocol Banner */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EAEFEA] via-[#FFFFFF] to-[#F4F6F5] dark:from-[#18201A] dark:via-[#141A16] dark:to-[#0B0E0C] text-[#121815] dark:text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-[#757761]/30 dark:border-[#757761]/35">
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#757761]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#f7fe72]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold tracking-wider">
                  <span className="px-3 py-1 rounded-full bg-[#f7fe72] text-[#0B0E0C] font-black uppercase text-[11px] shadow-xs">
                    ACTIVE TOURNAMENT
                  </span>
                  <span className="text-[#505445] dark:text-white/30">·</span>
                  <span className="text-[#7A5A00] dark:text-[#f4e76e] flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#7A5A00] dark:text-[#f7fe72]" />
                    Ends in {formatCountdown(secondsRemaining)}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#121815] dark:text-white">
                  Season 4: Apex Protocol
                </h1>

                <p className="text-sm sm:text-base text-[#262A21] dark:text-[#CBD2C7] leading-relaxed">
                  The world’s first hyper-local fitness &amp; nutrition arena. Compete with 14,820+ athletes
                  globally and in South Delhi. Level up with verified Kirana fuel logging, progressive overload volume, and unbroken habit streaks.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#505445] dark:text-[#CBD2C7]">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-[#7A5A00] dark:text-[#f7fe72]" />
                    <span>Prize: ₹50,000 FitMeal Credits &amp; Apex Ring</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#7A5A00] dark:text-[#f4e76e]" />
                    <span>Active Hub: South Delhi / Lajpat Nagar</span>
                  </div>
                </div>

                {/* Direct Link to Dedicated Rewards Page */}
                <div className="pt-2">
                  <Link
                    href="/rewards"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] hover:brightness-110 font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer border border-[#f7fe72]/40"
                  >
                    <Award className="w-4 h-4 text-[#0B0E0C]" />
                    <span>Inspect Reward Tiers &amp; Badges (Dedicated Page)</span>
                  </Link>
                </div>
              </div>

              {/* Quick Stats Grid (Smoked Olive Slate Surfaces) */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 lg:w-80">
                <div className="bg-white dark:bg-[#101512]/80 backdrop-blur-md border border-[#757761]/25 dark:border-[#757761]/30 rounded-2xl p-4 shadow-sm dark:shadow-none">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#505445] dark:text-[#A0A594]">
                    Active Contenders
                  </span>
                  <div className="text-2xl font-black font-mono text-[#7A5A00] dark:text-[#f7fe72] mt-0.5">
                    14,820
                  </div>
                  <span className="text-[11px] text-[#505445] dark:text-[#A0A594]">Worldwide Base</span>
                </div>

                <div className="bg-white dark:bg-[#101512]/80 backdrop-blur-md border border-[#757761]/25 dark:border-[#757761]/30 rounded-2xl p-4 shadow-sm dark:shadow-none">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#505445] dark:text-[#A0A594]">
                    Workouts Logged
                  </span>
                  <div className="text-2xl font-black font-mono text-[#121815] dark:text-white mt-0.5">
                    89,450
                  </div>
                  <span className="text-[11px] text-[#505445] dark:text-[#A0A594]">This Week</span>
                </div>

                <div className="bg-white dark:bg-[#101512]/80 backdrop-blur-md border border-[#757761]/25 dark:border-[#757761]/30 rounded-2xl p-4 shadow-sm dark:shadow-none">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#505445] dark:text-[#A0A594]">
                    Energy Burned
                  </span>
                  <div className="text-2xl font-black font-mono text-[#121815] dark:text-white mt-0.5">
                    42.8M
                  </div>
                  <span className="text-[11px] text-[#505445] dark:text-[#A0A594]">Total kcal</span>
                </div>

                <div className="bg-white dark:bg-[#101512]/80 backdrop-blur-md border border-[#757761]/25 dark:border-[#757761]/30 rounded-2xl p-4 shadow-sm dark:shadow-none">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#505445] dark:text-[#A0A594]">
                    Kirana Savings
                  </span>
                  <div className="text-2xl font-black font-mono text-[#7A5A00] dark:text-[#f4e76e] mt-0.5">
                    ₹1.2M
                  </div>
                  <span className="text-[11px] text-[#505445] dark:text-[#A0A493]">Saved vs Packaged</span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Weekly Arena Quests & Community Raids */}
          <section className="bg-[#121815] rounded-3xl p-6 sm:p-8 border border-[#757761]/30 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#757761]/25">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#f7fe72] uppercase tracking-wider font-mono">
                  <Zap className="w-3.5 h-3.5 text-[#f7fe72]" />
                  <span>Live Arena Challenges</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  Weekly Quests &amp; XP Multipliers
                </h2>
              </div>
              <span className="text-xs text-[#A0A594] font-medium">
                Reset every Sunday 11:59 PM IST
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quests.map((q) => {
                const progressPct = Math.min(100, Math.round((q.current / q.target) * 100));
                const isReady = q.current >= q.target && !q.claimed;

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                      q.claimed
                        ? "bg-[#18201B]/50 border-[#757761]/20 opacity-70"
                        : isReady
                        ? "bg-gradient-to-b from-[#18201A] to-[#141A16] border-[#757761]/60 shadow-[0_0_20px_rgba(117,119,97,0.15)]"
                        : "bg-[#18201B] border-[#757761]/30 hover:border-[#757761]/60"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold font-mono text-[#0B0E0C] bg-[#f7fe72] px-2 py-0.5 rounded">
                          +{q.rewardXp} XP
                        </span>
                        {q.claimed && (
                          <span className="text-xs font-semibold text-[#A0A594] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#f7fe72]" />
                            Claimed
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white leading-snug">{q.title}</h3>
                      <p className="text-xs text-[#A0A594] leading-relaxed">{q.subtitle}</p>
                    </div>

                    <div className="pt-4 space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-[#CBD2C7]">
                          <span>Progress</span>
                          <span className="font-mono text-[#f4e76e]">
                            {q.current} / {q.target} {q.unit} ({progressPct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              q.claimed
                                ? "bg-[#757761]"
                                : "bg-gradient-to-r from-[#757761] to-[#f7fe72]"
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>

                      {isReady ? (
                        <button
                          onClick={() => handleClaimQuest(q.id, q.rewardXp)}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:from-[#f4e76e] hover:to-[#dfd158] text-[#0B0E0C] font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#0B0E0C]" />
                          <span>Claim +{q.rewardXp} XP</span>
                        </button>
                      ) : q.claimed ? (
                        <div className="w-full py-2 text-center text-xs font-semibold text-[#A0A594] bg-white/5 rounded-xl border border-white/5">
                          Completed &amp; Added to XP
                        </div>
                      ) : (
                        <div className="w-full py-2 text-center text-xs font-semibold text-[#CBD2C7] bg-black/30 border border-[#757761]/30 rounded-xl">
                          In Progress ({q.target - q.current} remaining)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. Top 3 Champions Podium (10% Accent Gold/Lime on Rank 1) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#f7fe72] uppercase tracking-wider font-mono">
                  Hall of Champions
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Current Podium Leaders
                </h2>
              </div>
              <div className="text-xs text-[#A0A594] hidden sm:block">
                Live updates synced every 60 seconds
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 items-end">
              {/* Rank 2 (Silver Vanguard) */}
              <div className="order-2 md:order-1 bg-[#141A16] rounded-3xl p-6 border border-[#757761]/40 shadow-xl flex flex-col items-center text-center relative md:translate-y-4">
                <CanvasBadge
                  tier="silver"
                  emblem="trophy"
                  size={62}
                  className="mb-2"
                />
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E2E7DE] bg-white/10 px-2.5 py-0.5 rounded-full mb-1">
                  <Medal className="w-3 h-3 text-[#CBD2C7]" />
                  Rank #2 · Silver Titan
                </span>
                <h3 className="text-base font-bold text-white">{top3[1]?.name}</h3>
                <p className="text-xs text-[#A0A594] mb-3">{top3[1]?.location}</p>

                <div className="w-full bg-black/30 rounded-xl p-3 border border-white/5 space-y-1 mb-4 text-left">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A0A594]">Total Score:</span>
                    <span className="font-black font-mono text-white">{top3[1]?.xp.toLocaleString()} XP</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A0A594]">Streak:</span>
                    <span className="font-semibold text-[#f4e76e] flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-[#f4e76e] text-[#f4e76e]" />
                      {top3[1]?.streak} Days
                    </span>
                  </div>
                  <div className="text-[11px] text-[#A0A594] pt-1 border-t border-white/5 truncate">
                    Fuel: {top3[1]?.favDish}
                  </div>
                </div>

                <button
                  onClick={() => handleFistBump(top3[1].id)}
                  disabled={top3[1].hasFistBumped}
                  className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-[#757761]/40 text-[#E2E7DE] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>👊 Fist Bump ({top3[1]?.fistBumps})</span>
                </button>
              </div>

              {/* Rank 1 (Gold Champion - Radiant Accent 10%) */}
              <div className="order-1 md:order-2 bg-gradient-to-b from-[#FFFDF0] via-[#FFFFFF] to-[#F4F6F5] dark:from-[#18201A] dark:via-[#141A16] dark:to-[#121815] text-[#121815] dark:text-white rounded-3xl p-6 sm:p-7 border-2 border-[#7A5A00]/40 dark:border-[#f7fe72]/80 shadow-xl dark:shadow-[0_0_40px_rgba(247,254,114,0.18)] flex flex-col items-center text-center relative z-10">
                <div className="absolute -top-4 bg-[#f7fe72] text-[#0B0E0C] px-3.5 py-1 rounded-full text-xs font-black tracking-wide flex items-center gap-1.5 shadow-md">
                  <Crown className="w-3.5 h-3.5 text-[#0B0E0C] fill-[#0B0E0C]" />
                  <span>CHAMPION</span>
                </div>

                <CanvasBadge
                  tier="gold"
                  emblem="crown"
                  size={74}
                  className="mb-2 mt-1"
                />

                <span className="inline-flex items-center gap-1 text-xs font-black text-[#0B0E0C] bg-[#f7fe72] px-3 py-0.5 rounded-full mb-1">
                  <Trophy className="w-3.5 h-3.5 text-[#0B0E0C]" />
                  Rank #1 · Apex Champion
                </span>

                <h3 className="text-lg font-black text-[#121815] dark:text-white">{top3[0]?.name}</h3>
                <p className="text-xs text-[#505445] dark:text-[#CBD2C7] mb-3">{top3[0]?.location}</p>

                <div className="w-full bg-[#F4F6F5] dark:bg-black/40 rounded-xl p-3.5 border border-[#757761]/25 dark:border-[#757761]/40 space-y-1.5 mb-4 text-left shadow-inner">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#505445] dark:text-[#A0A493]">Arena Rating:</span>
                    <span className="font-black font-mono text-[#7A5A00] dark:text-[#f7fe72] text-sm">
                      {top3[0]?.xp.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#505445] dark:text-[#A0A493]">Unbroken Streak:</span>
                    <span className="font-bold text-[#7A5A00] dark:text-[#f4e76e] flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      {top3[0]?.streak} Days
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#505445] dark:text-[#A0A493]">Volume Lifted:</span>
                    <span className="font-mono text-[#121815] dark:text-[#E2E7DE]">{top3[0]?.volumeKg.toLocaleString()} kg</span>
                  </div>
                  <div className="text-[11px] text-[#262A21] dark:text-[#CBD2C7] pt-1.5 border-t border-[#757761]/20 dark:border-white/10 truncate">
                    ⚡ Staple Fuel: <span className="font-semibold text-[#121815] dark:text-white">{top3[0]?.favDish}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleFistBump(top3[0].id)}
                  disabled={top3[0].hasFistBumped}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:from-[#f4e76e] hover:to-[#dfd158] text-[#0B0E0C] rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span>👊 Salute Champion ({top3[0]?.fistBumps})</span>
                </button>
              </div>

              {/* Rank 3 (Bronze Vanguard) */}
              <div className="order-3 bg-[#141A16] rounded-3xl p-6 border border-[#757761]/40 shadow-xl flex flex-col items-center text-center relative md:translate-y-4">
                <CanvasBadge
                  tier="bronze"
                  emblem="star"
                  size={58}
                  className="mb-2"
                />
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-200 bg-amber-950/60 px-2.5 py-0.5 rounded-full mb-1 border border-amber-700/50">
                  <Medal className="w-3 h-3 text-amber-400" />
                  Rank #3 · Bronze Vanguard
                </span>
                <h3 className="text-base font-bold text-white">{top3[2]?.name}</h3>
                <p className="text-xs text-[#A0A594] mb-3">{top3[2]?.location}</p>

                <div className="w-full bg-black/30 rounded-xl p-3 border border-white/5 space-y-1 mb-4 text-left">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A0A594]">Total Score:</span>
                    <span className="font-black font-mono text-white">{top3[2]?.xp.toLocaleString()} XP</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A0A594]">Streak:</span>
                    <span className="font-semibold text-[#f4e76e] flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-[#f4e76e] text-[#f4e76e]" />
                      {top3[2]?.streak} Days
                    </span>
                  </div>
                  <div className="text-[11px] text-[#A0A594] pt-1 border-t border-white/5 truncate">
                    Fuel: {top3[2]?.favDish}
                  </div>
                </div>

                <button
                  onClick={() => handleFistBump(top3[2].id)}
                  disabled={top3[2].hasFistBumped}
                  className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-[#757761]/40 text-[#E2E7DE] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>👊 Fist Bump ({top3[2]?.fistBumps})</span>
                </button>
              </div>
            </div>
          </section>

          {/* 5. Live Global & Hyper-Local Standings Centerpiece Table */}
          <section className="bg-[#121815] rounded-3xl p-6 sm:p-8 border border-[#757761]/30 shadow-2xl space-y-6">
            
            {/* Header Controls & Centerpiece Title */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f7fe72] animate-ping inline-block" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f7fe72]">
                      LIVE RADAR STANDINGS // 100+ GLOBAL BASE
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                    Live Global &amp; Hyper-Local Standings
                  </h3>
                  <p className="text-xs sm:text-sm text-[#A0A594] mt-1">
                    Showing Top 10 leaders with Row #11 pinned to your live standing. Continuously streamed across 100s of registered contenders worldwide.
                  </p>
                </div>

                {/* Search Bar & View Mode Toggle Cluster */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
                  {/* View Mode Toggle: Top 10 + Slot 11 VS Continuous Stream */}
                  <div className="flex items-center p-1 bg-black/40 border border-[#757761]/30 rounded-xl text-xs font-bold w-full sm:w-auto">
                    <button
                      onClick={() => setViewMode("top10_and_user")}
                      className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        viewMode === "top10_and_user"
                          ? "bg-[#f7fe72] text-[#0B0E0C] shadow-md font-black"
                          : "text-[#A0A594] hover:text-white"
                      }`}
                    >
                      Top 10 + Your Standing (11)
                    </button>
                    <button
                      onClick={() => setViewMode("continuous")}
                      className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        viewMode === "continuous"
                          ? "bg-[#f7fe72] text-[#0B0E0C] shadow-md font-black"
                          : "text-[#A0A594] hover:text-white"
                      }`}
                    >
                      Continuous Stream (100+)
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-[#A0A594] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search 100+ athletes or city..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-black/40 border border-[#757761]/40 focus:outline-none focus:ring-2 focus:ring-[#f7fe72] focus:bg-[#18201B] text-white placeholder-[#757761]"
                    />
                  </div>
                </div>
              </div>

              {/* Segmented Controls Cluster */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#757761]/25">
                
                {/* Geographic Scope Filter (HeroUI Tabs) */}
                <Tabs
                  selectedKey={scope}
                  onSelectionChange={(key) => setScope(key as "global" | "squad" | "regional" | "local")}
                  className="w-auto"
                >
                  <Tabs.ListContainer className="p-0 bg-transparent">
                    <Tabs.List aria-label="Geographic Scope" className="flex items-center gap-1 p-1 bg-black/40 border border-[#757761]/30 rounded-xl text-xs font-semibold overflow-x-auto">
                      <Tabs.Tab id="global" className="cursor-pointer">
                        <span>Global (100+)</span>
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab id="squad" className="cursor-pointer">
                        <span>Squad / Friends</span>
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab id="regional" className="cursor-pointer">
                        <span>Delhi NCR</span>
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab id="local" className="cursor-pointer">
                        <span>Hyper-Local (&lt;5km)</span>
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs.ListContainer>
                </Tabs>

                {/* Metric Selector (HeroUI Tabs) */}
                <Tabs
                  selectedKey={metric}
                  onSelectionChange={(key) => setMetric(key as "xp" | "volume" | "nutrition" | "streak")}
                  className="w-auto"
                >
                  <Tabs.ListContainer className="p-0 bg-transparent">
                    <Tabs.List aria-label="Metric Selector" className="flex items-center gap-1 p-1 bg-black/40 border border-[#757761]/30 rounded-xl text-xs font-semibold overflow-x-auto">
                      <Tabs.Tab id="xp" className="cursor-pointer">
                        <span>Arena XP</span>
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab id="volume" className="cursor-pointer">
                        <span>Volume (kg)</span>
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab id="nutrition" className="cursor-pointer">
                        <span>Kirana Diet %</span>
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab id="streak" className="cursor-pointer">
                        <span>Streak Days</span>
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs.ListContainer>
                </Tabs>

                {/* Timeframe (HeroUI Tabs) */}
                <div className="flex items-center gap-1 text-xs text-[#A0A594]">
                  <span className="font-semibold text-[#757761]">Timeframe:</span>
                  <Tabs
                    selectedKey={timeframe}
                    onSelectionChange={(key) => setTimeframe(key as "weekly" | "season" | "alltime")}
                    className="w-auto"
                  >
                    <Tabs.ListContainer className="p-0 bg-transparent">
                      <Tabs.List aria-label="Timeframe" className="flex items-center gap-1 p-1 bg-black/40 border border-[#757761]/30 rounded-xl text-xs font-semibold">
                        <Tabs.Tab id="weekly" className="cursor-pointer">
                          <span>This Week</span>
                          <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="season" className="cursor-pointer">
                          <span>Season 4</span>
                          <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="alltime" className="cursor-pointer">
                          <span>All-Time</span>
                          <Tabs.Indicator />
                        </Tabs.Tab>
                      </Tabs.List>
                    </Tabs.ListContainer>
                  </Tabs>
                </div>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#757761]/30 text-[11px] font-bold text-[#A0A594] uppercase tracking-wider font-mono bg-black/20">
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Athlete</th>
                    <th className="py-3 px-3">Division Tier</th>
                    <th className="py-3 px-3">Active Streak</th>
                    <th className="py-3 px-3">Volume Lifted</th>
                    <th className="py-3 px-3">Kirana Fuel</th>
                    <th className="py-3 px-3 text-right">Arena Score</th>
                    <th className="py-3 px-3 text-center">Fist Bump</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#757761]/20 text-xs">
                  {displayedRows.map((contender, index) => {
                    const rankDiff = contender.prevRank - contender.rank;
                    const isUser = contender.isCurrentUser;
                    const isRow11Break = isUserSlot11 && index === 10;

                    return (
                      <React.Fragment key={`${contender.id}-${contender.rank}`}>
                        {/* Break divider for Slot 11 mode */}
                        {isRow11Break && (
                          <tr className="bg-gradient-to-r from-[#18201A]/60 via-[#141A16] to-[#18201A]/60 border-y border-[#757761]/50">
                            <td colSpan={8} className="py-2.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-[#f7fe72]">
                                <span>•••</span>
                                <span className="bg-[#f7fe72] text-[#0B0E0C] font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider shadow-xs">
                                  YOUR CURRENT PLACEMENT IN GLOBAL BASE
                                </span>
                                <span className="text-[#CBD2C7]">(Rank #{contender.rank} of 14,820 Contenders)</span>
                                <span>•••</span>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Contender Row */}
                        <tr
                          className={`transition-all ${
                            isUser
                              ? "bg-gradient-to-r from-[#757761]/25 via-[#f7fe72]/15 to-[#757761]/25 border-y-2 border-[#f7fe72] shadow-[0_0_30px_rgba(247,254,114,0.15)] relative z-10"
                              : "hover:bg-white/[0.04]"
                          }`}
                        >
                          {/* Rank & Movement */}
                          <td className={`whitespace-nowrap ${isUser ? "py-4 sm:py-5 px-3 sm:px-4" : "py-3.5 px-3"}`}>
                            <div className="flex items-center gap-1.5 font-mono">
                              <span
                                className={`w-8 text-center font-black ${
                                  isUser
                                    ? "text-base sm:text-lg text-[#f7fe72] font-mono tracking-tight"
                                    : contender.rank === 1
                                    ? "text-[#f7fe72] text-sm"
                                    : contender.rank === 2
                                    ? "text-[#CBD2C7] text-sm"
                                    : contender.rank === 3
                                    ? "text-amber-400 text-sm"
                                    : "text-[#E2E7DE] text-xs"
                                }`}
                              >
                                #{contender.rank}
                              </span>

                              {rankDiff > 0 ? (
                                <span className="text-[10px] text-[#f7fe72] font-bold flex items-center">
                                  <ArrowUp className="w-3 h-3" />+{rankDiff}
                                </span>
                              ) : rankDiff < 0 ? (
                                <span className="text-[10px] text-rose-400 font-bold flex items-center">
                                  <ArrowDown className="w-3 h-3" />
                                  {rankDiff}
                                </span>
                              ) : (
                                <span className="text-[10px] text-[#757761]">
                                  <Minus className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Athlete Details */}
                          <td className={`${isUser ? "py-4 sm:py-5 px-3 sm:px-4" : "py-3.5 px-3 whitespace-nowrap"}`}>
                            <div className="flex items-center gap-3 min-w-0 max-w-sm">
                              {/* Avatar */}
                              <div
                                className={`rounded-xl flex items-center justify-center font-black shrink-0 transition-transform ${
                                  isUser
                                    ? "w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-[#18201A] via-[#141A16] to-[#0B0E0C] text-[#f7fe72] border-2 border-[#f7fe72] ring-4 ring-[#f7fe72]/20 shadow-md text-sm sm:text-base"
                                    : "w-9 h-9 bg-black/60 border border-[#757761]/40 text-[#E2E7DE] text-xs"
                                }`}
                              >
                                {contender.avatarText}
                              </div>

                              <div className="min-w-0 flex-1">
                                {/* Upper status badges row above name to prevent over-width row */}
                                {isUser && (
                                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                    <span className="text-[10px] bg-[#f7fe72] text-[#0B0E0C] font-black px-2 py-0.5 rounded-full shadow-2xs">
                                      YOU
                                    </span>

                                    {/* Buffering Indicator for Logged User (10% Electric Accent) */}
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#f7fe72] text-[#0B0E0C] text-[10px] font-mono font-black tracking-wider animate-pulse shadow-xs">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B0E0C] animate-ping inline-block shrink-0" />
                                      <span>LIVE BUFFERING // SYNCED</span>
                                    </span>

                                    {equippedBadge && (
                                      <Link
                                        href="/rewards"
                                        className="text-[10px] bg-[#18201A] hover:bg-[#202b23] text-[#A0A594] border border-[#757761]/60 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors"
                                        title="Equipped Badge - Click to view dedicated Rewards page"
                                      >
                                        <Award className="w-2.5 h-2.5 text-[#f7fe72] shrink-0" />
                                        <span>{equippedBadge.name}</span>
                                      </Link>
                                    )}
                                  </div>
                                )}

                                {/* Athlete Name */}
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`${
                                      isUser
                                        ? "text-base sm:text-lg font-black text-white tracking-tight"
                                        : "font-bold text-white text-xs"
                                    }`}
                                  >
                                    {contender.name}
                                  </span>
                                </div>

                                {/* Handle & Location */}
                                <div className={`flex items-center gap-1 text-[#A0A594] truncate ${isUser ? "text-xs font-medium mt-0.5" : "text-[11px]"}`}>
                                  <span className={isUser ? "font-bold text-[#CBD2C7]" : ""}>{contender.handle}</span>
                                  <span>·</span>
                                  <span className="truncate max-w-[180px] text-[#757761]">{contender.location}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Division Tier Badge */}
                          <td className={`whitespace-nowrap ${isUser ? "py-4 sm:py-5 px-3 sm:px-4" : "py-3.5 px-3"}`}>
                            <Link
                              href="/rewards"
                              className={`inline-flex items-center gap-1 font-bold rounded transition-colors cursor-pointer ${
                                isUser
                                  ? "text-xs text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#f4e76e] px-2.5 py-1 border border-[#f7fe72] font-mono shadow-xs"
                                  : "text-[11px] text-[#A0A594] bg-[#18201A]/70 hover:bg-[#202b23] border border-[#757761]/40 px-2 py-0.5"
                              }`}
                              title="View Dedicated Rewards Page"
                            >
                              <Award className={`${isUser ? "w-3.5 h-3.5 text-[#0B0E0C]" : "w-3 h-3 text-[#f4e76e]"}`} />
                              <span>{contender.tier}</span>
                            </Link>
                          </td>

                          {/* Streak */}
                          <td className={`whitespace-nowrap ${isUser ? "py-4 sm:py-5 px-3 sm:px-4" : "py-3.5 px-3"}`}>
                            <span className={`inline-flex items-center gap-1 ${isUser ? "text-sm font-black text-[#f4e76e]" : "font-semibold text-[#CBD2C7] text-xs"}`}>
                              <Flame className={`${isUser ? "w-4 h-4 fill-[#f7fe72] text-[#f7fe72]" : "w-3.5 h-3.5 text-[#f4e76e] fill-[#f4e76e]"}`} />
                              {contender.streak} days
                            </span>
                          </td>

                          {/* Volume Lifted */}
                          <td className={`whitespace-nowrap font-mono ${isUser ? "py-4 sm:py-5 px-3 sm:px-4 text-sm font-bold text-white" : "py-3.5 px-3 text-xs text-[#CBD2C7]"}`}>
                            {contender.volumeKg.toLocaleString()} kg
                          </td>

                          {/* Nutrition Compliance */}
                          <td className={`whitespace-nowrap ${isUser ? "py-4 sm:py-5 px-3 sm:px-4" : "py-3.5 px-3"}`}>
                            <div className="flex items-center gap-2">
                              <div className={`${isUser ? "w-20 h-2 bg-black/60" : "w-16 h-1.5 bg-black/40"} rounded-full overflow-hidden`}>
                                <div
                                  className="h-full bg-gradient-to-r from-[#757761] to-[#f7fe72] rounded-full"
                                  style={{ width: `${contender.nutritionScore}%` }}
                                />
                              </div>
                              <span className={`font-mono font-semibold ${isUser ? "text-xs sm:text-sm font-bold text-white" : "text-xs text-[#CBD2C7]"}`}>
                                {contender.nutritionScore}%
                              </span>
                            </div>
                          </td>

                          {/* Arena Score XP (Bigger Font for Current User) */}
                          <td className={`whitespace-nowrap text-right font-black font-mono ${isUser ? "py-4 sm:py-5 px-3 sm:px-4 text-base sm:text-lg text-[#f7fe72]" : "py-3.5 px-3 text-sm text-[#E2E7DE]"}`}>
                            {contender.xp.toLocaleString()}{" "}
                            <span className={`font-sans font-medium ${isUser ? "text-xs text-[#f4e76e] font-bold" : "text-[11px] text-[#757761]"}`}>XP</span>
                          </td>

                          {/* Interaction */}
                          <td className={`whitespace-nowrap text-center ${isUser ? "py-4 sm:py-5 px-3 sm:px-4" : "py-3.5 px-3"}`}>
                            <button
                              onClick={() => handleFistBump(contender.id)}
                              disabled={contender.hasFistBumped || isUser}
                              title={isUser ? "You can't bump yourself!" : "Send a fist bump"}
                              className={`rounded-lg border transition-colors cursor-pointer ${
                                isUser
                                  ? "p-2 opacity-40 cursor-not-allowed border-[#757761]/30 text-[#757761] text-xs"
                                  : contender.hasFistBumped
                                  ? "p-1.5 bg-[#757761]/30 border-[#757761] text-[#f7fe72] text-xs"
                                  : "p-1.5 bg-black/40 hover:bg-white/10 border-[#757761]/40 text-[#CBD2C7] text-xs"
                              }`}
                            >
                              👊 {contender.fistBumps}
                            </button>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Continuous Infinite Stream Footer Controls */}
            <div className="pt-4 border-t border-[#757761]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-[#A0A594] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#f7fe72]" />
                <span>
                  Showing <strong className="text-white">{displayedRows.length}</strong> of <strong className="text-white">{filteredContenders.length}</strong> contenders
                  (14,820 total athletes registered in base).
                </span>
              </div>

              {viewMode === "continuous" && visibleCount < filteredContenders.length ? (
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(filteredContenders.length, prev + 30))}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-[#757761]/40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4 text-[#f7fe72]" />
                  <span>Load Next 30 Contenders (+Infinite Stream)</span>
                </button>
              ) : viewMode === "top10_and_user" ? (
                <button
                  onClick={() => {
                    setViewMode("continuous");
                    setVisibleCount(50);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] hover:brightness-110 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md border border-[#f7fe72]/40"
                >
                  <TrendingUp className="w-4 h-4 text-[#0B0E0C]" />
                  <span>Explore All 100+ Contenders (Continuous Roster)</span>
                </button>
              ) : (
                <div className="text-xs text-[#f7fe72] font-semibold font-mono">
                  ✓ All {filteredContenders.length} contenders loaded in live base
                </div>
              )}
            </div>
          </section>
        </main>

        {/* 6. Current User Sticky Persistent Scorecard / HUD */}
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0E0C]/95 backdrop-blur-md border-t border-[#757761]/35 shadow-2xl px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* User Status */}
            <div className="flex items-center gap-3">
              <Link
                href="/rewards"
                className="relative transition-transform hover:scale-105 cursor-pointer shrink-0"
                title="Click to view Dedicated Rewards Page"
              >
                <CanvasBadge tier="gold" emblem="trophy" size={42} className="shrink-0" />
              </Link>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="font-black text-xs sm:text-sm text-white">David Kim</span>
                  <span className="text-[10px] sm:text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] px-1.5 sm:px-2 py-0.5 rounded font-mono">
                    #{userRank} Global
                  </span>
                  <Link
                    href="/rewards"
                    className="text-[10px] sm:text-xs font-black text-[#0B0E0C] bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:brightness-110 border border-[#f7fe72]/60 px-2 py-0.5 rounded flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                    title="View dedicated Rewards &amp; Tiers page"
                  >
                    <Award className="w-3 h-3 text-[#0B0E0C]" />
                    <span>Gold I</span>
                  </Link>
                  <Link
                    href="/rewards"
                    className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono text-[#A0A594] bg-[#18201A] hover:bg-[#202b23] border border-[#757761]/50 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                    title="Equipped Arena Badge - Click to Change on Rewards Page"
                  >
                    <span>🛡️ {equippedBadge.name}</span>
                  </Link>
                </div>
                <div className="text-[11px] text-[#A0A594] flex items-center gap-2 pt-0.5">
                  <span className="font-mono font-bold text-[#f7fe72]">{userXp.toLocaleString()} XP</span>
                  <span>·</span>
                  <span>Need {Math.max(0, 10000 - userXp)} XP to reach Emerald Titan</span>
                  <div className="w-20 h-1.5 bg-black/60 rounded-full overflow-hidden hidden md:block">
                    <div
                      className="h-full bg-gradient-to-r from-[#757761] to-[#f7fe72] rounded-full"
                      style={{ width: `${Math.min(100, ((userXp - 5000) / 5000) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Climb Triggers & Reward Page button */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                href="/rewards"
                className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] hover:brightness-110 text-[11px] sm:text-xs font-black transition-all active:scale-95 cursor-pointer shadow-sm border border-[#f7fe72]/50"
                title="Open Dedicated Rewards Page"
              >
                <Award className="w-3.5 h-3.5 text-[#0B0E0C]" />
                <span className="hidden sm:inline">Rewards </span>
                <span>Page</span>
              </Link>

              <button
                onClick={handleLogMealXP}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-black/40 hover:bg-white/10 border border-[#757761]/40 text-[11px] sm:text-xs font-bold text-[#E2E7DE] transition-all active:scale-95 cursor-pointer shadow-2xs"
              >
                <Utensils className="w-3.5 h-3.5 text-[#f4e76e]" />
                <span className="hidden sm:inline">Log Kirana Fuel</span>
                <span className="sm:hidden">Fuel</span>
                <span className="text-[#f7fe72]"> (+50)</span>
              </button>

              <button
                onClick={handleLogWorkoutXP}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:from-[#f4e76e] hover:to-[#dfd158] text-[#0B0E0C] text-[11px] sm:text-xs font-black transition-all active:scale-95 cursor-pointer shadow-md"
              >
                <Dumbbell className="w-3.5 h-3.5 text-[#0B0E0C]" />
                <span className="hidden sm:inline">Log Session</span>
                <span className="sm:hidden">Workout</span>
                <span> (+150)</span>
              </button>

              <Link
                href="/dashboard"
                className="p-1.5 sm:p-2 rounded-xl border border-[#757761]/40 hover:bg-white/10 text-[#A0A594] hover:text-white transition-colors"
                title="Return to Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </ArenaToastProvider>
  );
}
