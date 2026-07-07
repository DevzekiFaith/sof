"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Music, Plus, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreatePlaylistPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tracks, setTracks] = useState<string[]>([]);
  const [newTrack, setNewTrack] = useState("");

  const handleAddTrack = () => {
    if (newTrack.trim()) {
      setTracks([...tracks, newTrack.trim()]);
      setNewTrack("");
    }
  };

  const handleRemoveTrack = (index: number) => {
    setTracks(tracks.filter((_, i) => i !== index));
  };

  const handleCreatePlaylist = () => {
    if (title.trim() && tracks.length > 0) {
      // In production, this would save to database
      router.push("/playlists");
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 sm:px-8 py-12 max-w-2xl">
        <div className="mb-8">
          <Link
            href="/playlists"
            className="inline-flex items-center gap-2 text-sm text-[#60a5fa] hover:underline mb-6"
          >
            <ArrowLeft size={16} /> Back to Playlists
          </Link>
          <h1 className="text-3xl font-black mb-2">Create Playlist</h1>
          <p className="text-sm text-[#b3b3b3]">
            Organize your learning content into custom playlists
          </p>
        </div>

        <div className="bg-[#181818] rounded-xl border border-[#282828] p-6 space-y-6">
          {/* Playlist Icon */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#60a5fa] to-[#1db954] rounded-lg flex items-center justify-center">
              <Music className="text-black w-10 h-10" />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Playlist name"
                className="w-full bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white placeholder-[#b3b3b3] focus:outline-none focus:border-[#60a5fa] transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-[#b3b3b3] mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for your playlist..."
              rows={3}
              className="w-full bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white placeholder-[#b3b3b3] focus:outline-none focus:border-[#60a5fa] transition-colors resize-none"
            />
          </div>

          {/* Add Tracks */}
          <div>
            <label className="block text-sm font-bold text-[#b3b3b3] mb-2">
              Add Tracks
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTrack}
                onChange={(e) => setNewTrack(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTrack()}
                placeholder="Enter track name"
                className="flex-1 bg-[#282828] border border-[#3a3a3a] rounded-lg px-4 py-3 text-white placeholder-[#b3b3b3] focus:outline-none focus:border-[#60a5fa] transition-colors"
              />
              <button
                onClick={handleAddTrack}
                className="px-4 py-3 bg-[#60a5fa] text-black font-bold rounded-lg hover:scale-105 transition-transform flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Track List */}
          {tracks.length > 0 && (
            <div>
              <label className="block text-sm font-bold text-[#b3b3b3] mb-2">
                Tracks ({tracks.length})
              </label>
              <div className="space-y-2">
                {tracks.map((track, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#282828] rounded-lg px-4 py-3"
                  >
                    <span className="text-sm text-white">{track}</span>
                    <button
                      onClick={() => handleRemoveTrack(index)}
                      className="p-1 hover:bg-[#3a3a3a] rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-[#b3b3b3] hover:text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Button */}
          <button
            onClick={handleCreatePlaylist}
            disabled={!title.trim() || tracks.length === 0}
            className="w-full py-4 bg-[#60a5fa] text-black font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Create Playlist
          </button>
        </div>
      </div>
    </div>
  );
}
