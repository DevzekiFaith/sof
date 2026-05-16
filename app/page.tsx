"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Rocket, ChevronLeft, ChevronRight, Play, Search, Bell, Users, BookOpen, Zap, RotateCcw, Target } from "lucide-react";
import AnimatedSection from "./components/ui/AnimatedSection";
import CoursePreviewPanel from "./components/ui/CoursePreviewPanel";
import AuthModal from "./components/ui/AuthModal";
import { courses, Course } from "./data/courses";
import { useUser } from "./contexts/UserContext";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  
  const { currentUser } = useUser();

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAge = ageFilter === "all" || course.ageRange.includes(ageFilter);

    return matchesSearch && matchesAge;
  });

  const ageRanges = ["all", "10", "12", "14", "16", "18"];

  const baseGreeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const greeting = currentUser ? `${baseGreeting}, ${currentUser.name.split(" ")[0]}` : `${baseGreeting}, Future Leader`;

  return (
    <div className="min-h-screen bg-[#121212] font-sans text-white pb-24 relative overflow-x-hidden">
      {/* Top Gradient Background */}
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#1ed760]/15 to-[#121212] pointer-events-none z-0 transition-colors duration-1000"></div>

      {/* Main Content Area */}
      <div className="relative z-10 px-4 sm:px-8 pt-4">
        {/* Spotify Header */}
        <header className="flex justify-between items-center mb-8 sticky top-0 z-30 py-4 bg-[#121212]/70 backdrop-blur-md -mx-4 px-4 sm:-mx-8 sm:px-8 transition-colors">
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-gray-400 cursor-not-allowed">
              <ChevronLeft size={20} />
            </button>
            <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-gray-400 cursor-not-allowed">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/#pricing" className="hidden md:flex px-4 py-1.5 bg-white text-black text-sm font-bold rounded-full hover:scale-105 transition-transform">
              Explore Premium
            </Link>
            <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors relative group">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#1ed760] rounded-full"></span>
              <div className="absolute top-10 right-0 w-48 p-2 bg-[#282828] rounded-md shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-[10px] z-50">
                You have 2 new course recommendations!
              </div>
            </button>
            <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors relative group">
              <Users size={18} />
              <div className="absolute top-10 right-0 w-48 p-2 bg-[#282828] rounded-md shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-[10px] z-50">
                3 friends are currently learning!
              </div>
            </button>
            {currentUser ? (
              <Link href="/profile" className="w-8 h-8 rounded-full bg-[#282828] border-2 border-[#1ed760]/30 flex items-center justify-center hover:scale-105 transition-transform overflow-hidden">
                <User className="w-4 h-4 text-white" />
              </Link>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-1.5 bg-white text-black text-sm font-bold rounded-full hover:scale-105 transition-transform"
              >
                Log in
              </button>
            )}
          </div>
        </header>

        {/* Auth Modal Overlay */}
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
            <div className="relative z-10 w-full max-w-md">
               <AuthModal onClose={() => setShowAuthModal(false)} />
            </div>
          </div>
        )}

        <AnimatedSection>
          <h1 className="text-3xl font-bold mb-6 tracking-tight">{greeting}</h1>
          
          {/* Quick Access Grid (Spotify top section) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
            {courses.slice(0, 6).map((course, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedCourse(course)}
                className="flex items-center bg-white/5 hover:bg-white/15 transition-all duration-300 rounded-md overflow-hidden group text-left relative"
              >
                <div className={`w-20 h-20 flex-shrink-0 bg-gradient-to-br ${course.bgGradient} flex items-center justify-center shadow-lg relative overflow-hidden`}>
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <course.icon className="w-8 h-8 text-white relative z-10" />
                  )}
                </div>
                <div className="flex-1 flex items-center justify-between px-4 overflow-hidden">
                  <span className="font-bold text-sm truncate">{course.title}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 drop-shadow-2xl translate-y-2 group-hover:translate-y-0">
                    <div className="w-12 h-12 rounded-full bg-[#1ed760] flex items-center justify-center text-black shadow-2xl scale-0 group-hover:scale-100 transition-transform">
                      <Play size={24} fill="currentColor" className="ml-1" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Section Heading with "Show all" */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight hover:underline cursor-pointer">Jump back in</h2>
          <Link href="/#courses" className="text-sm font-bold text-[#b3b3b3] hover:underline">Show all</Link>
        </div>

        {/* Categories / Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
           {ageRanges.map((age) => (
             <button
               key={age}
               onClick={() => setAgeFilter(age)}
               className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                 ageFilter === age 
                   ? "bg-white text-black" 
                   : "bg-[#2a2a2a] text-white hover:bg-[#333]"
               }`}
             >
               {age === "all" ? "All Ages" : `${age}+`}
             </button>
           ))}
        </div>

        {/* Main Grid of Courses */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredCourses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="group flex flex-col items-start p-4 bg-[#181818] hover:bg-[#282828] transition-all duration-300 rounded-lg text-left relative shadow-lg"
            >
              <div className={`w-full aspect-square mb-4 rounded-md bg-gradient-to-br ${course.bgGradient} flex items-center justify-center shadow-2xl relative overflow-hidden`}>
                {course.imageUrl ? (
                  <img src={course.imageUrl} alt={course.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <course.icon className="text-white w-1/3 h-1/3 drop-shadow-2xl relative z-10" />
                )}
                
                {/* Spotify style floating play button */}
                <div className="absolute bottom-2 right-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-2xl">
                  <div className="w-12 h-12 rounded-full bg-[#1ed760] flex items-center justify-center text-black hover:scale-105 transition-transform shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
                    <Play size={24} fill="currentColor" className="ml-1" />
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-white mb-1 w-full truncate text-base tracking-tight">
                {course.title}
              </h3>
              <p className="text-sm text-[#b3b3b3] line-clamp-2 w-full leading-snug">
                {course.description}
              </p>
            </button>
          ))}
        </div>

        {/* Second Row Section */}
        <div className="mt-16 mb-6">
           <h2 className="text-2xl font-bold tracking-tight mb-2">How Magify Works</h2>
           <p className="text-sm text-[#b3b3b3] mb-8">Our structured formation method designed for deep growth.</p>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Learn", icon: <BookOpen className="w-6 h-6 text-[#1ed760]" />, desc: "Core content & notes", bg: "bg-[#1ed760]/10" },
                { label: "Practice", icon: <Zap className="w-6 h-6 text-[#1ed760]" />, desc: "Active exercises", bg: "bg-[#1ed760]/10" },
                { label: "Reflect", icon: <RotateCcw className="w-6 h-6 text-[#1ed760]" />, desc: "Internalize lessons", bg: "bg-[#1ed760]/10" },
                { label: "Apply", icon: <Target className="w-6 h-6 text-[#1ed760]" />, desc: "Real-world growth", bg: "bg-[#1ed760]/10" },
              ].map((stage, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#181818] p-6 rounded-lg border border-transparent hover:bg-[#282828] transition-all group flex flex-col"
                >
                  <div className={`w-12 h-12 rounded-full ${stage.bg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    {stage.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{stage.label}</h3>
                  <p className="text-sm text-[#b3b3b3] leading-snug">{stage.desc}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Pricing Section (Spotify Style) */}
        <section id="pricing" className="mt-32">
          <div className="text-left mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Pick your Premium</h2>
            <p className="text-sm text-[#b3b3b3]">Unlimited learning on your phone, tablet, and computer.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                name: "Student", 
                price: 5.99, 
                features: ["All core courses", "Interactive exercises", "Progress tracking", "Cancel anytime"],
                plan: "student" 
              },
              { 
                name: "Individual", 
                price: 11.99, 
                features: ["Everything in Student", "Exclusive Masterclasses", "Personalized XP rewards", "Priority support", "Cancel anytime"],
                featured: true, 
                plan: "individual" 
              },
              { 
                name: "Family", 
                price: 19.99, 
                features: ["Everything in Individual", "Family study groups", "Shared achievements", "Exclusive Events", "Quarterly Masterclasses", "Cancel anytime"],
                plan: "family" 
              }
            ].map((plan) => (
              <div key={plan.name} className={`p-6 sm:p-8 rounded-lg flex flex-col ${plan.featured ? "bg-[#282828] ring-1 ring-[#1ed760]/30 shadow-2xl" : "bg-[#181818] hover:bg-[#282828]"} transition-colors`}>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <div className="text-right">
                    <span className="text-xl font-black text-white">${plan.price}</span>
                    <p className="text-[10px] text-[#b3b3b3]">/ MONTH</p>
                  </div>
                </div>
                
                <hr className="border-[#282828] mb-8" />
                
                <ul className="text-sm text-white space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#1ed760] rounded-full mt-2 flex-shrink-0" />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`/checkout?plan=${plan.plan}`} className="mt-auto">
                  <button className={`w-full py-4 rounded-full font-bold text-sm transition-all hover:scale-105 ${plan.featured ? "bg-[#1ed760] text-black" : "bg-transparent border border-[#535353] text-white hover:border-white"}`}>
                    Get Premium {plan.name}
                  </button>
                </Link>
                
                <p className="text-[10px] text-[#b3b3b3] mt-4 text-center">
                  Terms apply. {plan.name === "Student" ? "Student plan requires verification." : "Cancel anytime."}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Waitlist / Newsletter (Footer Area Style) */}
        <div className="mt-32 mb-20 bg-gradient-to-r from-[#1ed760]/20 to-transparent p-12 rounded-lg border border-[#1ed760]/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           {isWaitlisted ? (
             <AnimatedSection className="w-full text-center py-4">
               <div className="flex flex-col items-center justify-center">
                 <div className="w-16 h-16 bg-[#1ed760] rounded-full flex items-center justify-center text-black mb-4 animate-bounce">
                    <Rocket size={32} />
                 </div>
                 <h2 className="text-3xl font-bold mb-2 text-white">You&apos;re on the list!</h2>
                 <p className="text-[#1ed760] font-bold mb-6">Check your inbox soon for exclusive early access.</p>
                 <button 
                   onClick={() => { setIsWaitlisted(false); setWaitlistEmail(""); }}
                   className="text-xs text-[#b3b3b3] hover:text-white underline transition-colors"
                 >
                   Join with another email
                 </button>
               </div>
             </AnimatedSection>
           ) : (
             <>
               <div className="max-w-xl">
                 <h2 className="text-3xl font-bold mb-2">Be the first to know</h2>
                 <p className="text-[#b3b3b3]">We&apos;re launching new masterclasses every month. Get notified and receive exclusive early access advantages.</p>
               </div>
               <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="px-6 py-3 bg-[#121212] border border-[#282828] rounded-full focus:outline-none focus:border-[#1ed760] min-w-[280px]"
                  />
                  <button 
                    onClick={() => waitlistEmail && setIsWaitlisted(true)}
                    className="px-8 py-3 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition-transform"
                  >
                    Join waitlist
                  </button>
               </div>
             </>
           )}
        </div>
      </div>

      {selectedCourse && (
        <CoursePreviewPanel
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
