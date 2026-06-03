"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getCourseById } from "../../data/courses";
import { QUARTERLY_PASS_PRICE_USD } from "../../data/courses";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Button from "../../components/ui/Button";
import AnimatedSection from "../../components/ui/AnimatedSection";
import { ChevronRightIcon } from "../../components/Icons";
import Link from "next/link";
import { useUser } from "../../contexts/UserContext";
import { Rocket, Play, BookOpen } from "lucide-react";
import Logo from "../../components/Logo";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const course = getCourseById(params.id as string);
  const { currentUser, hasCourseAccess, getQuarterlyPass } = useUser();

  useEffect(() => {
    // Simulate loading state for better UX
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1ed760] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#b3b3b3]">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Course Not Found</h1>
          <Link href="/" className="text-[#1ed760] hover:text-white font-semibold transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = course.icon;
  const modules = course.modules || [];
  const outcomes = course.outcomes || [];
  const coursePrice = course.priceUSD ?? 14;
  const pass = getQuarterlyPass();
  const unlocked = currentUser ? hasCourseAccess(course.id) : false;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <header className="h-16 flex-shrink-0 bg-[#000000] flex items-center justify-between px-4 sm:px-6 z-30 border-b border-[#282828]">
        <Link href="/" className="transition-transform hover:scale-105">
          <Logo />
        </Link>
        <Link 
          href="/" 
          className="text-sm font-bold text-[#b3b3b3] hover:text-white transition-colors"
        >
          ← Back to Courses
        </Link>
      </header>

      {/* Course Detail */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="mb-8 sm:mb-12">
              <div className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${course.bgGradient} mb-6 sm:mb-8 transition-transform duration-300 hover:scale-110 hover:rotate-3 relative overflow-hidden w-20 h-20 sm:w-28 sm:h-28 shadow-lg shadow-black/50`}>
                {course.imageUrl ? (
                  <Image src={course.imageUrl} alt={course.title} fill className="object-cover opacity-90" sizes="(max-width: 640px) 80px, 112px" />
                ) : (
                  <IconComponent className={`${course.iconColor} w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-300 relative z-10`} />
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
                {course.title}
              </h1>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <p className="text-xl sm:text-2xl md:text-3xl text-[#b3b3b3] leading-relaxed mb-6 sm:mb-8">
              {course.fullDescription}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="px-4 sm:px-6 py-2 sm:py-3 bg-[#282828] rounded-lg hover:bg-[#333] transition-colors duration-300 transform hover:scale-105">
                <span className="text-xs sm:text-sm text-[#b3b3b3] font-semibold">Age Range: </span>
                <span className="text-base sm:text-lg font-bold text-white">{course.ageRange}</span>
              </div>
              {course.duration && (
                <div className="px-4 sm:px-6 py-2 sm:py-3 bg-[#282828] rounded-lg hover:bg-[#333] transition-colors duration-300 transform hover:scale-105">
                  <span className="text-xs sm:text-sm text-[#b3b3b3] font-semibold">Duration: </span>
                  <span className="text-base sm:text-lg font-bold text-white">{course.duration}</span>
                </div>
              )}
              <Link href="/#pricing" className="px-4 sm:px-6 py-2 sm:py-3 bg-[#1ed760]/10 border border-[#1ed760]/20 rounded-lg hover:bg-[#1ed760]/20 transition-colors duration-300 transform hover:scale-105 group">
                <span className="text-xs sm:text-sm text-[#1ed760] font-semibold">Price: </span>
                <span className="text-base sm:text-lg font-bold text-[#1ed760] group-hover:underline">${coursePrice}</span>
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <div className="flex flex-col sm:flex-row gap-4">
              {course.youtubeVideoUrl ? (
                <a
                  href={course.youtubeVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button variant="primary" size="md" className="w-full flex items-center justify-center gap-2">
                    <Rocket size={20} /> Start Learning Now
                  </Button>
                </a>
              ) : (
                <Link
                  href={unlocked ? `/learn/${course.id}` : `/checkout?course=${course.id}`}
                  className="w-full sm:w-auto"
                >
                  <Button variant="primary" size="md" className="w-full">
                    {unlocked ? "Continue Learning" : "Purchase Course"}
                  </Button>
                </Link>
              )}
            </div>
          </AnimatedSection>

          {/* Purchase CTA */}
          <AnimatedSection delay={350}>
            <div className="mt-6 p-6 border border-[#282828] rounded-2xl bg-[#181818] shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <div className="text-2xl font-bold text-white mb-2">
                      Unlock the full experience
                    </div>
                    <p className="text-[#b3b3b3] mb-4">
                      Get lifetime access to modules, activities, and expert-curated resources.
                    </p>
                    {pass.isActive && (
                      <div className="text-sm text-[#1ed760] font-semibold">
                        Pro Pass active until {new Date(pass.expiresAt!).toLocaleDateString()}.
                      </div>
                    )}
                    {unlocked && !pass.isActive && (
                      <div className="text-sm text-[#1ed760] font-semibold">
                        You already have access to this course.
                      </div>
                    )}
                    {!currentUser && (
                      <div className="text-sm text-[#1ed760] font-semibold">
                        Sign in to unlock permanent access.
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:min-w-[280px]">
                    <Link href="/checkout?plan=monthly" className="w-full">
                      <button className="w-full py-4 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-[#1ed760]/20">
                        Get Premium — ${coursePrice}
                      </button>
                    </Link>
                    <Link href="/#pricing" className="w-full">
                      <button className="w-full py-3 bg-[#282828] text-white font-bold rounded-full border border-[#333] hover:bg-[#333] transition-colors">
                        View All Plans
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>

          {modules.length > 0 && course.detailedModules && course.detailedModules.length === modules.length && (
            <AnimatedSection delay={400}>
              <div className="mb-8 sm:mb-12 mt-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-white tracking-tight">Course Modules</h2>
                  <span className="text-sm text-[#b3b3b3] font-medium">{modules.length} modules</span>
                </div>
                <div className="space-y-1">
                  {modules.map((moduleName: string, index: number) => {
                    const moduleDetail = course.detailedModules?.[index];
                    const ModuleIcon = moduleDetail?.icon;
                    const isValidIcon = ModuleIcon && typeof ModuleIcon === 'function';

                    return (
                      <AnimatedSection key={index} delay={index * 50}>
                        <Link href={`/courses/${course.id}/modules/${index + 1}`}>
                          <div className="flex items-center gap-4 p-3 rounded-md hover:bg-white/10 transition-all group">
                            <div className="w-8 text-center text-[#b3b3b3] text-sm font-medium group-hover:hidden">
                              {index + 1}
                            </div>
                            <div className="w-8 text-center text-[#1ed760] hidden group-hover:block">
                              <Play size={16} fill="currentColor" />
                            </div>
                            <div className="w-10 h-10 bg-[#282828] rounded flex items-center justify-center flex-shrink-0 border border-[#333]">
                               {isValidIcon ? (
                                 <ModuleIcon className="w-5 h-5 text-[#1ed760]" />
                               ) : (
                                 <BookOpen className="w-5 h-5 text-[#b3b3b3]" />
                               )}
                            </div>
                            <div className="flex-1 truncate">
                              <h3 className="text-base font-bold text-white truncate group-hover:text-[#1ed760] transition-colors">{moduleName}</h3>
                              <p className="text-xs text-[#b3b3b3] truncate">{moduleDetail?.description || "Master this module's core concepts"}</p>
                            </div>
                            <div className="hidden sm:block text-xs text-[#b3b3b3] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                               View module →
                            </div>
                          </div>
                        </Link>
                      </AnimatedSection>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          )}

          {modules.length > 0 && (!course.detailedModules || course.detailedModules.length !== modules.length) && (
            <AnimatedSection delay={400}>
              <div className="mb-8 sm:mb-12 mt-16">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                  Course Modules
                </h2>
                <div className="space-y-4">
                  {modules.map((module: string, index: number) => (
                    <AnimatedSection key={index} delay={index * 50}>
                      <div className="p-6 bg-[#181818] border border-[#282828] rounded-xl cursor-not-allowed opacity-60">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-[#282828] text-[#535353] rounded-lg flex items-center justify-center font-bold text-xl flex-shrink-0 border border-[#333]">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl sm:text-3xl font-bold text-[#b3b3b3]">{module}</h3>
                            <p className="text-[#535353] mt-1 text-sm font-medium">Detailed content coming soon...</p>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {outcomes.length > 0 && (
            <AnimatedSection delay={500}>
              <div className="mt-16">
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                  What You&apos;ll Master
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {outcomes.map((outcome: string, index: number) => (
                    <AnimatedSection key={index} delay={index * 50}>
                      <li className="flex items-start gap-4 bg-[#181818] p-5 rounded-xl border border-[#282828] group hover:border-[#535353] transition-colors">
                        <div className="w-8 h-8 bg-[#1ed760]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <ChevronRightIcon className="w-4 h-4 text-[#1ed760] transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                        <p className="text-lg text-[#b3b3b3] font-medium group-hover:text-white transition-colors">{outcome}</p>
                      </li>
                    </AnimatedSection>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

    <Footer />
    </div>
  );
}

