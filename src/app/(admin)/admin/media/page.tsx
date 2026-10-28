"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Search,
  Filter,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface MediaAsset {
  id: string;
  title: string;
  category: "Articles" | "Badges" | "Protocols" | "Logos";
  url: string;
  dimensions: string;
  size: string;
  uploadedAt: string;
}

const INITIAL_ASSETS: MediaAsset[] = [
  {
    id: "media-1",
    title: "Mandi Vegetable Nutrition Hero Banner",
    category: "Articles",
    url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=80",
    dimensions: "1920 × 1080",
    size: "420 KB",
    uploadedAt: "2026-10-15",
  },
  {
    id: "media-2",
    title: "Sub-100ms Biometric Telemetry Graphic",
    category: "Protocols",
    url: "https://images.unsplash.com/photo-1510519138161-58474ebf8444?w=1200&q=80",
    dimensions: "1200 × 800",
    size: "310 KB",
    uploadedAt: "2026-10-20",
  },
  {
    id: "media-3",
    title: "Apex Level 4 Athlete Badge",
    category: "Badges",
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80",
    dimensions: "600 × 600",
    size: "180 KB",
    uploadedAt: "2026-10-22",
  },
  {
    id: "media-4",
    title: "Organic Desi Ghee & Farm Paneer Illustration",
    category: "Articles",
    url: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=1200&q=80",
    dimensions: "1600 × 900",
    size: "520 KB",
    uploadedAt: "2026-10-24",
  },
  {
    id: "media-5",
    title: "Sprint Interval Heart Rate Velocity",
    category: "Protocols",
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80",
    dimensions: "1400 × 900",
    size: "460 KB",
    uploadedAt: "2026-10-26",
  },
  {
    id: "media-6",
    title: "Uchitatvam Emblem Cyber Lime Vector",
    category: "Logos",
    url: "/universal-uchi-logo.svg",
    dimensions: "512 × 512",
    size: "12 KB",
    uploadedAt: "2026-01-01",
  },
];

export default function MediaManagementPage() {
  const [assets, setAssets] = useState<MediaAsset[]>(INITIAL_ASSETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New asset form
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newCategory, setNewCategory] = useState<"Articles" | "Badges" | "Protocols" | "Logos">("Articles");
  const [newDim, setNewDim] = useState("1200 × 800");

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Remove this asset from media library?")) {
      setAssets((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    const asset: MediaAsset = {
      id: "media-" + Date.now().toString(36),
      title: newTitle.trim(),
      url: newUrl.trim(),
      category: newCategory,
      dimensions: newDim.trim(),
      size: "350 KB",
      uploadedAt: new Date().toISOString().split("T")[0],
    };

    setAssets([asset, ...assets]);
    setShowAddModal(false);
    setNewTitle("");
    setNewUrl("");
  };

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "all" || a.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Content &amp; Design Assets
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs font-mono text-[#34d399]">Media CDN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            Media &amp; Asset Library
          </h1>
          <p className="text-xs text-[#505445] dark:text-[#CBD2C7]">
            Upload, manage, and copy public URLs for article headers, protocol graphics, brand marks, and badges.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Media URL</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by title or url..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-xs text-[#121815] dark:text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#757761]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-xs text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
          >
            <option value="all">All Categories</option>
            <option value="Articles">Articles</option>
            <option value="Protocols">Protocols</option>
            <option value="Badges">Badges</option>
            <option value="Logos">Logos</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 overflow-hidden flex flex-col justify-between hover:border-[#f7fe72]/50 transition-all shadow-xs"
          >
            {/* Image Preview Box */}
            <div className="relative h-44 bg-[#141A16] overflow-hidden group">
              <img
                src={asset.url}
                alt={asset.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="absolute top-2.5 left-2.5 text-[10px] font-mono uppercase bg-black/70 backdrop-blur-xs text-[#f7fe72] border border-[#757761]/40 px-2 py-0.5 rounded font-bold">
                {asset.category}
              </span>
              <span className="absolute top-2.5 right-2.5 text-[10px] font-mono bg-black/70 backdrop-blur-xs text-[#A0A493] px-2 py-0.5 rounded">
                {asset.size}
              </span>
            </div>

            {/* Info and Actions */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="text-xs font-bold text-[#121815] dark:text-white truncate" title={asset.title}>
                  {asset.title}
                </h3>
                <div className="text-[10px] font-mono text-[#757761] mt-0.5">
                  {asset.dimensions} • {asset.uploadedAt}
                </div>
              </div>

              <div className="flex items-center gap-1.5 pt-2 border-t border-[#757761]/15">
                <button
                  type="button"
                  onClick={() => handleCopy(asset.id, asset.url)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-mono bg-[#F4F6F5] dark:bg-[#141A16] hover:bg-[#EAEFEA] dark:hover:bg-[#1B231D] text-[#121815] dark:text-white border border-[#757761]/25 transition-colors"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#34d399]" />
                      <span className="text-[#34d399]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#757761]" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={asset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-[#757761] hover:text-white hover:bg-[#757761]/20 transition-colors"
                  title="View Image in New Tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(asset.id)}
                  className="p-1.5 rounded-lg text-[#757761] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete Asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Asset */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-[#0E1310] border border-[#757761]/35 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#757761]/25">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f7fe72]" />
                <h3 className="text-base font-bold text-white">Register Media Asset</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-[#757761] hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Asset Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iron Rich Local Vegetables"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div>
                <label className="block font-mono text-[#A0A493] mb-1">Public Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white font-mono placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[#A0A493] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as "Articles" | "Badges" | "Protocols" | "Logos")}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white focus:outline-none focus:border-[#f7fe72]"
                  >
                    <option value="Articles">Articles</option>
                    <option value="Protocols">Protocols</option>
                    <option value="Badges">Badges</option>
                    <option value="Logos">Logos</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[#A0A493] mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={newDim}
                    onChange={(e) => setNewDim(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#141A16] border border-[#757761]/30 text-white font-mono focus:outline-none focus:border-[#f7fe72]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#757761]/25">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl text-xs text-[#A0A493] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors cursor-pointer"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
