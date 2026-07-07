"use client";

import { useGamification } from "../../contexts/GamificationContext";
import { Zap } from "lucide-react";

export default function XPBar() {
  const { userGamification, getLevelProgress } = useGamification();
  const progress = getLevelProgress();

  return (
    <div className="bg-[#282828] rounded-full p-1 mb-4">
      <div className="flex items-center justify-between mb-1 px-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#60a5fa]" />
          <span className="text-xs font-bold text-white">Level {userGamification.level}</span>
        </div>
        <span className="text-xs text-[#b3b3b3]">
          {userGamification.currentLevelXP} / {userGamification.nextLevelXP} XP
        </span>
      </div>
      <div className="w-full bg-[#121212] rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#60a5fa] to-[#60a5fa]/80 transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
