"use client";

import { useState } from 'react';
import { useCommunity } from '../contexts/CommunityContext';
import { Users, MessageSquare, Plus, Search, Filter } from 'lucide-react';

export default function CommunityPage() {
  const { studyGroups, forumPosts, loading, createStudyGroup, joinStudyGroup, leaveStudyGroup, createForumPost, likePost } = useCommunity();
  const [activeTab, setActiveTab] = useState<'groups' | 'forum'>('groups');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Community</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700 pb-4">
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'groups' ? 'bg-[#60a5fa] text-black' : 'bg-[#282828] text-white hover:bg-[#333]'
            }`}
          >
            <Users className="w-5 h-5" />
            Study Groups
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'forum' ? 'bg-[#60a5fa] text-black' : 'bg-[#282828] text-white hover:bg-[#333]'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            Forum
          </button>
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <button
            onClick={() => activeTab === 'groups' ? setShowCreateGroup(true) : setShowCreatePost(true)}
            className="flex items-center gap-2 bg-[#60a5fa] text-black px-4 py-2 rounded-lg hover:bg-[#60a5fa]/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            {activeTab === 'groups' ? 'Create Study Group' : 'Create Post'}
          </button>
        </div>

        {/* Study Groups Tab */}
        {activeTab === 'groups' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading study groups...</div>
            ) : studyGroups.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No study groups yet. Create one!</div>
            ) : (
              studyGroups.map((group) => (
                <div key={group.id} className="bg-[#282828] p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                      <p className="text-gray-400">{group.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="w-4 h-4" />
                      {group.memberCount}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {group.isMember ? (
                      <button
                        onClick={() => leaveStudyGroup(group.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Leave Group
                      </button>
                    ) : (
                      <button
                        onClick={() => joinStudyGroup(group.id)}
                        className="px-4 py-2 bg-[#60a5fa] text-black rounded-lg hover:bg-[#60a5fa]/90 transition-colors"
                      >
                        Join Group
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading forum posts...</div>
            ) : forumPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No posts yet. Start a discussion!</div>
            ) : (
              forumPosts.map((post) => (
                <div key={post.id} className="bg-[#282828] p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-400 mb-2">{post.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>By {post.authorName}</span>
                        <span>{post.replies} replies</span>
                        <span>{post.views} views</span>
                      </div>
                    </div>
                    <button
                      onClick={() => likePost(post.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                        post.isLiked ? 'bg-red-600 text-white' : 'bg-[#333] text-white hover:bg-[#444]'
                      }`}
                    >
                      ❤️ {post.likes}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Create Group Modal */}
        {showCreateGroup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#282828] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Create Study Group</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createStudyGroup(
                  formData.get('name') as string,
                  formData.get('description') as string,
                  formData.get('courseId') as string,
                  formData.get('isPublic') === 'true'
                );
                setShowCreateGroup(false);
              }}>
                <div className="space-y-4">
                  <input
                    name="name"
                    placeholder="Group Name"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  />
                  <input
                    name="courseId"
                    placeholder="Course ID"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  />
                  <select
                    name="isPublic"
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  >
                    <option value="true">Public</option>
                    <option value="false">Private</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateGroup(false)}
                    className="flex-1 px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#60a5fa] text-black rounded-lg hover:bg-[#60a5fa]/90 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#282828] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Create Forum Post</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createForumPost(
                  formData.get('title') as string,
                  formData.get('content') as string,
                  formData.get('topic') as string,
                  formData.get('courseId') as string || undefined
                );
                setShowCreatePost(false);
              }}>
                <div className="space-y-4">
                  <input
                    name="title"
                    placeholder="Post Title"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  />
                  <textarea
                    name="content"
                    placeholder="Content"
                    required
                    rows={4}
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  />
                  <input
                    name="topic"
                    placeholder="Topic"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  />
                  <input
                    name="courseId"
                    placeholder="Course ID (optional)"
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  />
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreatePost(false)}
                    className="flex-1 px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#60a5fa] text-black rounded-lg hover:bg-[#60a5fa]/90 transition-colors"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
