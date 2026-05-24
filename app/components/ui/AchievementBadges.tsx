"use client";

import { useState } from "react";
import { useGamification } from "../../contexts/GamificationContext";
import { Trophy, Lock } from "lucide-react";

export default function AchievementBadges() {
  const { userGamification } = useGamification();
  const [showAll, setShowAll] = useState(false);

  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-blue-600',
    epic: 'from-purple-500 to-purple-600',
    legendary: 'from-yellow-500 to-orange-500'
  };

  const rarityBorders = {
    common: 'border-gray-500',
    rare: 'border-blue-500',
    epic: 'border-purple-500',
    legendary: 'border-yellow-500'
  };

  const displayedAchievements = showAll 
    ? userGamification.availableAchievements 
    : userGamification.achievements.slice(0, 6);

  return (
    <div className="bg-[#181818] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#1ed760]" />
          Achievements
        </h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-[#b3b3b3] hover:text-white transition-colors"
        >
          {showAll ? 'Show Less' : `Show All (${userGamification.achievements.length}/${userGamification.availableAchievements.length})`}
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {displayedAchievements.map((achievement) => {
          const isUnlocked = userGamification.achievements.find(ua => ua.id === achievement.id);
          const progress = isUnlocked ? achievement.maxProgress : (achievement.progress || 0);
          const progressPercent = achievement.maxProgress ? (progress / achievement.maxProgress) * 100 : 0;

          return (
            <div
              key={achievement.id}
              className={`relative group p-3 rounded-lg border-2 transition-all ${
                isUnlocked 
                  ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} ${rarityBorders[achievement.rarity]} cursor-pointer hover:scale-105` 
                  : 'bg-[#282828] border-[#3f3f3f] opacity-50'
              }`}
            >
              <div className="text-3xl mb-2 text-center">
                {isUnlocked ? achievement.icon : <Lock className="w-8 h-8 text-[#b3b3b3] mx-auto" />}
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-white truncate">{achievement.title}</p>
                <p className="text-[10px] text-[#b3b3b3] capitalize">{achievement.rarity}</p>
                {!isUnlocked && achievement.maxProgress && achievement.maxProgress > 1 && (
                  <div className="mt-2">
                    <div className="w-full bg-[#121212] rounded-full h-1">
                      <div
                        className="h-full bg-[#1ed760] rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-[#b3b3b3] mt-1">{progress}/{achievement.maxProgress}</p>
                  </div>
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-[#282828] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                <p className="text-xs font-bold text-white mb-1">{achievement.title}</p>
                <p className="text-[10px] text-[#b3b3b3] mb-2">{achievement.description}</p>
                <p className="text-[10px] text-[#1ed760]">+{achievement.xpReward} XP</p>
                {isUnlocked && achievement.unlockedAt && (
                  <p className="text-[9px] text-[#b3b3b3] mt-1">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {userGamification.achievements.length === 0 && (
        <div className="text-center py-8">
          <Lock className="w-12 h-12 text-[#3f3f3f] mx-auto mb-2" />
          <p className="text-sm text-[#b3b3b3]">Complete lessons to unlock achievements!</p>
        </div>
      )}
    </div>
  );
}
