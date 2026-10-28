"use client";

import React, { useState } from "react";
import {
  Braces,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Trash2,
  Edit,
  Lock,
  Unlock,
  Code2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  Tag,
  RefreshCw,
  X,
  FileCode,
} from "lucide-react";
import type {
  JsonLdSnippet,
  SchemaType,
  SchemaTargetType,
} from "@/lib/seo-types";

const PRESET_TEMPLATES: Record<
  SchemaType,
  { name: string; targetType: SchemaTargetType; targetPath: string; template: object }
> = {
  WebApplication: {
    name: "Web Application Schema",
    targetType: "global",
    targetPath: "global",
    template: {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": "{canonicalBaseUrl}/#webapp-schema",
      name: "{siteName}",
      url: "{canonicalBaseUrl}",
      applicationCategory: "HealthApplication",
      operatingSystem: "All (PWA, iOS, Android, Web)",
      description: "{defaultDescription}",
      browserRequirements: "Requires JavaScript. Requires HTML5.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
      },
    },
  },
  Organization: {
    name: "Organization & Knowledge Graph",
    targetType: "global",
    targetPath: "global",
    template: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "{canonicalBaseUrl}/#org-schema",
      name: "{siteName}",
      url: "{canonicalBaseUrl}",
      logo: {
        "@type": "ImageObject",
        url: "{canonicalBaseUrl}/uchitatvam-logo.svg",
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://twitter.com/UchitatvamFit",
        "https://instagram.com/uchitatvam.fit",
        "https://linkedin.com/company/uchitatvam",
      ],
      founder: {
        "@type": "Person",
        name: "Neeraj Rekwar",
        jobTitle: "Lead Founder & Architect",
      },
    },
  },
  WebSite: {
    name: "WebSite Search Action",
    targetType: "global",
    targetPath: "global",
    template: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "{canonicalBaseUrl}/#website-schema",
      url: "{canonicalBaseUrl}",
      name: "{siteName}",
      description: "{defaultDescription}",
      potentialAction: {
        "@type": "SearchAction",
        target: "{canonicalBaseUrl}/blog?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  },
  Article: {
    name: "Dynamic Sports Science Article",
    targetType: "dynamic",
    targetPath: "/blog/[slug]",
    template: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "{title}",
      description: "{excerpt}",
      image: "{coverImage}",
      author: {
        "@type": "Person",
        name: "{authorName}",
      },
      publisher: {
        "@type": "Organization",
        name: "{siteName}",
        logo: {
          "@type": "ImageObject",
          url: "{canonicalBaseUrl}/uchitatvam-logo.svg",
        },
      },
      datePublished: "{publishedAt}",
      dateModified: "{updatedAt}",
      articleSection: "{categoryName}",
    },
  },
  FAQPage: {
    name: "Rich FAQPage Schema",
    targetType: "static",
    targetPath: "/rewards",
    template: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "{canonicalBaseUrl}/rewards#faq-schema",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do athletes earn potato tokens in Uchitatvam?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Athletes earn tokens by verifying daily hydration, sourcing whole foods from certified local mandis, and keeping wearable sync active.",
          },
        },
        {
          "@type": "Question",
          name: "Where can rewards be redeemed?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tokens can be redeemed for organic produce vouchers at partner vegetable stalls in Indore, Bhopal, Delhi NCR, and Bengaluru.",
          },
        },
      ],
    },
  },
  LocalBusiness: {
    name: "Mandi Hub LocalBusiness Schema",
    targetType: "dynamic",
    targetPath: "/vendors/[city]",
    template: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Certified Vegetable Mandis & Grocers in {city}",
      description: "Verified network of local farmers and kirana stores supplying high-potency sports nutrition in {city}.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "{city}",
        addressCountry: "IN",
      },
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, UPI",
    },
  },
  Product: {
    name: "Athletic Fuel Nutrition Product",
    targetType: "dynamic",
    targetPath: "/protocols/[id]",
    template: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "{protocolName} Whole Food Nutrition Kit",
      description: "Clinically calculated sports nutrition pack assembled from fresh local mandi whole ingredients.",
      brand: {
        "@type": "Brand",
        name: "Uchitatvam Local",
      },
      offers: {
        "@type": "Offer",
        price: "150",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    },
  },
  Recipe: {
    name: "Athletic Fuel Meal Recipe",
    targetType: "dynamic",
    targetPath: "/protocols/[id]",
    template: {
      "@context": "https://schema.org",
      "@type": "Recipe",
      name: "{protocolName} Recovery Bowl",
      description: "High-leucine recovery meal calculated from local Indian mandi produce.",
      prepTime: "PT15M",
      cookTime: "PT10M",
      recipeCategory: "SportsNutrition",
      nutrition: {
        "@type": "NutritionInformation",
        calories: "480 calories",
        proteinContent: "32 g",
        carbohydrateContent: "64 g",
        sodiumContent: "420 mg",
      },
      recipeIngredient: [
        "100g Roasted Bengal Gram (Sattu)",
        "150g Fresh Artisanal Paneer or Curd",
        "250ml Fresh Tender Coconut Water",
      ],
    },
  },
  HowTo: {
    name: "Movement & Biometric Cadence HowTo",
    targetType: "dynamic",
    targetPath: "/protocols/[id]",
    template: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "{protocolName} Biometric Cadence",
      description: "Step-by-step movement execution and heart rate target alignment.",
      totalTime: "PT45M",
      step: [
        {
          "@type": "HowToStep",
          name: "Zone 2 Nasal Breathing Base",
          text: "Sustain steady nasal respiration at 65-75% maximum heart rate.",
        },
        {
          "@type": "HowToStep",
          name: "Intra-Set Recovery",
          text: "Rest 90-120 seconds between maximal compound efforts.",
        },
      ],
    },
  },
  SpeakableSpecification: {
    name: "Voice & Smart Speaker Speakable",
    targetType: "global",
    targetPath: "global",
    template: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "{canonicalBaseUrl}/#speakable-schema",
      url: "{canonicalBaseUrl}",
      name: "{siteName}",
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#aeo-summary", "#aeo-faq", "h1", ".protocol-summary"],
      },
    },
  },
  Custom: {
    name: "Custom JSON-LD Schema",
    targetType: "global",
    targetPath: "global",
    template: {
      "@context": "https://schema.org",
      "@type": "Thing",
      name: "{siteName} Custom Snippet",
      description: "Custom structured data for search engine bots.",
    },
  },
};

const SUGGESTED_TOKENS = [
  "{canonicalBaseUrl}",
  "{siteName}",
  "{defaultTitle}",
  "{defaultDescription}",
  "{title}",
  "{excerpt}",
  "{coverImage}",
  "{authorName}",
  "{categoryName}",
  "{city}",
  "{protocolName}",
];

interface JsonLdSchemaBuilderProps {
  schemas: JsonLdSnippet[];
  devModeEnabled: boolean;
  onRefresh: () => Promise<void>;
  onToggleDevMode?: () => Promise<void>;
}

export default function JsonLdSchemaBuilder({
  schemas,
  devModeEnabled,
  onRefresh,
  onToggleDevMode,
}: JsonLdSchemaBuilderProps) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterScope, setFilterScope] = useState<"all" | "global" | "static" | "dynamic">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modal / Builder Drawer State
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderSnippet, setBuilderSnippet] = useState<JsonLdSnippet | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // Validate JSON string
  const validateJson = (raw: string): boolean => {
    try {
      // Substitute placeholders temporarily for JSON syntax test
      const testString = raw.replace(/\{[a-zA-Z0-9_]+\}/g, "placeholder");
      JSON.parse(testString);
      setJsonError(null);
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid JSON syntax";
      setJsonError(msg);
      return false;
    }
  };

  // Open modal to create a new schema
  const handleOpenCreate = (presetType: SchemaType = "WebApplication") => {
    const preset = PRESET_TEMPLATES[presetType];
    const newSnippet: JsonLdSnippet = {
      id: "schema-" + Date.now().toString(36),
      name: preset.name,
      type: presetType,
      targetType: preset.targetType,
      targetPath: preset.targetPath,
      enabled: true,
      description: `Structured data markup for ${preset.name}.`,
      jsonContent: JSON.stringify(preset.template, null, 2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBuilderSnippet(newSnippet);
    setJsonError(null);
    setIsBuilderOpen(true);
  };

  // Open modal to edit existing schema
  const handleOpenEdit = (snippet: JsonLdSnippet) => {
    setBuilderSnippet({ ...snippet });
    validateJson(snippet.jsonContent);
    setIsBuilderOpen(true);
  };

  // Preset selector in modal
  const handleSelectPreset = (type: SchemaType) => {
    if (!builderSnippet) return;
    const preset = PRESET_TEMPLATES[type];
    setBuilderSnippet({
      ...builderSnippet,
      name: preset.name,
      type: type,
      targetType: preset.targetType,
      targetPath: preset.targetPath,
      jsonContent: JSON.stringify(preset.template, null, 2),
    });
    setJsonError(null);
  };

  // Insert token chip into JSON
  const handleInsertToken = (token: string) => {
    if (!builderSnippet) return;
    setBuilderSnippet({
      ...builderSnippet,
      jsonContent: builderSnippet.jsonContent + `\n// Token: "${token}"`,
    });
    validateJson(builderSnippet.jsonContent);
  };

  // Format JSON
  const handleFormatJson = () => {
    if (!builderSnippet) return;
    try {
      const parsed = JSON.parse(builderSnippet.jsonContent);
      setBuilderSnippet({
        ...builderSnippet,
        jsonContent: JSON.stringify(parsed, null, 2),
      });
      setJsonError(null);
    } catch {
      // Keep as-is if syntax has placeholders
    }
  };

  // Save Schema via API
  const handleSaveSchema = async () => {
    if (!builderSnippet) return;

    if (!builderSnippet.name.trim()) {
      showFeedback("Please provide a name for this schema snippet.", "error");
      return;
    }

    if (!validateJson(builderSnippet.jsonContent)) {
      showFeedback("Please fix the JSON syntax error before saving.", "error");
      return;
    }

    // Safety check for static pages when Dev Mode is off
    if (builderSnippet.targetType === "static" && !devModeEnabled) {
      showFeedback(
        "Static page schemas are safety-locked. Please toggle Dev Mode ON in the On-Page tab to edit static schemas.",
        "error"
      );
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "save_schema",
          snippet: builderSnippet,
          forceDevMode: devModeEnabled,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showFeedback(
          `Schema "${builderSnippet.name}" saved and injected into root metadata.`
        );
        setIsBuilderOpen(false);
        setBuilderSnippet(null);
        await onRefresh();
      } else {
        showFeedback(data.error || "Failed to save schema.", "error");
      }
    } catch {
      showFeedback("Network error saving schema.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle schema status
  const handleToggleSchema = async (snippet: JsonLdSnippet) => {
    if (snippet.targetType === "static" && !devModeEnabled) {
      showFeedback(
        `Cannot toggle static schema "${snippet.name}" without Dev Mode. Toggle Dev Mode ON first.`,
        "error"
      );
      return;
    }

    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "toggle_schema",
          id: snippet.id,
          enabled: !snippet.enabled,
          forceDevMode: devModeEnabled,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback(
          `Schema "${snippet.name}" is now ${!snippet.enabled ? "ACTIVE (Injected into root)" : "INACTIVE"}.`
        );
        await onRefresh();
      } else {
        showFeedback(data.error || "Failed to toggle schema.", "error");
      }
    } catch {
      showFeedback("Network error toggling schema.", "error");
    }
  };

  // Delete Schema
  const handleDeleteSchema = async (snippet: JsonLdSnippet) => {
    if (snippet.targetType === "static" && !devModeEnabled) {
      showFeedback(
        `Deleting static schema "${snippet.name}" requires Dev Mode.`,
        "error"
      );
      return;
    }

    if (!confirm(`Are you sure you want to delete schema "${snippet.name}"?`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "delete_schema",
          id: snippet.id,
          forceDevMode: devModeEnabled,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback(`Schema "${snippet.name}" deleted successfully.`);
        await onRefresh();
      } else {
        showFeedback(data.error || "Failed to delete schema.", "error");
      }
    } catch {
      showFeedback("Network error deleting schema.", "error");
    }
  };

  // Copy Schema JSON
  const handleCopyJson = (snippet: JsonLdSnippet) => {
    navigator.clipboard.writeText(snippet.jsonContent);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2500);
    showFeedback("JSON-LD markup copied to clipboard.");
  };

  // Duplicate / Clone Schema
  const handleDuplicate = (snippet: JsonLdSnippet) => {
    const clone: JsonLdSnippet = {
      ...snippet,
      id: "schema-" + Date.now().toString(36),
      name: `${snippet.name} (Copy)`,
      enabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBuilderSnippet(clone);
    setIsBuilderOpen(true);
  };

  // Filtering
  const filteredSchemas = schemas.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.targetPath.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || s.type === filterType;
    const matchesScope = filterScope === "all" || s.targetType === filterScope;
    return matchesSearch && matchesType && matchesScope;
  });

  const activeCount = schemas.filter((s) => s.enabled).length;
  const staticCount = schemas.filter((s) => s.targetType === "static").length;
  const dynamicCount = schemas.filter((s) => s.targetType === "dynamic").length;
  const globalCount = schemas.filter((s) => s.targetType === "global").length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between border ${
            feedbackMsg.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === "success" ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-white/60 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0E1310] via-[#121815] to-[#0E1310] border border-[#f7fe72]/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-[#f7fe72]/15 text-[#f7fe72]">
                <Braces className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                JSON-LD Schema Builder &amp; Root Metadata Injector
              </h2>
            </div>
            <p className="text-xs text-[#CBD2C7] leading-relaxed max-w-3xl">
              Construct, calibrate, and automatically snippet Schema.org structured data directly into the platform&apos;s root metadata (`&lt;StructuredData&gt;`). Supports both <strong>Static Pages</strong> (protected by Dev Mode safety lock) and <strong>Dynamic Route Templates</strong> with token variables for Google Rich Results and AI search bot comprehension.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenCreate("WebApplication")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Build New Schema</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#757761]/20">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-mono text-[#A0A493]">Active In Root</div>
            <div className="text-lg font-black text-[#34d399] font-mono">
              {activeCount} / {schemas.length}
            </div>
            <div className="text-[9px] text-[#34d399] font-mono">● Auto-injected in &lt;head&gt;</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-mono text-[#A0A493]">Platform Global</div>
            <div className="text-lg font-black text-[#f7fe72] font-mono">{globalCount}</div>
            <div className="text-[9px] text-[#A0A493] font-mono">Applies to all platform routes</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-mono text-[#A0A493]">Static Page Schemas</div>
            <div className="text-lg font-black text-white font-mono flex items-center gap-1.5">
              <span>{staticCount}</span>
              {devModeEnabled ? (
                <span className="text-[10px] text-emerald-400 font-sans font-medium flex items-center gap-0.5">
                  <Unlock className="w-3 h-3" /> Unlocked
                </span>
              ) : (
                <span className="text-[10px] text-amber-400 font-sans font-medium flex items-center gap-0.5">
                  <Lock className="w-3 h-3" /> Dev Mode Req
                </span>
              )}
            </div>
            <div className="text-[9px] text-[#A0A493] font-mono">/, /rewards, /leaderboards</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-mono text-[#A0A493]">Dynamic Route Schemas</div>
            <div className="text-lg font-black text-sky-400 font-mono">{dynamicCount}</div>
            <div className="text-[9px] text-sky-400 font-mono">/blog/[slug], /protocols/[id]</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schemas by name, route, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Scope Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#505445] dark:text-[#A0A493]">
            <Layers className="w-3.5 h-3.5" />
            <span>Scope:</span>
            <select
              value={filterScope}
              onChange={(e) =>
                setFilterScope(e.target.value as "all" | "global" | "static" | "dynamic")
              }
              className="px-2.5 py-1.5 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
            >
              <option value="all">All Scopes</option>
              <option value="global">Global (Platform-Wide)</option>
              <option value="static">Static Pages</option>
              <option value="dynamic">Dynamic Routes</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#505445] dark:text-[#A0A493]">
            <Tag className="w-3.5 h-3.5" />
            <span>Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="WebApplication">WebApplication</option>
              <option value="Organization">Organization</option>
              <option value="WebSite">WebSite</option>
              <option value="Article">Article</option>
              <option value="FAQPage">FAQPage</option>
              <option value="LocalBusiness">LocalBusiness</option>
              <option value="Product">Product</option>
              <option value="Recipe">Recipe</option>
              <option value="HowTo">HowTo</option>
              <option value="SpeakableSpecification">SpeakableSpecification</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Schema Cards Grid */}
      <div className="space-y-4">
        {filteredSchemas.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-3">
            <Braces className="w-8 h-8 text-[#757761] mx-auto" />
            <p className="text-sm font-semibold text-[#121815] dark:text-white">
              No schema snippets found matching your filters.
            </p>
            <button
              type="button"
              onClick={() => handleOpenCreate("WebApplication")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Schema</span>
            </button>
          </div>
        ) : (
          filteredSchemas.map((snippet) => {
            const isExpanded = expandedId === snippet.id;
            const isStaticLocked = snippet.targetType === "static" && !devModeEnabled;

            return (
              <div
                key={snippet.id}
                className={`p-5 rounded-3xl bg-white dark:bg-[#0E1310] border transition-all ${
                  snippet.enabled
                    ? "border-[#757761]/30 hover:border-[#f7fe72]/50 shadow-xs"
                    : "border-[#757761]/15 opacity-70"
                }`}
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#121815] dark:text-white">
                        {snippet.name}
                      </span>

                      {/* Type Badge */}
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase bg-[#f7fe72]/15 text-[#7A5A00] dark:text-[#f7fe72] border border-[#f7fe72]/30">
                        {snippet.type}
                      </span>

                      {/* Scope Badge */}
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium ${
                          snippet.targetType === "global"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                            : snippet.targetType === "static"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                        }`}
                      >
                        {snippet.targetType === "global"
                          ? "Global Root"
                          : snippet.targetType === "static"
                          ? `Static: ${snippet.targetPath}`
                          : `Dynamic: ${snippet.targetPath}`}
                      </span>

                      {/* Static Lock Badge */}
                      {isStaticLocked && (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono bg-amber-500/15 text-amber-400 border border-amber-500/40"
                          title="Editing this static schema is locked. Toggle Dev Mode ON to modify."
                        >
                          <Lock className="w-3 h-3" />
                          <span>Dev Lock</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#505445] dark:text-[#A0A493]">
                      {snippet.description || "JSON-LD structured data definition for search crawlers."}
                    </p>
                  </div>

                  {/* Actions & Live Toggle */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Live Enable/Disable Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleSchema(snippet)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        snippet.enabled
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                          : "bg-white/5 text-[#757761] border border-white/10 hover:text-white"
                      }`}
                      title={
                        snippet.enabled
                          ? "Active: Snippet is injected into platform root metadata"
                          : "Disabled: Snippet will not be rendered in <head>"
                      }
                    >
                      {snippet.enabled ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Injected in Root</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-[#757761]" />
                          <span>Disabled (Draft)</span>
                        </>
                      )}
                    </button>

                    {/* Copy JSON */}
                    <button
                      type="button"
                      onClick={() => handleCopyJson(snippet)}
                      className="p-2 rounded-xl text-[#CBD2C7] hover:text-white hover:bg-white/10 transition-colors"
                      title="Copy JSON-LD markup"
                    >
                      {copiedId === snippet.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    {/* Edit in Builder */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(snippet)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    {/* Duplicate */}
                    <button
                      type="button"
                      onClick={() => handleDuplicate(snippet)}
                      className="p-2 rounded-xl text-[#757761] hover:text-white hover:bg-white/10 transition-colors"
                      title="Duplicate schema snippet"
                    >
                      <Layers className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteSchema(snippet)}
                      className="p-2 rounded-xl text-[#757761] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete schema snippet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Expand/Collapse Code Preview */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : snippet.id)}
                      className="p-2 rounded-xl text-[#757761] hover:text-white hover:bg-white/10 transition-colors"
                      title={isExpanded ? "Collapse preview" : "View JSON markup"}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible JSON Preview */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#757761]/20 space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#A0A493]">
                      <span>JSON-LD Output Preview:</span>
                      <span>Target: {snippet.targetPath}</span>
                    </div>
                    <pre className="p-4 rounded-2xl bg-[#080B09] border border-[#757761]/30 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-72">
                      <code>{snippet.jsonContent}</code>
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* SCHEMA BUILDER MODAL / DRAWER                                            */}
      {/* ========================================================================= */}
      {isBuilderOpen && builderSnippet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl p-6 sm:p-8 rounded-3xl bg-[#0E1310] border-2 border-[#f7fe72]/50 shadow-2xl text-white space-y-6 my-8">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#757761]/25">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#f7fe72]/20 text-[#f7fe72]">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {builderSnippet.id ? "Edit JSON-LD Schema Snippet" : "Build New Schema Snippet"}
                  </h3>
                  <p className="text-xs text-[#A0A493]">
                    Configure structured data properties and automatic injection into the platform root metadata.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBuilderOpen(false)}
                className="p-2 rounded-xl text-[#757761] hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dev Mode Safety Lock Notice for Static Pages */}
            {builderSnippet.targetType === "static" && !devModeEnabled && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Dev Mode Safety Lock Active:</strong> Static page schemas ({builderSnippet.targetPath}) can only be saved when Dev Mode is toggled ON.
                  </span>
                </div>
                {onToggleDevMode && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onToggleDevMode();
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-400 text-black hover:bg-amber-300 transition-colors shrink-0"
                  >
                    Enable Dev Mode
                  </button>
                )}
              </div>
            )}

            {/* Preset Templates Quick Switcher */}
            <div>
              <label className="block text-xs font-mono text-[#A0A493] mb-1.5">
                Quick Template Presets (Auto-populates Schema.org structure):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    "WebApplication",
                    "Organization",
                    "WebSite",
                    "Article",
                    "FAQPage",
                    "LocalBusiness",
                    "Recipe",
                    "Product",
                    "HowTo",
                    "SpeakableSpecification",
                    "Custom",
                  ] as SchemaType[]
                ).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleSelectPreset(type)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                      builderSnippet.type === type
                        ? "bg-[#f7fe72] text-[#0B0E0C] font-bold shadow-xs"
                        : "bg-white/5 text-[#CBD2C7] border border-white/10 hover:bg-white/15"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields: Name, Scope, Target Path */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Schema Name</label>
                <input
                  type="text"
                  value={builderSnippet.name}
                  onChange={(e) =>
                    setBuilderSnippet({ ...builderSnippet, name: e.target.value })
                  }
                  placeholder="e.g. Dynamic Sports Science Article"
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Target Scope</label>
                <select
                  value={builderSnippet.targetType}
                  onChange={(e) => {
                    const newScope = e.target.value as SchemaTargetType;
                    const defaultPath =
                      newScope === "global"
                        ? "global"
                        : newScope === "static"
                        ? "/"
                        : "/blog/[slug]";
                    setBuilderSnippet({
                      ...builderSnippet,
                      targetType: newScope,
                      targetPath: defaultPath,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white focus:outline-none"
                >
                  <option value="global">Global (Platform Root)</option>
                  <option value="static">Static Page (Protected by Dev Mode)</option>
                  <option value="dynamic">Dynamic Route Template</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Target Route Path</label>
                <input
                  type="text"
                  value={builderSnippet.targetPath}
                  onChange={(e) =>
                    setBuilderSnippet({ ...builderSnippet, targetPath: e.target.value })
                  }
                  placeholder={
                    builderSnippet.targetType === "global"
                      ? "global"
                      : builderSnippet.targetType === "static"
                      ? "/, /rewards, /leaderboards"
                      : "/blog/[slug], /protocols/[id]"
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white font-mono focus:outline-none focus:border-[#f7fe72]"
                />
              </div>
            </div>

            {/* Template Variables Helper */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#A0A493] mb-1.5">
                <span>Available Dynamic Tokens (Click token to append to code):</span>
                <span>Auto-replaced at runtime</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_TOKENS.map((token) => (
                  <button
                    key={token}
                    type="button"
                    onClick={() => handleInsertToken(token)}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-[#f7fe72]/10 text-[#f7fe72] border border-[#f7fe72]/20 hover:bg-[#f7fe72]/25 cursor-pointer"
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#A0A493] flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-[#f7fe72]" />
                  <span>JSON-LD Code Editor:</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFormatJson}
                    className="text-[11px] font-mono text-[#f7fe72] hover:underline"
                  >
                    Format JSON
                  </button>
                </div>
              </div>

              <textarea
                rows={12}
                value={builderSnippet.jsonContent}
                onChange={(e) => {
                  const val = e.target.value;
                  setBuilderSnippet({ ...builderSnippet, jsonContent: val });
                  validateJson(val);
                }}
                className="w-full p-4 rounded-2xl bg-[#080B09] border border-[#757761]/40 text-emerald-400 font-mono text-xs focus:outline-none focus:border-[#f7fe72] leading-relaxed"
              />

              {/* Validation Status Indicator */}
              {jsonError ? (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Syntax Error: {jsonError}</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Valid JSON-LD Schema ✓ (Ready to inject in platform root metadata)</span>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#757761]/25">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-xs text-[#CBD2C7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={builderSnippet.enabled}
                    onChange={(e) =>
                      setBuilderSnippet({ ...builderSnippet, enabled: e.target.checked })
                    }
                    className="rounded border-[#757761] text-[#f7fe72] focus:ring-0"
                  />
                  <span>Inject into platform root metadata immediately</span>
                </label>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#CBD2C7] hover:text-white hover:bg-white/10 transition-colors w-full sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSaving || Boolean(jsonError)}
                  onClick={handleSaveSchema}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs w-full sm:w-auto cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Save &amp; Inject Schema</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
