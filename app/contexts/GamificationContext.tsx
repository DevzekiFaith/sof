"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface UserGamification {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: Date | null;
  achievements: Achievement[];
  availableAchievements: Achievement[];
}

interface GamificationContextType {
  userGamification: UserGamification;
  addXP: (amount: number, source: string) => void;
  checkLevelUp: () => boolean;
  updateStreak: () => void;
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  getLevelProgress: () => number;
  getStreakBonus: () => number;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// XP required for each level (exponential growth)
const getXPForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Predefined achievements
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    rarity: 'common',
    xpReward: 50,
    maxProgress: 1
  },
  {
    id: 'streak_3',
    title: 'On Fire',
    description: 'Maintain a 3-day learning streak',
    icon: '🔥',
    rarity: 'common',
    xpReward: 100,
    maxProgress: 3
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '⚡',
    rarity: 'rare',
    xpReward: 250,
    maxProgress: 7
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day learning streak',
    icon: '🏆',
    rarity: 'epic',
    xpReward: 1000,
    maxProgress: 30
  },
  {
    id: 'course_complete',
    title: 'Course Graduate',
    description: 'Complete your first course',
    icon: '🎓',
    rarity: 'rare',
    xpReward: 500,
    maxProgress: 1
  },
  {
    id: 'five_courses',
    title: 'Knowledge Seeker',
    description: 'Complete 5 courses',
    icon: '📚',
    rarity: 'epic',
    xpReward: 1500,
    maxProgress: 5
  },
  {
    id: 'perfect_quiz',
    title: 'Perfectionist',
    description: 'Score 100% on a quiz',
    icon: '💯',
    rarity: 'rare',
    xpReward: 200,
    maxProgress: 1
  },
  {
    id: 'speed_learner',
    title: 'Speed Learner',
    description: 'Complete a lesson in under 5 minutes',
    icon: '⏱️',
    rarity: 'rare',
    xpReward: 150,
    maxProgress: 1
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete 10 lessons after 10 PM',
    icon: '🦉',
    rarity: 'common',
    xpReward: 100,
    maxProgress: 10
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete 10 lessons before 8 AM',
    icon: '🐦',
    rarity: 'common',
    xpReward: 100,
    maxProgress: 10
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Invite 5 friends to the platform',
    icon: '🦋',
    rarity: 'rare',
    xpReward: 300,
    maxProgress: 5
  },
  {
    id: 'helper',
    title: 'Helper',
    description: 'Help 10 peers with their questions',
    icon: '🤝',
    rarity: 'epic',
    xpReward: 500,
    maxProgress: 10
  },
  {
    id: 'level_10',
    title: 'Rising Star',
    description: 'Reach level 10',
    icon: '⭐',
    rarity: 'rare',
    xpReward: 0,
    maxProgress: 1
  },
  {
    id: 'level_25',
    title: 'Expert Learner',
    description: 'Reach level 25',
    icon: '🌟',
    rarity: 'epic',
    xpReward: 0,
    maxProgress: 1
  },
  {
    id: 'level_50',
    title: 'Master',
    description: 'Reach level 50',
    icon: '👑',
    rarity: 'legendary',
    xpReward: 0,
    maxProgress: 1
  }
];

export function GamificationProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [userGamification, setUserGamification] = useState<UserGamification>({
    totalXP: 0,
    level: 1,
    currentLevelXP: 0,
    nextLevelXP: getXPForLevel(2),
    streak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    achievements: [],
    availableAchievements: ACHIEVEMENTS
  });

  // Load gamification data from Supabase
  useEffect(() => {
    if (!currentUser) return;

    const loadGamificationData = async () => {
      // Load gamification stats
      const { data: statsData, error: statsError } = await supabase
        .from('gamification_stats')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('Error loading gamification stats:', statsError);
      }

      // Load achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', currentUser.id);

      if (achievementsError) {
        console.error('Error loading achievements:', achievementsError);
      }

      if (statsData) {
        const level = statsData.level || 1;
        const achievements: Achievement[] = (achievementsData || []).map((a: any) => {
          const achievementDef = ACHIEVEMENTS.find(def => def.id === a.achievement_id);
          return {
            ...achievementDef,
            unlockedAt: new Date(a.unlocked_at),
            progress: achievementDef?.maxProgress
          };
        }).filter(Boolean);

        setUserGamification({
          totalXP: statsData.total_xp || 0,
          level,
          currentLevelXP: statsData.total_xp || 0,
          nextLevelXP: getXPForLevel(level + 1),
          streak: statsData.streak_days || 0,
          longestStreak: statsData.streak_days || 0,
          lastActiveDate: null,
          achievements,
          availableAchievements: ACHIEVEMENTS
        });
      }
    };

    loadGamificationData();
  }, [currentUser]);

  const addXP = async (amount: number, source: string) => {
    if (!currentUser) return;

    const streakBonus = getStreakBonus();
    const totalAmount = Math.floor(amount * (1 + streakBonus));

    // Update Supabase
    const { error } = await supabase
      .from('gamification_stats')
      .upsert({
        user_id: currentUser.id,
        total_xp: userGamification.totalXP + totalAmount,
        level: userGamification.level,
        streak_days: userGamification.streak
      });

    if (error) {
      console.error('Error updating XP:', error);
    }

    setUserGamification(prev => {
      const newTotalXP = prev.totalXP + totalAmount;
      let newLevel = prev.level;
      let newCurrentLevelXP = prev.currentLevelXP + totalAmount;
      let newNextLevelXP = prev.nextLevelXP;

      // Check for level up
      while (newCurrentLevelXP >= newNextLevelXP) {
        newCurrentLevelXP -= newNextLevelXP;
        newLevel++;
        newNextLevelXP = getXPForLevel(newLevel + 1);

        // Check for level achievements
        const levelAchievement = prev.availableAchievements.find(
          a => a.id === `level_${newLevel}`
        );
        if (levelAchievement && !prev.achievements.find(ua => ua.id === levelAchievement.id)) {
          // Auto-unlock level achievement
        }
      }

      return {
        ...prev,
        totalXP: newTotalXP,
        level: newLevel,
        currentLevelXP: newCurrentLevelXP,
        nextLevelXP: newNextLevelXP
      };
    });

    console.log(`+${totalAmount} XP (${source}${streakBonus > 0 ? `, ${Math.round(streakBonus * 100)}% streak bonus` : ''})`);
  };

  const checkLevelUp = (): boolean => {
    return userGamification.currentLevelXP >= userGamification.nextLevelXP;
  };

  const updateStreak = async () => {
    if (!currentUser) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setUserGamification(prev => {
      const lastActive = prev.lastActiveDate ? new Date(prev.lastActiveDate) : null;
      let newStreak = prev.streak;

      if (!lastActive) {
        // First time active
        newStreak = 1;
      } else {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const lastActiveDate = new Date(lastActive);
        lastActiveDate.setHours(0, 0, 0, 0);

        if (lastActiveDate.getTime() === today.getTime()) {
          // Already active today, no change
          return prev;
        } else if (lastActiveDate.getTime() === yesterday.getTime()) {
          // Active yesterday, increment streak
          newStreak = prev.streak + 1;
        } else {
          // Streak broken
          newStreak = 1;
        }
      }

      const newLongestStreak = Math.max(prev.longestStreak, newStreak);

      // Update Supabase
      supabase
        .from('gamification_stats')
        .upsert({
          user_id: currentUser.id,
          streak_days: newStreak
        })
        .then(({ error }) => {
          if (error) console.error('Error updating streak:', error);
        });

      // Check for streak achievements
      const updatedAchievements = [...prev.achievements];
      const streakAchievements = [3, 7, 30].map(days => `streak_${days}`);

      streakAchievements.forEach(achievementId => {
        const achievement = prev.availableAchievements.find(a => a.id === achievementId);
        if (achievement && newStreak >= (achievement.maxProgress || 0)) {
          if (!prev.achievements.find(ua => ua.id === achievementId)) {
            updatedAchievements.push({
              ...achievement,
              unlockedAt: new Date(),
              progress: achievement.maxProgress
            });
            addXP(achievement.xpReward, `Achievement: ${achievement.title}`);
          }
        }
      });

      return {
        ...prev,
        streak: newStreak,
        longestStreak: newLongestStreak,
        lastActiveDate: today,
        achievements: updatedAchievements
      };
    });
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!currentUser) return;

    setUserGamification(prev => {
      const achievement = prev.availableAchievements.find(a => a.id === achievementId);
      if (!achievement || prev.achievements.find(ua => ua.id === achievementId)) {
        return prev;
      }

      const newAchievement = {
        ...achievement,
        unlockedAt: new Date(),
        progress: achievement.maxProgress
      };

      // Save to Supabase
      supabase
        .from('achievements')
        .insert({
          user_id: currentUser.id,
          achievement_id: achievementId,
          unlocked_at: new Date().toISOString()
        })
        .then(({ error }) => {
          if (error) console.error('Error unlocking achievement:', error);
        });

      addXP(achievement.xpReward, `Achievement: ${achievement.title}`);

      return {
        ...prev,
        achievements: [...prev.achievements, newAchievement]
      };
    });
  };

  const updateAchievementProgress = async (achievementId: string, progress: number) => {
    if (!currentUser) return;

    setUserGamification(prev => {
      const achievement = prev.availableAchievements.find(a => a.id === achievementId);
      const existingAchievement = prev.achievements.find(ua => ua.id === achievementId);

      if (!achievement) return prev;

      if (existingAchievement) {
        // Already unlocked, no update needed
        return prev;
      }

      const maxProgress = achievement.maxProgress || 1;
      const newProgress = Math.min(progress, maxProgress);

      if (newProgress >= maxProgress) {
        // Achievement unlocked
        const newAchievement = {
          ...achievement,
          unlockedAt: new Date(),
          progress: maxProgress
        };

        // Save to Supabase
        supabase
          .from('achievements')
          .insert({
            user_id: currentUser.id,
            achievement_id: achievementId,
            unlocked_at: new Date().toISOString()
          })
          .then(({ error }) => {
            if (error) console.error('Error unlocking achievement:', error);
          });

        addXP(achievement.xpReward, `Achievement: ${achievement.title}`);

        return {
          ...prev,
          achievements: [...prev.achievements, newAchievement]
        };
      }

      // Update progress for in-progress achievements
      const updatedAchievements = prev.achievements.map(ua => {
        if (ua.id === achievementId) {
          return { ...ua, progress: newProgress };
        }
        return ua;
      });

      // Add if not in achievements array yet
      if (!prev.achievements.find(ua => ua.id === achievementId)) {
        updatedAchievements.push({
          ...achievement,
          progress: newProgress
        });
      }

      return {
        ...prev,
        achievements: updatedAchievements
      };
    });
  };

  const getLevelProgress = (): number => {
    return (userGamification.currentLevelXP / userGamification.nextLevelXP) * 100;
  };

  const getStreakBonus = (): number => {
    // 10% bonus per streak day, max 50%
    return Math.min(userGamification.streak * 0.1, 0.5);
  };

  return (
    <GamificationContext.Provider
      value={{
        userGamification,
        addXP,
        checkLevelUp,
        updateStreak,
        unlockAchievement,
        updateAchievementProgress,
        getLevelProgress,
        getStreakBonus
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}
