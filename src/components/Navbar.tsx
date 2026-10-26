"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  ChevronDown,
  Languages,
  Menu,
  X,
  Flame,
  ArrowRight,
  Trophy,
  Award,
  Sparkles,
  User,
  LogOut,
  Activity,
  HeartHandshake,
  BookOpen,
} from "lucide-react";
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaThreads,
  FaWhatsapp,
} from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { ThemeToggleGlide, ThemeToggleQuick } from "./ThemeToggleGlide";

export interface NavbarProps {
  onOpenStreak?: () => void;
  onOpenSignIn?: () => void;
  onOpenTrial?: () => void;
  onOpenDashboard?: () => void;
}

type MegaColumn = {
  eyebrow: string;
  links: { label: string; href: string; active?: boolean; badge?: string; desc?: string }[];
};

type MegaMenu = {
  columns: MegaColumn[];
  footerLinks?: { label: string; href: string }[];
  showSocials?: boolean;
  image: { src: string; alt: string };
  imageCaption?: string;
  badgeText?: string;
};

const PROGRAMS_MENU: MegaMenu = {
  badgeText: "Dynamic Movement",
  columns: [
    {
      eyebrow: "Training Pillars",
      links: [
        {
          label: "Hybrid Conditioning",
          href: "/#programs",
          active: true,
          badge: "Popular",
          desc: "Hyrox pace, high-cadence intervals & street sprints",
        },
        {
          label: "Street Calisthenics",
          href: "/#programs",
          desc: "Bodyweight mastery, ring dips & explosive pull volume",
        },
        {
          label: "Biomechanical Mobility",
          href: "/#recovery",
          desc: "Thoracic openers, hip decompression & sleep prep",
        },
      ],
    },
    {
      eyebrow: "Interactive Tools",
      links: [
        {
          label: "5-Min Box Breathing",
          href: "/#recovery",
          badge: "Bio-Harmonize",
          desc: "Sync parasympathetic recovery between sets",
        },
        {
          label: "Set & Volume Tracker",
          href: "/#programs",
          desc: "Log tonnage with real-time rest interval audio cues",
        },
        {
          label: "1-on-1 Coach Queue",
          href: "/#coaches",
          desc: "Direct video clinics with Dr. Vance & Coach Jenkins",
        },
      ],
    },
  ],
  footerLinks: [
    { label: "Full Workout Routine Builder", href: "/#programs" },
    { label: "Injury Prevention Protocol", href: "/#recovery" },
    { label: "Coach Video Clinic Booking", href: "/#coaches" },
  ],
  showSocials: true,
  image: {
    src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    alt: "Athletic Volume Training",
  },
  imageCaption: "Hyper-responsive kinetic tracking & athletic load discipline",
};

const NUTRITION_MENU: MegaMenu = {
  badgeText: "PulseAI Engine",
  columns: [
    {
      eyebrow: "Local Fuel Radar",
      links: [
        {
          label: "Mandi & Street Sourcing",
          href: "/#nutrition",
          active: true,
          badge: "AI Live",
          desc: "Live geospatial pricing across verified wholesale hubs",
        },
        {
          label: "Macro Density Radar",
          href: "/#nutrition",
          desc: "Interactive visualizer of protein-to-cost efficiency",
        },
        {
          label: "High-Protein Under ₹120",
          href: "/#nutrition",
          badge: "Budget King",
          desc: "Targeted recipes built from roasted sattu, sprouts & dal",
        },
      ],
    },
    {
      eyebrow: "Vouchers & Supply",
      links: [
        {
          label: "Kirana Partner Network",
          href: "/rewards",
          desc: "5,200+ partner grocery counters accepting XP fuel vouchers",
        },
        {
          label: "Smart Macro Swaps",
          href: "/#nutrition",
          desc: "Substitute paneer, tofu, soya chunks with 1-tap recalculation",
        },
        {
          label: "Electrolyte & Hydration",
          href: "/dashboard",
          desc: "Calculates salt intake for high-humidity endurance sessions",
        },
      ],
    },
  ],
  footerLinks: [
    { label: "Live Delhi Mandi Price Indices", href: "/#nutrition" },
    { label: "Sourcing Maestro Verification Guide", href: "/rewards" },
  ],
  showSocials: true,
  image: {
    src: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
    alt: "Whole Food Fuel",
  },
  imageCaption: "Wholesale street pulses, unpolished lentils & seasonal greens",
};

const ARENA_MENU: MegaMenu = {
  badgeText: "Live Season 4",
  columns: [
    {
      eyebrow: "Competition Ranks",
      links: [
        {
          label: "Global Leaderboard",
          href: "/leaderboards",
          active: true,
          badge: "Live XP",
          desc: "Real-time standings across 4,800+ verified contenders",
        },
        {
          label: "South Delhi Cohort",
          href: "/leaderboards",
          desc: "Local cluster rivalry with live distance & volume bumpers",
        },
        {
          label: "Champions Podium",
          href: "/leaderboards",
          desc: "Top 3 grandmasters defending Apex Legend crowns",
        },
      ],
    },
    {
      eyebrow: "Prestige & Perks",
      links: [
        {
          label: "5 Reward Tiers",
          href: "/rewards",
          badge: "Vouchers",
          desc: "Unlock ₹250 to ₹500 Kirana credits + custom cast-iron trophy",
        },
        {
          label: "14-Day Streak Bonus",
          href: "/rewards",
          desc: "1.25x XP multiplier when logging meals & mobility unbroken",
        },
        {
          label: "Aura Glow Cosmetics",
          href: "/rewards",
          desc: "Gold Shimmer and Emerald Particle profile badges",
        },
      ],
    },
  ],
  footerLinks: [
    { label: "Season 4 Tournament Schedule", href: "/leaderboards" },
    { label: "Claim Verified Grocery Codes", href: "/rewards" },
  ],
  showSocials: true,
  image: {
    src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
    alt: "Arena Competition",
  },
  imageCaption: "Battle on live leaderboards & redeem fuel vouchers at local kiranas",
};

const LEARN_MENU: MegaMenu = {
  badgeText: "Athletic Academy",
  columns: [
    {
      eyebrow: "Programs",
      links: [
        {
          label: "Hybrid Conditioning",
          href: "/#programs",
          active: true,
          badge: "Popular",
          desc: "Hyrox pace, high-cadence intervals & street sprints",
        },
        {
          label: "Street Calisthenics",
          href: "/#programs",
          desc: "Bodyweight mastery, ring dips & explosive pull volume",
        },
        {
          label: "Set & Volume Tracker",
          href: "/#programs",
          desc: "Log tonnage with real-time audio interval pacing",
        },
        {
          label: "Biomechanical Mobility",
          href: "/#recovery",
          desc: "Thoracic openers, hip decompression & sleep prep",
        },
      ],
    },
    {
      eyebrow: "Nutrition",
      links: [
        {
          label: "Mandi & Street Sourcing",
          href: "/#nutrition",
          active: true,
          badge: "AI Live",
          desc: "Live geospatial pricing across verified wholesale hubs",
        },
        {
          label: "High-Protein Under ₹120",
          href: "/#nutrition",
          badge: "Budget King",
          desc: "Targeted recipes built from roasted sattu, sprouts & dal",
        },
        {
          label: "Macro Density Radar",
          href: "/#nutrition",
          desc: "Interactive visualizer of protein-to-cost efficiency",
        },
        {
          label: "Smart Macro Swaps",
          href: "/#nutrition",
          desc: "Substitute paneer, tofu, soya chunks with 1-tap recalculation",
        },
      ],
    },
    {
      eyebrow: "Coaches",
      links: [
        {
          label: "1-on-1 Video Queue",
          href: "/#coaches",
          active: true,
          badge: "Live Clinics",
          desc: "Direct video clinics with Dr. Vance & Coach Jenkins",
        },
        {
          label: "Coach Sarah Jenkins",
          href: "/#coaches",
          desc: "Hyrox endurance lead & Olympic barbell specialist",
        },
        {
          label: "Dr. Marcus Vance",
          href: "/#coaches",
          desc: "Biomechanical kinetic rehab & injury mitigation",
        },
        {
          label: "Movement Form Audits",
          href: "/#coaches",
          desc: "Video postural review & cadence optimization",
        },
      ],
    },
  ],
  footerLinks: [
    { label: "Full Workout Routine Builder", href: "/#programs" },
    { label: "Live Delhi Mandi Price Indices", href: "/#nutrition" },
    { label: "Book Specialist Coach Clinic", href: "/#coaches" },
  ],
  showSocials: true,
  image: {
    src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    alt: "Uchitatvam Athletic Academy",
  },
  imageCaption: "Complete athlete education: Programs, PulseAI nutrition & certified coach clinics",
};

const MEGA_MENUS: Record<string, MegaMenu> = {
  Learn: LEARN_MENU,
  Programs: PROGRAMS_MENU,
  Nutrition: NUTRITION_MENU,
  Arena: ARENA_MENU,
};

type NavItem = {
  label: string;
  hasMenu: boolean;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Learn", hasMenu: true, icon: BookOpen },
  { label: "Arena", hasMenu: true, icon: Trophy },
];

const LANGUAGES = [
  { code: "EN", label: "English", sub: "Global" },
  { code: "HI", label: "हिन्दी", sub: "National" },
  { code: "PA", label: "ਪੰਜਾਬੀ", sub: "Regional" },
  { code: "BN", label: "বাংলা", sub: "Regional" },
] as const;

const SOCIALS = [
  { href: "https://twitter.com", label: "X", icon: FaXTwitter },
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedin },
  { href: "https://youtube.com", label: "YouTube", icon: FaYoutube },
  { href: "https://threads.net", label: "Threads", icon: FaThreads },
  { href: "https://whatsapp.com", label: "WhatsApp", icon: FaWhatsapp },
];

export default function Navbar({
  onOpenStreak,
  onOpenSignIn,
  onOpenTrial,
  onOpenDashboard,
}: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  // Mega-menu and interaction states
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>(LANGUAGES[0]);

  const navContainerRef = useRef<HTMLDivElement | null>(null);
  const langRef = useRef<HTMLDivElement | null>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(null);
        setMobileOpen(false);
        setLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape key closes menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
        setLangOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Toggle mega dropdown
  const toggleMenu = (label: string, hasMenu: boolean) => {
    if (!hasMenu) {
      setOpenMenu(null);
      return;
    }
    setLangOpen(false);
    setOpenMenu((current) => (current === label ? null : label));
  };

  // Cross-page anchor resolver
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setOpenMenu(null);
    setMobileOpen(false);
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  // Action handlers
  const handleSignIn = () => {
    setOpenMenu(null);
    setMobileOpen(false);
    if (onOpenSignIn) {
      onOpenSignIn();
    } else {
      router.push("/api/auth/signin");
    }
  };

  const handleTrial = () => {
    setOpenMenu(null);
    setMobileOpen(false);
    if (onOpenTrial) {
      onOpenTrial();
    } else if (pathname === "/") {
      const anchor = document.getElementById("trial-anchor");
      if (anchor) {
        anchor.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/onboarding");
      }
    } else {
      router.push("/onboarding");
    }
  };

  const handleDashboard = () => {
    setOpenMenu(null);
    setMobileOpen(false);
    if (onOpenDashboard) {
      onOpenDashboard();
    } else {
      router.push("/dashboard");
    }
  };

  const activeMenu = openMenu ? MEGA_MENUS[openMenu] : null;

  return (
    <header className="sticky top-0 z-40 w-full flex justify-center px-3 sm:px-6 py-3 sm:py-4 transition-all duration-300">
      <div ref={navContainerRef} className="w-full max-w-7xl">
        <motion.div
          layout
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-2xl border border-[#757761]/25 bg-white/90 text-[#121815] shadow-xl backdrop-blur-xl dark:border-[#757761]/35 dark:bg-[#121815]/95 dark:text-[#E2E7DE] dark:shadow-2xl dark:shadow-black/60 transition-colors"
        >
          {/* Top Navbar Row */}
          <div className="flex items-center justify-between gap-6 px-5 py-3.5 sm:px-7">
            {/* 1. Left: Uchitatvam Brand Mark */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/"
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                  setOpenMenu(null);
                  setMobileOpen(false);
                }}
                className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7fe72] rounded-xl p-0.5"
                aria-label="Uchitatvam Home"
              >
                <Image
                  src="/uchitatvam-logo.svg"
                  alt="Uchitatvam"
                  width={36}
                  height={36}
                  priority
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 sm:w-20 sm:h-20 object-contain shrink-0"
                />
                <span className="font-bold hidden md:block text-lg sm:text-xl tracking-tight text-[#121815] dark:text-white font-sans">
                  Uchitatvam
                </span>
              </Link>

              {/* Streak Trigger */}
              {onOpenStreak && (
                <button
                  type="button"
                  onClick={onOpenStreak}
                  title="View Active Streak Adherence"
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f7fe72]/15 border border-[#f7fe72]/30 text-xs font-mono font-bold text-[#f7fe72] hover:bg-[#f7fe72]/25 transition-all cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 fill-[#f7fe72] text-[#f7fe72]" />
                  <span>14D STREAK</span>
                </button>
              )}
            </div>

            {/* 2. Center: Desktop Clean Single-Line Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {NAV_ITEMS.map((item) => {
                const isOpen = openMenu === item.label;
                const Icon = item.icon;

                if (!item.hasMenu) {
                  return (
                    <a
                      key={item.label}
                      href={item.href ?? "#"}
                      onClick={(e) => handleAnchorClick(e, item.href ?? "#")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold text-[#505445] hover:text-[#121815] hover:bg-black/5 dark:text-[#CBD2C7] dark:hover:text-[#f7fe72] dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 opacity-70" />
                      <span>{item.label}</span>
                    </a>
                  );
                }

                return (
                  <button
                    key={item.label}
                    onClick={() => toggleMenu(item.label, item.hasMenu)}
                    aria-expanded={isOpen}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all cursor-pointer",
                      isOpen
                        ? "bg-black/5 text-[#121815] dark:bg-white/10 dark:text-[#f7fe72]"
                        : "text-[#505445] hover:text-[#121815] hover:bg-black/5 dark:text-[#CBD2C7] dark:hover:text-[#f7fe72] dark:hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 opacity-70" />
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-300 opacity-60",
                        isOpen && "rotate-180 opacity-100"
                      )}
                    />
                  </button>
                );
              })}

              <Link
                href="/leaderboards"
                className={cn(
                  "hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all",
                  pathname === "/leaderboards"
                    ? "bg-[#757761]/25 text-[#121815] dark:text-[#f7fe72] border border-[#757761]/50"
                    : "text-[#505445] hover:text-[#121815] hover:bg-black/5 dark:text-[#CBD2C7] dark:hover:text-[#f7fe72] dark:hover:bg-white/5"
                )}
              >
                <Trophy className="w-3.5 h-3.5 text-[#7A5A00] dark:text-[#f7fe72]" />
                <span>Leaderboards</span>
              </Link>

              <Link
                href="/rewards"
                className={cn(
                  "hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all",
                  pathname === "/rewards"
                    ? "bg-[#f4e76e]/20 text-[#7A5A00] dark:text-[#f4e76e] border border-[#f4e76e]/40"
                    : "text-[#505445] hover:text-[#121815] hover:bg-black/5 dark:text-[#CBD2C7] dark:hover:text-[#f7fe72] dark:hover:bg-white/5"
                )}
              >
                <Award className="w-3.5 h-3.5 text-[#7A5A00] dark:text-[#f4e76e]" />
                <span>Rewards</span>
              </Link>

              <Link
                href="/#health-sync-section"
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold text-[#505445] hover:text-[#121815] hover:bg-black/5 dark:text-[#CBD2C7] dark:hover:text-[#f7fe72] dark:hover:bg-white/5 transition-colors whitespace-nowrap"
                title="Google Fit, Apple Health & Strava Biometrics"
              >
                <Activity className="w-3.5 h-3.5 text-[#7A5A00] dark:text-[#f7fe72]" />
                <span>Health Sync</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </Link>
            </nav>

            {/* 3. Right Utility Cluster: Theme Toggle + Language + Auth + High-Voltage CTA */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              
              {/* Desktop Quick 1-Click Theme Switcher */}
              <div className="hidden sm:block">
                <ThemeToggleQuick />
              </div>

              {/* Language Selector Popover (Desktop) */}
              <div className="relative hidden md:block" ref={langRef}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenMenu(null);
                    setLangOpen((v) => !v);
                  }}
                  aria-expanded={langOpen}
                  aria-label="Select Athlete Locale"
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold transition-colors cursor-pointer border",
                    langOpen
                      ? "bg-black/5 text-[#121815] border-[#757761]/40 dark:bg-white/10 dark:text-white"
                      : "text-[#505445] hover:text-[#121815] dark:text-[#A0A594] dark:hover:text-white border-transparent hover:border-[#757761]/30"
                  )}
                >
                  <Languages className="h-3.5 w-3.5 text-[#757761]" />
                  <span>{language.code}</span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-300 opacity-60",
                      langOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute right-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-2xl border border-[#757761]/25 bg-white text-[#121815] p-1.5 shadow-2xl dark:border-[#757761]/35 dark:bg-[#121815] dark:text-[#E2E7DE] dark:shadow-black/60"
                    >
                      <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#757761] border-b border-[#757761]/20 mb-1">
                        Select Local Dialect
                      </div>
                      {LANGUAGES.map((lng) => (
                        <button
                          key={lng.code}
                          type="button"
                          onClick={() => {
                            setLanguage(lng);
                            setLangOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer",
                            lng.code === language.code
                              ? "bg-[#F4F6F5] text-[#7A5A00] dark:bg-[#18201A] dark:text-[#f7fe72]"
                              : "text-[#505445] hover:bg-black/5 dark:text-[#CBD2C7] dark:hover:bg-white/5"
                          )}
                        >
                          <div className="flex flex-col">
                            <span>{lng.label}</span>
                            <span className="text-[10px] text-[#A0A594]">{lng.sub}</span>
                          </div>
                          {lng.code === language.code && (
                            <Check className="h-4 w-4 text-[#7A5A00] dark:text-[#f7fe72]" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Session Profile / Sign In */}
              {session?.user ? (
                <div className="hidden sm:flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleDashboard}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-[#757761]/25 dark:border-[#757761]/35 text-xs font-bold text-[#121815] dark:text-[#E2E7DE] hover:text-[#7A5A00] dark:hover:text-[#f7fe72] transition-all cursor-pointer"
                    title="Open Athlete Dashboard"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#EAEFEA] dark:bg-[#18201A] text-[#7A5A00] dark:text-[#f7fe72] border border-[#757761]/40 flex items-center justify-center text-[10px] font-black">
                      {session.user.name?.[0]?.toUpperCase() || <User className="w-3 h-3" />}
                    </div>
                    <span className="max-w-[80px] truncate text-xs">
                      {session.user.name?.split(" ")[0] || "Athlete"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => signOut({ redirect: false })}
                    className="text-xs font-semibold text-[#505445] hover:text-[#121815] dark:text-[#A0A594] dark:hover:text-white p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="hidden sm:block text-xs font-bold text-[#505445] hover:text-[#121815] dark:text-[#CBD2C7] dark:hover:text-[#f7fe72] px-2.5 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              )}

              {/* Primary High-Voltage Accent Button */}
              <button
                type="button"
                onClick={session?.user ? handleDashboard : handleTrial}
                className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] hover:brightness-110 text-[#0B0E0C] text-xs font-black tracking-wide shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>{session?.user ? "Dashboard" : "Start Trial"}</span>
                <ArrowRight className="w-3 h-3 text-[#0B0E0C] transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>

              {/* Mobile / Tablet Menu Button */}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden p-2 rounded-xl text-[#CBD2C7] hover:bg-white/10 border border-[#757761]/30 transition-all cursor-pointer"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Desktop Mega Dropdown (Animated with Motion layout) */}
          <AnimatePresence initial={false}>
            {activeMenu && (
              <motion.div
                key={openMenu}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="hidden overflow-hidden lg:block border-t border-[#757761]/20 bg-white/95 text-[#121815] dark:border-[#757761]/30 dark:bg-[#0B0E0C]/95 dark:text-[#E2E7DE] transition-colors"
              >
                <div
                  className={cn(
                    "grid gap-6 px-8 pb-7 pt-5",
                    activeMenu.columns.length >= 3
                      ? "grid-cols-[repeat(3,minmax(0,1fr))_auto]"
                      : "grid-cols-[1fr_1fr_auto]"
                  )}
                >
                  {activeMenu.columns.map((col, colIdx) => (
                    <div key={col.eyebrow} className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-fit rounded-lg border border-[#757761]/25 bg-black/5 dark:bg-[#18201A] dark:border-[#757761]/30 px-2.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#505445] dark:text-[#A0A493]">
                          {col.eyebrow}
                        </span>
                        {colIdx === 0 && activeMenu.badgeText && (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#7A5A00] dark:text-[#f7fe72]">
                            <Sparkles className="w-3 h-3" />
                            {activeMenu.badgeText}
                          </span>
                        )}
                      </div>

                      <ul className="flex flex-col gap-2">
                        {col.links.map((link) => (
                          <li key={link.label}>
                            <a
                              href={link.href}
                              onClick={(e) => handleAnchorClick(e, link.href)}
                              className="group block rounded-xl p-2.5 transition-all hover:bg-black/5 dark:hover:bg-[#18201A] border border-transparent hover:border-[#757761]/35 shadow-xs"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "text-sm font-bold transition-colors group-hover:text-[#7A5A00] dark:group-hover:text-[#f7fe72]",
                                    link.active
                                      ? "text-[#7A5A00] dark:text-[#f7fe72]"
                                      : "text-[#121815] dark:text-[#E2E7DE]"
                                  )}
                                >
                                  {link.label}
                                </span>
                                {link.badge && (
                                  <span className="rounded-md bg-[#f7fe72] text-[#0B0E0C] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider">
                                    {link.badge}
                                  </span>
                                )}
                              </div>
                              {link.desc && (
                                <p className="text-xs text-[#505445] dark:text-[#A0A493] mt-0.5 line-clamp-1">
                                  {link.desc}
                                </p>
                              )}
                            </a>
                          </li>
                        ))}
                      </ul>

                      {/* Footer links under the second column */}
                      {colIdx === activeMenu.columns.length - 1 && activeMenu.footerLinks && (
                        <div className="mt-auto flex flex-col gap-1.5 pt-4 border-t border-[#757761]/25">
                          {activeMenu.footerLinks.map((item) => (
                            <a
                              key={item.label}
                              href={item.href}
                              onClick={(e) => handleAnchorClick(e, item.href)}
                              className="flex items-center gap-1 text-xs font-medium text-[#505445] dark:text-[#A0A493] hover:text-[#7A5A00] dark:hover:text-[#f7fe72] transition-colors"
                            >
                              <ArrowRight className="w-3 h-3 text-[#7A5A00] dark:text-[#f7fe72]" />
                              <span>{item.label}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Mega Menu Visual Preview Card */}
                  <div className="relative hidden h-64 w-80 flex-col justify-end overflow-hidden rounded-2xl md:flex border border-[#757761]/35 shadow-lg group">
                    <img
                      src={activeMenu.image.src}
                      alt={activeMenu.image.alt}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E0C] via-[#0B0E0C]/50 to-transparent" />
                    {activeMenu.imageCaption && (
                      <div className="relative z-10 p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#f7fe72] uppercase tracking-wider">
                          <Activity className="w-3 h-3" />
                          <span>Uchitatvam Verified Engine</span>
                        </div>
                        <p className="text-xs font-semibold text-white leading-relaxed">
                          {activeMenu.imageCaption}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Community Strip */}
                {activeMenu.showSocials && (
                  <div className="flex items-center justify-between border-t border-[#757761]/20 px-8 py-3 bg-[#F4F6F5] dark:border-[#757761]/25 dark:bg-[#0B0E0C]/80">
                    <div className="flex items-center gap-2 text-xs text-[#505445] dark:text-[#A0A493]">
                      <HeartHandshake className="w-3.5 h-3.5 text-[#7A5A00] dark:text-[#f7fe72]" />
                      <span>Join 12,000+ athletes across Delhi NCR</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {SOCIALS.map(({ href, label, icon: Icon }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={label}
                          className="text-[#505445] dark:text-[#A0A493] hover:text-[#7A5A00] dark:hover:text-[#f7fe72] transition-colors p-1"
                        >
                          <Icon className="h-4 w-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Panel Accordion (Zero Overlay, Built into Island) */}
          <AnimatePresence initial={false}>
            {mobileOpen && (
              <motion.div
                key="mobile-panel"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden lg:hidden border-t border-[#757761]/20 px-5 py-4 space-y-4 bg-[#F8FAF8] text-[#121815] dark:border-[#757761]/25 dark:bg-[#121815] dark:text-[#E2E7DE] transition-colors"
              >
                {/* Primary Nav Accordions */}
                <div className="flex flex-col gap-1.5">
                  {NAV_ITEMS.map((item) => {
                    const isExpanded = openMenu === item.label;
                    const Icon = item.icon;

                    if (!item.hasMenu) {
                      return (
                        <a
                          key={item.label}
                          href={item.href ?? "#"}
                          onClick={(e) => handleAnchorClick(e, item.href ?? "#")}
                          className="flex items-center justify-between rounded-xl p-3 text-xs font-bold text-[#E2E7DE] hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-[#757761]" />
                            <span>{item.label}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-[#757761]" />
                        </a>
                      );
                    }

                    return (
                      <div key={item.label} className="rounded-xl overflow-hidden border border-[#757761]/25">
                        <button
                          type="button"
                          onClick={() => toggleMenu(item.label, true)}
                          className="flex w-full items-center justify-between p-3 text-left text-xs font-bold text-[#E2E7DE] bg-white/5 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-[#f7fe72]" />
                            <span>{item.label}</span>
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform text-[#757761]",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>

                        {isExpanded && activeMenu && (
                          <div className="p-3 bg-[#18201A] space-y-3 border-t border-[#757761]/25">
                            {activeMenu.columns.map((c) => (
                              <div key={c.eyebrow} className="space-y-1">
                                <div className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#f7fe72]">
                                  {c.eyebrow}
                                </div>
                                <div className="space-y-1">
                                  {c.links.map((link) => (
                                    <a
                                      key={link.label}
                                      href={link.href}
                                      onClick={(e) => handleAnchorClick(e, link.href)}
                                      className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-[#CBD2C7] hover:bg-white/5 transition-colors"
                                    >
                                      <span>{link.label}</span>
                                      {link.badge && (
                                        <span className="rounded-md bg-[#f7fe72] text-[#0B0E0C] px-1.5 py-0.5 text-[9px] font-black uppercase">
                                          {link.badge}
                                        </span>
                                      )}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Direct Links: Leaderboards & Rewards */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#757761]/20">
                  <Link
                    href="/leaderboards"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-black/5 dark:bg-[#18201A] border border-[#757761]/25 dark:border-[#757761]/35 text-xs font-bold text-[#7A5A00] dark:text-[#f7fe72]"
                  >
                    <Trophy className="w-3.5 h-3.5 text-[#7A5A00] dark:text-[#f7fe72]" />
                    <span>Leaderboards</span>
                  </Link>

                  <Link
                    href="/rewards"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#757761]/25 dark:border-[#757761]/35 text-xs font-bold text-[#121815] dark:text-[#E2E7DE]"
                  >
                    <Award className="w-3.5 h-3.5 text-[#7A5A00] dark:text-[#f4e76e]" />
                    <span>Rewards</span>
                  </Link>
                </div>

                {/* Mobile Theme Switcher Glide */}
                <div className="pt-2 border-t border-[#757761]/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#505445] dark:text-[#757761]">
                      Theme Mode / रूपरेखा
                    </span>
                    <span className="text-[10px] font-mono text-[#7A5A00] dark:text-[#f7fe72]">
                      Manual &amp; System Sync
                    </span>
                  </div>
                  <div className="flex justify-center w-full">
                    <ThemeToggleGlide size="sm" className="w-full max-w-xs" />
                  </div>
                </div>

                {/* Mobile Language Switcher */}
                <div className="pt-2 border-t border-[#757761]/20 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#505445] dark:text-[#757761]">
                    Language / बोली
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {LANGUAGES.map((lng) => (
                      <button
                        key={lng.code}
                        type="button"
                        onClick={() => setLanguage(lng)}
                        className={cn(
                          "rounded-lg border py-1.5 text-center text-xs font-mono font-bold transition-all cursor-pointer",
                          lng.code === language.code
                            ? "border-[#7A5A00] bg-[#7A5A00] text-white dark:border-[#f7fe72] dark:bg-[#f7fe72] dark:text-[#0B0E0C]"
                            : "border-[#757761]/25 text-[#505445] bg-black/5 dark:border-[#757761]/35 dark:text-[#CBD2C7] dark:bg-white/5"
                        )}
                      >
                        {lng.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Session Status & CTA */}
                <div className="pt-2 border-t border-[#757761]/20 space-y-2">
                  {session?.user ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[#757761]/20 dark:border-[#757761]/35">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[#EAEFEA] dark:bg-[#18201A] text-[#7A5A00] dark:text-[#f7fe72] border border-[#757761]/40 flex items-center justify-center text-xs font-black shrink-0">
                          {session.user.name?.[0]?.toUpperCase() || <User className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs font-bold text-[#121815] dark:text-[#E2E7DE] truncate">
                          {session.user.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={handleDashboard}
                          className="px-2.5 py-1 rounded-lg bg-[#757761]/30 text-[11px] font-bold text-[#f7fe72]"
                        >
                          Dashboard
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileOpen(false);
                            signOut({ redirect: false });
                          }}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                          title="Sign Out"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={handleSignIn}
                        className="py-2.5 text-center text-xs font-bold text-[#E2E7DE] bg-white/5 hover:bg-white/10 border border-[#757761]/35 rounded-xl transition-colors cursor-pointer"
                      >
                        Sign In
                      </button>

                      <button
                        type="button"
                        onClick={handleTrial}
                        className="py-2.5 text-center text-xs font-black text-[#0B0E0C] bg-gradient-to-r from-[#f7fe72] to-[#f4e76e] rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        Start Trial
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
}
