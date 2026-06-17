"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { courses } from "../data/courses";
import { Star, Clock, Award, User, ArrowRight } from "lucide-react";
import { learningTracks } from "../data/learningTracks";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import CoursePurchaseModal from "../components/ui/CoursePurchaseModal";
import { Course } from "../data/courses";

export default function CoursesContent() {
  const searchParams = useSearchParams();
  const trackId = searchParams.get("track");
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Filter courses by trackId if provided
  const filteredCourses = trackId
    ? courses.filter((course) => course.trackId === trackId)
    : courses;

  // Get track title for display
  const track = trackId ? learningTracks.find((t) => t.id === trackId) : null;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 sm:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">
              {track ? `${track.title} Courses` : "All Courses"}
            </h1>
            {track && (
              <p className="text-sm text-[#b3b3b3] mt-1">{track.description}</p>
            )}
          </div>
          {track && (
            <Link
              href="/courses"
              className="text-sm text-[#1ed760] hover:underline"
            >
              View all courses
            </Link>
          )}
        </div>
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#b3b3b3]">No courses available for this track yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCourses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="group relative bg-[#181818] rounded-xl border border-[#282828] hover:border-[#1ed760]/30 transition-all duration-300 overflow-hidden cursor-pointer text-left"
            >
              {/* Course Thumbnail */}
              <div className={`h-40 bg-gradient-to-br ${course.bgGradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/80" style={{ fontSize: '48px' }}>
                    <course.icon />
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-[#D4AF37] text-black text-xs font-bold px-2 py-1 rounded">
                  ${course.priceUSD}
                </div>
                <div className="absolute top-3 right-3 bg-[#282828] text-white text-xs font-bold px-2 py-1 rounded">
                  ₦{(course.priceUSD || 0) * 1500}
                </div>
              </div>

              {/* Course Info */}
              <div className="p-4">
                <h3 className="font-bold text-white text-sm leading-tight mb-2 line-clamp-2 group-hover:text-[#1ed760] transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs text-[#b3b3b3] mb-3 line-clamp-2">{course.description}</p>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-[#282828] flex items-center justify-center">
                    <User className="w-4 h-4 text-[#b3b3b3]" />
                  </div>
                  <span className="text-xs text-[#b3b3b3]">Origin Academy</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < 4 ? "text-[#D4AF37] fill-[#D4AF37]" : "text-[#282828]"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#b3b3b3]">4.8</span>
                  <span className="text-xs text-[#b3b3b3]">(1,247)</span>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-3 mb-3 text-xs text-[#b3b3b3]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration || "8 hours"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span>{course.level || "All Levels"}</span>
                  </div>
                </div>

                {/* Students */}
                <div className="text-xs text-[#b3b3b3] mb-3">
                  8,542 students enrolled
                </div>

                {/* Add to Cart */}
                <div className="flex items-center justify-between pt-3 border-t border-[#282828]">
                  <span className="text-xs text-[#b3b3b3]">One-time purchase</span>
                  <ArrowRight className="w-4 h-4 text-[#1ed760] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </button>
          ))}
        </div>
        )}
      </div>
      
      {/* Course Purchase Modal */}
      {selectedCourse && (
        <CoursePurchaseModal
          course={selectedCourse}
          isOpen={!!selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
