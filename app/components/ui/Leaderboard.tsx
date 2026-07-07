"use client";

import { useState, useEffect } from "react";
import { useSocial } from "../../contexts/SocialContext";
import { Trophy, Medal, Crown, TrendingUp, Users, Flame } from "lucide-react";

export default function Leaderboard() {
  const { getLeaderboard } = useSocial();
  const [activeTab, setActiveTab] = useState<'global' | 'friends' | 'weekly'>('global');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      const data = await getLeaderboard(activeTab);
      setLeaderboard(data);
      setLoading(false);
    };

    loadLeaderboard();
  }, [activeTab, getLeaderboard]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-[#b3b3b3] w-5 text-center">{rank}</span>;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-transparent border-l-4 border-yellow-500';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-transparent border-l-4 border-gray-400';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-transparent border-l-4 border-amber-600';
    return 'hover:bg-[#282828]';
  };

  return (
    <div className="bg-[#181818] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#60a5fa]" />
          Leaderboard
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all ${
            activeTab === 'global'
              ? 'bg-[#60a5fa] text-black'
              : 'bg-[#282828] text-[#b3b3b3] hover:bg-[#333]'
          }`}
        >
          Global
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all ${
            activeTab === 'friends'
              ? 'bg-[#60a5fa] text-black'
              : 'bg-[#282828] text-[#b3b3b3] hover:bg-[#333]'
          }`}
        >
          Friends
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-2 px-4 rounded-full text-sm font-bold transition-all ${
            activeTab === 'weekly'
              ? 'bg-[#60a5fa] text-black'
              : 'bg-[#282828] text-[#b3b3b3] hover:bg-[#333]'
          }`}
        >
          Weekly
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#60a5fa] mx-auto mb-2" />
            <p className="text-sm text-[#b3b3b3]">Loading leaderboard...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-[#3f3f3f] mx-auto mb-2" />
            <p className="text-sm text-[#b3b3b3]">No leaderboard data yet</p>
          </div>
        ) : (
          leaderboard.map((entry) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all ${getRankStyle(entry.rank)} ${
                entry.isCurrentUser ? 'ring-1 ring-[#60a5fa]/50' : ''
              }`}
            >
              {/* Rank */}
              <div className="w-8 flex justify-center">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[#282828] flex items-center justify-center text-lg font-bold">
                {entry.name.charAt(0)}
              </div>

              {/* Name */}
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{entry.name}</p>
                <p className="text-xs text-[#b3b3b3]">Level {entry.level}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-[#60a5fa]">
                  <TrendingUp size={12} />
                  <span className="font-bold">{entry.totalXP.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center gap-1 text-orange-400">
                  <Flame size={12} />
                  <span>{entry.streak}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
