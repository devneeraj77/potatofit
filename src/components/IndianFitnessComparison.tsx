"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Flame,
  Dumbbell,
  Sparkles,
  Leaf,
  Scale,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { Dropdown, Button, Label } from "@heroui/react";

// Traditional Bharatiya Vyayama Movement Model
interface AkhadaMovement {
  id: string;
  sanskrit: string;
  transliteration: string;
  englishTitle: string;
  ancientLineage: string;
  biomechanics: string;
  targetMuscles: string[];
  repCadence: string;
  secondsPerCycle: number;
  ancientShloka: string;
  modernWesternEquivalent: string;
  sattuFuelPairing: string;
}

const AKHADA_MOVEMENTS: AkhadaMovement[] = [
  {
    id: "dand",
    sanskrit: "दण्ड",
    transliteration: "Dand",
    englishTitle: "The Akhada Kinetic Pushup",
    ancientLineage: "Foundation of pehlwani (wrestling) akhadas across Varanasi, Kolhapur & Punjab for over 2,000 years.",
    biomechanics: "Dynamic multi-planar spine wave transitioning from Downward Dog into deep cobra arch. Decompresses lumbar discs, strengthens rotator cuffs, and activates whole-body myofascial chains.",
    targetMuscles: ["Anterior Deltoids", "Pectoralis Major", "Triceps Brachii", "Serratus Anterior", "Thoracic Spine"],
    repCadence: "3 seconds per smooth kinetic cycle",
    secondsPerCycle: 4,
    ancientShloka: "दण्डेन वर्धते वीर्यं बाहुवीर्यं तथैव च ।",
    modernWesternEquivalent: "Standard bench press (which locks scapula flat and isolates chest without spinal mobility).",
    sattuFuelPairing: "40g Roasted Chana Sattu + cold water + pink rock salt + roasted cumin powder immediately post-session.",
  },
  {
    id: "baithak",
    sanskrit: "बैठक",
    transliteration: "Baithak",
    englishTitle: "The Deep Kinetic Hindu Squat",
    ancientLineage: "Practiced daily by legendary Gama Pehlwan (who did 3,000 to 5,000 daily baithaks with zero knee osteoarthritis).",
    biomechanics: "Heels-elevated, deep knee flexion with rhythmical arm swings. Builds tendon tensile strength in the patellar ligament, restores natural ankle dorsiflexion, and stimulates deep pelvic blood flow.",
    targetMuscles: ["Quadriceps Femoris", "Gluteus Maximus", "Patellar Tendon", "Soleus", "Transverse Abdominis"],
    repCadence: "2 seconds per continuous fluid cadence",
    secondsPerCycle: 3,
    ancientShloka: "जानुसन्धेर्बलं दद्यात् स्थैर्यं जङ्घासु कल्पयेत् ॥",
    modernWesternEquivalent: "Smith machine half-squats (which overload spinal compression and neglect stabilizer tendons).",
    sattuFuelPairing: "Sprouted black chana (kala chana) + raw grated ginger + lemon zest.",
  },
  {
    id: "gada",
    sanskrit: "गदा भ्रमण",
    transliteration: "Gada Bhramana",
    englishTitle: "360° Rotational Macebell Swing",
    ancientLineage: "Sacred weapon of Lord Hanuman and traditional Indian wrestlers for rotational kinetic power and grip endurance.",
    biomechanics: "Centrifugal pendulum acceleration requiring offset grip counter-torque. Bulletproofs wrists, forearms, thoracic mobility, and diagonal core stability.",
    targetMuscles: ["Rotator Cuff", "Brachioradialis", "External Obliques", "Latissimus Dorsi", "Wrist Flexors"],
    repCadence: "5 seconds per continuous dual-side arc",
    secondsPerCycle: 5,
    ancientShloka: "गदाभ्रमणेन भुजयोः सामर्थ्यं द्विगुणीभवेत् ।",
    modernWesternEquivalent: "Seated dumbbell bicep curls and machine shoulder press (static 1-dimensional planes).",
    sattuFuelPairing: "Warm turmeric milk (Haldi Doodh) infused with cracked black pepper and 5g ashwagandha.",
  },
  {
    id: "surya-namaskar",
    sanskrit: "सूर्य नमस्कार",
    transliteration: "Surya Namaskar",
    englishTitle: "12-Vinyasa Solar Kinetic Flow",
    ancientLineage: "Rigvedic solar salutation aligning biological rhythms with circadian solar irradiance and diaphragmatic respiration.",
    biomechanics: "12 linked asanas synchronizing prana (breath) with full flexion and extension of the human spinal column. Regulates autonomic tone and metabolic thyroid balance.",
    targetMuscles: ["Full Posterior Chain", "Hip Flexors", "Diaphragm", "Shoulder Girdle", "Hamstrings"],
    repCadence: "6 seconds per breath-guided transition",
    secondsPerCycle: 6,
    ancientShloka: "आदित्यस्य नमस्कारं ये कुर्वन्ति दिने दिने । आयुः प्रज्ञा बलं वीर्यं तेजस्तेषां च जायते ॥",
    modernWesternEquivalent: "Boring 30-minute treadmill jogging in air-conditioned indoor gyms under artificial LED lights.",
    sattuFuelPairing: "Fresh tender coconut water or seasonal sweet lime (Mosambi) with pinch of rock salt.",
  },
  {
    id: "kumbhaka",
    sanskrit: "कुम्भक प्राणायाम",
    transliteration: "Kumbhaka Pranayama",
    englishTitle: "Voluntary Breath Retention & Vagus Modulation",
    ancientLineage: "Codified in Hatha Yoga Pradipika as the ultimate technology for calming the autonomic nervous system and down-regulating cortisol.",
    biomechanics: "Controlled intercostal expansion with breath holding (Antara/Bahya Kumbhaka). Stimulates the vagus nerve, elevates blood CO2 tolerance, and boosts cellular nitric oxide.",
    targetMuscles: ["Diaphragm", "Intercostal Muscles", "Pelvic Floor", "Vagus Nerve Axis", "Prefrontal Cortex"],
    repCadence: "4s Inhale · 4s Hold · 4s Exhale · 4s Hold",
    secondsPerCycle: 8,
    ancientShloka: "चले वाते चलं चित्तं निश्चले निश्चलं भवेत् । योगी स्थाणुत्वमाप्नोति ततो वायुं निरोधयेत् ॥",
    modernWesternEquivalent: "$80/session commercial cold plunge tanks that shock the adrenal system.",
    sattuFuelPairing: "A2 cow curd (dahi) with roasted flaxseed powder and soaked almonds.",
  },
];

// Direct Comparison Dimensions
interface ComparisonMetric {
  category: "nutrition" | "training" | "recovery" | "cost" | "philosophy";
  dimension: string;
  uchitatvamWay: {
    title: string;
    description: string;
    highlight: string;
    badge: string;
  };
  westernAppsWay: {
    title: string;
    description: string;
    drawback: string;
    example: string;
  };
}

const COMPARISON_DATA: ComparisonMetric[] = [
  {
    category: "nutrition",
    dimension: "Primary Protein & Fuel Source",
    uchitatvamWay: {
      title: "Mandi Sattu, Desi Pulses & A2 Curd",
      description: "Directly maps roasted Chana Sattu (26g clean protein/100g), sprouted lentils, paneer, and local Mandi greens. Zero artificial sweeteners, zero gut dysbiosis, and 100% whole-food bioavailability.",
      highlight: "₹35/day real-food protein · Zero stomach bloat",
      badge: "Sattvic Nutrition",
    },
    westernAppsWay: {
      title: "Ultra-Processed Imported Whey Powder",
      description: "Pushes ₹6,500/tub artificial whey isolates, sucralose-laden protein bars, and chemically fortified drinks manufactured thousands of miles away.",
      drawback: "₹250/day synthetic cost · Chronic digestive inflammation",
      example: "Generic calorie tracking apps & commercial gyms",
    },
  },
  {
    category: "training",
    dimension: "Movement Architecture & Biomechanics",
    uchitatvamWay: {
      title: "Akhada Vyayama & Rotational Kinetic Chains",
      description: "Integrates traditional Dand (Hindu spinal wave), Baithak (deep tendon knee bulletproofing), and Gada (360° mace torque) with modern progressive overload principles.",
      highlight: "Multi-planar rotational mobility · Lifelong joint resilience",
      badge: "Akhada Protocols",
    },
    westernAppsWay: {
      title: "Linear Isolated Machine Tracks",
      description: "Forces the human skeleton into 2D fixed-rail machine tracks (leg extensions, smith machine) that lock the scapula and wear down joint cartilage over time.",
      drawback: "Isolated vanity muscles · Frequent shoulder & knee injuries",
      example: "Cult.fit / Standard commercial fitness centers",
    },
  },
  {
    category: "recovery",
    dimension: "Neuromuscular Recovery & Autonomic Balance",
    uchitatvamWay: {
      title: "Dinacharya, Pranayama & Yoga Nidra",
      description: "Restores parasympathetic autonomic tone through circadian solar exposure, Kumbhaka breath retention, and restorative sleep architecture powered by Ashwagandha and Haldi Doodh.",
      highlight: "Subcortical calm · Natural endocrine hormonal reset",
      badge: "Prana Harmonization",
    },
    westernAppsWay: {
      title: "Gimmicky Ice Plunges & High-Stim Pre-Workouts",
      description: "Heavily reliant on 300mg synthetic caffeine pre-workouts that spike cortisol, followed by commercial cryotherapy chambers that shock adrenal pathways.",
      drawback: "Adrenal fatigue · Insomnia & chronic elevated resting HR",
      example: "Whoop / Commercial biohacking influencers",
    },
  },
  {
    category: "cost",
    dimension: "Annual Financial Commitment & Accessibility",
    uchitatvamWay: {
      title: "₹0 Platform Paywalls · Kirana Direct Savings",
      description: "All athletic protocols, D3 consistency heatmaps, leaderboard competitions, and nutrition engines are 100% open with zero subscription traps or paywalled features.",
      highlight: "Save up to ₹87,000/year compared to commercial gyms",
      badge: "Democratized Vitality",
    },
    westernAppsWay: {
      title: "Subscription Traps & Paywalled Features",
      description: "Locks basic barcode scanning, macro breakdowns, and wearable telemetry behind $120–$300/year recurring credit card subscriptions.",
      drawback: "High recurring fees · Paywalls on basic human health metrics",
      example: "MyFitnessPal Premium / Whoop 4.0 Subscriptions",
    },
  },
  {
    category: "philosophy",
    dimension: "Athletic Philosophy & Community Mindset",
    uchitatvamWay: {
      title: "॥ शरीरमाद्यं खलु धर्मसाधनम् ॥",
      description: "The body is the primary vessel of life's noble purpose (Dharma). Promotes brotherhood, humility, raw daily discipline, and inter-city arena tournaments without shallow mirror selfies.",
      highlight: "Character, longevity & purpose over vanity",
      badge: "Ancient Dharma",
    },
    westernAppsWay: {
      title: "Ego-Lifting & Vanity Mirror Aesthetics",
      description: "Isolated gym floors filled with noise-canceling headphones, synthetic aesthetic obsession, and superficial social media dopamine loops that breed body dysmorphia.",
      drawback: "Transactional mindset · High burnout & dropout rate",
      example: "Commercial bodybuilding & fitness influencers",
    },
  },
];

export default function IndianFitnessComparison() {
  const [activeCategory, setActiveCategory] = useState<"all" | "nutrition" | "training" | "recovery" | "cost" | "philosophy">("all");
  const [selectedMovement, setSelectedMovement] = useState<AkhadaMovement>(AKHADA_MOVEMENTS[0]);
  
  // Interactive cadence pacer state for the movement studio
  const [isPacing, setIsPacing] = useState(false);
  const [currentCadenceSec, setCurrentCadenceSec] = useState(selectedMovement.secondsPerCycle);
  const [repCount, setRepCount] = useState(0);

  const handleSelectMovement = (movement: AkhadaMovement) => {
    setSelectedMovement(movement);
    setCurrentCadenceSec(movement.secondsPerCycle);
    setIsPacing(false);
  };

  // Cadence interval timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPacing) {
      timer = setInterval(() => {
        setCurrentCadenceSec((prev) => {
          if (prev <= 1) {
            setRepCount((r) => r + 1);
            return selectedMovement.secondsPerCycle;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPacing, selectedMovement.secondsPerCycle]);

  const filteredComparison =
    activeCategory === "all"
      ? COMPARISON_DATA
      : COMPARISON_DATA.filter((item) => item.category === activeCategory);

  return (
    <section
      id="indian-fitness-heritage"
      aria-label="Indian Fitness Heritage & Uchitatvam Ecosystem Comparison"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-20 sm:scroll-mt-24"
    >
      {/* 1. Sanskrit Header & Brand Identity Manifesto */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#18201A] via-[#141A16] to-[#0B0E0C] border border-[#757761]/35 p-6 sm:p-10 shadow-2xl mb-12">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f7fe72]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#757761]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Sacred Sanskrit Shloka Ribbon */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f7fe72]/10 border border-[#f7fe72]/30 text-[#f7fe72] text-xs sm:text-sm font-serif tracking-wide shadow-xs">
            <Sparkles className="w-4 h-4 text-[#f7fe72]" />
            <span className="font-bold tracking-wider">॥ शरीरमाद्यं खलु धर्मसाधनम् ॥</span>
            <span className="text-white/40 hidden md:inline">·</span>
            <span className="text-[#CBD2C7] text-xs font-sans hidden md:inline">
              &quot;The body is the primary and sacred vessel for all purpose and duty.&quot;
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#f7fe72] bg-[#757761]/25 px-2.5 py-0.5 rounded">
                  BHARATIYA VYAYAMA &amp; BIO-SCIENCE
                </span>
                <span className="text-xs text-[#A0A493] font-mono">
                  Authentic Indian Fitness Re-engineered
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Why <span className="text-[#f7fe72]">Uchitatvam (उचितत्वम्)</span> Beats Every Western Fitness App.
              </h2>

              <p className="text-sm sm:text-base text-[#A0A493] leading-relaxed">
                For decades, modern fitness sold us expensive imported whey, synthetic supplements, and sterile gym machines that caused joint stiffness and burnout. <strong className="text-white font-semibold">Uchitatvam</strong> restores the timeless power of the Indian Akhada, hyper-local Mandi nutrition (Sattu, Sprouts &amp; Pulses), and Pranayama breathwork—upgraded with modern D3 telemetry and global Arena tournaments.
              </p>
            </div>

            {/* Quick Core Pill: Sanskrit Meaning of Uchitatvam */}
            <div className="bg-[#0B0E0C]/80 backdrop-blur-md border border-[#757761]/35 rounded-2xl p-4 sm:p-5 shrink-0 max-w-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#f7fe72] font-bold">उचितत्वम् • UCHITATVAM</span>
                <span className="text-[#757761]">Gita 6.17</span>
              </div>
              <p className="text-xs text-[#CBD2C7] italic">
                &quot;युक्तचेष्टस्य कर्मसु — Optimal, proportionate, and harmonious action in training, nutrition, and rest.&quot;
              </p>
              <div className="flex items-center gap-2 pt-1 border-t border-[#757761]/20 text-[11px] font-mono text-[#A0A493]">
                <span className="w-2 h-2 rounded-full bg-[#f7fe72] animate-pulse" />
                <span>Zero Western corporate fluff · 100% Indian soul</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Head-to-Head Comparison Matrix */}
      <div className="bg-[#121815] rounded-3xl border border-[#757761]/30 p-5 sm:p-8 shadow-2xl mb-12 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#757761]/25">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-[#f7fe72]" />
              <span>Head-to-Head Benchmark: The Real Comparison</span>
            </h3>
            <p className="text-xs text-[#A0A493]">
              Examine how Uchitatvam fundamentally outperforms standard commercial apps, studio subscriptions, and generic calorie trackers.
            </p>
          </div>

          {/* Category Filter Controls */}
          {/* Mobile HeroUI Dropdown */}
          <div className="sm:hidden">
            <Dropdown>
              <Button
                variant="secondary"
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-[#E2E7DE] bg-[#0B0E0C] hover:bg-black/60 border border-[#757761]/40 rounded-xl cursor-pointer"
                aria-label="Filter Comparison Category"
              >
                <span>
                  {activeCategory === "all"
                    ? "All Dimensions (5)"
                    : activeCategory === "nutrition"
                    ? "Ahara (Nutrition)"
                    : activeCategory === "training"
                    ? "Vyayama (Movement)"
                    : activeCategory === "recovery"
                    ? "Prana (Recovery)"
                    : activeCategory === "cost"
                    ? "Artha (Cost Savings)"
                    : "Dharma (Philosophy)"}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#A0A594] rotate-90" />
              </Button>
              <Dropdown.Popover className="min-w-[200px] z-[70] p-1.5 bg-[#121815]/95 backdrop-blur-xl border border-[#757761]/40 rounded-2xl shadow-2xl">
                <Dropdown.Menu
                  aria-label="Select Comparison Category"
                  selectionMode="single"
                  selectedKeys={new Set([activeCategory])}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    if (selected) {
                      setActiveCategory(String(selected) as "all" | "nutrition" | "training" | "recovery" | "cost" | "philosophy");
                    }
                  }}
                  className="space-y-1 outline-none"
                >
                  <Dropdown.Item id="all" textValue="All Dimensions" className="p-2 rounded-xl text-xs font-semibold hover:bg-white/10 cursor-pointer outline-none data-[selected=true]:text-[#f7fe72]">
                    <Label>All Dimensions (5)</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="nutrition" textValue="Ahara (Nutrition)" className="p-2 rounded-xl text-xs font-semibold hover:bg-white/10 cursor-pointer outline-none data-[selected=true]:text-[#f7fe72]">
                    <Label>Ahara (Nutrition)</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="training" textValue="Vyayama (Movement)" className="p-2 rounded-xl text-xs font-semibold hover:bg-white/10 cursor-pointer outline-none data-[selected=true]:text-[#f7fe72]">
                    <Label>Vyayama (Movement)</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="recovery" textValue="Prana (Recovery)" className="p-2 rounded-xl text-xs font-semibold hover:bg-white/10 cursor-pointer outline-none data-[selected=true]:text-[#f7fe72]">
                    <Label>Prana (Recovery)</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="cost" textValue="Artha (Cost Savings)" className="p-2 rounded-xl text-xs font-semibold hover:bg-white/10 cursor-pointer outline-none data-[selected=true]:text-[#f7fe72]">
                    <Label>Artha (Cost Savings)</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="philosophy" textValue="Dharma (Philosophy)" className="p-2 rounded-xl text-xs font-semibold hover:bg-white/10 cursor-pointer outline-none data-[selected=true]:text-[#f7fe72]">
                    <Label>Dharma (Philosophy)</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>

          {/* Desktop Filter Pills */}
          <div className="hidden sm:flex items-center gap-1.5 p-1 bg-[#0B0E0C] border border-[#757761]/35 rounded-xl text-xs">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeCategory === "all" ? "bg-[#f7fe72] text-[#0B0E0C] font-bold" : "text-[#A0A493] hover:text-white"
              }`}
            >
              All (5)
            </button>
            <button
              onClick={() => setActiveCategory("nutrition")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeCategory === "nutrition" ? "bg-[#f7fe72] text-[#0B0E0C] font-bold" : "text-[#A0A493] hover:text-white"
              }`}
            >
              Ahara (Diet)
            </button>
            <button
              onClick={() => setActiveCategory("training")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeCategory === "training" ? "bg-[#f7fe72] text-[#0B0E0C] font-bold" : "text-[#A0A493] hover:text-white"
              }`}
            >
              Vyayama (Strength)
            </button>
            <button
              onClick={() => setActiveCategory("recovery")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeCategory === "recovery" ? "bg-[#f7fe72] text-[#0B0E0C] font-bold" : "text-[#A0A493] hover:text-white"
              }`}
            >
              Prana (Breath)
            </button>
            <button
              onClick={() => setActiveCategory("cost")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeCategory === "cost" ? "bg-[#f7fe72] text-[#0B0E0C] font-bold" : "text-[#A0A493] hover:text-white"
              }`}
            >
              Artha (Cost)
            </button>
            <button
              onClick={() => setActiveCategory("philosophy")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeCategory === "philosophy" ? "bg-[#f7fe72] text-[#0B0E0C] font-bold" : "text-[#A0A493] hover:text-white"
              }`}
            >
              Dharma
            </button>
          </div>
        </div>

        {/* Comparison Cards Grid */}
        <div className="space-y-4">
          {filteredComparison.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 sm:p-5 rounded-2xl bg-[#0B0E0C] border border-[#757761]/25 hover:border-[#f7fe72]/40 transition-all"
            >
              {/* Dimension Label */}
              <div className="lg:col-span-3 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#f7fe72] bg-[#757761]/20 px-2 py-0.5 rounded">
                  {item.uchitatvamWay.badge}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                  {item.dimension}
                </h4>
              </div>

              {/* The Uchitatvam Way (Superior Indian Approach) */}
              <div className="lg:col-span-5 p-4 rounded-xl bg-gradient-to-br from-[#18201A] to-[#121815] border border-[#f7fe72]/30 space-y-2 relative overflow-hidden">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#f7fe72]">
                  <Check className="w-4 h-4 text-[#f7fe72] shrink-0" />
                  <span>UCHITATVAM BHARATIYA PROTOCOL</span>
                </div>
                <h5 className="text-sm font-bold text-white">
                  {item.uchitatvamWay.title}
                </h5>
                <p className="text-xs text-[#CBD2C7] leading-relaxed">
                  {item.uchitatvamWay.description}
                </p>
                <div className="pt-2 border-t border-[#757761]/25 flex items-center gap-1.5 text-[11px] font-mono text-[#f7fe72]">
                  <Sparkles className="w-3 h-3 text-[#f7fe72] shrink-0" />
                  <span>{item.uchitatvamWay.highlight}</span>
                </div>
              </div>

              {/* Standard Western Fitness Apps */}
              <div className="lg:col-span-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between text-xs font-bold text-[#A0A493]">
                  <div className="flex items-center gap-1.5 text-rose-400">
                    <X className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>OTHER APPS &amp; COMMERCIAL GYMS</span>
                  </div>
                  <span className="text-[10px] text-[#757761] font-mono">{item.westernAppsWay.example}</span>
                </div>
                <h5 className="text-sm font-semibold text-white/90">
                  {item.westernAppsWay.title}
                </h5>
                <p className="text-xs text-[#A0A493] leading-relaxed">
                  {item.westernAppsWay.description}
                </p>
                <div className="pt-2 border-t border-white/10 text-[11px] font-mono text-rose-300">
                  ⚠️ {item.westernAppsWay.drawback}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Interactive Bharatiya Vyayama & Akhada Movement Studio */}
      <div className="bg-[#121815] rounded-3xl border border-[#757761]/30 p-5 sm:p-8 shadow-2xl space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#757761]/25">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#f7fe72] bg-[#757761]/20 px-2 py-0.5 rounded">
                INTERACTIVE AKHADA STUDIO
              </span>
              <span className="text-xs text-[#A0A493] font-mono">
                Pehlwan Biomechanical Movement Guide
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Dumbbell className="w-5 h-5 text-[#f7fe72]" />
              <span>Explore Traditional Indian Movement Arts</span>
            </h3>
            <p className="text-xs text-[#A0A493]">
              Select a sacred Vyayama exercise below to inspect ancient Sanskrit root lore, modern biomechanical joint benefits, and guided cadence rhythm.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#CBD2C7] bg-[#0B0E0C] px-3 py-1.5 rounded-xl border border-[#757761]/30">
              Completed Reps: <strong className="text-[#f7fe72] text-sm">{repCount}</strong>
            </span>
          </div>
        </div>

        {/* Movement Selector Tabs (Scroll-safe, Responsive) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {AKHADA_MOVEMENTS.map((movement) => {
            const isSelected = selectedMovement.id === movement.id;
            return (
              <button
                key={movement.id}
                onClick={() => handleSelectMovement(movement)}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative ${
                  isSelected
                    ? "bg-gradient-to-b from-[#18201A] to-[#121815] border-[#f7fe72] shadow-[0_0_15px_rgba(247,254,114,0.15)] ring-1 ring-[#f7fe72]"
                    : "bg-[#0B0E0C] border-[#757761]/30 hover:border-[#757761]/60 hover:bg-[#151c18]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold font-serif ${isSelected ? "text-[#f7fe72]" : "text-white"}`}>
                    {movement.sanskrit}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#f7fe72] animate-ping" />}
                </div>
                <div className="text-xs font-bold text-white mt-1">{movement.transliteration}</div>
                <div className="text-[11px] text-[#A0A493] truncate mt-0.5">{movement.englishTitle}</div>
              </button>
            );
          })}
        </div>

        {/* Active Movement Deep-Dive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-7 rounded-2xl bg-[#0B0E0C] border border-[#757761]/30">
          {/* Left Column: Sanskrit Shloka & Ancient Lineage */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black font-serif text-[#f7fe72]">
                  {selectedMovement.sanskrit}
                </span>
                <span className="text-lg font-bold text-white">
                  ({selectedMovement.transliteration})
                </span>
              </div>
              <h4 className="text-base font-bold text-[#CBD2C7]">
                {selectedMovement.englishTitle}
              </h4>
            </div>

            {/* Sacred Sanskrit Shloka */}
            <div className="p-4 rounded-xl bg-[#18201A] border border-[#f7fe72]/30 text-xs sm:text-sm font-serif text-[#f7fe72] space-y-1">
              <div className="text-[10px] font-mono uppercase text-[#A0A493] tracking-wider">
                Ancient Classical Shloka
              </div>
              <p className="leading-relaxed font-bold">
                {selectedMovement.ancientShloka}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-[#CBD2C7]">
              <span className="font-mono text-[11px] font-bold text-[#f7fe72] uppercase block">
                Historical Akhada Lineage:
              </span>
              <p className="leading-relaxed">
                {selectedMovement.ancientLineage}
              </p>
            </div>

            {/* Sattu Fuel Pairing */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-[#757761]/30 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#f7fe72]">
                <Leaf className="w-3.5 h-3.5 text-[#f7fe72]" />
                <span>Bharatiya Ahara Pairing:</span>
              </div>
              <p className="text-[#A0A493] text-[11px] leading-relaxed">
                {selectedMovement.sattuFuelPairing}
              </p>
            </div>
          </div>

          {/* Right Column: Modern Biomechanics & Interactive Cadence Pacer */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="space-y-1 text-xs">
                <span className="font-mono text-[11px] font-bold text-[#f7fe72] uppercase block">
                  Biomechanical Impact &amp; Joint Longevity:
                </span>
                <p className="text-[#CBD2C7] leading-relaxed">
                  {selectedMovement.biomechanics}
                </p>
              </div>

              {/* Target Musculoskeletal Chains */}
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] text-[#A0A493] uppercase font-bold">
                  Activated Myofascial Chains:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMovement.targetMuscles.map((muscle, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-[#18201A] border border-[#757761]/30 text-[11px] font-mono text-[#CBD2C7]"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contrast vs Western Gym Equipment */}
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                <span className="font-mono text-[10px] text-rose-400 uppercase font-bold block">
                  Contrast vs. Commercial Gym Machine:
                </span>
                <p className="text-[#A0A493] text-[11px]">
                  {selectedMovement.modernWesternEquivalent}
                </p>
              </div>
            </div>

            {/* Interactive Cadence Rhythm Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#18201A] to-[#121815] border border-[#f7fe72]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 shadow-lg">
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-[#A0A493] uppercase flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#f7fe72]" />
                  <span>Cadence Rhythm Pacer</span>
                </div>
                <div className="text-lg font-black font-mono text-white flex items-baseline gap-2">
                  <span className="text-3xl text-[#f7fe72]">{currentCadenceSec}s</span>
                  <span className="text-xs text-[#A0A493]">/ repetition cycle</span>
                </div>
                <p className="text-[10px] text-[#CBD2C7]">
                  {selectedMovement.repCadence}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPacing(!isPacing)}
                  className="px-4 py-2 rounded-xl text-xs font-black text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e8ef63] transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(247,254,114,0.3)] cursor-pointer active:scale-95"
                >
                  {isPacing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPacing ? "Pause Cadence" : "Start Cadence Pacer"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPacing(false);
                    setCurrentCadenceSec(selectedMovement.secondsPerCycle);
                    setRepCount(0);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#CBD2C7] transition-all cursor-pointer"
                  title="Reset counter"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Real Annual Financial & Vitality Value Calculator */}
        <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#18201A] via-[#121815] to-[#0B0E0C] border border-[#757761]/35 grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="space-y-1 md:col-span-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#f7fe72] bg-[#757761]/25 px-2 py-0.5 rounded">
              FINANCIAL SOVEREIGNTY
            </span>
            <h4 className="text-lg font-bold text-white">The ₹87,000 Annual Savings</h4>
            <p className="text-xs text-[#A0A493]">
              Ditch imported synthetic powders and paywalled apps. Fuel cleanly on real Indian whole foods and open protocols.
            </p>
          </div>

          {/* Uchitatvam Annual Cost */}
          <div className="p-4 rounded-xl bg-[#0B0E0C] border border-[#f7fe72]/30 space-y-1">
            <span className="text-[11px] font-mono font-bold text-[#f7fe72] uppercase block">
              The Uchitatvam Way
            </span>
            <div className="text-2xl font-black font-mono text-[#f7fe72]">
              ₹14,400 <span className="text-xs font-normal text-[#A0A493]">/ year</span>
            </div>
            <p className="text-[11px] text-[#CBD2C7] leading-relaxed">
              Mandi Sattu + Kirana Dal + Seasonal Fruits + Open Uchitatvam Platform Protocols.
            </p>
          </div>

          {/* Western Commercial Gym Annual Cost */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[11px] font-mono font-bold text-rose-400 uppercase block">
              Western Commercial Gyms
            </span>
            <div className="text-2xl font-black font-mono text-white/80">
              ₹102,000 <span className="text-xs font-normal text-[#757761]">/ year</span>
            </div>
            <p className="text-[11px] text-[#A0A493] leading-relaxed">
              Commercial studio fees + imported whey tubs + paid app subscriptions + pre-workouts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
