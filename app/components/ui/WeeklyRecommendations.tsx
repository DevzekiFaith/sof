"use client";

import { useRecommendations } from "../../contexts/RecommendationContext";
import { Sparkles, RefreshCw } from "lucide-react";
import { Course } from "../../data/courses";
import { Play } from "lucide-react";
import Image from "next/image";

interface WeeklyRecommendationsProps {
  onCourseSelect?: (course: Course) => void;
}

export default function WeeklyRecommendations({ onCourseSelect }: WeeklyRecommendationsProps) {
  const { weeklyRecommendations, refreshRecommendations } = useRecommendations();

  const getReasonColor = (type: string) => {
    switch (type) {
      case 'popular':
        return 'text-[#1ed760]';
      case 'similar':
        return 'text-blue-400';
      case 'streak_preserver':
        return 'text-orange-400';
      default:
        return 'text-[#b3b3b3]';
    }
  };

  return (
    <div className="bg-[#181818] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#1ed760]" />
          Made For You
        </h3>
        <button
          onClick={refreshRecommendations}
          className="text-sm text-[#b3b3b3] hover:text-white transition-colors flex items-center gap-1"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {weeklyRecommendations.map((rec, index) => (
          <div
            key={`${rec.course.id}-${index}`}
            onClick={() => onCourseSelect?.(rec.course)}
            className="flex items-center gap-4 p-3 bg-[#282828] hover:bg-[#333] transition-all rounded-lg group cursor-pointer"
          >
            {/* Rank */}
            <div className="w-6 text-center text-sm font-bold text-[#b3b3b3]">
              {index + 1}
            </div>

            {/* Course Image */}
            <div className={`w-12 h-12 rounded bg-gradient-to-br ${rec.course.bgGradient} flex items-center justify-center shadow-lg flex-shrink-0 relative`}>
              {rec.course.imageUrl ? (
                <Image src={rec.course.imageUrl} alt={rec.course.title} fill className="object-cover rounded" sizes="48px" />
              ) : (
                <rec.course.icon className="w-6 h-6 text-white" />
              )}
              {rec.course.isFree && (
                <div className="absolute top-0 right-0 bg-[#1ed760] text-black text-[8px] font-bold px-1 py-0.5 rounded-full">
                  Free
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{rec.course.title}</h4>
              <p className="text-xs text-[#b3b3b3] truncate">{rec.course.description}</p>
              <p className={`text-xs mt-1 ${getReasonColor(rec.type)}`}>{rec.reason}</p>
            </div>

            {/* Play Button */}
            <div className="opacity-0 group-hover:opacity-100 transition-all">
              <div className="w-10 h-10 rounded-full bg-[#1ed760] flex items-center justify-center text-black hover:scale-105 transition-transform">
                <Play size={16} fill="currentColor" className="ml-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {weeklyRecommendations.length === 0 && (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-[#3f3f3f] mx-auto mb-2" />
          <p className="text-sm text-[#b3b3b3]">Start learning to get personalized recommendations!</p>
        </div>
      )}
    </div>
  );
}
