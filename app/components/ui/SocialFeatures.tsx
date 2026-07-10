"use client";

import { Users, Share2, Award, Trophy, MessageCircle, UserPlus, X, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useUser } from "../../contexts/UserContext";
import { useToast } from "../../contexts/ToastContext";

interface LeaderboardUser {
  id: string;
  full_name: string | null;
  xp: number;
  avatar_url?: string | null;
}

interface StudyGroup {
  id: string;
  name: string;
  skill: string;
  member_count: number;
  is_active: boolean;
}

interface Mentor {
  id: string;
  profiles?: { full_name: string | null; avatar_url?: string | null } | null;
  expertise: string;
  rating?: number;
  student_count?: number;
}

interface GroupMembership {
  study_group_id: string;
}

export default function SocialFeatures() {
  const { currentUser } = useUser();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'study-groups' | 'mentorship'>('leaderboard');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupSkill, setNewGroupSkill] = useState('general');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [userGroupMemberships, setUserGroupMemberships] = useState<GroupMembership[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !currentUser) return;

    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, xp, avatar_url')
        .order('xp', { ascending: false })
        .limit(5);
      if (data) setLeaderboardData(data);
    };

    // Fetch study groups
    const fetchStudyGroups = async () => {
      const { data } = await supabase
        .from('study_groups')
        .select('*')
        .order('member_count', { ascending: false });
      if (data) setStudyGroups(data);
    };

    // Fetch user's group memberships
    const fetchUserGroupMemberships = async () => {
      const { data } = await supabase
        .from('study_group_members')
        .select('study_group_id')
        .eq('user_id', currentUser.id);
      if (data) setUserGroupMemberships(data);
    };

    // Fetch mentors
    const fetchMentors = async () => {
      const { data } = await supabase
        .from('mentor_profiles')
        .select('*, profiles(full_name, avatar_url)')
        .order('rating', { ascending: false })
        .limit(3);
      if (data) setMentors(data);
    };

    fetchLeaderboard();
    fetchStudyGroups();
    fetchUserGroupMemberships();
    fetchMentors();
  }, [mounted, currentUser]);

  const handleCreateGroup = async () => {
    if (!currentUser) {
      showToast('Please sign in to create a study group', 'error');
      return;
    }
    if (!newGroupName) {
      showToast('Please enter a group name', 'error');
      return;
    }

    try {
      const { data: groupData, error: groupError } = await supabase
        .from('study_groups')
        .insert({
          name: newGroupName,
          skill: newGroupSkill,
          description: newGroupDescription,
          member_count: 1,
          is_active: true,
        })
        .select()
        .single();

      if (groupError) {
        showToast('Failed to create study group. Please try again.', 'error');
        return;
      }

      // Add the creator as a member
      const { error: memberError } = await supabase
        .from('study_group_members')
        .insert({
          study_group_id: groupData.id,
          user_id: currentUser.id,
        });

      if (memberError) {
        showToast('Group created but failed to add you as a member.', 'error');
      } else {
        setNewGroupName('');
        setNewGroupSkill('general');
        setNewGroupDescription('');
        setShowCreateGroup(false);
        showToast('Study group created successfully!', 'success');
      }
    } catch (err) {
      showToast('An unexpected error occurred. Please try again.', 'error');
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!currentUser) {
      showToast('Please sign in to join a study group', 'error');
      return;
    }

    const isAlreadyMember = userGroupMemberships.some(m => m.study_group_id === groupId);
    if (isAlreadyMember) {
      showToast('You are already a member of this group', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('study_group_members')
        .insert({
          study_group_id: groupId,
          user_id: currentUser.id,
        });

      if (error) {
        showToast('Failed to join study group. Please try again.', 'error');
      } else {
        // Increment member count by fetching current count and updating
        const { data: groupData } = await supabase
          .from('study_groups')
          .select('member_count')
          .eq('id', groupId)
          .single();
        
        if (groupData) {
          await supabase
            .from('study_groups')
            .update({ member_count: (groupData.member_count || 0) + 1 })
            .eq('id', groupId);
        }
        showToast('Successfully joined the study group!', 'success');
      }
    } catch (err) {
      showToast('An unexpected error occurred. Please try again.', 'error');
    }
  };

  return (
    <div className="bg-[#181818] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-[#60a5fa]" />
          Community
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-[#60a5fa] text-black'
              : 'bg-[#282828] text-white hover:bg-[#333]'
          }`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('study-groups')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'study-groups'
              ? 'bg-[#60a5fa] text-black'
              : 'bg-[#282828] text-white hover:bg-[#333]'
          }`}
        >
          Study Groups
        </button>
        <button
          onClick={() => setActiveTab('mentorship')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'mentorship'
              ? 'bg-[#60a5fa] text-black'
              : 'bg-[#282828] text-white hover:bg-[#333]'
          }`}
        >
          Mentorship
        </button>
      </div>

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          {!mounted ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-[#282828] rounded-lg" />
              ))}
            </div>
          ) : leaderboardData.length > 0 ? (
            leaderboardData.map((user, index) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-3 bg-[#282828] rounded-lg hover:bg-[#333] transition-colors"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-[#181818]'
                }`}>
                  {index + 1}
                </div>
                <div className="w-10 h-10 rounded-full bg-[#60a5fa] flex items-center justify-center text-black font-bold">
                  {user.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{user.full_name || 'Anonymous'}</p>
                  <p className="text-xs text-[#b3b3b3]">{user.xp?.toLocaleString() || 0} XP</p>
                </div>
                <Trophy className="w-5 h-5 text-[#60a5fa]" />
              </div>
            ))
          ) : (
            <p className="text-sm text-[#b3b3b3] text-center py-8">No leaderboard data available</p>
          )}
        </div>
      )}

      {/* Study Groups Tab */}
      {activeTab === 'study-groups' && (
        <div className="space-y-3">
          {!mounted ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-[#282828] rounded-lg" />
              ))}
            </div>
          ) : studyGroups.length > 0 ? (
            studyGroups.map((group) => (
              <div
                key={group.id}
                className="p-4 bg-[#282828] rounded-lg hover:bg-[#333] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{group.name}</h4>
                    <p className="text-xs text-[#b3b3b3]">Focus: {group.skill}</p>
                  </div>
                  {group.is_active && (
                    <div className="w-2 h-2 rounded-full bg-[#60a5fa]" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#b3b3b3]">
                    <Users className="w-4 h-4" />
                    <span>{group.member_count} members</span>
                  </div>
                  <button
                    onClick={() => handleJoinGroup(group.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold hover:scale-105 transition-transform ${
                      userGroupMemberships.some(m => m.study_group_id === group.id)
                        ? 'bg-[#282828] text-[#b3b3b3] cursor-not-allowed'
                        : 'bg-[#60a5fa] text-black'
                    }`}
                    disabled={userGroupMemberships.some(m => m.study_group_id === group.id)}
                  >
                    {userGroupMemberships.some(m => m.study_group_id === group.id) ? 'Joined' : 'Join'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#b3b3b3] text-center py-8">No study groups available</p>
          )}
          <button onClick={() => setShowCreateGroup(true)} className="w-full py-3 border-2 border-dashed border-[#282828] rounded-lg text-[#b3b3b3] text-sm font-bold hover:border-[#60a5fa] hover:text-[#60a5fa] transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Create Study Group
          </button>

          {/* Create Group Modal */}
          {showCreateGroup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white">Create Study Group</h4>
                  <button onClick={() => setShowCreateGroup(false)} className="text-[#b3b3b3] hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#b3b3b3] mb-1 block">Group Name</label>
                    <input
                      type="text"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      className="w-full bg-[#181818] text-white px-3 py-2 rounded-lg border border-[#3a3a3a] focus:border-[#60a5fa] outline-none"
                      placeholder="Enter group name"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#b3b3b3] mb-1 block">Skill/Focus</label>
                    <select
                      value={newGroupSkill}
                      onChange={(e) => setNewGroupSkill(e.target.value)}
                      className="w-full bg-[#181818] text-white px-3 py-2 rounded-lg border border-[#3a3a3a] focus:border-[#60a5fa] outline-none"
                    >
                      <option value="general">General</option>
                      <option value="programming">Programming</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="languages">Languages</option>
                      <option value="science">Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#b3b3b3] mb-1 block">Description (Optional)</label>
                    <textarea
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                      className="w-full bg-[#181818] text-white px-3 py-2 rounded-lg border border-[#3a3a3a] focus:border-[#60a5fa] outline-none min-h-[80px]"
                      placeholder="Describe your study group"
                    />
                  </div>
                  <button
                    onClick={handleCreateGroup}
                    className="w-full py-3 bg-[#60a5fa] text-black font-bold rounded-lg hover:scale-105 transition-transform"
                  >
                    Create Group
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mentorship Tab */}
      {activeTab === 'mentorship' && (
        <div className="space-y-3">
          {!mounted ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-[#282828] rounded-lg" />
              ))}
            </div>
          ) : mentors.length > 0 ? (
            mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="p-4 bg-[#282828] rounded-lg hover:bg-[#333] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#60a5fa]/60 flex items-center justify-center text-black font-bold">
                    {mentor.profiles?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'M'}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white mb-1">{mentor.profiles?.full_name || 'Anonymous'}</h4>
                    <p className="text-xs text-[#b3b3b3] mb-2">{mentor.expertise}</p>
                    <div className="flex items-center gap-3 text-xs text-[#b3b3b3]">
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-yellow-500" />
                        {mentor.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {mentor.student_count} students
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2 rounded-full bg-[#60a5fa] text-black text-sm font-bold hover:scale-105 transition-transform">
                  Request Mentorship
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#b3b3b3] text-center py-8">No mentors available</p>
          )}
        </div>
      )}
    </div>
  );
}
