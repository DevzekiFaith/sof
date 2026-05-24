"use client";

import { usePodcast } from "../../contexts/PodcastContext";
import { Play, Pause, SkipForward, SkipBack, Volume2, Mic, X } from "lucide-react";
import { useState } from "react";

export default function EduCastPlayer() {
  const { playbackState, pausePlayback, resumePlayback, seekTo, setVolume, setPlaybackRate, skipForward, skipBackward } = usePodcast();
  const [showVolume, setShowVolume] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!playbackState.currentEduCast) {
    return null;
  }

  const handleClose = () => {
    pausePlayback();
    setIsMinimized(true);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 left-4 md:left-72 bg-[#181818] border border-[#282828] rounded-full p-2 z-40 shadow-2xl">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-3 py-1 bg-[#1ed760] text-black rounded-full text-sm font-bold hover:scale-105 transition-transform"
        >
          <Mic size={14} />
          <span className="truncate max-w-[150px]">{playbackState.currentEduCast.title}</span>
        </button>
      </div>
    );
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = (playbackState.currentTime / playbackState.duration) * 100;

  return (
    <div className="fixed bottom-20 left-0 right-0 md:left-64 md:right-0 bg-[#181818] border-t border-[#282828] p-4 z-40">
      <div className="max-w-4xl mx-auto">
        {/* EduCast Info */}
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded bg-gradient-to-br from-[#1ed760]/30 to-[#121212] flex items-center justify-center flex-shrink-0">
            <Mic className="w-6 h-6 text-[#1ed760]" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{playbackState.currentEduCast.title}</h4>
            <p className="text-xs text-[#b3b3b3]">{playbackState.currentEduCast.host}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-[#282828] rounded-full transition-colors"
            title="Close player"
          >
            <X size={18} className="text-[#b3b3b3]" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-[#b3b3b3] mb-1">
            <span>{formatTime(playbackState.currentTime)}</span>
            <span>{formatTime(playbackState.duration)}</span>
          </div>
          <div 
            className="w-full bg-[#282828] rounded-full h-1 cursor-pointer group relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              seekTo(percent * playbackState.duration);
            }}
          >
            <div 
              className="h-full bg-[#1ed760] rounded-full transition-all group-hover:bg-[#1ed760]/80"
              style={{ width: `${progressPercent}%` }}
            />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => skipBackward(15)}
              className="p-2 hover:bg-[#282828] rounded-full transition-colors"
              title="Skip back 15s"
            >
              <SkipBack size={20} className="text-white" />
            </button>
            <button
              onClick={playbackState.isPlaying ? pausePlayback : resumePlayback}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              {playbackState.isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" className="ml-1" />
              )}
            </button>
            <button
              onClick={() => skipForward(15)}
              className="p-2 hover:bg-[#282828] rounded-full transition-colors"
              title="Skip forward 15s"
            >
              <SkipForward size={20} className="text-white" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Volume Control */}
            <div className="relative">
              <button
                onClick={() => setShowVolume(!showVolume)}
                className="p-2 hover:bg-[#282828] rounded-full transition-colors"
              >
                <Volume2 size={18} className="text-white" />
              </button>
              {showVolume && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-[#282828] rounded-lg shadow-xl">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={playbackState.volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-20 accent-[#1ed760]"
                  />
                </div>
              )}
            </div>

            {/* Speed Control */}
            <div className="relative">
              <button
                onClick={() => setShowSpeed(!showSpeed)}
                className="px-3 py-1 text-xs font-bold bg-[#282828] rounded-full hover:bg-[#333] transition-colors"
              >
                {playbackState.playbackRate}x
              </button>
              {showSpeed && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-[#282828] rounded-lg shadow-xl flex flex-col gap-1">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                    <button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate);
                        setShowSpeed(false);
                      }}
                      className={`px-3 py-1 text-xs rounded ${playbackState.playbackRate === rate ? 'bg-[#1ed760] text-black' : 'hover:bg-[#333]'}`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
