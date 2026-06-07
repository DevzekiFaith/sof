"use client";

import { useProgress } from "../../contexts/ProgressContext";
import { useGamification } from "../../contexts/GamificationContext";
import { useUser } from "../../contexts/UserContext";
import { Clock, BookOpen, TrendingUp, Award, Target, Calendar, Crown, Lock, Brain, Code, Palette, MessageSquare, Zap, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import PaymentPromptModal from "./PaymentPromptModal";

export default function AnalyticsDashboard() {
  const { totalLearningTime, coursesCompleted, getWeeklyStats, getSkillGraph } = useProgress();
  const { userGamification } = useGamification();
  const { currentUser } = useUser();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const weeklyStats = getWeeklyStats();
  const skillGraph = getSkillGraph();
  const isLoggedIn = currentUser !== null;

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getSkillIcon = (skillName: string) => {
    const iconMap: { [key: string]: any } = {
      'Critical Thinking': Brain,
      'Problem Solving': Zap,
      'Communication': MessageSquare,
      'Leadership': Award,
      'Creativity': Palette,
      'Technical': Code,
      'Strategy': Target,
      'Resilience': Shield,
    };
    return iconMap[skillName] || Award;
  };

  const getSkillColor = (progress: number) => {
    if (progress >= 80) return 'from-purple-500 to-purple-600';
    if (progress >= 60) return 'from-blue-500 to-blue-600';
    if (progress >= 40) return 'from-green-500 to-green-600';
    if (progress >= 20) return 'from-yellow-500 to-yellow-600';
    return 'from-gray-500 to-gray-600';
  };

  const getSkillBadge = (level: number) => {
    if (level >= 5) return { text: 'Expert', color: 'bg-purple-500' };
    if (level >= 4) return { text: 'Advanced', color: 'bg-blue-500' };
    if (level >= 3) return { text: 'Intermediate', color: 'bg-green-500' };
    if (level >= 2) return { text: 'Beginner', color: 'bg-yellow-500' };
    return { text: 'Novice', color: 'bg-gray-500' };
  };

  return (
    <div className="bg-[#181818] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#1ed760]" />
          Your Progress
        </h3>
      </div>

      {!mounted ? (
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#282828] p-4 rounded-lg h-20" />
            ))}
          </div>
          <div className="bg-[#282828] p-4 rounded-lg h-32" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#282828] p-4 rounded-xl h-28" />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#282828] p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-[#1ed760]" />
            <span className="text-xs text-[#b3b3b3]">Total Time</span>
          </div>
          <p className="text-xl font-bold text-white">{formatTime(totalLearningTime)}</p>
        </div>

        <div className="bg-[#282828] p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-[#1ed760]" />
            <span className="text-xs text-[#b3b3b3]">Courses</span>
          </div>
          <p className="text-xl font-bold text-white">{coursesCompleted}</p>
        </div>

        <div className="bg-[#282828] p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-[#1ed760]" />
            <span className="text-xs text-[#b3b3b3]">Level</span>
          </div>
          <p className="text-xl font-bold text-white">{userGamification.level}</p>
        </div>

        <div className="bg-[#282828] p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#1ed760]" />
            <span className="text-xs text-[#b3b3b3]">XP</span>
          </div>
          <p className="text-xl font-bold text-white">{userGamification.totalXP.toLocaleString()}</p>
        </div>
      </div>

      {/* Weekly Stats */}
      <div className="bg-[#282828] p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-[#1ed760]" />
              <span className="text-sm font-bold text-white">This Week</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-white">{formatTime(weeklyStats.totalTime)}</p>
                <p className="text-xs text-[#b3b3b3]">Time Spent</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{weeklyStats.lessonsCompleted}</p>
                <p className="text-xs text-[#b3b3b3]">Lessons</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{weeklyStats.xpEarned}</p>
                <p className="text-xs text-[#b3b3b3]">XP Earned</p>
              </div>
            </div>
          </div>

          {/* Skill Journey Timeline */}
          <div className="bg-[#282828] p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white">Skill Journey</h4>
              <span className="text-xs text-[#b3b3b3]">Last 30 days</span>
            </div>
            <div className="space-y-3">
              {skillGraph.slice(0, 3).map((skill, idx) => {
                const IconComponent = getSkillIcon(skill.skillName);
                const colorClass = getSkillColor(skill.progress);
                
                return (
                  <div key={skill.skillName} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-white">{skill.skillName}</span>
                        <span className="text-xs text-[#1ed760]">+{Math.floor(skill.progress / 10)}%</span>
                      </div>
                      <div className="w-full bg-[#181818] rounded-full h-1">
                        <div
                          className={`h-full bg-gradient-to-r ${colorClass} rounded-full`}
                          style={{ width: `${skill.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skill Activity Heatmap */}
          <div className="bg-[#282828] p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white">Activity Heatmap</h4>
              <span className="text-xs text-[#b3b3b3]">Last 90 days</span>
            </div>
            <div className="grid grid-cols-13 gap-1">
              {Array.from({ length: 90 }).map((_, i) => {
                const activityLevel = Math.random();
                let colorClass = 'bg-[#181818]';
                if (activityLevel > 0.8) colorClass = 'bg-[#1ed760]';
                else if (activityLevel > 0.6) colorClass = 'bg-[#1ed760]/60';
                else if (activityLevel > 0.4) colorClass = 'bg-[#1ed760]/30';
                else if (activityLevel > 0.2) colorClass = 'bg-[#1ed760]/10';
                
                return (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-sm ${colorClass}`}
                    title={`Day ${i + 1}: ${Math.floor(activityLevel * 100)}% activity`}
                  />
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-[#b3b3b3]">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-[#181818]" />
                <div className="w-3 h-3 rounded-sm bg-[#1ed760]/10" />
                <div className="w-3 h-3 rounded-sm bg-[#1ed760]/30" />
                <div className="w-3 h-3 rounded-sm bg-[#1ed760]/60" />
                <div className="w-3 h-3 rounded-sm bg-[#1ed760]" />
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Skill Progress */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Skill Development</h4>
            <div className="grid grid-cols-2 gap-3">
              {skillGraph.map((skill) => {
                const IconComponent = getSkillIcon(skill.skillName);
                const badge = getSkillBadge(skill.level);
                const colorClass = getSkillColor(skill.progress);
                
                return (
                  <div 
                    key={skill.skillName}
                    className={`bg-[#282828] p-4 rounded-xl border border-transparent hover:border-[#1ed760]/20 transition-all group cursor-pointer ${
                      selectedSkill === skill.skillName ? 'border-[#1ed760] shadow-lg shadow-[#1ed760]/10' : ''
                    }`}
                    onClick={() => setSelectedSkill(selectedSkill === skill.skillName ? null : skill.skillName)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold text-white ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white mb-1">{skill.skillName}</h5>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#b3b3b3]">Level {skill.level}</span>
                      <span className="text-xs text-[#1ed760] font-semibold">{skill.progress}%</span>
                    </div>
                    <div className="mt-2 w-full bg-[#181818] rounded-full h-1.5">
                      <div
                        className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all`}
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                    {selectedSkill === skill.skillName && (
                      <div className="mt-3 pt-3 border-t border-[#181818] space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-[#b3b3b3]">Modules Completed</span>
                          <span className="text-white font-medium">{Math.floor(skill.progress / 10)}/10</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[#b3b3b3]">Time Spent</span>
                          <span className="text-white font-medium">{formatTime(skill.progress * 2)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-[#b3b3b3]">Quiz Score</span>
                          <span className="text-[#1ed760] font-medium">{85 + Math.floor(Math.random() * 10)}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <PaymentPromptModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        featureName="Advanced Analytics"
      />
    </div>
  );
}
