"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Rocket, ChevronLeft, ChevronRight, Play, Search, Bell, Users, BookOpen, Zap, RotateCcw, Target } from "lucide-react";
import AnimatedSection from "./components/ui/AnimatedSection";
import CoursePreviewPanel from "./components/ui/CoursePreviewPanel";
import AuthModal from "./components/ui/AuthModal";
import XPBar from "./components/ui/XPBar";
import StreakDisplay from "./components/ui/StreakDisplay";
import AchievementBadges from "./components/ui/AchievementBadges";
import Leaderboard from "./components/ui/Leaderboard";
import WeeklyRecommendations from "./components/ui/WeeklyRecommendations";
import AnalyticsDashboard from "./components/ui/AnalyticsDashboard";
import OfflineManager from "./components/ui/OfflineManager";
import EduCastList from "./components/ui/EduCastList";
import EduCastPlayer from "./components/ui/EduCastPlayer";
import { courses, Course } from "./data/courses";
import { useUser } from "./contexts/UserContext";
import { useGamification } from "./contexts/GamificationContext";
import { useSocial } from "./contexts/SocialContext";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { currentUser } = useUser();
  const { updateStreak, addXP } = useGamification();
  const { pendingRequests } = useSocial();

  // Update streak when page loads
  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  // Load notifications and friend requests
  useEffect(() => {
    if (!currentUser) return;

    // Load initial notification count
    const loadNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setNotifications(data);
        const unreadCount = data.filter((n: any) => !n.is_read).length;
        setNotificationCount(unreadCount);
      }
    };

    loadNotifications();

    // Listen for new notifications
    const notificationsChannel = supabase
      .channel('home_notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload: any) => {
          console.log('New notification:', payload);
          setNotificationCount(prev => prev + 1);
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [currentUser]);

  useEffect(() => {
    setFriendRequestCount(pendingRequests.length);
  }, [pendingRequests]);

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

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
        <header className="flex justify-between items-center mb-6 sticky top-0 z-30 py-4 bg-[#121212]/70 backdrop-blur-md -mx-4 px-4 sm:-mx-8 sm:px-8 transition-colors">
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-gray-400 cursor-not-allowed">
              <ChevronLeft size={20} />
            </button>
            <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-gray-400 cursor-not-allowed">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <StreakDisplay />
            <Link href="/#pricing" className="hidden md:flex px-4 py-1.5 bg-white text-black text-sm font-bold rounded-full hover:scale-105 transition-transform">
              Explore Premium
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors relative group"
              >
                <Bell size={18} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1ed760] text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-12 right-0 w-80 bg-[#181818] border border-[#282828] rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-[#282828]">
                    <h3 className="text-sm font-bold text-white">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-[#b3b3b3] text-sm">
                      No notifications yet
                    </div>
                  ) : (
                    <div className="divide-y divide-[#282828]">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`p-4 hover:bg-[#282828] cursor-pointer transition-colors ${
                            !notification.is_read ? 'bg-[#282828]/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 mt-2 rounded-full bg-[#1ed760] flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white mb-1">{notification.title}</p>
                              <p className="text-xs text-[#b3b3b3] leading-relaxed">{notification.message}</p>
                              {notification.link && (
                                <Link
                                  href={notification.link}
                                  className="text-xs text-[#1ed760] hover:underline mt-1 inline-block"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View →
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors relative group">
              <Users size={18} />
              {friendRequestCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1ed760] text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {friendRequestCount}
                </span>
              )}
              <div className="absolute top-10 right-0 w-48 p-2 bg-[#282828] rounded-md shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity text-[10px] z-50">
                {friendRequestCount > 0 ? `${friendRequestCount} friend request(s)` : 'No friend requests'}
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

        {/* Welcome Message */}
        <AnimatedSection>
          {currentUser ? (
            <div className="mb-6">
              <h1 className="text-5xl font-black mb-2 tracking-tight text-white">
                Welcome back, <span className="text-[#1ed760]">{currentUser.name}</span>
              </h1>
              <p className="text-lg text-[#b3b3b3]">Continue your learning journey</p>
            </div>
          ) : (
            <h1 className="text-3xl font-bold mb-6 tracking-tight">{greeting}</h1>
          )}
        </AnimatedSection>

        {/* Weekly Recommendations */}
        <AnimatedSection>
          <WeeklyRecommendations onCourseSelect={setSelectedCourse} />
        </AnimatedSection>

        {/* Gamification Dashboard */}
        <AnimatedSection>
          <XPBar />
        </AnimatedSection>

        <AnimatedSection>
          <AchievementBadges />
        </AnimatedSection>

        {/* Analytics Dashboard */}
        <AnimatedSection>
          <AnalyticsDashboard />
        </AnimatedSection>

        {/* Offline Manager */}
        <AnimatedSection>
          <OfflineManager />
        </AnimatedSection>

        {/* EduCasts */}
        <AnimatedSection>
          <EduCastList />
        </AnimatedSection>

        {/* Leaderboard Section */}
        <div className="mt-12 mb-8">
          <Leaderboard />
        </div>

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
                  {course.isFree && (
                    <div className="absolute top-1 left-1 bg-[#1ed760] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                      Free
                    </div>
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
                
                {/* Free/Premium Badge */}
                {course.isFree && (
                  <div className="absolute top-2 left-2 bg-[#1ed760] text-black text-xs font-bold px-2 py-1 rounded-full z-10">
                    Free
                  </div>
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
            <h2 className="text-2xl font-bold tracking-tight mb-2">Choose Your Plan</h2>
            <p className="text-sm text-[#b3b3b3]">Start free, upgrade when you're ready. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl">
            {[
              {
                name: "Free",
                price: 0,
                period: "forever",
                features: ["Access to 2 basic courses", "Basic progress tracking", "Daily streak tracking", "View leaderboards"],
                plan: "free",
                description: "Perfect for getting started"
              },
              {
                name: "Monthly",
                price: 9.99,
                period: "month",
                features: ["All courses access", "Full gamification (XP, achievements)", "Full social features (friends, challenges)", "Offline downloads", "Priority support"],
                plan: "monthly",
                description: "Flexibility for casual learners"
              },
              {
                name: "Annual",
                price: 79.99,
                period: "year",
                savings: "Save 33%",
                features: ["Everything in Monthly", "Exclusive masterclasses", "1-on-1 coaching session (quarterly)", "Certificate of completion", "Priority feature requests"],
                plan: "annual",
                featured: true,
                description: "Best value for committed learners"
              },
              {
                name: "Lifetime",
                price: 149,
                period: "once",
                features: ["Everything forever", "All future courses", "Priority feature requests", "VIP support", "Exclusive community access"],
                plan: "lifetime",
                description: "One-time payment, forever access"
              }
            ].map((plan) => (
              <div key={plan.name} className={`p-6 rounded-lg flex flex-col ${plan.featured ? "bg-[#282828] ring-2 ring-[#1ed760] shadow-2xl scale-105" : "bg-[#181818] hover:bg-[#282828]"} transition-colors relative`}>
                {plan.savings && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1ed760] text-black text-xs font-bold px-3 py-1 rounded-full">
                    {plan.savings}
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-[#b3b3b3]">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-2xl font-black text-white">{plan.price === 0 ? 'Free' : `$${plan.price}`}</span>
                  {plan.price > 0 && (
                    <p className="text-[10px] text-[#b3b3b3]">/ {plan.period}</p>
                  )}
                </div>

                <hr className="border-[#282828] mb-6" />

                <ul className="text-xs text-white space-y-3 mb-6 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#1ed760] rounded-full mt-1 flex-shrink-0" />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`/checkout?plan=${plan.plan}`} className="mt-auto">
                  <button className={`w-full py-3 rounded-full font-bold text-sm transition-all hover:scale-105 ${plan.featured ? "bg-[#1ed760] text-black" : plan.price === 0 ? "bg-white/10 text-white hover:bg-white/20" : "bg-transparent border border-[#535353] text-white hover:border-white"}`}>
                    {plan.price === 0 ? 'Get Started' : plan.featured ? 'Best Value' : 'Choose Plan'}
                  </button>
                </Link>
              </div>
            ))}
          </div>

          {/* Engagement Bonuses */}
          <div className="mt-12 p-6 bg-[#181818] rounded-xl border border-[#282828]">
            <h3 className="text-lg font-bold text-white mb-4">Earn Free Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1ed760]/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-[#1ed760]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">7-Day Streak</p>
                  <p className="text-xs text-[#b3b3b3]">Earn 1 free week of premium</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1ed760]/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[#1ed760]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Refer 3 Friends</p>
                  <p className="text-xs text-[#b3b3b3]">Get 1 free month of premium</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1ed760]/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-[#1ed760]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Complete 5 Courses</p>
                  <p className="text-xs text-[#b3b3b3]">Unlock lifetime achievement badge</p>
                </div>
              </div>
            </div>
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
      
      <EduCastPlayer />
    </div>
  );
}
