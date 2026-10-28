"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  CheckSquare,
  Square,
  MinusSquare,
  Tag,
  X,
  Loader2,
  Check,
  Layers,
  Sparkles,
} from "lucide-react";
import type { BlogPost, BlogCategory } from "@/lib/blog-store";

export default function AdminBlogListPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Bulk actions state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState<string>("");
  const [isBulkProcessing, setIsBulkProcessing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const refreshBlogs = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (selectedStatus !== "all") params.set("status", selectedStatus);

      const [blogRes, catRes] = await Promise.all([
        fetch(`/api/admin/blogs?${params.toString()}`),
        fetch("/api/admin/categories"),
      ]);
      const blogData = await blogRes.json();
      const catData = await catRes.json();

      if (blogData.success) {
        setBlogs(blogData.blogs);
      }
      if (catData.success) {
        setCategories(catData.categories);
        if (!bulkCategoryTarget && catData.categories.length > 0) {
          setBulkCategoryTarget(catData.categories[0].id);
        }
      }
    } catch {
      console.error("Failed to fetch blog list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== "all") params.set("category", selectedCategory);
        if (selectedStatus !== "all") params.set("status", selectedStatus);

        const [blogRes, catRes] = await Promise.all([
          fetch(`/api/admin/blogs?${params.toString()}`),
          fetch("/api/admin/categories"),
        ]);
        const blogData = await blogRes.json();
        const catData = await catRes.json();

        if (active && blogData.success) setBlogs(blogData.blogs);
        if (active && catData.success) {
          setCategories(catData.categories);
          if (catData.categories.length > 0) {
            setBulkCategoryTarget(catData.categories[0].id);
          }
        }
      } catch {
        console.error("Failed to fetch blog list");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refreshBlogs();
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === blogs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(blogs.map((b) => b.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Bulk Actions
  const executeBulkAction = async (
    action: "toggle_status" | "update_status" | "update_category" | "delete",
    payload?: { status?: "published" | "draft"; categoryId?: string }
  ) => {
    if (selectedIds.length === 0) return;

    if (action === "delete") {
      const confirmDelete = window.confirm(
        `Are you sure you want to permanently delete ${selectedIds.length} selected article(s)? This cannot be undone.`
      );
      if (!confirmDelete) return;
    }

    setIsBulkProcessing(true);
    try {
      const res = await fetch("/api/admin/blogs/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          action,
          status: payload?.status,
          categoryId: payload?.categoryId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || "Bulk action executed successfully.");
        if (action === "delete") {
          setSelectedIds([]);
        }
        await refreshBlogs();
      } else {
        showToast(data.error || "Failed to execute bulk action.", "error");
      }
    } catch {
      showToast("Network error executing bulk action.", "error");
    } finally {
      setIsBulkProcessing(false);
    }
  };

  // Single article operations
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        setSelectedIds((prev) => prev.filter((item) => item !== id));
        showToast(`Article "${title}" deleted successfully.`);
      } else {
        showToast(data.error || "Failed to delete article", "error");
      }
    } catch {
      showToast("Error deleting article", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (blog: BlogPost) => {
    const newStatus = blog.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBlogs((prev) =>
          prev.map((b) => (b.id === blog.id ? { ...b, status: newStatus } : b))
        );
        showToast(`Set "${blog.title.slice(0, 24)}..." to ${newStatus}.`);
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const isAllSelected = blogs.length > 0 && selectedIds.length === blogs.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < blogs.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold backdrop-blur-md border transition-all animate-in fade-in slide-in-from-bottom-2 ${
            toastMessage.type === "success"
              ? "bg-[#0E1310]/95 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10"
              : "bg-[#0E1310]/95 text-red-400 border-red-500/30 shadow-red-500/10"
          }`}
        >
          {toastMessage.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <X className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#757761] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header with Title and Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#757761]/25">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Editorial CMS
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs text-[#A0A493]">Uchitatvam Knowledge Base</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            Performance Articles &amp; Protocols
          </h1>
          <p className="text-xs sm:text-sm text-[#505445] dark:text-[#A0A493] mt-0.5">
            Manage your peer-reviewed athletic fuel articles, circadian guides, and mandi food breakdowns.
          </p>
        </div>

        <Link
          href="/admin/blog/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Article</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#757761] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles, tags, or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white placeholder-[#757761] focus:outline-none focus:border-[#f7fe72]"
          />
        </form>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Select */}
          <div className="flex items-center gap-1.5 text-xs text-[#505445] dark:text-[#A0A493]">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-1.5 text-xs text-[#505445] dark:text-[#A0A493]">
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-[#F4F6F5] dark:bg-[#0E1310] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sticky Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-40 p-3 sm:p-4 rounded-2xl bg-[#0B0E0C]/95 dark:bg-[#0E1310]/95 backdrop-blur-md border-2 border-[#f7fe72]/50 shadow-2xl text-white transition-all animate-in fade-in slide-in-from-top-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Left: Counter & Select/Deselect */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#f7fe72]/15 border border-[#f7fe72]/40 text-[#f7fe72]">
                <Layers className="w-4 h-4" />
                <span className="font-bold font-mono text-xs">
                  {selectedIds.length} {selectedIds.length === 1 ? "article" : "articles"} selected
                </span>
              </div>

              <button
                type="button"
                onClick={handleSelectAll}
                className="text-xs text-[#CBD2C7] hover:text-[#f7fe72] underline underline-offset-4 font-mono transition-colors"
              >
                {selectedIds.length === blogs.length ? "Deselect All" : "Select All Visible"}
              </button>
            </div>

            {/* Right: Actions Group */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Actions Group */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#A0A493] px-2 font-semibold">
                  Status:
                </span>

                <button
                  type="button"
                  disabled={isBulkProcessing}
                  onClick={() => executeBulkAction("toggle_status")}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-[#f7fe72]/20 hover:text-[#f7fe72] transition-colors cursor-pointer disabled:opacity-50"
                  title="Invert status: Drafts become Published, Published become Drafts"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Toggle</span>
                </button>

                <button
                  type="button"
                  disabled={isBulkProcessing}
                  onClick={() => executeBulkAction("update_status", { status: "published" })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Publish All</span>
                </button>

                <button
                  type="button"
                  disabled={isBulkProcessing}
                  onClick={() => executeBulkAction("update_status", { status: "draft" })}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Draft All</span>
                </button>
              </div>

              {/* Category Assignment Group */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#A0A493] px-2 font-semibold flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#f7fe72]" />
                  <span>Category:</span>
                </span>

                <select
                  value={bulkCategoryTarget}
                  onChange={(e) => setBulkCategoryTarget(e.target.value)}
                  disabled={isBulkProcessing}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-[#0E1310] border border-white/20 text-white focus:outline-none focus:border-[#f7fe72] max-w-[170px]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={isBulkProcessing || !bulkCategoryTarget}
                  onClick={() =>
                    executeBulkAction("update_category", { categoryId: bulkCategoryTarget })
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isBulkProcessing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Apply Category</span>
                </button>
              </div>

              {/* Bulk Delete */}
              <button
                type="button"
                disabled={isBulkProcessing}
                onClick={() => executeBulkAction("delete")}
                className="p-2 rounded-xl text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors cursor-pointer disabled:opacity-50"
                title="Delete Selected Articles"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Clear / Dismiss Selection */}
              <button
                type="button"
                onClick={handleClearSelection}
                className="p-2 rounded-xl text-[#757761] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss selection"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blogs Data Table */}
      <div className="rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F6F5] dark:bg-[#18211C] border-b border-[#757761]/20 text-[#757761] uppercase tracking-wider font-mono">
              <tr>
                {/* Select All Checkbox */}
                <th className="w-10 px-4 py-3.5 text-center">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="p-1 rounded text-[#757761] hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors"
                    title={isAllSelected ? "Deselect All" : "Select All"}
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#7A5A00] dark:text-[#f7fe72]" />
                    ) : isSomeSelected ? (
                      <MinusSquare className="w-4 h-4 text-[#7A5A00] dark:text-[#f7fe72]" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3.5">Article Title</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Author</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Views</th>
                <th className="px-4 py-3.5">Updated</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#757761]/15">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[#757761]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#f7fe72]" />
                      <span>Loading articles...</span>
                    </div>
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center space-y-3">
                    <p className="text-sm text-[#505445] dark:text-[#A0A493]">
                      No articles match your current search criteria.
                    </p>
                    <Link
                      href="/admin/blog/create"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create First Article</span>
                    </Link>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => {
                  const isSelected = selectedIds.includes(blog.id);
                  return (
                    <tr
                      key={blog.id}
                      className={`transition-colors ${
                        isSelected
                          ? "bg-[#f7fe72]/10 dark:bg-[#f7fe72]/10 border-l-2 border-[#7A5A00] dark:border-[#f7fe72]"
                          : "hover:bg-[#F4F6F5]/50 dark:hover:bg-[#18211C]/50"
                      }`}
                    >
                      {/* Row Checkbox */}
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelect(blog.id)}
                          className="p-1 rounded text-[#757761] hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#7A5A00] dark:text-[#f7fe72]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Title & Excerpt */}
                      <td className="px-4 py-4 max-w-sm">
                        <div className="font-bold text-xs sm:text-sm text-[#121815] dark:text-white line-clamp-1">
                          {blog.title}
                        </div>
                        <div className="text-[11px] text-[#505445] dark:text-[#A0A493] line-clamp-1 mt-0.5">
                          {blog.excerpt}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {blog.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#757761]/10 text-[#505445] dark:text-[#CBD2C7]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#757761]/10 text-[#121815] dark:text-[#CBD2C7]">
                          <Tag className="w-3 h-3 text-[#7A5A00] dark:text-[#f7fe72]" />
                          <span>{blog.categoryName || "General"}</span>
                        </span>
                      </td>

                      {/* Author */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-xs text-[#121815] dark:text-white font-medium">
                          {blog.author?.name || "Editorial"}
                        </div>
                        <div className="text-[10px] text-[#757761]">
                          {blog.author?.role || "Staff"}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(blog)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-transform hover:scale-105 cursor-pointer ${
                            blog.status === "published"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          }`}
                          title="Click to toggle status for this single article"
                        >
                          {blog.status === "published" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span className="capitalize">{blog.status}</span>
                        </button>
                      </td>

                      {/* Views */}
                      <td className="px-4 py-4 whitespace-nowrap font-mono tabular-nums text-xs text-[#121815] dark:text-white">
                        {blog.views.toLocaleString()}
                      </td>

                      {/* Updated At */}
                      <td className="px-4 py-4 whitespace-nowrap text-[11px] font-mono text-[#757761]">
                        {blog.updatedAt ? blog.updatedAt.split("T")[0] : "-"}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/admin/blog/${blog.id}/edit`}
                            className="p-1.5 rounded-lg text-[#505445] dark:text-[#CBD2C7] hover:text-[#121815] dark:hover:text-[#f7fe72] hover:bg-[#757761]/15 transition-colors"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(blog.id, blog.title)}
                            disabled={deletingId === blog.id}
                            className="p-1.5 rounded-lg text-[#757761] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
