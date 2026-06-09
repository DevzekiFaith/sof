"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';
import { courses } from '../data/courses';

export interface CourseProgress {
  courseId: string;
  courseTitle: string;
  completedModules: number;
  totalModules: number;
  timeSpent: number; // in minutes
  lastAccessed: Date;
  quizScores: number[];
  averageScore: number;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface DailyStats {
  date: Date;
  timeSpent: number; // in minutes
  lessonsCompleted: number;
  xpEarned: number;
}

export interface SkillProgress {
  skillName: string;
  level: number;
  progress: number; // 0-100
  coursesCompleted: number;
}

interface ProgressContextType {
  courseProgress: CourseProgress[];
  dailyStats: DailyStats[];
  skillProgress: SkillProgress[];
  totalLearningTime: number;
  coursesCompleted: number;
  updateCourseProgress: (courseId: string, moduleId: number, timeSpent: number) => void;
  recordQuizScore: (courseId: string, score: number) => void;
  getCourseProgress: (courseId: string) => CourseProgress | undefined;
  getWeeklyStats: () => { totalTime: number; lessonsCompleted: number; xpEarned: number };
  getSkillGraph: () => SkillProgress[];
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [skillProgress, setSkillProgress] = useState<SkillProgress[]>([]);

  // Load course progress from Supabase
  useEffect(() => {
    if (!currentUser) return;

    const loadCourseProgress = async () => {
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', currentUser.id);

      if (error) {
        return;
      }

      if (data) {
        const progress: CourseProgress[] = data.map((p: any) => {
          const course = courses.find(c => c.id === p.course_id);
          return {
            courseId: p.course_id,
            courseTitle: course?.title || `Course ${p.course_id}`,
            completedModules: p.current_module_index || 0,
            totalModules: 8, // Default, should be fetched from course data
            timeSpent: 0, // Not stored in current schema
            lastAccessed: new Date(p.last_accessed_at || new Date()),
            quizScores: [],
            averageScore: 0,
            isCompleted: p.is_complete || false,
            completedAt: p.completed_at ? new Date(p.completed_at) : undefined
          };
        });
        setCourseProgress(progress);
      }
    };

    loadCourseProgress();
  }, [currentUser]);

  // Load daily stats from Supabase
  useEffect(() => {
    if (!currentUser) return;

    const loadDailyStats = async () => {
      const { data, error } = await supabase
        .from('daily_stats')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        return;
      }

      if (data) {
        const stats: DailyStats[] = data.map((s: any) => ({
          date: new Date(s.date),
          timeSpent: s.time_spent_minutes || 0,
          lessonsCompleted: s.lessons_completed || 0,
          xpEarned: s.xp_earned || 0
        }));
        setDailyStats(stats);
      }
    };

    loadDailyStats();
  }, [currentUser]);

  const totalLearningTime = courseProgress.reduce((sum, p) => sum + p.timeSpent, 0);
  const coursesCompleted = courseProgress.filter(p => p.isCompleted).length;

  const updateCourseProgress = async (courseId: string, moduleId: number, timeSpent: number) => {
    if (!currentUser) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update course progress in Supabase
    const { error: progressError } = await supabase
      .from('course_progress')
      .upsert({
        user_id: currentUser.id,
        course_id: courseId,
        current_module_index: moduleId + 1,
        last_accessed_at: new Date().toISOString()
      });


    // Update daily stats in Supabase
    const { error: statsError } = await supabase
      .from('daily_stats')
      .upsert({
        user_id: currentUser.id,
        date: today.toISOString().split('T')[0],
        time_spent_minutes: timeSpent,
        lessons_completed: 1,
        xp_earned: Math.floor(timeSpent * 2)
      });


    // Update local state for immediate UI feedback
    setCourseProgress(prev => {
      const existing = prev.find(p => p.courseId === courseId);
      
      if (existing) {
        const updatedModules = Math.max(existing.completedModules, moduleId + 1);
        const isCompleted = updatedModules >= existing.totalModules;
        
        return prev.map(p => {
          if (p.courseId === courseId) {
            return {
              ...p,
              completedModules: updatedModules,
              timeSpent: p.timeSpent + timeSpent,
              lastAccessed: new Date(),
              isCompleted,
              completedAt: isCompleted ? new Date() : p.completedAt
            };
          }
          return p;
        });
      } else {
        return [...prev, {
          courseId,
          courseTitle: `Course ${courseId}`,
          completedModules: moduleId + 1,
          totalModules: 8,
          timeSpent,
          lastAccessed: new Date(),
          quizScores: [],
          averageScore: 0,
          isCompleted: false
        }];
      }
    });

    setDailyStats(prev => {
      const existing = prev.find(s => s.date.getTime() === today.getTime());
      
      if (existing) {
        return prev.map(s => {
          if (s.date.getTime() === today.getTime()) {
            return {
              ...s,
              timeSpent: s.timeSpent + timeSpent,
              lessonsCompleted: s.lessonsCompleted + 1
            };
          }
          return s;
        });
      } else {
        return [...prev, {
          date: today,
          timeSpent,
          lessonsCompleted: 1,
          xpEarned: Math.floor(timeSpent * 2)
        }];
      }
    });
  };

  const recordQuizScore = (courseId: string, score: number) => {
    setCourseProgress(prev => prev.map(p => {
      if (p.courseId === courseId) {
        const newScores = [...p.quizScores, score];
        const averageScore = newScores.reduce((sum, s) => sum + s, 0) / newScores.length;
        
        return {
          ...p,
          quizScores: newScores,
          averageScore
        };
      }
      return p;
    }));
  };

  const getCourseProgress = (courseId: string): CourseProgress | undefined => {
    return courseProgress.find(p => p.courseId === courseId);
  };

  const getWeeklyStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyStats = dailyStats.filter(s => s.date >= weekAgo);
    
    return {
      totalTime: weeklyStats.reduce((sum, s) => sum + s.timeSpent, 0),
      lessonsCompleted: weeklyStats.reduce((sum, s) => sum + s.lessonsCompleted, 0),
      xpEarned: weeklyStats.reduce((sum, s) => sum + s.xpEarned, 0)
    };
  };

  const getSkillGraph = (): SkillProgress[] => {
    // In a real app, this would analyze course progress to determine skill levels
    // For now, return mock data
    return [
      { skillName: 'Problem Solving', level: 3, progress: 65, coursesCompleted: 1 },
      { skillName: 'Decision Making', level: 2, progress: 40, coursesCompleted: 0 },
      { skillName: 'Teamwork', level: 1, progress: 20, coursesCompleted: 0 },
      { skillName: 'Communication', level: 2, progress: 55, coursesCompleted: 1 }
    ];
  };

  return (
    <ProgressContext.Provider
      value={{
        courseProgress,
        dailyStats,
        skillProgress,
        totalLearningTime,
        coursesCompleted,
        updateCourseProgress,
        recordQuizScore,
        getCourseProgress,
        getWeeklyStats,
        getSkillGraph
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
