"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'magify_users';
const CURRENT_USER_KEY = 'magify_current_user';

const PREF_OWNED_COURSES_KEY = "ownedCourseIds";
const PREF_QUARTERLY_PASS_EXPIRES_AT_KEY = "quarterlyPassExpiresAt";
const PREF_COURSE_PROGRESS_PREFIX = "courseProgress_";
const QUARTERLY_DURATION_DAYS = 90;

const STAGES_ORDER: LessonStage[] = ['learn', 'practice', 'reflect', 'apply'];

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): User[] => {
    try {
      const users = localStorage.getItem(STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    if (users.find(u => u.email === email)) return false;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
      preferences: {},
      stats: { xp: 0, level: 1, streakDays: 0, lastActiveDate: null }
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateUserPreferences = (newPreferences: { [key: string]: unknown }) => {
    if (!currentUser) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
      const updatedUser = {
        ...users[userIndex],
        preferences: { ...users[userIndex].preferences, ...newPreferences }
      };
      users[userIndex] = updatedUser;
      saveUsers(users);
      setCurrentUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
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
    if (owned.includes(courseId)) return true;
    return getQuarterlyPass().isActive;
  };

  const purchaseCourse = (courseId: string) => {
    if (!currentUser) return;
    const owned = new Set(getOwnedCourses());
    owned.add(courseId);
    updateUserPreferences({ [PREF_OWNED_COURSES_KEY]: Array.from(owned) });
  };

  const purchaseQuarterlyPass = () => {
    if (!currentUser) return;
    const expiresAt = new Date(Date.now() + QUARTERLY_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
    updateUserPreferences({ [PREF_QUARTERLY_PASS_EXPIRES_AT_KEY]: expiresAt });
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

  const markStageComplete = (
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
      awardXP(25);
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

    updateUserPreferences({ [key]: progress });
  };

  // ─── Gamification ────────────────────────────────────────────────────────

  const awardXP = (amount: number) => {
    if (!currentUser) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
      const user = users[userIndex];
      const stats = user.stats || { xp: 0, level: 1, streakDays: 0, lastActiveDate: null };
      
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

      const updatedUser = {
        ...user,
        stats: {
          xp: newXp,
          level: newLevel,
          streakDays: newStreak,
          lastActiveDate: today
        }
      };

      users[userIndex] = updatedUser;
      saveUsers(users);
      setCurrentUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
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
        enrolledCourses: getOwnedCourses()
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