"use client";

import AnimatedSection from "../components/ui/AnimatedSection";
import Link from "next/link";
import { BookOpen, Zap, RotateCcw, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0f1724] text-white pb-24">
      {/* Top Gradient */}
      <div className="relative pt-24 pb-8 px-6 sm:px-10 bg-gradient-to-b from-[#0b1220] to-[#0f1724]">
        <div className="flex flex-col md:flex-row items-end gap-6 max-w-7xl mx-auto relative z-10">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-none bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] shadow-2xl flex items-center justify-center flex-shrink-0 border border-white/5">
            <BookOpen size={80} strokeWidth={1.5} className="text-white" />
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold tracking-wider uppercase text-[#60a5fa]">Our Story</span>
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tighter truncate">
              About Origin
            </h1>
            <div className="flex items-center gap-4 text-sm font-medium text-[#9aa4b2]">
              <span>Formation Platform</span>
              <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              <span>10,000+ Learners</span>
              <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              <span>Since 2026</span>
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
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        </button>
      </div>

      {/* About Content */}
      <section className="px-6 sm:px-10 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <AnimatedSection>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
                <p className="text-[#9aa4b2] text-lg leading-relaxed">
                   We empower individuals aged 10 to 45 with practical life and professional skills. Origin is a formation platform — rooted in the idea that growth is intentional, staged, and always pointing higher. No fluff. No theory for theory&apos;s sake. Just structured formation that works.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={100}>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">What We Do</h2>
                 <p className="text-[#9aa4b2] text-lg leading-relaxed mb-6">
                   Origin offers structured courses in capital development, persuasion, decision-making, teamwork, and more. Each program follows our formation method:
                </p>
                <ul className="space-y-4">
                  {[
                    { label: "Learn", icon: <BookOpen className="w-5 h-5 text-[#60a5fa]" />, desc: "Deep dive into core formation content" },
                    { label: "Practice", icon: <Zap className="w-5 h-5 text-[#60a5fa]" />, desc: "Active exercises to build muscle memory" },
                    { label: "Reflect", icon: <RotateCcw className="w-5 h-5 text-[#60a5fa]" />, desc: "Internalize lessons through guided reflection" },
                    { label: "Apply", icon: <Target className="w-5 h-5 text-[#60a5fa]" />, desc: "Real-world application in your daily life" },
                  ].map((stage, i) => (
                    <li key={i} className="flex items-center gap-4 group bg-[#0b1220] p-4 rounded-md hover:bg-[#0f1724] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#60a5fa]/10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                        {stage.icon}
                      </div>
                      <p className="text-[#9aa4b2]"><strong className="text-white">{stage.label}</strong> - {stage.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Who We Serve</h2>
                <p className="text-[#b3b3b3] text-lg leading-relaxed">
                  Whether you’re a student finding your feet, a professional leveling up, or someone stubbornly committed to growth — Origin was built for you. Our age-inclusive formation means everyone, everywhere, can grow.
                </p>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Sidebar (Similar to "About the Artist" stats) */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Platform Stats</h2>
            <div className="bg-[#181818] p-6 rounded-md border border-[#282828]">
              <div className="mb-6">
                <div className="text-[#b3b3b3] text-sm uppercase tracking-wider mb-1">Monthly Active Learners</div>
                <div className="text-3xl font-black text-white">45,201</div>
              </div>
              <div className="mb-6">
                <div className="text-[#b3b3b3] text-sm uppercase tracking-wider mb-1">Total XP Earned</div>
                <div className="text-3xl font-black text-[#60a5fa]">1.2M+</div>
              </div>
              <div>
                <div className="text-[#b3b3b3] text-sm uppercase tracking-wider mb-1">Courses Available</div>
                <div className="text-3xl font-black text-white">24</div>
              </div>
            </div>
            
            <div className="bg-[#181818] p-6 rounded-md border border-[#282828] text-center">
               <h3 className="text-white font-bold mb-2">Ready to start?</h3>
               <p className="text-[#b3b3b3] text-sm mb-4">Join thousands of others in their formation journey.</p>
               <Link href="/#courses" className="block w-full py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
                 Browse Courses
               </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

