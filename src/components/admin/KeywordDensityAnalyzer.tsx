"use client";

import React, { useState, useMemo } from "react";
import { Tabs } from "@heroui/react";
import {
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  BarChart2,
  FileText,
  Hash,
  Compass,
  RefreshCw,
  Lightbulb,
  Check,
  Zap,
  Globe,
  Sliders,
} from "lucide-react";

// Common English stopwords to filter out of N-Gram analysis
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can",
  "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
  "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
  "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
  "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
  "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor",
  "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out",
  "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
  "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's",
  "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under",
  "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what",
  "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's",
  "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself",
]);

export interface KeywordDensityAnalyzerProps {
  initialKeyword?: string;
  availableKeywords?: string[];
  pagePath?: string;
  pageTitle?: string;
  pageDescription?: string;
  pageDirectAnswer?: string;
  initialBodyContent?: string;
  onUpdateTitle?: (newTitle: string) => void;
  onUpdateDescription?: (newDescription: string) => void;
  onAddKeyword?: (newKeyword: string) => void;
  className?: string;
}

export default function KeywordDensityAnalyzer({
  initialKeyword = "",
  availableKeywords = [],
  pagePath = "/",
  pageTitle = "",
  pageDescription = "",
  pageDirectAnswer = "",
  initialBodyContent = "",
  onUpdateTitle,
  onUpdateDescription,
  onAddKeyword,
  className = "",
}: KeywordDensityAnalyzerProps) {
  // Target Keyword State
  const [targetKeyword, setTargetKeyword] = useState<string>(() => {
    if (initialKeyword) return initialKeyword;
    if (availableKeywords.length > 0) return availableKeywords[0];
    return "athletic nutrition";
  });

  // Custom Content Body input (simulates or holds page body copy)
  const [bodyContent, setBodyContent] = useState<string>(() => {
    if (initialBodyContent) return initialBodyContent;
    // Default rich sample body based on Uchitatvam context
    return `${pageTitle}
${pageDescription}

${pageDirectAnswer || "Uchitatvam delivers precision athletic nutrition mapped to local vegetable mandis and verified neighborhood grocers."}

# Daily Precision Fuel & Biometrics
Optimizing athletic nutrition starts at your local vegetable mandi. Fresh seasonal spinach, beetroot nitrates, sweet potatoes, and regional pulses provide unmatched micronutrient density for endurance runners, lifters, and functional athletes.

## Why Mandi Sourced Athletic Nutrition Wins
1. Harvested Fresh: Minimizes oxidation and protects bioavailable phytonutrients.
2. Verified Macronutrients: Track your glycemic index and recovery fuel targets in real time.
3. Daily Quests: Complete hydration and produce tracking to earn regional leaderboard badges.

Connecting wearable biometrics with daily grocery purchases empowers everyday athletes to transform metabolic efficiency without expensive processed supplements.`;
  });

  const [activeTab, setActiveTab] = useState<"overview" | "opportunities" | "ngrams" | "editor">("overview");
  const [copiedAction, setCopiedAction] = useState<string | null>(null);

  // Full composite text to analyze
  const fullAnalyzedText = useMemo(() => {
    return `${pageTitle} ${pageDescription} ${pageDirectAnswer} ${bodyContent}`.trim();
  }, [pageTitle, pageDescription, pageDirectAnswer, bodyContent]);

  // Clean tokens extraction
  const tokens = useMemo(() => {
    const clean = fullAnalyzedText
      .replace(/<[^>]*>/g, " ")
      .replace(/[#*_`~[\]()]/g, " ")
      .toLowerCase();
    const words = clean.match(/\b[a-z0-9\u00C0-\u024F\u0900-\u097F]+(?:'[a-z0-9]+)?\b/gi);
    return words || [];
  }, [fullAnalyzedText]);

  const totalWords = tokens.length;

  // Analysis of Target Keyword
  const keywordAnalysis = useMemo(() => {
    const trimmedKw = targetKeyword.trim().toLowerCase();
    if (!trimmedKw) {
      return {
        keyword: "",
        kwWordsCount: 0,
        matches: 0,
        density: 0,
        titleMatches: 0,
        descMatches: 0,
        pathMatch: false,
        directAnswerMatches: 0,
        bodyMatches: 0,
        status: "missing" as const,
        score: 0,
      };
    }

    const kwTokens = trimmedKw.match(/\b[a-z0-9\u00C0-\u024F\u0900-\u097F]+(?:'[a-z0-9]+)?\b/gi) || [];
    const kwWordsCount = kwTokens.length || 1;

    // Regex for exact whole phrase match
    const escaped = trimmedKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");

    const totalMatches = (fullAnalyzedText.match(regex) || []).length;
    const titleMatches = (pageTitle.match(regex) || []).length;
    const descMatches = (pageDescription.match(regex) || []).length;
    const directAnswerMatches = (pageDirectAnswer.match(regex) || []).length;
    const bodyMatches = (bodyContent.match(regex) || []).length;

    // Check slug/path match
    const cleanPath = pagePath.toLowerCase().replace(/[^a-z0-9]/g, " ");
    const pathMatch =
      cleanPath.includes(trimmedKw) ||
      (kwTokens.length > 0 && kwTokens.every((t) => cleanPath.includes(t)));

    // Density calculation: (matches * wordsInKeyword / totalWords) * 100
    const density = totalWords > 0 ? (totalMatches * kwWordsCount / totalWords) * 100 : 0;

    // Status classification:
    // Ideal: 1.0% to 2.5%
    // Under: < 1.0%
    // Elevated: 2.51% to 3.5%
    // Stuffing: > 3.5%
    let status: "missing" | "under" | "optimal" | "elevated" | "stuffing" = "missing";
    if (totalMatches === 0) {
      status = "missing";
    } else if (density < 1.0) {
      status = "under";
    } else if (density <= 2.5) {
      status = "optimal";
    } else if (density <= 3.5) {
      status = "elevated";
    } else {
      status = "stuffing";
    }

    // Scoring (0 - 100)
    let score = 0;
    // Title (25 pts)
    if (titleMatches > 0) score += 25;
    // First 35 chars of title bonus (+5)
    if (pageTitle.toLowerCase().indexOf(trimmedKw) >= 0 && pageTitle.toLowerCase().indexOf(trimmedKw) <= 35) {
      score += 5;
    }
    // Meta Description (20 pts)
    if (descMatches > 0) score += 20;
    // URL Slug (15 pts)
    if (pathMatch) score += 15;
    // Direct Answer / First 100 words (15 pts)
    if (directAnswerMatches > 0) score += 15;
    // Density score (20 pts)
    if (status === "optimal") {
      score += 20;
    } else if (status === "under" && totalMatches > 0) {
      score += 10;
    } else if (status === "elevated") {
      score += 8;
    }

    return {
      keyword: trimmedKw,
      kwWordsCount,
      matches: totalMatches,
      density: Number(density.toFixed(2)),
      titleMatches,
      descMatches,
      pathMatch,
      directAnswerMatches,
      bodyMatches,
      status,
      score: Math.min(100, score),
    };
  }, [targetKeyword, fullAnalyzedText, pageTitle, pageDescription, pageDirectAnswer, bodyContent, pagePath, totalWords]);

  // N-Gram Frequencies (1-word, 2-word, 3-word)
  const ngrams = useMemo(() => {
    const unigrams: Record<string, number> = {};
    const bigrams: Record<string, number> = {};
    const trigrams: Record<string, number> = {};

    // 1-Word Unigrams (filtered for stopwords & length > 2)
    for (let i = 0; i < tokens.length; i++) {
      const w = tokens[i];
      if (w.length > 2 && !STOP_WORDS.has(w)) {
        unigrams[w] = (unigrams[w] || 0) + 1;
      }
    }

    // 2-Word Bigrams
    for (let i = 0; i < tokens.length - 1; i++) {
      const w1 = tokens[i];
      const w2 = tokens[i + 1];
      if (!STOP_WORDS.has(w1) || !STOP_WORDS.has(w2)) {
        const bi = `${w1} ${w2}`;
        bigrams[bi] = (bigrams[bi] || 0) + 1;
      }
    }

    // 3-Word Trigrams
    for (let i = 0; i < tokens.length - 2; i++) {
      const w1 = tokens[i];
      const w2 = tokens[i + 1];
      const w3 = tokens[i + 2];
      if (!STOP_WORDS.has(w1) && !STOP_WORDS.has(w3)) {
        const tri = `${w1} ${w2} ${w3}`;
        trigrams[tri] = (trigrams[tri] || 0) + 1;
      }
    }

    const sortDict = (dict: Record<string, number>) =>
      Object.entries(dict)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([phrase, count]) => ({
          phrase,
          count,
          density: totalWords > 0 ? Number(((count * phrase.split(" ").length / totalWords) * 100).toFixed(2)) : 0,
        }));

    return {
      unigrams: sortDict(unigrams),
      bigrams: sortDict(bigrams),
      trigrams: sortDict(trigrams),
    };
  }, [tokens, totalWords]);

  // Optimization Opportunities Checklist
  const opportunities = useMemo(() => {
    const list = [];
    const kw = keywordAnalysis.keyword;

    // 1. Title tag presence
    if (keywordAnalysis.titleMatches > 0) {
      const earlyInTitle = pageTitle.toLowerCase().indexOf(kw) <= 30;
      list.push({
        id: "title-pass",
        status: "pass" as const,
        label: "Target keyword in HTML <title>",
        detail: earlyInTitle
          ? `Great! "${kw}" appears near the beginning of your title tag for prime ranking weight.`
          : `Keyword is present in your title tag (${pageTitle.length}/60 chars).`,
        action: null,
      });
    } else {
      list.push({
        id: "title-fail",
        status: "fail" as const,
        label: "Missing target keyword in <title>",
        detail: `The <title> tag is Google's most weighted on-page ranking signal. Include "${kw}" in the title.`,
        action: onUpdateTitle
          ? {
              label: "Insert in Title",
              execute: () => {
                onUpdateTitle(`${kw.charAt(0).toUpperCase() + kw.slice(1)} // ${pageTitle}`);
                setCopiedAction("title");
                setTimeout(() => setCopiedAction(null), 2000);
              },
            }
          : null,
      });
    }

    // 2. Meta description presence
    if (keywordAnalysis.descMatches > 0) {
      list.push({
        id: "desc-pass",
        status: "pass" as const,
        label: "Target keyword in Meta Description",
        detail: `Keyword appears in the meta snippet, boosting SERP CTR when queried by searchers.`,
        action: null,
      });
    } else {
      list.push({
        id: "desc-fail",
        status: "fail" as const,
        label: "Missing in Meta Description",
        detail: `Search engines bold matched query terms in snippet descriptions. Add "${kw}" to improve click-through rates.`,
        action: onUpdateDescription
          ? {
              label: "Append to Description",
              execute: () => {
                onUpdateDescription(`${pageDescription} Discover ${kw} protocols today.`);
                setCopiedAction("desc");
                setTimeout(() => setCopiedAction(null), 2000);
              },
            }
          : null,
      });
    }

    // 3. Keyword Density Sweet Spot (1.0% - 2.5%)
    if (keywordAnalysis.status === "optimal") {
      list.push({
        id: "density-optimal",
        status: "pass" as const,
        label: `Optimal Keyword Density (${keywordAnalysis.density}%)`,
        detail: `Your density of ${keywordAnalysis.density}% sits squarely in the recommended 1.0%–2.5% zone. Clear topical relevance with zero stuffing penalty.`,
        action: null,
      });
    } else if (keywordAnalysis.status === "under") {
      list.push({
        id: "density-under",
        status: "warning" as const,
        label: `Under-optimized Density (${keywordAnalysis.density}%)`,
        detail: `Density is below 1.0%. Mention "${kw}" 1–2 more times in subheadings or body copy to establish topical authority.`,
        action: {
          label: "Inject in Body Copy",
          execute: () => {
            setBodyContent((prev) => `${prev}\n\nOur verified approach to ${kw} empowers daily peak athletic performance.`);
          },
        },
      });
    } else if (keywordAnalysis.status === "stuffing") {
      list.push({
        id: "density-stuffing",
        status: "fail" as const,
        label: `Keyword Stuffing Warning (${keywordAnalysis.density}%)`,
        detail: `High danger! Density exceeds 3.5%. Search engines may classify this page as spam. Remove ${Math.ceil(keywordAnalysis.matches * 0.4)} occurrences.`,
        action: null,
      });
    } else if (keywordAnalysis.status === "elevated") {
      list.push({
        id: "density-elevated",
        status: "warning" as const,
        label: `Elevated Density (${keywordAnalysis.density}%)`,
        detail: `Density is approaching the upper boundary (2.6%–3.5%). Avoid repeating "${kw}" further.`,
        action: null,
      });
    } else {
      list.push({
        id: "density-missing",
        status: "fail" as const,
        label: "Keyword Not Found in Content (0%)",
        detail: `The page contains 0 matches for "${kw}". It cannot rank for this search term without content presence.`,
        action: null,
      });
    }

    // 4. URL / Slug check
    if (keywordAnalysis.pathMatch) {
      list.push({
        id: "url-pass",
        status: "pass" as const,
        label: "URL Slug matches Keyword Context",
        detail: `The path "${pagePath}" contains relevant target keywords for crawler URL parsing.`,
        action: null,
      });
    } else {
      list.push({
        id: "url-warning",
        status: "warning" as const,
        label: "URL Slug lacks explicit keyword",
        detail: `The URL "${pagePath}" doesn't contain "${kw}". (Note: For root or static routes, ensure titles and schema compensate).`,
        action: null,
      });
    }

    // 5. AEO Direct Answer / First 100 Words
    if (keywordAnalysis.directAnswerMatches > 0) {
      list.push({
        id: "aeo-pass",
        status: "pass" as const,
        label: "Present in Direct Answer / AEO Snippet",
        detail: `Keyword is ready for Perplexity, Google Gemini Overviews, and featured answer box extraction.`,
        action: null,
      });
    } else {
      list.push({
        id: "aeo-warning",
        status: "warning" as const,
        label: "Missing from Direct Answer / AEO Snippet",
        detail: `AI Answer Engines require direct factual claims in the opening snippet. Include "${kw}" in your Direct Answer field.`,
        action: null,
      });
    }

    // 6. Keywords Tag Taxonomy
    const inTaxonomy = availableKeywords.some((k) => k.toLowerCase() === kw);
    if (inTaxonomy) {
      list.push({
        id: "tax-pass",
        status: "pass" as const,
        label: "Registered in Page Keywords Metadata",
        detail: `"${kw}" is listed in the page's meta keywords taxonomy array.`,
        action: null,
      });
    } else if (onAddKeyword) {
      list.push({
        id: "tax-opportunity",
        status: "warning" as const,
        label: "Add to Page Keywords Taxonomy",
        detail: `"${kw}" is not yet saved to this page's target keywords array.`,
        action: {
          label: "Save to Keywords",
          execute: () => {
            onAddKeyword(kw);
            setCopiedAction("keyword");
            setTimeout(() => setCopiedAction(null), 2000);
          },
        },
      });
    }

    return list;
  }, [
    keywordAnalysis,
    pageTitle,
    pageDescription,
    pagePath,
    availableKeywords,
    onUpdateTitle,
    onUpdateDescription,
    onAddKeyword,
  ]);

  // Status badge styling helper
  const getStatusBadge = (status: "missing" | "under" | "optimal" | "elevated" | "stuffing") => {
    switch (status) {
      case "optimal":
        return {
          bg: "bg-emerald-500/15 border-emerald-500/30 text-[#34d399]",
          text: "Optimal Density",
          dot: "bg-[#34d399]",
        };
      case "under":
        return {
          bg: "bg-amber-500/15 border-amber-500/30 text-amber-400",
          text: "Under-Optimized",
          dot: "bg-amber-400",
        };
      case "elevated":
        return {
          bg: "bg-yellow-500/15 border-yellow-500/30 text-yellow-300",
          text: "Elevated Density",
          dot: "bg-yellow-400",
        };
      case "stuffing":
        return {
          bg: "bg-rose-500/20 border-rose-500/40 text-rose-400 font-bold",
          text: "Stuffing Penalty Risk",
          dot: "bg-rose-500",
        };
      default:
        return {
          bg: "bg-red-500/15 border-red-500/30 text-red-400",
          text: "Keyword Missing",
          dot: "bg-red-500",
        };
    }
  };

  const statusBadge = getStatusBadge(keywordAnalysis.status);

  return (
    <div
      className={`rounded-3xl border border-[#757761]/25 bg-white dark:bg-[#0E1310] overflow-hidden shadow-xl text-xs ${className}`}
    >
      {/* Header Bar */}
      <div className="p-5 border-b border-[#757761]/20 bg-[#F4F6F5]/50 dark:bg-[#141A16]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#18211C] border border-[#757761]/30 text-[#f7fe72]">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#121815] dark:text-white">
              Keyword Density &amp; Content Auditor
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#18211C] text-[#f7fe72] border border-[#f7fe72]/30">
              Score: {keywordAnalysis.score}/100
            </span>
          </div>
          <p className="text-[11px] text-[#505445] dark:text-[#A0A493]">
            Evaluates topical depth, keyword placement, and over-optimization thresholds for route:{" "}
            <code className="text-[#f7fe72] font-mono">{pagePath}</code>
          </p>
        </div>

        {/* Target Keyword Selector Bar */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#757761] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter Target Keyword..."
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 rounded-xl bg-white dark:bg-[#0B0E0C] border border-[#757761]/30 text-[#121815] dark:text-white text-xs font-medium focus:outline-none focus:border-[#f7fe72]"
            />
          </div>
        </div>
      </div>

      {/* Suggested Keywords Quick Selector */}
      {availableKeywords.length > 0 && (
        <div className="px-5 py-2.5 bg-[#EAEFEA]/50 dark:bg-black/30 border-b border-[#757761]/15 flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-[#757761] font-mono shrink-0 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-[#f7fe72]" /> Quick Select:
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {availableKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => setTargetKeyword(kw)}
                className={`px-2.5 py-1 rounded-lg font-mono transition-all shrink-0 cursor-pointer ${
                  targetKeyword.toLowerCase() === kw.toLowerCase()
                    ? "bg-[#f7fe72] text-[#0B0E0C] font-bold shadow-xs"
                    : "bg-[#141A16] hover:bg-[#1C241F] text-[#CBD2C7] border border-[#757761]/30"
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Key Stats Grid */}
      <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-[#757761]/15 bg-[#F4F6F5]/20 dark:bg-black/10">
        {/* Density Stat */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#141A16] border border-[#757761]/25 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#757761] font-mono">
            <span>Keyword Density</span>
            <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
          </div>
          <div className="text-xl font-black font-mono text-[#121815] dark:text-white flex items-baseline gap-1.5">
            <span>{keywordAnalysis.density}%</span>
            <span className="text-[10px] font-normal text-[#757761]">ideal: 1-2.5%</span>
          </div>
          <div
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono border ${statusBadge.bg}`}
          >
            <span>{statusBadge.text}</span>
          </div>
        </div>

        {/* Occurrences Stat */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#141A16] border border-[#757761]/25 space-y-1">
          <div className="text-[11px] text-[#757761] font-mono">Total Occurrences</div>
          <div className="text-xl font-black font-mono text-[#121815] dark:text-white">
            {keywordAnalysis.matches}{" "}
            <span className="text-xs font-normal text-[#757761]">times</span>
          </div>
          <div className="text-[10px] text-[#505445] dark:text-[#A0A493] truncate">
            in {totalWords} total words
          </div>
        </div>

        {/* Strategic Placement */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#141A16] border border-[#757761]/25 space-y-1">
          <div className="text-[11px] text-[#757761] font-mono">Placement Signals</div>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                keywordAnalysis.titleMatches > 0
                  ? "bg-emerald-500/15 text-[#34d399] border-emerald-500/30"
                  : "bg-red-500/15 text-red-400 border-red-500/30"
              }`}
              title="HTML Title Tag"
            >
              Title: {keywordAnalysis.titleMatches}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
                keywordAnalysis.descMatches > 0
                  ? "bg-emerald-500/15 text-[#34d399] border-emerald-500/30"
                  : "bg-red-500/15 text-red-400 border-red-500/30"
              }`}
              title="Meta Description"
            >
              Meta: {keywordAnalysis.descMatches}
            </span>
          </div>
          <div className="text-[10px] text-[#505445] dark:text-[#A0A493] font-mono">
            {keywordAnalysis.pathMatch ? "✓ URL Match" : "✕ Missing in URL"}
          </div>
        </div>

        {/* Content Readiness Score */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#141A16] border border-[#757761]/25 space-y-1">
          <div className="text-[11px] text-[#757761] font-mono">SEO Ranking Health</div>
          <div className="text-xl font-black font-mono text-[#f7fe72]">
            {keywordAnalysis.score}
            <span className="text-xs font-normal text-[#757761]"> / 100</span>
          </div>
          <div className="w-full bg-[#18211C] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                keywordAnalysis.score >= 80
                  ? "bg-[#34d399]"
                  : keywordAnalysis.score >= 50
                  ? "bg-[#f7fe72]"
                  : "bg-red-400"
              }`}
              style={{ width: `${keywordAnalysis.score}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs (HeroUI Tabs) */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as "overview" | "opportunities" | "ngrams" | "editor")}
        className="w-full"
      >
        <Tabs.ListContainer className="px-5 pt-3 border-b border-[#757761]/20 bg-transparent">
          <Tabs.List aria-label="Keyword Density Navigation" className="flex items-center gap-2 font-mono text-[11px] overflow-x-auto p-1 bg-black/30 border border-[#757761]/20 rounded-xl">
            <Tabs.Tab id="overview" className="cursor-pointer">
              <TrendingUp className="w-3.5 h-3.5 text-[#34d399]" />
              <span>Density Breakdown</span>
              <Tabs.Indicator />
            </Tabs.Tab>

            <Tabs.Tab id="opportunities" className="cursor-pointer">
              <Lightbulb className="w-3.5 h-3.5 text-[#f7fe72]" />
              <span>Opportunities ({opportunities.filter((o) => o.status !== "pass").length} actions)</span>
              <Tabs.Indicator />
            </Tabs.Tab>

            <Tabs.Tab id="ngrams" className="cursor-pointer">
              <Hash className="w-3.5 h-3.5 text-blue-400" />
              <span>N-Gram Frequency</span>
              <Tabs.Indicator />
            </Tabs.Tab>

            <Tabs.Tab id="editor" className="cursor-pointer">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>Live Content Simulator</span>
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>

        {/* Sub-Tab Content */}
        <div className="p-5">
          {/* TAB 1: OVERVIEW / DENSITY BREAKDOWN */}
          <Tabs.Panel id="overview" className="space-y-5">
            {/* Density Range Visual Slider / Gauge */}
            <div className="p-4 rounded-2xl bg-[#F4F6F5]/50 dark:bg-[#141A16] border border-[#757761]/25 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#121815] dark:text-white">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#34d399]" />
                  <span>Keyword Density Benchmark Spectrum</span>
                </span>
                <span className="font-mono text-[#f7fe72]">
                  Current: {keywordAnalysis.density}% ({keywordAnalysis.matches} matches)
                </span>
              </div>

              {/* Spectrum Bar */}
              <div className="space-y-1">
                <div className="h-3 w-full rounded-full bg-[#0B0E0C] p-0.5 flex overflow-hidden border border-[#757761]/30">
                  <div
                    className="h-full bg-amber-500/60 rounded-l"
                    style={{ width: "25%" }}
                    title="Under-optimized (0.0% - 0.9%)"
                  />
                  <div
                    className="h-full bg-[#34d399]"
                    style={{ width: "40%" }}
                    title="Optimal Sweet Spot (1.0% - 2.5%)"
                  />
                  <div
                    className="h-full bg-yellow-400/80"
                    style={{ width: "15%" }}
                    title="Elevated (2.6% - 3.5%)"
                  />
                  <div
                    className="h-full bg-rose-500 rounded-r"
                    style={{ width: "20%" }}
                    title="Stuffing Danger (> 3.5%)"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#757761]">
                  <span>0% (Sparse)</span>
                  <span className="text-[#34d399] font-bold">1.0% - 2.5% (Sweet Spot)</span>
                  <span className="text-yellow-400">3.5%</span>
                  <span className="text-rose-400">5.0%+ (Spam Risk)</span>
                </div>
              </div>

              <p className="text-[11px] text-[#505445] dark:text-[#A0A493] leading-relaxed">
                Google, Bing, and AI search systems evaluate contextual semantic relevance without rewarding mechanical repetition. uchitatvam pages maintain an optimal <strong>1.0% – 2.5%</strong> density to preserve human readability and maximum algorithmic trust.
              </p>
            </div>

            {/* Location Distribution Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#141A16] border border-[#757761]/25 space-y-2">
                <span className="font-mono text-[11px] font-bold text-[#121815] dark:text-white flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#34d399]" /> Search Engine Elements
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4F6F5] dark:bg-[#0B0E0C]">
                    <span className="text-[#505445] dark:text-[#A0A493]">Title Tag Presence</span>
                    <span className={`font-mono font-bold ${keywordAnalysis.titleMatches > 0 ? "text-[#34d399]" : "text-red-400"}`}>
                      {keywordAnalysis.titleMatches > 0 ? `✓ Found (${keywordAnalysis.titleMatches})` : "✕ Missing"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4F6F5] dark:bg-[#0B0E0C]">
                    <span className="text-[#505445] dark:text-[#A0A493]">Meta Description</span>
                    <span className={`font-mono font-bold ${keywordAnalysis.descMatches > 0 ? "text-[#34d399]" : "text-red-400"}`}>
                      {keywordAnalysis.descMatches > 0 ? `✓ Found (${keywordAnalysis.descMatches})` : "✕ Missing"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4F6F5] dark:bg-[#0B0E0C]">
                    <span className="text-[#505445] dark:text-[#A0A493]">URL Slug Match</span>
                    <span className={`font-mono font-bold ${keywordAnalysis.pathMatch ? "text-[#34d399]" : "text-amber-400"}`}>
                      {keywordAnalysis.pathMatch ? "✓ Matched" : "✕ Not in Slug"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#141A16] border border-[#757761]/25 space-y-2">
                <span className="font-mono text-[11px] font-bold text-[#121815] dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#f7fe72]" /> AEO &amp; Body Distribution
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4F6F5] dark:bg-[#0B0E0C]">
                    <span className="text-[#505445] dark:text-[#A0A493]">Direct Answer (AEO / LLM)</span>
                    <span className={`font-mono font-bold ${keywordAnalysis.directAnswerMatches > 0 ? "text-[#34d399]" : "text-amber-400"}`}>
                      {keywordAnalysis.directAnswerMatches > 0 ? `✓ Found (${keywordAnalysis.directAnswerMatches})` : "✕ Missing"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4F6F5] dark:bg-[#0B0E0C]">
                    <span className="text-[#505445] dark:text-[#A0A493]">Main Content Occurrences</span>
                    <span className="font-mono font-bold text-white">
                      {keywordAnalysis.bodyMatches} times
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#F4F6F5] dark:bg-[#0B0E0C]">
                    <span className="text-[#505445] dark:text-[#A0A493]">Keywords Taxonomy Array</span>
                    <span className={`font-mono font-bold ${availableKeywords.some((k) => k.toLowerCase() === keywordAnalysis.keyword) ? "text-[#34d399]" : "text-amber-400"}`}>
                      {availableKeywords.some((k) => k.toLowerCase() === keywordAnalysis.keyword) ? "✓ Registered" : "— Unlisted"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Panel>

          {/* TAB 2: OPTIMIZATION OPPORTUNITIES CHECKLIST */}
          <Tabs.Panel id="opportunities" className="space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs text-[#505445] dark:text-[#A0A493]">
                Actionable search ranking checklist for target query:{" "}
                <strong className="text-[#f7fe72]">&ldquo;{targetKeyword}&rdquo;</strong>
              </span>
              {copiedAction && (
                <span className="text-[10px] font-mono text-[#34d399] flex items-center gap-1">
                  <Check className="w-3 h-3" /> Updated {copiedAction}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    opp.status === "pass"
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : opp.status === "warning"
                      ? "bg-amber-500/5 border-amber-500/25"
                      : "bg-red-500/5 border-red-500/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {opp.status === "pass" && <CheckCircle2 className="w-4 h-4 text-[#34d399]" />}
                      {opp.status === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      {opp.status === "fail" && <XCircle className="w-4 h-4 text-red-400" />}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#121815] dark:text-white">{opp.label}</span>
                        <span
                          className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                            opp.status === "pass"
                              ? "bg-emerald-500/15 text-[#34d399]"
                              : opp.status === "warning"
                              ? "bg-amber-500/15 text-amber-400"
                              : "bg-red-500/15 text-red-400"
                          }`}
                        >
                          {opp.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#505445] dark:text-[#CBD2C7] leading-relaxed">
                        {opp.detail}
                      </p>
                    </div>
                  </div>

                  {opp.action && (
                    <button
                      type="button"
                      onClick={opp.action.execute}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono bg-[#18211C] hover:bg-[#25332C] text-[#f7fe72] border border-[#f7fe72]/30 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer self-start sm:self-center"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#f7fe72]" />
                      <span>{opp.action.label}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Tabs.Panel>

          {/* TAB 3: N-GRAM FREQUENCY */}
          <Tabs.Panel id="ngrams" className="space-y-4">
            <p className="text-[11px] text-[#505445] dark:text-[#A0A493]">
              Examines recurring multi-word clusters across the page. Detect if accidental filler words are diluting your primary search focus.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Unigrams (1-Word) */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#141A16] border border-[#757761]/25 space-y-2">
                <span className="font-mono text-[11px] font-bold text-[#121815] dark:text-white flex items-center justify-between pb-1 border-b border-[#757761]/15">
                  <span>Top 1-Word Terms</span>
                  <span className="text-[#757761] text-[10px]">Hits / %</span>
                </span>
                <div className="space-y-1">
                  {ngrams.unigrams.map((item) => (
                    <div
                      key={item.phrase}
                      className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-[#F4F6F5] dark:hover:bg-[#0B0E0C] text-xs font-mono"
                    >
                      <span className="text-[#121815] dark:text-white truncate max-w-[120px]">{item.phrase}</span>
                      <span className="text-[#757761]">
                        <strong className="text-[#34d399]">{item.count}x</strong> ({item.density}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bigrams (2-Word) */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#141A16] border border-[#757761]/25 space-y-2">
                <span className="font-mono text-[11px] font-bold text-[#121815] dark:text-white flex items-center justify-between pb-1 border-b border-[#757761]/15">
                  <span>Top 2-Word Phrases</span>
                  <span className="text-[#757761] text-[10px]">Hits / %</span>
                </span>
                <div className="space-y-1">
                  {ngrams.bigrams.map((item) => (
                    <div
                      key={item.phrase}
                      className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-[#F4F6F5] dark:hover:bg-[#0B0E0C] text-xs font-mono"
                    >
                      <span className="text-[#121815] dark:text-white truncate max-w-[130px]">{item.phrase}</span>
                      <span className="text-[#757761]">
                        <strong className="text-[#f7fe72]">{item.count}x</strong> ({item.density}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trigrams (3-Word) */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#141A16] border border-[#757761]/25 space-y-2">
                <span className="font-mono text-[11px] font-bold text-[#121815] dark:text-white flex items-center justify-between pb-1 border-b border-[#757761]/15">
                  <span>Top 3-Word Phrases</span>
                  <span className="text-[#757761] text-[10px]">Hits / %</span>
                </span>
                <div className="space-y-1">
                  {ngrams.trigrams.map((item) => (
                    <div
                      key={item.phrase}
                      className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-[#F4F6F5] dark:hover:bg-[#0B0E0C] text-xs font-mono"
                    >
                      <span className="text-[#121815] dark:text-white truncate max-w-[140px]">{item.phrase}</span>
                      <span className="text-[#757761]">
                        <strong className="text-blue-400">{item.count}x</strong> ({item.density}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Tabs.Panel>

          {/* TAB 4: LIVE CONTENT SIMULATOR */}
          <Tabs.Panel id="editor" className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#505445] dark:text-[#A0A493]">
                Simulate or edit the page&apos;s body content to test live keyword density adjustments:
              </span>
              <button
                type="button"
                onClick={() => {
                  setBodyContent(initialBodyContent || `${pageTitle}\n\n${pageDescription}`);
                }}
                className="text-[10px] font-mono text-[#757761] hover:text-[#f7fe72] flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Reset to Route Default
              </button>
            </div>

            <textarea
              rows={8}
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              placeholder="Paste article body or write route content here to evaluate density in real time..."
              className="w-full p-3.5 rounded-2xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white font-mono text-xs focus:outline-none focus:border-[#f7fe72] leading-relaxed"
            />

            <div className="flex items-center justify-between text-[11px] font-mono text-[#757761]">
              <span>
                Total Analyzed Words: <strong className="text-white">{totalWords}</strong>
              </span>
              <span>
                Target Matches: <strong className="text-[#f7fe72]">{keywordAnalysis.matches}</strong> (Density:{" "}
                <strong className={statusBadge.text.includes("Optimal") ? "text-[#34d399]" : "text-amber-400"}>
                  {keywordAnalysis.density}%
                </strong>
                )
              </span>
            </div>
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
}
