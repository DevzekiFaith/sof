"use client";

import { useProgress } from "../../contexts/ProgressContext";
import { useGamification } from "../../contexts/GamificationContext";
import { useUser } from "../../contexts/UserContext";
import { Clock, BookOpen, TrendingUp, Award, Target, Calendar, Crown, Lock } from "lucide-react";
import { useState } from "react";
import PaymentPromptModal from "./PaymentPromptModal";

export default function AnalyticsDashboard() {
  const { totalLearningTime, coursesCompleted, getWeeklyStats, getSkillGraph } = useProgress();
  const { userGamification } = useGamification();
  const { isPremium, currentUser } = useUser();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const weeklyStats = getWeeklyStats();
  const skillGraph = getSkillGraph();
  const userIsPremium = isPremium();
  const isLoggedIn = currentUser !== null;

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="bg-[#181818] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#1ed760]" />
          Your Progress
          {!userIsPremium && (
            <div className="flex items-center gap-1 text-xs text-[#1ed760]">
              <Crown size={10} />
              <span>Premium</span>
            </div>
          )}
        </h3>
      </div>

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

      {!userIsPremium ? (
        <div className="text-center py-8">
          <Lock className="w-12 h-12 text-[#3f3f3f] mx-auto mb-2" />
          <p className="text-sm text-[#b3b3b3]">Advanced analytics require Premium</p>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="mt-3 px-4 py-2 bg-[#1ed760] text-black font-bold rounded-full text-sm hover:scale-105 transition-transform"
          >
            Upgrade to Premium
          </button>
        </div>
      ) : (
        <>
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

          {/* Skill Progress */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Skill Development</h4>
            <div className="space-y-3">
              {skillGraph.map((skill) => (
                <div key={skill.skillName}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white">{skill.skillName}</span>
                    <span className="text-xs text-[#b3b3b3]">Level {skill.level}</span>
                  </div>
                  <div className="w-full bg-[#282828] rounded-full h-2">
                    <div
                      className="h-full bg-gradient-to-r from-[#1ed760] to-[#1ed760]/80 rounded-full transition-all"
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <PaymentPromptModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        featureName="Advanced Analytics"
        plan="premium"
      />
    </div>
  );
}
