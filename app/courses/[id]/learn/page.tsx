"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, ChevronRight, CheckCircle, Play, Clock, 
  BookOpen, Target, ArrowRight, X, Plus, Star, Award
} from "lucide-react";
import { courses } from "../../../data/courses";

export default function CourseLearnPage() {
  const params = useParams();
  const courseId = params.id as string;
  const router = useRouter();
  const [currentModule, setCurrentModule] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#b3b3b3]">Course not found</p>
          <Link href="/courses" className="text-[#60a5fa] hover:underline mt-2 inline-block">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const modules = course.detailedModules || [];
  const currentModuleData = modules[currentModule];
  const progress = (completedModules.length / modules.length) * 100;
  const xpEarned = completedModules.length * 25;

  const handleCompleteModule = () => {
    if (!completedModules.includes(currentModule)) {
      setCompletedModules([...completedModules, currentModule]);
    }
    if (currentModule < modules.length - 1) {
      setCurrentModule(currentModule + 1);
    }
  };

  const handlePrevModule = () => {
    if (currentModule > 0) {
      setCurrentModule(currentModule - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="bg-[#181818] border-b border-[#282828] sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href={`/courses/${courseId}`}
              className="flex items-center gap-2 text-sm text-[#b3b3b3] hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
              Back to Course
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#60a5fa]">{Math.round(progress)}%</span>
                <div className="w-24 bg-[#282828] rounded-full h-2">
                  <div 
                    className="bg-[#60a5fa] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 bg-[#282828] px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-sm font-bold">{xpEarned} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Module List */}
          <div className="lg:col-span-1">
            <div className="bg-[#181818] rounded-xl border border-[#282828] p-4 sticky top-24">
              <h3 className="font-bold text-white mb-4">Course Modules</h3>
              <div className="space-y-2">
                {modules.map((module, index) => {
                  const ModuleIcon = module.icon || BookOpen;
                  const isCompleted = completedModules.includes(index);
                  const isCurrent = currentModule === index;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentModule(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isCurrent 
                          ? 'bg-[#60a5fa] text-black' 
                          : isCompleted 
                            ? 'bg-[#282828] text-white' 
                            : 'bg-[#181818] text-[#b3b3b3] hover:bg-[#282828]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : isCurrent ? (
                            <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center">
                              <span className="text-xs font-bold">{index + 1}</span>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-[#b3b3b3] flex items-center justify-center">
                              <span className="text-xs font-bold">{index + 1}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold line-clamp-2">{module.title}</p>
                          <p className="text-xs mt-1 opacity-70">{module.estimatedTime}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content - Module Detail */}
          <div className="lg:col-span-3">
            <div className="bg-[#181818] rounded-xl border border-[#282828] overflow-hidden">
              {/* Module Header */}
              <div className="p-6 border-b border-[#282828]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[#b3b3b3]">
                    Module {currentModule + 1} of {modules.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#b3b3b3]" />
                    <span className="text-sm text-[#b3b3b3]">{currentModuleData?.estimatedTime}</span>
                  </div>
                </div>
                
                <h1 className="text-2xl font-black mb-4">{currentModuleData?.title}</h1>
                
                <button className="flex items-center gap-2 bg-[#60a5fa] text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform">
                  <Play className="w-5 h-5" fill="currentColor" />
                  Tap to Watch
                </button>
              </div>

              {/* Topics List */}
              {currentModuleData?.topics && (
                <div className="p-6 border-b border-[#282828]">
                  <h3 className="font-bold text-white mb-4">Topics</h3>
                  <div className="space-y-3">
                    {currentModuleData.topics.map((topic, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-[#282828] rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-[#60a5fa] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-black">{index + 1}</span>
                        </div>
                        <p className="text-sm text-white">{topic}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Objectives */}
              <div className="p-6 border-b border-[#282828]">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#60a5fa]" />
                  Learning Objectives
                </h3>
                <div className="space-y-3">
                  {currentModuleData?.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-[#60a5fa] mt-1 flex-shrink-0" />
                      <p className="text-sm text-white">{objective}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="p-6 border-b border-[#282828]">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#60a5fa]" />
                  Overview
                </h3>
                <p className="text-sm text-[#b3b3b3] leading-relaxed whitespace-pre-line">
                  {currentModuleData?.content}
                </p>
              </div>

              {/* Activities */}
              <div className="p-6 border-b border-[#282828]">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#60a5fa]" />
                  Activities
                </h3>
                <div className="space-y-3">
                  {currentModuleData?.activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-[#282828] rounded-lg">
                      <CheckCircle className="w-4 h-4 text-[#60a5fa] mt-1 flex-shrink-0" />
                      <p className="text-sm text-white">{activity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources */}
              {currentModuleData?.resources && currentModuleData.resources.length > 0 && (
                <div className="p-6 border-b border-[#282828]">
                  <h3 className="font-bold text-white mb-4">Resources</h3>
                  <div className="space-y-2">
                    {currentModuleData.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-[#282828] rounded-lg hover:bg-[#3a3a3a] transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-[#60a5fa]" />
                        <span className="text-sm text-white">{resource.name}</span>
                        <ArrowRight className="w-4 h-4 text-[#b3b3b3] ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevModule}
                    disabled={currentModule === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-[#282828] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                    Prev Module
                  </button>
                  
                  <button
                    onClick={handleCompleteModule}
                    disabled={completedModules.includes(currentModule)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#60a5fa] text-black font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {completedModules.includes(currentModule) ? 'Completed' : 'Complete Learn'}
                    {!completedModules.includes(currentModule) && <ChevronRight size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="mt-6 bg-[#181818] rounded-xl border border-[#282828] p-6">
              <h3 className="font-bold text-white mb-4">Overall Progress</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#b3b3b3]">{Math.round(progress)}% complete</span>
                <span className="text-sm text-[#b3b3b3]">{completedModules.length} of {modules.length} modules</span>
              </div>
              <div className="w-full bg-[#282828] rounded-full h-3">
                <div 
                  className="bg-[#60a5fa] h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-6 bg-[#181818] rounded-xl border border-[#282828] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#60a5fa]" />
                  Notes
                </h3>
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-sm text-[#60a5fa] hover:underline"
                >
                  {showNotes ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showNotes && (
                <div className="space-y-4">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Take notes for this module..."
                    rows={6}
                    className="w-full bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white placeholder-[#b3b3b3] focus:outline-none focus:border-[#60a5fa] transition-colors resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setNotes("")}
                      className="px-4 py-2 bg-[#282828] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors"
                    >
                      Clear
                    </button>
                    <button className="px-4 py-2 bg-[#60a5fa] text-black font-bold rounded-lg hover:scale-105 transition-transform">
                      Save Notes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
