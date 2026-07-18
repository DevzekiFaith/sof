"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Target, Users, TrendingUp, Heart, MessageSquare, Play, ArrowRight, BookOpen, Award, Clock, Star, Plus } from "lucide-react";
import { simplifiedCourses } from "../data/simplified-courses";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { getCompanionProductForCourse } from "../data/course-ebook-mapping";

export default function CoursesContent() {
  const { addToCart } = useCart();
  const { showToast } = useToast();

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
            const ebook = getCompanionProductForCourse(course.id);
            return (
              <div
                key={course.id}
                className="group bg-[#141414] rounded-2xl overflow-hidden hover:bg-[#1a1a1a] transition-all border border-white/5 hover:border-[#60a5fa]/20 flex flex-col justify-between"
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
                  
                  <div className="p-6 pb-0">
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
                  </div>
                </Link>

                <div className="p-6 pt-0 mt-auto">
                  <Link href={`/courses/${course.id}`} className="block">
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mb-4">
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
    </div>
  );
}
