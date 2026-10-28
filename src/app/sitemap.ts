import { MetadataRoute } from "next";
import { getSeoConfig } from "@/lib/seo-store";
import { getBlogs } from "@/lib/blog-store";

export default function sitemap(): MetadataRoute.Sitemap {
  const seoConfig = getSeoConfig();
  const baseUrl = seoConfig.global.canonicalBaseUrl || "https://uchitatvam.com";

  // Static & registered pages
  const staticRoutes: MetadataRoute.Sitemap = seoConfig.pages
    .filter((p) => p.isStatic && p.allowIndexing)
    .map((p) => ({
      url: `${baseUrl}${p.path === "/" ? "" : p.path}`,
      lastModified: p.lastModified ? new Date(p.lastModified) : new Date(),
      changeFrequency: p.changeFreq,
      priority: p.priority,
    }));

  // Dynamic Blog Posts
  const blogs = getBlogs();
  const blogRoutes: MetadataRoute.Sitemap = blogs
    .filter((b) => b.status === "published")
    .map((b) => ({
      url: `${baseUrl}/blog/${b.slug || b.id}`,
      lastModified: new Date(b.publishedAt || b.createdAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  // Local SEO City Vendor Hubs
  const locationRoutes: MetadataRoute.Sitemap = seoConfig.global.locations.map((loc) => ({
    url: `${baseUrl}/vendors/${encodeURIComponent(loc.city.toLowerCase().replace(/\s+/g, "-"))}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...locationRoutes];
}
