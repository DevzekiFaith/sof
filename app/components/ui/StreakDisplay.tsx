"use client";

import { useGamification } from "../../contexts/GamificationContext";
import { Flame } from "lucide-react";

export default function StreakDisplay() {
  const { userGamification, getStreakBonus } = useGamification();
  const streakBonus = getStreakBonus();

  return (
    <div className="flex items-center gap-2 bg-[#282828] px-4 py-2 rounded-full">
      <Flame className={`w-5 h-5 ${userGamification.streak >= 7 ? 'text-orange-500' : userGamification.streak >= 3 ? 'text-yellow-500' : 'text-[#1ed760]'}`} />
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white">{userGamification.streak} day streak</span>
        {streakBonus > 0 && (
          <span className="text-xs text-[#1ed760]">+{Math.round(streakBonus * 100)}% XP bonus</span>
        )}
      </div>
    </div>
  );
}
