"use client";

import React from "react";
import { Sparkles, Clock, User, ArrowRight, CheckCircle, BookOpen, PlayCircle, ChevronRight, DollarSign, Mic, Crown } from "lucide-react";
import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import { supabase } from "../../../lib/supabase";
import { useRouter, useParams } from "next/navigation";

const challengeCourses = [
  {
    id: "financial-literacy",
    title: "Financial Literacy for Teens",
    description: "Understand money, investing and wealth-building the way elite school graduates do. Build your financial foundations before you turn 18.",
    level: "Challenge",
    levelColor: "#F5C518",
    duration: "4 weeks",
    ageRange: "Ages 13–18",
    priceUSD: 99,
    priceNGN: 148500,
    icon: DollarSign,
    lessons: [
      {
        id: 1,
        title: "Earning Money: The Foundation",
        description: "Learn how to earn money before you can save. Discover income sources for teens and build your first revenue stream.",
        duration: "45 min",
        type: "video",
        objectives: ["Identify teen-friendly income opportunities", "Understand the value of earning early", "Create your first income plan"]
      },
      {
        id: 2,
        title: "High Income Skills Development",
        description: "Master skills that command premium pay. Learn what high-income skills are and how to develop them as a teenager.",
        duration: "50 min",
        type: "interactive",
        objectives: ["Identify high-income skills", "Create a skill development roadmap", "Start learning a marketable skill"]
      },
      {
        id: 3,
        title: "High Income Career Planning",
        description: "Plan for a lucrative career. Understand high-paying career paths and how to position yourself for success.",
        duration: "60 min",
        type: "video",
        objectives: ["Research high-income careers", "Understand career requirements", "Create a long-term career plan"]
      },
      {
        id: 4,
        title: "High Income Leverage",
        description: "Learn to leverage your time, money, and skills to multiply your income. Understand the power of leverage in wealth building.",
        duration: "55 min",
        type: "interactive",
        objectives: ["Understand different types of leverage", "Apply leverage to increase income", "Build systems that scale"]
      },
      {
        id: 5,
        title: "Banking & Saving Strategies",
        description: "Master the art of saving, understand banking systems, and build your emergency fund.",
        duration: "50 min",
        type: "interactive",
        objectives: ["Open and manage bank accounts", "Understand interest rates", "Build an emergency fund"]
      },
      {
        id: 6,
        title: "Investing Fundamentals",
        description: "Learn the basics of stocks, bonds, and compound interest. Start building wealth early.",
        duration: "60 min",
        type: "video",
        objectives: ["Understand investment vehicles", "Learn about compound interest", "Create an investment plan"]
      },
      {
        id: 7,
        title: "Entrepreneurship & Side Hustles",
        description: "Discover how to start your own business or side hustle as a teenager.",
        duration: "55 min",
        type: "project",
        objectives: ["Identify business opportunities", "Create a business plan", "Launch a mini venture"]
      },
      {
        id: 8,
        title: "Financial Literacy Assessment",
        description: "Test your knowledge and earn your Financial Literacy Certificate.",
        duration: "30 min",
        type: "quiz",
        objectives: ["Demonstrate financial knowledge", "Apply concepts to scenarios", "Earn certification"]
      }
    ]
  },
  {
    id: "public-speaking",
    title: "Public Speaking Masterclass",
    description: "Learn to speak with authority, persuade any audience, and own any room. Taught to the standard of Eton's debating societies.",
    level: "Expert",
    levelColor: "#EF4444",
    duration: "4 weeks",
    ageRange: "Ages 10–18",
    priceUSD: 149,
    priceNGN: 223500,
    icon: Mic,
    lessons: [
      {
        id: 1,
        title: "The Art of Persuasion",
        description: "Master rhetorical devices and persuasion techniques used by world leaders.",
        duration: "50 min",
        type: "video",
        objectives: ["Understand rhetorical devices", "Practice persuasion techniques", "Analyze famous speeches"]
      },
      {
        id: 2,
        title: "Voice & Body Language",
        description: "Command attention through powerful voice projection and confident body language.",
        duration: "45 min",
        type: "interactive",
        objectives: ["Master voice projection", "Improve body language", "Build stage presence"]
      },
      {
        id: 3,
        title: "Impromptu Speaking",
        description: "Think on your feet and deliver compelling speeches without preparation.",
        duration: "60 min",
        type: "interactive",
        objectives: ["Practice quick thinking", "Structure impromptu speeches", "Handle unexpected questions"]
      },
      {
        id: 4,
        title: "Debate & Argumentation",
        description: "Learn to construct and defend arguments like Eton debaters.",
        duration: "55 min",
        type: "project",
        objectives: ["Build logical arguments", "Practice rebuttal techniques", "Participate in debates"]
      },
      {
        id: 5,
        title: "Final Speech Showcase",
        description: "Deliver a polished speech and receive expert feedback.",
        duration: "90 min",
        type: "project",
        objectives: ["Deliver a complete speech", "Receive expert feedback", "Demonstrate mastery"]
      }
    ]
  },
  {
    id: "leadership-pressure",
    title: "Leadership Under Pressure",
    description: "How do you lead when everything is going wrong? Study real case studies from military leaders, CEOs and heads of state.",
    level: "Expert",
    levelColor: "#EF4444",
    duration: "4 weeks",
    ageRange: "Ages 14–18",
    priceUSD: 149,
    priceNGN: 223500,
    icon: Crown,
    lessons: [
      {
        id: 1,
        title: "Crisis Leadership Fundamentals",
        description: "Study how great leaders navigate crises and make decisions under extreme pressure.",
        duration: "55 min",
        type: "video",
        objectives: ["Analyze crisis leadership", "Understand decision frameworks", "Study historical case studies"]
      },
      {
        id: 2,
        title: "Military Leadership Case Studies",
        description: "Learn from military commanders who led troops through impossible situations.",
        duration: "60 min",
        type: "video",
        objectives: ["Study military leadership", "Understand chain of command", "Apply lessons to civilian life"]
      },
      {
        id: 3,
        title: "CEO Crisis Management",
        description: "Examine how CEOs handle company crises and turn disasters into opportunities.",
        duration: "50 min",
        type: "interactive",
        objectives: ["Analyze business crises", "Develop crisis strategies", "Practice decision-making"]
      },
      {
        id: 4,
        title: "Leadership Simulation",
        description: "Navigate a simulated crisis scenario and make real leadership decisions.",
        duration: "90 min",
        type: "interactive",
        objectives: ["Apply leadership principles", "Make decisions under pressure", "Reflect on outcomes"]
      },
      {
        id: 5,
        title: "Leadership Capstone Project",
        description: "Create and present your own crisis leadership plan.",
        duration: "2 weeks",
        type: "project",
        objectives: ["Develop a leadership plan", "Present to experts", "Demonstrate crisis leadership skills"]
      }
    ]
  },
];

export default function ChallengePage() {
  const params = useParams();
  const { currentUser } = useUser();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const [enrolledChallenges, setEnrolledChallenges] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  const selectedCourse = challengeCourses.find(c => c.id === params.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !currentUser) return;

    const fetchEnrollments = async () => {
      const { data } = await supabase
        .from('challenge_enrollments')
        .select('challenge_id')
        .eq('user_id', currentUser.id);
      if (data) {
        setEnrolledChallenges(data.map(e => e.challenge_id));
      }
    };

    fetchEnrollments();

    const subscription = supabase
      .channel('challenge_enrollments_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenge_enrollments', filter: `user_id=eq.${currentUser.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setEnrolledChallenges(prev => [...prev, payload.new.challenge_id]);
        } else if (payload.eventType === 'DELETE') {
          setEnrolledChallenges(prev => prev.filter(id => id !== payload.old.challenge_id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [mounted, currentUser]);

  const isEnrolled = (courseId: string) => enrolledChallenges.includes(courseId);

  const handleEnroll = async (course: any) => {
    if (!currentUser) {
      showToast("Please sign in to enroll in this challenge", "error");
      return;
    }

    addToCart({
      id: course.id,
      title: course.title,
      priceUSD: course.priceUSD,
      description: course.description,
      fullDescription: course.description,
      ageRange: course.ageRange,
      duration: course.duration,
      icon: BookOpen,
      iconColor: course.levelColor,
      bgGradient: 'from-gray-800 to-gray-900',
    });

    const { error } = await supabase
      .from('challenge_enrollments')
      .insert({
        user_id: currentUser.id,
        challenge_id: course.id,
        challenge_title: course.title,
        status: 'enrolled',
      });

    if (error) {
      showToast("Failed to enroll. Please try again.", "error");
    } else {
      setEnrolledChallenges(prev => [...prev, course.id]);
      showToast("Course added to cart! Complete checkout to begin.", "success");
    }
  };

  const handleStartLesson = (lessonId: number) => {
    router.push(`/challenge/${selectedCourse?.id}/lesson/${lessonId}`);
  };

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Challenge not found</h1>
          <button onClick={() => router.push('/')} className="text-[#1ed760] hover:underline">
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 sm:p-8">
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-2 text-sm text-[#b3b3b3] hover:text-white mb-6"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        Back to Home
      </button>

      <div className="bg-[#181818] p-6 rounded-lg max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <selectedCourse.icon className="w-12 h-12 text-[#1ed760]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">●</span>
                <span className="text-base font-bold" style={{ color: selectedCourse.levelColor }}>
                  {selectedCourse.level}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{selectedCourse.title}</h1>
              <p className="text-sm text-[#b3b3b3]">{selectedCourse.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#b3b3b3]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {selectedCourse.duration}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {selectedCourse.ageRange}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {selectedCourse.lessons.length} lessons
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {selectedCourse.lessons.map((lesson: any, index: number) => (
            <div
              key={lesson.id}
              className={`p-4 bg-[#282828] rounded-lg border border-[#3a3a3a] hover:border-[#1ed760]/30 transition-all cursor-pointer ${
                isEnrolled(selectedCourse.id) ? '' : 'opacity-50'
              }`}
              onClick={() => isEnrolled(selectedCourse.id) && handleStartLesson(lesson.id)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  lesson.type === 'video' ? 'bg-blue-500/20' :
                  lesson.type === 'interactive' ? 'bg-green-500/20' :
                  lesson.type === 'quiz' ? 'bg-purple-500/20' : 'bg-orange-500/20'
                }`}>
                  {lesson.type === 'video' ? <PlayCircle className="w-5 h-5 text-blue-400" /> :
                   lesson.type === 'interactive' ? <BookOpen className="w-5 h-5 text-green-400" /> :
                   lesson.type === 'quiz' ? <CheckCircle className="w-5 h-5 text-purple-400" /> :
                   <Sparkles className="w-5 h-5 text-orange-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h5 className="text-sm font-bold text-white mb-1">Lesson {index + 1}: {lesson.title}</h5>
                      <p className="text-xs text-[#b3b3b3]">{lesson.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-[#b3b3b3] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.duration}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      lesson.type === 'video' ? 'bg-blue-500/20 text-blue-400' :
                      lesson.type === 'interactive' ? 'bg-green-500/20 text-green-400' :
                      lesson.type === 'quiz' ? 'bg-purple-500/20 text-purple-400' : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {lesson.type}
                    </span>
                  </div>
                  {isEnrolled(selectedCourse.id) && (
                    <div className="mt-3 pt-3 border-t border-[#3a3a3a]">
                      <p className="text-xs text-[#b3b3b3] mb-2">Learning Objectives:</p>
                      <ul className="space-y-1">
                        {lesson.objectives.map((obj: string, i: number) => (
                          <li key={i} className="text-xs text-[#b3b3b3] flex items-start gap-2">
                            <span className="text-[#1ed760]">•</span>
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!isEnrolled(selectedCourse.id) && (
          <div className="mt-6 p-4 bg-gradient-to-r from-[#1ed760]/10 to-[#1ed760]/5 rounded-xl border border-[#1ed760]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#b3b3b3] mb-1">Course Price</p>
                <p className="text-2xl font-bold text-white">${selectedCourse.priceUSD}</p>
                <p className="text-sm text-[#b3b3b3]">₦{selectedCourse.priceNGN.toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleEnroll(selectedCourse)}
                className="px-6 py-3 bg-[#1ed760] text-black rounded-full font-bold hover:scale-105 transition-all"
              >
                Enroll Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
