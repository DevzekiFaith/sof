"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/UserContext";
import Link from "next/link";


export default function ProfilePage() {
  const { currentUser, logout } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ed760] mb-4"></div>
      </div>
    );
  }

  const joinYear = new Date(currentUser.joinedAt).getFullYear();

  return (
    <div className="min-h-screen bg-[#121212] text-white pb-32">
      {/* ARTIST HEADER - like Spotify */}
      <div className="relative pt-32 pb-10 px-6 sm:px-10 bg-gradient-to-b from-gray-700 to-[#121212]">
        <div className="flex flex-col md:flex-row items-end gap-6 max-w-7xl mx-auto relative z-10">
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-gray-800 to-[#1ed760]/30 shadow-2xl flex items-center justify-center text-7xl flex-shrink-0 border-4 border-[#282828] overflow-hidden">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold tracking-wider uppercase text-gray-300">Profile</span>
              {currentUser.hasQuarterlyPass && (
                <span className="px-2 py-0.5 bg-[#1ed760] text-black text-[10px] font-black rounded-sm uppercase tracking-widest">
                  Premium
                </span>
              )}
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 tracking-tighter truncate">
              {currentUser.name}
            </h1>
            <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
              <span>{currentUser.stats?.xp || 0} XP</span>
              <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              <span>Level {currentUser.stats?.level || 1}</span>
              <span className="w-1 h-1 rounded-full bg-gray-500"></span>
              <span>Joined {joinYear}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 sm:px-10 py-6 max-w-7xl mx-auto flex items-center gap-6">
        <button className="w-14 h-14 rounded-full bg-[#1ed760] flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg">
          <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z" /></svg>
        </button>
        <button onClick={logout} className="px-4 py-2 rounded-full border border-gray-500 text-sm font-bold hover:border-white transition-colors">
          Sign Out
        </button>
      </div>

      {/* Content grid */}
      <div className="px-6 sm:px-10 max-w-7xl mx-auto mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Stats section */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Stats</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#181818] p-5 rounded-md hover:bg-[#282828] transition-colors group">
                  <div className="text-[#a7a7a7] text-sm font-medium mb-1 group-hover:text-white transition-colors">Total XP</div>
                  <div className="text-3xl font-black text-white">{currentUser.stats?.xp || 0}</div>
                </div>
                <div className="bg-[#181818] p-5 rounded-md hover:bg-[#282828] transition-colors group">
                  <div className="text-[#a7a7a7] text-sm font-medium mb-1 group-hover:text-white transition-colors">Current Streak</div>
                  <div className="text-3xl font-black text-white flex items-center gap-2">
                    {currentUser.stats?.streakDays || 0} <span className="text-xl">🔥</span>
                  </div>
                </div>
                <div className="bg-[#181818] p-5 rounded-md hover:bg-[#282828] transition-colors group">
                  <div className="text-[#a7a7a7] text-sm font-medium mb-1 group-hover:text-white transition-colors">Courses</div>
                  <div className="text-3xl font-black text-white">{Object.keys(currentUser.completedStages || {}).length}</div>
                </div>
                <div className="bg-[#181818] p-5 rounded-md hover:bg-[#282828] transition-colors group">
                  <div className="text-[#a7a7a7] text-sm font-medium mb-1 group-hover:text-white transition-colors">Badges</div>
                  <div className="text-3xl font-black text-white">{currentUser.stats?.badges?.length || 0}</div>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              <div className="bg-[#181818] rounded-md overflow-hidden">
                {Object.keys(currentUser.completedStages || {}).length === 0 ? (
                  <div className="p-8 text-center text-[#a7a7a7]">
                    <p className="mb-4">You haven't started any courses yet.</p>
                    <Link href="/#courses">
                      <button className="px-6 py-2 rounded-full border border-[#1ed760] text-[#1ed760] font-bold hover:bg-[#1ed760] hover:text-black transition-colors">
                        Browse Courses
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-[#282828]">
                    {Object.entries(currentUser.completedStages || {}).map(([courseId, stages], idx) => (
                      <div key={courseId} className="p-4 hover:bg-[#282828] transition-colors flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#282828] rounded-md flex items-center justify-center text-xl">
                            📚
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-[#1ed760] transition-colors capitalize">
                              {courseId}
                            </div>
                            <div className="text-sm text-[#a7a7a7]">
                              {Object.keys(stages).length} modules accessed
                            </div>
                          </div>
                        </div>
                        <Link href={`/learn/${courseId}`}>
                          <button className="opacity-0 group-hover:opacity-100 px-4 py-2 rounded-full border border-white text-sm font-bold hover:scale-105 transition-all">
                            Resume
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

          </div>

          {/* Right Column / Sidebar */}
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4">About</h2>
              <div className="bg-[#181818] p-6 rounded-md text-[#a7a7a7] text-sm space-y-4">
                <p>Email: <span className="text-white font-medium">{currentUser.email}</span></p>
                <p>Joined: <span className="text-white font-medium">{formatDate(currentUser.joinedAt)}</span></p>
                {currentUser.hasQuarterlyPass ? (
                  <div className="mt-4 p-3 bg-[#1ed760]/10 rounded border border-[#1ed760]/20 flex items-start gap-3">
                    <span className="text-[#1ed760] text-xl">💎</span>
                    <div>
                      <p className="font-bold text-white mb-1">Premium Member</p>
                      <p className="text-xs">You have full access to all courses and materials.</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-white/5 rounded border border-white/10 flex items-start gap-3">
                    <span className="text-white text-xl">🔓</span>
                    <div>
                      <p className="font-bold text-white mb-1">Free Tier</p>
                      <p className="text-xs mb-3">Upgrade for unlimited access to premium courses.</p>
                      <Link href="/checkout?plan=pro">
                        <button className="px-4 py-2 bg-white text-black font-bold rounded-full text-xs hover:scale-105 transition-transform">
                          Upgrade Now
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}