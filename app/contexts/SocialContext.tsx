"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  totalXP: number;
  streak: number;
  isOnline: boolean;
  currentActivity?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  level: number;
  totalXP: number;
  streak: number;
  isCurrentUser?: boolean;
}

interface SocialContextType {
  friends: Friend[];
  pendingRequests: Friend[];
  leaderboard: LeaderboardEntry[];
  addFriend: (friendId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  acceptFriendRequest: (friendId: string) => Promise<void>;
  declineFriendRequest: (friendId: string) => Promise<void>;
  getLeaderboard: (type: 'global' | 'friends' | 'weekly') => Promise<LeaderboardEntry[]>;
  shareAchievement: (achievementId: string) => void;
  shareProgress: (courseId: string) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export function SocialProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Load friends from Supabase
  useEffect(() => {
    if (!currentUser) return;

    const loadFriends = async () => {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          friend_id,
          profiles!friends_friend_id_fkey (
            id,
            name,
            avatar_url,
            gamification_stats (
              total_xp,
              level,
              streak_days
            )
          )
        `)
        .eq('user_id', currentUser.id)
        .eq('status', 'accepted');

      if (error) {
        console.error('Error loading friends:', error);
        return;
      }

      const friendData: Friend[] = (data || []).map((f: any) => ({
        id: f.profiles.id,
        name: f.profiles.name,
        avatar: f.profiles.avatar_url,
        level: f.profiles.gamification_stats?.level || 1,
        totalXP: f.profiles.gamification_stats?.total_xp || 0,
        streak: f.profiles.gamification_stats?.streak_days || 0,
        isOnline: false,
      }));

      setFriends(friendData);
    };

    loadFriends();
  }, [currentUser]);

  // Load pending requests from Supabase
  useEffect(() => {
    if (!currentUser) return;

    const loadPendingRequests = async () => {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          user_id,
          profiles!friends_user_id_fkey (
            id,
            name,
            avatar_url,
            gamification_stats (
              total_xp,
              level,
              streak_days
            )
          )
        `)
        .eq('friend_id', currentUser.id)
        .eq('status', 'pending');

      if (error) {
        console.error('Error loading pending requests:', error);
        return;
      }

      const requestData: Friend[] = (data || []).map((f: any) => ({
        id: f.profiles.id,
        name: f.profiles.name,
        avatar: f.profiles.avatar_url,
        level: f.profiles.gamification_stats?.level || 1,
        totalXP: f.profiles.gamification_stats?.total_xp || 0,
        streak: f.profiles.gamification_stats?.streak_days || 0,
        isOnline: false,
      }));

      setPendingRequests(requestData);
    };

    loadPendingRequests();
  }, [currentUser]);

  const addFriend = useCallback(async (friendId: string) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('friends')
      .insert({
        user_id: currentUser.id,
        friend_id: friendId,
        status: 'pending',
      });

    if (error) {
      console.error('Error sending friend request:', error);
    }
  }, [currentUser]);

  const removeFriend = useCallback(async (friendId: string) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('friends')
      .delete()
      .or(`user_id.eq.${currentUser.id},friend_id.eq.${currentUser.id}`)
      .eq('friend_id', friendId);

    if (error) {
      console.error('Error removing friend:', error);
      return;
    }

    setFriends(prev => prev.filter(f => f.id !== friendId));
  }, [currentUser]);

  const acceptFriendRequest = useCallback(async (friendId: string) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('user_id', friendId)
      .eq('friend_id', currentUser.id);

    if (error) {
      console.error('Error accepting friend request:', error);
      return;
    }

    setPendingRequests(prev => prev.filter(r => r.id !== friendId));
  }, [currentUser]);

  const declineFriendRequest = useCallback(async (friendId: string) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('user_id', friendId)
      .eq('friend_id', currentUser.id);

    if (error) {
      console.error('Error declining friend request:', error);
      return;
    }

    setPendingRequests(prev => prev.filter(r => r.id !== friendId));
  }, [currentUser]);

  const getLeaderboard = useCallback(async (type: 'global' | 'friends' | 'weekly'): Promise<LeaderboardEntry[]> => {
    if (!currentUser) return [];

    if (type === 'friends') {
      const friendEntries = friends.map((friend, index) => ({
        rank: index + 1,
        userId: friend.id,
        name: friend.name,
        avatar: friend.avatar,
        level: friend.level,
        totalXP: friend.totalXP,
        streak: friend.streak
      }));
      return friendEntries.sort((a, b) => b.totalXP - a.totalXP);
    }

    const viewName = type === 'weekly' ? 'weekly_leaderboard_view' : 'leaderboard_view';
    const { data, error } = await supabase
      .from(viewName)
      .select('*');

    if (error) {
      console.error('Error loading leaderboard:', error);
      return [];
    }

    const leaderboardData: LeaderboardEntry[] = (data || []).map((entry: any) => ({
      rank: entry.rank,
      userId: entry.user_id,
      name: entry.name,
      avatar: entry.avatar,
      level: entry.level,
      totalXP: entry.total_xp,
      streak: entry.streak,
      isCurrentUser: entry.user_id === currentUser.id,
    }));

    setLeaderboard(leaderboardData);
    return leaderboardData;
  }, [currentUser, friends]);

  const shareAchievement = useCallback((achievementId: string) => {
    console.log(`Sharing achievement ${achievementId}`);
    alert('Achievement shared! 🎉');
  }, []);

  const shareProgress = useCallback((courseId: string) => {
    console.log(`Sharing progress for course ${courseId}`);
    alert('Progress shared! 📚');
  }, []);

  return (
    <SocialContext.Provider
      value={{
        friends,
        pendingRequests,
        leaderboard,
        addFriend,
        removeFriend,
        acceptFriendRequest,
        declineFriendRequest,
        getLeaderboard,
        shareAchievement,
        shareProgress
      }}
    >
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
}
