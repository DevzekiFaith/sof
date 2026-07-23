"use client";

import Link from "next/link";
import Image from "next/image";
import { Zap, Target, Users, TrendingUp, Heart, MessageSquare, Play, ArrowRight, BookOpen, Award, Clock, Star, Calendar } from "lucide-react";
import { simplifiedCourses } from "./data/simplified-courses";

export default function SimplifiedHomePage() {

  const iconMap: Record<string, React.ElementType> = {
    "problem-solving": Zap,
    "decision-making": Target,
    "team-person": Users,
    "personal-adaptability": TrendingUp,
    "self-image": Heart,
    "communication": MessageSquare,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#121212]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Master Life&apos;s Essential Skills
          </h2>
          <p className="text-xl text-[#b3b3b3] max-w-2xl mx-auto mb-8">
            Six universal courses designed to transform how you think, decide, communicate, and succeed. Personalized learning like your favorite music.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#60a5fa] text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-[#1db954] transition-colors flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Start Learning
            </button>
            <button className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
              View All Courses
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-[#60a5fa]">6</div>
            <div className="text-[#b3b3b3]">Core Masterclasses</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#60a5fa]">100%</div>
            <div className="text-[#b3b3b3]">Practical Frameworks</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#60a5fa]">4.9★</div>
            <div className="text-[#b3b3b3]">Cohort Rating</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#60a5fa]">Self-Paced</div>
            <div className="text-[#b3b3b3]">& Live Strategy</div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Our Six Universal Courses</h3>
            <p className="text-[#b3b3b3] max-w-2xl mx-auto">
              Each course is designed to build essential life skills that apply across all ages and situations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {simplifiedCourses.map((course) => {
              const Icon = iconMap[course.id];
              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group bg-[#1a1a1a] rounded-2xl overflow-hidden hover:bg-[#242424] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#60a5fa]/10"
                >
                  <div className="relative h-48 overflow-hidden">
                    {course.imageUrl ? (
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${course.bgGradient} flex items-center justify-center`}>
                        <Icon className="text-white w-16 h-16" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white text-sm font-bold">{course.rating}</span>
                        </div>
                        <span className="text-[#b3b3b3] text-sm">({course.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#60a5fa] transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-[#b3b3b3] text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-[#b3b3b3] mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.studentCount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#282828] rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-[#60a5fa]" />
                        </div>
                        <div>
                          <div className="text-white text-xs font-medium">{course.instructor}</div>
                          <div className="text-[#b3b3b3] text-xs">{course.instructorTitle}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[#60a5fa] font-bold group-hover:gap-3 transition-all">
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

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Why Choose Origin?</h3>
            <p className="text-[#b3b3b3] max-w-2xl mx-auto">
              Our courses are designed by experts and proven to work in real life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1a1a1a] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[#60a5fa]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-[#60a5fa] w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Expert-Designed</h4>
              <p className="text-[#b3b3b3]">Courses created by professors and industry leaders with proven track records.</p>
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[#60a5fa]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-[#60a5fa] w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Practical Skills</h4>
              <p className="text-[#b3b3b3]">Learn skills you can apply immediately in school, work, and life.</p>
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-[#60a5fa]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-[#60a5fa] w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Community Support</h4>
              <p className="text-[#b3b3b3]">Join thousands of learners on the same journey of growth and development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">Upcoming Events</h3>
              <p className="text-[#b3b3b3]">Join live sessions with our expert instructors</p>
            </div>
            <Link href="/events" className="flex items-center gap-2 text-[#60a5fa] hover:text-white transition-colors font-medium">
              View All Events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#242424] transition-all group">
              <div className="relative h-40">
                <Image
                  src="/jumpstart_cover.png"
                  alt="JUMPSTART Accelerator Program"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                  Accelerator
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-white font-bold mb-2">JUMPSTART Accelerator</h4>
                <div className="flex items-center gap-2 text-sm text-[#b3b3b3] mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>August 15 – September 5, 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold">$15.00</span>
                  <Link href="/store/17" className="bg-[#60a5fa] text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-[#3b82f6] transition-colors">
                    Enroll
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#242424] transition-all group">
              <div className="relative h-40">
                <Image
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80"
                  alt="Communication Workshop"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#60a5fa] text-black px-2 py-1 rounded-full text-xs font-bold">
                  Workshop
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-white font-bold mb-2">Communication Skills Workshop</h4>
                <div className="flex items-center gap-2 text-sm text-[#b3b3b3] mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>August 22, 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold">$29.99</span>
                  <button className="bg-[#60a5fa] text-black px-4 py-1 rounded-full text-sm font-bold hover:bg-[#1db954] transition-colors">
                    Register
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#242424] transition-all group">
              <div className="relative h-40">
                <Image
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80"
                  alt="Decision Making Webinar"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#60a5fa] text-black px-2 py-1 rounded-full text-xs font-bold">
                  Webinar
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-white font-bold mb-2">Decision Making Webinar</h4>
                <div className="flex items-center gap-2 text-sm text-[#b3b3b3] mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>August 29, 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold">$19.99</span>
                  <button className="bg-[#60a5fa] text-black px-4 py-1 rounded-full text-sm font-bold hover:bg-[#1db954] transition-colors">
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">Featured Products</h3>
              <p className="text-[#b3b3b3]">Books, journals, and merchandise to support your journey</p>
            </div>
            <Link href="/store" className="flex items-center gap-2 text-[#60a5fa] hover:text-white transition-colors font-medium">
              Visit Store
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#242424] transition-all group">
              <div className="relative h-40">
                <Image
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80"
                  alt="Origin Journal"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h4 className="text-white font-bold mb-2 text-sm">Origin Journal</h4>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold">$24.99</span>
                  <button className="bg-[#60a5fa] text-black px-3 py-1 rounded-full text-xs font-bold hover:bg-[#1db954] transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#242424] transition-all group">
              <div className="relative h-40">
                <Image
                  src="/cover_money_farming.png"
                  alt="MONEY FARMING eBook"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h4 className="text-white font-bold mb-2 text-sm">MONEY FARMING</h4>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold">$4.06</span>
                  <button className="bg-[#60a5fa] text-black px-3 py-1 rounded-full text-xs font-bold hover:bg-[#1db954] transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#242424] transition-all group">
              <div className="relative h-40">
                <Image
                  src="/origin_merch_collection.png"
                  alt="Origin Apparel & Gifts"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h4 className="text-white font-bold mb-2 text-sm">Origin Apparel & Gifts</h4>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold">From $14.99</span>
                  <Link href="/store?category=merch" className="bg-[#60a5fa] text-black px-3 py-1 rounded-full text-xs font-bold hover:bg-[#3b82f6] transition-colors">
                    Explore
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#242424] transition-all group">
              <div className="relative h-40">
                <Image
                  src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400&q=80"
                  alt="Life Design Planner"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h4 className="text-white font-bold mb-2 text-sm">Life Design Planner</h4>
                <div className="flex items-center justify-between">
                  <span className="text-[#60a5fa] font-bold">$29.99</span>
                  <button className="bg-[#60a5fa] text-black px-3 py-1 rounded-full text-xs font-bold hover:bg-[#1db954] transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Skills?</h3>
          <p className="text-xl text-[#b3b3b3] mb-8">
            Join over 25,000 students who have already started their journey with Origin.
          </p>
          <button className="bg-[#60a5fa] text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-[#1db954] transition-colors">
            Start Your Journey Today
          </button>
        </div>
      </section>
    </div>
  );
}
