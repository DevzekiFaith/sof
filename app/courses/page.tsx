"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { courses } from "../data/courses";
import { Play } from "lucide-react";
import { learningTracks } from "../data/learningTracks";

export default function CoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackId = searchParams.get("track");
  const [selectedCourse, setSelectedCourse] = useState(null);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
            <button
              key={course.id}
              onClick={() => {
                if (course.isFree) {
                  router.push(`/courses/${course.id}`);
                } else {
                  router.push(`/checkout?course=${course.id}`);
                }
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
                {course.isFree ? (
                  <div className="absolute top-2 left-2 bg-[#1ed760] text-black text-xs font-bold px-2 py-1 rounded-full z-10">
                    Free
                  </div>
                ) : (
                  <div className="absolute top-2 left-2 bg-[#D4AF37] text-black text-xs font-bold px-2 py-1 rounded-full z-10">
                    ${course.priceUSD}
                  </div>
                )}
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
        )}
      </div>
    </div>
  );
}
