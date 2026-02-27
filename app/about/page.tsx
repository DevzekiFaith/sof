"use client";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Button from "../components/ui/Button";
import AnimatedSection from "../components/ui/AnimatedSection";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="simple" />

      {/* About Content */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-gray-900 mb-8 sm:mb-12 leading-tight px-4">
              About Self-Pay
            </h1>
          </AnimatedSection>

          <div className="space-y-8 sm:space-y-12 px-4">
            <AnimatedSection delay={100}>
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Our Mission
                </h2>
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 leading-relaxed">
                  We empower individuals aged 10 to 45 with essential life and professional skills. Our mission is to provide practical, actionable education that transforms lives and careers. No fluff. No time-wasters. Just real knowledge that works.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
                  What We Do
                </h2>
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  Self-Pay offers comprehensive courses in capital development, persuasion, decision-making, teamwork, and more. Each program is carefully designed to be:
                </p>
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start gap-3 sm:gap-4 group">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">•</span>
                    <p className="text-xl sm:text-2xl text-gray-600"><strong className="text-gray-900">Accessible</strong> - Open to learners from age 10 to 45</p>
                  </li>
                  <li className="flex items-start gap-3 sm:gap-4 group">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">•</span>
                    <p className="text-xl sm:text-2xl text-gray-600"><strong className="text-gray-900">Actionable</strong> - Skills you can apply immediately</p>
                  </li>
                  <li className="flex items-start gap-3 sm:gap-4 group">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-300">•</span>
                    <p className="text-xl sm:text-2xl text-gray-600"><strong className="text-gray-900">Practical</strong> - Real-world applications, not theory</p>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={300}>
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Our Approach
                </h2>
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 leading-relaxed">
                  We believe in learning by doing. Our courses combine expert instruction with hands-on practice, ensuring you not only understand the concepts but can apply them confidently in your daily life and work.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Who We Serve
                </h2>
                <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 leading-relaxed">
                  Whether you&apos;re a student starting your journey, a professional looking to level up, or someone committed to continuous growth, Self-Pay has something for you. Our age-inclusive approach ensures everyone can benefit from our programs.
                </p>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={500}>
            <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t-2 border-gray-200 px-4">
              <Link href="/">
                <Button variant="primary" size="md">
                  Explore Our Courses
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

