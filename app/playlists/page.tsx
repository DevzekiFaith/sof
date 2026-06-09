"use client";

import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { Music, Play, Clock, BookOpen, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PlaylistsPage() {
  const { currentUser } = useUser();
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    // Sample playlists data - in production this would come from database
    setPlaylists([
      {
        id: "origin-intro",
        title: "Origin Intro",
        description: "Welcome to Origin - your journey to elite education starts here",
        type: "Official",
        icon: Music,
        color: "from-[#1ed760] to-[#1db954]",
        itemCount: 5,
        duration: "25 min",
        tracks: [
          { id: 1, title: "Welcome to Origin", duration: "5 min", completed: true },
          { id: 2, title: "Our Mission", duration: "4 min", completed: true },
          { id: 3, title: "How It Works", duration: "6 min", completed: false },
          { id: 4, title: "Getting Started", duration: "5 min", completed: false },
          { id: 5, title: "Next Steps", duration: "5 min", completed: false },
        ]
      },
      {
        id: "leadership-fundamentals",
        title: "Leadership Fundamentals",
        description: "Core leadership principles and practices",
        type: "Course",
        icon: BookOpen,
        color: "from-[#F97316] to-[#ea580c]",
        itemCount: 8,
        duration: "45 min",
        tracks: [
          { id: 1, title: "Leadership Styles", duration: "8 min", completed: false },
          { id: 2, title: "Communication Skills", duration: "7 min", completed: false },
          { id: 3, title: "Team Building", duration: "6 min", completed: false },
          { id: 4, title: "Decision Making", duration: "8 min", completed: false },
          { id: 5, title: "Conflict Resolution", duration: "6 min", completed: false },
          { id: 6, title: "Motivation Techniques", duration: "5 min", completed: false },
          { id: 7, title: "Strategic Thinking", duration: "5 min", completed: false },
          { id: 8, title: "Leadership Project", duration: "10 min", completed: false },
        ]
      }
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 sm:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">Your Playlists</h1>
          <p className="text-sm text-[#b3b3b3]">
            Curated learning paths and course collections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => {
            const Icon = playlist.icon;
            const completedCount = playlist.tracks.filter((t: any) => t.completed).length;
            const progress = (completedCount / playlist.tracks.length) * 100;

            return (
              <div
                key={playlist.id}
                className="bg-[#181818] rounded-xl border border-[#282828] hover:border-[#1ed760]/30 transition-all duration-300 overflow-hidden group"
              >
                <div className={`h-32 bg-gradient-to-br ${playlist.color} flex items-center justify-center relative`}>
                  <Icon className="text-white w-16 h-16 opacity-80" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{playlist.type}</span>
                      <span className="text-xs text-white/80">{playlist.itemCount} tracks</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white text-lg mb-2">{playlist.title}</h3>
                  <p className="text-sm text-[#b3b3b3] mb-4 line-clamp-2">{playlist.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-[#b3b3b3] mb-2">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-[#282828] rounded-full h-2">
                      <div 
                        className="bg-[#1ed760] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#b3b3b3]">
                      <Clock className="w-4 h-4" />
                      <span>{playlist.duration}</span>
                    </div>
                    <Link
                      href={`/playlists/${playlist.id}`}
                      className="px-4 py-2 bg-[#1ed760] text-black text-xs font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Continue
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {playlists.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-[#282828] mx-auto mb-4" />
            <p className="text-[#b3b3b3] mb-4">No playlists yet</p>
            <Link
              href="/#courses"
              className="px-6 py-3 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition-transform inline-block"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
