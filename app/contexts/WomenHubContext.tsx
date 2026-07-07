"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';

export interface Mentor {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  expertise: string[];
  availability: string;
  rating: number;
  reviews: number;
  isVerified: boolean;
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  menteeId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message: string;
  createdAt: Date;
  mentor?: Mentor;
}

export interface WomenStudyGroup {
  id: string;
  name: string;
  description: string;
  topic: string;
  memberCount: number;
  isPrivate: boolean;
  creatorId: string;
  createdAt: Date;
  isMember?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'tool';
  url: string;
  category: string;
  addedBy: string;
  addedAt: Date;
}

interface WomenHubContextType {
  mentors: Mentor[];
  mentorshipRequests: MentorshipRequest[];
  studyGroups: WomenStudyGroup[];
  resources: Resource[];
  loading: boolean;
  requestMentorship: (mentorId: string, message: string) => Promise<void>;
  acceptMentorship: (requestId: string) => Promise<void>;
  createWomenStudyGroup: (name: string, description: string, topic: string, isPrivate: boolean) => Promise<void>;
  joinWomenStudyGroup: (groupId: string) => Promise<void>;
  addResource: (title: string, description: string, type: Resource['type'], url: string, category: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const WomenHubContext = createContext<WomenHubContextType | undefined>(undefined);

export function WomenHubProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [studyGroups, setStudyGroups] = useState<WomenStudyGroup[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
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
      // Load mentors
      const { data: mentorsData, error: mentorsError } = await supabase
        .from('mentors')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (!mentorsError && mentorsData) {
        const formattedMentors = mentorsData.map((m: any) => ({
          id: m.id,
          name: m.name,
          avatar: m.avatar_url,
          bio: m.bio,
          expertise: m.expertise || [],
          availability: m.availability,
          rating: m.rating || 0,
          reviews: m.reviews || 0,
          isVerified: m.is_verified || false,
        }));
        setMentors(formattedMentors);
      }

      // Load mentorship requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('mentorship_requests')
        .select(`
          *,
          mentors:mentor_id(*)
        `)
        .or(`mentee_id.eq.${currentUser.id},mentor_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (!requestsError && requestsData) {
        const formattedRequests = requestsData.map((r: any) => ({
          id: r.id,
          mentorId: r.mentor_id,
          menteeId: r.mentee_id,
          status: r.status,
          message: r.message,
          createdAt: new Date(r.created_at),
          mentor: r.mentors ? {
            id: r.mentors.id,
            name: r.mentors.name,
            avatar: r.mentors.avatar_url,
            bio: r.mentors.bio,
            expertise: r.mentors.expertise || [],
            availability: r.mentors.availability,
            rating: r.mentors.rating || 0,
            reviews: r.mentors.reviews || 0,
            isVerified: r.mentors.is_verified || false,
          } : undefined,
        }));
        setMentorshipRequests(formattedRequests);
      }

      // Load women's study groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('women_study_groups')
        .select(`
          *,
          women_study_group_members(user_id)
        `)
        .order('member_count', { ascending: false });

      if (!groupsError && groupsData) {
        const formattedGroups = groupsData.map((g: any) => ({
          id: g.id,
          name: g.name,
          description: g.description,
          topic: g.topic,
          memberCount: g.member_count || 0,
          isPrivate: g.is_private,
          creatorId: g.creator_id,
          createdAt: new Date(g.created_at),
          isMember: g.women_study_group_members?.some((m: any) => m.user_id === currentUser.id),
        }));
        setStudyGroups(formattedGroups);
      }

      // Load resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('women_resources')
        .select('*')
        .order('added_at', { ascending: false })
        .limit(50);

      if (!resourcesError && resourcesData) {
        const formattedResources = resourcesData.map((r: any) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          type: r.type,
          url: r.url,
          category: r.category,
          addedBy: r.added_by,
          addedAt: new Date(r.added_at),
        }));
        setResources(formattedResources);
      }
    } catch (error) {
      // Error loading women hub data
    } finally {
      setLoading(false);
    }
  };

  const requestMentorship = async (mentorId: string, message: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase.from('mentorship_requests').insert({
        mentor_id: mentorId,
        mentee_id: currentUser.id,
        message,
        status: 'pending',
      });

      if (error) throw error;

      await refreshData();
    } catch (error) {
      throw error;
    }
  };

  const acceptMentorship = async (requestId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('mentorship_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;

      await refreshData();
    } catch (error) {
      throw error;
    }
  };

  const createWomenStudyGroup = async (
    name: string,
    description: string,
    topic: string,
    isPrivate: boolean
  ) => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase.from('women_study_groups').insert({
        name,
        description,
        topic,
        is_private: isPrivate,
        creator_id: currentUser.id,
      }).select().single();

      if (error) throw error;

      // Auto-join as creator
      await supabase.from('women_study_group_members').insert({
        study_group_id: data.id,
        user_id: currentUser.id,
        role: 'creator',
      });

      await refreshData();
    } catch (error) {
      throw error;
    }
  };

  const joinWomenStudyGroup = async (groupId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase.from('women_study_group_members').insert({
        study_group_id: groupId,
        user_id: currentUser.id,
        role: 'member',
      });

      if (error) throw error;

      await refreshData();
    } catch (error) {
      throw error;
    }
  };

  const addResource = async (
    title: string,
    description: string,
    type: Resource['type'],
    url: string,
    category: string
  ) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase.from('women_resources').insert({
        title,
        description,
        type,
        url,
        category,
        added_by: currentUser.id,
      });

      if (error) throw error;

      await refreshData();
    } catch (error) {
      throw error;
    }
  };

  return (
    <WomenHubContext.Provider
      value={{
        mentors,
        mentorshipRequests,
        studyGroups,
        resources,
        loading,
        requestMentorship,
        acceptMentorship,
        createWomenStudyGroup,
        joinWomenStudyGroup,
        addResource,
        refreshData,
      }}
    >
      {children}
    </WomenHubContext.Provider>
  );
}

export function useWomenHub() {
  const context = useContext(WomenHubContext);
  if (context === undefined) {
    throw new Error('useWomenHub must be used within a WomenHubProvider');
  }
  return context;
}
