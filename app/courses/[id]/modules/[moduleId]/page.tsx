"use client";

import { useParams, useRouter } from "next/navigation";
import { getCourseById, ModuleDetail } from "../../../../data/courses";
import { useState } from "react";
import Header from "../../../../components/layout/Header";
import Footer from "../../../../components/layout/Footer";
import Button from "../../../../components/ui/Button";
import AnimatedSection from "../../../../components/ui/AnimatedSection";
import Link from "next/link";
import { useUser } from "../../../../contexts/UserContext";
import PurchaseModal from "../../../../components/ui/PurchaseModal";
import { QUARTERLY_PASS_PRICE_USD } from "../../../../data/courses";

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter(); // @ts-ignore
  const courseId = params.id as string;
  const moduleId = parseInt(params.moduleId as string);
  const { currentUser, hasCourseAccess } = useUser();
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [purchaseMode, setPurchaseMode] = useState<"course" | "quarterly">("course");

  const course = getCourseById(courseId);

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

  // Check if moduleId is valid
  if (!moduleId || isNaN(moduleId) || moduleId < 1) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Invalid Module</h1>
          <Link href={`/courses/${courseId}`} className="text-amber-600 hover:text-orange-700 font-semibold">
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Course Content Loading</h1>
          <p className="text-gray-600 mb-4">The detailed modules for this course are being prepared.</p>
          <Link href={`/courses/${courseId}`} className="text-amber-600 hover:text-orange-700 font-semibold">
            Return to Course Overview
          </Link>
        </div>
      </div>
    );
  }

  if (moduleId > totalModules) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Module Not Available</h1>
          <p className="text-gray-600 mb-4">This module number exceeds the total modules in this course.</p>
          <Link href={`/courses/${courseId}`} className="text-amber-600 hover:text-orange-700 font-semibold">
            Return to Course
          </Link>
        </div>
      </div>
    );
  }

  const courseModule: ModuleDetail | undefined = course?.detailedModules?.[moduleId - 1];

  if (!courseModule) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Module Not Found</h1>
          <p className="text-gray-600 mb-4">This module is currently being developed.</p>
          <Link href={`/courses/${courseId}`} className="text-amber-600 hover:text-orange-700 font-semibold">
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
  const coursePrice = course.priceUSD ?? 14;

  // Paywall: module detail pages require purchase (course OR quarterly pass)
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-white">
        <Header
          variant="course"
          backLink={{ href: `/courses/${courseId}`, text: "← Back to Course" }}
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

        <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Unlock this module
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Module detail pages (notes, activities, resources) are available after purchase.
            </p>

            {!currentUser && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-left">
                <p className="text-yellow-900 font-semibold">Please sign in first.</p>
                <p className="text-yellow-800 text-sm mt-1">
                  Purchases are tied to your account (stored locally on this device).
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    <div className="min-h-screen bg-white">
      <Header
        variant="course"
        backLink={{ href: `/courses/${courseId}`, text: "← Back to Course" }}
      />

      {/* Module Header */}
      <section className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${course.bgGradient}`}>
                  <IconComponent className={`${course.iconColor} w-6 h-6`} />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{course.title}</h1>
                  <p className="text-gray-600">Module {moduleId} of {modules.length}</p>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                {courseModule.title}
              </h2>

              <p className="text-xl text-gray-600 mb-6">{courseModule.description}</p>

              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  📚 {courseModule.estimatedTime}
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  🎯 {courseModule.objectives.length} Learning Objectives
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
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Learning Objectives</h3>
                <ul className="space-y-3">
                  {courseModule.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-lg text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          )}

          {/* Main Content */}
          <AnimatedSection delay={200}>
            <div className="mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Module Content</h3>
              <div className="prose prose-lg max-w-none">
                {courseModule.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
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
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Practice Activities</h3>
                <div className="space-y-4">
                  {courseModule.activities.map((activity, index) => (
                    <div key={index} className="p-6 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-orange-900 mb-2">Activity {index + 1}</h4>
                          <p className="text-orange-800">{activity}</p>
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
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Resources & Downloads</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {courseModule.resources.map((resource, index) => (
                    <div key={index} className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-600">📄</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{resource}</h4>
                          <p className="text-sm text-gray-600">Download available</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Navigation */}
          <AnimatedSection delay={500}>
            <div className="border-t-2 border-gray-200 pt-8">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-4">
                  {hasPrevModule && (
                    <Link href={`/courses/${courseId}/modules/${moduleId - 1}`}>
                      <Button variant="secondary" size="md">
                        ← Previous Module
                      </Button>
                    </Link>
                  )}
                  {hasNextModule && (
                    <Link href={`/courses/${courseId}/modules/${moduleId + 1}`}>
                      <Button variant="primary" size="md">
                        Next Module →
                      </Button>
                    </Link>
                  )}
                </div>

                <Link href={`/courses/${courseId}`}>
                  <Button variant="outline" size="md">
                    Back to Course Overview
                  </Button>
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