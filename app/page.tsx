"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Target, Users, TrendingUp, Heart, MessageSquare, Play, ArrowRight, BookOpen, Award, Clock, Star, Calendar, ShoppingBag, QrCode, Camera, Smartphone } from "lucide-react";
import { simplifiedCourses } from "./data/simplified-courses";

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
      <rect x="0" y="0" width="29" height="29" fill="white" />
      {corners}
      {pixels.map(([x, y], idx) => (
        <rect key={idx} x={x} y={y} width="1.1" height="1.1" fill="black" />
      ))}
    </svg>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMockCode, setSelectedMockCode] = useState("ORIGIN-STORE-7");

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
                className="relative w-[280px] aspect-[3/4] bg-[#007eff] rounded-[2rem] border-8 border-black overflow-hidden flex flex-col justify-between shadow-2xl hover:scale-[1.02] transition-transform duration-300 block"
              >
                {/* Header cartoon details */}
                <div className="pt-6 px-4 flex flex-col items-center text-center relative z-20">
                  {/* Yellow Sparks */}
                  <div className="absolute top-4 left-6 flex gap-0.5 -rotate-12">
                    <div className="w-1.5 h-4 bg-yellow-300 rounded-full transform rotate-12" />
                    <div className="w-1.5 h-4 bg-yellow-300 rounded-full transform -rotate-12 translate-y-1.5" />
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-yellow-300 font-black tracking-widest text-[10px] uppercase block drop-shadow-[0_1px_0_rgba(0,0,0,1)]">
                      ORIGIN
                    </span>
                    <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
                      COMMUNITY
                    </h3>
                  </div>

                  {/* Speech bubble */}
                  <div className="absolute right-4 top-4 bg-white text-black border-2 border-black font-extrabold px-2 py-0.5 rounded-full text-[8px] rotate-12 shadow-[1.5px_1.5px_0_rgba(0,0,0,1)]">
                    welcome
                  </div>
                </div>

                {/* Center White Card QR Code */}
                <div className="px-6 py-2 flex justify-center relative z-20">
                  {/* Asterisk decoration left */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-black -rotate-12 scale-75">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Yellow open arrow pointing to QR */}
                  <div className="absolute right-2 top-4 bg-yellow-400 text-black border-2 border-black font-black px-2.5 py-1 rounded-lg -rotate-12 flex items-center gap-0.5 shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    <span className="text-[8px] uppercase tracking-wider">OPEN</span>
                    <svg className="w-2.5 h-2.5 transform -rotate-90" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* QR Card */}
                  <div className="bg-white p-4 rounded-[1.5rem] border-[3px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] flex items-center justify-center w-40 h-40">
                    <QRCodeSVG code="ORIGIN-COURSE-problem-solving" className="w-full h-full" />
                  </div>

                  {/* Peeking Googly Eyes */}
                  <div className="absolute right-2 bottom-[-6px] flex scale-75 z-30">
                    <div className="w-10 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center -rotate-6">
                      <div className="w-3.5 h-4.5 bg-black rounded-full translate-x-0.5" />
                    </div>
                    <div className="w-10 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center rotate-6 -ml-2">
                      <div className="w-3.5 h-4.5 bg-black rounded-full -translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Bottom Banner Wave */}
                <div className="relative z-10 w-full leading-none">
                  <svg viewBox="0 0 1440 320" className="w-full h-16 fill-black translate-y-3">
                    <path d="M0,224 C288,288 576,160 864,224 C1152,288 1296,160 1440,224 L1440,320 L0,320 Z" />
                  </svg>
                  <div className="absolute bottom-2 inset-x-0 text-center z-20">
                    <span className="text-white font-extrabold text-[8px] uppercase tracking-[0.3em]">
                      origin
                    </span>
                  </div>
                </div>
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
              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group bg-[#0b1220] rounded-2xl overflow-hidden hover:bg-[#0e1624] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/30 border border-white/5 hover:border-[#60a5fa]/20"
                >
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
                  
                  <div className="p-6">
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

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
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
                  </div>
                </Link>
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
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
                  alt="Problem Solving Masterclass"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                  <div className="absolute top-4 left-4 bg-[#60a5fa] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Masterclass
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-3">Problem Solving Masterclass</h3>
                <div className="flex items-center gap-2 text-sm text-[#b3b3b3] mb-4">
                  <Calendar className="w-4 h-4 text-[#60a5fa]" />
                  <span>July 15, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold text-xl">$49.99</span>
                  <Link href="/events" className="bg-[#60a5fa] text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#3b82f6] transition-colors">
                    Register
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
                className="relative w-[280px] aspect-[3/4] bg-[#007eff] rounded-[2rem] border-8 border-black overflow-hidden flex flex-col justify-between shadow-2xl hover:scale-[1.02] transition-transform duration-300 block"
              >
                
                {/* Header cartoon details */}
                <div className="pt-6 px-4 flex flex-col items-center text-center relative z-20">
                  {/* Yellow Sparks */}
                  <div className="absolute top-4 left-6 flex gap-0.5 -rotate-12">
                    <div className="w-1.5 h-4 bg-yellow-300 rounded-full transform rotate-12" />
                    <div className="w-1.5 h-4 bg-yellow-300 rounded-full transform -rotate-12 translate-y-1.5" />
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-yellow-300 font-black tracking-widest text-[10px] uppercase block drop-shadow-[0_1px_0_rgba(0,0,0,1)]">
                      ORIGIN
                    </span>
                    <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
                      COMMUNITY
                    </h3>
                  </div>

                  {/* Speech bubble */}
                  <div className="absolute right-4 top-4 bg-white text-black border-2 border-black font-extrabold px-2 py-0.5 rounded-full text-[8px] rotate-12 shadow-[1.5px_1.5px_0_rgba(0,0,0,1)]">
                    welcome
                  </div>
                </div>

                {/* Center White Card QR Code */}
                <div className="px-6 py-2 flex justify-center relative z-20">
                  {/* Asterisk decoration left */}
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-black -rotate-12 scale-75">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Yellow open arrow pointing to QR */}
                  <div className="absolute right-2 top-4 bg-yellow-400 text-black border-2 border-black font-black px-2.5 py-1 rounded-lg -rotate-12 flex items-center gap-0.5 shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    <span className="text-[8px] uppercase tracking-wider">OPEN</span>
                    <svg className="w-2.5 h-2.5 transform -rotate-90" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* QR Card */}
                  <div className="bg-white p-4 rounded-[1.5rem] border-[3px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] flex items-center justify-center w-40 h-40">
                    <QRCodeSVG code={selectedMockCode} className="w-full h-full" />
                  </div>

                  {/* Peeking Googly Eyes */}
                  <div className="absolute right-2 bottom-[-6px] flex scale-75 z-30">
                    <div className="w-10 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center -rotate-6">
                      <div className="w-3.5 h-4.5 bg-black rounded-full translate-x-0.5" />
                    </div>
                    <div className="w-10 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center rotate-6 -ml-2">
                      <div className="w-3.5 h-4.5 bg-black rounded-full -translate-x-0.5" />
                    </div>
                  </div>
                </div>

                {/* Bottom Banner Wave */}
                <div className="relative z-10 w-full leading-none">
                  <svg viewBox="0 0 1440 320" className="w-full h-16 fill-black translate-y-3">
                    <path d="M0,224 C288,288 576,160 864,224 C1152,288 1296,160 1440,224 L1440,320 L0,320 Z" />
                  </svg>
                  <div className="absolute bottom-2 inset-x-0 text-center z-20">
                    <span className="text-white font-extrabold text-[8px] uppercase tracking-[0.3em]">
                      origin
                    </span>
                  </div>
                </div>
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
