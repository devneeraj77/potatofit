import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Uchitatvam - Precision Athletic Fuel & Biometrics",
    short_name: "Uchitatvam",
    description:
      "Uchitatvam - Precision Athletic Fuel & Biometrics. AI-driven nutrition mapped to local markets and real-time athletic biometric quests.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0B0E0C",
    theme_color: "#0B0E0C",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
