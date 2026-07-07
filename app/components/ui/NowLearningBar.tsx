"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "../../contexts/UserContext";
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Maximize2, ListMusic, Volume2, VolumeX, Volume1, Minimize2, Maximize, ChevronUp, Heart } from "lucide-react";
import { courses } from "../../data/courses";

export default function NowLearningBar() {
  const pathname = usePathname();
  const { currentUser, enrolledCourses } = useUser();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(45);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

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
  const activeCourseId = enrolledCourses[currentCourseIndex] || courses[currentCourseIndex]?.id || "problem-solving";
  const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSkipBack = () => {
    setProgress(0);
    if (currentCourseIndex > 0) {
      setCurrentCourseIndex(currentCourseIndex - 1);
      setProgress(0);
    }
  };

  const handleSkipForward = () => {
    if (progress >= 95) {
      // Move to next course if near end
      if (currentCourseIndex < courses.length - 1) {
        setCurrentCourseIndex(currentCourseIndex + 1);
        setProgress(0);
      }
    } else {
      // Skip ahead 10%
      setProgress(Math.min(progress + 10, 100));
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
    if (!isShuffle) {
      // Shuffle courses
      const randomIndex = Math.floor(Math.random() * courses.length);
      setCurrentCourseIndex(randomIndex);
      setProgress(0);
    }
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const handleMaximize = () => {
    // Could open a fullscreen player modal
  };

  const handleShowPlaylist = () => {
    // Could open a playlist sidebar/modal
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
    <>
      {/* Minimized State - Small bar at bottom (Spotify-like) */}
      {isMinimized && (
        <div 
          className="fixed bottom-[64px] md:bottom-0 left-0 right-0 h-14 bg-gradient-to-r from-[#181818] to-[#282828] border-t border-white/10 px-4 flex items-center justify-between z-50 cursor-pointer hover:from-[#1e1e1e] hover:to-[#2e2e2e] transition-all duration-300"
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded shadow-lg overflow-hidden flex-shrink-0 relative group">
              {activeCourse.imageUrl ? (
                <Image src={activeCourse.imageUrl} alt={activeCourse.title} fill className="object-cover" sizes="40px" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${activeCourse.bgGradient} flex items-center justify-center`}>
                  <activeCourse.icon className="text-white w-5 h-5" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Maximize size={16} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col truncate flex-1">
              <span className="text-white font-bold text-sm truncate">{activeCourse.title}</span>
              <span className="text-[#b3b3b3] text-xs truncate">Now Learning</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition-transform shadow-lg"
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              className="w-8 h-8 flex items-center justify-center text-[#b3b3b3] hover:text-white transition-colors"
            >
              <ChevronUp size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Full Bar (Spotify-like design) */}
      {!isMinimized && (
        <div className="fixed bottom-[64px] md:bottom-0 left-0 right-0 h-[90px] bg-gradient-to-r from-[#181818] to-[#282818] border-t border-white/10 px-4 flex items-center justify-between z-50 select-none">
          {/* Left: Course Info */}
          <div className="flex items-center gap-4 w-[30%] min-w-0">
            <div className="w-14 h-14 rounded shadow-lg overflow-hidden flex-shrink-0 group relative cursor-pointer">
              {activeCourse.imageUrl ? (
                <Image src={activeCourse.imageUrl} alt={activeCourse.title} fill className="object-cover" sizes="56px" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${activeCourse.bgGradient} flex items-center justify-center`}>
                   <activeCourse.icon className="text-white w-6 h-6" />
                </div>
              )}
            </div>
            <div className="flex flex-col truncate flex-1">
              <Link href={`/learn/${activeCourse.id}`} className="text-white font-bold text-sm hover:underline truncate">
                {activeCourse.title}
              </Link>
              <span className="text-[#b3b3b3] text-xs truncate">
                {activeCourse.duration || "Origin Core"}
              </span>
            </div>
            <button className="text-[#b3b3b3] hover:text-white transition-colors hidden sm:block">
              <Heart size={16} />
            </button>
          </div>

          {/* Center: Controls & Progress */}
          <div className="flex flex-col items-center justify-center flex-1 px-4 max-w-[40%]">
            <div className="flex items-center gap-6 mb-2">
              <button 
                onClick={toggleShuffle}
                className={`transition-colors ${isShuffle ? 'text-[#60a5fa]' : 'text-[#b3b3b3] hover:text-white'}`}
              >
                <Shuffle size={16} />
              </button>
              <button 
                onClick={handleSkipBack}
                className="text-[#b3b3b3] hover:text-white transition-colors"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-black hover:scale-105 transition-transform shadow-lg"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
              </button>
              <button 
                onClick={handleSkipForward}
                className="text-[#b3b3b3] hover:text-white transition-colors"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>
              <button 
                onClick={toggleRepeat}
                className={`transition-colors ${isRepeat ? 'text-[#60a5fa]' : 'text-[#b3b3b3] hover:text-white'}`}
              >
                <Repeat size={16} />
              </button>
            </div>
            <div className="flex items-center w-full gap-2 group max-w-md">
              <span className="text-[11px] text-[#a7a7a7] min-w-[30px] text-right">
                {Math.floor((progress / 100) * 300 / 60)}:{(Math.floor((progress / 100) * 300 % 60)).toString().padStart(2, '0')}
              </span>
              <div 
                className="h-1 bg-[#4d4d4d] rounded-full flex-1 cursor-pointer group-hover:bg-[#5e5e5e] transition-colors relative"
                onClick={handleProgressChange}
              >
                <div className="h-full bg-white group-hover:bg-[#60a5fa] transition-colors rounded-full" style={{ width: `${progress}%` }}></div>
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg" style={{ left: `${progress}%`, marginLeft: '-6px' }}></div>
              </div>
              <span className="text-[11px] text-[#a7a7a7] min-w-[30px]">5:00</span>
            </div>
          </div>

          {/* Right: Stats & Volume */}
          <div className="flex items-center justify-end gap-4 w-[30%] min-w-[200px]">
            <button 
              onClick={handleShowPlaylist}
              className="text-[#b3b3b3] hover:text-white transition-colors hidden lg:block"
            >
              <ListMusic size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[11px] text-[#b3b3b3] font-bold uppercase tracking-wider">Level {currentUser.stats?.level || 1}</span>
                <span className="text-[11px] text-[#60a5fa] font-bold">{currentUser.stats?.xp || 0} XP</span>
              </div>
            </div>
            <div className="flex items-center gap-2 group w-28">
              <button onClick={toggleMute} className="text-[#b3b3b3] group-hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX size={18} /> : volume < 50 ? <Volume1 size={18} /> : <Volume2 size={18} />}
              </button>
              <div 
                className="h-1 bg-[#4d4d4d] rounded-full flex-1 cursor-pointer group-hover:bg-[#5e5e5e] transition-colors relative"
                onClick={handleVolumeChange}
              >
                <div 
                  className="h-full bg-white group-hover:bg-[#60a5fa] transition-colors rounded-full" 
                  style={{ width: `${isMuted ? 0 : volume}%` }}
                ></div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg" 
                  style={{ left: `${isMuted ? 0 : volume}%`, marginLeft: '-6px' }}
                ></div>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-[#b3b3b3] hover:text-white transition-colors"
              title="Minimize"
            >
              <Minimize2 size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
