import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0B0E0C",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Uchitatvam // Precision Athletic Fuel & Biometrics",
  description:
    "Uchitatvam - Precision Athletic Fuel & Biometrics. AI-driven nutrition mapped to your nearest vegetable vendors and local grocers. Fuel smart, track daily quests, and compete with athletes worldwide.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Uchitatvam",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/android-chrome-192x192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Uchitatvam // Precision Athletic Fuel & Biometrics",
    description:
      "Uchitatvam - Precision Athletic Fuel & Biometrics. AI-driven nutrition mapped to your nearest vegetable vendors and local grocers. Fuel smart, track daily quests, and compete with athletes worldwide.",
  },
};

import AuthProvider from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { OfflineIndicator } from "@/components/PWAInstallButton";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import StructuredData from "@/components/StructuredData";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <StructuredData />
      </head>
      <body className="min-h-full flex flex-col bg-[#F4F6F5] text-[#121815] dark:bg-[#0B0E0C] dark:text-[#E2E7DE] transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            {children}
            <OfflineIndicator />
            <CookieConsentBanner />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
