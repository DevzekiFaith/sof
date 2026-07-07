"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Target, Users, TrendingUp, Heart, MessageSquare, Play, ArrowRight, BookOpen, Award, Clock, Star, Calendar, ShoppingBag } from "lucide-react";
import { simplifiedCourses } from "./data/simplified-courses";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");

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
        <div className="max-w-5xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
            Master Life's<br />
            <span className="text-[#60a5fa]">Essential Skills</span>
          </h1>
          <p className="text-lg md:text-xl text-[#9aa4b2] max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Six universal courses designed to transform how you think, decide, communicate, and succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="bg-[#60a5fa] text-black px-8 py-4 rounded-full font-semibold text-base hover:bg-[#3b82f6] transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-[#60a5fa]/15">
              <Play className="w-5 h-5" />
              Start Learning
            </Link>
            <Link href="/courses" className="border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white/5 transition-all">
              View All Courses
            </Link>
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
                  alt="Excellence Journal"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold mb-3">The Excellence Journal</h3>
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
                  src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80"
                  alt="Mindset eBook"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold mb-3">Mindset Mastery eBook</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold text-xl">$19.99</span>
                  <Link href="/store" className="bg-[#60a5fa] text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#3b82f6] transition-colors">
                    Add
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#0b1220] rounded-2xl overflow-hidden hover:bg-[#0e1624] transition-all group border border-white/5 hover:border-[#60a5fa]/20">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
                  alt="Origin Hoodie"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold mb-3">Origin Hoodie</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold text-xl">$49.99</span>
                  <Link href="/store" className="bg-[#60a5fa] text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#3b82f6] transition-colors">
                    Add
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#0b1220] rounded-2xl overflow-hidden hover:bg-[#0e1624] transition-all group border border-white/5 hover:border-[#60a5fa]/20">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80"
                  alt="Goal Planner"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-white font-bold mb-3">Goal Setting Planner</h3>
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
