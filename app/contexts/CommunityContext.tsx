"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  courseId: string;
  creatorId: string;
  memberCount: number;
  isPublic: boolean;
  createdAt: Date;
  isMember?: boolean;
  isCreator?: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  courseId: string | undefined;
  topic: string;
  likes: number;
  replies: number;
  views: number;
  createdAt: Date;
  isLiked?: boolean;
}

export interface ForumReply {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  likes: number;
  createdAt: Date;
  isLiked?: boolean;
}

interface CommunityContextType {
  studyGroups: StudyGroup[];
  forumPosts: ForumPost[];
  loading: boolean;
  createStudyGroup: (name: string, description: string, courseId: string, isPublic: boolean) => Promise<void>;
  joinStudyGroup: (groupId: string) => Promise<void>;
  leaveStudyGroup: (groupId: string) => Promise<void>;
  createForumPost: (title: string, content: string, topic: string, courseId?: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  replyToPost: (postId: string, content: string) => Promise<void>;
  getPostReplies: (postId: string) => Promise<ForumReply[]>;
  refreshStudyGroups: () => Promise<void>;
  refreshForumPosts: () => Promise<void>;
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      refreshStudyGroups();
      refreshForumPosts();
    }
  }, [currentUser]);

  const refreshStudyGroups = async () => {
    if (!currentUser) return;
    setLoading(true);

    try {
      const { data: groups, error } = await supabase
        .from('study_groups')
        .select(`
          *,
          study_group_members(user_id)
        `)
        .or(`is_public.eq.true,creator_id.eq.${currentUser.id}`);

      if (error) throw error;

      const formattedGroups = (groups || []).map((g: any) => ({
        id: g.id,
        name: g.name,
        description: g.description,
        courseId: g.course_id,
        creatorId: g.creator_id,
        memberCount: g.member_count || 0,
        isPublic: g.is_public,
        createdAt: new Date(g.created_at),
        isMember: g.study_group_members?.some((m: any) => m.user_id === currentUser.id),
        isCreator: g.creator_id === currentUser.id,
      }));

      setStudyGroups(formattedGroups);
    } catch (error) {
      // Error loading study groups
    } finally {
      setLoading(false);
    }
  };

  const refreshForumPosts = async () => {
    if (!currentUser) return;
    setLoading(true);

    try {
      const { data: posts, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profiles:author_id(full_name, avatar_url),
          post_likes(user_id)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedPosts = (posts || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        content: p.content,
        authorId: p.author_id,
        authorName: p.profiles?.full_name || 'Anonymous',
        authorAvatar: p.profiles?.avatar_url,
        courseId: p.course_id,
        topic: p.topic,
        likes: p.likes || 0,
        replies: p.replies || 0,
        views: p.views || 0,
        createdAt: new Date(p.created_at),
        isLiked: p.post_likes?.some((l: any) => l.user_id === currentUser.id),
      }));

      setForumPosts(formattedPosts);
    } catch (error) {
      // Error loading forum posts
    } finally {
      setLoading(false);
    }
  };

  const createStudyGroup = async (name: string, description: string, courseId: string, isPublic: boolean) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('study_groups')
        .insert({
          name,
          description,
          course_id: courseId,
          creator_id: currentUser.id,
          is_public: isPublic,
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join the group as creator
      await supabase.from('study_group_members').insert({
        study_group_id: data.id,
        user_id: currentUser.id,
        role: 'creator',
      });

      await refreshStudyGroups();
    } catch (error) {
      throw error;
    }
  };

  const joinStudyGroup = async (groupId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase.from('study_group_members').insert({
        study_group_id: groupId,
        user_id: currentUser.id,
        role: 'member',
      });

      if (error) throw error;

      await refreshStudyGroups();
    } catch (error) {
      throw error;
    }
  };

  const leaveStudyGroup = async (groupId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('study_group_members')
        .delete()
        .eq('study_group_id', groupId)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      await refreshStudyGroups();
    } catch (error) {
      throw error;
    }
  };

  const createForumPost = async (title: string, content: string, topic: string, courseId?: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase.from('forum_posts').insert({
        title,
        content,
        author_id: currentUser.id,
        course_id: courseId,
        topic,
      });

      if (error) throw error;

      await refreshForumPosts();
    } catch (error) {
      throw error;
    }
  };

  const likePost = async (postId: string) => {
    if (!currentUser) return;

    try {
      const post = forumPosts.find(p => p.id === postId);
      if (!post) return;

      if (post.isLiked) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUser.id);

        await supabase
          .from('forum_posts')
          .update({ likes: post.likes - 1 })
          .eq('id', postId);
      } else {
        // Like
        await supabase.from('post_likes').insert({
          post_id: postId,
          user_id: currentUser.id,
        });

        await supabase
          .from('forum_posts')
          .update({ likes: post.likes + 1 })
          .eq('id', postId);
      }

      await refreshForumPosts();
    } catch (error) {
      throw error;
    }
  };

  const replyToPost = async (postId: string, content: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase.from('forum_replies').insert({
        post_id: postId,
        content,
        author_id: currentUser.id,
      });

      if (error) throw error;

      // Increment reply count
      const post = forumPosts.find(p => p.id === postId);
      if (post) {
        await supabase
          .from('forum_posts')
          .update({ replies: post.replies + 1 })
          .eq('id', postId);
      }

      await refreshForumPosts();
    } catch (error) {
      throw error;
    }
  };

  const getPostReplies = async (postId: string): Promise<ForumReply[]> => {
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .select(`
          *,
          profiles:author_id(full_name, avatar_url),
          reply_likes(user_id)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map((r: any) => ({
        id: r.id,
        postId: r.post_id,
        content: r.content,
        authorId: r.author_id,
        authorName: r.profiles?.full_name || 'Anonymous',
        authorAvatar: r.profiles?.avatar_url,
        likes: r.likes || 0,
        createdAt: new Date(r.created_at),
        isLiked: r.reply_likes?.some((l: any) => l.user_id === currentUser?.id),
      }));
    } catch (error) {
      return [];
    }
  };

  return (
    <CommunityContext.Provider
      value={{
        studyGroups,
        forumPosts,
        loading,
        createStudyGroup,
        joinStudyGroup,
        leaveStudyGroup,
        createForumPost,
        likePost,
        replyToPost,
        getPostReplies,
        refreshStudyGroups,
        refreshForumPosts,
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
}
