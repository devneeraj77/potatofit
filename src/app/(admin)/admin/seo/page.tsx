"use client";

import React, { useState } from "react";
import {
  Globe,
  Share2,
  Save,
} from "lucide-react";

export default function SeoManagementPage() {
  const [siteTitle, setSiteTitle] = useState("Uchitatvam // Precision Athletic Fuel & Biometrics");
  const [metaDesc, setMetaDesc] = useState(
    "From Couch Uchit to Global Apex. AI-driven nutrition mapped to your nearest vegetable vendors and local grocers. Fuel smart, track daily quests, and compete with athletes worldwide."
  );
  const [ogImage, setOgImage] = useState("https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=80");
  const [keywords, setKeywords] = useState("athletic fuel, vegetable mandi nutrition, local grocer biometrics, daily quests, uchitatvam, wearable sync");
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Search &amp; Social Distribution
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs font-mono text-[#34d399]">Schema.org &amp; OpenGraph v2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            SEO &amp; Social Cards
          </h1>
          <p className="text-xs text-[#505445] dark:text-[#CBD2C7]">
            Optimize search engine rankings, meta descriptions, OpenGraph social sharing snippets, and robots indexing directives.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{saved ? "Saved & Synced!" : "Save SEO Settings"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Settings */}
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-[#757761]/20">
            <Globe className="w-4 h-4 text-[#f7fe72]" />
            <h2 className="text-sm font-bold text-[#121815] dark:text-white">Global Meta Tags</h2>
          </div>

          <div>
            <label className="block font-mono text-[#505445] dark:text-[#A0A493] mb-1">
              Global HTML Page Title (<code className="text-[#f7fe72] font-mono text-[10px]">&lt;title&gt;</code>)
            </label>
            <input
              type="text"
              required
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-mono text-[#505445] dark:text-[#A0A493]">Meta Description</label>
              <span className={`text-[10px] font-mono ${metaDesc.length > 160 ? "text-amber-400" : "text-[#757761]"}`}>
                {metaDesc.length} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              required
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
            />
          </div>

          <div>
            <label className="block font-mono text-[#505445] dark:text-[#A0A493] mb-1">
              OpenGraph Share Image URL
            </label>
            <input
              type="url"
              required
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white font-mono focus:outline-none focus:border-[#f7fe72]"
            />
          </div>

          <div>
            <label className="block font-mono text-[#505445] dark:text-[#A0A493] mb-1">
              Keywords (Comma separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
            />
          </div>

          {/* Indexing Checkboxes */}
          <div className="pt-2 border-t border-[#757761]/20 space-y-2">
            <span className="font-mono text-[#505445] dark:text-[#A0A493] block">Robots Directives</span>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={robotsIndex}
                  onChange={(e) => setRobotsIndex(e.target.checked)}
                  className="rounded border-[#757761]/30 text-[#f7fe72] focus:ring-0"
                />
                <span className="text-xs text-[#121815] dark:text-white">Allow Search Indexing (<code className="text-[#f7fe72] font-mono text-[10px]">index</code>)</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={robotsFollow}
                  onChange={(e) => setRobotsFollow(e.target.checked)}
                  className="rounded border-[#757761]/30 text-[#f7fe72] focus:ring-0"
                />
                <span className="text-xs text-[#121815] dark:text-white">Follow Outbound Links (<code className="text-[#f7fe72] font-mono text-[10px]">follow</code>)</span>
              </label>
            </div>
          </div>
        </form>

        {/* Live Previews */}
        <div className="space-y-6">
          {/* Google Search Card Preview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#757761]/20">
              <span className="text-xs font-mono font-bold text-[#505445] dark:text-[#A0A493] uppercase">
                Google Search Snippet Preview
              </span>
              <span className="text-[10px] font-mono text-[#34d399]">Live Result Simulation</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#141A16] border border-[#757761]/20 space-y-1">
              <div className="text-[11px] text-[#757761] font-mono flex items-center gap-1 truncate">
                <span>https://uchitatvam.com</span>
                <span>›</span>
                <span>precision-fuel</span>
              </div>
              <div className="text-sm font-semibold text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                {siteTitle}
              </div>
              <div className="text-xs text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2 leading-relaxed">
                {metaDesc}
              </div>
            </div>
          </div>

          {/* Social Share Card Preview (WhatsApp / X / LinkedIn) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#757761]/20">
              <span className="text-xs font-mono font-bold text-[#505445] dark:text-[#A0A493] uppercase">
                Social OpenGraph Card Preview
              </span>
              <Share2 className="w-3.5 h-3.5 text-[#f7fe72]" />
            </div>

            <div className="rounded-2xl border border-[#757761]/25 overflow-hidden bg-[#F4F6F5] dark:bg-[#141A16]">
              <div className="relative h-44 bg-black overflow-hidden">
                <img
                  src={ogImage}
                  alt="OG Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3.5 space-y-1">
                <div className="text-[10px] font-mono uppercase text-[#757761]">
                  UCHITATVAM.COM
                </div>
                <div className="text-xs font-bold text-[#121815] dark:text-white line-clamp-1">
                  {siteTitle}
                </div>
                <div className="text-[11px] text-[#505445] dark:text-[#A0A493] line-clamp-2">
                  {metaDesc}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
