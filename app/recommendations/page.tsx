"use client";

import { useAIRecommendation } from '../contexts/AIRecommendationContext';
import { Sparkles, TrendingUp, BookOpen, Clock, Target, RefreshCw } from 'lucide-react';

export default function RecommendationsPage() {
  const { personalizedRecommendations, learningPaths, loading, generateRecommendations, refreshData } = useAIRecommendation();

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#60a5fa]" />
            <h1 className="text-3xl md:text-4xl font-bold">AI Recommendations</h1>
          </div>
          <button
            onClick={() => {
              generateRecommendations();
              refreshData();
            }}
            className="flex items-center gap-2 bg-[#282828] text-white px-4 py-2 rounded-lg hover:bg-[#333] transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        <div className="space-y-8">
          {/* Personalized Recommendations */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-[#60a5fa]" />
              Recommended For You
            </h2>
            {loading ? (
              <div className="text-center py-8">Loading recommendations...</div>
            ) : personalizedRecommendations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No recommendations yet. Start learning to get personalized suggestions!</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalizedRecommendations.map((rec) => (
                  <div key={rec.courseId} className="bg-[#282828] p-6 rounded-lg relative">
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        rec.priority === 'high' ? 'bg-red-500 text-white' :
                        rec.priority === 'medium' ? 'bg-yellow-500 text-black' :
                        'bg-gray-500 text-white'
                      }`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{rec.courseName}</h3>
                    <p className="text-gray-400 mb-4">{rec.reason}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-[#60a5fa]" />
                      <span className="text-[#60a5fa]">{Math.round(rec.confidence * 100)}% match</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Learning Paths */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#60a5fa]" />
              Learning Paths
            </h2>
            {loading ? (
              <div className="text-center py-8">Loading learning paths...</div>
            ) : learningPaths.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No learning paths available yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {learningPaths.map((path) => (
                  <div key={path.id} className="bg-[#282828] p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        path.difficulty === 'beginner' ? 'bg-green-500 text-white' :
                        path.difficulty === 'intermediate' ? 'bg-yellow-500 text-black' :
                        'bg-red-500 text-white'
                      }`}>
                        {path.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-[#333] text-gray-300 rounded-full text-xs">{path.category}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{path.title}</h3>
                    <p className="text-gray-400 mb-4">{path.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {path.estimatedDuration}
                      </span>
                      <span>{path.courses.length} courses</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion Rate</span>
                        <span className="text-[#60a5fa]">{path.completionRate}%</span>
                      </div>
                      <div className="w-full bg-[#333] rounded-full h-2">
                        <div
                          className="bg-[#60a5fa] h-2 rounded-full transition-all"
                          style={{ width: `${path.completionRate}%` }}
                        />
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 bg-[#60a5fa] text-black rounded-lg hover:bg-[#60a5fa]/90 transition-colors font-bold">
                      Start Path
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* How It Works */}
          <section className="bg-[#282828] p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#60a5fa]" />
              How AI Recommendations Work
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Our AI analyzes your learning history, goals, and preferences to suggest the most relevant courses and learning paths for you.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Learning History:</strong> Courses you&apos;ve completed and your progress</li>
                <li><strong>Goals:</strong> Your stated learning objectives (job skills, business, personal growth)</li>
                <li><strong>Time Availability:</strong> How much time you have for learning</li>
                <li><strong>Interests:</strong> Topics and subjects you&apos;ve shown interest in</li>
                <li><strong>Similar Learners:</strong> What users with similar profiles found helpful</li>
              </ul>
              <p className="mt-4">
                Recommendations update automatically as you progress through courses and update your preferences.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
