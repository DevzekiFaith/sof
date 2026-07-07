"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Target, Users, TrendingUp, Heart, MessageSquare, Play, ArrowRight, BookOpen, Award, Clock, Star } from "lucide-react";
import { simplifiedCourses } from "../data/simplified-courses";

export default function CoursesContent() {
  const iconMap: Record<string, React.ElementType> = {
    "problem-solving": Zap,
    "decision-making": Target,
    "team-person": Users,
    "personal-adaptability": TrendingUp,
    "self-image": Heart,
    "communication": MessageSquare,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Our Courses</h1>
        <p className="text-[#b3b3b3] text-lg font-light">
          Six universal courses designed to transform how you think, decide, communicate, and succeed.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simplifiedCourses.map((course) => {
            const Icon = iconMap[course.id];
            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group bg-[#141414] rounded-2xl overflow-hidden hover:bg-[#1a1a1a] transition-all border border-white/5 hover:border-[#60a5fa]/20"
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
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                      <div className={`absolute inset-0 bg-gradient-to-br ${course.bgGradient} opacity-20`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="text-[#60a5fa] w-20 h-20 opacity-80" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
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
                  <p className="text-[#b3b3b3] text-sm mb-4 line-clamp-2 leading-relaxed">
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
                      <div className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-white/10">
                        <Award className="w-5 h-5 text-[#60a5fa]" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{course.instructor}</div>
                        <div className="text-[#666] text-xs">{course.instructorTitle}</div>
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
    </div>
  );
}
