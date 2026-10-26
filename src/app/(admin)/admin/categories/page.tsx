"use client";

import React, { useState, useEffect } from "react";
import {
  Tags,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  FileText,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { BlogCategory } from "@/lib/blog-store";

const COLOR_SWATCHES = [
  "#f7fe72", // Uchitatvam Cyber Lime
  "#60a5fa", // Circadian Blue
  "#f87171", // Kinematics Red
  "#34d399", // Mandi Emerald
  "#fbbf24", // VO2 Amber
  "#a78bfa", // Recovery Violet
  "#f472b6", // Hypertrophy Pink
  "#e2e8f0", // Clean Slate
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [color, setColor] = useState("#f7fe72");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refreshCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch {
      console.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (active && data.success) {
          setCategories(data.categories);
        }
      } catch {
        console.error("Failed to fetch categories");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setColor("#f7fe72");
    setDescription("");
    setErrorMsg("");
    setModalOpen(true);
  };

  const openEditModal = (cat: BlogCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setColor(cat.color || "#f7fe72");
    setDescription(cat.description || "");
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Category name is required.");
      return;
    }
    setErrorMsg("");
    setSubmitting(true);

    try {
      if (editingCategory) {
        // Update
        const res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCategory.id,
            name,
            slug,
            color,
            description,
          }),
        });
        const data = await res.json();
        if (!data.success) {
          setErrorMsg(data.error || "Failed to update category.");
          setSubmitting(false);
          return;
        }
        setSuccessMsg(`Category "${name}" updated!`);
      } else {
        // Create
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            slug,
            color,
            description,
          }),
        });
        const data = await res.json();
        if (!data.success) {
          setErrorMsg(data.error || "Failed to create category.");
          setSubmitting(false);
          return;
        }
        setSuccessMsg(`Category "${name}" created!`);
      }

      setModalOpen(false);
      refreshCategories();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch {
      setErrorMsg("Network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(data.error || "Failed to delete category");
      }
    } catch (err) {
      alert("Error deleting category");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#757761]/25">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Taxonomy Architecture
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs text-[#A0A493]">Uchitatvam Protocols</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            Performance Categories
          </h1>
          <p className="text-xs sm:text-sm text-[#505445] dark:text-[#A0A493] mt-0.5">
            Organize athletic protocols, circadian sleep guides, and localized mandi nutrient mappings.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-[#757761]">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-12 text-center space-y-3">
            <p className="text-sm text-[#757761]">No categories found.</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Category</span>
            </button>
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 hover:border-[#757761]/50 transition-all shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Color Dot & Post Count */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-xs"
                      style={{ backgroundColor: cat.color || "#f7fe72" }}
                    />
                    <span className="font-mono text-xs text-[#757761]">
                      /{cat.slug}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[#505445] dark:text-[#A0A493]">
                    <FileText className="w-3 h-3" />
                    <span>{cat.postCount || 0} articles</span>
                  </div>
                </div>

                {/* Name & Description */}
                <div>
                  <h3 className="text-base font-bold text-[#121815] dark:text-white">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#505445] dark:text-[#A0A493] mt-1 leading-relaxed line-clamp-2">
                    {cat.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#757761]/15 mt-4">
                <span className="text-[10px] font-mono text-[#757761]">
                  ID: {cat.id}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg text-[#505445] dark:text-[#CBD2C7] hover:text-[#121815] dark:hover:text-[#f7fe72] hover:bg-[#757761]/15 transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded-lg text-[#757761] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Category Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/35 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#757761]/25">
              <div className="flex items-center gap-2">
                <Tags className="w-4 h-4 text-[#f7fe72]" />
                <h3 className="text-base font-bold text-[#121815] dark:text-white">
                  {editingCategory ? "Edit Category" : "Create New Category"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-[#757761] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono font-semibold text-[#505445] dark:text-[#A0A493] mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Precision Athletic Fuel"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none focus:border-[#f7fe72]"
                />
              </div>

              <div>
                <label className="block font-mono font-semibold text-[#505445] dark:text-[#A0A493] mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g., athletic-fuel"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white font-mono focus:outline-none"
                />
              </div>

              {/* Color Swatch Picker */}
              <div>
                <label className="block font-mono font-semibold text-[#505445] dark:text-[#A0A493] mb-1.5">
                  Theme Accent Color
                </label>
                <div className="flex items-center gap-2.5">
                  {COLOR_SWATCHES.map((swatch) => (
                    <button
                      key={swatch}
                      type="button"
                      onClick={() => setColor(swatch)}
                      className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center cursor-pointer ${
                        color === swatch
                          ? "ring-2 ring-white scale-110"
                          : "opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: swatch }}
                    >
                      {color === swatch && (
                        <Check className="w-3.5 h-3.5 text-black" />
                      )}
                    </button>
                  ))}
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    title="Custom color"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-semibold text-[#505445] dark:text-[#A0A493] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline the scientific or nutritional focus of this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F4F6F5] dark:bg-[#141A16] border border-[#757761]/30 text-[#121815] dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#757761]/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-[#505445] dark:text-[#CBD2C7] hover:bg-[#757761]/15 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingCategory
                    ? "Save Changes"
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
