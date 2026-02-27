"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/UserContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import AnimatedSection from "../components/ui/AnimatedSection";
import Link from "next/link";

export default function ProfilePage() {
  const { currentUser, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAgePreferences = () => {
    const preferences = currentUser.preferences || {};
    return Object.entries(preferences)
      .filter(([key]) => key.includes('course-') && key.includes('-age'))
      .map(([key, value]) => ({
        course: key.replace('course-', '').replace('-age', ''),
        age: value as string
      }));
  };

  const agePreferences = getAgePreferences();

  return (
    <div className="min-h-screen bg-white">
      <Header variant="default" />

      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="mb-8 sm:mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-4">
                Your Profile
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600">
                Manage your account and learning preferences
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <AnimatedSection delay={100}>
              <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  Account Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Full Name
                    </label>
                    <p className="text-lg font-medium text-gray-900">{currentUser.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Email Address
                    </label>
                    <p className="text-lg font-medium text-gray-900">{currentUser.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                      Member Since
                    </label>
                    <p className="text-lg font-medium text-gray-900">
                      {formatDate(currentUser.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={logout}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </AnimatedSection>

            {/* Learning Preferences */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatedSection delay={200}>
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    Learning Preferences
                  </h2>

                  {agePreferences.length > 0 ? (
                    <div className="space-y-4">
                      <p className="text-gray-600 mb-4">
                        Your personalized age preferences for courses:
                      </p>
                      {agePreferences.map((pref) => (
                        <div key={pref.course} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <span className="font-semibold text-gray-900 capitalize">
                              {pref.course.replace('-', ' ')}
                            </span>
                            <span className="text-gray-600 ml-2">course</span>
                          </div>
                          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                            Ages {pref.age}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        No preferences set yet.
                      </p>
                      <Link href="/#courses">
                        <Button variant="primary" size="sm">
                          Explore Courses
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </AnimatedSection>

              {/* Quick Actions */}
              <AnimatedSection delay={300}>
                <div className="bg-gradient-to-r from-orange-50 to-orange-50 rounded-2xl p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    Quick Actions
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/#courses">
                      <Button variant="primary" size="md" className="w-full">
                        Browse Courses
                      </Button>
                    </Link>

                    <Link href="/about">
                      <Button variant="secondary" size="md" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}