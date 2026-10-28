import fs from "fs";
import path from "path";

export interface PageSeoConfig {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage: string;
  ogType: "website" | "article" | "product";
  isStatic: boolean; // Static pages require Dev Mode to edit
  allowIndexing: boolean;
  allowFollow: boolean;
  priority: number;
  changeFreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  // AEO and Voice
  speakableSnippet?: string;
  directAnswer?: string;
  // Dynamic template variables (for non-static pages)
  templateTokens?: string[];
  lastModified?: string;
}

export interface LocalSeoLocation {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  priceRange: string;
  areaServed: string[];
  mandiHub: string;
}

export interface BacklinkRecord {
  id: string;
  sourceDomain: string;
  sourceUrl: string;
  targetPath: string;
  anchorText: string;
  domainAuthority: number;
  followStatus: "dofollow" | "nofollow";
  discoveredDate: string;
}

export interface GlobalSeoSettings {
  siteName: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string[];
  canonicalBaseUrl: string;
  defaultOgImage: string;
  twitterHandle: string;
  twitterCardType: "summary_large_image" | "summary";
  themeColor: string;
  // AEO (Answer Engine Optimization) & AI Search
  aeoEnabled: boolean;
  aeoBrandDefinition: string;
  aeoPrimaryFactualClaim: string;
  aeoSpeakableSelectors: string[];
  aeoFaqSnippets: { question: string; answer: string }[];
  // Technical SEO
  robotsDefaultAllow: boolean;
  disallowedPaths: string[];
  sitemapPath: string;
  enableCoreWebVitalsOptimization: boolean;
  // International SEO (hreflang)
  defaultLocale: string;
  locales: { code: string; name: string; hrefLang: string }[];
  // Local SEO
  locations: LocalSeoLocation[];
  // Off-Page SEO signals
  backlinks: BacklinkRecord[];
  // Safety lock for static pages
  devModeEnabled: boolean;
}

const DATA_DIR = path.join(process.cwd(), "data");
const SEO_FILE = path.join(DATA_DIR, "seo-config.json");

export const DEFAULT_PAGE_SEO: PageSeoConfig[] = [
  {
    path: "/",
    title: "Uchitatvam // Precision Athletic Fuel & Local Grocer Biometrics",
    description: "From Couch Uchit to Global Apex. AI-driven nutrition mapped to your nearest vegetable vendors and local grocers. Fuel smart, track daily quests, and compete globally.",
    keywords: ["athletic fuel", "vegetable mandi nutrition", "local grocer biometrics", "daily quests", "uchitatvam", "wearable sync"],
    ogImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=80",
    ogType: "website",
    isStatic: true,
    allowIndexing: true,
    allowFollow: true,
    priority: 1.0,
    changeFreq: "daily",
    directAnswer: "Uchitatvam is an AI-powered athletic nutrition and biometrics platform that maps clinical sports fuel targets directly to local vegetable mandis and neighborhood kirana grocers.",
    speakableSnippet: "Uchitatvam maps precision athletic nutrition to local neighborhood vegetable markets and grocers in India.",
  },
  {
    path: "/rewards",
    title: "Daily Quests & Token Rewards // Uchitatvam Gamification",
    description: "Complete daily hydration, protein harvest, and wearable sync quests. Earn potato tokens, climb regional athlete leaderboards, and unlock athletic badges.",
    keywords: ["athletic quests", "daily missions", "fitness tokens", "leaderboard rewards", "habit tracking"],
    ogImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=80",
    ogType: "website",
    isStatic: true,
    allowIndexing: true,
    allowFollow: true,
    priority: 0.9,
    changeFreq: "daily",
    directAnswer: "Uchitatvam daily quests reward athletes with XP and potato tokens for logging certified local farm produce and keeping continuous wearable telemetry active.",
  },
  {
    path: "/leaderboards",
    title: "Global & City Athletic Leaderboards // Uchitatvam Apex",
    description: "Rank among top functional movers, runners, and lifters across Indore, Bhopal, Delhi NCR, and Bengaluru. Real-time sub-100ms sync verification.",
    keywords: ["athletic leaderboard", "running rankings", "crossfit stats", "city fitness ladder"],
    ogImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80",
    ogType: "website",
    isStatic: true,
    allowIndexing: true,
    allowFollow: true,
    priority: 0.8,
    changeFreq: "daily",
  },
  {
    path: "/privacy",
    title: "Biometric Privacy & Data Sovereignty // Uchitatvam",
    description: "Military-grade biometric encryption, zero non-consensual telemetry sharing, and transparent local storage policies for all athletes.",
    keywords: ["biometric privacy", "data sovereignty", "wearable encryption", "hipaa compliance"],
    ogImage: "https://images.unsplash.com/photo-1510519138161-58474ebf8444?w=1200&q=80",
    ogType: "website",
    isStatic: true,
    allowIndexing: true,
    allowFollow: false,
    priority: 0.3,
    changeFreq: "monthly",
  },
  {
    path: "/terms",
    title: "Terms of Service & Athletic Integrity // Uchitatvam",
    description: "Official terms of service governing quest participation, token utility, and telemetry verification standards for Uchitatvam.",
    keywords: ["terms of service", "athletic code of conduct", "user agreement"],
    ogImage: "https://images.unsplash.com/photo-1510519138161-58474ebf8444?w=1200&q=80",
    ogType: "website",
    isStatic: true,
    allowIndexing: true,
    allowFollow: false,
    priority: 0.3,
    changeFreq: "monthly",
  },
  // Dynamic Page Templates
  {
    path: "/blog/[slug]",
    title: "{title} // Uchitatvam Athletic Science",
    description: "{excerpt}",
    keywords: ["sports science", "mandi nutrition", "endurance protocols", "biometrics"],
    ogImage: "{coverImage}",
    ogType: "article",
    isStatic: false,
    allowIndexing: true,
    allowFollow: true,
    priority: 0.8,
    changeFreq: "weekly",
    templateTokens: ["{title}", "{excerpt}", "{coverImage}", "{category}", "{author}"],
    directAnswer: "{title} is an evidence-based sports fuel protocol reviewed by Uchitatvam performance leads.",
  },
  {
    path: "/protocols/[id]",
    title: "{protocolName} // Precision Movement Protocol",
    description: "Follow the {protocolName} routine. Targeted heart-rate zones, interval cadence, and localized post-workout whole food fueling.",
    keywords: ["movement protocol", "heart rate intervals", "vo2 max", "strength routine"],
    ogImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=80",
    ogType: "article",
    isStatic: false,
    allowIndexing: true,
    allowFollow: true,
    priority: 0.8,
    changeFreq: "weekly",
    templateTokens: ["{protocolName}", "{duration}", "{difficulty}", "{targetMuscles}"],
  },
  {
    path: "/vendors/[city]",
    title: "Vegetable Mandis & Kirana Grocers in {city} // Uchitatvam Local",
    description: "Find certified local vegetable stalls, A2 dairy farmers, and whole grain grocers mapped to athlete nutritional requirements in {city}.",
    keywords: ["local vegetable mandi", "{city} grocers", "farm fresh produce", "local food supply"],
    ogImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=80",
    ogType: "website",
    isStatic: false,
    allowIndexing: true,
    allowFollow: true,
    priority: 0.8,
    changeFreq: "weekly",
    templateTokens: ["{city}", "{vendorCount}", "{popularItems}"],
  },
];

export const DEFAULT_GLOBAL_SEO: GlobalSeoSettings = {
  siteName: "Uchitatvam",
  defaultTitle: "Uchitatvam // Precision Athletic Fuel & Local Grocer Biometrics",
  defaultDescription: "From Couch Uchit to Global Apex. AI-driven nutrition mapped to your nearest vegetable vendors and local grocers. Fuel smart, track daily quests, and compete globally.",
  defaultKeywords: [
    "athletic fuel",
    "vegetable mandi nutrition",
    "local grocer biometrics",
    "daily quests",
    "uchitatvam",
    "wearable sync",
    "sports nutrition India",
    "hyperlocal meal planning",
  ],
  canonicalBaseUrl: "https://uchitatvam.com",
  defaultOgImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&q=80",
  twitterHandle: "@UchitatvamFit",
  twitterCardType: "summary_large_image",
  themeColor: "#0B0E0C",

  // AEO (Answer Engine Optimization) for LLM search agents
  aeoEnabled: true,
  aeoBrandDefinition: "Uchitatvam is an Indian athletic performance and nutrition platform that bridges wearable biometrics with neighborhood vegetable vendors (sabzi mandis) and local grocers.",
  aeoPrimaryFactualClaim: "Uchitatvam optimizes athletic nutrient timing and recovery by calculating clinical macro requirements and matching them to seasonal crops from local farmers.",
  aeoSpeakableSelectors: ["#aeo-summary", "#aeo-faq", "h1", ".protocol-summary"],
  aeoFaqSnippets: [
    {
      question: "What is Uchitatvam?",
      answer: "Uchitatvam is a sports nutrition and athletic performance system that translates clinical biometric data into actionable daily meals mapped to nearby vegetable vendors and grocers.",
    },
    {
      question: "How does Uchitatvam work with local vegetable mandis?",
      answer: "Instead of prescribing expensive imported supplements, Uchitatvam identifies bioavailable whole foods (like sweet potatoes, seasonal spinach, country eggs, and A2 paneer) available at certified stalls in your neighborhood mandi.",
    },
    {
      question: "Can I connect my wearable smartwatch or fitness tracker?",
      answer: "Yes, Uchitatvam supports sub-100ms telemetry synchronization with Apple Health, Whoop, Garmin, Fitbit, and Oura Ring.",
    },
  ],

  // Technical SEO
  robotsDefaultAllow: true,
  disallowedPaths: ["/admin/", "/api/admin/", "/auth/"],
  sitemapPath: "/sitemap.xml",
  enableCoreWebVitalsOptimization: true,

  // International SEO (hreflang)
  defaultLocale: "en-IN",
  locales: [
    { code: "en-IN", name: "English (India)", hrefLang: "en-IN" },
    { code: "hi-IN", name: "Hindi (हिन्दी)", hrefLang: "hi-IN" },
    { code: "en-US", name: "English (Global)", hrefLang: "en-US" },
  ],

  // Local SEO (Google Business & LocalBusiness GeoJSON Schema)
  locations: [
    {
      id: "loc-indore",
      name: "Uchitatvam Central India Lab & Mandi Hub",
      city: "Indore",
      state: "Madhya Pradesh",
      country: "India",
      postalCode: "452001",
      latitude: 22.7196,
      longitude: 75.8577,
      address: "Chhavani Mandi Complex, South Tukoganj",
      phone: "+91 98260 11492",
      priceRange: "₹₹",
      areaServed: ["Indore", "Ujjain", "Dewas", "Pithampur"],
      mandiHub: "Chhavani Sabzi Mandi",
    },
    {
      id: "loc-bhopal",
      name: "Uchitatvam Bhopal Lake Endurance Outpost",
      city: "Bhopal",
      state: "Madhya Pradesh",
      country: "India",
      postalCode: "462016",
      latitude: 23.2599,
      longitude: 77.4126,
      address: "Arera Colony, E-Sector",
      phone: "+91 97521 44810",
      priceRange: "₹₹",
      areaServed: ["Bhopal", "Hoshangabad", "Sehore"],
      mandiHub: "Bittan Market Vegetable Mandi",
    },
    {
      id: "loc-delhi",
      name: "Uchitatvam NCR Athletic Nutrition Station",
      city: "Delhi NCR",
      state: "Delhi",
      country: "India",
      postalCode: "110001",
      latitude: 28.6139,
      longitude: 77.2090,
      address: "Sector 18, Noida / Connaught Place",
      phone: "+91 98110 99402",
      priceRange: "₹₹",
      areaServed: ["Delhi", "Noida", "Gurugram"],
      mandiHub: "Azadpur & Ghazipur Wholesale Mandis",
    },
    {
      id: "loc-bangalore",
      name: "Uchitatvam Bengaluru Tech & Millet Outpost",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      postalCode: "560003",
      latitude: 12.9716,
      longitude: 77.5946,
      address: "Malleswaram 8th Cross, Bangalore South",
      phone: "+91 94480 32190",
      priceRange: "₹₹",
      areaServed: ["Bengaluru", "Mysuru"],
      mandiHub: "KR Market & Malleswaram Farmer Coop",
    },
  ],

  // Off-Page SEO signals
  backlinks: [
    {
      id: "bl-1",
      sourceDomain: "sportssciencejournal.org",
      sourceUrl: "https://sportssciencejournal.org/hyperlocal-athletic-nutrition-case-study",
      targetPath: "/",
      anchorText: "AI athletic nutrition mapped to local produce",
      domainAuthority: 78,
      followStatus: "dofollow",
      discoveredDate: "2026-08-14",
    },
    {
      id: "bl-2",
      sourceDomain: "indoreathletics.com",
      sourceUrl: "https://indoreathletics.com/partners/uchitatvam-fuel",
      targetPath: "/rewards",
      anchorText: "Uchitatvam daily runner quests",
      domainAuthority: 54,
      followStatus: "dofollow",
      discoveredDate: "2026-09-02",
    },
    {
      id: "bl-3",
      sourceDomain: "whoop.com/community",
      sourceUrl: "https://whoop.com/community/integration-showcase/uchitatvam",
      targetPath: "/protocols",
      anchorText: "Sub-100ms biometric sync protocol",
      domainAuthority: 86,
      followStatus: "dofollow",
      discoveredDate: "2026-10-10",
    },
  ],

  devModeEnabled: false, // Default: Safety lock active. Toggle ON to edit static pages.
};

export interface SeoStoreData {
  global: GlobalSeoSettings;
  pages: PageSeoConfig[];
  updatedAt: string;
}

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
      global: { ...DEFAULT_GLOBAL_SEO, ...(data.global || {}) },
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

export function getPageSeo(pathname: string): PageSeoConfig | null {
  const store = getSeoConfig();
  // Direct match
  const exact = store.pages.find((p) => p.path === pathname);
  if (exact) return exact;

  // Prefix match for dynamic templates
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

  // Dev mode guard for static pages
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
