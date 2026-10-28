"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import PotatoFitLogo from "@/components/PotatoFitLogo";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    errorParam === "AdminAccessRequired"
      ? "Administrator credentials required to access the Uchitatvam Control Center."
      : ""
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (res?.error) {
        setErrorMessage("Invalid credentials. Please verify your password (minimum 6 characters).");
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleQuickAdminLogin = async (adminEmail: string, adminPass: string) => {
    setEmail(adminEmail);
    setPassword(adminPass);
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: adminEmail,
        password: adminPass,
      });

      if (res?.error) {
        setErrorMessage("Administrator authentication failed.");
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage("Authentication error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F4F6F5] dark:bg-[#0B0E0C] text-[#121815] dark:text-[#E2E7DE] transition-colors p-4 sm:p-6 lg:p-8">
      {/* Top Bar with Return Link */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#505445] dark:text-[#A0A493] hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public App</span>
        </Link>
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
          Auth Service
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/30 shadow-2xl space-y-6">
          {/* Logo & Headline */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              <PotatoFitLogo size="md" variant="dark" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#121815] dark:text-white">
              {callbackUrl.includes("/admin")
                ? "Admin Control Authentication"
                : "Athlete Sign In"}
            </h1>
            <p className="text-xs text-[#505445] dark:text-[#A0A493]">
              {callbackUrl.includes("/admin")
                ? "Verify your administrative credentials to manage protocols and blogs."
                : "Sign in to synchronize wearable biometrics and track daily quests."}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-mono font-semibold text-[#505445] dark:text-[#A0A493] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="admin@uchitatvam.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono font-semibold text-[#505445] dark:text-[#A0A493] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Admin Demo Buttons */}
          <div className="pt-4 border-t border-[#757761]/25 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#757761]">
              <span>QUICK 1-CLICK ADMIN ACCESS</span>
              <Sparkles className="w-3 h-3 text-[#f7fe72]" />
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() =>
                  handleQuickAdminLogin("dev.neerajrekwar@gmail.com", "fitmeal2026")
                }
                disabled={isLoading}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] hover:bg-[#EAEFEA] dark:hover:bg-[#1B231D] border border-[#757761]/30 text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-[#121815] dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#f7fe72]" />
                    <span>Neeraj Rekwar (Super Admin)</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#757761]">
                    dev.neerajrekwar@gmail.com
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#7A5A00] dark:text-[#f7fe72] px-2 py-0.5 rounded bg-black/10 dark:bg-black/40">
                  Login →
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickAdminLogin("admin@uchitatvam.com", "fitmeal2026")
                }
                disabled={isLoading}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] hover:bg-[#EAEFEA] dark:hover:bg-[#1B231D] border border-[#757761]/30 text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-[#121815] dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#60a5fa]" />
                    <span>Uchitatvam Operations (Super Admin)</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#757761]">
                    admin@uchitatvam.com
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#7A5A00] dark:text-[#f7fe72] px-2 py-0.5 rounded bg-black/10 dark:bg-black/40">
                  Login →
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickAdminLogin("david.kim@fitmeal.fit", "fitmeal2026")
                }
                disabled={isLoading}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] hover:bg-[#EAEFEA] dark:hover:bg-[#1B231D] border border-[#757761]/30 text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-[#121815] dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
                    <span>David Kim (Head Coach / Admin)</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#757761]">
                    david.kim@fitmeal.fit
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#7A5A00] dark:text-[#f7fe72] px-2 py-0.5 rounded bg-black/10 dark:bg-black/40">
                  Login →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-[#757761] font-mono">
        © 2026 Uchitatvam Inc. All rights reserved.
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0B0E0C] text-[#E2E7DE]">
          <Loader2 className="w-6 h-6 animate-spin text-[#f7fe72]" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
