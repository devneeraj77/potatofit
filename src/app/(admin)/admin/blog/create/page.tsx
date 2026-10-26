"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import type { BlogCategory } from "@/lib/blog-store";

const TiptapNotionEditor = dynamic(
  () => import("@/components/admin/TiptapNotionEditor"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full min-h-[340px] rounded-2xl border border-[#757761]/25 bg-white dark:bg-[#0E1310] flex items-center justify-center text-xs text-[#757761]">
        Loading Notion-style Editor...
      </div>
    ),
  }
);

export default function CreateBlogPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverImage, setCoverImage] = useState("/assets/aistudio/image_b79abc29.png");
  const [readTime, setReadTime] = useState("5 min read");
  const [tagsInput, setTagsInput] = useState("Athletic Fuel, Longevity, Kirana");
  const [authorName, setAuthorName] = useState("Neeraj Rekwar");
  const [authorRole, setAuthorRole] = useState("Lead Performance Architect");
  const [contentHtml, setContentHtml] = useState(`
    <h2>1. The Primary Bio-Energetic Principle</h2>
    <p>Describe your athletic methodology, nutrient partitioning strategy, or barbell kinematic analysis here.</p>
    <blockquote>
      <p><strong>Uchitatvam Law:</strong> Consistency compounds faster than uncalculated volume.</p>
    </blockquote>
    <h3>Biometric Data Benchmarks</h3>
    <ul>
      <li>Heart Rate Variability (rMSSD) recovery threshold</li>
      <li>Zone 2 cardiovascular base requirements</li>
      <li>Post-workout electrolyte restoration</li>
    </ul>
  `);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.success && data.categories.length > 0) {
          setCategories(data.categories);
          setCategoryId(data.categories[0].id);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  // Auto-generate slug from title if user hasn't typed custom slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(generated);
  };

  const handleSubmit = async (submitStatus: "draft" | "published") => {
    if (!title.trim()) {
      setErrorMsg("Article title is required.");
      return;
    }
    setErrorMsg("");
    setSubmitting(true);

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      excerpt,
      content: contentHtml,
      categoryId,
      coverImage,
      readTime,
      tags: tagsArray,
      status: submitStatus,
      author: {
        name: authorName,
        role: authorRole,
      },
    };

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to create article.");
        setSubmitting(false);
        return;
      }

      router.push("/admin/blog");
    } catch (err) {
      setErrorMsg("An unexpected network error occurred.");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#757761]/25">
        <div>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 text-xs text-[#505445] dark:text-[#A0A493] hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Separate Article Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            Create Performance Article
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("draft")}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#121815] dark:text-[#CBD2C7] bg-white dark:bg-[#18211C] border border-[#757761]/35 hover:bg-[#757761]/15 transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmit("published")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{submitting ? "Publishing..." : "Publish Article"}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form Fields */}
      <div className="space-y-6">
        {/* Title Input */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider font-mono text-[#505445] dark:text-[#A0A493] mb-1.5">
              Article Title *
            </label>
            <input
              type="text"
              placeholder="e.g., The Circadian Protocol for Peak Barbell Velocity..."
              value={title}
              onChange={handleTitleChange}
              className="w-full px-4 py-3 text-base sm:text-lg font-bold rounded-xl bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
            />
          </div>

          {/* Slug & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                URL Slug
              </label>
              <div className="flex items-center rounded-xl bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 px-3 py-2 text-xs">
                <span className="text-[#757761] font-mono mr-1">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-transparent text-[#121815] dark:text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                Taxonomy Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold font-mono text-[#505445] dark:text-[#A0A493] mb-1">
              Short Editorial Summary / Excerpt
            </label>
            <textarea
              rows={2}
              placeholder="A concise 2-sentence breakdown displayed on social cards and feed previews..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
            />
          </div>
        </div>

        {/* Tiptap Notion Mode Text Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider font-mono text-[#121815] dark:text-white">
              Article Content (Tiptap Notion Mode)
            </label>
            <span className="text-[11px] font-mono text-[#7A5A00] dark:text-[#f7fe72]">
              Slash Commands &amp; Markdown Supported
            </span>
          </div>

          <TiptapNotionEditor
            content={contentHtml}
            onChange={(html) => setContentHtml(html)}
          />
        </div>

        {/* Metadata & Author Settings Grid */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#121815] dark:text-white">
            Metadata &amp; Author Attribution
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                Author Title / Role
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                Estimated Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-[11px] font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Nutrition, Circadian, Olympic Lifts"
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                Cover Image URL
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
