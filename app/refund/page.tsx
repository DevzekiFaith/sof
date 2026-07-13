"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";

export default function RefundPolicy() {
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
            <RefreshCw size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
            Refund Policy
          </h1>
          <p className="text-zinc-500 text-xs font-semibold tracking-wider uppercase">
            Last Updated: July 13, 2026
          </p>
        </div>

        {/* Legal Text body */}
        <div className="bg-zinc-950/60 border border-white/5 rounded-3xl p-8 md:p-12 space-y-8 leading-relaxed text-sm md:text-base">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">1. Overview</h2>
            <p>
              We want to guarantee a fair, transparent checkout experience for our students. Because our catalog includes both **digital downloadable products (eBooks)** and **interactive educational programs (online courses)**, different refund regulations apply to each product tier.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">2. Digital Products (eBooks / PDF Guides)</h2>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-200 text-sm space-y-1">
              <strong className="block text-white font-bold">⚠️ Strict Digital Goods Non-Refundability:</strong>
              Due to the immediate delivery and downloadable nature of digital PDF materials (such as *Money Farming* or *8 Q&A to Selling*), all eBook sales are final and non-refundable. Once a download key is generated or items are accessed from your student dashboard, the sale cannot be cancelled or refunded.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">3. Course Enrollments</h2>
            <p>
              For our premium multi-module educational courses:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>
                <strong className="text-zinc-200">7-Day Return Period:</strong> You may request a full refund within 7 days of your initial purchase date, provided you have viewed less than 20% of the course modules.
              </li>
              <li>
                <strong className="text-zinc-200">Progress Verification:</strong> Refund requests are evaluated automatically by our learning system tracking profiles. If more than 20% of the lessons are registered as completed, the account bails out of eligibility.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">4. Billing & Refund Methods</h2>
            <p>
              Approved refunds are credited directly back to the original source card or account utilized during checkout on Flutterwave. Refund processing can take between 5 to 10 business days to reflect in your bank account, depending on your financial institution.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white tracking-tight">5. Exceptional Inquiries</h2>
            <p>
              If you experienced double-billing, failed downloads, or technical access blocks due to a payment confirmation lag, please contact our transaction department immediately via our <Link href="/contact" className="text-[#60a5fa] hover:underline">Support Portal</Link> with your transaction reference token. We will resolve your issues.
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
