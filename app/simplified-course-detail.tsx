"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Play, Clock, Users, Award, CheckCircle, BookOpen, Star, ChevronRight } from "lucide-react";
import { simplifiedCourses } from "./data/simplified-courses";

export default function SimplifiedCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeModule, setActiveModule] = useState(0);
  
  const course = simplifiedCourses.find(c => c.id === params.id);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Course Not Found</h1>
          <Link href="/" className="text-[#60a5fa] hover:text-white font-semibold transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#121212]">
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-white font-bold text-lg">{course.rating}</span>
                </div>
                <span className="text-[#b3b3b3]">({course.reviewCount} reviews)</span>
                <span className="text-[#b3b3b3]">•</span>
                <span className="text-[#b3b3b3]">{course.studentCount.toLocaleString()} students</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {course.title}
              </h1>
              
              <p className="text-xl text-[#b3b3b3] mb-6">
                {course.fullDescription}
              </p>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#60a5fa]" />
                  <span className="text-white">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#60a5fa]" />
                  <span className="text-white">{course.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#60a5fa]" />
                  <span className="text-white">Certificate</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#282828] rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#60a5fa]" />
                </div>
                <div>
                  <div className="text-white font-bold">{course.instructor}</div>
                  <div className="text-[#b3b3b3] text-sm">{course.instructorTitle}</div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="bg-[#60a5fa] text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1db954] transition-colors flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Start Learning
                </button>
                <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                  Preview Course
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {course.imageUrl ? (
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  width={800}
                  height={450}
                  className="object-cover w-full"
                />
              ) : (
                <div className={`w-full h-[450px] bg-gradient-to-br ${course.bgGradient} flex items-center justify-center`}>
                  <BookOpen className="text-white w-24 h-24" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <button className="w-20 h-20 bg-[#60a5fa] rounded-full flex items-center justify-center hover:bg-[#1db954] transition-colors">
                  <Play className="text-black w-8 h-8 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-12 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">What You&apos;ll Learn</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {course.outcomes.map((outcome, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#60a5fa] flex-shrink-0 mt-0.5" />
                <span className="text-[#b3b3b3]">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Modules */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Course Modules</h2>
          <div className="space-y-4">
            {course.modules.map((module, index) => (
              <div
                key={index}
                onClick={() => setActiveModule(index)}
                className={`bg-[#1a1a1a] rounded-xl p-6 cursor-pointer transition-all hover:bg-[#242424] ${
                  activeModule === index ? 'border-2 border-[#60a5fa]' : 'border border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activeModule === index ? 'bg-[#60a5fa]' : 'bg-[#282828]'
                    }`}>
                      <span className={`font-bold ${activeModule === index ? 'text-black' : 'text-white'}`}>
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{module}</h3>
                      <p className="text-[#b3b3b3] text-sm">45-60 minutes</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-[#b3b3b3] transition-transform ${
                    activeModule === index ? 'rotate-90 text-[#60a5fa]' : ''
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="py-12 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Your Instructor</h2>
          <div className="bg-[#1a1a1a] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-[#282828] rounded-full flex items-center justify-center flex-shrink-0">
              <Award className="w-12 h-12 text-[#60a5fa]" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">{course.instructor}</h3>
              <p className="text-[#60a5fa] mb-4">{course.instructorTitle}</p>
              <p className="text-[#b3b3b3]">
                Expert in their field with years of practical experience. Passionate about teaching and helping students achieve their goals.
              </p>
            </div>
            <div className="flex gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{course.rating}</div>
                <div className="text-[#b3b3b3] text-sm">Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{course.studentCount.toLocaleString()}</div>
                <div className="text-[#b3b3b3] text-sm">Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Learning?</h2>
          <p className="text-xl text-[#b3b3b3] mb-8">
            Join thousands of students who have transformed their skills with this course.
          </p>
          <button className="bg-[#60a5fa] text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-[#1db954] transition-colors">
            Enroll Now - ${course.priceUSD}
          </button>
        </div>
      </section>

      {/* Related Courses */}
      <section className="py-12 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Related Courses</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {simplifiedCourses
              .filter(c => c.id !== course.id)
              .slice(0, 3)
              .map((relatedCourse) => (
                <Link
                  key={relatedCourse.id}
                  href={`/courses/${relatedCourse.id}`}
                  className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#242424] transition-all"
                >
                  <div className="relative h-40">
                    {relatedCourse.imageUrl ? (
                      <Image
                        src={relatedCourse.imageUrl}
                        alt={relatedCourse.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${relatedCourse.bgGradient} flex items-center justify-center`}>
                        <BookOpen className="text-white w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold mb-2">{relatedCourse.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[#60a5fa] font-bold">${relatedCourse.priceUSD}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-[#b3b3b3] text-sm">{relatedCourse.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
