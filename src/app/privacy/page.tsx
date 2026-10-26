import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  Lock,
  HeartPulse,
  Database,
  EyeOff,
  UserCheck,
  Cookie,
  ArrowLeft,
  Server,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy // Uchitatvam Athletic Protocols",
  description:
    "Comprehensive privacy charter and biometric data security protocols governing Uchitatvam wearable telemetry, nutrition algorithms, and user rights.",
};

export default function PrivacyPage() {
  const lastUpdated = "March 24, 2026";

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F5] dark:bg-[#0B0E0C] text-[#121815] dark:text-[#E2E7DE] transition-colors">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Back Link & Eyebrow */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#505445] dark:text-[#A0A493] hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Uchitatvam Home</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#7A5A00] dark:text-[#f7fe72] mb-1">
            <span>Data Protection &amp; Biometric Security</span>
            <span>·</span>
            <span>Effective {lastUpdated}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#121815] dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#505445] dark:text-[#CBD2C7] max-w-3xl leading-relaxed">
            Your physiological biometrics and daily health records belong exclusively to you. This Privacy Policy details how Uchitatvam safeguards your health metrics, wearable sync feeds, and local nutrition queries with end-to-end cryptographic integrity.
          </p>
        </div>

        {/* Biometric Non-Monetization Pledge Card */}
        <div className="rounded-2xl p-5 sm:p-6 bg-[#EAEFEA] dark:bg-[#121815] border border-[#757761]/25 dark:border-[#757761]/35 mb-12 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#1D2520] text-[#f7fe72] shrink-0 mt-0.5">
              <EyeOff className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h2 className="text-sm sm:text-base font-bold text-[#121815] dark:text-white">
                Our Biometric Non-Monetization Guarantee
              </h2>
              <p className="text-xs sm:text-sm text-[#505445] dark:text-[#CBD2C7] leading-relaxed">
                Uchitatvam will never sell, lease, or syndicate your biometric data (heart rate variability, sleep stages, VO2 max, glucose trends, or training tonnage) to health insurance providers, pharmaceutical conglomerates, or programmatic ad networks. Your data exists solely to power your personalized training and recovery.
              </p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Quick Anchor Sidebar */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 p-5 rounded-2xl bg-[#EAEFEA]/70 dark:bg-[#121815]/70 border border-[#757761]/20 dark:border-[#757761]/30 backdrop-blur-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#121815] dark:text-white">
                Privacy Sections
              </h3>
              <nav className="flex flex-col space-y-2 text-xs text-[#505445] dark:text-[#A0A493]">
                <a href="#section-1" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">1. Scope &amp; Legal Framework</a>
                <a href="#section-2" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">2. Information We Collect</a>
                <a href="#section-3" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">3. How Health Data is Used</a>
                <a href="#section-4" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">4. Wearable Sync Protocols</a>
                <a href="#section-5" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">5. Cookie &amp; Storage Technologies</a>
                <a href="#section-6" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">6. Cryptographic Security</a>
                <a href="#section-7" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">7. Your Rights &amp; Data Export</a>
                <a href="#section-8" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">8. Retention &amp; Deletion</a>
                <a href="#section-9" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">9. Data Protection Officer</a>
              </nav>
            </div>
          </aside>

          {/* Legal Articles */}
          <div className="lg:col-span-8 space-y-10 text-xs sm:text-sm text-[#383C30] dark:text-[#CBD2C7] leading-relaxed">
            {/* Section 1 */}
            <section id="section-1" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                1. Scope &amp; Legal Compliance Framework
              </h2>
              <p>
                This Privacy Policy describes the policies and procedures of Uchitatvam Inc. (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) regarding the collection, handling, and disclosure of personal, behavioral, and biometric data.
              </p>
              <p>
                We comply with the Digital Personal Data Protection Act, 2023 (DPDP Act, India), the General Data Protection Regulation (GDPR, EU 2016/679), and the California Consumer Privacy Act as amended (CCPA/CPRA). Uchitatvam functions as a Data Fiduciary under the DPDP Act and a Data Controller under the GDPR.
              </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                2. Information We Collect
              </h2>
              <p>
                To provide tailored adaptive athletic programming and grocery matching, we collect the following categories of information:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#505445] dark:text-[#A0A493]">
                <li>
                  <strong className="text-[#121815] dark:text-white">Account Profile Data:</strong> Name, email address, password hash, demographic age, gender identity, and baseline fitness level.
                </li>
                <li>
                  <strong className="text-[#121815] dark:text-white">Wearable Biomarker Streams:</strong> Heart Rate Variability (HRV in rMSSD), resting heart rate (RHR), sleep latency and architecture (Light, REM, Deep), cardiovascular Zone 2 to Zone 5 strain, and estimated VO2 max.
                </li>
                <li>
                  <strong className="text-[#121815] dark:text-white">Workout &amp; Session Records:</strong> Barbell tonnage moved, movement form match telemetry, subjective RPE (Rate of Perceived Exertion), workout duration, and quest milestones.
                </li>
                <li>
                  <strong className="text-[#121815] dark:text-white">Nutritional &amp; Grocery Preferences:</strong> Dietary preferences (e.g. Vegetarian, Satvik, High Protein, Vegan) and localized neighborhood mandi search quadrants.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                3. How We Process Your Health &amp; Fitness Data
              </h2>
              <p>We process your data strictly for legitimate athletic coaching purposes, including:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#505445] dark:text-[#A0A493]">
                <li>Calculating your daily Recovery Score and adjusting proposed workout intensity.</li>
                <li>Computing leaderboard scores and validating quest progression in the Uchitatvam Arena.</li>
                <li>Recommending seasonal, whole-food recipes mapped to regional availability.</li>
                <li>Auditing system stability and detecting fraudulent score manipulation.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                4. Wearable Third-Party Sync Protocols
              </h2>
              <p>
                When you connect devices (Apple Health, WHOOP, Garmin, Oura, Polar, Strava), authentication occurs directly through secure OAuth 2.0 PKCE tokens. We never store your third-party account credentials. You can revoke device authorization at any time with immediate cessation of data ingestion.
              </p>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <Cookie className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                5. Cookie &amp; Storage Technologies
              </h2>
              <p>
                We use cookies and browser local storage to maintain session states, preserve your theme preference, and cache active workout timers. You can adjust your cookie preferences at any time using our Cookie Consent banner or via the link in the footer.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#141A16] border border-[#757761]/25 dark:border-[#757761]/35">
                  <h3 className="font-semibold text-xs text-[#121815] dark:text-white">Essential Cookies</h3>
                  <p className="text-[11px] text-[#505445] dark:text-[#A0A493] mt-1">
                    CSRF protection, secure authentication tokens, and theme mode. Always required.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#141A16] border border-[#757761]/25 dark:border-[#757761]/35">
                  <h3 className="font-semibold text-xs text-[#121815] dark:text-white">Biometric Telemetry Cache</h3>
                  <p className="text-[11px] text-[#505445] dark:text-[#A0A493] mt-1">
                    Client-side buffer for high-frequency heart rate and interval sets during active workouts.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                6. Cryptographic Security Standards
              </h2>
              <p>
                Uchitatvam incorporates defense-in-depth infrastructure to protect sensitive physiological records:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#505445] dark:text-[#A0A493]">
                <li><strong className="text-[#121815] dark:text-white">Encryption at Rest:</strong> All database volumes and biometric tables are encrypted via AES-256 GCM.</li>
                <li><strong className="text-[#121815] dark:text-white">Encryption in Transit:</strong> Strict HTTPS with TLS 1.3 encryption across all public and internal service boundaries.</li>
                <li><strong className="text-[#121815] dark:text-white">Role-Based Access Control:</strong> Internal human access to raw user biometric telemetry is restricted through zero-standing-privilege access workflows.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                7. Your Rights &amp; Complete Data Export
              </h2>
              <p>
                Under the DPDP Act 2023, GDPR, and global data privacy standards, you have the following rights:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#505445] dark:text-[#A0A493]">
                <li><strong className="text-[#121815] dark:text-white">Right of Access:</strong> Request a full machine-readable copy (JSON / CSV) of all biometric and nutritional data stored under your account.</li>
                <li><strong className="text-[#121815] dark:text-white">Right of Erasure (&quot;Right to be Forgotten&quot;):</strong> Request the permanent purge of your profile, streak records, and biometric history.</li>
                <li><strong className="text-[#121815] dark:text-white">Right to Rectification:</strong> Correct inaccurate profile or health metric entries.</li>
                <li><strong className="text-[#121815] dark:text-white">Right to Withdraw Consent:</strong> Revoke wearable sync authorization at any moment.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white">
                8. Data Retention &amp; Inactivity Purging
              </h2>
              <p>
                We retain your workout logs and aggregated biomarkers for the duration of your active subscription. If an account remains inactive for a period exceeding 24 consecutive months with no active logins or wearable pings, we initiate a scheduled automated purge of identifying biometric data after delivering advance email notice.
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="scroll-mt-28 space-y-3 border-t border-[#757761]/25 pt-6">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white">
                9. Data Protection Officer (DPO) Contact
              </h2>
              <p>
                To exercise any of your data rights or file an inquiry regarding biometric protection, reach our dedicated Data Protection Officer:
              </p>
              <div className="p-4 rounded-xl bg-[#EAEFEA] dark:bg-[#121815] border border-[#757761]/25 dark:border-[#757761]/35 font-mono text-xs space-y-1">
                <p className="font-bold text-[#121815] dark:text-white">Data Protection Office — Uchitatvam Inc.</p>
                <p className="text-[#505445] dark:text-[#A0A493]">Email: privacy@uchitatvam.com</p>
                <p className="text-[#505445] dark:text-[#A0A493]">Attention: Grievance Officer, DPDP Compliance</p>
                <p className="text-[#505445] dark:text-[#A0A493]">Bengaluru, Karnataka 560038, India</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
