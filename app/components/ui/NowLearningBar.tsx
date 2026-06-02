"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "../../contexts/UserContext";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Maximize2, ListMusic, Volume2, VolumeX, Volume1 } from "lucide-react";
import { courses } from "../../data/courses";

export default function NowLearningBar() {
  const pathname = usePathname();
  const { currentUser, enrolledCourses } = useUser();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(45);
  const [isMuted, setIsMuted] = useState(false);

  // Auto-progress mock
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 0.1, 100));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  // Don't show if they are already in the course player
  if (pathname.startsWith("/learn/")) return null;
  // Don't show if not logged in
  if (!currentUser) return null;

  // For demo, we'll pick the first enrolled course or the first course in the list
  const activeCourseId = enrolledCourses[0] || "problem-solving";
  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.round((x / rect.width) * 100);
    setVolume(Math.max(0, Math.min(100, newVolume)));
    if (isMuted) setIsMuted(false);
  };

  const handleProgressChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newProgress = (x / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, newProgress)));
  };

  return (
    <div className="fixed bottom-[64px] md:bottom-0 left-0 right-0 h-[72px] sm:h-[80px] bg-black border-t border-[#121212] px-2 sm:px-4 flex items-center justify-between z-50 select-none">
      {/* Left: Course Info */}
      <div className="flex items-center gap-3 sm:gap-4 w-[60%] md:w-[30%] min-w-0">
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded shadow-lg overflow-hidden flex-shrink-0 group relative cursor-pointer">
          {activeCourse.imageUrl ? (
            <Image src={activeCourse.imageUrl} alt={activeCourse.title} fill className="object-cover" sizes="(max-width: 640px) 40px, 56px" />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${activeCourse.bgGradient} flex items-center justify-center`}>
               <activeCourse.icon className="text-white w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          )}
        </div>
        <div className="flex flex-col truncate">
          <Link href={`/learn/${activeCourse.id}`} className="text-white font-bold text-xs sm:text-sm hover:underline truncate">
            {activeCourse.title}
          </Link>
          <span className="text-[#b3b3b3] text-[10px] sm:text-xs truncate">
            {activeCourse.duration || "Magify Core"}
          </span>
        </div>
      </div>

      {/* Center: Controls & Progress */}
      <div className="flex flex-col items-center justify-center flex-1 px-2 md:max-w-[40%]">
        <div className="flex items-center gap-4 sm:gap-6 mb-1 sm:mb-2">
          <button className="text-[#b3b3b3] hover:text-white transition-colors hidden md:block">
            <Shuffle size={16} />
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors hidden sm:block" onClick={() => setProgress(0)}>
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors hidden sm:block" onClick={() => setProgress(0)}>
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors hidden md:block">
            <Repeat size={16} />
          </button>
        </div>
        <div className="flex items-center w-full gap-2 group max-w-md">
          <span className="text-[10px] text-[#a7a7a7] min-w-[25px] text-right hidden sm:block">
            {Math.floor((progress / 100) * 300 / 60)}:{(Math.floor((progress / 100) * 300 % 60)).toString().padStart(2, '0')}
          </span>
          <div 
            className="h-[3px] sm:h-1 bg-[#4d4d4d] rounded-full flex-1 cursor-pointer group-hover:bg-[#5e5e5e] transition-colors relative"
            onClick={handleProgressChange}
          >
            <div className="h-full bg-white group-hover:bg-[#1ed760] transition-colors" style={{ width: `${progress}%` }}></div>
            <div className="absolute top-1/2 -translate-y-1/2 w-2 sm:w-3 h-2 sm:h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg" style={{ left: `${progress}%`, marginLeft: '-6px' }}></div>
          </div>
          <span className="text-[10px] text-[#a7a7a7] min-w-[25px] hidden sm:block">5:00</span>
        </div>
      </div>

      {/* Right: Stats & Volume (Hidden on Mobile) */}
      <div className="hidden md:flex items-center justify-end gap-4 w-[30%] min-w-[180px]">
        <button className="text-[#b3b3b3] hover:text-white transition-colors hidden lg:block">
          <ListMusic size={18} />
        </button>
        <div className="hidden sm:flex items-center gap-3 mr-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-[#b3b3b3] font-bold uppercase tracking-wider">Level {currentUser.stats?.level || 1}</span>
            <span className="text-[10px] text-[#1ed760] font-bold">{currentUser.stats?.xp || 0} XP</span>
          </div>
        </div>
        <div className="flex items-center gap-2 group w-24">
          <button onClick={toggleMute} className="text-[#b3b3b3] group-hover:text-white transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : volume < 50 ? <Volume1 size={18} /> : <Volume2 size={18} />}
          </button>
          <div 
            className="h-1 bg-[#4d4d4d] rounded-full flex-1 cursor-pointer group-hover:bg-[#5e5e5e] transition-colors relative"
            onClick={handleVolumeChange}
          >
            <div 
              className="h-full bg-white group-hover:bg-[#1ed760] transition-colors" 
              style={{ width: `${isMuted ? 0 : volume}%` }}
            ></div>
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg" 
              style={{ left: `${isMuted ? 0 : volume}%`, marginLeft: '-6px' }}
            ></div>
          </div>
        </div>
        <button className="text-[#b3b3b3] hover:text-white transition-colors hidden lg:block">
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
}
