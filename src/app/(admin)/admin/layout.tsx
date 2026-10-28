"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Tags,
  Users,
  Dumbbell,
  BarChart3,
  Settings,
  ArrowUpRight,
  Menu,
  X,
  LogOut,
  Sparkles,
  ExternalLink,
  Terminal,
} from "lucide-react";
import PotatoFitLogo from "@/components/PotatoFitLogo";
import ThemeToggleGlide from "@/components/ThemeToggleGlide";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: "/admin",
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    label: "Blog Articles",
    href: "/admin/blog",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: <Tags className="w-4 h-4" />,
  },
  {
    label: "Athletes & Users",
    href: "/admin/users",
    icon: <Users className="w-4 h-4" />,
  },
  {
    label: "Workout Protocols",
    href: "/admin/protocols",
    icon: <Dumbbell className="w-4 h-4" />,
  },
  {
    label: "Platform Telemetry",
    href: "/admin/analytics",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    label: "Platform Settings",
    href: "/admin/settings",
    icon: <Settings className="w-4 h-4" />,
  },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If visiting /admin/login, render standalone login view without administrative frame
  if (pathname === "/admin/login" || pathname?.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  const userEmail = session?.user?.email || "dev.neerajrekwar@gmail.com";
  const userName = session?.user?.name || "Neeraj Rekwar";
  const userRole = (session?.user as { role?: string })?.role || "super_admin";

  const isExactOrChild = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6F5] dark:bg-[#080B09] text-[#121815] dark:text-[#E2E7DE] transition-colors">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#EAEFEA] dark:bg-[#0E1310] border-b border-[#757761]/25 z-40 sticky top-0">
        <div className="flex items-center gap-2">
          <PotatoFitLogo size="sm" variant="dark" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#1D2520] text-[#f7fe72] border border-[#757761]/35">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggleGlide size="sm" />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#121815] dark:text-white hover:bg-[#757761]/20 transition-colors"
            aria-label="Toggle admin navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Admin Desktop Sidebar */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 bg-[#EAEFEA] dark:bg-[#0B0E0C] border-r border-[#757761]/25 flex flex-col justify-between transition-transform duration-200 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top brand & navigation */}
        <div className="p-4 space-y-6">
          {/* Brand header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#757761]/20">
            <div>
              <div className="flex items-center gap-2">
                <PotatoFitLogo size="sm" variant="dark" />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#1A231D] text-[#f7fe72] border border-[#757761]/30 font-semibold">
                  Ops Management
                </span>
                <span className="text-[10px] font-mono text-[#757761]">v2.6</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-[#A0A493] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#757761]">
              Management Modules
            </div>
            {NAV_ITEMS.map((item) => {
              const active = isExactOrChild(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? "bg-[#18211C] text-[#f7fe72] border border-[#757761]/40 font-semibold shadow-xs"
                      : "text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15 hover:text-[#121815] dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#f7fe72]" />}
                </Link>
              );
            })}
          </nav>

          {/* Quick Terminal Seed Info */}
          <div className="p-3 rounded-xl bg-white/70 dark:bg-[#141A16] border border-[#757761]/25 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#121815] dark:text-white">
              <Terminal className="w-3.5 h-3.5 text-[#f7fe72]" />
              <span>Terminal CLI Active</span>
            </div>
            <p className="text-[11px] text-[#505445] dark:text-[#A0A493] leading-relaxed">
              Use <code className="px-1 py-0.5 rounded bg-black/20 text-[#f7fe72] font-mono text-[10px]">npm run admin:seed</code> or <code className="px-1 py-0.5 rounded bg-black/20 text-[#f7fe72] font-mono text-[10px]">npm run admin:manage</code> to manage admins in terminal.
            </p>
          </div>
        </div>

        {/* Bottom Profile and Links */}
        <div className="p-4 border-t border-[#757761]/20 bg-[#E2E8E2]/60 dark:bg-[#0E1310] space-y-3">
          {/* Admin user info */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#1F2922] border border-[#757761]/35 flex items-center justify-center text-[#f7fe72] font-bold text-xs shrink-0">
                {userName.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#121815] dark:text-white truncate">
                  {userName}
                </div>
                <div className="text-[10px] font-mono text-[#757761] truncate">
                  {userEmail}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono uppercase bg-[#18211C] text-[#f7fe72] border border-[#757761]/30 px-1.5 py-0.5 rounded font-bold shrink-0">
              {userRole === "super_admin" ? "Super" : "Admin"}
            </span>
          </div>

          {/* Quick links & theme */}
          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[11px] text-[#505445] dark:text-[#A0A493] hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggleGlide size="sm" />
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-1.5 rounded-lg text-[#505445] dark:text-[#A0A493] hover:text-red-400 hover:bg-red-950/20 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Administrative Bar */}
        <header className="hidden md:flex items-center justify-between px-6 py-3.5 bg-white/70 dark:bg-[#0B0E0C]/80 backdrop-blur-md border-b border-[#757761]/25 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Uchitatvam Control Center
            </div>
            <span className="text-xs text-[#757761]">/</span>
            <div className="text-xs font-semibold text-[#121815] dark:text-white capitalize">
              {pathname.replace("/admin", "").replace("/", "") || "Overview"}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/blog/create"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Article</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-[#505445] dark:text-[#CBD2C7] hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors"
            >
              <span>View Public App</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#080B09] text-[#CBD2C7] text-xs font-mono">
          Loading Control Center...
        </div>
      }
    >
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Suspense>
  );
}
