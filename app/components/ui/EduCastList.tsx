"use client";

import { usePodcast } from "../../contexts/PodcastContext";
import { useUser } from "../../contexts/UserContext";
import { Mic, Play, Clock, User, Lock, Crown, Radio, Users, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import PaymentPromptModal from "./PaymentPromptModal";
import { supabase } from "../../../lib/supabase";

interface LiveSession {
  id: string;
  is_live: boolean;
  title: string;
  host_name: string;
  viewer_count: number;
}

interface EduCast {
  id: string;
  title: string;
  description: string;
  host: string;
  duration: number;
  topics: string[];
}

export default function EduCastList() {
  const { eduCasts, playEduCast, playbackState } = usePodcast();
  const { currentUser } = useUser();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !currentUser) return;

    // Fetch live EduCast sessions
    const fetchLiveSessions = async () => {
      const { data } = await supabase
        .from('live_edu_sessions')
        .select('*')
        .in('status', ['live', 'upcoming'])
        .order('scheduled_start', { ascending: true })
        .limit(5);
      if (data) setLiveSessions(data);
    };

    fetchLiveSessions();

    // Set up real-time subscription for live sessions
    const subscription = supabase
      .channel('live_edu_sessions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_edu_sessions' }, (payload: { eventType: string; new: LiveSession; old: { id: string } }) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          setLiveSessions(prev => {
            const existing = prev.find(s => s.id === payload.new.id);
            if (existing) {
              return prev.map(s => s.id === payload.new.id ? payload.new : s);
            }
            return [...prev, payload.new].slice(0, 5);
          });
        } else if (payload.eventType === 'DELETE') {
          setLiveSessions(prev => prev.filter(s => s.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [mounted, currentUser]);

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

  const handlePlayEduCast = (eduCast: EduCast) => {
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
          <Radio className="w-5 h-5 text-[#60a5fa]" />
          EduCast Live
        </h3>
        <span className="text-sm text-[#b3b3b3]">{eduCasts.length} episodes</span>
      </div>

      {/* Live Sessions Section */}
      {mounted && liveSessions.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-bold text-white">Live Now</span>
          </div>
          <div className="space-y-3">
            {liveSessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  session.is_live
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-[#282828] bg-[#282828] hover:border-[#60a5fa]/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    session.is_live ? 'bg-red-500' : 'bg-[#60a5fa]/20'
                  }`}>
                    <Radio className={`w-6 h-6 ${session.is_live ? 'text-white' : 'text-[#60a5fa]'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">{session.title}</h4>
                        <p className="text-xs text-[#b3b3b3]">{session.host_name}</p>
                      </div>
                      {session.is_live && (
                        <div className="flex items-center gap-1 px-2 py-1 bg-red-500 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span className="text-xs font-bold text-white">LIVE</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#b3b3b3]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {session.viewer_count} watching
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        Chat
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recorded EduCasts */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Mic className="w-4 h-4 text-[#b3b3b3]" />
          <span className="text-sm font-bold text-white">Recorded Episodes</span>
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
                  ? 'bg-[#60a5fa] text-black' 
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
                    <div className="w-0.5 h-3 bg-[#60a5fa] animate-pulse" />
                    <div className="w-0.5 h-5 bg-[#60a5fa] animate-pulse" style={{ animationDelay: '0.1s' }} />
                    <div className="w-0.5 h-4 bg-[#60a5fa] animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-0.5 h-3 bg-[#60a5fa] animate-pulse" style={{ animationDelay: '0.3s' }} />
                  </div>
                  <span className="text-[10px] text-[#60a5fa] font-bold">NOW PLAYING</span>
                </div>
              )}
            </div>
          ))}
        </div>
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
