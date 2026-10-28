"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
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
  ExternalLink,
  LogOut,
  ShieldCheck,
  Trophy,
  Store,
  Image as ImageIcon,
  Globe,
  MessageSquare,
  PanelLeftClose,
  PanelLeft,
  X,
  Menu,
  Terminal,
} from "lucide-react";
import PotatoFitLogo from "@/components/PotatoFitLogo";

// =============================================================================
// CONTEXT & TYPES
// =============================================================================

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  isCollapsed: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// =============================================================================
// NAVIGATION SECTIONS & ITEMS
// =============================================================================

export interface NavItemConfig {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export interface NavSectionConfig {
  title: string;
  items: NavItemConfig[];
}

export const ADMIN_NAV_SECTIONS: NavSectionConfig[] = [
  {
    title: "Core Operations",
    items: [
      {
        label: "Overview",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        label: "Blog Articles",
        href: "/admin/blog",
        icon: FileText,
      },
      {
        label: "Categories",
        href: "/admin/categories",
        icon: Tags,
      },
      {
        label: "Administrators",
        href: "/admin/admins",
        icon: ShieldCheck,
        badge: "Neon",
      },
    ],
  },
  {
    title: "Athletic Engine",
    items: [
      {
        label: "Athletes & Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        label: "Workout Protocols",
        href: "/admin/protocols",
        icon: Dumbbell,
      },
      {
        label: "Quests & Challenges",
        href: "/admin/quests",
        icon: Trophy,
      },
      {
        label: "Vendors & Grocers",
        href: "/admin/vendors",
        icon: Store,
      },
    ],
  },
  {
    title: "Growth & Telemetry",
    items: [
      {
        label: "Media Assets",
        href: "/admin/media",
        icon: ImageIcon,
      },
      {
        label: "SEO & Social",
        href: "/admin/seo",
        icon: Globe,
      },
      {
        label: "Inquiries & Inbox",
        href: "/admin/inquiries",
        icon: MessageSquare,
      },
      {
        label: "Platform Telemetry",
        href: "/admin/analytics",
        icon: BarChart3,
      },
      {
        label: "Platform Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

// =============================================================================
// SIDEBAR PROVIDER
// =============================================================================

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === "undefined") return defaultOpen;
    try {
      const saved = localStorage.getItem("admin_sidebar_open");
      if (saved !== null) return saved === "true";
    } catch {
      // ignore
    }
    return defaultOpen;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("admin_sidebar_open", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const toggleMobile = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  // Keyboard shortcut: Cmd+B (macOS) or Ctrl+B (Windows/Linux)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        toggleSidebar,
        isMobileOpen,
        setIsMobileOpen,
        toggleMobile,
        isCollapsed: !isOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

// =============================================================================
// HEROUI-STYLE ADMIN SIDEBAR
// =============================================================================

export function AdminSidebar() {
  const { toggleSidebar, isMobileOpen, setIsMobileOpen, isCollapsed } =
    useSidebar();
  const pathname = usePathname();
  const { data: session } = useSession();

  const userEmail = session?.user?.email || "neerajrekwar817@gmail.com";
  const userName = session?.user?.name || "Neeraj Rekwar";
  const userRole = (session?.user as { role?: string })?.role || "super_admin";

  const isExactOrChild = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Component (HeroUI Pro Anatomy) */}
      <aside
        data-state={isCollapsed ? "collapsed" : "expanded"}
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 h-screen max-h-screen bg-[#EAEFEA] dark:bg-[#0B0E0C] border-r border-[#757761]/25 flex flex-col overflow-hidden transition-all duration-200 ease-in-out ${
          isCollapsed ? "md:w-18" : "md:w-64"
        } ${
          isMobileOpen
            ? "translate-x-0 w-64 shadow-2xl"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* =================================================================== */}
        {/* SIDEBAR HEADER (Fixed at top, never scrolls)                         */}
        {/* =================================================================== */}
        <div className="shrink-0 h-16 px-4 border-b border-[#757761]/20 bg-[#EAEFEA] dark:bg-[#0B0E0C] flex items-center justify-between z-10">
          {!isCollapsed ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5 min-w-0">
                <PotatoFitLogo size="sm" variant="dark" />
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#1A231D] text-[#f7fe72] border border-[#757761]/30 font-semibold truncate">
                    Ops Center
                  </span>
                  <span className="text-[10px] font-mono text-[#757761]">v2.6</span>
                </div>
              </div>

              {/* Desktop Collapse Trigger */}
              <button
                type="button"
                onClick={toggleSidebar}
                className="hidden md:flex p-1.5 rounded-lg text-[#505445] dark:text-[#A0A493] hover:text-[#121815] dark:hover:text-[#f7fe72] hover:bg-[#757761]/15 transition-colors cursor-pointer"
                title="Collapse Sidebar (Cmd+B)"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-[#A0A493] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Collapsed Rail Header */
            <div className="flex flex-col items-center justify-center w-full gap-2">
              <button
                type="button"
                onClick={toggleSidebar}
                className="p-2 rounded-xl text-[#505445] dark:text-[#f7fe72] hover:bg-[#757761]/20 transition-colors cursor-pointer"
                title="Expand Sidebar (Cmd+B)"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* SIDEBAR CONTENT (Scrollable middle section with custom scrollbar)   */}
        {/* =================================================================== */}
        <div className="flex-1 min-h-0 overflow-y-auto px-2 py-3 space-y-4 overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {ADMIN_NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-1">
              {/* Section Header (Hidden in collapsed mode) */}
              {!isCollapsed && (
                <div className="px-3 pt-1 pb-1 text-[10px] font-mono uppercase tracking-wider text-[#757761] font-semibold">
                  {section.title}
                </div>
              )}

              {/* Menu Items */}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isExactOrChild(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      title={isCollapsed ? item.label : undefined}
                      className={`group relative flex items-center ${
                        isCollapsed ? "justify-center px-2 py-2.5" : "justify-between px-3 py-2"
                      } rounded-xl text-xs font-medium transition-all ${
                        active
                          ? "bg-[#18211C] text-[#f7fe72] border border-[#757761]/40 font-semibold shadow-xs"
                          : "text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15 hover:text-[#121815] dark:hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            active
                              ? "text-[#f7fe72]"
                              : "text-[#757761] group-hover:text-[#121815] dark:group-hover:text-white"
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </div>

                      {/* Trailing Badge or Indicator */}
                      {!isCollapsed && (
                        <div>
                          {item.badge ? (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#141A16] text-[#34d399] border border-[#34d399]/30">
                              {item.badge}
                            </span>
                          ) : active ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f7fe72]" />
                          ) : null}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Quick Terminal CLI Info (Expanded only) */}
          {!isCollapsed && (
            <div className="p-3 mx-1 rounded-xl bg-white/70 dark:bg-[#141A16] border border-[#757761]/25 text-xs space-y-1.5 mt-2">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#121815] dark:text-white">
                <Terminal className="w-3.5 h-3.5 text-[#f7fe72]" />
                <span>CLI Automation</span>
              </div>
              <p className="text-[10px] text-[#505445] dark:text-[#A0A493] leading-relaxed">
                Run <code className="px-1 py-0.5 rounded bg-black/20 text-[#f7fe72] font-mono">npm run admin:manage</code> for shell tasks.
              </p>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* SIDEBAR FOOTER (HeroUI Compact with User Menu - ALWAYS FIXED!)     */}
        {/* =================================================================== */}
        <div
          className={`shrink-0 border-t border-[#757761]/20 bg-[#E2E8E2]/90 dark:bg-[#0E1310] backdrop-blur-md z-10 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_12px_rgba(0,0,0,0.4)] ${
            isCollapsed ? "p-2 space-y-2 flex flex-col items-center" : "p-3.5 space-y-2.5"
          }`}
        >
          {!isCollapsed ? (
            <>
              {/* Admin Profile Details */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#1F2922] border border-[#757761]/35 flex items-center justify-center text-[#f7fe72] font-bold text-xs shrink-0 shadow-xs">
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

              {/* Utility Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-[#757761]/15">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-[11px] text-[#505445] dark:text-[#A0A493] hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors"
                >
                  <span>Live Website</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] text-[#757761] hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                  title="Sign Out of Admin Console"
                >
                  <span>Sign Out</span>
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            /* Collapsed Rail Footer with User Tooltip */
            <>
              <div
                className="w-8 h-8 rounded-full bg-[#1F2922] border border-[#757761]/35 flex items-center justify-center text-[#f7fe72] font-bold text-xs shrink-0 cursor-default"
                title={`${userName} (${userRole}) - ${userEmail}`}
              >
                {userName.charAt(0)}
              </div>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 rounded-xl text-[#757761] hover:text-red-400 hover:bg-red-950/20 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

// =============================================================================
// MOBILE HEADER BAR TRIGGER COMPONENT
// =============================================================================

export function AdminMobileHeader() {
  const { toggleMobile } = useSidebar();

  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#EAEFEA] dark:bg-[#0E1310] border-b border-[#757761]/25 z-40 sticky top-0">
      <div className="flex items-center gap-2">
        <PotatoFitLogo size="sm" variant="dark" />
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#1D2520] text-[#f7fe72] border border-[#757761]/35">
          Admin
        </span>
      </div>
      <button
        type="button"
        onClick={toggleMobile}
        className="p-2 rounded-lg text-[#121815] dark:text-white hover:bg-[#757761]/20 transition-colors"
        aria-label="Toggle admin navigation"
      >
        <Menu className="w-5 h-5" />
      </button>
    </div>
  );
}
