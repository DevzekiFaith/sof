"use client";

import { useState, useEffect, Suspense, lazy, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User, Rocket, ChevronLeft, ChevronRight, Play, Bell, Users,
  BookOpen, Zap, Target, Shield, Trophy,
  GraduationCap, Brain, Flame, ArrowRight, CheckCircle, Crown,
  Sparkles, Globe, Music, FlaskConical, Dumbbell, Scroll,
  MessageSquare, Terminal, PenTool, Paintbrush, Leaf, Landmark, Presentation
} from "lucide-react";
import AnimatedSection from "./components/ui/AnimatedSection";
import AuthModal from "./components/ui/AuthModal";
import XPBar from "./components/ui/XPBar";
import StreakDisplay from "./components/ui/StreakDisplay";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { courses as coursesMinimal, Course } from "./data/courses";
import { learningTracks, sofClubs, stretchChallenges } from "./data/learningTracks";
import { useUser } from "./contexts/UserContext";
import { useGamification } from "./contexts/GamificationContext";
import { useSocial } from "./contexts/SocialContext";
import { useCart } from "./contexts/CartContext";
import { useToast } from "./contexts/ToastContext";
import { useNotifications } from "./hooks/useNotifications";
import { supabase } from "../lib/supabase";

// Lazy load heavy components
const CoursePreviewPanel = lazy(() => import("./components/ui/CoursePreviewPanel"));
const AchievementBadges = lazy(() => import("./components/ui/AchievementBadges"));
const Leaderboard = lazy(() => import("./components/ui/Leaderboard"));
const WeeklyRecommendations = lazy(() => import("./components/ui/WeeklyRecommendations"));
const AnalyticsDashboard = lazy(() => import("./components/ui/AnalyticsDashboard"));
const OfflineManager = lazy(() => import("./components/ui/OfflineManager"));
const EduCastList = lazy(() => import("./components/ui/EduCastList"));
const EduCastPlayer = lazy(() => import("./components/ui/EduCastPlayer"));

// ── Track icon map ────────────────────────────────────────────────────
const trackIconMap: Record<string, React.ElementType> = {
  "sciences-stem": FlaskConical,
  "arts-creativity": Music,
  "languages": Globe,
  "character-values": Shield,
  "sport-wellbeing": Dumbbell,
  "leadership": Crown,
  "classical-thinking": Scroll,
  "university-prep": GraduationCap,
};

const clubIconMap: Record<string, React.ElementType> = {
  "debate": MessageSquare,
  "coding": Terminal,
  "entrepreneur": Rocket,
  "philosophy": Brain,
  "writing": PenTool,
  "science": FlaskConical,
  "music": Music,
  "model-un": Globe,
  "art": Paintbrush,
  "environment": Leaf,
};

const challengeIconMap: Record<string, React.ElementType> = {
  "financial-literacy": Landmark,
  "public-speaking": Presentation,
  "leadership-pressure": Flame,
};

// ── Animated Counter ─────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            setCount(Math.floor(current));
            if (current >= target) clearInterval(timer);
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  useNotifications();
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
  const clubsRef = useRef<HTMLDivElement>(null);

  const { currentUser } = useUser();
  const { updateStreak, addXP } = useGamification();
  const { pendingRequests } = useSocial();

  useEffect(() => { updateStreak(); }, [updateStreak]);

  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const loadNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications').select('*').eq('user_id', currentUser.id)
        .order('created_at', { ascending: false }).limit(10);
      if (!error && data) {
        setNotifications(data);
        setNotificationCount(data.filter((n: any) => !n.is_read).length);
      }
    };
    loadNotifications();
    const channel = supabase.channel('home_notifications_changes').on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${currentUser.id}` },
      () => { setNotificationCount(p => p + 1); loadNotifications(); }
    ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [currentUser]);

  useEffect(() => { setFriendRequestCount(pendingRequests.length); }, [pendingRequests]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(p => p.map(n => n.id === id ? { ...n, is_read: true } : n));
    setNotificationCount(p => Math.max(0, p - 1));
  };

  const filteredCourses = coursesMinimal.filter((c: typeof coursesMinimal[0]) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAge = ageFilter === "all" || c.ageRange.includes(ageFilter);
    return matchesSearch && matchesAge;
  });

  const ageRanges = ["all", "5", "8", "10", "12", "14", "16", "18"];
  const baseGreeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#121212] font-sans text-white pb-24 relative overflow-x-hidden">

        {/* ── Hero Ambient Background ─────────────────────────────────── */}
        <div className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e]/80 to-[#121212]" />
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#1ed760]/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-56 h-56 bg-[#D4AF37]/5 rounded-full blur-3xl" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#1ed760]/30 to-transparent" />
        </div>

        <div className="relative z-10 px-4 sm:px-8 pt-4">

          {/* ── Header ──────────────────────────────────────────────── */}
          <header className="flex justify-between items-center mb-6 sticky top-0 z-30 py-4 bg-[#121212]/70 backdrop-blur-md -mx-4 px-4 sm:-mx-8 sm:px-8">
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
              <Link href="/courses" className="hidden md:flex px-4 py-1.5 bg-[#D4AF37] text-black text-sm font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                ✨ Browse Courses
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
                {showNotifications && (
                  <div className="absolute top-12 right-0 w-80 bg-[#181818] border border-[#282828] rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-[#282828]">
                      <h3 className="text-sm font-bold text-white">Notifications</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-[#b3b3b3] text-sm">No notifications yet</div>
                    ) : (
                      <div className="divide-y divide-[#282828]">
                        {notifications.map((n) => (
                          <div key={n.id} onClick={() => markAsRead(n.id)}
                            className={`p-4 hover:bg-[#282828] cursor-pointer transition-colors ${!n.is_read ? 'bg-[#282828]/50' : ''}`}>
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 mt-2 rounded-full bg-[#1ed760] flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white mb-1">{n.title}</p>
                                <p className="text-xs text-[#b3b3b3] leading-relaxed">{n.message}</p>
                                {n.link && (
                                  <Link href={n.link} className="text-xs text-[#1ed760] hover:underline mt-1 inline-block"
                                    onClick={(e) => e.stopPropagation()}>View →</Link>
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
                <button onClick={() => setShowAuthModal(true)}
                  className="px-6 py-1.5 bg-white text-black text-sm font-bold rounded-full hover:scale-105 transition-transform">
                  Log in
                </button>
              )}
            </div>
          </header>

          {/* ── HERO SECTION ─────────────────────────────────────────── */}
          <AnimatedSection>
            <section className="pt-8 pb-16 text-center relative" id="hero">
              {/* Crown badge */}
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold px-4 py-2 rounded-full mb-6 animate-fade-in">
                <Crown size={14} />
                <span>Eton & Harrow Standard · For Every Child</span>
                <Crown size={14} />
              </div>

              {currentUser ? (
                <div className="mb-4">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight">
                    Welcome back,{" "}
                    <span className="bg-gradient-to-r from-[#1ed760] to-[#17a549] bg-clip-text text-transparent">
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <span className="text-white">.</span>
                  </h1>
                  <p className="text-lg text-[#b3b3b3] max-w-xl mx-auto">
                    Your elite education journey continues. Pick up where you left off.
                  </p>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
                    <span className="text-white">World-Class Education.</span>
                    <br />
                    <span className="bg-gradient-to-r from-[#1ed760] via-[#1db954] to-[#17a549] bg-clip-text text-transparent">
                      For Every Child.
                    </span>
                  </h1>
                  <p className="text-base md:text-xl text-[#b3b3b3] max-w-2xl mx-auto mb-8 leading-relaxed">
                    The same curriculum that Eton College and Harrow School use to educate
                    prime ministers, royals, and future leaders — now available to every child,
                    at every income level, anywhere in the world.
                  </p>
                </>
              )}

              {/* Stat counters */}
              <div className="flex flex-wrap justify-center gap-8 mb-10">
                {[
                  { label: "Learning Tracks", value: 8 },
                  { label: "Subjects Covered", value: 28 },
                  { label: "Young Learners", value: 14200, suffix: "+" },
                  { label: "Courses", value: 32 },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl md:text-4xl font-black text-[#1ed760]">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs text-[#b3b3b3] mt-1 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/courses"
                  className="px-8 py-4 bg-[#1ed760] text-black font-black rounded-full text-base hover:scale-105 transition-all shadow-[0_0_30px_rgba(30,215,96,0.4)] hover:shadow-[0_0_50px_rgba(30,215,96,0.6)]"
                >
                  Browse Courses →
                </Link>
                <Link href="/#tracks"
                  className="px-8 py-4 border border-white/20 text-white font-bold rounded-full text-base hover:bg-white/10 transition-all">
                  View All 8 Tracks
                </Link>
              </div>

              {/* Floating subject pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-8 opacity-60">
                {["Mathematics", "Latin", "Philosophy", "Drama", "Mandarin", "Leadership", "Physics", "Music", "Ethics", "Debate"].map((s) => (
                  <span key={s} className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[#b3b3b3]">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          </AnimatedSection>

          {/* ── XP + Gamification ────────────────────────────────────── */}
          <AnimatedSection>
            <XPBar />
          </AnimatedSection>

          {/* ── Weekly Recommendations ───────────────────────────────── */}
          <AnimatedSection>
            <Suspense fallback={<div className="h-32 bg-[#181818] rounded-lg animate-pulse" />}>
              <WeeklyRecommendations onCourseSelect={setSelectedCourse} />
            </Suspense>
          </AnimatedSection>

          {/* ── LEARNING TRACKS GRID ─────────────────────────────────── */}
          <AnimatedSection>
            <section id="tracks" className="mt-16 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">8 Elite Learning Tracks</h2>
                  <p className="text-sm text-[#b3b3b3] mt-1">Mapped to Eton & Harrow's world-class curriculum</p>
                </div>
                <Link href="/courses" className="text-sm font-bold text-[#1ed760] hover:underline flex items-center gap-1">
                  All courses <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
                {learningTracks.map((track) => {
                  const TrackIcon = trackIconMap[track.id] || BookOpen;
                  return (
                    <Link
                      key={track.id}
                      href={`/tracks?track=${track.id}`}
                      className="group relative p-5 rounded-xl border border-[#282828] hover:border-[#1ed760]/30 transition-all duration-300 overflow-hidden cursor-pointer bg-[#181818]"
                    >
                      {/* Glow on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                        style={{ boxShadow: `inset 0 0 30px rgba(30,215,96,0.1)` }}
                      />
                      <div className="relative z-10">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 bg-[#282828]"
                        >
                          <TrackIcon size={24} className="text-[#1ed760]" />
                        </div>
                        <h3 className="font-bold text-white text-sm leading-tight mb-1">{track.title}</h3>
                        <p className="text-[10px] text-[#b3b3b3] mb-2 line-clamp-2 leading-snug">{track.tagline}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-[#282828] text-[#1ed760]">
                            {track.curriculum?.length || 0} modules
                          </span>
                          <span className="text-[9px] text-[#b3b3b3]">{track.ageRange}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          </AnimatedSection>

          {/* ── SOF CLUBS ────────────────────────────────────────────── */}
          <AnimatedSection>
            <section className="mt-16">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Origin Clubs</h2>
                  <p className="text-sm text-[#b3b3b3] mt-1">
                    Inspired by Eton's 80+ societies — explore beyond the classroom
                  </p>
                </div>
                <span className="text-xs text-[#b3b3b3] bg-[#282828] px-3 py-1 rounded-full">
                  {sofClubs.length} clubs
                </span>
              </div>

              {/* Horizontally scrollable club cards */}
              <div ref={clubsRef} className="flex gap-3 overflow-x-auto pb-3 no-scrollbar -mx-4 px-4">
                {sofClubs.map((club) => (
                  <Link
                    key={club.id}
                    href="/courses"
                    className="flex-shrink-0 group flex flex-col items-center justify-center text-center bg-[#181818] hover:bg-[#252525] border border-[#282828] hover:border-[#1ed760]/30 transition-all duration-300 rounded-xl p-4 w-36 cursor-pointer"
                  >
                    {(() => {
                      const ClubIcon = clubIconMap[club.id] || Users;
                      return (
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 text-white/80 group-hover:text-[#1ed760]">
                          <ClubIcon size={24} />
                        </div>
                      );
                    })()}
                    <p className="text-xs font-bold text-white leading-snug mb-1">{club.name}</p>
                    <p className="text-[9px] text-[#b3b3b3] line-clamp-2 mb-2">{club.description}</p>
                    <div className="flex items-center gap-1 text-[9px] text-[#1ed760] font-bold">
                      <Users size={9} />
                      <span>{club.members.toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </AnimatedSection>

          {/* ── JUMP BACK IN (quick access) ───────────────────────────── */}
          <AnimatedSection>
            <div className="mt-16">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Jump Back In</h2>
                <Link href="/courses" className="text-sm font-bold text-[#b3b3b3] hover:text-white hover:underline">Show all</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
                {coursesMinimal.slice(0, 6).map((course: Course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      if (course.isFree) {
                        setSelectedCourse(course);
                      } else {
                        router.push(`/checkout?course=${course.id}`);
                      }
                    }}
                    className="flex items-center bg-white/5 hover:bg-white/15 transition-all duration-300 rounded-md overflow-hidden group text-left relative"
                  >
                    <div className={`w-20 h-20 flex-shrink-0 bg-gradient-to-br ${course.bgGradient} flex items-center justify-center shadow-lg relative overflow-hidden`}>
                      {course.imageUrl ? (
                        <Image src={course.imageUrl} alt={course.title} fill className="object-cover" sizes="80px" />
                      ) : (
                        <course.icon className="w-8 h-8 text-white relative z-10" />
                      )}
                      <div className="absolute top-1 left-1 bg-[#D4AF37] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                        ${course.priceUSD}
                      </div>
                      <div className="absolute top-1 right-1 bg-[#282828] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">
                        ₦{(course.priceUSD || 0) * 1500}
                      </div>
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
            </div>
          </AnimatedSection>

          {/* ── COURSE BROWSE with age filter ─────────────────────────── */}
          <AnimatedSection>
            <div className="mt-8 mb-4">
              <h2 className="text-xl font-bold tracking-tight mb-3">Browse All Courses</h2>
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                {ageRanges.map((age) => (
                  <button
                    key={age}
                    onClick={() => setAgeFilter(age)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                      ageFilter === age ? "bg-white text-black" : "bg-[#2a2a2a] text-white hover:bg-[#333]"
                    }`}
                  >
                    {age === "all" ? "All Ages" : `${age}+`}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {filteredCourses.map((course: Course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      addToCart(course);
                      showToast("Added to cart!", "success");
                    }}
                    className="group flex flex-col items-start p-4 bg-[#181818] hover:bg-[#282828] transition-all duration-300 rounded-lg text-left relative shadow-lg"
                  >
                    <div className={`w-full aspect-square mb-4 rounded-md bg-gradient-to-br ${course.bgGradient} flex items-center justify-center shadow-2xl relative overflow-hidden`}>
                      {course.imageUrl ? (
                        <Image src={course.imageUrl} alt={course.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" />
                      ) : (
                        <course.icon className="text-white w-1/3 h-1/3 drop-shadow-2xl relative z-10" />
                      )}
                      <div className="absolute top-2 left-2 bg-[#D4AF37] text-black text-xs font-bold px-2 py-1 rounded-full z-10">
                        ${course.priceUSD}
                      </div>
                      <div className="absolute top-2 right-2 bg-[#282828] text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
                        ₦{(course.priceUSD || 0) * 1500}
                      </div>
                      <div className="absolute bottom-2 right-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 shadow-2xl">
                        <div className="w-12 h-12 rounded-full bg-[#1ed760] flex items-center justify-center text-black hover:scale-105 transition-transform shadow-[0_8px_16px_rgba(0,0,0,0.5)]">
                          <Play size={24} fill="currentColor" className="ml-1" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-white mb-1 w-full truncate text-base tracking-tight">{course.title}</h3>
                    <p className="text-sm text-[#b3b3b3] line-clamp-2 w-full leading-snug">{course.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* ── STRETCH & CHALLENGE ──────────────────────────────────── */}
          <AnimatedSection>
            <section className="mt-20">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={16} className="text-[#D4AF37]" />
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Inspired by Harrow's Electives Programme</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight">Stretch & Challenge</h2>
                <p className="text-sm text-[#b3b3b3] mt-1">
                  Go beyond the standard syllabus. University-level thinking, built for teens.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stretchChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="group relative p-6 bg-[#181818] border border-[#282828] hover:border-[#1ed760]/30 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'radial-gradient(circle at 50% 0%, rgba(30,215,96,0.06), transparent 70%)' }} />
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        {(() => {
                          const ChallengeIcon = challengeIconMap[challenge.id] || Zap;
                          return (
                            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
                              <ChallengeIcon size={20} />
                            </div>
                          );
                        })()}
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-full border"
                          style={{ color: challenge.levelColor, borderColor: `${challenge.levelColor}40`, background: `${challenge.levelColor}15` }}>
                          ● {challenge.level}
                        </span>
                      </div>
                      <h3 className="font-black text-white text-base mb-2 leading-snug">{challenge.title}</h3>
                      <p className="text-xs text-[#b3b3b3] leading-relaxed mb-4">{challenge.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[10px] text-[#b3b3b3]">
                          <span>⏱ {challenge.duration}</span>
                          <span>👤 {challenge.for}</span>
                        </div>
                        <button className="flex items-center gap-1 text-[#1ed760] text-xs font-bold group-hover:gap-2 transition-all">
                          Start <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </AnimatedSection>

          {/* ── PARENT DASHBOARD PREVIEW ─────────────────────────────── */}
          <AnimatedSection>
            <section className="mt-20 relative overflow-hidden rounded-2xl p-8 md:p-12"
              style={{ background: 'linear-gradient(135deg, #0d1f12 0%, #0a0f1e 50%, #121212 100%)' }}>
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#1ed760]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Crown size={16} className="text-[#D4AF37]" />
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">For Parents</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
                  Built for Parents Who Want the Best
                </h2>
                <p className="text-sm text-[#b3b3b3] max-w-xl mb-10 leading-relaxed">
                  Elite boarding schools offer the gold standard — but they charge £55,000 a year
                  and have waiting lists that start at birth. Origin gives your child the same
                  standard of learning from day one, at any age, for a fraction of the cost.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                  {[
                    {
                      icon: <Trophy className="w-5 h-5 text-[#D4AF37]" />,
                      bg: "bg-[#D4AF37]/10",
                      border: "border-[#D4AF37]/20",
                      title: "Eton & Harrow Standard",
                      desc: "Curriculum mapped directly to what the UK's top two elite schools teach their students."
                    },
                    {
                      icon: <Target className="w-5 h-5 text-[#1ed760]" />,
                      bg: "bg-[#1ed760]/10",
                      border: "border-[#1ed760]/20",
                      title: "Personalised to Your Child",
                      desc: "Age-specific tracks, tailored learning paths, and weekly progress recommendations."
                    },
                    {
                      icon: <Brain className="w-5 h-5 text-[#6366F1]" />,
                      bg: "bg-[#6366F1]/10",
                      border: "border-[#6366F1]/20",
                      title: "Academic + Character",
                      desc: "Not just grades — courage, honour, leadership, wellbeing, and creative arts. The whole child."
                    },
                  ].map((item, i) => (
                    <div key={i} className={`p-5 rounded-xl border ${item.border} ${item.bg} flex flex-col gap-3`}>
                      <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center`}>
                        {item.icon}
                      </div>
                      <h3 className="font-black text-white text-sm">{item.title}</h3>
                      <p className="text-xs text-[#b3b3b3] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setShowAuthModal(true)}
                    className="px-6 py-3 bg-[#1ed760] text-black font-black rounded-full text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(30,215,96,0.3)]">
                    Start Your Child's Journey →
                  </button>
                  <Link href="/#pricing"
                    className="px-6 py-3 border border-white/20 text-white font-bold rounded-full text-sm hover:bg-white/10 transition-all">
                    View Pricing
                  </Link>
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* ── HOW ORIGIN WORKS ─────────────────────────────────────── */}
          <AnimatedSection>
            <section className="mt-20">
              <div className="mb-8">
                <h2 className="text-2xl font-black tracking-tight mb-1">How Origin Works</h2>
                <p className="text-sm text-[#b3b3b3]">A structured path from exploration to mastery</p>
              </div>

              {/* How Origin Works — 4 stages */}
              <div className="mt-14">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Explore", icon: <Globe className="w-5 h-5 text-[#1ed760]" />, desc: "Browse 8 elite tracks & 32 courses", step: "01" },
                    { label: "Learn", icon: <BookOpen className="w-5 h-5 text-[#1ed760]" />, desc: "Core content, video & guided notes", step: "02" },
                    { label: "Practice", icon: <Zap className="w-5 h-5 text-[#1ed760]" />, desc: "Active exercises & challenges", step: "03" },
                    { label: "Grow", icon: <Flame className="w-5 h-5 text-[#1ed760]" />, desc: "Streaks, XP, badges & real-world application", step: "04" },
                  ].map((stage, idx) => (
                    <div key={idx}
                      className="bg-[#181818] p-5 rounded-xl border border-transparent hover:bg-[#252525] hover:border-[#1ed760]/20 transition-all group flex flex-col">
                      <div className="text-[10px] font-black text-[#b3b3b3] mb-3 tracking-widest">{stage.step}</div>
                      <div className="w-10 h-10 rounded-full bg-[#1ed760]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        {stage.icon}
                      </div>
                      <h3 className="text-base font-black text-white mb-1">{stage.label}</h3>
                      <p className="text-xs text-[#b3b3b3] leading-snug">{stage.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </AnimatedSection>

          {/* ── EDUCAST / PODCAST ────────────────────────────────────── */}
          <AnimatedSection>
            <Suspense fallback={<div className="h-32 bg-[#181818] rounded-lg animate-pulse" />}>
              <EduCastList />
            </Suspense>
          </AnimatedSection>

          {/* ── ACHIEVEMENT BADGES ───────────────────────────────────── */}
          <AnimatedSection>
            <Suspense fallback={<div className="h-32 bg-[#181818] rounded-lg animate-pulse" />}>
              <AchievementBadges />
            </Suspense>
          </AnimatedSection>

          {/* ── LEADERBOARD ──────────────────────────────────────────── */}
          <div className="mt-12 mb-8">
            <Suspense fallback={<div className="h-64 bg-[#181818] rounded-lg animate-pulse" />}>
              <Leaderboard />
            </Suspense>
          </div>

          {/* ── ANALYTICS DASHBOARD ──────────────────────────────────── */}
          <AnimatedSection>
            <Suspense fallback={<div className="h-32 bg-[#181818] rounded-lg animate-pulse" />}>
              <AnalyticsDashboard />
            </Suspense>
          </AnimatedSection>

          {/* ── OFFLINE MANAGER ──────────────────────────────────────── */}
          <AnimatedSection>
            <Suspense fallback={<div className="h-32 bg-[#181818] rounded-lg animate-pulse" />}>
              <OfflineManager />
            </Suspense>
          </AnimatedSection>

          {/* ── PRICING SECTION (enhanced) ───────────────────────────── */}
          <AnimatedSection>
            <section id="pricing" className="mt-24">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 text-xs text-[#D4AF37] font-bold mb-3">
                  <Crown size={12} />
                  <span>Elite education. 99.9% less than £55,000/yr.</span>
                  <Crown size={12} />
                </div>
                <h2 className="text-2xl font-black tracking-tight mb-2">Invest in Your Future</h2>
                <p className="text-sm text-[#b3b3b3]">Purchase courses individually. Own them forever.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-8">
                {coursesMinimal.slice(0, 3).map((course: Course) => (
                  <div key={course.id} className="bg-[#181818] hover:bg-[#1e1e1e] border border-[#282828] rounded-xl p-6 transition-all">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${course.bgGradient} flex items-center justify-center mb-4`}>
                      <course.icon className="text-white w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-black text-white mb-1">{course.title}</h3>
                    <p className="text-xs text-[#b3b3b3] mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 rounded-full">${course.priceUSD} / ₦{(course.priceUSD || 0) * 1500}</span>
                      <span className="text-[10px] text-[#b3b3b3]">{course.duration}</span>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(course);
                        showToast("Added to cart!", "success");
                      }}
                      className="w-full py-3 rounded-full font-black text-sm transition-all hover:scale-105 bg-[#1ed760] text-black"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-bold text-[#1ed760] hover:underline">
                  View All Courses <ArrowRight size={16} />
                </Link>
              </div>
            </section>
          </AnimatedSection>

          {/* ── WAITLIST / NEWSLETTER ────────────────────────────────── */}
          <AnimatedSection>
            <div className="mt-24 mb-20 bg-gradient-to-r from-[#1ed760]/15 via-[#0d1f12] to-transparent p-10 md:p-14 rounded-2xl border border-[#1ed760]/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#1ed760]/5 rounded-full blur-3xl pointer-events-none" />
              {isWaitlisted ? (
                <AnimatedSection className="w-full text-center py-4">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-[#1ed760] rounded-full flex items-center justify-center text-black mb-4 animate-bounce">
                      <Rocket size={32} />
                    </div>
                    <h2 className="text-3xl font-black mb-2 text-white">You&apos;re on the list!</h2>
                    <p className="text-[#1ed760] font-bold mb-6">Check your inbox soon for exclusive early access.</p>
                    <button onClick={() => { setIsWaitlisted(false); setWaitlistEmail(""); }}
                      className="text-xs text-[#b3b3b3] hover:text-white underline transition-colors">
                      Join with another email
                    </button>
                  </div>
                </AnimatedSection>
              ) : (
                <>
                  <div className="max-w-xl relative z-10">
                    <h2 className="text-3xl font-black mb-2">Be the first to know</h2>
                    <p className="text-[#b3b3b3] text-sm leading-relaxed">
                      New masterclasses and learning tracks launching every month.
                      Get notified and receive exclusive early access.
                    </p>
                  </div>
                  <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 relative z-10">
                    <input type="email" placeholder="Your email address" value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      className="px-6 py-3 bg-[#121212] border border-[#282828] rounded-full focus:outline-none focus:border-[#1ed760] min-w-[280px] text-sm" />
                    <button onClick={() => waitlistEmail && setIsWaitlisted(true)}
                      className="px-8 py-3 bg-[#1ed760] text-black font-black rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(30,215,96,0.3)] text-sm">
                      Join waitlist →
                    </button>
                  </div>
                </>
              )}
            </div>
          </AnimatedSection>
        </div>

        {/* ── Auth Modal ───────────────────────────────────────────── */}
        {showAuthModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
            <div className="relative z-10 w-full max-w-md">
              <AuthModal onClose={() => setShowAuthModal(false)} />
            </div>
          </div>
        )}

        {selectedCourse && (
          <Suspense fallback={null}>
            <CoursePreviewPanel course={selectedCourse} onClose={() => setSelectedCourse(null)} />
          </Suspense>
        )}

        <Suspense fallback={null}>
          <EduCastPlayer />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
