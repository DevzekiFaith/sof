"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courses: string[];
  estimatedDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  completionRate: number;
  recommendedFor: string[];
}

export interface PersonalizedRecommendation {
  courseId: string;
  courseName: string;
  reason: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
}

interface AIRecommendationContextType {
  learningPaths: LearningPath[];
  personalizedRecommendations: PersonalizedRecommendation[];
  loading: boolean;
  generateRecommendations: () => Promise<void>;
  getLearningPath: (pathId: string) => LearningPath | undefined;
  refreshData: () => Promise<void>;
}

const AIRecommendationContext = createContext<AIRecommendationContextType | undefined>(undefined);

export function AIRecommendationProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser]);

  const refreshData = async () => {
    if (!currentUser) return;
    setLoading(true);

    try {
      // Load learning paths
      const { data: pathsData, error: pathsError } = await supabase
        .from('learning_paths')
        .select('*')
        .order('completion_rate', { ascending: false });

      if (!pathsError && pathsData) {
        const formattedPaths = pathsData.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          courses: p.courses || [],
          estimatedDuration: p.estimated_duration,
          difficulty: p.difficulty,
          category: p.category,
          completionRate: p.completion_rate || 0,
          recommendedFor: p.recommended_for || [],
        }));
        setLearningPaths(formattedPaths);
      }

      // Load personalized recommendations
      await generateRecommendations();
    } catch (error) {
      // Error loading AI recommendations
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    if (!currentUser) return;

    try {
      // Get user's learning history
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('course_id, completed, module_index')
        .eq('user_id', currentUser.id);

      const completedCourses = (progressData || [])
        .filter((p: any) => p.completed)
        .map((p: any) => p.course_id);

      const inProgressCourses = (progressData || [])
        .filter((p: any) => !p.completed)
        .map((p: any) => p.course_id);

      // Get user profile/preferences
      const { data: profileData } = await supabase
        .from('profiles')
        .select('learning_goal, time_available, interests')
        .eq('id', currentUser.id)
        .single();

      // Simulate AI recommendation logic
      // In production, this would call an AI service like OpenAI
      const recommendations: PersonalizedRecommendation[] = [];

      // Recommend based on completed courses (sequencing)
      if (completedCourses.length > 0) {
        const lastCourse = completedCourses[completedCourses.length - 1];
        recommendations.push({
          courseId: 'next-in-sequence',
          courseName: 'Advanced Decision-Making',
          reason: 'You completed the foundational course. This advanced module builds on those skills.',
          confidence: 0.9,
          priority: 'high',
        });
      }

      // Recommend based on learning goal
      if (profileData?.learning_goal === 'job') {
        recommendations.push({
          courseId: 'career-skills',
          courseName: 'Professional Communication',
          reason: 'Aligned with your goal of improving job skills.',
          confidence: 0.85,
          priority: 'high',
        });
      } else if (profileData?.learning_goal === 'business') {
        recommendations.push({
          courseId: 'entrepreneurship',
          courseName: 'Business Fundamentals',
          reason: 'Perfect for starting or growing your business.',
          confidence: 0.85,
          priority: 'high',
        });
      }

      // Recommend based on time availability
      if (profileData?.time_available === '5-15') {
        recommendations.push({
          courseId: 'quick-learn',
          courseName: 'Micro-Learning Modules',
          reason: 'Short lessons that fit your schedule.',
          confidence: 0.8,
          priority: 'medium',
        });
      }

      // Recommend popular courses
      recommendations.push({
        courseId: 'popular',
        courseName: 'Self-Image Mastery',
        reason: 'Highly rated by learners with similar profiles.',
        confidence: 0.75,
        priority: 'medium',
      });

      setPersonalizedRecommendations(recommendations.slice(0, 5));
    } catch (error) {
      // Error generating recommendations
    }
  };

  const getLearningPath = (pathId: string): LearningPath | undefined => {
    return learningPaths.find(p => p.id === pathId);
  };

  return (
    <AIRecommendationContext.Provider
      value={{
        learningPaths,
        personalizedRecommendations,
        loading,
        generateRecommendations,
        getLearningPath,
        refreshData,
      }}
    >
      {children}
    </AIRecommendationContext.Provider>
  );
}

export function useAIRecommendation() {
  const context = useContext(AIRecommendationContext);
  if (context === undefined) {
    throw new Error('useAIRecommendation must be used within an AIRecommendationProvider');
  }
  return context;
}
