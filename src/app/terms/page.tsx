import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FileText,
  ShieldAlert,
  Activity,
  Trophy,
  CreditCard,
  Scale,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const metadata = {
  title: "Terms and Conditions // Uchitatvam Athletic Protocols",
  description:
    "Official terms of service and legal agreement governing the use of Uchitatvam performance biometrics, athletic arena leaderboards, and localized nutrition mapping.",
};

export default function TermsPage() {
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
            <span>Legal Governance</span>
            <span>·</span>
            <span>Effective {lastUpdated}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#121815] dark:text-white">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#505445] dark:text-[#CBD2C7] max-w-3xl leading-relaxed">
            Please read these terms carefully before engaging with Uchitatvam athletic protocols, wearable biomarker synchronization, gamified arena competitions, or localized kirana grocery mapping services.
          </p>
        </div>

        {/* Executive Highlights Callout Card */}
        <div className="rounded-2xl p-5 sm:p-6 bg-[#EAEFEA] dark:bg-[#121815] border border-[#757761]/25 dark:border-[#757761]/35 mb-12 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-[#1D2520] text-[#f7fe72] shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h2 className="text-sm sm:text-base font-bold text-[#121815] dark:text-white">
                Medical &amp; Physical Activity Disclaimer
              </h2>
              <p className="text-xs sm:text-sm text-[#505445] dark:text-[#CBD2C7] leading-relaxed">
                Uchitatvam provides software for athletic training, telemetry aggregation, and dietary planning. We do not provide licensed medical advice or clinical diagnosis. Always consult a physician prior to commencing high-intensity interval training, heavy barbell loads, or prolonged caloric partitioning. Participation in the Uchitatvam Arena is strictly voluntary and at your own risk.
              </p>
            </div>
          </div>
        </div>

        {/* Content Layout with Quick Nav Sidebar and Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Table of Contents - Desktop Sticky Sidebar */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 p-5 rounded-2xl bg-[#EAEFEA]/70 dark:bg-[#121815]/70 border border-[#757761]/20 dark:border-[#757761]/30 backdrop-blur-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-[#121815] dark:text-white">
                Table of Contents
              </h3>
              <nav className="flex flex-col space-y-2 text-xs text-[#505445] dark:text-[#A0A493]">
                <a href="#section-1" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">1. Acceptance &amp; Eligibility</a>
                <a href="#section-2" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">2. User Account &amp; Streaks</a>
                <a href="#section-3" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">3. Arena &amp; Fair Play Rules</a>
                <a href="#section-4" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">4. Wearable Biometric Sync</a>
                <a href="#section-5" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">5. Kirana Vendor Mapping</a>
                <a href="#section-6" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">6. Subscriptions &amp; Billing</a>
                <a href="#section-7" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">7. Intellectual Property</a>
                <a href="#section-8" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">8. Limitation of Liability</a>
                <a href="#section-9" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">9. Governing Law &amp; Jurisdiction</a>
                <a href="#section-10" className="hover:text-[#121815] dark:hover:text-[#f7fe72] transition-colors">10. Contact Information</a>
              </nav>
            </div>
          </aside>

          {/* Legal Articles */}
          <div className="lg:col-span-8 space-y-10 text-xs sm:text-sm text-[#383C30] dark:text-[#CBD2C7] leading-relaxed">
            {/* Section 1 */}
            <section id="section-1" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                1. Acceptance of Terms &amp; Eligibility
              </h2>
              <p>
                By accessing or registering an account on Uchitatvam (the &quot;Platform&quot;), operated by Uchitatvam Inc. (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
              <p>
                You must be at least 18 years of age (or the age of majority in your jurisdiction) to create an individual membership. If you are between 16 and 18, you may only access the Platform under the direct supervision of a parent or legal guardian who agrees to these terms on your behalf.
              </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                2. User Account &amp; Streak Integrity
              </h2>
              <p>
                To utilize the full capabilities of Uchitatvam, you must maintain an accurate and authenticated profile. You are responsible for safeguarding your credentials and for any activities undertaken via your account.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#505445] dark:text-[#A0A493]">
                <li>One person per account: Sharing accounts to artificially spoof consecutive day streaks or inflate team leaderboard scores is strictly prohibited.</li>
                <li>Notification of Breach: You agree to immediately notify Uchitatvam if you suspect any unauthorized access or security anomaly.</li>
                <li>We reserve the right to suspend or terminate accounts that register fictitious identities or exploit automated bots to trigger quest milestones.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                3. Athletic Arena, Competitions &amp; Fair Play
              </h2>
              <p>
                The Uchitatvam Global Arena allows athletes to compete on daily cardiovascular and tonnage leaderboards. To ensure the authenticity of awards and Kirana sponsor vouchers:
              </p>
              <div className="p-4 rounded-xl bg-white dark:bg-[#141A16] border border-[#757761]/25 dark:border-[#757761]/35 space-y-2">
                <p className="font-semibold text-[#121815] dark:text-white">
                  Zero Tolerance Anti-Cheating Protocol
                </p>
                <p className="text-xs text-[#505445] dark:text-[#A0A493]">
                  Any user detected simulating biometric timestamps, running virtual GPS spoofing on sprint courses, or manipulating BLE packet transfers will be immediately removed from the Season leaderboard with forfeiture of all accumulated rewards and tier badges.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                4. Wearable Biometric Synchronization
              </h2>
              <p>
                Uchitatvam synchronizes with third-party fitness APIs including Apple HealthKit, WHOOP, Garmin Connect, Oura Cloud, and Polar Flow.
              </p>
              <p>
                We do not guarantee uninterrupted, real-time availability of third-party telemetry streams. Hardware sensor latency, battery saver disconnects, or third-party API downtimes are outside Uchitatvam&apos;s direct operational control. We process such data strictly according to our Privacy Policy.
              </p>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                5. Kirana Vendor &amp; Local Grocery Directory
              </h2>
              <p>
                Our AI-driven nutrition recommendation engine maps recommended whole-food ingredients (such as paneer, sattu, lentils, cold-pressed oils, and leafy produce) to neighborhood vendors and mandis.
              </p>
              <p>
                Uchitatvam does not own, operate, prepare, or retail the food products sold by independent neighborhood vendors. We are not liable for food quality, vendor pricing variations, stock availability, or food safety hygiene standards of third-party establishments.
              </p>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                6. Memberships, Subscriptions &amp; Billing
              </h2>
              <p>
                Access to premium coaching programs and advanced biometric trend analysis is provided through recurring subscription plans:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#505445] dark:text-[#A0A493]">
                <li>
                  <strong className="text-[#121815] dark:text-white">Free Trial:</strong> New members may receive a 14-day free trial. If you do not cancel prior to the conclusion of the trial period, your selected payment method will be charged.
                </li>
                <li>
                  <strong className="text-[#121815] dark:text-white">Auto-Renewal:</strong> Subscriptions renew automatically at the specified monthly or annual frequency unless cancelled at least 24 hours prior to the next billing date via your Account Settings.
                </li>
                <li>
                  <strong className="text-[#121815] dark:text-white">14-Day Money-Back Guarantee:</strong> If you are dissatisfied with your first paid billing cycle, you may request a refund within 14 calendar days of your initial payment. Subsequent renewal periods are non-refundable.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                7. Intellectual Property &amp; Brand Rights
              </h2>
              <p>
                All software algorithms, training protocols, exercise video demonstrations, user interface graphics, trade names, and the &quot;Uchitatvam&quot; trademark are the exclusive intellectual property of Uchitatvam Inc. You are granted a limited, personal, non-commercial, revocable license to access the Platform.
              </p>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#7A5A00] dark:text-[#f7fe72]" />
                8. Limitation of Liability
              </h2>
              <p>
                To the maximum extent permitted by applicable law, Uchitatvam Inc., its founders, officers, and coach partners shall not be held liable for any indirect, incidental, punitive, or consequential damages resulting from athletic injury, overexertion, improper exercise technique, or nutritional miscalculations.
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="scroll-mt-28 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white">
                9. Governing Law &amp; Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any controversy or claim arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
              </p>
            </section>

            {/* Section 10 */}
            <section id="section-10" className="scroll-mt-28 space-y-3 border-t border-[#757761]/25 pt-6">
              <h2 className="text-lg sm:text-xl font-bold text-[#121815] dark:text-white">
                10. Contact &amp; Legal Notices
              </h2>
              <p>
                If you have questions, feedback, or legal inquiries regarding these Terms and Conditions, please contact our legal counsel:
              </p>
              <div className="p-4 rounded-xl bg-[#EAEFEA] dark:bg-[#121815] border border-[#757761]/25 dark:border-[#757761]/35 font-mono text-xs space-y-1">
                <p className="font-bold text-[#121815] dark:text-white">Uchitatvam Inc. Legal Operations</p>
                <p className="text-[#505445] dark:text-[#A0A493]">Email: compliance@uchitatvam.com</p>
                <p className="text-[#505445] dark:text-[#A0A493]">Indiranagar, 100ft Road, Bengaluru, Karnataka 560038, India</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
