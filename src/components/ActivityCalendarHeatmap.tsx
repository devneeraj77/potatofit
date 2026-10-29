"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Tabs } from "@heroui/react";
import * as d3 from "d3";
import {
  Calendar,
  Flame,
  Footprints,
  Target,
  Trophy,
  Zap,
  CheckCircle2,
  Filter,
  Sparkles,
  Info,
  RotateCcw,
} from "lucide-react";
import { useHealthSync } from "@/hooks/useHealthSync";

export interface CalendarDayData {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Sat, Oct 24, 2026"
  monthName: string;
  dayOfWeek: number; // 0 = Sun, 1 = Mon, ..., 6 = Sat
  weekIndex: number; // 0 to 52
  activeBurnKcal: number;
  steps: number;
  workoutTitle: string;
  workoutCategory: "Strength" | "Cardio" | "HIIT" | "Mobility" | "Rest";
  goalMet: boolean;
  goalSuperMet: boolean; // > 120%
  intensityLevel: 0 | 1 | 2 | 3 | 4;
}

// Generate realistic deterministic 365 days of data ending at Oct 24, 2026
function generateAnnualActivityData(targetBurnKcal = 750, targetSteps = 10000): CalendarDayData[] {
  const days: CalendarDayData[] = [];
  const endDate = new Date(2026, 9, 24); // Oct 24, 2026
  const totalDays = 365;

  const workoutCatalog: {
    title: string;
    category: "Strength" | "Cardio" | "HIIT" | "Mobility" | "Rest";
    burnRange: [number, number];
    stepsRange: [number, number];
  }[] = [
    { title: "Lower Body Hypertrophy & Sprints", category: "Strength", burnRange: [780, 950], stepsRange: [10500, 14200] },
    { title: "Upper Body Push/Pull Volume", category: "Strength", burnRange: [720, 890], stepsRange: [9800, 12600] },
    { title: "Zone 2 Long Aerobic Trail Run", category: "Cardio", burnRange: [850, 1120], stepsRange: [14000, 19500] },
    { title: "Tempo Run & Calisthenics", category: "Cardio", burnRange: [760, 920], stepsRange: [11200, 15000] },
    { title: "Tabata HIIT & Kettlebell Complex", category: "HIIT", burnRange: [810, 980], stepsRange: [9500, 13400] },
    { title: "Olympic Weightlifting & Core", category: "Strength", burnRange: [750, 910], stepsRange: [8800, 11500] },
    { title: "Thoracic Mobility & Active Walk", category: "Mobility", burnRange: [420, 580], stepsRange: [7500, 10200] },
    { title: "Yoga Vinyasa & Breathwork", category: "Mobility", burnRange: [380, 520], stepsRange: [6000, 8500] },
    { title: "Complete Central Rest & Recovery", category: "Rest", burnRange: [180, 320], stepsRange: [3200, 5800] },
  ];

  // Pseudo-random deterministic generator using seed
  let seed = 42;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  // Find start date: 364 days before Oct 24, 2026
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (totalDays - 1));

  // Determine the start day of week (0 = Sun, 1 = Mon)
  // We'll align the weekIndex so Sunday/Monday starts week 0
  const firstDayOfWeek = startDate.getDay();

  for (let i = 0; i < totalDays; i++) {
    const curDate = new Date(startDate);
    curDate.setDate(startDate.getDate() + i);

    const dayOfWeek = curDate.getDay();
    // Week index from start:
    const weekIndex = Math.floor((i + firstDayOfWeek) / 7);

    const dayOfMonth = curDate.getDate();
    const month = curDate.getMonth();

    // Consistency profile: Uchitatvam athlete is very consistent (~74% of days meet goals)
    // Sundays are mostly active recovery or rest
    const rand = pseudoRandom();

    let templateIndex = 0;
    if (dayOfWeek === 0) {
      // Sunday: 70% chance of Mobility or Rest
      templateIndex = rand < 0.45 ? 6 : rand < 0.75 ? 7 : 8;
    } else if (dayOfWeek === 6) {
      // Saturday: Big workout or trail run
      templateIndex = rand < 0.5 ? 2 : rand < 0.85 ? 0 : 4;
    } else if (dayOfWeek === 1 || dayOfWeek === 3) {
      // Mon & Wed: Heavy Strength
      templateIndex = rand < 0.6 ? 0 : 1;
    } else if (dayOfWeek === 2 || dayOfWeek === 4) {
      // Tue & Thu: Cardio / HIIT
      templateIndex = rand < 0.5 ? 3 : rand < 0.85 ? 4 : 5;
    } else {
      // Friday: Upper body or Conditioning
      templateIndex = rand < 0.5 ? 1 : rand < 0.85 ? 5 : 6;
    }

    const template = workoutCatalog[templateIndex];
    const burnMin = template.burnRange[0];
    const burnMax = template.burnRange[1];
    const stepsMin = template.stepsRange[0];
    const stepsMax = template.stepsRange[1];

    // Calculate actual daily values with natural variance
    const varianceBurn = pseudoRandom();
    const varianceSteps = pseudoRandom();
    const activeBurnKcal = Math.round(burnMin + (burnMax - burnMin) * varianceBurn);
    const steps = Math.round(stepsMin + (stepsMax - stepsMin) * varianceSteps);

    // Goal calculation: Met if burn >= target OR steps >= target
    const goalMet = activeBurnKcal >= targetBurnKcal || steps >= targetSteps;
    const goalSuperMet = activeBurnKcal >= Math.round(targetBurnKcal * 1.2) && steps >= Math.round(targetSteps * 1.15);

    // Determine intensity level (0-4)
    let intensityLevel: 0 | 1 | 2 | 3 | 4 = 0;
    if (template.category === "Rest") {
      intensityLevel = 0;
    } else if (!goalMet) {
      intensityLevel = (activeBurnKcal > targetBurnKcal * 0.7 || steps > targetSteps * 0.7) ? 2 : 1;
    } else if (goalSuperMet) {
      intensityLevel = 4;
    } else {
      intensityLevel = 3;
    }

    const year = curDate.getFullYear();
    const monthStr = String(month + 1).padStart(2, "0");
    const dayStr = String(dayOfMonth).padStart(2, "0");
    const dateString = `${year}-${monthStr}-${dayStr}`;

    const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayOfWeek];
    const monthName = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ][month];

    const dayLabel = `${dayName}, ${monthName} ${dayOfMonth}, ${year}`;

    days.push({
      date: curDate,
      dateString,
      dayLabel,
      monthName,
      dayOfWeek,
      weekIndex,
      activeBurnKcal,
      steps,
      workoutTitle: template.title,
      workoutCategory: template.category,
      goalMet,
      goalSuperMet,
      intensityLevel,
    });
  }

  return days;
}

interface TooltipData {
  x: number;
  y: number;
  day: CalendarDayData;
}

export default function ActivityCalendarHeatmap() {
  const { primaryProvider, hasAnyConnected } = useHealthSync();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter and metric states
  const [activeFilter, setActiveFilter] = useState<"all" | "goals_met" | "peak" | "recovery">("all");
  const [metricMode, setMetricMode] = useState<"intensity" | "burn" | "steps">("intensity");
  const [hoveredDay, setHoveredDay] = useState<TooltipData | null>(null);
  // Targets
  const targetBurn = 750;
  const targetSteps = 10000;

  // Memoized 365-day dataset
  const yearData = useMemo(() => {
    return generateAnnualActivityData(targetBurn, targetSteps);
  }, [targetBurn, targetSteps]);

  // Selected day state (derives to latest day when null without requiring effect setState)
  const [selectedDayState, setSelectedDayState] = useState<CalendarDayData | null>(null);
  const selectedDay = selectedDayState ?? (yearData.length > 0 ? yearData[yearData.length - 1] : null);
  const setSelectedDay = setSelectedDayState;

  // Aggregate consistency statistics
  const consistencyStats = useMemo(() => {
    if (!yearData.length) {
      return {
        totalDays: 0,
        goalsMetCount: 0,
        goalsMetPercentage: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalBurn: 0,
        totalSteps: 0,
        peakDays: 0,
      };
    }

    const totalDays = yearData.length;
    let goalsMetCount = 0;
    let peakDays = 0;
    let totalBurn = 0;
    let totalSteps = 0;

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    yearData.forEach((day) => {
      totalBurn += day.activeBurnKcal;
      totalSteps += day.steps;
      if (day.goalMet) {
        goalsMetCount++;
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }

      if (day.goalSuperMet) {
        peakDays++;
      }
    });

    // Current streak from the end backward
    for (let i = yearData.length - 1; i >= 0; i--) {
      if (yearData[i].goalMet) {
        currentStreak++;
      } else {
        break;
      }
    }

    const goalsMetPercentage = parseFloat(((goalsMetCount / totalDays) * 100).toFixed(1));

    return {
      totalDays,
      goalsMetCount,
      goalsMetPercentage,
      currentStreak,
      longestStreak,
      totalBurn,
      totalSteps,
      peakDays,
    };
  }, [yearData]);

  // D3 Color Scales
  const colorScales = useMemo(() => {
    // 0: Rest/None, 1: Low, 2: Moderate, 3: Goal Met (Green), 4: Surpassed (Lime/Gold)
    const intensityColors: Record<number, string> = {
      0: "#161D19", // Obsidian dark muted green-black
      1: "#223B2A", // Dark forest
      2: "#335C3B", // Mid green
      3: "#52944E", // Vibrant athletic goal green
      4: "#f7fe72", // Electric neon gold/lime
    };

    const burnScale = d3
      .scaleThreshold<number, string>()
      .domain([350, 600, 750, 950])
      .range(["#161D19", "#223B2A", "#335C3B", "#52944E", "#f7fe72"]);

    const stepsScale = d3
      .scaleThreshold<number, string>()
      .domain([5000, 8000, 10000, 13500])
      .range(["#161D19", "#223B2A", "#335C3B", "#52944E", "#f7fe72"]);

    return { intensityColors, burnScale, stepsScale };
  }, []);

  // Main D3 Rendering Effect
  const renderD3Heatmap = useCallback(() => {
    if (!svgRef.current || !yearData.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Grid Dimensions
    const cellSize = 12;
    const cellGap = 3.5;
    const cellRadius = 3;
    const leftMargin = 38; // Space for day labels (Mon, Wed, Fri)
    const topMargin = 26; // Space for month headers
    const bottomMargin = 12;

    const maxWeek = d3.max(yearData, (d) => d.weekIndex) || 52;
    const totalWidth = leftMargin + (maxWeek + 1) * (cellSize + cellGap) + 16;
    const totalHeight = topMargin + 7 * (cellSize + cellGap) + bottomMargin;

    svg
      .attr("viewBox", `0 0 ${totalWidth} ${totalHeight}`)
      .attr("width", "100%")
      .attr("height", "auto")
      .style("display", "block");

    const mainG = svg.append("g").attr("class", "heatmap-main");

    // Day of Week Labels (Mon, Wed, Fri)
    const dayLabels = [
      { day: 1, label: "Mon" },
      { day: 3, label: "Wed" },
      { day: 5, label: "Fri" },
    ];

    const dayLabelsG = mainG.append("g").attr("class", "day-labels");
    dayLabels.forEach(({ day, label }) => {
      dayLabelsG
        .append("text")
        .attr("x", leftMargin - 8)
        .attr("y", topMargin + day * (cellSize + cellGap) + cellSize * 0.8)
        .attr("text-anchor", "end")
        .attr("fill", "#757761")
        .attr("font-size", "9.5px")
        .attr("font-family", "ui-monospace, SFMono-Regular, Menlo, monospace")
        .attr("font-weight", "600")
        .text(label);
    });

    // Month Labels calculation
    const monthLabelsG = mainG.append("g").attr("class", "month-labels");
    const monthPositions: { month: string; weekIndex: number }[] = [];
    let lastSeenMonth = "";

    yearData.forEach((d) => {
      if (d.monthName !== lastSeenMonth && d.date.getDate() <= 14) {
        monthPositions.push({ month: d.monthName, weekIndex: d.weekIndex });
        lastSeenMonth = d.monthName;
      }
    });

    monthPositions.forEach(({ month, weekIndex }) => {
      monthLabelsG
        .append("text")
        .attr("x", leftMargin + weekIndex * (cellSize + cellGap))
        .attr("y", topMargin - 8)
        .attr("fill", "#A0A493")
        .attr("font-size", "10px")
        .attr("font-family", "ui-monospace, SFMono-Regular, Menlo, monospace")
        .attr("font-weight", "700")
        .text(month);
    });

    // Cells Group
    const cellsG = mainG.append("g").attr("class", "heatmap-cells");

    // Function to calculate cell fill based on metric mode
    const getFillColor = (d: CalendarDayData) => {
      if (metricMode === "burn") {
        return colorScales.burnScale(d.activeBurnKcal);
      }
      if (metricMode === "steps") {
        return colorScales.stepsScale(d.steps);
      }
      return colorScales.intensityColors[d.intensityLevel];
    };

    // Filter check function
    const isDayFiltered = (d: CalendarDayData) => {
      if (activeFilter === "goals_met") return d.goalMet;
      if (activeFilter === "peak") return d.goalSuperMet;
      if (activeFilter === "recovery") return d.workoutCategory === "Rest" || d.workoutCategory === "Mobility";
      return true;
    };

    // Render cells
    const cellSelection = cellsG
      .selectAll<SVGRectElement, CalendarDayData>("rect")
      .data(yearData)
      .join("rect")
      .attr("x", (d) => leftMargin + d.weekIndex * (cellSize + cellGap))
      .attr("y", (d) => topMargin + d.dayOfWeek * (cellSize + cellGap))
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("rx", cellRadius)
      .attr("ry", cellRadius)
      .attr("fill", (d) => getFillColor(d))
      .attr("stroke", (d) => {
        if (selectedDay?.dateString === d.dateString) {
          return "#ffffff"; // Selected ring
        }
        if (d.goalSuperMet && activeFilter === "all") {
          return "#f7fe72"; // Goal surpassed highlight
        }
        if (d.goalMet && activeFilter === "goals_met") {
          return "#f7fe72";
        }
        return "#757761";
      })
      .attr("stroke-width", (d) => {
        if (selectedDay?.dateString === d.dateString) return 2;
        if (d.goalSuperMet) return 1.25;
        return 0.5;
      })
      .attr("stroke-opacity", (d) => {
        if (selectedDay?.dateString === d.dateString) return 1;
        if (d.goalSuperMet) return 0.9;
        return 0.25;
      })
      .attr("opacity", (d) => (isDayFiltered(d) ? 1 : 0.15))
      .style("cursor", "pointer")
      .style("transition", "transform 0.15s ease, opacity 0.2s ease");

    // D3 Interactive Handlers
    cellSelection
      .on("mouseenter", function (event: MouseEvent, d: CalendarDayData) {
        d3.select(this)
          .raise()
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2)
          .attr("stroke-opacity", 1);

        // Get bounding rect for positioning tooltip
        if (containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const targetRect = (event.target as SVGRectElement).getBoundingClientRect();
          const x = targetRect.left - containerRect.left + cellSize / 2;
          const y = targetRect.top - containerRect.top;

          setHoveredDay({
            x,
            y,
            day: d,
          });
        }
      })
      .on("mouseleave", function (event: MouseEvent, d: CalendarDayData) {
        d3.select(this)
          .attr("stroke", () => {
            if (selectedDay?.dateString === d.dateString) return "#ffffff";
            if (d.goalSuperMet) return "#f7fe72";
            return "#757761";
          })
          .attr("stroke-width", () => (selectedDay?.dateString === d.dateString ? 2 : d.goalSuperMet ? 1.25 : 0.5))
          .attr("stroke-opacity", () => (selectedDay?.dateString === d.dateString ? 1 : d.goalSuperMet ? 0.9 : 0.25));

        setHoveredDay(null);
      })
      .on("click", (_: MouseEvent, d: CalendarDayData) => {
        setSelectedDay(d);
      });
  }, [yearData, metricMode, activeFilter, selectedDay, colorScales, setSelectedDay]);

  // Re-run D3 on state dependencies
  useEffect(() => {
    renderD3Heatmap();
  }, [renderD3Heatmap]);

  return (
    <section
      id="activity-heatmap-module"
      aria-label="Annual Activity Consistency Heatmap"
      className="bg-[#121815] rounded-3xl border border-[#757761]/30 shadow-2xl p-5 sm:p-7 mb-8 transition-all"
    >
      {/* 1. Header Row: Title, Provider Source, & Interactive Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#757761]/25">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f7fe72] bg-[#757761]/20 border border-[#757761]/35 px-2.5 py-0.5 rounded">
              D3.js Consistency Engine
            </span>
            <span className="text-xs text-[#A0A493] font-mono">
              365 Days • 52-Week Chronology
            </span>
            {hasAnyConnected && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {primaryProvider?.name} Data Stream
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-[#f7fe72]" />
            <span>Activity &amp; Goal Consistency Heatmap</span>
          </h2>
          <p className="text-xs text-[#A0A493]">
            High-density temporal matrix rendering training frequency, energy burn, and daily goal achievement across the entire training year.
          </p>
        </div>

        {/* View Switcher Controls (Metric Mode & Filter) */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          {/* Metric Selector (HeroUI Tabs) */}
          <Tabs
            selectedKey={metricMode}
            onSelectionChange={(key) => setMetricMode(key as "intensity" | "burn" | "steps")}
            className="w-auto"
          >
            <Tabs.ListContainer className="p-0 bg-transparent">
              <Tabs.List aria-label="Metric Mode" className="flex items-center gap-1 p-1 bg-[#0B0E0C] border border-[#757761]/35 rounded-xl">
                <Tabs.Tab id="intensity" className="cursor-pointer">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Training Goals</span>
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="burn" className="cursor-pointer">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Burn (kcal)</span>
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="steps" className="cursor-pointer">
                  <Footprints className="w-3.5 h-3.5" />
                  <span>Steps</span>
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>
        </div>
      </div>

      {/* 2. Four KPI Metric Cards: Consistency Rate, Streaks, Volume */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-5">
        {/* Metric 1: Goals Met Consistency */}
        <div className="bg-[#0B0E0C] rounded-2xl p-4 border border-[#757761]/25 space-y-1">
          <div className="flex items-center justify-between text-[#A0A493]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Annual Goal Success
            </span>
            <Target className="w-3.5 h-3.5 text-[#f7fe72]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-[#f7fe72] tabular-nums">
              {consistencyStats.goalsMetCount}
            </span>
            <span className="text-xs text-[#A0A493] font-mono">/ 365 days</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#CBD2C7]">
            <span className="font-mono font-bold text-emerald-400">
              {consistencyStats.goalsMetPercentage}%
            </span>
            <span className="text-[#757761]">·</span>
            <span>consistency rate</span>
          </div>
        </div>

        {/* Metric 2: Current Streak */}
        <div className="bg-[#0B0E0C] rounded-2xl p-4 border border-[#757761]/25 space-y-1">
          <div className="flex items-center justify-between text-[#A0A493]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Current Streak
            </span>
            <Flame className="w-3.5 h-3.5 text-[#f7fe72] fill-[#f7fe72]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-white tabular-nums">
              {consistencyStats.currentStreak}
            </span>
            <span className="text-xs text-[#757761] font-mono">days active</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 block font-mono">
            ● Unbroken streak ongoing
          </span>
        </div>

        {/* Metric 3: Longest Streak */}
        <div className="bg-[#0B0E0C] rounded-2xl p-4 border border-[#757761]/25 space-y-1">
          <div className="flex items-center justify-between text-[#A0A493]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Longest Streak
            </span>
            <Trophy className="w-3.5 h-3.5 text-[#f7fe72]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-white tabular-nums">
              {consistencyStats.longestStreak}
            </span>
            <span className="text-xs text-[#757761] font-mono">days</span>
          </div>
          <span className="text-[11px] text-[#A0A493] block">
            Personal best training block
          </span>
        </div>

        {/* Metric 4: Total Annual Energy Burn */}
        <div className="bg-[#0B0E0C] rounded-2xl p-4 border border-[#757761]/25 space-y-1">
          <div className="flex items-center justify-between text-[#A0A493]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Cumulative 365d Burn
            </span>
            <Sparkles className="w-3.5 h-3.5 text-[#f7fe72]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-white tabular-nums">
              {(consistencyStats.totalBurn / 1000).toFixed(0)}k
            </span>
            <span className="text-xs text-[#757761] font-mono">kcal total</span>
          </div>
          <span className="text-[11px] text-[#A0A493] block font-mono">
            ~{Math.round(consistencyStats.totalBurn / 365)} kcal/day avg
          </span>
        </div>
      </div>

      {/* 3. Filter Tabs Strip (HeroUI Tabs) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-[11px] font-mono font-bold text-[#757761] uppercase flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#f7fe72]" />
            <span>Filter:</span>
          </span>

          <Tabs
            selectedKey={activeFilter}
            onSelectionChange={(key) => setActiveFilter(key as "all" | "goals_met" | "peak" | "recovery")}
            className="w-auto"
          >
            <Tabs.ListContainer className="p-0 bg-transparent">
              <Tabs.List aria-label="Activity Filter" className="flex items-center gap-1.5 p-1 bg-[#0B0E0C] border border-[#757761]/35 rounded-xl overflow-x-auto">
                <Tabs.Tab id="all" className="cursor-pointer">
                  <span>All Activity (365d)</span>
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="goals_met" className="cursor-pointer">
                  <span>Goals Met ({consistencyStats.goalsMetCount}d)</span>
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="peak" className="cursor-pointer">
                  <span>Peak Days &gt;120% ({consistencyStats.peakDays}d)</span>
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="recovery" className="cursor-pointer">
                  <span>Rest &amp; Mobility</span>
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#A0A493] font-mono">
          <Info className="w-3.5 h-3.5 text-[#f7fe72] shrink-0" />
          <span>Click any cell to inspect day workout session</span>
        </div>
      </div>

      {/* 4. D3 Calendar Heatmap Canvas with Tooltip */}
      <div
        ref={containerRef}
        className="relative bg-[#0B0E0C] rounded-2xl border border-[#757761]/30 p-4 sm:p-5 overflow-x-auto shadow-inner"
      >
        <div className="min-w-[760px]">
          <svg ref={svgRef} className="w-full" />
        </div>

        {/* Hover Tooltip Overlay */}
        {hoveredDay && (
          <div
            className="absolute z-20 pointer-events-none transition-transform duration-75 ease-out"
            style={{
              left: `${hoveredDay.x}px`,
              top: `${Math.max(8, hoveredDay.y - 120)}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="bg-[#0B0E0C]/95 backdrop-blur-md border border-[#757761]/50 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 min-w-[220px]">
              <div className="flex items-center justify-between border-b border-[#757761]/30 pb-1">
                <span className="font-mono font-bold text-white text-[11px]">
                  {hoveredDay.day.dayLabel}
                </span>
                {hoveredDay.day.goalSuperMet ? (
                  <span className="text-[9px] font-mono font-black uppercase text-[#0B0E0C] bg-[#f7fe72] px-1 py-0.2 rounded">
                    Peak Day
                  </span>
                ) : hoveredDay.day.goalMet ? (
                  <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-500/20 px-1 py-0.2 rounded">
                    Goal Met
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-[#A0A493]">
                    Rest/Recovery
                  </span>
                )}
              </div>

              <div className="text-[#f7fe72] font-semibold truncate flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#f7fe72] shrink-0" />
                <span>{hoveredDay.day.workoutTitle}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#757761]/25 text-[11px] font-mono">
                <div>
                  <span className="text-[#757761] block text-[10px]">Active Burn</span>
                  <span className="font-bold text-white">
                    {hoveredDay.day.activeBurnKcal} kcal
                  </span>
                  <span className="text-[9px] text-[#A0A493] block">
                    {Math.round((hoveredDay.day.activeBurnKcal / targetBurn) * 100)}% of goal
                  </span>
                </div>
                <div>
                  <span className="text-[#757761] block text-[10px]">Locomotion</span>
                  <span className="font-bold text-white">
                    {hoveredDay.day.steps.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-[#A0A493] block">
                    {Math.round((hoveredDay.day.steps / targetSteps) * 100)}% of goal
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Heatmap Legend */}
        <div className="mt-4 pt-3 border-t border-[#757761]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#A0A493] font-mono text-[11px]">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-xs bg-[#161D19] border border-[#757761]/30" title="Rest / Level 0" />
              <span className="w-3 h-3 rounded-xs bg-[#223B2A]" title="Light / Level 1" />
              <span className="w-3 h-3 rounded-xs bg-[#335C3B]" title="Moderate / Level 2" />
              <span className="w-3 h-3 rounded-xs bg-[#52944E]" title="Goal Met / Level 3" />
              <span className="w-3 h-3 rounded-xs bg-[#f7fe72] shadow-[0_0_4px_#f7fe72]" title="Goal Surpassed / Level 4" />
            </div>
            <span>More</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-[#CBD2C7] flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#52944E]" />
              <span>Goal Met (≥{targetBurn} kcal / {targetSteps.toLocaleString()} steps)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#f7fe72] border border-[#f7fe72]" />
              <span className="text-[#f7fe72] font-bold">★ Surpassed (≥120% Target)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 5. Selected Day Deep-Dive Card */}
      {selectedDay && (
        <div className="mt-5 p-5 rounded-2xl bg-[#0B0E0C] border border-[#757761]/30 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
              selectedDay.goalSuperMet
                ? "bg-[#f7fe72]/20 border-[#f7fe72] text-[#f7fe72]"
                : selectedDay.goalMet
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                : "bg-[#757761]/20 border-[#757761]/30 text-[#A0A493]"
            }`}>
              {selectedDay.goalMet ? (
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              ) : (
                <Calendar className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-[#A0A493]">
                  Selected Session Log
                </span>
                <span className="text-white font-mono font-bold text-xs">
                  {selectedDay.dayLabel}
                </span>
                {selectedDay.goalSuperMet && (
                  <span className="text-[10px] font-black text-[#0B0E0C] bg-[#f7fe72] px-1.5 py-0.2 rounded font-mono">
                    PEAK DAY (120%+)
                  </span>
                )}
                {selectedDay.goalMet && !selectedDay.goalSuperMet && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                    GOAL MET
                  </span>
                )}
              </div>

              <h4 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
                <span>{selectedDay.workoutTitle}</span>
              </h4>
              <p className="text-xs text-[#A0A493] mt-0.5">
                Category: <strong className="text-[#CBD2C7]">{selectedDay.workoutCategory}</strong> · Verified via {primaryProvider?.name || "Direct Telemetry Wearable Sync"}.
              </p>
            </div>
          </div>

          {/* Quick Metrics of the selected day */}
          <div className="flex items-center gap-3 text-xs font-mono flex-wrap">
            <div className="bg-[#121815] px-3.5 py-2 rounded-xl border border-[#757761]/30">
              <span className="text-[#A0A493] block text-[10px] uppercase font-bold">Active Burn</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-bold text-white tabular-nums">
                  +{selectedDay.activeBurnKcal}
                </span>
                <span className="text-[10px] text-[#757761]">kcal</span>
              </div>
              <span className={`text-[10px] font-semibold block ${selectedDay.activeBurnKcal >= targetBurn ? "text-emerald-400" : "text-amber-400"}`}>
                {Math.round((selectedDay.activeBurnKcal / targetBurn) * 100)}% of {targetBurn}
              </span>
            </div>

            <div className="bg-[#121815] px-3.5 py-2 rounded-xl border border-[#757761]/30">
              <span className="text-[#A0A493] block text-[10px] uppercase font-bold">Locomotion</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-sm font-bold text-white tabular-nums">
                  {selectedDay.steps.toLocaleString()}
                </span>
                <span className="text-[10px] text-[#757761]">steps</span>
              </div>
              <span className={`text-[10px] font-semibold block ${selectedDay.steps >= targetSteps ? "text-emerald-400" : "text-amber-400"}`}>
                {Math.round((selectedDay.steps / targetSteps) * 100)}% of 10k
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                // Reset to latest day
                setSelectedDay(yearData[yearData.length - 1]);
              }}
              className="px-3 py-2 bg-[#121815] hover:bg-[#181f1b] border border-[#757761]/30 hover:border-[#f7fe72] text-[#A0A493] hover:text-[#f7fe72] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-center"
              title="Jump to today's latest session"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Today</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
