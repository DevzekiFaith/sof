"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';
import { Course } from '../data/courses';
import { courses } from '../data/courses';

export interface UserLearningActivity {
  courseId: string;
  completedAt: Date;
  timeSpent: number; // in minutes
  quizScore?: number;
  rating?: number; // 1-5
}

export interface Recommendation {
  course: Course;
  reason: string;
  confidence: number; // 0-1
  type: 'similar' | 'popular' | 'trending' | 'skill_gap' | 'streak_preserver';
}

interface RecommendationContextType {
  recommendations: Recommendation[];
  weeklyRecommendations: Recommendation[];
  learningHistory: UserLearningActivity[];
  recordActivity: (activity: UserLearningActivity) => void;
  getRecommendations: (limit?: number) => Recommendation[];
  getWeeklyRecommendations: () => Recommendation[];
  refreshRecommendations: () => void;
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

// Simple recommendation algorithm based on course tags and completion patterns
function generateRecommendations(
  learningHistory: UserLearningActivity[],
  allCourses: Course[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const completedCourseIds = new Set(learningHistory.map(a => a.courseId));
  
  // Get tags from completed courses
  const completedTags = new Set<string>();
  learningHistory.forEach(activity => {
    const course = allCourses.find(c => c.id === activity.courseId);
    if (course) {
      // Extract tags from course (you could add tags to Course interface)
      // For now, we'll use the course title/description to infer interests
    }
  });

  // 1. Similar courses (based on not being completed yet)
  allCourses.forEach(course => {
    if (!completedCourseIds.has(course.id)) {
      recommendations.push({
        course,
        reason: 'Based on your learning interests',
        confidence: 0.7,
        type: 'similar'
      });
    }
  });

  // 2. Popular courses (based on featured flag)
  allCourses.filter(c => c.featured && !completedCourseIds.has(c.id)).forEach(course => {
    recommendations.push({
      course,
      reason: 'Popular with learners like you',
      confidence: 0.8,
      type: 'popular'
    });
  });

  // 3. Streak preservers (shorter courses for maintaining streaks)
  allCourses
    .filter(c => !completedCourseIds.has(c.id) && c.duration && parseInt(c.duration) <= 4)
    .slice(0, 3)
    .forEach(course => {
      recommendations.push({
        course,
        reason: 'Quick lesson to maintain your streak',
        confidence: 0.6,
        type: 'streak_preserver'
      });
    });

  // Sort by confidence and shuffle for variety
  return recommendations
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 10);
}

export function RecommendationProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [weeklyRecommendations, setWeeklyRecommendations] = useState<Recommendation[]>([]);
  const [learningHistory, setLearningHistory] = useState<UserLearningActivity[]>([]);

  // Load learning history from Supabase
  useEffect(() => {
    if (!currentUser) return;

    const loadLearningHistory = async () => {
      const { data, error } = await supabase
        .from('learning_history')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('completed_at', { ascending: false })
        .limit(50);

      if (error) {
        return;
      }

      if (data) {
        const history: UserLearningActivity[] = data.map((h: any) => ({
          courseId: h.course_id,
          completedAt: new Date(h.completed_at),
          timeSpent: h.time_spent || 0
        }));
        setLearningHistory(history);
      }
    };

    loadLearningHistory();
  }, [currentUser]);

  // Generate recommendations when learning history changes
  useEffect(() => {
    const recs = generateRecommendations(learningHistory, courses);
    setRecommendations(recs);
  }, [learningHistory]);

  // Generate weekly recommendations
  useEffect(() => {
    const weeklyRecs = generateRecommendations(learningHistory, courses).slice(0, 5);
    setWeeklyRecommendations(weeklyRecs);
  }, [learningHistory]);

  const recordActivity = async (activity: UserLearningActivity) => {
    if (!currentUser) return;

    // Save to Supabase
    const { error } = await supabase
      .from('learning_history')
      .insert({
        user_id: currentUser.id,
        course_id: activity.courseId,
        module_index: 0,
        time_spent: activity.timeSpent,
        completed_at: activity.completedAt.toISOString()
      });

    if (error) {
    // Update local state for immediate UI feedback
    setLearningHistory(prev => {
      const filtered = prev.filter(a => a.courseId !== activity.courseId);
      return [...filtered, activity];
    });
  };

  const getRecommendations = (limit: number = 10): Recommendation[] => {
    return recommendations.slice(0, limit);
  };

  const getWeeklyRecommendations = (): Recommendation[] => {
    return weeklyRecommendations;
  };

  const refreshRecommendations = () => {
    // Shuffle courses to provide variety on refresh
    const shuffledCourses = [...courses].sort(() => Math.random() - 0.5);
    const recs = generateRecommendations(learningHistory, shuffledCourses);
    setRecommendations(recs);

    const weeklyRecs = recs.slice(0, 5);
    setWeeklyRecommendations(weeklyRecs);
  };

  return (
    <RecommendationContext.Provider
      value={{
        recommendations,
        weeklyRecommendations,
        learningHistory,
        recordActivity,
        getRecommendations,
        getWeeklyRecommendations,
        refreshRecommendations
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
}

export function useRecommendations() {
  const context = useContext(RecommendationContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationProvider');
  }
  return context;
}
