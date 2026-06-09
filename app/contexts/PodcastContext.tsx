"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';

export interface EduCast {
  id: string;
  title: string;
  description: string;
  host: string;
  duration: number; // in seconds
  audioUrl: string;
  coverImage?: string;
  courseId?: string;
  topics: string[];
  publishedAt: Date;
  transcript?: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  currentEduCast: EduCast | null;
}

interface PodcastContextType {
  eduCasts: EduCast[];
  playbackState: PlaybackState;
  playEduCast: (eduCast: EduCast) => void;
  pausePlayback: () => void;
  resumePlayback: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  skipForward: (seconds: number) => void;
  skipBackward: (seconds: number) => void;
  getCurrentEduCast: () => EduCast | null;
  getEduCastById: (id: string) => EduCast | undefined;
}

const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

// Mock EduCast data
const MOCK_EDUCASTS: EduCast[] = [
  {
    id: 'ecast-1',
    title: 'Introduction to Problem Solving',
    description: 'Learn the fundamentals of systematic problem solving in this comprehensive audio lesson.',
    host: 'Dr. Sarah Chen',
    duration: 1800, // 30 minutes
    audioUrl: '/audio/problem-solving-intro.mp3',
    courseId: 'problem-solving',
    topics: ['problem solving', 'critical thinking', 'decision making'],
    publishedAt: new Date('2024-01-15'),
    transcript: 'Welcome to this introduction to problem solving...'
  },
  {
    id: 'ecast-2',
    title: 'Decision Making Under Pressure',
    description: 'Master the art of making quick, effective decisions when the stakes are high.',
    host: 'Prof. Michael Torres',
    duration: 2400, // 40 minutes
    audioUrl: '/audio/decision-making-pressure.mp3',
    courseId: 'decision-making',
    topics: ['decision making', 'pressure management', 'leadership'],
    publishedAt: new Date('2024-02-01'),
    transcript: 'In this episode, we explore decision making under pressure...'
  },
  {
    id: 'ecast-3',
    title: 'Building Effective Teams',
    description: 'Discover the key principles for creating and maintaining high-performing teams.',
    host: 'Dr. Emily Watson',
    duration: 2100, // 35 minutes
    audioUrl: '/audio/team-building.mp3',
    courseId: 'team-person',
    topics: ['teamwork', 'leadership', 'communication'],
    publishedAt: new Date('2024-02-15'),
    transcript: 'Building effective teams is both an art and a science...'
  },
  {
    id: 'ecast-4',
    title: 'Critical Thinking in Daily Life',
    description: 'Apply critical thinking skills to everyday situations and decisions.',
    host: 'Dr. Sarah Chen',
    duration: 1500, // 25 minutes
    audioUrl: '/audio/critical-thinking-daily.mp3',
    courseId: 'problem-solving',
    topics: ['critical thinking', 'daily application', 'decision making'],
    publishedAt: new Date('2024-03-01'),
    transcript: 'Critical thinking isn\'t just for academics...'
  },
  {
    id: 'ecast-5',
    title: 'The Psychology of Decision Making',
    description: 'Understand the cognitive biases and psychological factors that influence our choices.',
    host: 'Prof. Michael Torres',
    duration: 2700, // 45 minutes
    audioUrl: '/audio/psychology-decision.mp3',
    courseId: 'decision-making',
    topics: ['psychology', 'cognitive bias', 'decision making'],
    publishedAt: new Date('2024-03-15'),
    transcript: 'Our decisions are influenced by countless psychological factors...'
  }
];

export function PodcastProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [eduCasts, setEduCasts] = useState<EduCast[]>(MOCK_EDUCASTS);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    currentEduCast: null
  });

  // Load playback state from Supabase
  useEffect(() => {
    if (!currentUser) return;

    const loadPlaybackState = async () => {
      const { data, error } = await supabase
        .from('podcast_playback_state')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (error) {
        return;
      }

      if (data) {
        const eduCast = data.current_edu_cast_id ? eduCasts.find(c => c.id === data.current_edu_cast_id) || null : null;
        setPlaybackState({
          isPlaying: data.is_playing || false,
          currentTime: data.current_position || 0,
          duration: eduCast?.duration || 0,
          volume: 1,
          playbackRate: data.playback_speed || 1,
          currentEduCast: eduCast
        });
      }
    };

    loadPlaybackState();
  }, [currentUser, eduCasts]);

  // Save playback state to Supabase
  useEffect(() => {
    if (!currentUser) return;

    const savePlaybackState = async () => {
      const { error } = await supabase
        .from('podcast_playback_state')
        .upsert({
          user_id: currentUser.id,
          current_edu_cast_id: playbackState.currentEduCast?.id || null,
          current_position: playbackState.currentTime,
          is_playing: playbackState.isPlaying,
          playback_speed: playbackState.playbackRate,
          updated_at: new Date().toISOString()
        });

    };

    savePlaybackState();
  }, [playbackState, currentUser]);

  const playEduCast = (eduCast: EduCast) => {
    setPlaybackState({
      isPlaying: true,
      currentTime: 0,
      duration: eduCast.duration,
      volume: playbackState.volume,
      playbackRate: playbackState.playbackRate,
      currentEduCast: eduCast
    });
  };

  const pausePlayback = () => {
    setPlaybackState(prev => ({ ...prev, isPlaying: false }));
  };

  const resumePlayback = () => {
    setPlaybackState(prev => ({ ...prev, isPlaying: true }));
  };

  const seekTo = (time: number) => {
    setPlaybackState(prev => ({ ...prev, currentTime: Math.max(0, Math.min(time, prev.duration)) }));
  };

  const setVolume = (volume: number) => {
    setPlaybackState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  };

  const setPlaybackRate = (rate: number) => {
    setPlaybackState(prev => ({ ...prev, playbackRate: rate }));
  };

  const skipForward = (seconds: number) => {
    setPlaybackState(prev => ({
      ...prev,
      currentTime: Math.min(prev.currentTime + seconds, prev.duration)
    }));
  };

  const skipBackward = (seconds: number) => {
    setPlaybackState(prev => ({
      ...prev,
      currentTime: Math.max(prev.currentTime - seconds, 0)
    }));
  };

  const getCurrentEduCast = (): EduCast | null => {
    return playbackState.currentEduCast;
  };

  const getEduCastById = (id: string): EduCast | undefined => {
    return eduCasts.find(c => c.id === id);
  };

  return (
    <PodcastContext.Provider
      value={{
        eduCasts,
        playbackState,
        playEduCast,
        pausePlayback,
        resumePlayback,
        seekTo,
        setVolume,
        setPlaybackRate,
        skipForward,
        skipBackward,
        getCurrentEduCast,
        getEduCastById
      }}
    >
      {children}
    </PodcastContext.Provider>
  );
}

export function usePodcast() {
  const context = useContext(PodcastContext);
  if (context === undefined) {
    throw new Error('usePodcast must be used within a PodcastProvider');
  }
  return context;
}
