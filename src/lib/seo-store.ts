import fs from "fs";
import path from "path";
export * from "./seo-types";
import {
  DEFAULT_GLOBAL_SEO,
  DEFAULT_PAGE_SEO,
  DEFAULT_SCHEMAS,
  PageSeoConfig,
  GlobalSeoSettings,
  JsonLdSnippet,
} from "./seo-types";

export interface SeoStoreData {
  global: GlobalSeoSettings;
  pages: PageSeoConfig[];
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const SEO_FILE = path.join(DATA_DIR, "seo-config.json");

function ensureDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getSeoConfig(): SeoStoreData {
  try {
    ensureDirExists();
    if (!fs.existsSync(SEO_FILE)) {
      const initial: SeoStoreData = {
        global: DEFAULT_GLOBAL_SEO,
        pages: DEFAULT_PAGE_SEO,
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(SEO_FILE, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const raw = fs.readFileSync(SEO_FILE, "utf8");
    const data = JSON.parse(raw);
    return {
      global: {
        ...DEFAULT_GLOBAL_SEO,
        ...(data.global || {}),
        schemas:
          Array.isArray(data.global?.schemas) && data.global.schemas.length > 0
            ? data.global.schemas
            : DEFAULT_SCHEMAS,
      },
      pages: Array.isArray(data.pages) && data.pages.length > 0 ? data.pages : DEFAULT_PAGE_SEO,
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.error("[seo-store] Error reading SEO config:", err);
    return {
      global: DEFAULT_GLOBAL_SEO,
      pages: DEFAULT_PAGE_SEO,
      updatedAt: new Date().toISOString(),
    };
  }
}

export function saveSeoConfig(data: SeoStoreData): boolean {
  try {
    ensureDirExists();
    fs.writeFileSync(SEO_FILE, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("[seo-store] Error saving SEO config:", err);
    return false;
  }
}

export function getSchemas(): JsonLdSnippet[] {
  const store = getSeoConfig();
  return store.global.schemas || DEFAULT_SCHEMAS;
}

export function saveSchema(
  snippet: JsonLdSnippet,
  forceDevMode = false
): { success: boolean; snippet?: JsonLdSnippet; error?: string } {
  const store = getSeoConfig();
  if (!Array.isArray(store.global.schemas)) {
    store.global.schemas = [...DEFAULT_SCHEMAS];
  }

  // Guard: if editing schema for static pages, enforce Dev Mode
  if (snippet.targetType === "static" && !store.global.devModeEnabled && !forceDevMode) {
    return {
      success: false,
      error: `Modifying schema for static core route "${snippet.targetPath}" requires Dev Mode. Toggle Dev Mode ON to proceed.`,
    };
  }

  const existingIdx = store.global.schemas.findIndex((s) => s.id === snippet.id);
  const now = new Date().toISOString();
  const updatedSnippet: JsonLdSnippet = {
    ...snippet,
    id: snippet.id || "schema-" + Date.now().toString(36),
    updatedAt: now,
    createdAt: snippet.createdAt || now,
  };

  if (existingIdx >= 0) {
    const oldSnippet = store.global.schemas[existingIdx];
    if (oldSnippet.targetType === "static" && !store.global.devModeEnabled && !forceDevMode) {
      return {
        success: false,
        error: `Modifying static schema "${oldSnippet.name}" requires Dev Mode. Toggle Dev Mode ON to proceed.`,
      };
    }
    store.global.schemas[existingIdx] = updatedSnippet;
  } else {
    store.global.schemas.push(updatedSnippet);
  }

  store.updatedAt = now;
  saveSeoConfig(store);
  return { success: true, snippet: updatedSnippet };
}

export function deleteSchema(
  id: string,
  forceDevMode = false
): { success: boolean; error?: string } {
  const store = getSeoConfig();
  if (!Array.isArray(store.global.schemas)) {
    store.global.schemas = [...DEFAULT_SCHEMAS];
  }

  const target = store.global.schemas.find((s) => s.id === id);
  if (!target) {
    return { success: false, error: "Schema snippet not found" };
  }

  if (target.targetType === "static" && !store.global.devModeEnabled && !forceDevMode) {
    return {
      success: false,
      error: `Deleting static schema "${target.name}" requires Dev Mode. Toggle Dev Mode ON to proceed.`,
    };
  }

  store.global.schemas = store.global.schemas.filter((s) => s.id !== id);
  store.updatedAt = new Date().toISOString();
  saveSeoConfig(store);
  return { success: true };
}

export function toggleSchema(
  id: string,
  enabled?: boolean,
  forceDevMode = false
): { success: boolean; enabled?: boolean; error?: string } {
  const store = getSeoConfig();
  if (!Array.isArray(store.global.schemas)) {
    store.global.schemas = [...DEFAULT_SCHEMAS];
  }

  const target = store.global.schemas.find((s) => s.id === id);
  if (!target) {
    return { success: false, error: "Schema snippet not found" };
  }

  if (target.targetType === "static" && !store.global.devModeEnabled && !forceDevMode) {
    return {
      success: false,
      error: `Toggling static schema "${target.name}" requires Dev Mode. Toggle Dev Mode ON to proceed.`,
    };
  }

  const next = enabled !== undefined ? enabled : !target.enabled;
  target.enabled = next;
  target.updatedAt = new Date().toISOString();
  store.updatedAt = new Date().toISOString();
  saveSeoConfig(store);
  return { success: true, enabled: next };
}

export function getPageSeo(pathname: string): PageSeoConfig | null {
  const store = getSeoConfig();
  const exact = store.pages.find((p) => p.path === pathname);
  if (exact) return exact;

  if (pathname.startsWith("/blog/")) {
    return store.pages.find((p) => p.path === "/blog/[slug]") || null;
  }
  if (pathname.startsWith("/protocols/")) {
    return store.pages.find((p) => p.path === "/protocols/[id]") || null;
  }
  if (pathname.startsWith("/vendors/")) {
    return store.pages.find((p) => p.path === "/vendors/[city]") || null;
  }

  return null;
}

export function updatePageSeo(
  pathKey: string,
  updates: Partial<PageSeoConfig>,
  forceDevMode = false
): { success: boolean; page?: PageSeoConfig; error?: string } {
  const store = getSeoConfig();
  const index = store.pages.findIndex((p) => p.path === pathKey);

  if (index === -1) {
    return { success: false, error: `Page SEO config for ${pathKey} not found` };
  }

  const target = store.pages[index];

  if (target.isStatic && !store.global.devModeEnabled && !forceDevMode) {
    return {
      success: false,
      error: `Editing static core page "${pathKey}" is restricted to Dev Mode. Toggle Dev Mode ON to proceed.`,
    };
  }

  const updated: PageSeoConfig = {
    ...target,
    ...updates,
    lastModified: new Date().toISOString(),
  };

  store.pages[index] = updated;
  store.updatedAt = new Date().toISOString();
  saveSeoConfig(store);

  return { success: true, page: updated };
}

export function updateGlobalSeo(
  updates: Partial<GlobalSeoSettings>
): { success: boolean; global: GlobalSeoSettings } {
  const store = getSeoConfig();
  store.global = {
    ...store.global,
    ...updates,
  };
  store.updatedAt = new Date().toISOString();
  saveSeoConfig(store);
  return { success: true, global: store.global };
}

export function toggleDevMode(enabled?: boolean): boolean {
  const store = getSeoConfig();
  const next = enabled !== undefined ? enabled : !store.global.devModeEnabled;
  store.global.devModeEnabled = next;
  store.updatedAt = new Date().toISOString();
  saveSeoConfig(store);
  return next;
}
