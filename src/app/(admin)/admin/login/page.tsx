"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  Terminal,
  Database,
  CheckCircle2,
} from "lucide-react";
import PotatoFitLogo from "@/components/PotatoFitLogo";

function AdminLoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("neerajrekwar817@gmail.com");
  const [password, setPassword] = useState("SecretPass123-");
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
        callbackUrl: callbackUrl || "/admin",
      });

      if (res?.error) {
        setErrorMessage("Invalid administrator credentials. Please check your credentials or run `npm run admin:seed`.");
        setIsLoading(false);
      } else {
        window.location.href = callbackUrl || "/admin";
      }
    } catch {
      setErrorMessage("An unexpected authentication error occurred. Please try again.");
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
        callbackUrl: callbackUrl || "/admin",
      });

      if (res?.error) {
        setErrorMessage("Administrator authentication failed. Please verify admin record.");
        setIsLoading(false);
      } else {
        window.location.href = callbackUrl || "/admin";
      }
    } catch {
      setErrorMessage("Authentication error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#080B09] text-[#E2E7DE] p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#A0A493] hover:text-[#f7fe72] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public App</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#141A16] border border-[#757761]/35 text-[#34d399]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            Proxy Secured
          </span>
          <span className="text-[10px] font-mono text-[#f7fe72] bg-[#1A231D] border border-[#757761]/30 px-2 py-0.5 rounded font-bold">
            Admin v2.6
          </span>
        </div>
      </div>

      {/* Main Admin Card */}
      <div className="max-w-md w-full mx-auto my-6 sm:my-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1310] border border-[#757761]/30 shadow-2xl space-y-6">
          {/* Logo & Headline */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-3">
              <PotatoFitLogo size="md" variant="dark" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#18211C] border border-[#757761]/40 text-[#f7fe72] font-mono text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#f7fe72]" />
              <span>Administrative Gatekeeper</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Control Center Sign In
            </h1>
            <p className="text-xs text-[#A0A493]">
              Authenticate to manage blog articles, categories, workout protocols, telemetry, and platform admins.
            </p>
          </div>

          {/* Database Integration Pill */}
          <div className="p-2.5 rounded-xl bg-[#141A16] border border-[#757761]/25 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#34d399]" />
              <span className="text-[11px] font-mono text-[#CBD2C7]">Neon PostgreSQL Engine</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#34d399] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              Active
            </span>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-mono font-semibold text-[#A0A493] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="dev.neerajrekwar@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-mono font-semibold text-[#A0A493]">
                  Admin Password
                </label>
                <span className="text-[10px] font-mono text-[#757761]">Default: fitmeal2026</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72] transition-colors"
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
                  <span>Verifying Admin Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Admin Credentials */}
          <div className="pt-4 border-t border-[#757761]/25 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#757761]">
              <span>QUICK 1-CLICK ADMIN ROLES</span>
              <Sparkles className="w-3 h-3 text-[#f7fe72]" />
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() =>
                  handleQuickAdminLogin("neerajrekwar817@gmail.com", "SecretPass123-")
                }
                disabled={isLoading}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#141A16] hover:bg-[#1B231D] border border-[#f7fe72]/40 text-left transition-colors cursor-pointer ring-1 ring-[#f7fe72]/20"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#f7fe72]" />
                    <span>Neeraj Rekwar (Super Admin)</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#f7fe72]">
                    neerajrekwar817@gmail.com
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#0B0E0C] bg-[#f7fe72] px-2 py-0.5 rounded font-semibold">
                  1-Click Login →
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickAdminLogin("dev.neerajrekwar@gmail.com", "fitmeal2026")
                }
                disabled={isLoading}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#141A16] hover:bg-[#1B231D] border border-[#757761]/30 text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#A0A493]" />
                    <span>Dev Account (Super Admin)</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#757761]">
                    dev.neerajrekwar@gmail.com
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#f7fe72] px-2 py-0.5 rounded bg-black/40 border border-[#757761]/30">
                  Login →
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickAdminLogin("admin@uchitatvam.com", "fitmeal2026")
                }
                disabled={isLoading}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#141A16] hover:bg-[#1B231D] border border-[#757761]/30 text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#60a5fa]" />
                    <span>Uchitatvam Operations (Super Admin)</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#757761]">
                    admin@uchitatvam.com
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#f7fe72] px-2 py-0.5 rounded bg-black/40 border border-[#757761]/30">
                  Login →
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickAdminLogin("david.kim@fitmeal.fit", "fitmeal2026")
                }
                disabled={isLoading}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#141A16] hover:bg-[#1B231D] border border-[#757761]/30 text-left transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#34d399]" />
                    <span>David Kim (Performance Admin)</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#757761]">
                    david.kim@fitmeal.fit
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#f7fe72] px-2 py-0.5 rounded bg-black/40 border border-[#757761]/30">
                  Login →
                </span>
              </button>
            </div>
          </div>

          {/* Terminal CLI Instructions */}
          <div className="p-3 rounded-2xl bg-[#141A16] border border-[#757761]/25 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-white">
              <Terminal className="w-3.5 h-3.5 text-[#f7fe72]" />
              <span>Terminal CLI Admin Commands</span>
            </div>
            <div className="font-mono text-[10px] text-[#A0A493] space-y-1 bg-black/40 p-2.5 rounded-lg border border-[#757761]/20 overflow-x-auto">
              <div className="text-[#34d399]"># Seed default super admins</div>
              <div>npm run admin:seed</div>
              <div className="text-[#34d399] mt-1"># List registered administrators</div>
              <div>npm run admin:manage list</div>
              <div className="text-[#34d399] mt-1"># Create a new administrator</div>
              <div>npm run admin:manage create alex@uchitatvam.com &quot;Alex Roe&quot; admin</div>
              <div className="text-[#34d399] mt-1"># Update administrator role or status</div>
              <div>npm run admin:manage update alex@uchitatvam.com --role=super_admin</div>
              <div className="text-[#34d399] mt-1"># Delete administrator</div>
              <div>npm run admin:manage delete alex@uchitatvam.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-[#757761] font-mono">
        © 2026 Uchitatvam Inc. Administrative Gateway • Protected via Proxy Guard
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#080B09] text-[#E2E7DE]">
          <Loader2 className="w-6 h-6 animate-spin text-[#f7fe72]" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
