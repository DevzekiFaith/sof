"use client";

import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function TermsOfService() {
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
            <Scale size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
            Terms of Service
          </h1>
          <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase">
            Last Updated: July 13, 2026
          </p>
        </div>

        {/* Legal Text body */}
        <div className="bg-zinc-950/60 border border-white/5 rounded-3xl p-8 md:p-12 space-y-8 leading-relaxed text-sm md:text-base">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, enrolling in courses, or purchasing materials from **Origin** ("we," "our," or "us"), you agree to be bound by these Terms of Service. If you do not agree with any part of these conditions, you must immediately cease using the website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">2. Intellectual Property Rights</h2>
            <p>
              All learning material, downloadable digital eBooks, graphic flyers, layouts, text descriptions, courses, interactive modules, and videos uploaded on this platform are owned exclusively by **Origin** or licensed content creators. 
            </p>
            <p className="text-zinc-400">
              You are granted a limited, personal, non-transferable, and revocable license to access our platform solely for your personal, non-commercial education. You may not copy, reproduce, republish, distribute, sell, or modify any content without explicit written consent from Origin.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">3. User Accounts</h2>
            <p>
              When creating an account to enroll in courses or track your milestones, you agree to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Provide accurate, current, and complete profile information.</li>
              <li>Maintain the confidentiality and security of password credentials.</li>
              <li>Assume full responsibility for all activities that occur under your session ID.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">4. Payments and Billing</h2>
            <p>
              All checkout amounts are securely handled in cooperation with third-party payment gateways (e.g. Flutterwave). You agree to pay the stated prices for all course enrollments and digital products. We reserve the right to modify prices, launch special promotions, or terminate access for inaccurate payments at our sole discretion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">5. User Conduct</h2>
            <p>
              You agree to use our platform only for lawful educational purposes. Prohibited actions include:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Deploying automated scrapers, bots, or diagnostic scripts to extract course databases.</li>
              <li>Injecting malicious software, Trojans, or custom scripts into community text fields.</li>
              <li>Harassing or abusing other students/mentors in the discussion forums.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">6. Limitation of Liability</h2>
            <p>
              Origin, its founders, and affiliates shall not be liable for any indirect, incidental, special, or consequential damages resulting from your enrollment or temporary inability to access the online system.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">7. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the local laws, without regard to conflict of law principles. Any dispute arising under these conditions will be subject to local arbitration rules.
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
