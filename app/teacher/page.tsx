"use client";

import { useState } from 'react';
import { useTeacher } from '../contexts/TeacherContext';
import { Users, BookOpen, TrendingUp, Calendar, Plus } from 'lucide-react';

export default function TeacherDashboard() {
  const { isTeacher, students, classStats, assignments, loading, createAssignment } = useTeacher();
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assignments'>('overview');
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);

  if (!isTeacher) {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">You don&apos;t have teacher privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Teacher Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700 pb-4 flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-[#60a5fa] text-black' : 'bg-[#282828] text-white hover:bg-[#333]'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'students' ? 'bg-[#60a5fa] text-black' : 'bg-[#282828] text-white hover:bg-[#333]'
            }`}
          >
            <Users className="w-5 h-5" />
            Students
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'assignments' ? 'bg-[#60a5fa] text-black' : 'bg-[#282828] text-white hover:bg-[#333]'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Assignments
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#282828] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-6 h-6 text-[#60a5fa]" />
                  <span className="text-gray-400">Total Students</span>
                </div>
                <p className="text-3xl font-bold">{classStats.totalStudents}</p>
              </div>
              <div className="bg-[#282828] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-6 h-6 text-[#60a5fa]" />
                  <span className="text-gray-400">Active Students</span>
                </div>
                <p className="text-3xl font-bold">{classStats.activeStudents}</p>
              </div>
              <div className="bg-[#282828] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-6 h-6 text-[#60a5fa]" />
                  <span className="text-gray-400">Avg Progress</span>
                </div>
                <p className="text-3xl font-bold">{classStats.averageProgress.toFixed(1)}</p>
              </div>
              <div className="bg-[#282828] p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-6 h-6 text-[#60a5fa]" />
                  <span className="text-gray-400">Completions</span>
                </div>
                <p className="text-3xl font-bold">{classStats.totalCompletions}</p>
              </div>
            </div>

            <div className="bg-[#282828] p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Average Quiz Score</h2>
              <p className="text-4xl font-bold text-[#60a5fa]">{classStats.averageQuizScore.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No students yet.</div>
            ) : (
              students.map((student) => (
                <div key={`${student.userId}-${student.courseId}`} className="bg-[#282828] p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    {student.userAvatar ? (
                      <img src={student.userAvatar} alt={student.userName} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#60a5fa] flex items-center justify-center text-xl font-bold text-black">
                        {student.userName.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{student.userName}</h3>
                      <p className="text-gray-400 mb-2">{student.courseName}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-[#60a5fa]">Module {student.moduleIndex + 1}</span>
                        {student.quizScore && <span>Quiz: {student.quizScore}%</span>}
                        <span className="text-gray-400">{student.timeSpent} min</span>
                        <span className={student.completed ? 'text-[#60a5fa]' : 'text-gray-400'}>
                          {student.completed ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStudent(student.userId)}
                      className="px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="space-y-4">
            <div className="mb-6">
              <button
                onClick={() => setShowCreateAssignment(true)}
                className="flex items-center gap-2 bg-[#60a5fa] text-black px-4 py-2 rounded-lg hover:bg-[#60a5fa]/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Assignment
              </button>
            </div>
            {loading ? (
              <div className="text-center py-8">Loading assignments...</div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No assignments yet. Create one!</div>
            ) : (
              assignments.map((assignment) => (
                <div key={assignment.id} className="bg-[#282828] p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{assignment.title}</h3>
                      <p className="text-gray-400 mb-2">{assignment.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                        <span>Module {assignment.moduleIndex + 1}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#60a5fa]">
                        {assignment.submissions}/{assignment.totalStudents}
                      </p>
                      <p className="text-sm text-gray-400">Submissions</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Create Assignment Modal */}
        {showCreateAssignment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#282828] p-6 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Create Assignment</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createAssignment(
                  formData.get('title') as string,
                  formData.get('description') as string,
                  formData.get('courseId') as string,
                  parseInt(formData.get('moduleIndex') as string),
                  new Date(formData.get('dueDate') as string)
                );
                setShowCreateAssignment(false);
              }}>
                <div className="space-y-4">
                  <input
                    name="title"
                    placeholder="Assignment Title"
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
                  <input
                    name="moduleIndex"
                    type="number"
                    placeholder="Module Index"
                    required
                    min="0"
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  />
                  <input
                    name="dueDate"
                    type="date"
                    required
                    className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                  />
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateAssignment(false)}
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
      </div>
    </div>
  );
}
