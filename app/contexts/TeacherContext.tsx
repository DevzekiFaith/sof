"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';

export interface StudentProgress {
  userId: string;
  userName: string;
  userAvatar?: string;
  courseId: string;
  courseName: string;
  moduleIndex: number;
  completed: boolean;
  lastAccessed: Date;
  quizScore?: number;
  timeSpent: number; // in minutes
}

export interface ClassStats {
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  averageQuizScore: number;
  totalCompletions: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  moduleIndex: number;
  dueDate: Date;
  submissions: number;
  totalStudents: number;
  createdAt: Date;
}

interface TeacherContextType {
  isTeacher: boolean;
  students: StudentProgress[];
  classStats: ClassStats;
  assignments: Assignment[];
  loading: boolean;
  createAssignment: (title: string, description: string, courseId: string, moduleIndex: number, dueDate: Date) => Promise<void>;
  gradeSubmission: (assignmentId: string, studentId: string, score: number, feedback: string) => Promise<void>;
  getStudentProgress: (studentId: string) => Promise<StudentProgress[]>;
  refreshData: () => Promise<void>;
}

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export function TeacherProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [isTeacher, setIsTeacher] = useState(false);
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [classStats, setClassStats] = useState<ClassStats>({
    totalStudents: 0,
    activeStudents: 0,
    averageProgress: 0,
    averageQuizScore: 0,
    totalCompletions: 0,
  });
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      checkTeacherStatus();
      refreshData();
    }
  }, [currentUser]);

  const checkTeacherStatus = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (!error && data) {
        setIsTeacher(data.role === 'teacher' || data.role === 'admin');
      }
    } catch (error) {
      // Error checking teacher status
    }
  };

  const refreshData = async () => {
    if (!currentUser || !isTeacher) return;
    setLoading(true);

    try {
      // Load student progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select(`
          *,
          profiles:user_id(full_name, avatar_url),
          courses:course_id(title)
        `)
        .order('last_accessed', { ascending: false });

      if (progressError) throw progressError;

      const formattedStudents = (progressData || []).map((p: any) => ({
        userId: p.user_id,
        userName: p.profiles?.full_name || 'Anonymous',
        userAvatar: p.profiles?.avatar_url,
        courseId: p.course_id,
        courseName: p.courses?.title || 'Unknown Course',
        moduleIndex: p.module_index,
        completed: p.completed,
        lastAccessed: new Date(p.last_accessed),
        quizScore: p.quiz_score,
        timeSpent: p.time_spent || 0,
      }));

      setStudents(formattedStudents);

      // Calculate class stats
      const totalStudents = new Set(formattedStudents.map(s => s.userId)).size;
      const activeStudents = formattedStudents.filter(
        s => new Date(s.lastAccessed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      const averageProgress = formattedStudents.length > 0
        ? formattedStudents.reduce((sum, s) => sum + (s.moduleIndex + 1), 0) / formattedStudents.length
        : 0;
      const averageQuizScore = formattedStudents.length > 0
        ? formattedStudents
            .filter(s => s.quizScore !== undefined)
            .reduce((sum, s) => sum + (s.quizScore || 0), 0) /
          formattedStudents.filter(s => s.quizScore !== undefined).length
        : 0;
      const totalCompletions = formattedStudents.filter(s => s.completed).length;

      setClassStats({
        totalStudents,
        activeStudents,
        averageProgress,
        averageQuizScore,
        totalCompletions,
      });

      // Load assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .eq('creator_id', currentUser.id)
        .order('due_date', { ascending: true });

      if (assignmentsError) throw assignmentsError;

      const formattedAssignments = (assignmentsData || []).map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        courseId: a.course_id,
        moduleIndex: a.module_index,
        dueDate: new Date(a.due_date),
        submissions: a.submissions || 0,
        totalStudents: a.total_students || 0,
        createdAt: new Date(a.created_at),
      }));

      setAssignments(formattedAssignments);
    } catch (error) {
      // Error loading teacher data
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (
    title: string,
    description: string,
    courseId: string,
    moduleIndex: number,
    dueDate: Date
  ) => {
    if (!currentUser || !isTeacher) return;

    try {
      const { error } = await supabase.from('assignments').insert({
        title,
        description,
        course_id: courseId,
        module_index: moduleIndex,
        due_date: dueDate.toISOString(),
        creator_id: currentUser.id,
      });

      if (error) throw error;

      await refreshData();
    } catch (error) {
      throw error;
    }
  };

  const gradeSubmission = async (
    assignmentId: string,
    studentId: string,
    score: number,
    feedback: string
  ) => {
    if (!currentUser || !isTeacher) return;

    try {
      const { error } = await supabase.from('assignment_submissions').update({
        score,
        feedback,
        graded_at: new Date().toISOString(),
        graded_by: currentUser.id,
      }).eq('assignment_id', assignmentId).eq('student_id', studentId);

      if (error) throw error;

      await refreshData();
    } catch (error) {
      throw error;
    }
  };

  const getStudentProgress = async (studentId: string): Promise<StudentProgress[]> => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select(`
          *,
          profiles:user_id(full_name, avatar_url),
          courses:course_id(title)
        `)
        .eq('user_id', studentId);

      if (error) throw error;

      return (data || []).map((p: any) => ({
        userId: p.user_id,
        userName: p.profiles?.full_name || 'Anonymous',
        userAvatar: p.profiles?.avatar_url,
        courseId: p.course_id,
        courseName: p.courses?.title || 'Unknown Course',
        moduleIndex: p.module_index,
        completed: p.completed,
        lastAccessed: new Date(p.last_accessed),
        quizScore: p.quiz_score,
        timeSpent: p.time_spent || 0,
      }));
    } catch (error) {
      return [];
    }
  };

  return (
    <TeacherContext.Provider
      value={{
        isTeacher,
        students,
        classStats,
        assignments,
        loading,
        createAssignment,
        gradeSubmission,
        getStudentProgress,
        refreshData,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeacher() {
  const context = useContext(TeacherContext);
  if (context === undefined) {
    throw new Error('useTeacher must be used within a TeacherProvider');
  }
  return context;
}
