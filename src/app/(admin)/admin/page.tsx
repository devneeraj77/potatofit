"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  FileText,
  Tags,
  Plus,
  ArrowRight,
  TrendingUp,
  Terminal,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Trophy,
  Store,
  Image as ImageIcon,
  Globe,
  MessageSquare,
} from "lucide-react";
import type { BlogPost, BlogCategory } from "@/lib/blog-store";

export default function AdminOverviewPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [blogRes, catRes] = await Promise.all([
          fetch("/api/admin/blogs"),
          fetch("/api/admin/categories"),
        ]);
        const blogData = await blogRes.json();
        const catData = await catRes.json();

        if (blogData.success) setBlogs(blogData.blogs);
        if (catData.success) setCategories(catData.categories);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const publishedCount = blogs.filter((b) => b.status === "published").length;
  const draftCount = blogs.filter((b) => b.status === "draft").length;
  const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#757761]/25">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-[#7A5A00] dark:text-[#f7fe72] font-semibold">
              Mission Control
            </span>
            <span className="text-xs text-[#757761]">·</span>
            <span className="text-xs text-[#A0A493]">Uchitatvam Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#121815] dark:text-white">
            Administrative Management
          </h1>
          <p className="text-xs sm:text-sm text-[#505445] dark:text-[#A0A493] mt-0.5">
            Manage performance blogs, athletic categories, user streaks, and wearable telemetry feeds.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/blog/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-[#0B0E0C] bg-[#f7fe72] hover:bg-[#e7ee62] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#121815] dark:text-[#CBD2C7] bg-white dark:bg-[#18211C] border border-[#757761]/35 hover:bg-[#757761]/15 transition-colors"
          >
            <Tags className="w-4 h-4" />
            <span>Categories</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Published Blogs */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#757761]">Published Articles</span>
            <div className="p-2 rounded-xl bg-[#1D2520] text-[#f7fe72]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#121815] dark:text-white font-mono tabular-nums">
              {loading ? "..." : publishedCount}
            </span>
            <span className="text-xs text-[#A0A493]">({draftCount} drafts)</span>
          </div>
          <div className="text-[11px] text-[#505445] dark:text-[#A0A493] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>+12% readership this week</span>
          </div>
        </div>

        {/* Card 2: Total Readership */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#757761]">Total Readership</span>
            <div className="p-2 rounded-xl bg-[#1D2520] text-[#60a5fa]">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#121815] dark:text-white font-mono tabular-nums">
            {loading ? "..." : totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#505445] dark:text-[#A0A493]">
            Verified athletic views across 12 countries
          </div>
        </div>

        {/* Card 3: Mandi Categories */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#757761]">Active Categories</span>
            <div className="p-2 rounded-xl bg-[#1D2520] text-[#34d399]">
              <Tags className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#121815] dark:text-white font-mono tabular-nums">
            {loading ? "..." : categories.length}
          </div>
          <div className="text-[11px] text-[#505445] dark:text-[#A0A493]">
            Fuel, Recovery, Biomechanics, Mandi
          </div>
        </div>

        {/* Card 4: Active Athletes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-[#757761]">Registered Athletes</span>
            <div className="p-2 rounded-xl bg-[#1D2520] text-[#fbbf24]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#121815] dark:text-white font-mono tabular-nums">
            14,820
          </div>
          <div className="text-[11px] text-[#505445] dark:text-[#A0A493]">
            Season 4 Apex Contenders
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Action 1 */}
        <Link
          href="/admin/blog/create"
          className="group p-5 rounded-2xl bg-gradient-to-br from-white to-[#F4F6F5] dark:from-[#121815] dark:to-[#0B0E0C] border border-[#757761]/30 hover:border-[#f7fe72]/60 transition-all shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D2520] text-[#f7fe72] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#121815] dark:text-white group-hover:text-[#f7fe72] transition-colors">
                Publish Performance Protocol
              </h3>
              <p className="text-xs text-[#505445] dark:text-[#A0A493] mt-1 leading-relaxed">
                Compose with Notion-style Tiptap editor, configure metadata tags, and link seasonal grocery recipes.
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#7A5A00] dark:text-[#f7fe72]">
            <span>Open Creator</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Action 2 */}
        <Link
          href="/admin/categories"
          className="group p-5 rounded-2xl bg-gradient-to-br from-white to-[#F4F6F5] dark:from-[#121815] dark:to-[#0B0E0C] border border-[#757761]/30 hover:border-[#60a5fa]/60 transition-all shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D2520] text-[#60a5fa] flex items-center justify-center">
              <Tags className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#121815] dark:text-white group-hover:text-[#60a5fa] transition-colors">
                Organize Category Taxonomies
              </h3>
              <p className="text-xs text-[#505445] dark:text-[#A0A493] mt-1 leading-relaxed">
                Add, edit, and categorize training protocols, circadian sleep guides, and localized kirana mandis.
              </p>
            </div>
          </div>
          <div className="pt-4 flex items-center gap-1 text-xs font-semibold text-[#60a5fa]">
            <span>Manage Categories</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Action 3: Terminal CLI */}
        <div className="p-5 rounded-2xl bg-[#0E1310] border border-[#757761]/35 text-[#E2E7DE] flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D2520] text-[#34d399] flex items-center justify-center">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Admin Seed &amp; Terminal CLI
              </h3>
              <p className="text-xs text-[#A0A493] mt-1 leading-relaxed">
                Manage admins via shell. Add, update, delete, or seed super administrators directly:
              </p>
              <div className="mt-2.5 p-2 rounded-lg bg-black/40 border border-[#757761]/30 font-mono text-[11px] text-[#f7fe72] space-y-1">
                <div>$ npm run admin:seed</div>
                <div>$ npm run admin:manage list</div>
              </div>
            </div>
          </div>
          <div className="pt-3 text-[11px] font-mono text-[#757761]">
            Super Admin: neerajrekwar817@gmail.com
          </div>
        </div>
      </div>

      {/* Complete Website Management Modules Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#121815] dark:text-white uppercase font-mono tracking-wider">
              Website &amp; Platform Management Hub
            </h2>
            <span className="text-xs text-[#757761]">/</span>
            <span className="text-xs font-mono text-[#34d399]">All Essential Pages</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/admins"
            className="p-3.5 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 hover:border-[#f7fe72]/50 transition-all group flex flex-col justify-between space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#141A16] border border-[#757761]/30 flex items-center justify-center text-[#f7fe72]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#121815] dark:text-white group-hover:text-[#f7fe72] transition-colors">
                Administrators
              </div>
              <div className="text-[10px] text-[#757761] font-mono">Neon DB &amp; Roles</div>
            </div>
          </Link>

          <Link
            href="/admin/quests"
            className="p-3.5 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 hover:border-[#f7fe72]/50 transition-all group flex flex-col justify-between space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#141A16] border border-[#757761]/30 flex items-center justify-center text-yellow-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#121815] dark:text-white group-hover:text-[#f7fe72] transition-colors">
                Daily Quests
              </div>
              <div className="text-[10px] text-[#757761] font-mono">XP &amp; Token Loops</div>
            </div>
          </Link>

          <Link
            href="/admin/vendors"
            className="p-3.5 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 hover:border-[#f7fe72]/50 transition-all group flex flex-col justify-between space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#141A16] border border-[#757761]/30 flex items-center justify-center text-emerald-400">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#121815] dark:text-white group-hover:text-[#f7fe72] transition-colors">
                Local Grocers
              </div>
              <div className="text-[10px] text-[#757761] font-mono">Mandi Mapping</div>
            </div>
          </Link>

          <Link
            href="/admin/media"
            className="p-3.5 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 hover:border-[#f7fe72]/50 transition-all group flex flex-col justify-between space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#141A16] border border-[#757761]/30 flex items-center justify-center text-blue-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#121815] dark:text-white group-hover:text-[#f7fe72] transition-colors">
                Media CDN
              </div>
              <div className="text-[10px] text-[#757761] font-mono">Banners &amp; Badges</div>
            </div>
          </Link>

          <Link
            href="/admin/seo"
            className="p-3.5 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 hover:border-[#f7fe72]/50 transition-all group flex flex-col justify-between space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#141A16] border border-[#757761]/30 flex items-center justify-center text-purple-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#121815] dark:text-white group-hover:text-[#f7fe72] transition-colors">
                SEO &amp; Social
              </div>
              <div className="text-[10px] text-[#757761] font-mono">OpenGraph &amp; Meta</div>
            </div>
          </Link>

          <Link
            href="/admin/inquiries"
            className="p-3.5 rounded-2xl bg-white dark:bg-[#0E1310] border border-[#757761]/25 hover:border-[#f7fe72]/50 transition-all group flex flex-col justify-between space-y-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#141A16] border border-[#757761]/30 flex items-center justify-center text-cyan-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#121815] dark:text-white group-hover:text-[#f7fe72] transition-colors">
                Support Inbox
              </div>
              <div className="text-[10px] text-[#757761] font-mono">Athletes &amp; Vendors</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Blog Posts Table */}
      <div className="rounded-2xl bg-white dark:bg-[#121815] border border-[#757761]/25 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#757761]/20">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#121815] dark:text-white">
              Recent Scientific Articles &amp; Protocols
            </h2>
            <p className="text-xs text-[#505445] dark:text-[#A0A493]">
              View, edit, or adjust publication status in real-time
            </p>
          </div>
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#7A5A00] dark:text-[#f7fe72] hover:underline"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4F6F5] dark:bg-[#18211C] border-b border-[#757761]/20 text-[#757761] uppercase tracking-wider font-mono">
              <tr>
                <th className="px-4 py-3">Title &amp; Excerpt</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Read Time</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#757761]/15">
              {blogs.slice(0, 5).map((blog) => (
                <tr
                  key={blog.id}
                  className="hover:bg-[#F4F6F5]/50 dark:hover:bg-[#18211C]/50 transition-colors"
                >
                  <td className="px-4 py-3.5 max-w-md">
                    <div className="font-semibold text-xs text-[#121815] dark:text-white line-clamp-1">
                      {blog.title}
                    </div>
                    <div className="text-[11px] text-[#505445] dark:text-[#A0A493] line-clamp-1 mt-0.5">
                      {blog.excerpt}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-[11px] font-mono text-[#121815] dark:text-[#CBD2C7]">
                      {blog.categoryName || "General"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        blog.status === "published"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {blog.status === "published" ? (
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      ) : (
                        <Clock className="w-2.5 h-2.5" />
                      )}
                      <span className="capitalize">{blog.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-[#505445] dark:text-[#A0A493] font-mono text-[11px]">
                    {blog.readTime}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-[#121815] dark:text-white font-mono tabular-nums text-[11px]">
                    {blog.views.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        href={`/admin/blog/${blog.id}/edit`}
                        className="p-1.5 rounded-lg text-[#505445] dark:text-[#CBD2C7] hover:text-[#121815] dark:hover:text-[#f7fe72] hover:bg-[#757761]/15 transition-colors"
                        title="Edit Article"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
