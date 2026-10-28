import React from "react";
import { getSeoConfig } from "@/lib/seo-store";

export default function StructuredData() {
  const { global } = getSeoConfig();
  const baseUrl = global.canonicalBaseUrl || "https://uchitatvam.com";

  // 1. Organization & SoftwareApplication Schema
  const webAppSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}/#webapp`,
        "name": global.siteName,
        "url": baseUrl,
        "applicationCategory": "HealthApplication",
        "operatingSystem": "All (Web, iOS, Android PWA)",
        "description": global.defaultDescription,
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR",
        },
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": global.siteName,
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/uchitatvam-logo.svg`,
          "width": 512,
          "height": 512,
        },
        "sameAs": [
          "https://twitter.com/UchitatvamFit",
          "https://instagram.com/uchitatvam.fit",
          "https://linkedin.com/company/uchitatvam",
        ],
        "founder": [
          {
            "@type": "Person",
            "name": "Neeraj Rekwar",
            "jobTitle": "Lead Founder & Architect",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": global.siteName,
        "description": global.defaultDescription,
        "publisher": {
          "@id": `${baseUrl}/#organization`,
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/blog?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      // 2. AEO (Answer Engine Optimization) & Voice Search Speakable Schema
      ...(global.aeoEnabled
        ? [
            {
              "@type": "FAQPage",
              "@id": `${baseUrl}/#aeo-faq`,
              "mainEntity": global.aeoFaqSnippets.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer,
                },
              })),
            },
            {
              "@type": "WebPage",
              "@id": `${baseUrl}/#speakable-page`,
              "url": baseUrl,
              "name": global.defaultTitle,
              "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": global.aeoSpeakableSelectors,
              },
            },
          ]
        : []),
      // 3. Local SEO Mandi Hubs
      ...global.locations.map((loc) => ({
        "@type": "LocalBusiness",
        "@id": `${baseUrl}/#loc-${loc.id}`,
        "name": `${loc.name} - ${global.siteName}`,
        "telephone": loc.phone,
        "priceRange": loc.priceRange,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": loc.address,
          "addressLocality": loc.city,
          "addressRegion": loc.state,
          "postalCode": loc.postalCode,
          "addressCountry": "IN",
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": loc.latitude,
          "longitude": loc.longitude,
        },
        "areaServed": loc.areaServed,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
    />
  );
}
