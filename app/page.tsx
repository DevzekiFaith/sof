"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SearchBar from "./components/ui/SearchBar";
import AnimatedSection from "./components/ui/AnimatedSection";
import Statistics from "./components/sections/Statistics";
import Testimonials from "./components/sections/Testimonials";
import { courses, Course } from "./data/courses";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [ageFilter, setAgeFilter] = useState<string>("all");

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAge = ageFilter === "all" || course.ageRange.includes(ageFilter);

    return matchesSearch && matchesAge;
  });

  const ageRanges = ["all", "10", "12", "14", "16", "18"];

  return (
    <div className="min-h-screen bg-gray-50/30 font-sans selection:bg-orange-200 selection:text-orange-900">
      <Header variant="default" showAuth={true} />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-36 relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-orange-100/50 via-orange-50/20 to-transparent pointer-events-none"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

        <AnimatedSection>
          <div className="max-w-6xl mx-auto text-center relative z-10 pt-8">
            <h1 className="text-6xl sm:text-7xl md:text-9xl lg:text-[11rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 mb-6 sm:mb-10 leading-none tracking-tighter drop-shadow-sm animate-fade-in">
              Self-Pay
            </h1>

            <AnimatedSection delay={150}>
              <h2 className="text-2xl sm:text-3xl md:text-5xl text-gray-800 font-bold mb-8 tracking-tight">
                Unlock Your Highest Potential
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={250}>
              <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 leading-relaxed mb-8 sm:mb-12 font-medium max-w-4xl mx-auto px-4">
                If you&apos;re building skills, developing yourself, or just stubbornly committed to progress,{" "}
                <span className="text-orange-600 font-bold">welcome home</span>.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={350}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-500 leading-relaxed max-w-4xl mx-auto mb-10 px-4">
                Powering individuals from all backgrounds with elite skills in capital development, persuasion, decision-making, and teamwork.
              </p>

              <div className="flex justify-center gap-4 mt-8">
                <Link href="#courses">
                  <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold text-lg hover-lift shadow-lg shadow-orange-500/30">
                    Start Learning Now
                  </button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </AnimatedSection>
      </section>

      {/* Courses Section */}
      <section id="courses" className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="mb-12 sm:mb-16">
              <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-8 sm:mb-12 text-center px-4 tracking-tight">
                Explore Our Courses
              </h2>

              {/* Search and Filter */}
              <AnimatedSection delay={100}>
                <div className="flex flex-col md:flex-row gap-6 sm:gap-8 mb-10 sm:mb-16 items-center justify-center px-4 backdrop-blur-md bg-white/40 p-6 rounded-3xl border border-white/60 shadow-xl shadow-gray-200/50">
                  <div className="w-full md:w-auto max-w-md">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  </div>
                  <div className="flex gap-3 flex-wrap justify-center w-full md:w-auto">
                    {ageRanges.map((age, index) => (
                      <button
                        key={age}
                        onClick={() => setAgeFilter(age)}
                        className={`px-5 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 transform hover-lift ${ageFilter === age
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/40 border border-transparent"
                          : "glass text-gray-700 hover:bg-white/80"
                          }`}
                      >
                        {age === "all" ? "All Ages" : `${age}+`}
                      </button>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </AnimatedSection>

          {filteredCourses.length === 0 ? (
            <AnimatedSection>
              <div className="text-center py-12 sm:py-20 px-4">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-400">No courses found matching your criteria.</p>
              </div>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {filteredCourses.map((course, index) => {
                const IconComponent = course.icon;
                return (
                  <AnimatedSection key={course.id} delay={index * 50}>
                    <Link
                      href={`/courses/${course.id}`}
                      className="group block h-full"
                    >
                      <div className="glass hover-lift rounded-3xl p-6 sm:p-8 flex flex-col min-h-[420px] relative overflow-hidden">
                        {/* Shimmer effect background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        {course.featured && (
                          <div className="mb-4 animate-pulse-slow">
                            <span className="px-3 py-1.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs sm:text-sm font-bold rounded-lg inline-block shadow-md">
                              POPULAR
                            </span>
                          </div>
                        )}

                        <div className={`mb-6 p-5 rounded-2xl bg-gradient-to-br ${course.bgGradient} transition-transform duration-500 group-hover:scale-110 shadow-sm inline-block self-start`}>
                          <IconComponent className={`${course.iconColor} w-10 h-10 sm:w-12 sm:h-12`} />
                        </div>

                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-orange-600 transition-colors duration-300 leading-tight">
                          {course.title}
                        </h3>

                        <p className="text-sm sm:text-base text-gray-600 mb-6 flex-grow leading-relaxed">
                          {course.description.substring(0, 110)}...
                        </p>

                        <div className="mb-6 flex items-center justify-between">
                          <span className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Age Range </span>
                          <span className="text-base sm:text-lg font-bold text-gray-900 bg-gray-100/80 px-3 py-1 rounded-md">{course.ageRange}</span>
                        </div>

                        <div className="pt-5 border-t border-gray-200/60 mt-auto">
                          <span className="text-base sm:text-lg font-bold text-orange-600 inline-flex items-center gap-2 group-hover:text-orange-600 transition-colors">
                            Explore Course
                            <span className="transform group-hover:translate-x-3 transition-transform duration-300">→</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                );
              })}
            </div>
          )}

          {/* Coming Soon Courses Banner */}
          <AnimatedSection>
            <div className="mt-20 sm:mt-32 relative">
              <div className="text-center mb-12 sm:mb-16">
                <h3 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 mb-4 tracking-tight">Coming Soon</h3>
                <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto mb-4 leading-relaxed">Exciting new masterclasses in active development. Instant high-impact video learning.</p>
                <p className="text-lg text-orange-600 font-semibold bg-orange-50/50 inline-block px-4 py-2 rounded-full backdrop-blur-sm border border-orange-100">🚀 Get ready for completely reinvented learning models</p>
              </div>

              <div className="relative">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-amber-50/80 to-yellow-50/80 rounded-[2.5rem] blur-sm"></div>

                {/* Content */}
                <div className="relative p-6 sm:p-10 lg:p-14">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {[
                      {
                        title: "Starting a Small Scale Business",
                        description: "Learn entrepreneurship fundamentals, from idea validation to launching your first venture. Perfect for aspiring business owners.",
                        timeline: "Q3 2026"
                      },
                      {
                        title: "How to Retain Customers",
                        description: "Master the art of customer relationship management. Discover strategies to build loyalty, reduce churn, and create lifelong relationships.",
                        timeline: "Q3 2026"
                      },
                      {
                        title: "Repeating Successful Patterns",
                        description: "Unlock the power of scalable success. Learn to identify, analyze, and replicate winning business strategies across markets.",
                        timeline: "Q4 2026"
                      },
                    ].map((course, index) => (
                      <AnimatedSection key={index} delay={index * 150}>
                        <div className="glass rounded-3xl p-6 sm:p-8 hover-lift pointer-events-none group">
                          {/* Timeline badge */}
                          <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-200/50 text-orange-700 text-xs sm:text-sm font-bold rounded-full mb-6 relative">
                            <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-10 rounded-full blur-md animate-pulse"></span>
                            {course.timeline}
                          </div>

                          <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-tight">
                            {course.title}
                          </h4>

                          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
                            {course.description}
                          </p>

                          <div className="mt-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/50 text-gray-500 rounded-lg text-sm font-semibold border border-gray-200/50">
                              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                              In Development
                            </div>
                          </div>
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>

                  {/* Newsletter signup */}
                  <div className="mt-14 sm:mt-20 text-center">
                    <div className="glass rounded-3xl p-8 sm:p-12 max-w-2xl mx-auto shadow-2xl shadow-orange-900/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-300/20 rounded-full blur-2xl"></div>

                      <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 relative z-10">Be the First to Know</h4>
                      <p className="text-gray-600 mb-8 relative z-10">Get notified when these courses launch and receive exclusive early access advantages.</p>
                      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
                        <input
                          type="email"
                          placeholder="Enter your email"
                          className="flex-1 px-5 py-3.5 bg-white/70 border border-gray-200/80 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none text-sm sm:text-base transition-all font-medium"
                        />
                        <button className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover-lift shadow-lg shadow-orange-500/30">
                          Waitlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Statistics Section */}
      <Statistics />

      {/* Testimonials Section */}
      <Testimonials />

      {/* About Section Preview */}
      <section id="about" className="py-20 sm:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <AnimatedSection>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 mb-8 px-4 tracking-tight">
                About Self-Pay
              </h2>
              <AnimatedSection delay={150}>
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 leading-relaxed mb-10 sm:mb-14 px-4 font-medium">
                  We empower individuals with essential life and professional skills. Our mission is to provide practical, actionable education that completely shifts your trajectory.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={250}>
                <Link href="/about">
                  <button className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover-lift shadow-lg shadow-gray-900/20">
                    Learn Our Story
                  </button>
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Contact Section Preview */}
      <section id="contact" className="py-20 sm:py-32 bg-gray-50 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        <AnimatedSection>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mb-8 px-4 tracking-tight">
                Get in Touch
              </h2>
              <AnimatedSection delay={150}>
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 leading-relaxed mb-10 sm:mb-14 px-4">
                  Have questions or want to collaborate? We&apos;re ready to engage and help you accelerate your growth.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={250}>
                <Link href="/contact">
                  <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-800 rounded-xl font-bold text-lg hover-lift hover:border-orange-400 hover:text-orange-600 transition-colors shadow-sm">
                    Contact The Team
                  </button>
                </Link>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
