"use client";

import { MessageSquare, Users, Calendar, Star, ThumbsUp, Clock, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { useUser } from "../../contexts/UserContext";
import { useToast } from "../../contexts/ToastContext";

export default function CommunityHub() {
  const { currentUser } = useUser();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'forums' | 'peer-review' | 'qa-sessions'>('forums');
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [peerReviews, setPeerReviews] = useState<any[]>([]);
  const [qaSessions, setQaSessions] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionCategory, setNewDiscussionCategory] = useState('general');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !currentUser) return;

    // Fetch forum posts
    const fetchForumPosts = async () => {
      const { data } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setForumPosts(data);
    };

    // Fetch peer review submissions
    const fetchPeerReviews = async () => {
      const { data } = await supabase
        .from('peer_review_submissions')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(3);
      if (data) setPeerReviews(data);
    };

    // Fetch Q&A sessions
    const fetchQaSessions = async () => {
      const { data } = await supabase
        .from('qa_sessions')
        .select('*')
        .order('session_date', { ascending: true })
        .limit(3);
      if (data) setQaSessions(data);
    };

    fetchForumPosts();
    fetchPeerReviews();
    fetchQaSessions();

    // Set up real-time subscription for forum posts
    const forumSubscription = supabase
      .channel('forum_posts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_posts' }, () => fetchForumPosts())
      .subscribe();

    return () => {
      forumSubscription.unsubscribe();
    };
  }, [mounted, currentUser]);

  const handleCreateDiscussion = async () => {
    if (!currentUser) {
      showToast('Please sign in to create discussions', 'error');
      return;
    }
    if (!newDiscussionTitle || !newDiscussionContent) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('forum_posts')
        .insert({
          user_id: currentUser.id,
          title: newDiscussionTitle,
          content: newDiscussionContent,
          category: newDiscussionCategory,
          reply_count: 0,
          view_count: 0,
        });

      if (error) {
        showToast('Failed to create discussion. Please try again.', 'error');
      } else {
        setNewDiscussionTitle('');
        setNewDiscussionCategory('general');
        setNewDiscussionContent('');
        setShowCreateDiscussion(false);
        showToast('Discussion created successfully!', 'success');
      }
    } catch (err) {
      showToast('An unexpected error occurred. Please try again.', 'error');
    }
  };

  return (
    <div className="bg-[#181818] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-[#1ed760]" />
          Community Hub
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('forums')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'forums'
              ? 'bg-[#1ed760] text-black'
              : 'bg-[#282828] text-white hover:bg-[#333]'
          }`}
        >
          Forums
        </button>
        <button
          onClick={() => setActiveTab('peer-review')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'peer-review'
              ? 'bg-[#1ed760] text-black'
              : 'bg-[#282828] text-white hover:bg-[#333]'
          }`}
        >
          Peer Review
        </button>
        <button
          onClick={() => setActiveTab('qa-sessions')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'qa-sessions'
              ? 'bg-[#1ed760] text-black'
              : 'bg-[#282828] text-white hover:bg-[#333]'
          }`}
        >
          Q&A Sessions
        </button>
      </div>

      {/* Forums Tab */}
      {activeTab === 'forums' && (
        <div className="space-y-3">
          {!mounted ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-[#282828] rounded-lg" />
              ))}
            </div>
          ) : forumPosts.length > 0 ? (
            forumPosts.map((forum) => (
              <div
                key={forum.id}
                className="p-4 bg-[#282828] rounded-lg hover:bg-[#333] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white mb-1">{forum.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-[#b3b3b3]">
                      <span className="px-2 py-0.5 rounded-full bg-[#1ed760]/20 text-[#1ed760]">{forum.category}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(forum.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#b3b3b3]">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {forum.reply_count} replies
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {forum.view_count} views
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#b3b3b3] text-center py-8">No forum posts available</p>
          )}
          <button onClick={() => setShowCreateDiscussion(true)} className="w-full py-3 border-2 border-dashed border-[#282828] rounded-lg text-[#b3b3b3] text-sm font-bold hover:border-[#1ed760] hover:text-[#1ed760] transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Discussion
          </button>

          {/* Create Discussion Modal */}
          {showCreateDiscussion && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-[#282828] p-6 rounded-lg w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white">Create Discussion</h4>
                  <button onClick={() => setShowCreateDiscussion(false)} className="text-[#b3b3b3] hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#b3b3b3] mb-1 block">Title</label>
                    <input
                      type="text"
                      value={newDiscussionTitle}
                      onChange={(e) => setNewDiscussionTitle(e.target.value)}
                      className="w-full bg-[#181818] text-white px-3 py-2 rounded-lg border border-[#3a3a3a] focus:border-[#1ed760] outline-none"
                      placeholder="Enter discussion title"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#b3b3b3] mb-1 block">Category</label>
                    <select
                      value={newDiscussionCategory}
                      onChange={(e) => setNewDiscussionCategory(e.target.value)}
                      className="w-full bg-[#181818] text-white px-3 py-2 rounded-lg border border-[#3a3a3a] focus:border-[#1ed760] outline-none"
                    >
                      <option value="general">General</option>
                      <option value="course">Course</option>
                      <option value="assignment">Assignment</option>
                      <option value="help">Help</option>
                      <option value="social">Social</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#b3b3b3] mb-1 block">Content</label>
                    <textarea
                      value={newDiscussionContent}
                      onChange={(e) => setNewDiscussionContent(e.target.value)}
                      className="w-full bg-[#181818] text-white px-3 py-2 rounded-lg border border-[#3a3a3a] focus:border-[#1ed760] outline-none min-h-[100px]"
                      placeholder="Enter your discussion content"
                    />
                  </div>
                  <button
                    onClick={handleCreateDiscussion}
                    className="w-full py-3 bg-[#1ed760] text-black font-bold rounded-lg hover:scale-105 transition-transform"
                  >
                    Create Discussion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Peer Review Tab */}
      {activeTab === 'peer-review' && (
        <div className="space-y-3">
          {!mounted ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-[#282828] rounded-lg" />
              ))}
            </div>
          ) : peerReviews.length > 0 ? (
            peerReviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-[#282828] rounded-lg hover:bg-[#333] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{review.title}</h4>
                    <p className="text-xs text-[#b3b3b3]">by {review.profiles?.full_name || 'Anonymous'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    review.status === 'urgent' ? 'bg-red-500 text-white' : 'bg-[#1ed760]/20 text-[#1ed760]'
                  }`}>
                    {review.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-[#b3b3b3]">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {review.submission_count} submissions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {review.deadline ? new Date(review.deadline).toLocaleDateString() : 'No deadline'}
                    </span>
                  </div>
                  <button className="px-3 py-1 rounded-full bg-[#1ed760] text-black text-xs font-bold hover:scale-105 transition-transform">
                    Review
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#b3b3b3] text-center py-8">No peer reviews available</p>
          )}
          <button className="w-full py-3 border-2 border-dashed border-[#282828] rounded-lg text-[#b3b3b3] text-sm font-bold hover:border-[#1ed760] hover:text-[#1ed760] transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Submit for Review
          </button>
        </div>
      )}

      {/* Q&A Sessions Tab */}
      {activeTab === 'qa-sessions' && (
        <div className="space-y-3">
          {!mounted ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-[#282828] rounded-lg" />
              ))}
            </div>
          ) : qaSessions.length > 0 ? (
            qaSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 bg-[#282828] rounded-lg hover:bg-[#333] transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{session.title}</h4>
                    <p className="text-xs text-[#b3b3b3]">by {session.instructor}</p>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-[#1ed760]/20 text-[#1ed760] text-[10px] font-bold">
                    {session.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-[#b3b3b3]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(session.session_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(session.session_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {session.attendee_count} attending
                    </span>
                  </div>
                  <button className="px-3 py-1 rounded-full bg-[#1ed760] text-black text-xs font-bold hover:scale-105 transition-transform">
                    Register
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#b3b3b3] text-center py-8">No Q&A sessions available</p>
          )}
          <button className="w-full py-3 border-2 border-dashed border-[#282828] rounded-lg text-[#b3b3b3] text-sm font-bold hover:border-[#1ed760] hover:text-[#1ed760] transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Request Q&A Session
          </button>
        </div>
      )}
    </div>
  );
}
