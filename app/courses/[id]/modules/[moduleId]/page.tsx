"use client";

import { useParams, useRouter } from "next/navigation";
import { getCourseById, ModuleDetail } from "../../../../data/courses";
import { useState, useEffect } from "react";
import Header from "../../../../components/layout/Header";
import Footer from "../../../../components/layout/Footer";
import Button from "../../../../components/ui/Button";
import AnimatedSection from "../../../../components/ui/AnimatedSection";
import Link from "next/link";
import { useUser } from "../../../../contexts/UserContext";
import { FileText, Download, ChevronLeft, ChevronRight, Clock, Target as TargetIcon } from "lucide-react";

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter(); // @ts-ignore
  const courseId = params.id as string;
  const moduleId = parseInt(params.moduleId as string);
  const { currentUser, hasCourseAccess } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const course = getCourseById(courseId);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1ed760] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#b3b3b3]">Loading module...</p>
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

  // Check if moduleId is valid
  if (!moduleId || isNaN(moduleId) || moduleId < 1) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Invalid Module</h1>
          <Link href={`/courses/${courseId}`} className="text-[#1ed760] hover:text-white font-semibold transition-colors">
            Return to Course
          </Link>
        </div>
      </div>
    );
  }

  // Check if detailedModules exists and has enough modules
  const totalModules = course?.detailedModules?.length || 0;
  if (totalModules === 0) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Course Content Loading</h1>
          <p className="text-[#a7a7a7] mb-4">The detailed modules for this course are being prepared.</p>
          <Link href={`/courses/${courseId}`} className="text-[#1ed760] hover:text-white font-semibold transition-colors">
            Return to Course Overview
          </Link>
        </div>
      </div>
    );
  }

  if (moduleId > totalModules) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Module Not Available</h1>
          <p className="text-[#a7a7a7] mb-4">This module number exceeds the total modules in this course.</p>
          <Link href={`/courses/${courseId}`} className="text-[#1ed760] hover:text-white font-semibold transition-colors">
            Return to Course
          </Link>
        </div>
      </div>
    );
  }

  const courseModule: ModuleDetail | undefined = course?.detailedModules?.[moduleId - 1];

  if (!courseModule) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Module Not Found</h1>
          <p className="text-[#a7a7a7] mb-4">This module is currently being developed.</p>
          <Link href={`/courses/${courseId}`} className="text-[#1ed760] hover:text-white font-semibold transition-colors">
            Return to Course
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = course.icon;
  const modules = course.modules || [];
  const currentModuleIndex = moduleId - 1;
  const hasNextModule = currentModuleIndex < modules.length - 1;
  const hasPrevModule = currentModuleIndex > 0;
  const unlocked = currentUser ? hasCourseAccess(course.id) : false;

  // Paywall: module detail pages require purchase (course OR quarterly pass)
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <Header
          variant="course"
          backLink={{ href: `/courses/${courseId}`, text: "← Back to Course" }}
        />

        <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Unlock this module
            </h1>
            <p className="text-lg sm:text-xl text-[#a7a7a7] mb-8">
              Module detail pages (notes, activities, resources) are available after purchase.
            </p>

            {!currentUser && (
              <div className="mb-6 p-4 bg-[#1ed760]/10 border border-[#1ed760]/20 rounded-xl text-left">
                <p className="text-[#1ed760] font-semibold">Please sign in first.</p>
                <p className="text-[#b3b3b3] text-sm mt-1">
                  Purchases are tied to your account (stored locally on this device).
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Link href="/checkout?plan=pro" className="w-full">
                <Button variant="primary" size="md" className="w-full">
                  Get Pro Pass — $19/mo
                </Button>
              </Link>
              <Link href="/#pricing" className="w-full">
                <Button variant="secondary" size="md" className="w-full">
                  View All Plans
                </Button>
              </Link>
            </div>

            <div className="mt-8">
              <Link href={course.youtubeVideoUrl ?? `/courses/${courseId}`}>
                <Button variant="outline" size="md">
                  Watch the free video instead
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header
        variant="course"
        backLink={{ href: `/courses/${courseId}`, text: "← Back to Course" }}
      />

      {/* Module Header */}
      <section className="border-b border-[#282828] bg-gradient-to-r from-[#181818] to-[#121212]">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${course.bgGradient}`}>
                  <IconComponent className={`${course.iconColor} w-6 h-6`} />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{course.title}</h1>
                  <p className="text-[#b3b3b3]">Module {moduleId} of {modules.length}</p>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {courseModule.title}
              </h2>

              <p className="text-xl text-[#b3b3b3] mb-6">{courseModule.description}</p>

              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-2 px-3 py-1 bg-[#1ed760]/10 text-[#1ed760] rounded-full text-sm font-medium border border-[#1ed760]/20">
                  <Clock size={14} /> {courseModule.estimatedTime}
                </span>
                <span className="flex items-center gap-2 px-3 py-1 bg-[#1ed760]/10 text-[#1ed760] rounded-full text-sm font-medium border border-[#1ed760]/20">
                  <TargetIcon size={14} /> {courseModule.objectives.length} Objectives
                </span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Module Content */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Learning Objectives */}
          {courseModule.objectives.length > 0 && (
            <AnimatedSection delay={100}>
              <div className="mb-12">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Learning Objectives</h3>
                <ul className="space-y-3">
                  {courseModule.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-[#1ed760] rounded-full"></div>
                      </div>
                      <span className="text-lg text-[#b3b3b3]">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          )}

          {/* Main Content */}
          <AnimatedSection delay={200}>
            <div className="mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Module Content</h3>
              <div className="prose prose-invert prose-lg max-w-none">
                {courseModule.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-[#b3b3b3] leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Activities */}
          {courseModule.activities.length > 0 && (
            <AnimatedSection delay={300}>
              <div className="mb-12">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Practice Activities</h3>
                <div className="space-y-4">
                  {courseModule.activities.map((activity, index) => (
                    <div key={index} className="p-6 bg-[#181818] border border-[#282828] rounded-xl hover:border-[#1ed760]/50 transition-colors group">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-[#1ed760] rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-[#1ed760]/20">
                          <span className="text-black font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-2 group-hover:text-[#1ed760] transition-colors">Activity {index + 1}</h4>
                          <p className="text-[#b3b3b3] leading-relaxed">{activity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Resources */}
          {courseModule.resources.length > 0 && (
            <AnimatedSection delay={400}>
              <div className="mb-12">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">Resources & Downloads</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courseModule.resources.map((resource, index) => (
                    resource.url ? (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 border border-[#282828] bg-[#181818] rounded-xl hover:border-[#1ed760]/50 transition-all group hover:scale-[1.02] cursor-pointer pointer-events-auto"
                        style={{ pointerEvents: 'auto' }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#282828] rounded-lg flex items-center justify-center group-hover:bg-[#1ed760] transition-colors">
                            <FileText className="text-[#a7a7a7] group-hover:text-black w-5 h-5 transition-colors" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white group-hover:text-[#1ed760] transition-colors">{resource.name}</h4>
                            <p className="text-sm text-[#a7a7a7]">Download PDF</p>
                          </div>
                          <Download className="text-[#b3b3b3] group-hover:text-[#1ed760] w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </a>
                    ) : (
                      <details key={index} className="p-4 border border-[#282828] bg-[#181818] rounded-xl hover:border-[#1ed760]/50 transition-all group cursor-pointer pointer-events-auto" style={{ pointerEvents: 'auto' }}>
                        <summary className="flex items-center gap-3 list-none">
                          <div className="w-10 h-10 bg-[#282828] rounded-lg flex items-center justify-center group-hover:bg-[#1ed760] transition-colors">
                            <FileText className="text-[#a7a7a7] group-hover:text-black w-5 h-5 transition-colors" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white group-hover:text-[#1ed760] transition-colors">{resource.name}</h4>
                            <p className="text-sm text-[#a7a7a7]">Click to expand</p>
                          </div>
                          <span className="text-[#b3b3b3] group-hover:text-[#1ed760]">+</span>
                        </summary>
                        <p className="mt-4 text-sm text-[#a7a7a7] leading-relaxed">{resource.content}</p>
                      </details>
                    )
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Navigation */}
          <AnimatedSection delay={500}>
            <div className="border-t border-[#282828] pt-12">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {hasPrevModule && (
                    <Link href={`/courses/${courseId}/modules/${moduleId - 1}`} className="flex-1 sm:flex-none">
                      <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#282828] text-white font-bold rounded-full hover:bg-[#333] transition-all hover:scale-105">
                        <ChevronLeft size={20} /> Previous
                      </button>
                    </Link>
                  )}
                  {hasNextModule && (
                    <Link href={`/courses/${courseId}/modules/${moduleId + 1}`} className="flex-1 sm:flex-none">
                      <button className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition-all shadow-lg shadow-[#1ed760]/20">
                        Next <ChevronRight size={20} />
                      </button>
                    </Link>
                  )}
                </div>

                <Link href={`/courses/${courseId}`} className="w-full sm:w-auto text-center">
                  <span className="text-[#b3b3b3] hover:text-white transition-colors font-bold text-sm cursor-pointer underline-offset-4 hover:underline">
                    Back to Course Overview
                  </span>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}