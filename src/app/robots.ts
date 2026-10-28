import { MetadataRoute } from "next";
import { getSeoConfig } from "@/lib/seo-store";

export default function robots(): MetadataRoute.Robots {
  const seoConfig = getSeoConfig();
  const baseUrl = seoConfig.global.canonicalBaseUrl || "https://uchitatvam.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: seoConfig.global.disallowedPaths || ["/admin/", "/api/admin/", "/auth/"],
      },
      // Explicit rules for AI Search Agents (ChatGPT-User, PerplexityBot, Google-Extended) for AEO
      {
        userAgent: ["GPTBot", "ChatGPT-User", "PerplexityBot", "Google-Extended", "ClaudeBot"],
        allow: ["/", "/blog/", "/protocols/", "/vendors/", "/rewards", "/leaderboards"],
        disallow: ["/admin/", "/api/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
