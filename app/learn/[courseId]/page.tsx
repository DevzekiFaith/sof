"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCourseById, Resource } from "../../data/courses";
import DownloadableResource from "../../components/ui/DownloadableResource";
import { useUser } from "../../contexts/UserContext";
import { supabase } from "../../../lib/supabase";
import Logo from "../../components/Logo";
import confetti from "canvas-confetti";
import {
  BookOpen,
  Zap,
  RotateCcw,
  MessageSquare,
  Target,
  Clock,
  Paperclip,
  GraduationCap,
  Flame,
  Check,
  Lock,
  Menu,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

type LessonStage = 'learn' | 'practice' | 'reflect' | 'apply';

const STAGES = [
  { key: "learn", label: "Learn", icon: ({ size }: { size?: number }) => <BookOpen size={size || 16} /> },
  { key: "practice", label: "Practice", icon: ({ size }: { size?: number }) => <Zap size={size || 16} /> },
  { key: "reflect", label: "Reflect", icon: ({ size }: { size?: number }) => <RotateCcw size={size || 16} /> },
  { key: "apply", label: "Apply", icon: ({ size }: { size?: number }) => <Target size={size || 16} /> },
] as const;

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  // All hooks must be called first, in the same order every render
  const [isLoading, setIsLoading] = useState(true);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeStage, setActiveStage] = useState<LessonStage>("learn");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [justCompleted, setJustCompleted] = useState(false);
  const [checkedActivities, setCheckedActivities] = useState<Record<number, boolean>>({});
  const [videoStarted, setVideoStarted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [exitTarget, setExitTarget] = useState<string | null>(null);
  const isCurrentStageCompleteRef = useRef(false);

  const {
    currentUser,
    hasCourseAccess,
    getCourseProgress,
    markStageComplete,
    isModuleUnlocked,
    isStageComplete,
  } = useUser();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Browser level protection (close tab/refresh)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isCurrentStageCompleteRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Redirect to home if course not found
  useEffect(() => {
    const course = getCourseById(courseId);
    if (!course) router.push("/");
  }, [courseId, router]);

  // Restore last position from progress
  useEffect(() => {
    const course = getCourseById(courseId);
    if (!course) return;
    const progress = getCourseProgress(courseId);
    if (progress) {
      const idx = Math.min(progress.currentModuleIndex, (course.modules?.length ?? 1) - 1);
      setActiveModuleIndex(idx);
    }
  }, [courseId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Non-hook calls after all hooks
  const course = getCourseById(courseId);

  const modules = course?.modules ?? [];
  const totalModules = modules.length;
  const detailedModules = course?.detailedModules ?? [];
  const currentModuleData = detailedModules[activeModuleIndex];
  const progress = getCourseProgress(courseId);
  const courseComplete = progress?.isComplete ?? false;

  // Compute completion % 
  const totalStages = totalModules * 4;
  const completedStages = modules.reduce((acc: number, _, mi: number) => {
    return acc + STAGES.filter((s) => isStageComplete(courseId, mi, s.key)).length;
  }, 0);
  const progressPct = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  const isCurrentStageComplete = isStageComplete(courseId, activeModuleIndex, activeStage);
  const currentModuleAllDone = STAGES.every((s) =>
    isStageComplete(courseId, activeModuleIndex, s.key)
  );

  // Update ref for browser protection
  isCurrentStageCompleteRef.current = isCurrentStageComplete;

  // Which stage tabs are unlocked within the current module
  const isStageUnlocked = (stageKey: LessonStage): boolean => {
    if (!isModuleUnlocked(courseId, activeModuleIndex)) return false;
    const idx = STAGES.findIndex((s) => s.key === stageKey);
    if (idx === 0) return true;
    const prevStage = STAGES[idx - 1];
    return isStageComplete(courseId, activeModuleIndex, prevStage.key);
  };

  const handleMarkComplete = () => {
    markStageComplete(courseId, activeModuleIndex, activeStage, totalModules);
    setJustCompleted(true);

    // Fire confetti for stage completion
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#1ed760', '#1db954', '#1fdf64']
    });

    setTimeout(() => setJustCompleted(false), 1800);
    // Auto-advance to next stage
    const stageIdx = STAGES.findIndex((s) => s.key === activeStage);
    if (stageIdx < STAGES.length - 1) {
      setActiveStage(STAGES[stageIdx + 1].key);
    } else {
      // Module Complete Confetti
      setTimeout(() => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      }, 500);
    }
  };

  const handleNextModule = () => {
    const next = activeModuleIndex + 1;
    if (next < totalModules && isModuleUnlocked(courseId, next)) {
      setActiveModuleIndex(next);
      setActiveStage("learn");
      setDrawerOpen(false);
    }
  };

  const handlePrevModule = () => {
    if (activeModuleIndex > 0) {
      setActiveModuleIndex(activeModuleIndex - 1);
      setActiveStage("learn");
      setDrawerOpen(false);
      setCheckedActivities({}); // reset gamification
      setVideoStarted(false);
    }
  };

  const handleExitAttempt = (e: React.MouseEvent, target: string) => {
    if (!isCurrentStageComplete) {
      e.preventDefault();
      setExitTarget(target);
      setShowExitConfirm(true);
    }
  };

  const confirmExit = async () => {
    // Create abandonment reminder notification if progress is incomplete
    if (currentUser && progressPct > 0 && progressPct < 100) {
      await supabase
        .from('notifications')
        .insert({
          user_id: currentUser.id,
          type: 'course_complete',
          title: 'Continue Your Learning',
          message: `You're ${progressPct}% through "${course?.title || 'this course'}". Come back to finish what you started!`,
          link: `/learn/${courseId}`
        });
    }

    if (exitTarget) router.push(exitTarget);
    setShowExitConfirm(false);
  };

  const getModuleStatus = (mi: number) => {
    if (!isModuleUnlocked(courseId, mi)) return "locked";
    const allDone = STAGES.every((s) => isStageComplete(courseId, mi, s.key));
    if (allDone) return "complete";
    const anyStarted = STAGES.some((s) => isStageComplete(courseId, mi, s.key));
    return anyStarted ? "in-progress" : "unlocked";
  };

  // ─── Render stage content ─────────────────────────────────────────────────

  const renderStageContent = () => {
    if (!currentModuleData) {
      return (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl font-semibold">Content coming soon for this module.</p>
        </div>
      );
    }

    if (activeStage === "learn") {
      // Safely extract YouTube video ID if present
      let videoId = "";
      if (course?.youtubeVideoUrl) {
        try {
          const urlObj = new URL(course.youtubeVideoUrl);
          videoId = urlObj.searchParams.get("v") || "";
          if (!videoId && urlObj.hostname === "youtu.be") {
            videoId = urlObj.pathname.slice(1);
          }
        } catch (e: unknown) {
          // ignore
        }
      }

      return (
        <div className="prose prose-lg max-w-none animate-fade-in text-[#b3b3b3]">
          {videoId ? (
            <div className="mb-8 rounded-xl overflow-hidden shadow-2xl relative bg-black aspect-video group">
              {!videoStarted ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#181818] to-black z-10">
                  <button
                    onClick={() => setVideoStarted(true)}
                    className="w-20 h-20 bg-[#1ed760] rounded-full flex items-center justify-center text-black pl-2 hover:scale-110 transition-all shadow-[0_0_40px_rgba(30,215,96,0.4)] animate-pulse-slow"
                  >
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4l12 6-12 6z" />
                    </svg>
                  </button>
                  <p className="absolute bottom-6 font-bold text-white/80 tracking-widest uppercase text-sm">Tap to Watch</p>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title="Course Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          ) : null}

          {currentModuleData.topics && currentModuleData.topics.length > 0 && (
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentModuleData.topics.map((topic: string, i: number) => (
                <div key={i} className="flex items-center gap-4 bg-[#181818] p-4 rounded-xl border border-[#282828] hover:bg-[#282828] transition-all group">
                  <div className="w-10 h-10 rounded-full bg-[#1ed760]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Check size={18} className="text-[#1ed760]" />
                  </div>
                  <span className="text-sm font-bold text-white leading-tight">{topic}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-[#b3b3b3] text-lg leading-relaxed mb-6">
            {currentModuleData.description}
          </p>

          {currentModuleData.objectives?.length > 0 && (
            <div className="bg-[#181818] border border-[#282828] rounded-xl p-6 mb-6">
              <p className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Learning Objectives
              </p>
              <ul className="space-y-2">
                {currentModuleData.objectives.map((obj: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-[#b3b3b3]">
                    <span className="text-[#1ed760] mt-0.5">→</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="whitespace-pre-wrap text-[#b3b3b3] leading-relaxed text-base">
            {currentModuleData.content}
          </div>

          {currentModuleData.estimatedTime && (
            <p className="mt-6 text-sm text-[#a7a7a7] font-medium flex items-center gap-1.5">
              <Clock size={14} className="text-[#1ed760]" />
              Estimated time: {currentModuleData.estimatedTime}
            </p>
          )}
        </div>
      );
    }

    if (activeStage === "practice") {
      const toggleActivity = (index: number) => {
        setCheckedActivities(prev => ({ ...prev, [index]: !prev[index] }));
      };

      return (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#181818] border border-[#282828] rounded-xl p-6">
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-2">Active Practice</p>
            <p className="text-[#b3b3b3]">Work through each activity before marking this stage complete.</p>
          </div>

          {currentModuleData.activities?.length > 0 ? (
            <div className="space-y-4">
              {currentModuleData.activities.map((activity: string, i: number) => {
                const isChecked = !!checkedActivities[i];
                return (
                  <div
                    key={i}
                    onClick={() => toggleActivity(i)}
                    className={`flex items-start gap-4 p-5 rounded-xl border transition-all cursor-pointer select-none ${isChecked
                      ? 'bg-[#1ed760]/10 border-[#1ed760]'
                      : 'bg-[#181818] border-[#282828] hover:bg-[#282828]'
                      }`}
                  >
                    <div className={`w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-[#1ed760] border-[#1ed760] text-black' : 'border-[#b3b3b3]'
                      }`}>
                      {isChecked && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <p className={`text-white leading-relaxed transition-all ${isChecked ? 'text-[#a7a7a7] line-through' : ''}`}>
                      {activity}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-[#a7a7a7]">Practice activities are being prepared.</p>
          )}

          {currentModuleData.resources?.length > 0 && (
            <div className="bg-[#181818] rounded-xl p-5 border border-[#282828]">
              <p className="text-sm font-bold text-white uppercase tracking-wider mb-4">Downloadable Resources</p>
              <div className="space-y-3">
                {currentModuleData.resources.map((res: Resource, i: number) => (
                  <DownloadableResource key={i} resource={res} />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeStage === "reflect") {
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#181818] border border-[#282828] rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 text-9xl opacity-5 group-hover:rotate-12 transition-transform duration-700">
              <MessageSquare size={160} />
            </div>
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-2">Reflection</p>
            <p className="text-[#b3b3b3] leading-relaxed text-lg">
              Take a moment. What did this module reveal to you? Where can you apply this in the next 7 days?
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Your private reflection log</label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Start typing your thoughts here... This is for you only."
              rows={6}
              className="w-full px-4 py-4 bg-[#181818] border border-[#282828] rounded-xl focus:border-[#1ed760] outline-none transition-all text-white resize-none text-lg leading-relaxed shadow-inner"
            />
          </div>
          <div className="bg-[#1ed760]/10 rounded-xl p-5 border border-[#1ed760]/20">
            <p className="text-sm font-semibold text-[#b3b3b3]">The Jesuit method asks: <em className="text-[#1ed760]">"What moved you? What challenged you? What will you do about it?"</em></p>
          </div>
        </div>
      );
    }

    if (activeStage === "apply") {
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#181818] border border-[#282828] rounded-xl p-6">
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-2">Real-World Application</p>
            <p className="text-[#b3b3b3] leading-relaxed text-lg">
              This week, take what you learned and put it into action. Formation isn&apos;t complete until it&apos;s lived.
            </p>
          </div>

          <div className="bg-[#181818] border border-[#1ed760] rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#1ed760]" />
            <h4 className="font-bold text-white mb-3 text-lg flex items-center gap-2">
              <Target size={20} className="text-[#1ed760]" /> This week&apos;s challenge:
            </h4>
            <p className="text-[#b3b3b3] leading-relaxed text-lg pl-1">
              Pick one concept from <strong className="text-white">{modules[activeModuleIndex]}</strong> and deliberately apply it in a real situation —
              at work, school, or in a personal interaction. Note the outcome.
            </p>
          </div>

          <div className="bg-[#181818] rounded-xl p-5 border border-[#282828]">
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-3">Final Checklist</p>
            <ul className="space-y-3">
              {[
                "I finished watching the Learn video",
                "I actively completed the Practice tasks",
                "I wrote my honest Reflection",
                "I have committed to an Application plan"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-white bg-[#282828] p-3 rounded-md border border-[#282828]">
                  <div className="w-5 h-5 rounded-full bg-[#1ed760] text-black flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return null;
  };

  // ─── Main Player Layout ───────────────────────────────────────────────────
  return (
    <div className="h-screen bg-[#000000] text-white flex flex-col overflow-hidden font-sans">

      {/* Loading state */}
      {isLoading && (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#1ed760] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#b3b3b3]">Loading course...</p>
          </div>
        </div>
      )}

      {/* Course complete state */}
      {courseComplete && (
        <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center p-6">
          <div className="max-w-lg text-center">
            <div className="flex justify-center mb-6">
              <GraduationCap size={100} className="text-[#1ed760]" />
            </div>
            <h1 className="text-4xl font-extrabold mb-4">Formation Complete!</h1>
            <p className="text-xl text-[#b3b3b3] mb-2">You&apos;ve finished <strong>{course?.title}</strong>.</p>
            <p className="text-[#535353] mb-10">The work doesn&apos;t stop here.</p>
            <Link href="/">
              <button className="px-8 py-4 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition-transform">
                Explore More Courses →
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Main content (only show if not loading and not complete) */}
      {!isLoading && !courseComplete && (
        <>
          {/* ── Top Bar ──────────────────────────────────────────────────────── */}
          <header className="h-16 flex-shrink-0 bg-[#000000] flex items-center justify-between px-4 sm:px-6 z-30 border-b border-[#282828]">
            <Link
              href="/"
              onClick={(e) => handleExitAttempt(e, "/")}
              className="transition-transform hover:scale-105"
            >
              <Logo />
            </Link>
            <div className="hidden sm:block text-center flex-1 px-4">
              <p className="text-sm font-bold text-white truncate">{course?.title}</p>
              <div className="flex items-center justify-center gap-3 mt-1.5">
                <div className="w-48 h-1.5 bg-[#282828] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1ed760] rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <span className="text-xs text-[#b3b3b3] font-bold">{progressPct}%</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {currentUser?.stats && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#282828] rounded-full">
                  <span className="text-sm font-black text-[#1ed760]">{currentUser.stats.xp} XP</span>
                  <span className="text-sm text-white flex items-center gap-1">
                    <Flame size={14} className="text-orange-500" /> {currentUser.stats.streakDays}
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* ── Main 3-Panel Area ─────────────────────────────────────────────── */}
          <div className="flex flex-1 overflow-hidden">

            {/* LEFT SIDEBAR — desktop only */}
            <aside className="hidden lg:flex w-72 xl:w-80 bg-[#000000] border-r border-[#282828] flex-col flex-shrink-0 overflow-hidden">
              <div className="p-4 border-b border-[#282828]">
                <p className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">Course Modules</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {modules.map((mod: string, mi: number) => {
                  const status = getModuleStatus(mi);
                  const isActive = mi === activeModuleIndex;
                  return (
                    <button
                      key={mi}
                      disabled={status === "locked"}
                      onClick={() => { setActiveModuleIndex(mi); setActiveStage("learn"); }}
                      className={`w-full text-left flex items-start gap-3 p-3 rounded-md transition-all duration-200 ${isActive
                        ? "bg-[#282828] text-white"
                        : status === "locked"
                          ? "opacity-40 cursor-not-allowed text-[#a7a7a7]"
                          : "hover:bg-[#1a1a1a] text-[#b3b3b3]"
                        }`}
                    >
                      <span className={`w-7 h-7 flex-shrink-0 rounded flex items-center justify-center text-xs font-bold mt-0.5 ${status === "complete" ? "bg-[#1ed760]/20 text-[#1ed760]" :
                        status === "in-progress" ? "bg-blue-500/20 text-blue-400" :
                          status === "unlocked" ? "bg-white/10 text-white" :
                            "bg-white/5 text-gray-500"
                        }`}>
                        {status === "complete" ? <Check size={14} /> : status === "locked" ? <Lock size={14} /> : mi + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold leading-tight truncate ${isActive ? "text-[#1ed760]" : ""}`}>{mod}</p>
                        {isActive && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {STAGES.map((s) => (
                              <span key={s.key} className={`text-xs px-1.5 py-0.5 rounded font-medium ${isStageComplete(courseId, mi, s.key)
                                ? "bg-[#1ed760]/20 text-[#1ed760]"
                                : "bg-white/10 text-gray-400"
                                }`}>
                                <s.icon size={12} />
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* CENTER CANVAS */}
            <main className="flex-1 flex flex-col overflow-hidden bg-[#121212]">
              {/* Stage tabs */}
              <div className="bg-[#181818] border-b border-[#282828] px-4 sm:px-6 flex-shrink-0">
                <div className="flex items-center gap-1 pt-3 overflow-x-auto scrollbar-hide">
                  {STAGES.map((stage, si) => {
                    const unlocked = isStageUnlocked(stage.key);
                    const done = isStageComplete(courseId, activeModuleIndex, stage.key);
                    const active = activeStage === stage.key;
                    return (
                      <button
                        key={stage.key}
                        disabled={!unlocked}
                        onClick={() => unlocked && setActiveStage(stage.key)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-t-md text-sm font-bold transition-all duration-200 whitespace-nowrap flex-shrink-0 border-b-2 ${active
                          ? "bg-[#282828] border-[#1ed760] text-white"
                          : done
                            ? "border-[#1ed760]/50 text-[#1ed760] hover:bg-white/5"
                            : unlocked
                              ? "border-transparent text-[#b3b3b3] hover:text-white hover:bg-white/5"
                              : "border-transparent text-[#a7a7a7] cursor-not-allowed opacity-50"
                          }`}
                      >
                        <stage.icon size={16} />
                        <span>{stage.label}</span>
                        {done && <Check size={12} className="text-green-500" />}
                        {!unlocked && si > 0 && <Lock size={12} className="text-gray-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                  {/* Module heading */}
                  <div className="mb-8">
                    <p className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-2">
                      Module {activeModuleIndex + 1} of {totalModules}
                    </p>
                    <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                      {modules[activeModuleIndex]}
                    </h1>
                  </div>

                  {/* Auth gate */}
                  {!currentUser && (
                    <div className="mb-6 p-5 bg-[#181818] border border-[#282828] rounded-xl flex items-center gap-4">
                      <Lock size={24} className="text-[#1ed760]" />
                      <div>
                        <p className="font-bold text-white">Sign in to track your progress</p>
                        <p className="text-sm text-[#b3b3b3]">Your stage completions are saved per account.</p>
                      </div>
                      <Link href="/checkout?plan=pro" className="ml-auto flex-shrink-0">
                        <button className="px-4 py-2 bg-[#1ed760] text-black font-bold rounded-full text-sm hover:scale-105 transition-transform">
                          Get Access
                        </button>
                      </Link>
                    </div>
                  )}

                  {/* Stage content */}
                  {renderStageContent()}

                  {/* Mark Complete / Next Module button */}
                  <div className="mt-10 pt-8 border-t border-[#282828] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      onClick={handlePrevModule}
                      disabled={activeModuleIndex === 0}
                      className="text-sm text-[#b3b3b3] hover:text-white font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider"
                    >
                      ← Prev Module
                    </button>

                    <div className="flex gap-3">
                      {!isCurrentStageComplete && currentUser && (
                        <button
                          onClick={handleMarkComplete}
                          className={`px-8 py-3.5 font-bold rounded-full transition-all duration-200 uppercase tracking-wide ${justCompleted
                            ? "bg-transparent border-2 border-white text-white"
                            : "bg-[#1ed760] text-black hover:scale-105"
                            }`}
                        >
                          {justCompleted ? "✓ Marked Complete" : `Complete ${STAGES.find(s => s.key === activeStage)?.label}`}
                        </button>
                      )}

                      {currentModuleAllDone && activeModuleIndex < totalModules - 1 && (
                        <button
                          onClick={handleNextModule}
                          className="px-8 py-3.5 bg-transparent border-2 border-white hover:bg-white hover:text-black text-white font-bold rounded-full transition-all uppercase tracking-wide"
                        >
                          Next Module →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </main>

            {/* RIGHT PANEL — desktop only */}
            <aside className="hidden xl:flex w-64 bg-[#000000] border-l border-[#282828] flex-col flex-shrink-0">
              <div className="p-5 border-b border-[#282828]">
                <p className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-3">Overall Progress</p>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-1.5 bg-[#282828] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1ed760] rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-white">{progressPct}%</span>
                </div>
                <p className="text-xs text-[#b3b3b3]">{completedStages} of {totalStages} stages complete</p>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-3">Notes</p>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Jot down thoughts as you go..."
                  className="flex-1 w-full px-3 py-2 text-sm bg-[#181818] border border-[#282828] rounded-md resize-none focus:border-[#1ed760] outline-none transition-colors text-white placeholder-gray-500"
                />
              </div>
            </aside>
          </div>

          {/* ── Mobile Bottom Bar ─────────────────────────────────────────────── */}
          <div className="lg:hidden flex-shrink-0 bg-[#000000] border-t border-[#282828] px-4 py-3 flex items-center justify-between">
            <button
              onClick={handlePrevModule}
              disabled={activeModuleIndex === 0}
              className="p-2 text-[#b3b3b3] disabled:opacity-30"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#282828] rounded-full text-sm font-bold text-white uppercase tracking-wider"
            >
              <Menu size={16} />
              <span>Module {activeModuleIndex + 1} / {totalModules}</span>
            </button>
            {currentModuleAllDone && activeModuleIndex < totalModules - 1 ? (
              <button onClick={handleNextModule} className="p-2 text-[#1ed760] font-bold text-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            ) : (
              <div className="w-10" />
            )}
          </div>

          {/* ── Mobile Bottom Drawer ──────────────────────────────────────────── */}
          {drawerOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/80 z-40 lg:hidden"
                onClick={() => setDrawerOpen(false)}
              />
              <div className="fixed bottom-0 left-0 right-0 bg-[#121212] rounded-t-3xl z-50 lg:hidden max-h-[70vh] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between p-5 border-b border-[#282828]">
                  <p className="font-bold text-white">All Modules</p>
                  <button onClick={() => setDrawerOpen(false)} className="text-[#b3b3b3] hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="overflow-y-auto p-4 space-y-2 flex-1">
                  {modules.map((mod: string, mi: number) => {
                    const status = getModuleStatus(mi);
                    const isActive = mi === activeModuleIndex;
                    return (
                      <button
                        key={mi}
                        disabled={status === "locked"}
                        onClick={() => { setActiveModuleIndex(mi); setActiveStage("learn"); setDrawerOpen(false); }}
                        className={`w-full text-left flex items-center gap-3 p-4 rounded-md transition-all ${isActive ? "bg-[#282828] border-transparent" :
                          status === "locked" ? "opacity-40 cursor-not-allowed border-transparent text-[#a7a7a7]" :
                            "border-transparent hover:bg-[#1a1a1a] text-[#b3b3b3]"
                          }`}
                      >
                        <span className={`w-8 h-8 flex-shrink-0 rounded flex items-center justify-center text-sm font-bold ${status === "complete" ? "bg-[#1ed760]/20 text-[#1ed760]" :
                          status === "in-progress" ? "bg-blue-500/20 text-blue-400" :
                            "bg-white/5 text-gray-500"
                          }`}>
                          {status === "complete" ? "✓" : status === "locked" ? "🔒" : mi + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold leading-tight ${isActive ? "text-[#1ed760]" : ""}`}>{mod}</p>
                        </div>
                        <div className="flex gap-1">
                          {STAGES.map(s => (
                            <span key={s.key} className={`text-xs ${isStageComplete(courseId, mi, s.key) ? "opacity-100" : "opacity-20"}`}>
                              <s.icon size={12} />
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {/* ── Exit Confirmation Modal ── */}
          {showExitConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowExitConfirm(false)} />
              <div className="bg-[#181818] border border-[#282828] rounded-2xl p-8 max-w-md w-full relative z-10 shadow-2xl animate-fade-in text-center">
                <div className="w-20 h-20 bg-[#1ed760]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap size={40} className="text-[#1ed760]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Unfinished Business!</h3>
                <p className="text-[#b3b3b3] mb-8 leading-relaxed">
                  You haven&apos;t finished this <span className="text-white font-bold">{activeStage}</span> stage yet.
                  Are you sure you want to leave your progress behind?
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="w-full py-4 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition-transform"
                  >
                    Keep Learning
                  </button>
                  <button
                    onClick={confirmExit}
                    className="w-full py-4 bg-transparent border border-[#282828] text-[#a7a7a7] hover:text-white font-bold rounded-full transition-colors"
                  >
                    Yes, Leave Anyway
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
