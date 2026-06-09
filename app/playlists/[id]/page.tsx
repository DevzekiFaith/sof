"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Music, Play, Clock, CheckCircle, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PlaylistDetailPage() {
  const params = useParams();
  const playlistId = params.id as string;
  const [playlist, setPlaylist] = useState<any>(null);
  const [currentTrack, setCurrentTrack] = useState<number>(0);

  useEffect(() => {
    // Sample playlist data - in production this would come from database
    const playlists: any = {
      "origin-intro": {
        id: "origin-intro",
        title: "Origin Intro",
        description: "Welcome to Origin - your journey to elite education starts here",
        type: "Official",
        icon: Music,
        color: "from-[#1ed760] to-[#1db954]",
        duration: "25 min",
        tracks: [
          { id: 1, title: "Welcome to Origin", duration: "5 min", completed: true, description: "Introduction to our mission and values" },
          { id: 2, title: "Our Mission", duration: "4 min", completed: true, description: "Understanding our educational philosophy" },
          { id: 3, title: "How It Works", duration: "6 min", completed: false, description: "Platform walkthrough and features" },
          { id: 4, title: "Getting Started", duration: "5 min", completed: false, description: "Your first steps on the platform" },
          { id: 5, title: "Next Steps", duration: "5 min", completed: false, description: "Planning your learning journey" },
        ]
      },
      "leadership-fundamentals": {
        id: "leadership-fundamentals",
        title: "Leadership Fundamentals",
        description: "Core leadership principles and practices",
        type: "Course",
        icon: Music,
        color: "from-[#F97316] to-[#ea580c]",
        duration: "45 min",
        tracks: [
          { id: 1, title: "Leadership Styles", duration: "8 min", completed: false, description: "Explore different leadership approaches" },
          { id: 2, title: "Communication Skills", duration: "7 min", completed: false, description: "Master effective communication" },
          { id: 3, title: "Team Building", duration: "6 min", completed: false, description: "Build and manage effective teams" },
          { id: 4, title: "Decision Making", duration: "8 min", completed: false, description: "Make better leadership decisions" },
          { id: 5, title: "Conflict Resolution", duration: "6 min", completed: false, description: "Handle conflicts professionally" },
          { id: 6, title: "Motivation Techniques", duration: "5 min", completed: false, description: "Inspire and motivate others" },
          { id: 7, title: "Strategic Thinking", duration: "5 min", completed: false, description: "Develop strategic leadership skills" },
          { id: 8, title: "Leadership Project", duration: "10 min", completed: false, description: "Apply leadership principles" },
        ]
      }
    };

    setPlaylist(playlists[playlistId as keyof typeof playlists] || null);
  }, [playlistId]);

  if (!playlist) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#b3b3b3]">Playlist not found</p>
          <Link href="/playlists" className="text-[#1ed760] hover:underline mt-2 inline-block">
            Back to Playlists
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = playlist.tracks.filter((t: any) => t.completed).length;
  const progress = (completedCount / playlist.tracks.length) * 100;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className={`h-64 bg-gradient-to-br ${playlist.color} relative`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative container mx-auto px-4 sm:px-8 py-12 h-full flex flex-col justify-end">
          <Link
            href="/playlists"
            className="text-white/80 hover:text-white text-sm mb-4 inline-flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Playlists
          </Link>
          <h1 className="text-4xl font-black mb-2">{playlist.title}</h1>
          <p className="text-white/80 mb-4">{playlist.description}</p>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
              {playlist.type}
            </span>
            <div className="flex items-center gap-2 text-white/80">
              <Clock className="w-4 h-4" />
              <span>{playlist.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <span>{completedCount}/{playlist.tracks.length} completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#181818] border-b border-[#282828] p-4">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#b3b3b3]">Overall Progress</span>
            <span className="text-sm font-bold text-[#1ed760]">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-[#282828] rounded-full h-2">
            <div 
              className="bg-[#1ed760] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="container mx-auto px-4 sm:px-8 py-8">
        <h2 className="text-2xl font-black mb-6">Tracks</h2>
        <div className="space-y-3">
          {playlist.tracks.map((track: any, index: number) => (
            <div
              key={track.id}
              className={`bg-[#181818] rounded-xl border ${
                track.completed 
                  ? 'border-[#1ed760]/30' 
                  : 'border-[#282828] hover:border-[#1ed760]/30'
              } transition-all duration-300 p-4 group`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  track.completed ? 'bg-[#1ed760]' : 'bg-[#282828] group-hover:bg-[#1ed760]/20'
                } transition-colors`}>
                  {track.completed ? (
                    <CheckCircle className="w-6 h-6 text-black" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">{track.title}</span>
                    {track.completed && (
                      <span className="px-2 py-0.5 bg-[#1ed760]/20 text-[#1ed760] text-xs font-bold rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#b3b3b3] line-clamp-1">{track.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-[#b3b3b3]">
                    <Clock className="w-4 h-4" />
                    <span>{track.duration}</span>
                  </div>
                  {!track.completed && (
                    <button className="px-4 py-2 bg-[#1ed760] text-black text-xs font-bold rounded-full hover:scale-105 transition-transform">
                      Play
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        {completedCount < playlist.tracks.length && (
          <div className="mt-8 p-6 bg-[#181818] rounded-xl border border-[#282828]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white mb-1">Continue Learning</h3>
                <p className="text-sm text-[#b3b3b3]">
                  Next: {playlist.tracks.find((t: any) => !t.completed)?.title}
                </p>
              </div>
              <button className="px-6 py-3 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
                <Play className="w-5 h-5" />
                Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
