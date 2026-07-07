import React from "react";
import { Zap, Target, Users, TrendingUp, Heart, MessageSquare } from "lucide-react";

export interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  ageRange: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgGradient: string;
  imageUrl?: string;
  featured?: boolean;
  duration: string;
  priceUSD: number;
  instructor: string;
  instructorTitle: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  level: string;
  modules: string[];
  outcomes: string[];
}

export const simplifiedCourses: Course[] = [
  {
    id: "problem-solving",
    title: "8 Ways to Develop Solution Mindset",
    description: "Develop a systematic approach to solving problems creatively and effectively.",
    fullDescription: "Problem solving is at the heart of success in every field. This course teaches you to approach problems systematically, think critically, and develop creative solutions.",
    ageRange: "12-45",
    icon: Zap,
    iconColor: "text-[#60a5fa]",
    bgGradient: "from-[#60a5fa]/30 to-[#121212]",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    featured: true,
    duration: "5 weeks",
    priceUSD: 14,
    instructor: "Prof. James Wilson",
    instructorTitle: "Oxford Philosophy Professor",
    rating: 4.7,
    reviewCount: 892,
    studentCount: 5621,
    level: "Intermediate",
    modules: [
      "Problem Solving Fundamentals",
      "Critical Thinking Skills",
      "Analytical Frameworks",
      "Creative Problem Solving",
      "Decision Making Tools",
      "Overcoming Mental Blocks",
      "Collaborative Problem Solving",
      "Real-World Applications"
    ],
    outcomes: [
      "Approach problems systematically",
      "Think critically and analytically",
      "Generate creative solutions",
      "Make better decisions under pressure",
      "Solve complex real-world problems"
    ]
  },
  {
    id: "decision-making",
    title: "9 Ways to Master Decision-Making",
    description: "Develop critical thinking skills and frameworks for making better decisions under pressure.",
    fullDescription: "Every day, we make countless decisions that shape our lives. This course provides you with proven frameworks and tools to make better decisions, especially under pressure.",
    ageRange: "12-45",
    icon: Target,
    iconColor: "text-[#60a5fa]",
    bgGradient: "from-[#60a5fa]/30 to-[#121212]",
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    featured: false,
    duration: "5 weeks",
    priceUSD: 14,
    instructor: "Dr. Sarah Mitchell",
    instructorTitle: "Former Harrow Housemistress",
    rating: 4.6,
    reviewCount: 723,
    studentCount: 4231,
    level: "Intermediate",
    modules: [
      "Decision-Making Fundamentals",
      "Critical Thinking Skills",
      "Information Gathering",
      "Analysis Frameworks",
      "Risk Assessment",
      "Decision Implementation",
      "Learning from Outcomes",
      "Advanced Techniques"
    ],
    outcomes: [
      "Make faster, better decisions",
      "Reduce decision fatigue",
      "Handle pressure effectively",
      "Learn from past decisions",
      "Build confidence in your choices"
    ]
  },
  {
    id: "team-person",
    title: "8 Ways to Excel as a Team Person",
    description: "Learn the fundamentals of teamwork: communication, trust, accountability, and collaboration.",
    fullDescription: "Teamwork is a life skill. In this course, you'll learn how to communicate clearly, collaborate effectively, handle conflict, and build trust.",
    ageRange: "10-45",
    icon: Users,
    iconColor: "text-[#60a5fa]",
    bgGradient: "from-[#60a5fa]/30 to-[#121212]",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    featured: false,
    duration: "4 weeks",
    priceUSD: 14,
    instructor: "Dr. Sarah Mitchell",
    instructorTitle: "Former Harrow Housemistress",
    rating: 4.8,
    reviewCount: 654,
    studentCount: 3892,
    level: "Beginner",
    modules: [
      "Team Fundamentals",
      "Communication in Teams",
      "Building Trust",
      "Conflict Resolution",
      "Accountability",
      "Collaboration Skills",
      "Leadership Basics",
      "Team Success"
    ],
    outcomes: [
      "Communicate effectively in teams",
      "Build trust with team members",
      "Handle conflict constructively",
      "Take accountability for actions",
      "Collaborate successfully"
    ]
  },
  {
    id: "personal-adaptability",
    title: "8 Ways to Build Personal Adaptability",
    description: "Learn the fundamentals of adapting to change: resilience, flexible thinking, and steady progress.",
    fullDescription: "Change is guaranteed. This course teaches the fundamentals of adaptability—how to stay calm, adjust quickly, and keep moving forward.",
    ageRange: "10-45",
    icon: TrendingUp,
    iconColor: "text-[#60a5fa]",
    bgGradient: "from-[#60a5fa]/30 to-[#121212]",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
    featured: false,
    duration: "4 weeks",
    priceUSD: 14,
    instructor: "Dr. Sarah Mitchell",
    instructorTitle: "Former Harrow Housemistress",
    rating: 4.5,
    reviewCount: 521,
    studentCount: 2987,
    level: "Beginner",
    modules: [
      "Understanding Change",
      "Building Resilience",
      "Flexible Thinking",
      "Emotional Regulation",
      "Growth Mindset",
      "Continuous Learning",
      "Steady Progress",
      "Adapting Successfully"
    ],
    outcomes: [
      "Adapt to change more easily",
      "Build personal resilience",
      "Think flexibly",
      "Regulate emotions under stress",
      "Maintain steady progress"
    ]
  },
  {
    id: "self-image",
    title: "8 Ways to Strengthen Self-Image",
    description: "Build a strong self-image: confidence, identity, and the fundamentals of self-belief.",
    fullDescription: "Self-image shapes decisions, habits, and outcomes. This course teaches the fundamentals of self-image, confidence, and self-belief.",
    ageRange: "10-45",
    icon: Heart,
    iconColor: "text-[#60a5fa]",
    bgGradient: "from-[#60a5fa]/30 to-[#121212]",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    featured: false,
    duration: "4 weeks",
    priceUSD: 14,
    instructor: "Dr. Sarah Mitchell",
    instructorTitle: "Former Harrow Housemistress",
    rating: 4.9,
    reviewCount: 892,
    studentCount: 5123,
    level: "Beginner",
    modules: [
      "Understanding Self-Image",
      "Building Confidence",
      "Identity Formation",
      "Self-Belief Fundamentals",
      "Positive Self-Talk",
      "Overcoming Self-Doubt",
      "Personal Values",
      "Strong Self-Image"
    ],
    outcomes: [
      "Build lasting confidence",
      "Develop strong self-belief",
      "Understand your identity",
      "Overcome self-doubt",
      "Maintain positive self-image"
    ]
  },
  {
    id: "communication",
    title: "8 Ways to Improve Communication",
    description: "Learn communication fundamentals: clarity, listening, confidence, and influence.",
    fullDescription: "Communication is the universal skill. This course teaches fundamentals—speaking clearly, listening deeply, and expressing ideas with confidence.",
    ageRange: "10-45",
    icon: MessageSquare,
    iconColor: "text-[#60a5fa]",
    bgGradient: "from-[#60a5fa]/30 to-[#121212]",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
    featured: false,
    duration: "4 weeks",
    priceUSD: 14,
    instructor: "Dr. Sarah Mitchell",
    instructorTitle: "Former Harrow Housemistress",
    rating: 4.7,
    reviewCount: 756,
    studentCount: 4456,
    level: "Beginner",
    modules: [
      "Communication Fundamentals",
      "Active Listening",
      "Clear Speaking",
      "Non-Verbal Communication",
      "Confidence Building",
      "Persuasion Skills",
      "Digital Communication",
      "Effective Influence"
    ],
    outcomes: [
      "Speak clearly and confidently",
      "Listen actively and deeply",
      "Understand non-verbal cues",
      "Persuade effectively",
      "Communicate in any setting"
    ]
  }
];
