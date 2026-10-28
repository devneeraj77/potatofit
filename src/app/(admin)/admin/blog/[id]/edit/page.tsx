"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import dynamic from "next/dynamic";
import type { BlogPost, BlogCategory } from "@/lib/blog-store";

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

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [categories, setCategories] = useState<BlogCategory[]>([]);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [readTime, setReadTime] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("published");
  const [contentHtml, setContentHtml] = useState("");
  const [views, setViews] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [postRes, catRes] = await Promise.all([
          fetch(`/api/admin/blogs/${id}`),
          fetch("/api/admin/categories"),
        ]);
        const postData = await postRes.json();
        const catData = await catRes.json();

        if (catData.success) {
          setCategories(catData.categories);
        }

        if (postData.success && postData.blog) {
          const b: BlogPost = postData.blog;
          setTitle(b.title);
          setSlug(b.slug);
          setExcerpt(b.excerpt || "");
          setCategoryId(b.categoryId);
          setCoverImage(b.coverImage || "/assets/aistudio/image_b79abc29.png");
          setReadTime(b.readTime || "5 min read");
          setTagsInput((b.tags || []).join(", "));
          setAuthorName(b.author?.name || "Neeraj Rekwar");
          setAuthorRole(b.author?.role || "Performance Lead");
          setStatus(b.status || "published");
          setContentHtml(b.content || "");
          setViews(b.views || 0);
        } else {
          setErrorMsg(postData.error || "Article not found");
        }
      } catch (err) {
        setErrorMsg("Failed to load article details.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSave = async (submitStatus?: "draft" | "published" | "archived") => {
    if (!title.trim()) {
      setErrorMsg("Title is required.");
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    setSaving(true);

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug,
      excerpt,
      content: contentHtml,
      categoryId,
      coverImage,
      readTime,
      tags: tagsArray,
      status: submitStatus || status,
      author: {
        name: authorName,
        role: authorRole,
      },
    };

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || "Failed to update article.");
        setSaving(false);
        return;
      }

      if (submitStatus) setStatus(submitStatus);
      setSuccessMsg("Changes saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg("Network error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        router.push("/admin/blog");
      } else {
        alert(data.error || "Failed to delete article");
      }
    } catch (err) {
      alert("Error deleting article");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center text-[#757761] space-y-2">
        <div className="w-8 h-8 border-2 border-[#f7fe72] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono">Loading protocol from database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Breadcrumb & Controls */}
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
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs font-mono text-[#A0A493]">ID: {id}</span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs font-mono text-[#A0A493]">{views.toLocaleString()} views</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white line-clamp-1">
            Edit: {title}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
            title="Delete Article"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-base sm:text-lg font-bold rounded-xl bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
            />
          </div>

          {/* Slug, Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                Taxonomy Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold font-mono text-[#505445] dark:text-[#A0A493] mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published" | "archived")}
                className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
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
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
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
