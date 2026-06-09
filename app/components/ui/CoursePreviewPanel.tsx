"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Course } from "../../data/courses";
import { BookOpen, Zap, RotateCcw, Target, Lock, Crown, Star, CheckCircle } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import PaymentPromptModal from "./PaymentPromptModal";

interface CoursePreviewPanelProps {
  course: Course | null;
  onClose: () => void;
}

export default function CoursePreviewPanel({ course, onClose }: CoursePreviewPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { currentUser, hasCourseAccess } = useUser();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (course) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [course]);

  if (!course) return null;

  const IconComponent = course.icon;
  const moduleCount = course.modules?.length ?? 0;
  const outcomes = course.outcomes ?? [];
  const isLoggedIn = currentUser !== null;
  const canAccessCourse = hasCourseAccess(course.id);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-[#121212] z-[60] shadow-2xl overflow-y-auto animate-slide-in-right border-l border-[#282828]"
        role="dialog"
        aria-modal="true"
        aria-label={`${course.title} preview`}
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${course.bgGradient} p-8 pb-10 relative overflow-hidden`}>
          {course.imageUrl && (
            <Image src={course.imageUrl} alt="" fill className="object-cover mix-blend-overlay opacity-30" sizes="520px" />
          )}
          {/* Decorative blur glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#1ed760]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between mb-6 relative z-10">
            <div className={`p-4 rounded-2xl bg-black/40 backdrop-blur-md shadow-sm w-20 h-20 flex items-center justify-center relative overflow-hidden border border-white/10`}>
              {course.imageUrl ? (
                <Image src={course.imageUrl} alt={course.title} fill className="object-cover" sizes="80px" />
              ) : (
                <IconComponent className={`${course.iconColor} w-10 h-10 relative z-10`} />
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/40 backdrop-blur-md hover:bg-black/60 transition-colors text-white"
              aria-label="Close preview"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {course.featured && (
            <div className="mb-3 relative z-10">
              <span className="px-3 py-1 bg-[#1ed760] text-black text-xs font-black rounded-full uppercase tracking-wider">
                Popular
              </span>
            </div>
          )}
          <div className="mb-3 relative z-10 flex gap-2">
            <span className="px-3 py-1 bg-[#D4AF37] text-black text-xs font-black rounded-full uppercase tracking-wider">
              ${course.priceUSD}
            </span>
            <span className="px-3 py-1 bg-[#282828] text-white text-xs font-black rounded-full uppercase tracking-wider">
              ₦{(course.priceUSD || 0) * 1500}
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2 leading-tight relative z-10">
            {course.title}
          </h2>

          <div className="flex items-center gap-3 relative z-10">
            <span className="px-3 py-1 bg-black/40 backdrop-blur-sm text-gray-200 text-sm font-semibold rounded-lg border border-white/5">
              Ages {course.ageRange}
            </span>
            {course.duration && (
              <span className="px-3 py-1 bg-black/40 backdrop-blur-sm text-gray-200 text-sm font-semibold rounded-lg border border-white/5">
                {course.duration}
              </span>
            )}
            <span className="px-3 py-1 bg-black/40 backdrop-blur-sm text-gray-200 text-sm font-semibold rounded-lg border border-white/5">
              {moduleCount} modules
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">

          {/* Description */}
          <div>
            <p className="text-[#b3b3b3] text-base leading-relaxed">{course.fullDescription}</p>
          </div>

          {/* Formation Stages Explainer */}
          <div className="bg-[#181818] rounded-2xl p-6 border border-[#282828]">
            <p className="text-xs font-bold text-[#1ed760] uppercase tracking-wider mb-4">How Origin Works</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Learn", icon: <BookOpen className="w-5 h-5 text-[#1ed760]" />, desc: "Core content" },
                { label: "Practice", icon: <Zap className="w-5 h-5 text-[#1ed760]" />, desc: "Exercises" },
                { label: "Reflect", icon: <RotateCcw className="w-5 h-5 text-[#1ed760]" />, desc: "Internalize" },
                { label: "Apply", icon: <Target className="w-5 h-5 text-[#1ed760]" />, desc: "Real world" },
              ].map((stage) => (
                <div key={stage.label} className="text-center group flex flex-col items-center">
                  <div className="mb-1 transition-transform group-hover:scale-110">{stage.icon}</div>
                  <div className="text-[10px] font-bold text-white uppercase tracking-tight">{stage.label}</div>
                  <div className="text-[9px] text-[#a7a7a7] leading-tight">{stage.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#535353] mt-4 text-center">
              Complete all 4 stages per module to advance.
            </p>
          </div>

          {/* What You'll Learn */}
          {outcomes.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">What you&apos;ll gain</h3>
              <ul className="space-y-3">
                {outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 flex-shrink-0 bg-[#1ed760]/10 rounded-full flex items-center justify-center border border-[#1ed760]/20">
                      <svg className="w-3 h-3 text-[#1ed760]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm text-[#b3b3b3] leading-relaxed">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What You'll Get (Before Payment) */}
          <div className="bg-[#181818] rounded-2xl p-6 border border-[#282828]">
            <h3 className="text-lg font-bold text-white mb-4">What you&apos;ll get</h3>
            <ul className="space-y-3">
              {[
                "8 comprehensive modules with detailed content",
                "Interactive exercises and activities",
                "Real-world application challenges",
                "Progress tracking and completion certificates",
                "Lifetime access to course materials",
                "Downloadable resources and templates"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1ed760] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#b3b3b3] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews Section */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">What learners say</h3>
            <div className="space-y-4">
              {[
                {
                  name: "Sarah M.",
                  rating: 5,
                  text: "This course completely changed how I approach problems. The frameworks are practical and easy to apply.",
                  role: "Student"
                },
                {
                  name: "James K.",
                  rating: 5,
                  text: "Best investment I've made in my personal development. The 4-stage learning method really works.",
                  role: "Professional"
                },
                {
                  name: "Emily R.",
                  rating: 4,
                  text: "Clear, actionable content that I could immediately apply to my work. Highly recommended!",
                  role: "Entrepreneur"
                }
              ].map((review, i) => (
                <div key={i} className="bg-[#181818] rounded-xl p-4 border border-[#282828]">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-[#1ed760] text-[#1ed760]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#e5e5e5] mb-3 leading-relaxed">{review.text}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#282828] flex items-center justify-center text-xs font-bold text-[#1ed760]">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{review.name}</p>
                      <p className="text-xs text-[#a7a7a7]">{review.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module List Preview */}
          {course.modules && course.modules.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">
                  {moduleCount} Modules
                </h3>
              </div>
              <div className="space-y-2">
                {course.modules.slice(0, canAccessCourse ? 5 : 2).map((mod, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#181818] rounded-xl border border-transparent hover:border-[#282828] transition-colors">
                    <span className="w-7 h-7 flex-shrink-0 bg-[#282828] text-[#a7a7a7] rounded-lg flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#e5e5e5] font-medium">{mod}</span>
                  </div>
                ))}
                {!canAccessCourse && moduleCount > 2 && (
                  <div className="flex items-center justify-center gap-2 py-3 bg-[#282828]/50 rounded-xl border border-[#282828]">
                    <Lock className="w-4 h-4 text-[#b3b3b3]" />
                    <span className="text-sm text-[#b3b3b3]">+{moduleCount - 2} more modules</span>
                  </div>
                )}
                {canAccessCourse && moduleCount > 5 && (
                  <div className="text-center py-2">
                    <span className="text-sm text-[#535353]">+{moduleCount - 5} more modules inside</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky CTA Footer */}
        <div className="sticky bottom-0 bg-[#121212]/95 backdrop-blur-md border-t border-[#282828] p-6 shadow-2xl flex flex-col gap-3">
          {canAccessCourse ? (
            <Link href={`/learn/${course.id}`} className="block w-full" onClick={onClose}>
              <button className="w-full py-4 bg-[#1ed760] hover:scale-105 text-black font-bold text-lg rounded-full shadow-lg shadow-black/40 transition-all flex items-center justify-center gap-2 group">
                Start Course
              </button>
            </Link>
          ) : (
            <Link href={`/checkout?course=${course.id}`} className="block w-full" onClick={onClose}>
              <button className="w-full py-4 bg-[#1ed760] hover:scale-105 text-black font-bold text-lg rounded-full shadow-lg shadow-black/40 transition-all flex items-center justify-center gap-2 group">
                Purchase Course — ${course.priceUSD}
              </button>
            </Link>
          )}
        </div>
      </div>

      <PaymentPromptModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        featureName="Full Course Access"
      />
    </>
  );
}
