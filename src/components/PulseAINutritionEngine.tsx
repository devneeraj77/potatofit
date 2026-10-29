"use client";

import React, { useState, useRef } from "react";
import { Tabs } from "@heroui/react";
import Image from "next/image";
import {
  MapPin,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  Store,
  Tag,
  X,
  Info,
  Check,
  CircleDollarSign,
  Share2
} from "lucide-react";

// Canvas particle confetti burst utility
function runConfettiBurst(canvas: HTMLCanvasElement | null) {
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

  const colors = ["#f7fe72", "#f4e76e", "#757761", "#ffffff", "#d4c448"];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight * 0.45;

  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 8;
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      size: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
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
      p.vy += 0.22; // gravity
      p.vx *= 0.985; // air resistance
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

export interface IngredientAlternative {
  name: string;
  portion: string;
  vendorName: string;
  distance: string;
  priceDelta: string;
  priceDiffNumber: number;
  macroImpact: string;
  proteinDelta: number;
  carbsDelta: number;
  fatsDelta: number;
  caloriesDelta: number;
  inStock: boolean;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  portion: string;
  substituteNote: string;
  vendor: string;
  baseCost: number;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  alternatives: IngredientAlternative[];
  activeSwapIndex?: number; // if user applied an alternative
}

export interface GeneratedMeal {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  prepTimeMinutes: number;
  baseCost: number;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  regionalHighlight: string;
  ingredients: RecipeIngredient[];
}

const DEFAULT_MEALS: GeneratedMeal[] = [
  {
    id: "sattu-spiced-bowl",
    title: "Sattu Spiced Protein Bowl",
    subtitle: "High-protein roasted gram & rustic paneer tossed with mustard greens",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80",
    prepTimeMinutes: 18,
    baseCost: 85,
    protein: 38,
    carbs: 45,
    fats: 12,
    calories: 440,
    regionalHighlight: "Delhi Mandi Winter Greens & Local Kirana Roast",
    ingredients: [
      {
        id: "ing-1",
        name: "200g Paneer",
        portion: "200g fresh cubes",
        substituteNote: "Sub: Low-fat Tofu at Market A",
        vendor: "Aggarwal Dairy, Central Market (0.4km)",
        baseCost: 48,
        protein: 26,
        carbs: 4,
        fats: 10,
        calories: 210,
        alternatives: [
          {
            name: "Low-fat Tofu (Market A)",
            portion: "220g pressed block",
            vendorName: "Market A Natural Grocers",
            distance: "0.4km away",
            priceDelta: "-₹18 cheaper",
            priceDiffNumber: -18,
            macroImpact: "+2g Protein, -6g Fat",
            proteinDelta: 2,
            carbsDelta: -1,
            fatsDelta: -6,
            caloriesDelta: -50,
            inStock: true,
          },
          {
            name: "Farm Fresh Soya Chaap",
            portion: "200g boiled strips",
            vendorName: "Veer Soya Mart, Pushpa Market",
            distance: "0.8km away",
            priceDelta: "-₹22 cheaper",
            priceDiffNumber: -22,
            macroImpact: "+4g Protein, -7g Fat",
            proteinDelta: 4,
            carbsDelta: 2,
            fatsDelta: -7,
            caloriesDelta: -40,
            inStock: true,
          },
          {
            name: "Artisanal A2 Cow Paneer",
            portion: "200g hand-churned",
            vendorName: "Organic Dairy Hub, Block D",
            distance: "1.2km away",
            priceDelta: "+₹25 premium",
            priceDiffNumber: 25,
            macroImpact: "Identical Macros, Zero preservative",
            proteinDelta: 0,
            carbsDelta: 0,
            fatsDelta: 1,
            caloriesDelta: 10,
            inStock: true,
          },
        ],
      },
      {
        id: "ing-2",
        name: "50g Sattu / Roasted Gram Powder",
        portion: "50g stone-ground",
        substituteNote: "Found at local grain merchants",
        vendor: "Lajpat Central Grain Merchants (0.3km)",
        baseCost: 15,
        protein: 10,
        carbs: 26,
        fats: 1,
        calories: 153,
        alternatives: [
          {
            name: "Roasted Chana Dal Powder",
            portion: "50g roasted & ground",
            vendorName: "Gupta Kirana Store",
            distance: "0.2km away",
            priceDelta: "-₹4 cheaper",
            priceDiffNumber: -4,
            macroImpact: "-1g Protein, +1g Carbs",
            proteinDelta: -1,
            carbsDelta: 1,
            fatsDelta: 0,
            caloriesDelta: 0,
            inStock: true,
          },
          {
            name: "Dry Roasted Soybean Flour",
            portion: "45g defatted flour",
            vendorName: "Health Nut Supermarket",
            distance: "1.5km away",
            priceDelta: "+₹6",
            priceDiffNumber: 6,
            macroImpact: "+6g Protein, -8g Carbs",
            proteinDelta: 6,
            carbsDelta: -8,
            fatsDelta: 0,
            caloriesDelta: -10,
            inStock: true,
          },
          {
            name: "Sprouted Moong Flour",
            portion: "50g cold-milled",
            vendorName: "Vedic Food Bazaar",
            distance: "1.8km away",
            priceDelta: "+₹12",
            priceDiffNumber: 12,
            macroImpact: "+3g Fiber, Clean Gut",
            proteinDelta: 2,
            carbsDelta: 0,
            fatsDelta: 0,
            caloriesDelta: 5,
            inStock: true,
          },
        ],
      },
      {
        id: "ing-3",
        name: "Seasonal Greens: Mustard leaves / Spinach",
        portion: "120g washed & shredded",
        substituteNote: "In season this week",
        vendor: "Subzi Mandi Stall #12, Lajpat Nagar",
        baseCost: 12,
        protein: 2,
        carbs: 5,
        fats: 0,
        calories: 28,
        alternatives: [
          {
            name: "Local Methi (Fenugreek) Leaves",
            portion: "100g freshly harvested",
            vendorName: "Weekly Sabzi Haat",
            distance: "0.5km away",
            priceDelta: "-₹3 cheaper",
            priceDiffNumber: -3,
            macroImpact: "Identical, High Chromium",
            proteinDelta: 1,
            carbsDelta: -1,
            fatsDelta: 0,
            caloriesDelta: 0,
            inStock: true,
          },
          {
            name: "Baby Spinach & Amaranth Mix",
            portion: "120g pre-washed",
            vendorName: "Nature's Basket Store",
            distance: "1.1km away",
            priceDelta: "+₹15",
            priceDiffNumber: 15,
            macroImpact: "+1.5g Protein, +Iron boost",
            proteinDelta: 1.5,
            carbsDelta: 0,
            fatsDelta: 0,
            caloriesDelta: 5,
            inStock: true,
          },
          {
            name: "Hydroponic Crisp Lettuce & Kale",
            portion: "100g local greenhouse",
            vendorName: "Green Earth Farm Kiosk",
            distance: "1.9km away",
            priceDelta: "+₹28",
            priceDiffNumber: 28,
            macroImpact: "Ultra fresh crisp texture",
            proteinDelta: 0.5,
            carbsDelta: -1,
            fatsDelta: 0,
            caloriesDelta: -5,
            inStock: true,
          },
        ],
      },
      {
        id: "ing-4",
        name: "15g Cold-Pressed Mustard Oil & Spices",
        portion: "1 tbsp pure Kachi Ghani",
        substituteNote: "Spices: Roasted Cumin & Black Salt",
        vendor: "Sharma Oil Depot & Kirana",
        baseCost: 10,
        protein: 0,
        carbs: 10,
        fats: 1,
        calories: 49,
        alternatives: [
          {
            name: "Virgin Olive Oil (10ml)",
            portion: "10ml extra virgin",
            vendorName: "Modern Bazaar, M-Block",
            distance: "1.6km away",
            priceDelta: "+₹14",
            priceDiffNumber: 14,
            macroImpact: "Higher Monounsaturated fats",
            proteinDelta: 0,
            carbsDelta: 0,
            fatsDelta: 0,
            caloriesDelta: 0,
            inStock: true,
          },
          {
            name: "Country Cow Ghee (8g)",
            portion: "1 tsp A2 Bilona Ghee",
            vendorName: "Dairy Emporium Lajpat",
            distance: "0.6km away",
            priceDelta: "+₹8",
            priceDiffNumber: 8,
            macroImpact: "Rich aroma, quick energy",
            proteinDelta: 0,
            carbsDelta: 0,
            fatsDelta: 1,
            caloriesDelta: 15,
            inStock: true,
          },
          {
            name: "Zero-Oil Lemon Herb Dressing",
            portion: "30ml fresh citrus vinaigrette",
            vendorName: "Home Prep Kit",
            distance: "0.1km away",
            priceDelta: "-₹6 cheaper",
            priceDiffNumber: -6,
            macroImpact: "-1g Fat, -25 kcal",
            proteinDelta: 0,
            carbsDelta: 1,
            fatsDelta: -1,
            caloriesDelta: -25,
            inStock: true,
          },
        ],
      },
    ],
  },
  {
    id: "lentil-tofu-medley",
    title: "Regional Spiced Lentil & Tofu Medley",
    subtitle: "Crispy tawa-seared tofu over spiced sprouted green moong with mint chutney",
    imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80",
    prepTimeMinutes: 16,
    baseCost: 78,
    protein: 35,
    carbs: 48,
    fats: 11,
    calories: 425,
    regionalHighlight: "Lajpat Vegetable Market & Organic Pulses Depot",
    ingredients: [
      {
        id: "ing-med-1",
        name: "200g Sprouted Green Moong",
        portion: "200g live sprouts",
        substituteNote: "High bioavailability & low GI",
        vendor: "Organic Pulse Depot, Lane 2",
        baseCost: 28,
        protein: 16,
        carbs: 38,
        fats: 2,
        calories: 234,
        alternatives: [
          {
            name: "Black Chana (Sprouted Bengal Gram)",
            portion: "200g sprouted chana",
            vendorName: "Bhatia Kirana, Main Road",
            distance: "0.3km away",
            priceDelta: "-₹6 cheaper",
            priceDiffNumber: -6,
            macroImpact: "+2g Protein, +4g Fiber",
            proteinDelta: 2,
            carbsDelta: 2,
            fatsDelta: 0,
            caloriesDelta: 16,
            inStock: true,
          },
          {
            name: "Sprouted Horsegram (Kulthi)",
            portion: "180g boiled sprouts",
            vendorName: "Ayur Grain Stand",
            distance: "1.4km away",
            priceDelta: "-₹2",
            priceDiffNumber: -2,
            macroImpact: "+4g Protein, Fat shred booster",
            proteinDelta: 4,
            carbsDelta: -1,
            fatsDelta: 0,
            caloriesDelta: 10,
            inStock: true,
          },
          {
            name: "Edamame Beans (Shelled)",
            portion: "150g steamed pods",
            vendorName: "Modern Bazaar Lajpat",
            distance: "1.6km away",
            priceDelta: "+₹35",
            priceDiffNumber: 35,
            macroImpact: "+6g Protein, -8g Carbs",
            proteinDelta: 6,
            carbsDelta: -8,
            fatsDelta: 2,
            caloriesDelta: 15,
            inStock: true,
          },
        ],
      },
      {
        id: "ing-med-2",
        name: "180g Organic Soya Tofu Cubes",
        portion: "180g spiced firm cubes",
        substituteNote: "Sub: Low-fat Paneer",
        vendor: "Soya Healthy Point, Central Market",
        baseCost: 32,
        protein: 17,
        carbs: 4,
        fats: 7,
        calories: 147,
        alternatives: [
          {
            name: "Low-fat Malai Paneer",
            portion: "160g light paneer",
            vendorName: "Aggarwal Sweets & Dairy",
            distance: "0.4km away",
            priceDelta: "+₹14",
            priceDiffNumber: 14,
            macroImpact: "+3g Protein, +3g Fat",
            proteinDelta: 3,
            carbsDelta: 0,
            fatsDelta: 3,
            caloriesDelta: 35,
            inStock: true,
          },
          {
            name: "Tempeh Cubes (Cultured Soya)",
            portion: "150g steamed & sliced",
            vendorName: "Artisan Vegan Shelf",
            distance: "2.0km away",
            priceDelta: "+₹22",
            priceDiffNumber: 22,
            macroImpact: "+5g Protein, Prebiotic fiber",
            proteinDelta: 5,
            carbsDelta: 1,
            fatsDelta: 1,
            caloriesDelta: 25,
            inStock: true,
          },
          {
            name: "Boiled White Chickpeas",
            portion: "200g boiled Kabuli chana",
            vendorName: "Central Mandi Stall 6",
            distance: "0.5km away",
            priceDelta: "-₹14 cheaper",
            priceDiffNumber: -14,
            macroImpact: "-4g Protein, +14g Carbs",
            proteinDelta: -4,
            carbsDelta: 14,
            fatsDelta: -4,
            caloriesDelta: 20,
            inStock: true,
          },
        ],
      },
      {
        id: "ing-med-3",
        name: "Fresh Mint, Coriander & Pomegranate Relish",
        portion: "60g house-made dressing",
        substituteNote: "Picked fresh this morning",
        vendor: "Farmer Subzi Thela, Lane 3",
        baseCost: 18,
        protein: 2,
        carbs: 6,
        fats: 2,
        calories: 44,
        alternatives: [
          {
            name: "Green Chili Lime Mint Paste",
            portion: "50g spicy tangy chutney",
            vendorName: "Radha Kirana & Spices",
            distance: "0.2km away",
            priceDelta: "-₹6 cheaper",
            priceDiffNumber: -6,
            macroImpact: "Zero sugar, metabolism jump",
            proteinDelta: 0,
            carbsDelta: -2,
            fatsDelta: 0,
            caloriesDelta: -10,
            inStock: true,
          },
          {
            name: "Cold-Pressed Flaxseed Oil Dressing",
            portion: "15ml omega-3 rich oil",
            vendorName: "Bio Herbs Delhi",
            distance: "1.2km away",
            priceDelta: "+₹12",
            priceDiffNumber: 12,
            macroImpact: "+4g Healthy Omega Fats",
            proteinDelta: 0,
            carbsDelta: 0,
            fatsDelta: 4,
            caloriesDelta: 36,
            inStock: true,
          },
          {
            name: "Roasted Peanut Tamarind Dip",
            portion: "45g crushed peanut relish",
            vendorName: "Chaat Masala Corner",
            distance: "0.7km away",
            priceDelta: "-₹2",
            priceDiffNumber: -2,
            macroImpact: "+3g Protein, +3g Fat",
            proteinDelta: 3,
            carbsDelta: 2,
            fatsDelta: 3,
            caloriesDelta: 45,
            inStock: true,
          },
        ],
      },
    ],
  },
];

const LOCATIONS = [
  "South Delhi / Lajpat Nagar",
  "Hauz Khas & Green Park",
  "Defence Colony Market",
  "Karol Bagh & Central Delhi",
  "Greater Kailash 1 (M-Block)",
];

const RADII = ["1km", "2km", "3km", "5km", "10km"];

const SOURCING_OPTIONS = [
  "Local Kirana & Street Vendors",
  "Supermarkets",
  "Organic Farm Direct",
] as const;

export default function PulseAINutritionEngine() {
  // Sourcing & Geo state
  const [currentLocation, setCurrentLocation] = useState("South Delhi / Lajpat Nagar");
  const [selectedRadius, setSelectedRadius] = useState("2km");
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isRadiusMenuOpen, setIsRadiusMenuOpen] = useState(false);
  const [sourcingMode, setSourcingMode] = useState<typeof SOURCING_OPTIONS[number]>("Local Kirana & Street Vendors");

  // Filters
  const [filterHighProtein, setFilterHighProtein] = useState(true);
  const [filterVegetarian, setFilterVegetarian] = useState(true);
  const [filterBudget, setFilterBudget] = useState(true);
  const [filterPrepTime, setFilterPrepTime] = useState(true);

  // Active meal state
  const [currentMealIndex, setCurrentMealIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMeals, setGeneratedMeals] = useState<GeneratedMeal[]>(DEFAULT_MEALS);

  // Smart Swap Modal state
  const [activeSwapIngredient, setActiveSwapIngredient] = useState<RecipeIngredient | null>(null);

  // Log meal feedback & XP state
  const [loggedXP, setLoggedXP] = useState(1450);
  const [showLogSuccess, setShowLogSuccess] = useState(false);
  const [mealsLoggedToday, setMealsLoggedToday] = useState(2);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeMeal = generatedMeals[currentMealIndex];

  // Calculate dynamic totals based on active swaps
  const dynamicProtein = activeMeal.ingredients.reduce((acc, ing) => {
    if (ing.activeSwapIndex !== undefined && ing.alternatives[ing.activeSwapIndex]) {
      return acc + ing.protein + ing.alternatives[ing.activeSwapIndex].proteinDelta;
    }
    return acc + ing.protein;
  }, 0);

  const dynamicCarbs = activeMeal.ingredients.reduce((acc, ing) => {
    if (ing.activeSwapIndex !== undefined && ing.alternatives[ing.activeSwapIndex]) {
      return acc + ing.carbs + ing.alternatives[ing.activeSwapIndex].carbsDelta;
    }
    return acc + ing.carbs;
  }, 0);

  const dynamicFats = activeMeal.ingredients.reduce((acc, ing) => {
    if (ing.activeSwapIndex !== undefined && ing.alternatives[ing.activeSwapIndex]) {
      return acc + ing.fats + ing.alternatives[ing.activeSwapIndex].fatsDelta;
    }
    return acc + ing.fats;
  }, 0);

  const dynamicCost = activeMeal.ingredients.reduce((acc, ing) => {
    if (ing.activeSwapIndex !== undefined && ing.alternatives[ing.activeSwapIndex]) {
      return acc + ing.baseCost + ing.alternatives[ing.activeSwapIndex].priceDiffNumber;
    }
    return acc + ing.baseCost;
  }, 0);

  const dynamicCalories = Math.round(dynamicProtein * 4 + dynamicCarbs * 4 + dynamicFats * 9);

  // Handle Generate Optimal Meal with animated scanning
  const handleGenerateMeal = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Toggle between available local meal plans or reset swaps
      setCurrentMealIndex((prev) => (prev + 1) % generatedMeals.length);
      setIsGenerating(false);
    }, 700);
  };

  // Handle applying a smart swap
  const handleApplySwap = (ingredientId: string, swapIndex: number | null) => {
    setGeneratedMeals((prev) => {
      return prev.map((meal, mIdx) => {
        if (mIdx !== currentMealIndex) return meal;
        const updatedIngredients = meal.ingredients.map((ing) => {
          if (ing.id !== ingredientId) return ing;
          return {
            ...ing,
            activeSwapIndex: swapIndex === null ? undefined : swapIndex,
          };
        });
        return {
          ...meal,
          ingredients: updatedIngredients,
        };
      });
    });
    setActiveSwapIngredient(null);
  };

  // Handle Logging meal with confetti
  const handleLogMeal = () => {
    setLoggedXP((prev) => prev + 50);
    setMealsLoggedToday((prev) => prev + 1);
    setShowLogSuccess(true);
    runConfettiBurst(canvasRef.current);

    setTimeout(() => {
      setShowLogSuccess(false);
    }, 4500);
  };

  // Circular Macro Ring calculations
  // Total target reference 600 kcal max or relative distribution
  const proteinCalories = dynamicProtein * 4;
  const carbsCalories = dynamicCarbs * 4;
  const fatsCalories = dynamicFats * 9;
  const computedTotal = proteinCalories + carbsCalories + fatsCalories || 1;

  const proteinPct = Math.round((proteinCalories / computedTotal) * 100);
  const carbsPct = Math.round((carbsCalories / computedTotal) * 100);
  const fatsPct = Math.round((fatsCalories / computedTotal) * 100);

  // SVG ring stroke dash math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const proteinStroke = (proteinPct / 100) * circumference;
  const carbsStroke = (carbsPct / 100) * circumference;
  const fatsStroke = (fatsPct / 100) * circumference;

  return (
    <section
      id="nutrition"
      className="relative w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#F4F6F5] dark:bg-[#0B0E0C] text-[#121815] dark:text-[#E2E7DE] overflow-hidden font-sans border-b border-[#757761]/25 scroll-mt-20 sm:scroll-mt-24 transition-colors"
    >
      {/* Hidden Fullscreen Canvas for celebratory confetti bursts */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50 w-full h-full"
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Brand & Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#757761]/15 border border-[#757761]/30 text-[#505445] dark:text-[#f7fe72] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#505445] dark:text-[#f7fe72] animate-pulse" />
              <span>PulseAI &bull; Hyper-Local Nutrition Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#121815] dark:text-white font-sans">
              AI Hyper-Local Chef &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#121815] via-[#505445] to-[#7A5A00] dark:from-[#FFFFFF] dark:via-[#f4e76e] dark:to-[#f7fe72]">Mandi Radar</span>
            </h2>
            <p className="text-[#505445] dark:text-[#A0A493] text-sm sm:text-base max-w-2xl leading-relaxed">
              Dynamically maps seasonal Indian produce, local Delhi Kirana merchants, and live protein macro economics to your daily fitness goal.
            </p>
          </div>

          {/* User Gamification & Daily XP Status */}
          <div className="flex items-center gap-3 bg-[#121815] px-4 py-2.5 rounded-2xl border border-[#757761]/30 shadow-xs self-start md:self-auto">
            <div className="w-10 h-10 rounded-xl bg-[#757761]/20 text-[#f7fe72] flex items-center justify-center font-bold text-xs shadow-inner border border-[#757761]/40">
              <Award className="w-5 h-5 text-[#f7fe72]" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#A0A493] uppercase tracking-wider">
                Athlete XP &bull; Today ({mealsLoggedToday} Logged)
              </div>
              <div className="text-base font-extrabold text-white flex items-center gap-1.5">
                <span>{loggedXP} XP</span>
                <span className="text-[10px] font-bold text-[#f7fe72] bg-[#757761]/20 px-1.5 py-0.5 rounded border border-[#757761]/30 font-mono">
                  Level 4 Mover
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            1. TOP GEOGRAPHIC & SOURCING BAR
            ========================================================================= */}
        <div className="bg-[#121815] rounded-3xl p-4 sm:p-5 border border-[#757761]/30 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Dynamic Location Detection Badge + Radius Dropdown */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Location Badge & Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsLocationMenuOpen(!isLocationMenuOpen);
                    setIsRadiusMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B0E0C] hover:bg-[#161c18] border border-[#757761]/35 text-[#E2E7DE] text-xs sm:text-sm font-semibold transition-all cursor-pointer group shadow-2xs"
                  title="Click to change detected neighborhood"
                >
                  <MapPin className="w-4 h-4 text-[#f7fe72] group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-[#f7fe72]">Current Location:</span>
                  <span className="text-white font-medium">{currentLocation}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#f7fe72] transition-transform ${isLocationMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isLocationMenuOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-[#121815] rounded-2xl shadow-2xl border border-[#757761]/40 z-30 py-2 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#A0A493] border-b border-[#757761]/25">
                      Select Delhi Micro-Hub
                    </div>
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setCurrentLocation(loc);
                          setIsLocationMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-[#757761]/20 transition-colors ${
                          currentLocation === loc ? "text-[#f7fe72] font-bold bg-[#757761]/30" : "text-[#CBD2C7]"
                        }`}
                      >
                        <span>{loc}</span>
                        {currentLocation === loc && <Check className="w-3.5 h-3.5 text-[#f7fe72]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Change Radius Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsRadiusMenuOpen(!isRadiusMenuOpen);
                    setIsLocationMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B0E0C] hover:bg-[#161c18] border border-[#757761]/35 text-[#E2E7DE] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                  title="Filter vendor search radius"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#A0A493]" />
                  <span>Radius: <strong className="text-white">{selectedRadius}</strong></span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#A0A493] transition-transform ${isRadiusMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {isRadiusMenuOpen && (
                  <div className="absolute left-0 mt-2 w-44 bg-[#121815] rounded-2xl shadow-2xl border border-[#757761]/40 z-30 py-2 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#A0A493] border-b border-[#757761]/25">
                      Search Perimeter
                    </div>
                    {RADII.map((rad) => (
                      <button
                        key={rad}
                        onClick={() => {
                          setSelectedRadius(rad);
                          setIsRadiusMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between hover:bg-[#757761]/20 transition-colors ${
                          selectedRadius === rad ? "text-[#f7fe72] font-bold bg-[#757761]/30" : "text-[#CBD2C7]"
                        }`}
                      >
                        <span>Within {rad}</span>
                        {selectedRadius === rad && <Check className="w-3.5 h-3.5 text-[#f7fe72]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sourcing Tabs (HeroUI Tabs) */}
            <Tabs
              selectedKey={sourcingMode}
              onSelectionChange={(key) => setSourcingMode(key as typeof SOURCING_OPTIONS[number])}
              className="w-auto self-stretch sm:self-auto"
            >
              <Tabs.ListContainer className="p-0 bg-transparent">
                <Tabs.List aria-label="Sourcing mode" className="flex items-center bg-[#0B0E0C] p-1 rounded-2xl border border-[#757761]/25 overflow-x-auto">
                  {SOURCING_OPTIONS.map((mode) => (
                    <Tabs.Tab
                      key={mode}
                      id={mode}
                      className="cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap"
                    >
                      <span>{mode}</span>
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  ))}
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </div>

          {/* Dietary & Budget Filter Pills */}
          <div className="pt-2 border-t border-[#757761]/25 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#A0A493] mr-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#f7fe72]" />
              Active Filters:
            </span>

            {/* Pill 1: High Protein */}
            <button
              onClick={() => setFilterHighProtein(!filterHighProtein)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer flex items-center gap-1.5 ${
                filterHighProtein
                  ? "bg-[#757761]/30 text-[#f7fe72] border-[#f7fe72] font-bold"
                  : "bg-[#0B0E0C] text-[#A0A493] border-[#757761]/35 hover:text-white"
              }`}
            >
              {filterHighProtein && <Check className="w-3 h-3 text-[#f7fe72]" />}
              <span>High Protein</span>
            </button>

            {/* Pill 2: Vegetarian / Paneer Base */}
            <button
              onClick={() => setFilterVegetarian(!filterVegetarian)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer flex items-center gap-1.5 ${
                filterVegetarian
                  ? "bg-[#757761]/30 text-[#f7fe72] border-[#f7fe72] font-bold"
                  : "bg-[#0B0E0C] text-[#A0A493] border-[#757761]/35 hover:text-white"
              }`}
            >
              {filterVegetarian && <Check className="w-3 h-3 text-[#f7fe72]" />}
              <span>Vegetarian / Paneer Base</span>
            </button>

            {/* Pill 3: Budget Under 150 */}
            <button
              onClick={() => setFilterBudget(!filterBudget)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer flex items-center gap-1.5 ${
                filterBudget
                  ? "bg-[#757761]/30 text-[#f7fe72] border-[#f7fe72] font-bold"
                  : "bg-[#0B0E0C] text-[#A0A493] border-[#757761]/35 hover:text-white"
              }`}
            >
              {filterBudget && <Check className="w-3 h-3 text-[#f7fe72]" />}
              <span>Budget: Under ₹150/meal</span>
            </button>

            {/* Pill 4: Prep Time < 20m */}
            <button
              onClick={() => setFilterPrepTime(!filterPrepTime)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer flex items-center gap-1.5 ${
                filterPrepTime
                  ? "bg-[#757761]/30 text-[#f7fe72] border-[#f7fe72] font-bold"
                  : "bg-[#0B0E0C] text-[#A0A493] border-[#757761]/35 hover:text-white"
              }`}
            >
              {filterPrepTime && <Check className="w-3 h-3 text-[#f7fe72]" />}
              <span>Prep Time &lt; 20m</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            2. AI DYNAMIC MEAL GENERATOR CARD
            ========================================================================= */}
        <div className="bg-[#121815] rounded-3xl border border-[#757761]/30 shadow-xl overflow-hidden">
          {/* Card Header Bar */}
          <div className="px-5 sm:px-7 py-4.5 bg-[#0B0E0C] border-b border-[#757761]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-[#757761]/20 text-[#f7fe72] flex items-center justify-center shadow-xs border border-[#757761]/40">
                  <Sparkles className="w-5 h-5 text-[#f7fe72]" />
                </div>
                {/* Pulsing sparkle badge */}
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f7fe72] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#f7fe72] border-2 border-[#0B0E0C]"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight font-sans">
                    AI Hyper-Local Chef
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#757761]/20 text-[#f7fe72] border border-[#757761]/30">
                    Live Engine
                  </span>
                </div>
                <p className="text-xs text-[#A0A493] font-medium">
                  {sourcingMode} &bull; Sourced within {selectedRadius} of {currentLocation.split("/")[0]}
                </p>
              </div>
            </div>

            {/* Action button: Generate Optimal Meal from Local Markets */}
            <button
              onClick={handleGenerateMeal}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] text-xs sm:text-sm font-black tracking-wide transition-all shadow-md hover:brightness-110 cursor-pointer disabled:opacity-75 disabled:pointer-events-none active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 text-[#0B0E0C] ${isGenerating ? "animate-spin" : ""}`} />
              <span>{isGenerating ? "Synthesizing Local Mandi Data..." : "Generate Optimal Meal from Local Markets"}</span>
            </button>
          </div>

          {/* Success Banner when Meal is Logged */}
          {showLogSuccess && (
            <div className="bg-[#18201A] border-b border-[#f7fe72]/40 text-white px-6 py-3 flex items-center justify-between text-xs sm:text-sm font-bold animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#f7fe72] shrink-0" />
                <span>Meal successfully logged to your Athlete Dashboard! Earned +50 XP and hit daily protein target milestone!</span>
              </div>
              <button
                onClick={() => setShowLogSuccess(false)}
                className="text-white hover:text-[#f7fe72] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Split 2-Column Recipe Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#757761]/25">
            {/* =========================================================================
                LEFT COLUMN: VISUAL & MACROS
                ========================================================================= */}
            <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between space-y-6 bg-[#121815]">
              {/* Image & Quick Attributes */}
              <div className="space-y-4">
                <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden shadow-xs border border-[#757761]/30 group">
                  <Image
                    src={activeMeal.imageUrl}
                    alt={activeMeal.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-[#121815]/90 backdrop-blur-md text-[#f7fe72] text-[11px] font-bold border border-[#757761]/40 shadow-xs flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#f7fe72] fill-[#f7fe72]" />
                      <span>{dynamicCalories} kcal</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#121815]/90 backdrop-blur-md text-[#E2E7DE] text-[11px] font-bold border border-[#757761]/40 shadow-xs flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#A0A493]" />
                      <span>{activeMeal.prepTimeMinutes}m prep</span>
                    </span>
                  </div>

                  {/* Bottom title preview */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#f7fe72]">
                      Regional Hyper-Local Recipe
                    </div>
                    <div className="text-base sm:text-lg font-bold leading-tight drop-shadow-xs">
                      {activeMeal.title}
                    </div>
                  </div>
                </div>

                {/* Cost-to-Cook Pill */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0E0C] border border-[#757761]/30 text-[#E2E7DE] shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#757761]/20 text-[#f7fe72] border border-[#757761]/30 flex items-center justify-center font-bold">
                      <CircleDollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-[#A0A493] uppercase tracking-wider">
                        Real Mandi Index
                      </div>
                      <div className="text-xs font-bold text-white">
                        Includes live spice &amp; vendor pricing
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] text-xs sm:text-sm font-black tracking-wide shadow-xs">
                      Estimated Local Cost: ₹{dynamicCost}
                    </div>
                  </div>
                </div>
              </div>

              {/* Circular Macro Ring Breakdown */}
              <div className="p-4 rounded-2xl bg-[#0B0E0C] border border-[#757761]/25 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#CBD2C7]">
                  <span className="uppercase tracking-wider">Circular Macro Ring Breakdown</span>
                  <span className="text-[11px] text-[#f7fe72] font-extrabold bg-[#757761]/20 border border-[#757761]/30 px-2 py-0.5 rounded">
                    Goal Match: 98%
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                  {/* SVG Multi-Segment Circular Ring */}
                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                      {/* Background track */}
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        className="stroke-[#757761]/25"
                        strokeWidth="10"
                        fill="transparent"
                      />
                      {/* Protein Segment: Electric Cyber Lime (#f7fe72) */}
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        className="stroke-[#f7fe72] transition-all duration-700 ease-out"
                        strokeWidth="10"
                        strokeDasharray={`${proteinStroke} ${circumference}`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        fill="transparent"
                      />
                      {/* Carbs Segment: Smoked Olive Sage (#757761) */}
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        className="stroke-[#757761] transition-all duration-700 ease-out"
                        strokeWidth="10"
                        strokeDasharray={`${carbsStroke} ${circumference}`}
                        strokeDashoffset={-proteinStroke}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                      {/* Fats Segment: Solar Gold (#f4e76e) */}
                      <circle
                        cx="64"
                        cy="64"
                        r={radius}
                        className="stroke-[#f4e76e] transition-all duration-700 ease-out"
                        strokeWidth="10"
                        strokeDasharray={`${fatsStroke} ${circumference}`}
                        strokeDashoffset={-(proteinStroke + carbsStroke)}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>

                    {/* Ring Center */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-black text-white leading-none">
                        {dynamicCalories}
                      </span>
                      <span className="text-[10px] font-bold text-[#A0A493] uppercase tracking-wider">
                        kcal Total
                      </span>
                    </div>
                  </div>

                  {/* Legend & Gram Measurements */}
                  <div className="flex-1 w-full grid grid-cols-3 sm:grid-cols-1 gap-2.5">
                    {/* Protein */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#121815] border border-[#757761]/30 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f7fe72] shrink-0" />
                        <span className="text-xs font-semibold text-[#CBD2C7]">Protein</span>
                      </div>
                      <span className="text-xs font-black text-white">
                        {dynamicProtein}g <span className="text-[10px] text-[#A0A493] font-normal">({proteinPct}%)</span>
                      </span>
                    </div>

                    {/* Carbs */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#121815] border border-[#757761]/30 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#757761] shrink-0" />
                        <span className="text-xs font-semibold text-[#CBD2C7]">Carbs</span>
                      </div>
                      <span className="text-xs font-black text-white">
                        {dynamicCarbs}g <span className="text-[10px] text-[#A0A493] font-normal">({carbsPct}%)</span>
                      </span>
                    </div>

                    {/* Fats */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#121815] border border-[#757761]/30 shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f4e76e] shrink-0" />
                        <span className="text-xs font-semibold text-[#CBD2C7]">Fats</span>
                      </div>
                      <span className="text-xs font-black text-white">
                        {dynamicFats}g <span className="text-[10px] text-[#A0A493] font-normal">({fatsPct}%)</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                RIGHT COLUMN: LOCAL INGREDIENT RADAR & SWAPS
                ========================================================================= */}
            <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-6 bg-[#121815]">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#757761]/25">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#f7fe72]" />
                      <span>Local Ingredient Radar &amp; Live Substitutes</span>
                    </h4>
                    <p className="text-xs text-[#A0A493]">
                      Sourced real-time from Delhi mandis, local kirana merchants, and local dairies.
                    </p>
                  </div>
                  <span className="self-start sm:self-auto text-[11px] font-bold text-[#f7fe72] bg-[#757761]/20 px-2.5 py-1 rounded-full border border-[#757761]/30">
                    &le; 2.0km Perimeter
                  </span>
                </div>

                {/* Ingredient Checklist with Live Local Substitutes */}
                <div className="space-y-3">
                  {activeMeal.ingredients.map((ing) => {
                    const hasActiveSwap = ing.activeSwapIndex !== undefined && ing.alternatives[ing.activeSwapIndex];
                    const activeSwap = hasActiveSwap ? ing.alternatives[ing.activeSwapIndex!] : null;

                    return (
                      <div
                        key={ing.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                          hasActiveSwap
                            ? "bg-[#757761]/20 border-[#f7fe72]/50 shadow-xs"
                            : "bg-[#0B0E0C] border-[#757761]/25 hover:border-[#757761]/50"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Ingredient info */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#f7fe72] shrink-0" />
                              <span className="text-sm font-bold text-white">
                                {hasActiveSwap ? activeSwap?.name : ing.name}
                              </span>
                              {hasActiveSwap && (
                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#f7fe72] text-[#0B0E0C]">
                                  Swapped
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-[#A0A493] pl-4 space-y-0.5">
                              <div className="font-medium text-[#f4e76e]">
                                {hasActiveSwap ? `Portion: ${activeSwap?.portion}` : ing.substituteNote}
                              </div>
                              <div className="flex items-center gap-1.5 text-[#A0A594] text-[11px]">
                                <Store className="w-3 h-3 text-[#757761]" />
                                <span>{hasActiveSwap ? activeSwap?.vendorName : ing.vendor}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button: Smart Swap Modal trigger */}
                          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                            {hasActiveSwap && (
                              <button
                                onClick={() => handleApplySwap(ing.id, null)}
                                className="text-[11px] font-semibold text-[#A0A493] hover:text-white underline transition-colors cursor-pointer"
                              >
                                Reset
                              </button>
                            )}

                            <button
                              onClick={() => setActiveSwapIngredient(ing)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121815] hover:bg-[#181f1b] text-[#f7fe72] text-xs font-bold border border-[#757761]/40 hover:border-[#f7fe72] transition-all shadow-2xs active:scale-95 cursor-pointer"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5 text-[#f7fe72]" />
                              <span>Smart Swap</span>
                            </button>
                          </div>
                        </div>

                        {/* If swapped, show macro and cost delta pill */}
                        {hasActiveSwap && activeSwap && (
                          <div className="mt-2.5 pt-2 border-t border-[#757761]/30 flex items-center justify-between text-[11px] text-[#f7fe72] font-semibold pl-4">
                            <span>Delta: {activeSwap.macroImpact}</span>
                            <span className="font-bold text-[#0B0E0C] bg-[#f7fe72] px-2 py-0.5 rounded border border-[#f7fe72]/50">
                              {activeSwap.priceDelta}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions & One-Click Log Meal Button */}
              <div className="pt-4 border-t border-[#757761]/25 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#A0A493]">
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-[#f7fe72]" />
                    <span>Real-time local vendor pricing verified today</span>
                  </span>
                  <span className="font-semibold text-[#CBD2C7]">100% Macro Precision</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* One-click "Log Meal (+50 XP)" button that triggers confetti */}
                  <button
                    onClick={handleLogMeal}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:brightness-110 active:scale-98 text-[#0B0E0C] font-black text-sm tracking-wide shadow-md transition-all cursor-pointer group"
                  >
                    <Sparkles className="w-4 h-4 text-[#0B0E0C] group-hover:rotate-12 transition-transform" />
                    <span>Log Meal (+50 XP)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: activeMeal.title,
                          text: `Optimal local high-protein meal: ${activeMeal.title} (₹${dynamicCost}, ${dynamicProtein}g Protein). Built with PulseAI!`,
                        }).catch(() => {});
                      } else {
                        alert("Recipe link copied to clipboard!");
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-[#0B0E0C] hover:bg-[#161c18] border border-[#757761]/35 text-[#E2E7DE] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Share meal blueprint"
                  >
                    <Share2 className="w-4 h-4 text-[#A0A493]" />
                    <span>Share Blueprint</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. SMART SWAP MODAL / FLYOUT (Displays 3 cheaper/closer alternatives within 2km)
            ========================================================================= */}
        {activeSwapIngredient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-[#121815] rounded-3xl max-w-xl w-full border border-[#757761]/40 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-5 sm:p-6 bg-[#0B0E0C] border-b border-[#757761]/25 flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#757761]/20 text-[#f7fe72] border border-[#757761]/30 text-[10px] font-bold uppercase tracking-wider">
                    <ArrowRightLeft className="w-3 h-3 text-[#f7fe72]" />
                    <span>Hyper-Local Alternative Engine</span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">
                    Smart Swaps for &ldquo;{activeSwapIngredient.name}&rdquo;
                  </h3>
                  <p className="text-xs text-[#A0A493]">
                    3 cheaper or more accessible alternatives available within 2km of {currentLocation.split("/")[0]}.
                  </p>
                </div>

                <button
                  onClick={() => setActiveSwapIngredient(null)}
                  className="p-2 rounded-xl text-[#A0A594] hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: 3 local alternatives */}
              <div className="p-5 sm:p-6 space-y-3.5 max-h-[60vh] overflow-y-auto">
                {activeSwapIngredient.alternatives.map((alt, idx) => {
                  const isCurrentSelection = activeSwapIngredient.activeSwapIndex === idx;

                  return (
                    <div
                      key={alt.name}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrentSelection
                          ? "border-[#f7fe72] bg-[#757761]/20 shadow-xs"
                          : "border-[#757761]/30 hover:border-[#757761]/60 bg-[#0B0E0C]"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">
                              {alt.name}
                            </span>
                            <span className="text-[11px] font-semibold text-[#A0A493]">
                              ({alt.portion})
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-[#CBD2C7]">
                            <span className="flex items-center gap-1 text-[#E2E7DE] font-medium">
                              <Store className="w-3.5 h-3.5 text-[#757761]" />
                              {alt.vendorName}
                            </span>
                            <span className="text-[#f7fe72] font-bold bg-[#757761]/20 px-1.5 py-0.5 rounded text-[11px] border border-[#757761]/30">
                              {alt.distance}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs pt-1">
                            <span className="text-[#A0A493]">Impact:</span>
                            <span className="font-semibold text-[#f4e76e] bg-white/5 px-2 py-0.5 rounded text-[11px]">
                              {alt.macroImpact}
                            </span>
                          </div>
                        </div>

                        {/* Pricing & Apply Action */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#757761]/25">
                          <span
                            className={`text-xs font-black px-2.5 py-1 rounded-full ${
                              alt.priceDiffNumber < 0
                                ? "bg-[#f7fe72]/15 text-[#f7fe72] border border-[#f7fe72]/30"
                                : "bg-[#f4e76e]/15 text-[#f4e76e] border border-[#f4e76e]/30"
                            }`}
                          >
                            {alt.priceDelta}
                          </span>

                          <button
                            onClick={() => handleApplySwap(activeSwapIngredient.id, idx)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isCurrentSelection
                                ? "bg-[#757761] text-white"
                                : "bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] text-[#0B0E0C] font-black hover:brightness-110 active:scale-95"
                            }`}
                          >
                            {isCurrentSelection ? "Active Choice" : "Apply Swap"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#0B0E0C] border-t border-[#757761]/25 flex items-center justify-between text-xs text-[#A0A493]">
                <span className="text-[11px]">Pricing recalculated against regional mandi indices</span>
                <button
                  onClick={() => setActiveSwapIngredient(null)}
                  className="px-4 py-1.5 rounded-lg text-[#CBD2C7] hover:text-white font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
