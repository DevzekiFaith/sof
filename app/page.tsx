"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Target, Users, TrendingUp, Heart, MessageSquare, Play, ArrowRight, BookOpen, Award, Clock, Star, Calendar, ShoppingBag, QrCode, Camera, Smartphone, Plus } from "lucide-react";
import { simplifiedCourses } from "./data/simplified-courses";
import { useCart } from "./contexts/CartContext";
import { useToast } from "./contexts/ToastContext";
import { getCompanionProductForCourse } from "./data/course-ebook-mapping";

function QRCodeSVG({ code, className = "w-32 h-32" }: { code: string; className?: string }) {
  const corners = (
    <>
      {/* Top Left Positioning Block */}
      <rect x="0" y="0" width="7" height="7" fill="black" />
      <rect x="1" y="1" width="5" height="5" fill="white" />
      <rect x="2" y="2" width="3" height="3" fill="black" />
      {/* Top Right Positioning Block */}
      <rect x="22" y="0" width="7" height="7" fill="black" />
      <rect x="23" y="1" width="5" height="5" fill="white" />
      <rect x="24" y="2" width="3" height="3" fill="black" />
      {/* Bottom Left Positioning Block */}
      <rect x="0" y="22" width="7" height="7" fill="black" />
      <rect x="1" y="23" width="5" height="5" fill="white" />
      <rect x="2" y="24" width="3" height="3" fill="black" />
      {/* Small Alignment Block */}
      <rect x="20" y="20" width="5" height="5" fill="black" />
      <rect x="21" y="21" width="3" height="3" fill="white" />
      <rect x="22" y="22" width="1" height="1" fill="black" />
    </>
  );

  let pixels: number[][] = [];
  if (code === "ORIGIN-STORE-7") {
    pixels = [
      [8,2],[10,2],[12,2],[15,2],[17,2],[19,2],
      [9,3],[11,3],[14,3],[18,3],[20,3],[21,3],
      [8,4],[13,4],[15,4],[16,4],[19,4],
      [9,5],[10,5],[12,5],[14,5],[17,5],[20,5],
      [8,8],[9,9],[12,8],[15,9],[19,8],[20,9],
      [2,9],[4,10],[10,12],[14,11],[18,12],[22,11],
      [11,14],[13,15],[16,14],[17,15],[25,14],[27,15],
      [9,18],[15,19],[21,18],[23,19],[26,18],[28,19],
      [10,22],[12,23],[14,24],[16,25],[18,26]
    ];
  } else if (code === "ORIGIN-STORE-8") {
    pixels = [
      [9,2],[11,2],[13,2],[14,2],[18,2],[20,2],
      [8,3],[10,3],[15,3],[17,3],[19,3],[21,3],
      [9,4],[12,4],[14,4],[16,4],[18,4],
      [8,5],[11,5],[13,5],[15,5],[19,5],[20,5],
      [9,8],[10,9],[11,8],[14,9],[18,8],[21,9],
      [3,9],[5,10],[9,12],[13,11],[17,12],[21,11],
      [10,14],[12,15],[15,14],[18,15],[24,14],[26,15],
      [8,18],[14,19],[20,18],[22,19],[25,18],[27,19],
      [9,22],[11,23],[13,24],[15,25],[17,26]
    ];
  } else {
    pixels = [
      [10,2],[12,2],[14,2],[16,2],[19,2],[21,2],
      [9,3],[13,3],[16,3],[18,3],[20,3],[22,3],
      [10,4],[11,4],[15,4],[17,4],[19,4],
      [9,5],[12,5],[14,5],[16,5],[18,5],[21,5],
      [8,8],[11,9],[13,8],[16,9],[20,8],[22,9],
      [4,9],[6,10],[11,12],[15,11],[19,12],[23,11],
      [12,14],[14,15],[17,14],[19,15],[26,14],[28,15],
      [10,18],[16,19],[22,18],[24,19],[27,18],[29,19],
      [11,22],[13,23],[15,24],[17,25],[19,26]
    ];
  }

  return (
    <svg className={className} viewBox="0 0 29 29" shapeRendering="crispEdges">
      <defs>
        <clipPath id="qrCircleView">
          <circle cx="14.5" cy="14.5" r="3" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="29" height="29" fill="white" />
      {corners}
      {pixels.map(([x, y], idx) => (
        <rect key={idx} x={x} y={y} width="1.1" height="1.1" fill="black" />
      ))}
      {/* Circle mask to clear center pixels */}
      <circle cx="14.5" cy="14.5" r="4.2" fill="white" />
      {/* Circular Logo overlay */}
      <image href="/origin.png" x="11.5" y="11.5" width="6" height="6" clipPath="url(#qrCircleView)" />
    </svg>
  );
}

// Reusable elegant QR card component rendering a smartphone mockup based on the new white screen design
function QRCard({ label = "Scan to Register" }: { code?: string; label?: string }) {
  return (
    <div className="relative w-[265px] aspect-[9/18.8] bg-[#08090a] rounded-[2.5rem] p-[9px] shadow-[0_30px_70px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.15),0_0_0_1px_rgba(255,255,255,0.05)] hover:scale-[1.03] transition-all duration-300 select-none group border border-zinc-800">
      
      {/* Physical Button Mockups */}
      {/* Volume Up */}
      <div className="absolute left-[-3px] top-24 w-[3px] h-8 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-l-md border-y border-l border-white/5" />
      {/* Volume Down */}
      <div className="absolute left-[-3px] top-36 w-[3px] h-8 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-l-md border-y border-l border-white/5" />
      {/* Power Button */}
      <div className="absolute right-[-3px] top-28 w-[3px] h-12 bg-gradient-to-l from-zinc-700 to-zinc-800 rounded-r-md border-y border-r border-white/5" />

      {/* Dynamic Island */}
      <div className="absolute top-4.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full flex items-center justify-between px-3 z-50 shadow-inner border border-white/5">
        <div className="w-1.5 h-1.5 rounded-full bg-zinc-900/60" />
        <div className="w-2.5 h-1.5 rounded-full bg-zinc-900" />
      </div>

      {/* Screen Area */}
      <div className="flex-1 bg-gradient-to-b from-[#fafafd] to-[#f4f5f8] rounded-[2rem] flex flex-col justify-between p-4 relative overflow-hidden text-zinc-800 shadow-[inset_0_2px_8px_rgba(0,0,0,0.03)]">
        
        {/* Top Status Bar & Header */}
        <div className="space-y-1.5">
          {/* Signal & battery status */}
          <div className="flex justify-between items-center text-[9px] text-zinc-400 font-bold px-1.5 pt-3 select-none">
            <span>12:30</span>
            <div className="flex items-center gap-1.5">
              {/* Wifi Icon */}
              <svg className="w-3 h-3 text-zinc-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 21a2 2 0 1 1-2-2 2 2 0 0 1 2 2zm1-5.32a10.93 10.93 0 0 0-14 0l1.42 1.42a8.94 8.94 0 0 1 11.16 0zM12 2a19.92 19.92 0 0 0-20 0l1.42 1.42a17.92 17.92 0 0 1 37.16 0z" />
              </svg>
              {/* Battery Icon */}
              <div className="flex items-center border border-zinc-300 rounded-[3px] p-[1px] w-5 h-2.5">
                <div className="bg-zinc-600 h-full w-[80%] rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* Navigation Title Bar */}
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-2.5">
            {/* Cyan Chevron Left */}
            <svg className="w-3.5 h-3.5 text-cyan-500 shrink-0 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[10px] font-extrabold text-zinc-800 tracking-tight truncate w-full">
              {label}
            </span>
          </div>

          {/* Green Status Banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 px-3.5 rounded-2xl flex items-center justify-center gap-2 text-[9px] font-black tracking-wider uppercase shadow-md shadow-emerald-500/10">
            {/* White Check Circle */}
            <svg className="w-3.5 h-3.5 bg-white text-emerald-500 rounded-full p-0.5 fill-current shrink-0 shadow-sm" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]">Successfully Checked!</span>
          </div>
        </div>

        {/* Middle QR Code inside Cyan Corner Brackets */}
        <div className="flex-1 flex items-center justify-center my-3">
          <div className="relative p-4.5 bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-zinc-100/80">
            
            {/* Viewfinder corners with pulsing glow */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-[3px] border-l-[3px] border-cyan-400 rounded-tl-lg animate-pulse" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-[3px] border-r-[3px] border-cyan-400 rounded-tr-lg animate-pulse" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-[3px] border-l-[3px] border-cyan-400 rounded-bl-lg animate-pulse" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-[3px] border-r-[3px] border-cyan-400 rounded-br-lg animate-pulse" />

            {/* REAL Scannable QR Code encoding https://sof-beta.vercel.app/ */}
            <div className="relative w-28 h-28 bg-white flex items-center justify-center p-1.5 rounded-lg shadow-sm">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=H&data=https://sof-beta.vercel.app/"
                alt="Scannable Vercel Link QR"
                className="w-full h-full object-contain"
              />
              
              {/* Circular Logo overlay in the center */}
              <div className="absolute w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md p-0.5 border border-zinc-200/50">
                <img
                  src="/origin.png"
                  className="rounded-full w-full h-full object-cover"
                  alt="Origin"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Stats Card Container */}
        <div className="bg-zinc-50 border border-zinc-100/80 rounded-2xl p-2.5 grid grid-cols-2 gap-2 text-center shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <div className="border-r border-zinc-200/60">
            <span className="text-[7px] text-zinc-400 font-black uppercase tracking-widest block mb-0.5">
              Enrolled
            </span>
            <span className="text-[10px] font-black text-zinc-800">
              2.5K+ Members
            </span>
          </div>
          <div>
            <span className="text-[7px] text-zinc-400 font-extrabold uppercase tracking-widest block mb-0.5">
              Total Access
            </span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider flex items-center justify-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              Active
            </span>
          </div>
        </div>

        {/* Bottom Tab Bar */}
        <div className="flex justify-between items-center border-t border-zinc-100 pt-3.5 px-2 text-[8px] font-bold text-zinc-400">
          {/* Lists Tab */}
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-zinc-700 transition-colors">
            <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span>Lists</span>
          </div>

          {/* Active Scan Tab with Cyan Circle background */}
          <div className="flex flex-col items-center gap-1 cursor-pointer -translate-y-2.5 relative z-20">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-white flex items-center justify-center shadow-[0_4px_14px_rgba(6,182,212,0.45)] hover:scale-105 active:scale-95 duration-200 transition-all border border-cyan-300/20">
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-cyan-500 font-extrabold">Scan</span>
          </div>

          {/* Settings Tab */}
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-zinc-700 transition-colors">
            <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Settings</span>
          </div>
        </div>

      </div>

      {/* Floating scanner visual overlay in mockup border */}
      <div className="absolute inset-x-8 top-[36%] bottom-[42%] border border-cyan-500/20 pointer-events-none rounded-lg" />
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMockCode, setSelectedMockCode] = useState("ORIGIN-STORE-7");
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const getMockCodeUrl = (code: string) => {
    if (code === "ORIGIN-STORE-7") return "/store/7";
    if (code === "ORIGIN-STORE-8") return "/store/8";
    return "/courses/problem-solving";
  };

  const iconMap: Record<string, React.ElementType> = {
    "problem-solving": Zap,
    "decision-making": Target,
    "team-person": Users,
    "personal-adaptability": TrendingUp,
    "self-image": Heart,
    "communication": MessageSquare,
  };

  return (
    <div className="min-h-screen bg-[#0f1724]">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#60a5fa]/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#60a5fa]/10 border border-[#60a5fa]/20 text-[#60a5fa] text-xs font-bold uppercase rounded-full tracking-wider">
                <QrCode size={12} className="text-[#60a5fa]" /> Barcode Scanner Integrated
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1]">
                Master Life's<br />
                <span className="text-[#60a5fa]">Essential Skills</span>
              </h1>
              <p className="text-lg md:text-xl text-[#9aa4b2] leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
                Six universal courses designed to transform how you think, decide, communicate, and succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/courses" className="bg-[#60a5fa] text-black px-8 py-4 rounded-full font-semibold text-base hover:bg-[#3b82f6] transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-[#60a5fa]/15">
                  <Play className="w-5 h-5" />
                  Start Learning
                </Link>
                <Link href="/flyer" className="border border-white/20 text-[#9aa4b2] hover:text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                  <QrCode className="w-5 h-5 text-[#60a5fa]" />
                  Print QR Flyer
                </Link>
              </div>
            </div>

            {/* Hero Right Column: Cartoon-Styled Flyer Poster Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <Link
                href="/courses/problem-solving"
                className="block"
              >
                <QRCard label="Origin Page" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 border-y border-white/5">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
            <div className="text-5xl font-bold text-white mb-2 tracking-tight">6</div>
            <div className="text-sm text-[#9aa4b2] font-medium uppercase tracking-wider">Core Courses</div>
          </div>
            <div>
            <div className="text-5xl font-bold text-white mb-2 tracking-tight">25K+</div>
            <div className="text-sm text-[#9aa4b2] font-medium uppercase tracking-wider">Students</div>
          </div>
            <div>
            <div className="text-5xl font-bold text-white mb-2 tracking-tight">4.7</div>
            <div className="text-sm text-[#9aa4b2] font-medium uppercase tracking-wider">Rating</div>
          </div>
            <div>
            <div className="text-5xl font-bold text-white mb-2 tracking-tight">100%</div>
            <div className="text-sm text-[#9aa4b2] font-medium uppercase tracking-wider">Online</div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Our Six Universal Courses</h2>
            <p className="text-[#9aa4b2] text-lg max-w-2xl mx-auto font-light">
              Each course is designed to build essential life skills that apply across all ages and situations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simplifiedCourses.map((course) => {
              const Icon = iconMap[course.id];
              const ebook = getCompanionProductForCourse(course.id);
              return (
                <div
                  key={course.id}
                  className="group bg-[#0b1220] rounded-2xl overflow-hidden hover:bg-[#0e1624] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/30 border border-white/5 hover:border-[#60a5fa]/20 flex flex-col justify-between"
                >
                  <Link href={`/courses/${course.id}`} className="block">
                    <div className="relative h-52 overflow-hidden">
                      {course.imageUrl ? (
                        <Image
                          src={course.imageUrl}
                          alt={course.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-[#1a1a1a] to-[#0a0a0a]">
                          <div className={`absolute inset-0 bg-linear-to-br ${course.bgGradient} opacity-20`} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon className="text-[#60a5fa] w-20 h-20 opacity-80" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-sm font-semibold">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 pb-0">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#60a5fa] transition-colors leading-tight">
                        {course.title}
                      </h3>
                      <p className="text-[#9aa4b2] text-sm mb-4 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-[#b3b3b3] mb-6">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#60a5fa]" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#60a5fa]" />
                          <span>{course.studentCount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="p-6 pt-0 mt-auto">
                    <Link href={`/courses/${course.id}`} className="block">
                      <div className="flex items-center justify-between pt-4 border-t border-white/5 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#0e1624] rounded-full flex items-center justify-center border border-white/10">
                            <Award className="w-5 h-5 text-[#60a5fa]" />
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{course.instructor}</div>
                            <div className="text-[#6b7280] text-xs">{course.instructorTitle}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[#60a5fa] font-bold text-lg group-hover:gap-3 transition-all">
                          <span>${course.priceUSD}</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </Link>

                    {/* Store eBook companion cross-sell */}
                    {ebook && (
                      <div className="bg-[#f9f9f9] text-zinc-950 p-3 rounded-xl border border-zinc-200 mt-2 flex items-center gap-3 relative shadow-md">
                        <Link href={`/store/${ebook.id}`} className="block relative w-10 h-14 bg-white border border-zinc-200 rounded shadow-sm overflow-hidden flex-shrink-0">
                          {ebook.imageUrl ? (
                            <Image
                              src={ebook.imageUrl}
                              alt={ebook.name}
                              fill
                              className="object-cover p-0.5"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                              <BookOpen className="w-5 h-5 text-zinc-400" />
                            </div>
                          )}
                        </Link>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 h-14">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-[#1db954] uppercase tracking-wider">
                              {ebook.badgeText}
                            </span>
                            <div className="flex items-center gap-0.5 text-yellow-600 text-[10px] font-bold">
                              <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500 stroke-none" />
                              <span>{ebook.rating}</span>
                            </div>
                          </div>
                          <h4 className="text-xs font-extrabold text-zinc-900 truncate leading-none mt-0.5">
                            {ebook.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-black text-zinc-700">
                              {ebook.price > 0 ? `$${ebook.price}` : "FREE"}
                            </span>
                            <div className="flex items-center gap-2.5">
                              <Link
                                href={`/store/${ebook.id}`}
                                className="text-[10px] font-extrabold uppercase text-zinc-500 hover:text-zinc-900 transition-colors"
                              >
                                View
                              </Link>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  addToCart({
                                    id: `store-${ebook.id}`,
                                    title: ebook.name,
                                    description: ebook.description,
                                    fullDescription: ebook.description,
                                    priceUSD: ebook.price,
                                    imageUrl: ebook.imageUrl,
                                    bgGradient: ebook.gradient,
                                    icon: ebook.icon,
                                    iconColor: "text-[#60a5fa]",
                                    ageRange: "All Ages",
                                  });
                                  showToast(`${ebook.name} added to cart!`, "success");
                                }}
                                className="bg-zinc-950 hover:bg-zinc-800 text-white p-1 rounded-full transition-colors flex-shrink-0 flex items-center justify-center"
                                title="Add to Cart"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 px-4 bg-linear-to-b from-[#0b1220] to-[#0f1724] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Upcoming Events</h2>
              <p className="text-[#b3b3b3]">Join live sessions with our expert instructors</p>
            </div>
            <Link href="/events" className="flex items-center gap-2 text-[#60a5fa] hover:text-white transition-colors font-semibold">
              View All Events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0b1220] rounded-2xl overflow-hidden hover:bg-[#0e1624] transition-all group border border-white/5 hover:border-[#60a5fa]/20">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/jumpstart_cover.png"
                  alt="JUMPSTART Accelerator Program"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Accelerator
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-3">JUMPSTART Accelerator</h3>
                <div className="flex items-center gap-2 text-sm text-[#b3b3b3] mb-4">
                  <Calendar className="w-4 h-4 text-[#60a5fa]" />
                  <span>Rolling Enrollments</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold text-xl">$15.00</span>
                  <Link href="/store/17" className="bg-[#60a5fa] text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#3b82f6] transition-colors">
                    Enroll Now
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#0b1220] rounded-2xl overflow-hidden hover:bg-[#0e1624] transition-all group border border-white/5 hover:border-[#60a5fa]/20">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80"
                  alt="Communication Workshop"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#60a5fa] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Workshop
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-3">Communication Skills Workshop</h3>
                <div className="flex items-center gap-2 text-sm text-[#b3b3b3] mb-4">
                  <Calendar className="w-4 h-4 text-[#60a5fa]" />
                  <span>July 22, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold text-xl">$29.99</span>
                  <Link href="/events" className="bg-[#60a5fa] text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#3b82f6] transition-colors">
                    Register
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#0b1220] rounded-2xl overflow-hidden hover:bg-[#0e1624] transition-all group border border-white/5 hover:border-[#60a5fa]/20">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
                  alt="Decision Making Webinar"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#60a5fa] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Webinar
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-3">Decision Making Webinar</h3>
                <div className="flex items-center gap-2 text-sm text-[#b3b3b3] mb-4">
                  <Calendar className="w-4 h-4 text-[#60a5fa]" />
                  <span>July 29, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold text-xl">$19.99</span>
                  <Link href="/events" className="bg-[#60a5fa] text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#3b82f6] transition-colors">
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">The Becoming Store</h2>
              <p className="text-[#b3b3b3]">eBooks, hardcopy books, journals, and merchandise to support your journey of becoming</p>
            </div>
            <Link href="/store" className="flex items-center gap-2 text-[#60a5fa] hover:text-white transition-colors font-semibold">
              Visit Store
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-[#0b1220] rounded-2xl overflow-hidden hover:bg-[#0e1624] transition-all group border border-white/5 hover:border-[#60a5fa]/20">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
                  alt="Origin Journal"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold mb-3">Origin Journal</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold text-xl">$24.99</span>
                  <Link href="/store" className="bg-[#60a5fa] text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#3b82f6] transition-colors">
                    Add
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#0b1220] rounded-2xl overflow-hidden hover:bg-[#0e1624] transition-all group border border-white/5 hover:border-[#60a5fa]/20">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/poi1-2.png"
                  alt="MONEY FARMING eBook"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold mb-3">MONEY FARMING</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold text-xl">$4.06</span>
                  <Link href="/store" className="bg-[#60a5fa] text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#3b82f6] transition-colors">
                    Add
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#0b1220] rounded-2xl overflow-hidden hover:bg-[#0e1624] transition-all group border border-white/5 hover:border-[#60a5fa]/20">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="/origin_merch_collection.png"
                  alt="Origin Apparel & Gifts"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold mb-3">Origin Apparel & Gifts</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold text-xl">From $14.99</span>
                  <Link href="/store?category=merch" className="bg-[#60a5fa] text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#3b82f6] transition-colors">
                    Explore
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#0b1220] rounded-2xl overflow-hidden hover:bg-[#0e1624] transition-all group border border-white/5 hover:border-[#60a5fa]/20">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80"
                  alt="Life Design Planner"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold mb-3">Life Design Planner</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold text-xl">$29.99</span>
                  <Link href="/store" className="bg-[#60a5fa] text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#3b82f6] transition-colors">
                    Add
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* Scanner Demo Section */}
        <section className="py-24 px-4 border-t border-white/5 bg-[#0b1220]/40">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            {/* Left Column: Text description and buttons */}
            <div className="flex-1 space-y-6">
              <span className="px-3.5 py-1 bg-[#60a5fa]/10 border border-[#60a5fa]/20 text-[#60a5fa] text-xs font-bold uppercase rounded-full tracking-wider">
                Printable Material
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                Get the Origin QR Poster
              </h2>
              <p className="text-[#9aa4b2] text-lg font-light leading-relaxed">
                We've designed a printable cartoon-styled **Origin Community Flyer**! Anyone can point their smartphone camera at the poster's QR code to go directly to our store or enroll in courses instantly. Print and hang this flyer poster anywhere in your school, office, or hub to drive instant traffic.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/flyer"
                  className="bg-[#60a5fa] text-black px-8 py-4 rounded-full font-semibold text-base hover:bg-[#3b82f6] transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-[#60a5fa]/15"
                >
                  <QrCode size={18} />
                  Print / View Flyer Page
                </Link>
              </div>
            </div>

            {/* Right Column: Cartoon-Styled Flyer Poster Preview */}
            <div className="w-full lg:w-[420px] flex flex-col items-center">
              {/* Poster Container */}
              <Link
                href={getMockCodeUrl(selectedMockCode)}
                className="block"
              >
                <QRCard label="Origin Page" />
              </Link>

              {/* Toggle controls below the phone */}
              <div className="flex gap-2 mt-6 bg-zinc-950 p-1.5 rounded-full border border-white/5 shadow-lg">
                <button
                  onClick={() => setSelectedMockCode("ORIGIN-STORE-7")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedMockCode === "ORIGIN-STORE-7"
                      ? "bg-[#60a5fa] text-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  eBook #1
                </button>
                <button
                  onClick={() => setSelectedMockCode("ORIGIN-STORE-8")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedMockCode === "ORIGIN-STORE-8"
                      ? "bg-[#60a5fa] text-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  eBook #2
                </button>
                <button
                  onClick={() => setSelectedMockCode("ORIGIN-COURSE-problem-solving")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedMockCode === "ORIGIN-COURSE-problem-solving"
                      ? "bg-[#60a5fa] text-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Course
                </button>
              </div>

              {/* Flyer actions */}
              <div className="flex gap-3 mt-6">
                <Link
                  href={getMockCodeUrl(selectedMockCode)}
                  className="bg-[#60a5fa] hover:bg-[#3b82f6] text-black px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md shadow-[#60a5fa]/10 flex items-center gap-1.5"
                >
                  <ShoppingBag size={14} /> View Details
                </Link>
                <Link
                  href="/flyer"
                  className="border border-white/10 hover:bg-white/5 text-[#9aa4b2] hover:text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all"
                >
                  Print Poster / Flyer
                </Link>
              </div>
            </div>
          </div>
        </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-linear-to-b from-[#0b1220] to-[#0f1724] border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to Transform Your Skills?</h2>
          <p className="text-xl text-[#9aa4b2] mb-10 font-light">
            Join over 25,000 students who have already started their journey with Origin.
          </p>
          <Link href="/courses" className="bg-[#60a5fa] text-black px-12 py-4 rounded-full font-semibold text-lg hover:bg-[#3b82f6] transition-all hover:scale-105 shadow-lg shadow-[#60a5fa]/15">
            Start Your Journey Today
          </Link>
        </div>
      </section>
    </div>
  );
}
