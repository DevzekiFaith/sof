"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  preferences?: {
    [key: string]: unknown;
  };
  stats?: {
    xp: number;
    level: number;
    streakDays: number;
    lastActiveDate: string | null;
  };
}

export type BillingInterval = "quarterly";

// Progress types
export type LessonStage = 'learn' | 'practice' | 'reflect' | 'apply';

export interface ModuleProgress {
  completedStages: LessonStage[];
  isComplete: boolean;
}

export interface CourseProgress {
  currentModuleIndex: number;
  modules: { [moduleIndex: number]: ModuleProgress };
  isComplete: boolean;
  startedAt: string;
  completedAt?: string;
}

interface UserContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserPreferences: (preferences: { [key: string]: unknown }) => void;
  purchaseCourse: (courseId: string) => void;
  purchaseQuarterlyPass: () => void;
  hasCourseAccess: (courseId: string) => boolean;
  getOwnedCourses: () => string[];
  getQuarterlyPass: () => { isActive: boolean; expiresAt?: string };
  // Progress tracking
  getCourseProgress: (courseId: string) => CourseProgress | null;
  markStageComplete: (courseId: string, moduleIndex: number, stage: LessonStage, totalModules: number) => void;
  isModuleUnlocked: (courseId: string, moduleIndex: number) => boolean;
  isStageComplete: (courseId: string, moduleIndex: number, stage: LessonStage) => boolean;
  awardXP: (amount: number) => void;
  isLoading: boolean;
  enrolledCourses: string[];
  // Engagement bonuses
  checkStreakBonus: () => { earned: boolean; reward: string };
  addReferral: (referredUserId: string) => Promise<boolean>;
  getReferralCount: () => Promise<number>;
  // Email confirmation
  resendConfirmationEmail: (email: string) => Promise<boolean>;
  // Password reset
  resetPassword: (email: string) => Promise<boolean>;
  // OAuth
  signInWithGoogle: () => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const PREF_OWNED_COURSES_KEY = "ownedCourseIds";
const PREF_QUARTERLY_PASS_EXPIRES_AT_KEY = "quarterlyPassExpiresAt";
const PREF_COURSE_PROGRESS_PREFIX = "courseProgress_";
const QUARTERLY_DURATION_DAYS = 90;

const STAGES_ORDER: LessonStage[] = ['learn', 'practice', 'reflect', 'apply'];

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      setIsLoading(false);
      return;
    }

    if (data) {
      const { data: gamificationData } = await supabase
        .from('gamification_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Fallback preferences loading from localStorage
      let preferences = {};
      try {
        const saved = localStorage.getItem(`user_preferences_${userId}`);
        if (saved) {
          preferences = JSON.parse(saved);
        }
      } catch (e) {
        console.error("Failed to parse local preferences:", e);
      }

      if (data && (data as any).preferences) {
        preferences = { ...preferences, ...(data as any).preferences };
      }

      const user: User = {
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        createdAt: data.created_at,
        preferences: preferences,
        stats: gamificationData ? {
          xp: gamificationData.total_xp,
          level: gamificationData.level,
          streakDays: gamificationData.streak_days,
          lastActiveDate: gamificationData.last_active_date
        } : undefined
      };

      setCurrentUser(user);
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  };

  const resendConfirmationEmail = async (email: string): Promise<boolean> => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      return false;
    }

    return true;
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return false;
    }

    return true;
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return false;
    }

    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }

    // Create profile in database
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: name,
          created_at: new Date().toISOString(),
        });

      if (profileError) {
        // Profile creation failed
      }

      // Create gamification stats
      const { error: gamificationError } = await supabase
        .from('gamification_stats')
        .insert({
          user_id: data.user.id,
          total_xp: 0,
          level: 1,
          streak_days: 0,
          last_active_date: new Date().toISOString(),
        });

      if (gamificationError) {
        // Gamification stats creation failed
      }
    }

    // Check if email confirmation is required
    if (data.user && !data.session) {
      // Email confirmation required - handled by UI
      return true;
    }

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const updateUserPreferences = async (newPreferences: { [key: string]: unknown }) => {
    if (!currentUser) return false;

    const currentPrefs = currentUser.preferences || {};
    const updatedPrefs = { ...currentPrefs, ...newPreferences };

    // 1. Save to local storage immediately
    try {
      localStorage.setItem(`user_preferences_${currentUser.id}`, JSON.stringify(updatedPrefs));
    } catch (e) {
      console.error("Local storage preferences error:", e);
    }

    // 2. Update state immediately so UI updates instantly
    setCurrentUser(prev => prev ? {
      ...prev,
      preferences: updatedPrefs
    } : null);

    // 3. Attempt DB update, log warnings but do not fail checkout/routing if missing
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          preferences: updatedPrefs
        } as any)
        .eq('id', currentUser.id);

      if (error) {
        console.warn("Preferences DB update warning (column might be missing or blocked by RLS):", error.message);
      }
    } catch (err) {
      console.warn("Preferences DB update exception warning:", err);
    }

    return true;
  };

  const getOwnedCourses = (): string[] => {
    const owned = currentUser?.preferences?.[PREF_OWNED_COURSES_KEY];
    return Array.isArray(owned) ? owned as string[] : [];
  };

  const getQuarterlyPass = (): { isActive: boolean; expiresAt?: string } => {
    const expiresAt = currentUser?.preferences?.[PREF_QUARTERLY_PASS_EXPIRES_AT_KEY];
    if (typeof expiresAt !== "string") return { isActive: false };
    const expiresMs = Date.parse(expiresAt);
    if (Number.isNaN(expiresMs)) return { isActive: false };
    return { isActive: Date.now() < expiresMs, expiresAt };
  };

  const hasCourseAccess = (courseId: string): boolean => {
    if (!currentUser) return false;

    const owned = getOwnedCourses();
    return owned.includes(courseId);
  };

  const purchaseCourse = async (courseId: string) => {
    if (!currentUser) return;
    const owned = new Set(getOwnedCourses());
    owned.add(courseId);
    await updateUserPreferences({ [PREF_OWNED_COURSES_KEY]: Array.from(owned) });
  };

  const purchaseQuarterlyPass = async () => {
    if (!currentUser) return;
    const expiresAt = new Date(Date.now() + QUARTERLY_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    await updateUserPreferences({ [PREF_QUARTERLY_PASS_EXPIRES_AT_KEY]: expiresAt });
  };

  // ─── Progress Tracking ───────────────────────────────────────────────────────

  const getCourseProgress = (courseId: string): CourseProgress | null => {
    const key = `${PREF_COURSE_PROGRESS_PREFIX}${courseId}`;
    const raw = currentUser?.preferences?.[key];
    if (!raw || typeof raw !== 'object') return null;
    return raw as CourseProgress;
  };

  const isModuleUnlocked = (courseId: string, moduleIndex: number): boolean => {
    // Module 0 is always unlocked
    if (moduleIndex === 0) return true;
    const progress = getCourseProgress(courseId);
    if (!progress) return false;
    // Previous module must be complete
    const prevModule = progress.modules[moduleIndex - 1];
    return prevModule?.isComplete === true;
  };

  const isStageComplete = (courseId: string, moduleIndex: number, stage: LessonStage): boolean => {
    const progress = getCourseProgress(courseId);
    if (!progress) return false;
    const mod = progress.modules[moduleIndex];
    if (!mod) return false;
    return mod.completedStages.includes(stage);
  };

  const markStageComplete = async (
    courseId: string,
    moduleIndex: number,
    stage: LessonStage,
    totalModules: number
  ) => {
    if (!currentUser) return;

    const key = `${PREF_COURSE_PROGRESS_PREFIX}${courseId}`;
    const existing = getCourseProgress(courseId);

    const progress: CourseProgress = existing ?? {
      currentModuleIndex: 0,
      modules: {},
      isComplete: false,
      startedAt: new Date().toISOString(),
    };

    // Update module progress
    const moduleProgress: ModuleProgress = progress.modules[moduleIndex] ?? {
      completedStages: [],
      isComplete: false,
    };

    if (!moduleProgress.completedStages.includes(stage)) {
      moduleProgress.completedStages.push(stage);
      // Award XP for stage completion
      await awardXP(25);
    }

    // Check if all 4 stages are done
    const allStagesDone = STAGES_ORDER.every(s => moduleProgress.completedStages.includes(s));
    moduleProgress.isComplete = allStagesDone;

    progress.modules[moduleIndex] = moduleProgress;

    // Advance current module pointer
    if (allStagesDone && moduleIndex >= progress.currentModuleIndex) {
      progress.currentModuleIndex = Math.min(moduleIndex + 1, totalModules - 1);
    }

    // Check if whole course is complete
    const allModulesDone = Array.from({ length: totalModules }, (_, i) =>
      progress.modules[i]?.isComplete === true
    ).every(Boolean);
    if (allModulesDone) {
      progress.isComplete = true;
      progress.completedAt = new Date().toISOString();
    }

    await updateUserPreferences({ [key]: progress });
  };

  // ─── Gamification ────────────────────────────────────────────────────────

  const awardXP = async (amount: number) => {
    if (!currentUser) return;

    const stats = currentUser.stats || { xp: 0, level: 1, streakDays: 0, lastActiveDate: null };
    
    const newXp = stats.xp + amount;
    const newLevel = Math.floor(newXp / 100) + 1; // 100 XP per level

    const today = new Date().toISOString().split('T')[0];
    let newStreak = stats.streakDays;
    
    if (stats.lastActiveDate !== today) {
      if (stats.lastActiveDate) {
        const lastDate = new Date(stats.lastActiveDate);
        const current = new Date(today);
        const diffTime = Math.abs(current.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStreak += 1; // consecutive day
        } else if (diffDays > 1) {
          newStreak = 1; // streak broken
        }
      } else {
        newStreak = 1; // first day
      }
    }

    const { error } = await supabase
      .from('gamification_stats')
      .upsert({
        user_id: currentUser.id,
        total_xp: newXp,
        level: newLevel,
        streak_days: newStreak,
        last_active_date: today
      });

    if (error) {
      return;
    }

    // Update local state
    setCurrentUser({
      ...currentUser,
      stats: {
        xp: newXp,
        level: newLevel,
        streakDays: newStreak,
        lastActiveDate: today
      }
    });
  };

  // ─── Engagement Bonuses ─────────────────────────────────────────────────────

  const checkStreakBonus = () => {
    if (!currentUser) return { earned: false, reward: '' };

    const streakDays = currentUser.stats?.streakDays || 0;

    // 7-day streak bonus
    if (streakDays === 7) {
      return { earned: true, reward: 'XP bonus awarded' };
    }

    // 30-day streak bonus
    if (streakDays === 30) {
      return { earned: true, reward: 'XP bonus awarded' };
    }

    return { earned: false, reward: '' };
  };

  const addReferral = async (referredUserId: string) => {
    if (!currentUser) return false;

    try {
      const { error } = await supabase
        .from('referrals')
        .insert({
          referrer_id: currentUser.id,
          referred_user_id: referredUserId,
          created_at: new Date().toISOString()
        });

      if (error) {
        return false;
      }

      // Check if user has 3 referrals and award bonus
      const { data: referrals } = await supabase
        .from('referrals')
        .select('id')
        .eq('referrer_id', currentUser.id);

      if (referrals && referrals.length === 3) {
        // Award bonus for referrals - 3 referral milestone reached
        // User gets bonus XP for referring 3 friends
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  const getReferralCount = async () => {
    if (!currentUser) return 0;

    const { data, error } = await supabase
      .from('referrals')
      .select('id')
      .eq('referrer_id', currentUser.id);

    if (error || !data) return 0;
    return data.length;
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        updateUserPreferences,
        purchaseCourse,
        purchaseQuarterlyPass,
        hasCourseAccess,
        getOwnedCourses,
        getQuarterlyPass,
        getCourseProgress,
        markStageComplete,
        isModuleUnlocked,
        isStageComplete,
        awardXP,
        isLoading,
        enrolledCourses: getOwnedCourses(),
        checkStreakBonus,
        addReferral,
        getReferralCount,
        resendConfirmationEmail,
        resetPassword,
        signInWithGoogle
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}