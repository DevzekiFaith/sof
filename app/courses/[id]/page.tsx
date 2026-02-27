"use client";

import { useParams, useRouter } from "next/navigation";
import { getCourseById } from "../../data/courses";
import { QUARTERLY_PASS_PRICE_USD } from "../../data/courses";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Button from "../../components/ui/Button";
import AnimatedSection from "../../components/ui/AnimatedSection";
import { ChevronRightIcon } from "../../components/Icons";
import Link from "next/link";
import { useState } from "react";
import PurchaseModal from "../../components/ui/PurchaseModal";
import { useUser } from "../../contexts/UserContext";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const course = getCourseById(params.id as string);
  const { currentUser, hasCourseAccess, getQuarterlyPass } = useUser();
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [purchaseMode, setPurchaseMode] = useState<"course" | "quarterly">("course");

  if (!course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link href="/" className="text-amber-600 hover:text-orange-700 font-semibold">
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
    <div className="min-h-screen bg-white">
      <Header
        variant="course"
        backLink={{ href: "/", text: "← Back to Courses" }}
      />

      <PurchaseModal
        isOpen={purchaseOpen}
        onClose={() => setPurchaseOpen(false)}
        courseId={course.id}
        courseTitle={course.title}
        coursePriceUSD={coursePrice}
        quarterlyPriceUSD={QUARTERLY_PASS_PRICE_USD}
        mode={purchaseMode}
      />

      {/* Course Detail */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="mb-8 sm:mb-12">
              <div className={`inline-block p-4 sm:p-6 rounded-2xl bg-gradient-to-br ${course.bgGradient} mb-6 sm:mb-8 transition-transform duration-300 hover:scale-110 hover:rotate-3`}>
                <IconComponent className={`${course.iconColor} w-12 h-12 sm:w-16 sm:h-16 transition-transform duration-300`} />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {course.title}
              </h1>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={100}>
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 leading-relaxed mb-6 sm:mb-8">
              {course.fullDescription}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105">
                <span className="text-xs sm:text-sm text-gray-600 font-semibold">Age Range: </span>
                <span className="text-base sm:text-lg font-bold text-gray-900">{course.ageRange}</span>
              </div>
              {course.duration && (
                <div className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300 transform hover:scale-105">
                  <span className="text-xs sm:text-sm text-gray-600 font-semibold">Duration: </span>
                  <span className="text-base sm:text-lg font-bold text-gray-900">{course.duration}</span>
                </div>
              )}
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
                  <Button variant="primary" size="md" className="w-full">
                    🚀 Start Learning Now
                  </Button>
                </a>
              ) : (
                <Button variant="primary" size="md" className="w-full sm:w-auto">
                  Enroll Now
                </Button>
              )}
            </div>
          </AnimatedSection>

          {/* Purchase CTA */}
          <AnimatedSection delay={350}>
            <div className="mt-6 p-6 border-2 border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    Unlock the structured course experience
                  </div>
                  <div className="text-gray-600 mt-1">
                    Module detail pages, activities, resources & downloads.
                  </div>
                  {pass.isActive && (
                    <div className="text-sm text-orange-700 mt-2 font-semibold">
                      School Pass active until {new Date(pass.expiresAt!).toLocaleDateString()}.
                    </div>
                  )}
                  {unlocked && !pass.isActive && (
                    <div className="text-sm text-orange-700 mt-2 font-semibold">
                      You own this course.
                    </div>
                  )}
                  {!currentUser && (
                    <div className="text-sm text-yellow-700 mt-2 font-semibold">
                      Sign in to purchase and unlock content (stored locally on this device).
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:min-w-[260px]">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      setPurchaseMode("course");
                      setPurchaseOpen(true);
                    }}
                  >
                    Buy this course — ${coursePrice.toFixed(2)}
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full"
                    onClick={() => {
                      setPurchaseMode("quarterly");
                      setPurchaseOpen(true);
                    }}
                  >
                    School Pass (Quarterly) — ${QUARTERLY_PASS_PRICE_USD.toFixed(2)}
                  </Button>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {modules.length > 0 && course.detailedModules && course.detailedModules.length === modules.length && (
            <AnimatedSection delay={400}>
              <div className="mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 sm:mb-8">
                  Course Modules
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {modules.map((module: string, index: number) => (
                    <AnimatedSection key={index} delay={index * 50}>
                      <Link href={`/courses/${course.id}/modules/${index + 1}`}>
                        <div className="p-4 sm:p-6 border-2 border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-lg flex items-center justify-center font-bold text-lg sm:text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 group-hover:text-black transition-colors">{module}</h3>
                              <p className="text-gray-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Click to explore this module →</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {modules.length > 0 && (!course.detailedModules || course.detailedModules.length !== modules.length) && (
            <AnimatedSection delay={400}>
              <div className="mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 sm:mb-8">
                  Course Modules
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {modules.map((module: string, index: number) => (
                    <AnimatedSection key={index} delay={index * 50}>
                      <div className="p-4 sm:p-6 border-2 border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-400 text-white rounded-lg flex items-center justify-center font-bold text-lg sm:text-xl flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-600">{module}</h3>
                            <p className="text-gray-500 mt-2">Detailed content coming soon...</p>
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
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 sm:mb-8">
                  Learning Outcomes
                </h2>
                <ul className="space-y-3 sm:space-y-4">
                  {outcomes.map((outcome: string, index: number) => (
                    <AnimatedSection key={index} delay={index * 50}>
                      <li className="flex items-start gap-3 sm:gap-4 group">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                          <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                        <p className="text-lg sm:text-xl text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{outcome}</p>
                      </li>
                    </AnimatedSection>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

