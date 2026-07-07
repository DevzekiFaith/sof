"use client";

import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { Star, TrendingUp, Award, Target, BookOpen, CheckCircle, Lock } from "lucide-react";
import Link from "next/link";

export default function SkillsPage() {
  const { currentUser } = useUser();
  const [skills] = useState<Array<{
    id: string;
    title: string;
    level: number;
    maxLevel: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    description: string;
    progress: number;
    achievements: string[];
    nextAchievement: string;
    unlocked: boolean;
  }>>([
    {
      id: "leadership",
      title: "Leadership",
      level: 3,
      maxLevel: 5,
      icon: Star,
      color: "#F97316",
      description: "Ability to guide and inspire others",
      progress: 60,
      achievements: ["First Team Lead", "Conflict Resolver"],
      nextAchievement: "Strategic Visionary",
      unlocked: true
    },
    {
      id: "communication",
      title: "Communication",
      level: 2,
      maxLevel: 5,
      icon: BookOpen,
      color: "#3B82F6",
      description: "Effective verbal and written expression",
      progress: 40,
      achievements: ["Public Speaker"],
      nextAchievement: "Master Debater",
      unlocked: true
    },
    {
      id: "critical-thinking",
      title: "Critical Thinking",
      level: 1,
      maxLevel: 5,
      icon: Target,
      color: "#10B981",
      description: "Analytical reasoning and problem solving",
      progress: 20,
      achievements: [],
      nextAchievement: "Logic Master",
      unlocked: true
    },
    {
      id: "emotional-intelligence",
      title: "Emotional Intelligence",
      level: 0,
      maxLevel: 5,
      icon: Award,
      color: "#8B5CF6",
      description: "Self-awareness and empathy",
      progress: 0,
      achievements: [],
      nextAchievement: "Empathy Builder",
      unlocked: false
    },
    {
      id: "strategic-planning",
      title: "Strategic Planning",
      level: 0,
      maxLevel: 5,
      icon: TrendingUp,
      color: "#EC4899",
      description: "Long-term vision and execution",
      progress: 0,
      achievements: [],
      nextAchievement: "Visionary Leader",
      unlocked: false
    }
  ]);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 sm:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">Your Skills</h1>
          <p className="text-sm text-[#b3b3b3]">
            Track your progress and unlock achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => {
            const Icon = skill.icon;
            
            return (
              <div
                key={skill.id}
                className={`bg-[#181818] rounded-xl border ${
                  skill.unlocked ? 'border-[#282828] hover:border-[#60a5fa]/30' : 'border-[#282828] opacity-60'
                } transition-all duration-300 overflow-hidden group`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${skill.color}20` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: skill.color }} />
                    </div>
                    {!skill.unlocked && (
                      <Lock className="w-5 h-5 text-[#b3b3b3]" />
                    )}
                  </div>

                  <h3 className="font-bold text-white text-lg mb-1">{skill.title}</h3>
                  <p className="text-sm text-[#b3b3b3] mb-4 line-clamp-2">{skill.description}</p>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-[#b3b3b3] mb-2">
                      <span>Level {skill.level}/{skill.maxLevel}</span>
                      <span>{skill.progress}%</span>
                    </div>
                    <div className="w-full bg-[#282828] rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${skill.progress}%`,
                          backgroundColor: skill.color
                        }}
                      />
                    </div>
                  </div>

                  {skill.achievements.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-[#b3b3b3] mb-2">Achievements</p>
                      <div className="flex flex-wrap gap-2">
                        {skill.achievements.map((achievement: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#282828] rounded-full text-xs text-[#60a5fa] flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            {achievement}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {skill.nextAchievement && (
                    <div className="p-3 bg-[#282828]/50 rounded-lg">
                      <p className="text-xs text-[#b3b3b3]">Next: {skill.nextAchievement}</p>
                    </div>
                  )}
                </div>

                {skill.unlocked && (
                  <div className="px-6 pb-6">
                    <Link
                      href={`/tracks?track=${skill.id}`}
                      className="w-full py-2 bg-[#60a5fa] text-black text-xs font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2"
                    >
                      Continue Learning
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-[#181818] rounded-xl border border-[#282828]">
          <h2 className="text-xl font-black mb-4">How Skills Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#60a5fa]/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-[#60a5fa]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Complete Courses</h3>
                <p className="text-xs text-[#b3b3b3]">Finish courses to earn skill points</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#60a5fa]/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-[#60a5fa]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Unlock Levels</h3>
                <p className="text-xs text-[#b3b3b3]">Progress through 5 skill levels</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#60a5fa]/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-[#60a5fa]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Earn Badges</h3>
                <p className="text-xs text-[#b3b3b3]">Collect achievements and badges</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
