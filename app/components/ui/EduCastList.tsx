"use client";

import { usePodcast } from "../../contexts/PodcastContext";
import { useUser } from "../../contexts/UserContext";
import { Mic, Play, Clock, User, Lock, Crown } from "lucide-react";
import { useState } from "react";
import PaymentPromptModal from "./PaymentPromptModal";

export default function EduCastList() {
  const { eduCasts, playEduCast, playbackState } = usePodcast();
  const { currentUser } = useUser();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hours}h ${remainingMins}m`;
    }
    return `${mins}m`;
  };

  const isPlaying = (eduCastId: string): boolean => {
    return playbackState.currentEduCast?.id === eduCastId && playbackState.isPlaying;
  };

  const isLoggedIn = currentUser !== null;

  const handlePlayEduCast = (eduCast: any) => {
    if (!isLoggedIn) {
      setShowPaymentModal(true);
      return;
    }
    playEduCast(eduCast);
  };

  return (
    <div className="bg-[#181818] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-[#1ed760]" />
          EduCasts
        </h3>
        <span className="text-sm text-[#b3b3b3]">{eduCasts.length} episodes</span>
      </div>

      <div className="space-y-3">
        {eduCasts.map((eduCast) => (
          <div
            key={eduCast.id}
            className="flex items-center gap-4 p-4 bg-[#282828] hover:bg-[#333] transition-all rounded-lg group cursor-pointer"
            onClick={() => handlePlayEduCast(eduCast)}
          >
            {/* Play Button */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              isPlaying(eduCast.id) 
                ? 'bg-[#1ed760] text-black' 
                : 'bg-[#121212] text-white group-hover:bg-[#282828]'
            }`}>
              {isPlaying(eduCast.id) ? (
                <div className="flex gap-1">
                  <div className="w-1 h-4 bg-black animate-pulse" />
                  <div className="w-1 h-4 bg-black animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 h-4 bg-black animate-pulse" style={{ animationDelay: '0.2s' }} />
                </div>
              ) : (
                <Play size={20} fill="currentColor" className="ml-1" />
              )}
            </div>

            {/* EduCast Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white mb-1 truncate">{eduCast.title}</h4>
              <p className="text-xs text-[#b3b3b3] line-clamp-2 mb-2">{eduCast.description}</p>
              
              <div className="flex items-center gap-3 text-xs text-[#b3b3b3]">
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span>{eduCast.host}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{formatDuration(eduCast.duration)}</span>
                </div>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1 mt-2">
                {eduCast.topics.slice(0, 3).map((topic, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-[#121212] text-[10px] text-[#b3b3b3] rounded-full">
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Currently Playing Indicator */}
            {isPlaying(eduCast.id) && (
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-3 bg-[#1ed760] animate-pulse" />
                  <div className="w-0.5 h-5 bg-[#1ed760] animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <div className="w-0.5 h-4 bg-[#1ed760] animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-0.5 h-3 bg-[#1ed760] animate-pulse" style={{ animationDelay: '0.3s' }} />
                </div>
                <span className="text-[10px] text-[#1ed760] font-bold">NOW PLAYING</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {eduCasts.length === 0 && (
        <div className="text-center py-8">
          <Mic className="w-12 h-12 text-[#3f3f3f] mx-auto mb-2" />
          <p className="text-sm text-[#b3b3b3]">No EduCasts available</p>
        </div>
      )}

      <PaymentPromptModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        featureName="EduCasts"
      />
    </div>
  );
}
