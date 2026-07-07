"use client";

import { useState } from 'react';
import { useWomenHub, Resource } from '../contexts/WomenHubContext';
import { Heart, Users, BookOpen, Plus, Star, Check } from 'lucide-react';

export default function WomenHubPage() {
  const { mentors, mentorshipRequests, studyGroups, resources, loading, requestMentorship, createWomenStudyGroup, joinWomenStudyGroup, addResource } = useWomenHub();
  const [activeTab, setActiveTab] = useState<'mentors' | 'groups' | 'resources'>('mentors');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-pink-500" />
          <h1 className="text-3xl md:text-4xl font-bold">Women&apos;s Hub</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700 pb-4 flex-wrap">
          <button
            onClick={() => setActiveTab('mentors')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'mentors' ? 'bg-pink-500 text-white' : 'bg-[#282828] text-white hover:bg-[#333]'
            }`}
          >
            <Star className="w-5 h-5" />
            Mentors
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'groups' ? 'bg-pink-500 text-white' : 'bg-[#282828] text-white hover:bg-[#333]'
            }`}
          >
            <Users className="w-5 h-5" />
            Study Groups
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'resources' ? 'bg-pink-500 text-white' : 'bg-[#282828] text-white hover:bg-[#333]'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Resources
          </button>
        </div>

        {/* Action Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              if (activeTab === 'mentors') return;
              if (activeTab === 'groups') setShowCreateGroupModal(true);
              if (activeTab === 'resources') setShowAddResourceModal(true);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'mentors' ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-pink-500 text-white hover:bg-pink-600'
            }`}
            disabled={activeTab === 'mentors'}
          >
            <Plus className="w-5 h-5" />
            {activeTab === 'groups' ? 'Create Study Group' : activeTab === 'resources' ? 'Add Resource' : ''}
          </button>
        </div>

        {/* Mentors Tab */}
        {activeTab === 'mentors' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading mentors...</div>
            ) : mentors.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No mentors available yet.</div>
            ) : (
              mentors.map((mentor) => (
                <div key={mentor.id} className="bg-[#282828] p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    {mentor.avatar ? (
                      <img src={mentor.avatar} alt={mentor.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center text-2xl font-bold">
                        {mentor.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{mentor.name}</h3>
                        {mentor.isVerified && <Check className="w-5 h-5 text-[#60a5fa]" />}
                      </div>
                      <p className="text-gray-400 mb-3">{mentor.bio}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {mentor.expertise.map((exp, idx) => (
                          <span key={idx} className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm">
                            {exp}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {mentor.rating} ({mentor.reviews} reviews)
                        </span>
                        <span>Available: {mentor.availability}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedMentor(mentor.id);
                          setShowRequestModal(true);
                        }}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                      >
                        Request Mentorship
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

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
                      <p className="text-gray-400 mb-2">{group.description}</p>
                      <span className="text-sm text-pink-400">Topic: {group.topic}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="w-4 h-4" />
                      {group.memberCount}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {group.isMember ? (
                      <span className="px-4 py-2 bg-[#60a5fa] text-black rounded-lg">Joined</span>
                    ) : (
                      <button
                        onClick={() => joinWomenStudyGroup(group.id)}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
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

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading resources...</div>
            ) : resources.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No resources yet.</div>
            ) : (
              resources.map((resource) => (
                <div key={resource.id} className="bg-[#282828] p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                      <p className="text-gray-400 mb-2">{resource.description}</p>
                      <div className="flex gap-2 text-sm">
                        <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded-full">{resource.type}</span>
                        <span className="px-2 py-1 bg-[#333] text-gray-300 rounded-full">{resource.category}</span>
                      </div>
                    </div>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#60a5fa] text-black rounded-lg hover:bg-[#60a5fa]/90 transition-colors"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Request Mentorship Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#282828] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Request Mentorship</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                if (selectedMentor) {
                  requestMentorship(selectedMentor, formData.get('message') as string);
                }
                setShowRequestModal(false);
                setSelectedMentor(null);
              }}>
                <div className="space-y-4">
                  <textarea
                    name="message"
                    placeholder="Why do you want this mentorship? What are your goals?"
                    required
                    rows={4}
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRequestModal(false);
                      setSelectedMentor(null);
                    }}
                    className="flex-1 px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Study Group Modal */}
        {showCreateGroupModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#282828] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Create Women&apos;s Study Group</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createWomenStudyGroup(
                  formData.get('name') as string,
                  formData.get('description') as string,
                  formData.get('topic') as string,
                  formData.get('isPrivate') === 'true'
                );
                setShowCreateGroupModal(false);
              }}>
                <div className="space-y-4">
                  <input
                    name="name"
                    placeholder="Group Name"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    name="topic"
                    placeholder="Topic"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <select
                    name="isPrivate"
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="false">Public</option>
                    <option value="true">Private</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateGroupModal(false)}
                    className="flex-1 px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Resource Modal */}
        {showAddResourceModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#282828] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Add Resource</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                addResource(
                  formData.get('title') as string,
                  formData.get('description') as string,
                  formData.get('type') as Resource['type'],
                  formData.get('url') as string,
                  formData.get('category') as string
                );
                setShowAddResourceModal(false);
              }}>
                <div className="space-y-4">
                  <input
                    name="title"
                    placeholder="Resource Title"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <select
                    name="type"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="guide">Guide</option>
                    <option value="tool">Tool</option>
                  </select>
                  <input
                    name="url"
                    placeholder="URL"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <input
                    name="category"
                    placeholder="Category"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddResourceModal(false)}
                    className="flex-1 px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Add
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
