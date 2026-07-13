"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0b1220] text-zinc-300 font-sans selection:bg-[#60a5fa]/30">
      
      {/* Header Navigation */}
      <header className="h-16 border-b border-white/5 bg-[#0b1220]/80 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm text-[#9aa4b2] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <span className="text-[#60a5fa] font-black tracking-widest text-xs uppercase">
          Origin Legal
        </span>
      </header>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        
        {/* Intro Hero Section */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#60a5fa]/10 border border-[#60a5fa]/20 text-[#60a5fa] mb-2">
            <Shield size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase">
            Last Updated: July 13, 2026
          </p>
        </div>

        {/* Legal Text body */}
        <div className="bg-zinc-950/60 border border-white/5 rounded-3xl p-8 md:p-12 space-y-8 leading-relaxed text-sm md:text-base">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">1. Introduction</h2>
            <p>
              Welcome to **Origin** ("we," "our," or "us"). We are committed to protecting your personal data and respecting your privacy. This Privacy Policy outlines how we collect, use, process, share, and protect your information when you enroll in our courses, buy our eBooks, or interact with our web platform (located at <Link href="/" className="text-[#60a5fa] hover:underline">https://sof-beta.vercel.app</Link>).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">2. Information We Collect</h2>
            <p>
              We collect information to provide a better user experience and facilitate course enrollment and transactions. This information includes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Account Registration Data:</strong> Email addresses and profiles generated through authentication.
              </li>
              <li>
                <strong className="text-zinc-200">Transaction Details:</strong> Payment verification IDs, course registrations, and eBook downloads. We do not store raw card numbers; payments are handled directly by our secure third-party provider (Flutterwave).
              </li>
              <li>
                <strong className="text-zinc-200">User Progress & Preferences:</strong> Interactive choices, onboarding answers, course completion rates, and platform configuration details.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">3. How We Use Your Information</h2>
            <p>
              We utilize your collected personal data for the following essential business purposes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Facilitating instant checkout, digital payments, and access to bought items.</li>
              <li>Generating educational certifications and tracking learning milestone statistics.</li>
              <li>Sending necessary platform notifications (such as billing notifications or reset links).</li>
              <li>Optimizing course recommendations and upgrading platform UI accessibility.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">4. Security of Your Data</h2>
            <p>
              We prioritize data safety and implement technical safeguards including SSL/TLS encryption, secure database schema configurations, and tokenized session access. However, no database storage or online transfer can guarantee absolute 100% security; we recommend utilizing strong passwords and keeping authentication information private.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">5. Third-Party Integrations</h2>
            <p>
              We partner with specialized third-party services to guarantee high-performance features. These services maintain their own respective privacy rules:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Supabase:</strong> For backend database services, real-time sync, and user profile authentication.
              </li>
              <li>
                <strong className="text-zinc-200">Flutterwave:</strong> To process secure payment transactions dynamically during checkout.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">6. Your Rights & Choices</h2>
            <p>
              You have the right to request access to the data we store about you, update inaccurate information, or request the deletion of your account. You can do this at any time by contacting our support team via <Link href="/contact" className="text-[#60a5fa] hover:underline">Support Portal</Link>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">7. Modifications to This Policy</h2>
            <p>
              We reserve the right to revise this Privacy Policy. Any modifications will be posted directly to this page with an updated date. Continued utilization of the platform after updates constitutes acceptance of the new conditions.
            </p>
          </section>

        </div>

        {/* Footer info copy */}
        <div className="text-center text-xs text-zinc-600 font-medium">
          © 2026 Origin. All rights reserved. For legal questions, contact support@origin-community.com
        </div>

      </div>
    </div>
  );
}
