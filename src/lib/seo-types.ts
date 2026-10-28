export type SchemaType =
  | "WebApplication"
  | "Organization"
  | "WebSite"
  | "Article"
  | "FAQPage"
  | "LocalBusiness"
  | "Product"
  | "Recipe"
  | "HowTo"
  | "SpeakableSpecification"
  | "Custom";

export type SchemaTargetType = "global" | "static" | "dynamic";

export interface JsonLdSnippet {
  id: string;
  name: string;
  type: SchemaType;
  targetType: SchemaTargetType; // "global", "static", "dynamic"
  targetPath: string; // "global", "/", "/rewards", "/leaderboards", "/privacy", "/terms", "/blog/[slug]", "/protocols/[id]", "/vendors/[city]"
  enabled: boolean;
  jsonContent: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

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
  // JSON-LD Schemas (Technical SEO Builder)
  schemas: JsonLdSnippet[];
  // Safety lock for static pages
  devModeEnabled: boolean;
}

export interface SeoStoreData {
  global: GlobalSeoSettings;
  pages: PageSeoConfig[];
  updatedAt: string;
}

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

export const DEFAULT_SCHEMAS: JsonLdSnippet[] = [
  {
    id: "schema-root-webapp",
    name: "Platform WebApplication Architecture",
    type: "WebApplication",
    targetType: "global",
    targetPath: "global",
    enabled: true,
    description: "Core health & sports biometrics application schema recognized by Google & AI search bots.",
    jsonContent: `{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "{canonicalBaseUrl}/#webapp-root",
  "name": "{siteName}",
  "url": "{canonicalBaseUrl}",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "All (PWA, iOS, Android, Web)",
  "description": "{defaultDescription}",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  }
}`,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "schema-root-organization",
    name: "Uchitatvam Organization & Founder Entity",
    type: "Organization",
    targetType: "global",
    targetPath: "global",
    enabled: true,
    description: "Brand knowledge graph entity with verified founder credentials and official social channels.",
    jsonContent: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "{canonicalBaseUrl}/#org-root",
  "name": "{siteName}",
  "url": "{canonicalBaseUrl}",
  "logo": {
    "@type": "ImageObject",
    "url": "{canonicalBaseUrl}/uchitatvam-logo.svg",
    "width": 512,
    "height": 512
  },
  "sameAs": [
    "https://twitter.com/UchitatvamFit",
    "https://instagram.com/uchitatvam.fit",
    "https://linkedin.com/company/uchitatvam"
  ],
  "founder": {
    "@type": "Person",
    "name": "Neeraj Rekwar",
    "jobTitle": "Lead Founder & Architect"
  }
}`,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "schema-root-website",
    name: "WebSite SearchAction & Sitelinks Query",
    type: "WebSite",
    targetType: "global",
    targetPath: "global",
    enabled: true,
    description: "Enables Google Sitelinks Search Box directly from the search engine result page.",
    jsonContent: `{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "{canonicalBaseUrl}/#website-root",
  "url": "{canonicalBaseUrl}",
  "name": "{siteName}",
  "description": "{defaultDescription}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "{canonicalBaseUrl}/blog?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-02-01T00:00:00.000Z",
  },
  {
    id: "schema-static-homepage-local",
    name: "Central India Mandi Hub Schema",
    type: "LocalBusiness",
    targetType: "static",
    targetPath: "/",
    enabled: true,
    description: "Static LocalBusiness schema mapped to Chhavani Mandi Complex for the homepage.",
    jsonContent: `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "{canonicalBaseUrl}/#central-mandi-hub",
  "name": "Uchitatvam Central India Lab & Mandi Hub",
  "telephone": "+91 98260 11492",
  "priceRange": "₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Chhavani Mandi Complex, South Tukoganj",
    "addressLocality": "Indore",
    "addressRegion": "Madhya Pradesh",
    "postalCode": "452001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 22.7196,
    "longitude": 75.8577
  },
  "openingHours": "Mo-Su 05:00-22:00"
}`,
    createdAt: "2026-01-05T00:00:00.000Z",
    updatedAt: "2026-02-05T00:00:00.000Z",
  },
  {
    id: "schema-static-rewards-faq",
    name: "Daily Quests & Token FAQ Schema",
    type: "FAQPage",
    targetType: "static",
    targetPath: "/rewards",
    enabled: true,
    description: "Rich FAQPage snippet for rewards, gamification, and potato token redemption.",
    jsonContent: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "{canonicalBaseUrl}/rewards#faq-schema",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do athletes earn potato tokens and XP in Uchitatvam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Athletes complete daily verification quests such as morning hydration, logging certified farm produce from local mandis, and sustaining continuous biometric sync."
      }
    },
    {
      "@type": "Question",
      "name": "Can potato tokens be redeemed for local grocer discounts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, verified potato tokens unlock tiered redemption vouchers at participating vegetable vendors and kirana partners across Indore, Bhopal, Delhi NCR, and Bengaluru."
      }
    }
  ]
}`,
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-02-10T00:00:00.000Z",
  },
  {
    id: "schema-dynamic-blog-article",
    name: "Dynamic Sports Science BlogPosting",
    type: "Article",
    targetType: "dynamic",
    targetPath: "/blog/[slug]",
    enabled: true,
    description: "Dynamic article snippet for sports science guides with token placeholders.",
    jsonContent: `{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{title}",
  "description": "{excerpt}",
  "image": "{coverImage}",
  "author": {
    "@type": "Person",
    "name": "{authorName}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{siteName}",
    "logo": {
      "@type": "ImageObject",
      "url": "{canonicalBaseUrl}/uchitatvam-logo.svg"
    }
  },
  "datePublished": "{publishedAt}",
  "dateModified": "{updatedAt}",
  "articleSection": "{categoryName}"
}`,
    createdAt: "2026-01-12T00:00:00.000Z",
    updatedAt: "2026-02-12T00:00:00.000Z",
  },
  {
    id: "schema-dynamic-protocols-recipe",
    name: "Athletic Fuel Meal Recipe Schema",
    type: "Recipe",
    targetType: "dynamic",
    targetPath: "/protocols/[id]",
    enabled: true,
    description: "Macro-calculated sports fuel recipe mapped to local Mandi ingredients.",
    jsonContent: `{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "{protocolName} Athletic Fuel Bowl",
  "description": "High-leucine, electrolyte-rich sports fuel protocol mapped to local Indian mandi ingredients.",
  "prepTime": "PT15M",
  "cookTime": "PT10M",
  "recipeCategory": "SportsNutrition",
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "480 calories",
    "proteinContent": "32 g",
    "carbohydrateContent": "64 g",
    "fatContent": "9 g",
    "sodiumContent": "420 mg"
  },
  "recipeIngredient": [
    "100g Roasted Bengal Gram (Sattu)",
    "150g Fresh Artisanal Paneer or Curd",
    "250ml Fresh Tender Coconut Water",
    "1 Pinch Himalayan Pink Rock Salt"
  ]
}`,
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-02-15T00:00:00.000Z",
  },
  {
    id: "schema-dynamic-protocols-howto",
    name: "Biometric Cadence HowTo Schema",
    type: "HowTo",
    targetType: "dynamic",
    targetPath: "/protocols/[id]",
    enabled: true,
    description: "Step-by-step movement execution and heart rate target alignment.",
    jsonContent: `{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "{protocolName} Cadence & Execution",
  "description": "Step-by-step biometric movement protocol and heart rate target alignment.",
  "totalTime": "PT45M",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Nasal Breathing Zone 2 Base",
      "text": "Sustain 65-75% maximum heart rate with steady nasal breathing."
    },
    {
      "@type": "HowToStep",
      "name": "Intra-Set Phosphocreatine Recovery",
      "text": "Rest 90 seconds between heavy compound barbell movements."
    },
    {
      "@type": "HowToStep",
      "name": "Post-Workout Mandi Replenishment",
      "text": "Consume 30g whole food protein within 45 minutes."
    }
  ]
}`,
    createdAt: "2026-01-18T00:00:00.000Z",
    updatedAt: "2026-02-18T00:00:00.000Z",
  },
  {
    id: "schema-dynamic-vendors-local",
    name: "Regional Mandi Directory Schema",
    type: "LocalBusiness",
    targetType: "dynamic",
    targetPath: "/vendors/[city]",
    enabled: true,
    description: "Dynamic LocalBusiness markup for certified mandi and kirana locations by city.",
    jsonContent: `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Certified Vegetable Mandis & Grocers in {city}",
  "description": "Verified network of local farmers and kirana stores supplying high-potency sports nutrition in {city}.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "{city}",
    "addressCountry": "IN"
  },
  "priceRange": "₹₹",
  "currenciesAccepted": "INR",
  "paymentAccepted": "Cash, UPI"
}`,
    createdAt: "2026-01-20T00:00:00.000Z",
    updatedAt: "2026-02-20T00:00:00.000Z",
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

  // JSON-LD Schemas (Technical SEO Builder)
  schemas: DEFAULT_SCHEMAS,

  devModeEnabled: false, // Default: Safety lock active. Toggle ON to edit static pages.
};
