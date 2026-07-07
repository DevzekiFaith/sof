"use client";

import { useState } from "react";
import Button from "../components/ui/Button";
import AnimatedSection from "../components/ui/AnimatedSection";
import Link from "next/link";
import { Mail, Check } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to a backend
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-24">
      {/* Top Gradient */}
      <div className="relative pt-24 pb-8 px-6 sm:px-10 bg-gradient-to-b from-[#064e3b] to-[#121212]">
        <div className="flex flex-col md:flex-row items-end gap-6 max-w-7xl mx-auto relative z-10">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-none bg-gradient-to-br from-[#60a5fa] to-[#1db954] shadow-2xl flex items-center justify-center flex-shrink-0 border border-[#282828]">
            <Mail size={80} strokeWidth={1.5} className="text-white" />
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold tracking-wider uppercase text-[#60a5fa]">Support</span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tighter truncate">
              Get in Touch
            </h1>
            <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
              <span>Customer Service</span>
              <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              <span>Partnerships</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 sm:px-10 py-6 max-w-7xl mx-auto flex items-center gap-6 border-b border-[#282828]">
        <Link href="/#courses">
          <button className="w-14 h-14 rounded-full bg-[#60a5fa] flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg">
            <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
          </button>
        </Link>
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Contact Content */}
      <section className="px-6 sm:px-10 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {submitted ? (
              <AnimatedSection>
                <div className="p-6 sm:p-8 bg-[#60a5fa]/10 border border-[#60a5fa]/20 rounded-xl mb-8">
                  <p className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
                      <Check className="text-[#60a5fa] w-6 h-6" /> Thank you! We&apos;ll get back to you soon.
                  </p>
                </div>
              </AnimatedSection>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatedSection delay={100}>
                  <div>
                    <label className="block text-sm font-bold text-white uppercase tracking-wider mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-[#181818] border border-[#282828] rounded-md focus:border-[#60a5fa] focus:outline-none text-white transition-all duration-300"
                      required
                    />
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={150}>
                  <div>
                    <label className="block text-sm font-bold text-white uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#181818] border border-[#282828] rounded-md focus:border-[#60a5fa] focus:outline-none text-white transition-all duration-300"
                      required
                    />
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={200}>
                  <div>
                    <label className="block text-sm font-bold text-white uppercase tracking-wider mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-[#181818] border border-[#282828] rounded-md focus:border-[#60a5fa] focus:outline-none text-white transition-all duration-300"
                      required
                    />
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={250}>
                  <div>
                    <label className="block text-sm font-bold text-white uppercase tracking-wider mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 bg-[#181818] border border-[#282828] rounded-md focus:border-[#60a5fa] focus:outline-none text-white resize-none transition-all duration-300"
                      required
                    />
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={300}>
                  <button type="submit" className="px-8 py-3 bg-[#60a5fa] text-black font-bold rounded-full hover:scale-105 transition-transform">
                    Send Message
                  </button>
                </AnimatedSection>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Other Ways to Reach Us</h2>
            <div className="bg-[#181818] p-6 rounded-md border border-[#282828] space-y-6">
              <div>
                <div className="text-[#b3b3b3] text-sm uppercase tracking-wider mb-1">Email</div>
                <div className="text-lg font-bold text-white">contact@magis.com</div>
              </div>
              <div>
                <div className="text-[#b3b3b3] text-sm uppercase tracking-wider mb-1">Phone</div>
                <div className="text-lg font-bold text-white">+1 (555) 123-4567</div>
              </div>
              <div>
                <div className="text-[#b3b3b3] text-sm uppercase tracking-wider mb-1">Office Hours</div>
                <div className="text-lg font-bold text-white">Mon - Fri, 9 AM - 5 PM</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

