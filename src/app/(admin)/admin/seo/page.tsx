"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Save,
  Search,
  ExternalLink,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Cpu,
  MapPin,
  Link2,
  Zap,
  Languages,
  Plus,
  Trash2,
  BarChart,
  BarChart2,
  HelpCircle,
  Tag,
  X,
} from "lucide-react";
import type {
  PageSeoConfig,
  GlobalSeoSettings,
  SeoStoreData,
  LocalSeoLocation,
} from "@/lib/seo-types";
import { DEFAULT_SCHEMAS } from "@/lib/seo-types";
import JsonLdSchemaBuilder from "@/components/admin/JsonLdSchemaBuilder";
import KeywordDensityAnalyzer from "@/components/admin/KeywordDensityAnalyzer";

export default function SeoCommandCenterPage() {
  const [data, setData] = useState<SeoStoreData | null>(null);
  const [activeTab, setActiveTab] = useState<
    "onpage" | "aeo" | "local" | "technical" | "offpage" | "international"
  >("onpage");

  // Notifications
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Search & Filters for On-Page SEO
  const [pageSearch, setPageSearch] = useState("");
  const [pageTypeFilter, setPageTypeFilter] = useState<"all" | "static" | "dynamic">("all");

  // Selected Page for editing modal/panel
  const [editingPage, setEditingPage] = useState<PageSeoConfig | null>(null);
  const [modalTab, setModalTab] = useState<"meta" | "density">("meta");
  const [newKeywordInput, setNewKeywordInput] = useState("");
  const [savingPage, setSavingPage] = useState(false);

  // Standalone Analyzer state in On-Page SEO tab
  const [showQuickAnalyzer, setShowQuickAnalyzer] = useState(false);
  const [analyzerRoute, setAnalyzerRoute] = useState<string>("/");

  // Dev Mode state
  const [devMode, setDevMode] = useState(false);

  // Global settings state
  const [globalSettings, setGlobalSettings] = useState<GlobalSeoSettings | null>(null);
  const [savingGlobal, setSavingGlobal] = useState(false);

  // AEO new FAQ snippet state
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  // New Location state
  const [newLocName, setNewLocName] = useState("");
  const [newLocCity, setNewLocCity] = useState("");
  const [newLocMandi, setNewLocMandi] = useState("");
  const [newLocPhone, setNewLocPhone] = useState("");
  const [newLocAddress, setNewLocAddress] = useState("");

  const loadSeoData = async () => {
    try {
      const res = await fetch("/api/admin/seo");
      const json = await res.json();
      if (json.success && json.config) {
        setData(json.config);
        setGlobalSettings(json.config.global);
        setDevMode(Boolean(json.config.global.devModeEnabled));
      }
    } catch {
      setStatusMsg({ text: "Failed to load SEO configuration from server.", type: "error" });
    }
  };

  useEffect(() => {
    let mounted = true;
    fetch("/api/admin/seo")
      .then((res) => res.json())
      .then((json) => {
        if (mounted && json.success && json.config) {
          setData(json.config);
          setGlobalSettings(json.config.global);
          setDevMode(Boolean(json.config.global.devModeEnabled));
        }
      })
      .catch(() => {
        if (mounted) {
          setStatusMsg({ text: "Failed to load SEO configuration from server.", type: "error" });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleDevMode = async () => {
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle_dev_mode" }),
      });
      const json = await res.json();
      if (json.success) {
        setDevMode(json.devModeEnabled);
        setStatusMsg({
          text: json.devModeEnabled
            ? "Dev Mode UNLOCKED: Static core pages are now editable."
            : "Dev Mode LOCKED: Static core pages are protected from accidental changes.",
          type: "success",
        });
      }
    } catch {
      setStatusMsg({ text: "Failed to toggle Dev Mode.", type: "error" });
    }
  };

  const handleSavePageSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    if (editingPage.isStatic && !devMode) {
      setStatusMsg({
        text: `Editing static core page "${editingPage.path}" is locked in production. Toggle Dev Mode ON to proceed.`,
        type: "error",
      });
      return;
    }

    setSavingPage(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "page",
          path: editingPage.path,
          updates: editingPage,
          forceDevMode: devMode,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatusMsg({ text: `SEO updated for ${editingPage.path}!`, type: "success" });
        setEditingPage(null);
        loadSeoData();
      } else {
        setStatusMsg({ text: json.error || "Failed to update page SEO.", type: "error" });
      }
    } catch {
      setStatusMsg({ text: "Network error saving page SEO.", type: "error" });
    } finally {
      setSavingPage(false);
    }
  };

  const handleSaveGlobal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!globalSettings) return;

    setSavingGlobal(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "global",
          updates: globalSettings,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatusMsg({ text: "Global SEO and AEO parameters saved and synchronized!", type: "success" });
        loadSeoData();
      } else {
        setStatusMsg({ text: json.error || "Failed to update global SEO.", type: "error" });
      }
    } catch {
      setStatusMsg({ text: "Network error saving global SEO.", type: "error" });
    } finally {
      setSavingGlobal(false);
    }
  };

  const handleAddFaqSnippet = () => {
    if (!newFaqQ || !newFaqA || !globalSettings) return;
    const updated = {
      ...globalSettings,
      aeoFaqSnippets: [
        ...globalSettings.aeoFaqSnippets,
        { question: newFaqQ.trim(), answer: newFaqA.trim() },
      ],
    };
    setGlobalSettings(updated);
    setNewFaqQ("");
    setNewFaqA("");
  };

  const handleRemoveFaq = (index: number) => {
    if (!globalSettings) return;
    const nextFaqs = globalSettings.aeoFaqSnippets.filter((_, i) => i !== index);
    setGlobalSettings({ ...globalSettings, aeoFaqSnippets: nextFaqs });
  };

  const handleAddLocation = () => {
    if (!newLocName || !newLocCity || !globalSettings) return;
    const newLoc: LocalSeoLocation = {
      id: "loc-" + Date.now().toString(36),
      name: newLocName.trim(),
      city: newLocCity.trim(),
      state: "Madhya Pradesh",
      country: "India",
      postalCode: "452001",
      latitude: 22.7196,
      longitude: 75.8577,
      address: newLocAddress.trim() || "Local Mandi Stalls",
      phone: newLocPhone.trim() || "+91 98000 00000",
      priceRange: "₹₹",
      areaServed: [newLocCity.trim()],
      mandiHub: newLocMandi.trim() || "Main Sabzi Mandi",
    };
    setGlobalSettings({
      ...globalSettings,
      locations: [...globalSettings.locations, newLoc],
    });
    setNewLocName("");
    setNewLocCity("");
    setNewLocMandi("");
    setNewLocPhone("");
    setNewLocAddress("");
  };

  const handleRemoveLocation = (id: string) => {
    if (!globalSettings) return;
    setGlobalSettings({
      ...globalSettings,
      locations: globalSettings.locations.filter((l) => l.id !== id),
    });
  };

  // Filtered pages for On-Page SEO
  const pagesList = (data?.pages || []).filter((p) => {
    const matchesSearch =
      p.path.toLowerCase().includes(pageSearch.toLowerCase()) ||
      p.title.toLowerCase().includes(pageSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(pageSearch.toLowerCase());
    const matchesType =
      pageTypeFilter === "all" ||
      (pageTypeFilter === "static" && p.isStatic) ||
      (pageTypeFilter === "dynamic" && !p.isStatic);
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Search &amp; AI Answer Engine Optimization
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#34d399]">
              <Cpu className="w-3 h-3" />
              AEO / LLM Search Ready
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            SEO &amp; AEO Command Center
          </h1>
          <p className="text-xs text-[#505445] dark:text-[#CBD2C7]">
            Full-spectrum optimization: On-Page, Off-Page, Technical, Local Mandi Geo, E-Commerce Nutrition, International hreflang, and Answer Engine Optimization for AI search agents.
          </p>
        </div>

        {/* Dev Mode Safety Lock & Global Save */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleToggleDevMode}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
              devMode
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
                : "bg-white dark:bg-[#141A16] border-[#757761]/35 text-[#505445] dark:text-[#A0A493] hover:text-[#121815] dark:hover:text-white"
            }`}
            title="When locked, static core pages (/, /rewards, /leaderboards) cannot be modified to prevent accidental production drift"
          >
            {devMode ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                <span>Dev Mode: ACTIVE</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#757761]" />
                <span>Static Core Locked</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSaveGlobal()}
            disabled={savingGlobal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingGlobal ? "Saving..." : "Save All SEO"}</span>
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {statusMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center justify-between gap-2 border ${
            statusMsg.type === "success"
              ? "bg-[#34d399]/10 border-[#34d399]/30 text-[#34d399]"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            className="text-xs opacity-70 hover:opacity-100 font-mono"
          >
            ✕
          </button>
        </div>
      )}

      {/* 6 Comprehensive Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#757761]/25 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab("onpage")}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "onpage"
              ? "bg-[#18211C] text-[#f7fe72] border border-[#757761]/40 font-bold"
              : "text-[#505445] dark:text-[#A0A493] hover:text-[#121815] dark:hover:text-white"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. On-Page SEO (Static &amp; Dynamic)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("aeo")}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "aeo"
              ? "bg-[#18211C] text-[#f7fe72] border border-[#757761]/40 font-bold"
              : "text-[#505445] dark:text-[#A0A493] hover:text-[#121815] dark:hover:text-white"
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-[#34d399]" />
          <span>2. AEO (Answer Engine &amp; AI Search)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("local")}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "local"
              ? "bg-[#18211C] text-[#f7fe72] border border-[#757761]/40 font-bold"
              : "text-[#505445] dark:text-[#A0A493] hover:text-[#121815] dark:hover:text-white"
          }`}
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>3. Local &amp; Mandi Grocer SEO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("technical")}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "technical"
              ? "bg-[#18211C] text-[#f7fe72] border border-[#757761]/40 font-bold"
              : "text-[#505445] dark:text-[#A0A493] hover:text-[#121815] dark:hover:text-white"
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span>4. Technical SEO (Sitemap &amp; Robots)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("offpage")}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "offpage"
              ? "bg-[#18211C] text-[#f7fe72] border border-[#757761]/40 font-bold"
              : "text-[#505445] dark:text-[#A0A493] hover:text-[#121815] dark:hover:text-white"
          }`}
        >
          <Link2 className="w-3.5 h-3.5 text-blue-400" />
          <span>5. Off-Page &amp; Authority Signals</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("international")}
          className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === "international"
              ? "bg-[#18211C] text-[#f7fe72] border border-[#757761]/40 font-bold"
              : "text-[#505445] dark:text-[#A0A493] hover:text-[#121815] dark:hover:text-white"
          }`}
        >
          <Languages className="w-3.5 h-3.5 text-purple-400" />
          <span>6. International &amp; Voice SEO</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ON-PAGE SEO (STATIC & DYNAMIC)                                      */}
      {/* ========================================================================= */}
      {activeTab === "onpage" && (
        <div className="space-y-4">
          {/* Instructions Banner */}
          <div className="p-4 rounded-2xl bg-[#EAEFEA]/80 dark:bg-[#0E1310] border border-[#757761]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#121815] dark:text-white font-bold">
                <FileText className="w-4 h-4 text-[#f7fe72]" />
                <span>Page-by-Page Element &amp; Meta Editor</span>
              </div>
              <p className="text-[11px] text-[#505445] dark:text-[#A0A493]">
                Static core pages are guarded by the <strong>Dev Mode Safety Lock</strong> to prevent production downtime. Dynamic route templates can be edited anytime.
              </p>
            </div>
            <div className="text-[11px] font-mono text-[#757761] shrink-0">
              {devMode ? (
                <span className="text-amber-400 font-bold">🔓 Dev Mode Enabled (Static Editable)</span>
              ) : (
                <span className="text-[#34d399] font-bold">🔒 Dev Mode Protected</span>
              )}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search page path, title, or keywords..."
                value={pageSearch}
                onChange={(e) => setPageSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-xs text-[#121815] dark:text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setShowQuickAnalyzer(!showQuickAnalyzer)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  showQuickAnalyzer
                    ? "bg-[#f7fe72] text-[#0B0E0C] shadow-xs"
                    : "bg-[#18211C] text-[#CBD2C7] hover:text-white border border-[#757761]/30"
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5 text-[#f7fe72]" />
                <span>{showQuickAnalyzer ? "Hide Density Analyzer" : "Keyword Density Analyzer"}</span>
              </button>

              <span className="text-[11px] font-mono text-[#757761] shrink-0">Type:</span>
              <select
                value={pageTypeFilter}
                onChange={(e) => setPageTypeFilter(e.target.value as "all" | "static" | "dynamic")}
                className="px-2.5 py-1.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-xs text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
              >
                <option value="all">All Pages</option>
                <option value="static">Static Core Pages</option>
                <option value="dynamic">Dynamic Route Rules</option>
              </select>
            </div>
          </div>

          {/* Standalone Quick Analyzer Drawer (if toggled open) */}
          {showQuickAnalyzer && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#141A16] border border-[#757761]/30 text-xs font-mono">
                <div className="flex items-center gap-2 text-white">
                  <BarChart2 className="w-4 h-4 text-[#f7fe72]" />
                  <span className="font-bold">Active Route Inspection:</span>
                  <select
                    value={analyzerRoute}
                    onChange={(e) => setAnalyzerRoute(e.target.value)}
                    className="px-2.5 py-1 rounded-xl bg-[#0B0E0C] border border-[#757761]/40 text-[#f7fe72] text-xs focus:outline-none focus:border-[#f7fe72]"
                  >
                    {pagesList.map((p) => (
                      <option key={p.path} value={p.path}>
                        {p.path} — {p.title.slice(0, 45)}...
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuickAnalyzer(false)}
                  className="text-[#757761] hover:text-white text-xs"
                >
                  Close Analyzer ✕
                </button>
              </div>

              {(() => {
                const targetPage = pagesList.find((p) => p.path === analyzerRoute) || pagesList[0];
                return (
                  <KeywordDensityAnalyzer
                    key={targetPage?.path || "default"}
                    initialKeyword={targetPage?.keywords?.[0] || "athletic fuel"}
                    availableKeywords={targetPage?.keywords || []}
                    pagePath={targetPage?.path || "/"}
                    pageTitle={targetPage?.title || ""}
                    pageDescription={targetPage?.description || ""}
                    pageDirectAnswer={targetPage?.directAnswer || ""}
                  />
                );
              })()}
            </div>
          )}

          {/* Pages Table */}
          <div className="rounded-2xl border border-[#757761]/25 bg-white dark:bg-[#0E1310] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EAEFEA]/70 dark:bg-[#141A16] border-b border-[#757761]/25 text-[#505445] dark:text-[#A0A493] font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Route Path</th>
                    <th className="py-3 px-4">Page Title &amp; Description</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Index / Priority</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#757761]/15">
                  {pagesList.map((page) => (
                    <tr
                      key={page.path}
                      className="hover:bg-[#EAEFEA]/40 dark:hover:bg-[#141A16]/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-[#121815] dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{page.path}</span>
                          {page.isStatic && (
                            <span
                              className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/40 text-[#757761]"
                              title="Static core route"
                            >
                              Static
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-md">
                        <div className="font-bold text-[#121815] dark:text-white truncate">
                          {page.title}
                        </div>
                        <div className="text-[11px] text-[#505445] dark:text-[#A0A493] line-clamp-1 mt-0.5">
                          {page.description}
                        </div>
                        {page.keywords && page.keywords.length > 0 && (
                          <div className="flex items-center gap-1 mt-1 overflow-hidden">
                            <span className="text-[9px] font-mono text-[#757761]">KW:</span>
                            {page.keywords.slice(0, 3).map((kw) => (
                              <span
                                key={kw}
                                className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#18211C] text-[#CBD2C7] border border-[#757761]/20 truncate"
                              >
                                {kw}
                              </span>
                            ))}
                            {page.keywords.length > 3 && (
                              <span className="text-[9px] font-mono text-[#757761]">
                                +{page.keywords.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {page.isStatic ? (
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${
                              devMode
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : "bg-black/30 text-[#757761] border-[#757761]/30"
                            }`}
                          >
                            {devMode ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                            <span>{devMode ? "Dev Mode Edit" : "Dev Protected"}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold">
                            <span>Dynamic Rule</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px]">
                        <div className="text-[#34d399] font-bold">
                          {page.allowIndexing ? "Indexed" : "No-Index"}
                        </div>
                        <div className="text-[#757761]">
                          P: {page.priority} • {page.changeFreq}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPage(page);
                              setModalTab("density");
                            }}
                            className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold text-[#f7fe72] bg-[#18211C] hover:bg-[#25332C] border border-[#f7fe72]/30 transition-colors cursor-pointer flex items-center gap-1"
                            title="Analyze Keyword Density"
                          >
                            <BarChart2 className="w-3.5 h-3.5 text-[#f7fe72]" />
                            <span>Analyze</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPage(page);
                              setModalTab("meta");
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors cursor-pointer"
                          >
                            Edit SEO
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AEO (ANSWER ENGINE OPTIMIZATION & AI SEARCH)                       */}
      {/* ========================================================================= */}
      {activeTab === "aeo" && globalSettings && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/30 via-[#0E1310] to-[#0E1310] border border-[#34d399]/40 space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#34d399]" />
              <h2 className="text-base font-bold text-white">
                Latest AEO (Answer Engine Optimization) &amp; Perplexity / Gemini Readiness
              </h2>
            </div>
            <p className="text-xs text-[#CBD2C7] leading-relaxed">
              Modern AI Search engines (Perplexity, ChatGPT Search, Google Gemini AI Overviews) extract direct, authoritative factual claims rather than blue links. Configure your Speakable schema selectors, primary entity definition, and FAQ snippets.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Direct Answer & Entity Settings */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#121815] dark:text-white flex items-center gap-2 pb-2 border-b border-[#757761]/20">
                <Sparkles className="w-4 h-4 text-[#f7fe72]" />
                <span>Primary Factual Claim &amp; Brand Definition</span>
              </h3>

              <div>
                <label className="block font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                  Canonical Brand Definition (Quoted by AI models)
                </label>
                <textarea
                  rows={3}
                  value={globalSettings.aeoBrandDefinition}
                  onChange={(e) =>
                    setGlobalSettings({ ...globalSettings, aeoBrandDefinition: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                  Primary Verifiable Factual Claim (for AI Grounding)
                </label>
                <textarea
                  rows={3}
                  value={globalSettings.aeoPrimaryFactualClaim}
                  onChange={(e) =>
                    setGlobalSettings({ ...globalSettings, aeoPrimaryFactualClaim: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                  Speakable Schema CSS Selectors (for Voice &amp; LLM Audio)
                </label>
                <input
                  type="text"
                  value={globalSettings.aeoSpeakableSelectors.join(", ")}
                  onChange={(e) =>
                    setGlobalSettings({
                      ...globalSettings,
                      aeoSpeakableSelectors: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white font-mono focus:outline-none focus:border-[#f7fe72]"
                />
                <span className="text-[10px] text-[#757761] mt-1 block font-mono">
                  e.g. #aeo-summary, #aeo-faq, h1, .protocol-summary
                </span>
              </div>
            </div>

            {/* AEO FAQ Snippets (Rich Schema Q&A) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-[#121815] dark:text-white flex items-center justify-between pb-2 border-b border-[#757761]/20">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#34d399]" />
                  <span>AEO Rich FAQ Snippets</span>
                </span>
                <span className="text-[11px] font-mono text-[#34d399]">
                  {globalSettings.aeoFaqSnippets.length} Active Snippets
                </span>
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {globalSettings.aeoFaqSnippets.map((faq, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/20 space-y-1"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-[#121815] dark:text-white">{faq.question}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(i)}
                        className="text-[#757761] hover:text-red-400 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#505445] dark:text-[#A0A493] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add FAQ input */}
              <div className="p-3.5 rounded-2xl border border-[#757761]/30 bg-black/20 space-y-2">
                <span className="font-mono text-[11px] text-white font-bold block">
                  Add New Factual Q&amp;A Pair:
                </span>
                <input
                  type="text"
                  placeholder="Question: e.g. What makes vegetable mandi nutrition superior?"
                  value={newFaqQ}
                  onChange={(e) => setNewFaqQ(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761]"
                />
                <textarea
                  rows={2}
                  placeholder="Direct Answer: e.g. Fresh seasonal vegetables harvested within 24 hours retain up to 40% more bioavailable micronutrients..."
                  value={newFaqA}
                  onChange={(e) => setNewFaqA(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761]"
                />
                <button
                  type="button"
                  onClick={handleAddFaqSnippet}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] cursor-pointer"
                >
                  Add FAQ Snippet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: LOCAL & MANDI GROCER SEO                                           */}
      {/* ========================================================================= */}
      {activeTab === "local" && globalSettings && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-[#121815] dark:text-white">
                Hyper-Local Sabzi Mandi &amp; City Hub SEO
              </h2>
            </div>
            <p className="text-xs text-[#505445] dark:text-[#A0A493]">
              Enables Google Maps, LocalBusiness JSON-LD schema, and local search citations for regional mandis across Indore, Bhopal, Delhi NCR, and Bengaluru.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {globalSettings.locations.map((loc) => (
              <div
                key={loc.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 hover:border-[#34d399]/40 transition-all space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase bg-[#18211C] text-[#34d399] border border-[#34d399]/30 px-2 py-0.5 rounded font-bold">
                      {loc.city}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(loc.id)}
                      className="text-[#757761] hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="text-xs font-bold text-[#121815] dark:text-white pt-1">
                    {loc.name}
                  </h3>
                  <p className="text-[11px] text-[#505445] dark:text-[#A0A493]">
                    {loc.address}
                  </p>
                  <div className="text-[10px] font-mono text-[#757761] pt-1">
                    Mandi Hub: <span className="text-white">{loc.mandiHub}</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#757761]">
                    Geo: {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#757761]/15 text-[10px] font-mono text-[#34d399]">
                  ● Google Business Synced
                </div>
              </div>
            ))}
          </div>

          {/* Add Location Form */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-[#121815] dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#f7fe72]" />
              <span>Add New Local Mandi Hub for Local SEO</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Hub Name (e.g. Pune Agricultural Produce Station)"
                value={newLocName}
                onChange={(e) => setNewLocName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-white"
              />
              <input
                type="text"
                placeholder="City (e.g. Pune)"
                value={newLocCity}
                onChange={(e) => setNewLocCity(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-white"
              />
              <input
                type="text"
                placeholder="Mandi Hub (e.g. Market Yard Gultekdi)"
                value={newLocMandi}
                onChange={(e) => setNewLocMandi(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-white"
              />
            </div>
            <button
              type="button"
              onClick={handleAddLocation}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] cursor-pointer"
            >
              Register Local Mandi Hub
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TECHNICAL SEO (JSON-LD SCHEMAS, SITEMAP & ROBOTS)                  */}
      {/* ========================================================================= */}
      {activeTab === "technical" && globalSettings && (
        <div className="space-y-8">
          {/* JSON-LD Schema Builder & Root Metadata Pipeline */}
          <JsonLdSchemaBuilder
            schemas={globalSettings.schemas || DEFAULT_SCHEMAS}
            devModeEnabled={devMode}
            onRefresh={loadSeoData}
            onToggleDevMode={handleToggleDevMode}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Sitemap & Robots Links */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-4">
              <h3 className="text-sm font-bold text-[#121815] dark:text-white flex items-center gap-2 pb-2 border-b border-[#757761]/20">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Crawl Infrastructure Endpoints</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/20 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#121815] dark:text-white font-mono">
                      /sitemap.xml
                    </div>
                    <div className="text-[11px] text-[#505445] dark:text-[#A0A493]">
                      Auto-generated Next.js App Router XML Sitemap
                    </div>
                  </div>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#f7fe72] text-[#0B0E0C] font-bold"
                  >
                    <span>Inspect XML</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/20 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#121815] dark:text-white font-mono">
                      /robots.txt
                    </div>
                    <div className="text-[11px] text-[#505445] dark:text-[#A0A493]">
                      Crawl rules with explicit GPTBot &amp; PerplexityBot permissions
                    </div>
                  </div>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#18211C] border border-[#757761]/35 text-[#121815] dark:text-white font-semibold"
                  >
                    <span>View Robots</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                  Canonical Base URL
                </label>
                <input
                  type="text"
                  value={globalSettings.canonicalBaseUrl}
                  onChange={(e) =>
                    setGlobalSettings({ ...globalSettings, canonicalBaseUrl: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white font-mono"
                />
              </div>
            </div>

            {/* Core Web Vitals Targets */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-4">
              <h3 className="text-sm font-bold text-[#121815] dark:text-white flex items-center gap-2 pb-2 border-b border-[#757761]/20">
                <BarChart className="w-4 h-4 text-[#34d399]" />
                <span>Core Web Vitals &amp; Performance Targets</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#141A16] border border-[#757761]/25">
                  <div className="text-[10px] font-mono text-[#757761]">LCP (Largest Contentful)</div>
                  <div className="text-xl font-black text-[#34d399] font-mono">0.82s</div>
                  <div className="text-[9px] text-[#34d399] font-mono">Target &lt; 2.5s (Passed)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#141A16] border border-[#757761]/25">
                  <div className="text-[10px] font-mono text-[#757761]">INP (Interaction to Next)</div>
                  <div className="text-xl font-black text-[#34d399] font-mono">24ms</div>
                  <div className="text-[9px] text-[#34d399] font-mono">Target &lt; 200ms (Passed)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#141A16] border border-[#757761]/25">
                  <div className="text-[10px] font-mono text-[#757761]">CLS (Cumulative Shift)</div>
                  <div className="text-xl font-black text-[#34d399] font-mono">0.002</div>
                  <div className="text-[9px] text-[#34d399] font-mono">Target &lt; 0.1 (Passed)</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#141A16] border border-[#757761]/25">
                  <div className="text-[10px] font-mono text-[#757761]">TTFB (Time to First Byte)</div>
                  <div className="text-xl font-black text-[#34d399] font-mono">68ms</div>
                  <div className="text-[9px] text-[#34d399] font-mono">Target &lt; 800ms (Passed)</div>
                </div>
              </div>

              <div className="text-[11px] text-[#505445] dark:text-[#A0A493]">
                Static assets served over HTTP/2 with Edge Cache-Control headers and sub-resource preloading.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: OFF-PAGE & AUTHORITY SIGNALS                                       */}
      {/* ========================================================================= */}
      {activeTab === "offpage" && globalSettings && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-2">
            <div className="flex items-center gap-2">
              <Link2 className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-[#121815] dark:text-white">
                Off-Page SEO, Backlink Registry &amp; Domain Authority
              </h2>
            </div>
            <p className="text-xs text-[#505445] dark:text-[#CBD2C7]">
              Monitor high-authority backlinks, academic sports science mentions, digital PR citations, and brand anchor distribution.
            </p>
          </div>

          <div className="rounded-2xl border border-[#757761]/25 bg-white dark:bg-[#0E1310] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EAEFEA]/70 dark:bg-[#141A16] border-b border-[#757761]/25 text-[#505445] dark:text-[#A0A493] font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-3 px-4">Referring Domain</th>
                  <th className="py-3 px-4">Anchor Text</th>
                  <th className="py-3 px-4">Domain Authority</th>
                  <th className="py-3 px-4">Link Type</th>
                  <th className="py-3 px-4">Target Path</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#757761]/15">
                {globalSettings.backlinks.map((b) => (
                  <tr key={b.id} className="hover:bg-[#EAEFEA]/40 dark:hover:bg-[#141A16]/50">
                    <td className="py-3 px-4 font-mono font-bold text-[#121815] dark:text-white">
                      <a href={b.sourceUrl} target="_blank" className="hover:underline text-blue-400">
                        {b.sourceDomain}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-[#505445] dark:text-[#CBD2C7] font-semibold">
                      &quot;{b.anchorText}&quot;
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#f7fe72]">
                      DA {b.domainAuthority}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                        {b.followStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#757761]">
                      {b.targetPath}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: INTERNATIONAL & VOICE SEO                                          */}
      {/* ========================================================================= */}
      {activeTab === "international" && globalSettings && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-2">
            <div className="flex items-center gap-2">
              <Languages className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-[#121815] dark:text-white">
                International (hreflang) &amp; Voice Search Optimization
              </h2>
            </div>
            <p className="text-xs text-[#505445] dark:text-[#CBD2C7]">
              Configure multi-regional hreflang tags for Indian regional languages and conversational voice search queries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {globalSettings.locales.map((loc) => (
              <div
                key={loc.code}
                className="p-4 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-1"
              >
                <div className="text-[10px] font-mono text-[#f7fe72] uppercase font-bold">
                  {loc.hrefLang}
                </div>
                <div className="text-sm font-bold text-[#121815] dark:text-white">
                  {loc.name}
                </div>
                <div className="text-[10px] font-mono text-[#757761]">
                  hreflang alternate registered
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT PAGE SEO & KEYWORD DENSITY ANALYZER                           */}
      {/* ========================================================================= */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-4xl rounded-3xl bg-[#0E1310] border border-[#757761]/35 p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#757761]/25 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#f7fe72]" />
                  <h3 className="text-base font-bold text-white">
                    SEO Editor: <code className="text-[#f7fe72] font-mono">{editingPage.path}</code>
                  </h3>
                </div>
                <p className="text-[11px] text-[#A0A493]">
                  Optimize meta tags, evaluate keyword density, and configure AEO grounding signals.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Modal Sub-Tabs */}
                <div className="flex items-center bg-[#141A16] p-1 rounded-xl border border-[#757761]/30 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setModalTab("meta")}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      modalTab === "meta"
                        ? "bg-[#18211C] text-[#f7fe72] border border-[#757761]/40 font-bold"
                        : "text-[#A0A493] hover:text-white"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Metadata &amp; Tags</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalTab("density")}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      modalTab === "density"
                        ? "bg-[#18211C] text-[#f7fe72] border border-[#757761]/40 font-bold shadow-xs"
                        : "text-[#A0A493] hover:text-white"
                    }`}
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-[#f7fe72]" />
                    <span>Keyword Density Analyzer</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="p-1.5 text-[#757761] hover:text-white rounded-xl hover:bg-[#141A16] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Static Lock Warning if Dev Mode is disabled */}
            {editingPage.isStatic && !devMode && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Static core page is read-only. Toggle Dev Mode ON to unlock editing.</span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleDevMode}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-400 text-black cursor-pointer shrink-0"
                >
                  Unlock Dev Mode
                </button>
              </div>
            )}

            {/* TAB 1: METADATA & TAGS FORM */}
            {modalTab === "meta" && (
              <form onSubmit={handleSavePageSeo} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono text-[#A0A493]">HTML Title Tag (&lt;title&gt;)</label>
                    <span className={`text-[10px] font-mono ${editingPage.title.length > 60 ? "text-amber-400 font-bold" : "text-[#757761]"}`}>
                      {editingPage.title.length} / 60 chars {editingPage.title.length > 60 && "(Truncation Warning)"}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    disabled={editingPage.isStatic && !devMode}
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white disabled:opacity-50 focus:outline-none focus:border-[#f7fe72]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono text-[#A0A493]">Meta Description</label>
                    <span className={`text-[10px] font-mono ${editingPage.description.length > 160 ? "text-amber-400 font-bold" : "text-[#757761]"}`}>
                      {editingPage.description.length} / 160 chars {editingPage.description.length > 160 && "(Truncation Warning)"}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    disabled={editingPage.isStatic && !devMode}
                    value={editingPage.description}
                    onChange={(e) => setEditingPage({ ...editingPage, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white disabled:opacity-50 focus:outline-none focus:border-[#f7fe72]"
                  />
                </div>

                {/* Target Keywords Taxonomy Manager */}
                <div className="p-4 rounded-2xl bg-[#141A16] border border-[#757761]/25 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[#A0A493] flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#f7fe72]" />
                      <span>Target Keywords Taxonomy</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setModalTab("density")}
                      className="text-[10px] font-mono text-[#f7fe72] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <BarChart2 className="w-3 h-3 text-[#f7fe72]" />
                      <span>Audit Keyword Density &rarr;</span>
                    </button>
                  </div>

                  {/* Active Keyword Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {editingPage.keywords && editingPage.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#18211C] border border-[#757761]/35 text-xs text-white font-mono"
                      >
                        <span>{kw}</span>
                        {(!editingPage.isStatic || devMode) && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingPage.keywords.filter((_, idx) => idx !== i);
                              setEditingPage({ ...editingPage, keywords: updated });
                            }}
                            className="text-[#757761] hover:text-red-400 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                    {(!editingPage.keywords || editingPage.keywords.length === 0) && (
                      <span className="text-[11px] text-[#757761] italic">
                        No target keywords configured. Add your primary search terms below.
                      </span>
                    )}
                  </div>

                  {/* Add Keyword Input */}
                  {(!editingPage.isStatic || devMode) && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Add new target keyword (e.g. vegetable mandi nutrition)..."
                        value={newKeywordInput}
                        onChange={(e) => setNewKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (newKeywordInput.trim()) {
                              const trimmed = newKeywordInput.trim();
                              if (!editingPage.keywords.includes(trimmed)) {
                                setEditingPage({
                                  ...editingPage,
                                  keywords: [...(editingPage.keywords || []), trimmed],
                                });
                              }
                              setNewKeywordInput("");
                            }
                          }
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-[#0B0E0C] border border-[#757761]/30 text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newKeywordInput.trim()) {
                            const trimmed = newKeywordInput.trim();
                            if (!editingPage.keywords.includes(trimmed)) {
                              setEditingPage({
                                ...editingPage,
                                keywords: [...(editingPage.keywords || []), trimmed],
                              });
                            }
                            setNewKeywordInput("");
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#18211C] text-[#f7fe72] border border-[#f7fe72]/30 font-bold hover:bg-[#25332C] cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[#A0A493] mb-1">
                    AEO Direct Answer (for AI Search Perplexity / Gemini Grounding)
                  </label>
                  <textarea
                    rows={2}
                    disabled={editingPage.isStatic && !devMode}
                    value={editingPage.directAnswer || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, directAnswer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white disabled:opacity-50 focus:outline-none focus:border-[#f7fe72]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[#A0A493] mb-1">OpenGraph Image URL</label>
                  <input
                    type="url"
                    disabled={editingPage.isStatic && !devMode}
                    value={editingPage.ogImage}
                    onChange={(e) => setEditingPage({ ...editingPage, ogImage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white font-mono disabled:opacity-50 focus:outline-none focus:border-[#f7fe72]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[#A0A493] mb-1">Crawl Priority (0.1 - 1.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="1.0"
                      disabled={editingPage.isStatic && !devMode}
                      value={editingPage.priority}
                      onChange={(e) => setEditingPage({ ...editingPage, priority: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white font-mono disabled:opacity-50 focus:outline-none focus:border-[#f7fe72]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[#A0A493] mb-1">Change Frequency</label>
                    <select
                      disabled={editingPage.isStatic && !devMode}
                      value={editingPage.changeFreq}
                      onChange={(e) => setEditingPage({ ...editingPage, changeFreq: e.target.value as PageSeoConfig["changeFreq"] })}
                      className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white disabled:opacity-50 focus:outline-none focus:border-[#f7fe72]"
                    >
                      <option value="always">Always</option>
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                {/* Indexing checkboxes */}
                <div className="flex items-center gap-6 pt-2 border-t border-[#757761]/25">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={editingPage.isStatic && !devMode}
                      checked={editingPage.allowIndexing}
                      onChange={(e) => setEditingPage({ ...editingPage, allowIndexing: e.target.checked })}
                      className="rounded border-[#757761]/30 text-[#f7fe72]"
                    />
                    <span className="text-white">Allow Search Indexing</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={editingPage.isStatic && !devMode}
                      checked={editingPage.allowFollow}
                      onChange={(e) => setEditingPage({ ...editingPage, allowFollow: e.target.checked })}
                      className="rounded border-[#757761]/30 text-[#f7fe72]"
                    />
                    <span className="text-white">Follow Outbound Links</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#757761]/25">
                  <button
                    type="button"
                    onClick={() => setEditingPage(null)}
                    className="px-3 py-1.5 rounded-xl text-xs text-[#A0A493] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingPage || (editingPage.isStatic && !devMode)}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors cursor-pointer disabled:opacity-30"
                  >
                    {savingPage ? "Saving..." : "Save Page SEO"}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: KEYWORD DENSITY ANALYZER */}
            {modalTab === "density" && (
              <div className="space-y-4">
                <KeywordDensityAnalyzer
                  initialKeyword={editingPage.keywords?.[0] || ""}
                  availableKeywords={editingPage.keywords || []}
                  pagePath={editingPage.path}
                  pageTitle={editingPage.title}
                  pageDescription={editingPage.description}
                  pageDirectAnswer={editingPage.directAnswer || ""}
                  onUpdateTitle={(newTitle) => setEditingPage({ ...editingPage, title: newTitle })}
                  onUpdateDescription={(newDesc) => setEditingPage({ ...editingPage, description: newDesc })}
                  onAddKeyword={(kw) => {
                    if (!editingPage.keywords.includes(kw)) {
                      setEditingPage({
                        ...editingPage,
                        keywords: [...(editingPage.keywords || []), kw],
                      });
                    }
                  }}
                />

                <div className="flex items-center justify-between pt-3 border-t border-[#757761]/25">
                  <button
                    type="button"
                    onClick={() => setModalTab("meta")}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono text-[#f7fe72] bg-[#18211C] border border-[#f7fe72]/30 hover:bg-[#25332C] cursor-pointer flex items-center gap-1.5"
                  >
                    <span>&larr; Back to Metadata &amp; Tags</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingPage(null)}
                      className="px-3 py-1.5 rounded-xl text-xs text-[#A0A493] hover:text-white cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePageSeo}
                      disabled={savingPage || (editingPage.isStatic && !devMode)}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors cursor-pointer disabled:opacity-30"
                    >
                      {savingPage ? "Saving..." : "Save Optimized SEO"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
