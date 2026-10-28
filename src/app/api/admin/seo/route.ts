import { NextRequest, NextResponse } from "next/server";
import {
  getSeoConfig,
  updateGlobalSeo,
  updatePageSeo,
  toggleDevMode,
  saveSeoConfig,
  DEFAULT_GLOBAL_SEO,
  DEFAULT_PAGE_SEO,
  PageSeoConfig,
} from "@/lib/seo-store";

export async function GET() {
  try {
    const config = getSeoConfig();
    return NextResponse.json({
      success: true,
      config,
      stats: {
        totalPages: config.pages.length,
        staticPages: config.pages.filter((p) => p.isStatic).length,
        dynamicTemplates: config.pages.filter((p) => !p.isStatic).length,
        indexedPages: config.pages.filter((p) => p.allowIndexing).length,
        backlinksCount: config.global.backlinks.length,
        locationsCount: config.global.locations.length,
        aeoFaqsCount: config.global.aeoFaqSnippets.length,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load SEO configuration";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Updating a specific page's SEO config
    if (body.type === "page") {
      const { path: pagePath, updates, forceDevMode } = body;
      if (!pagePath) {
        return NextResponse.json({ success: false, error: "Page path is required" }, { status: 400 });
      }

      const result = updatePageSeo(pagePath, updates, forceDevMode);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 403 });
      }

      return NextResponse.json({ success: true, page: result.page });
    }

    // 2. Updating global settings (AEO, Technical, Local, Off-Page)
    if (body.type === "global") {
      const { updates } = body;
      const result = updateGlobalSeo(updates);
      return NextResponse.json({ success: true, global: result.global });
    }

    // 3. Adding a new dynamic route rule or custom page
    if (body.type === "add_page") {
      const { page } = body as { page: PageSeoConfig };
      if (!page || !page.path) {
        return NextResponse.json({ success: false, error: "Valid page config required" }, { status: 400 });
      }

      const store = getSeoConfig();
      if (store.pages.some((p) => p.path === page.path)) {
        return NextResponse.json({ success: false, error: "Page already registered" }, { status: 400 });
      }

      store.pages.push(page);
      store.updatedAt = new Date().toISOString();
      saveSeoConfig(store);
      return NextResponse.json({ success: true, pages: store.pages });
    }

    return NextResponse.json({ success: false, error: "Unknown update type" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update SEO config";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Toggle Dev Mode safety lock
    if (body.action === "toggle_dev_mode") {
      const newStatus = toggleDevMode(body.enabled);
      return NextResponse.json({ success: true, devModeEnabled: newStatus });
    }

    // Reset all SEO to optimum defaults
    if (body.action === "reset_defaults") {
      const freshData = {
        global: DEFAULT_GLOBAL_SEO,
        pages: DEFAULT_PAGE_SEO,
        updatedAt: new Date().toISOString(),
      };
      saveSeoConfig(freshData);
      return NextResponse.json({ success: true, config: freshData });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to execute SEO action";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
