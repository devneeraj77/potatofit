"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ArrowUpRight } from "lucide-react";
import {
  SidebarProvider,
  AdminSidebar,
  AdminMobileHeader,
} from "@/components/admin/AdminSidebar";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If visiting /admin/login, render standalone login view without administrative frame
  if (pathname === "/admin/login" || pathname?.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6F5] dark:bg-[#080B09] text-[#121815] dark:text-[#E2E7DE] transition-colors">
        {/* Mobile Header Bar with Hamburger Trigger */}
        <AdminMobileHeader />

        {/* HeroUI-Style Fixed Sidebar with Rail Mode & Fixed Profile Footer */}
        <AdminSidebar />

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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs cursor-pointer"
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
    </SidebarProvider>
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
