"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { learningTracks } from "../data/learningTracks";
import { BookOpen, CheckCircle, ArrowLeft } from "lucide-react";

export default function TracksContent() {
  const searchParams = useSearchParams();
  const trackId = searchParams.get("track");

  // Get track details
  const track = trackId ? learningTracks.find((t) => t.id === trackId) : null;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 sm:px-8 py-12">
        {!track ? (
          // Show all learning tracks
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-black mb-2">4 Elite Learning Tracks</h1>
              <p className="text-sm text-[#b3b3b3]">
                Mapped to Eton & Harrow's world-class curriculum
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {learningTracks.filter(track => ['leadership', 'character-values', 'classical-thinking', 'university-prep'].includes(track.id)).map((t) => (
                <Link
                  key={t.id}
                  href={`/tracks?track=${t.id}`}
                  className="group p-6 rounded-xl border border-[#282828] hover:border-[#1ed760]/30 transition-all duration-300 bg-[#181818] hover:bg-[#1e1e1e]"
                >
                  <div className="text-4xl mb-4">{t.emoji}</div>
                  <h3 className="font-bold text-white text-lg mb-2">{t.title}</h3>
                  <p className="text-xs text-[#b3b3b3] mb-4 line-clamp-2">{t.tagline}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold rounded-full px-2 py-1 bg-[#282828] text-[#1ed760]">
                      {t.curriculum?.length || 0} modules
                    </span>
                    <span className="text-xs text-[#b3b3b3]">{t.ageRange}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#282828]">
                    <div>
                      <p className="text-lg font-bold text-white">${t.priceUSD}</p>
                      <p className="text-xs text-[#b3b3b3]">₦{t.priceNGN?.toLocaleString()}</p>
                    </div>
                    <span className="text-xs text-[#1ed760] font-bold">View Track</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          // Show specific track curriculum
          <div>
            <Link
              href="/tracks"
              className="inline-flex items-center gap-2 text-sm text-[#1ed760] hover:underline mb-6"
            >
              <ArrowLeft size={16} /> Back to all tracks
            </Link>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-6xl">{track.emoji}</div>
                <div>
                  <h1 className="text-4xl font-black mb-2">{track.title}</h1>
                  <p className="text-sm text-[#b3b3b3]">{track.tagline}</p>
                </div>
              </div>
              <p className="text-base text-[#b3b3b3] mb-6 max-w-3xl">
                {track.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-[#b3b3b3] mb-6">
                <span className="bg-[#282828] px-3 py-1 rounded-full">{track.ageRange}</span>
                <span>{track.subjects.length} subjects</span>
              </div>
              <div className="flex items-center gap-4 mb-8 p-4 bg-[#1ed760]/10 rounded-xl border border-[#1ed760]/20">
                <div>
                  <p className="text-xs text-[#b3b3b3] mb-1">One-time Purchase</p>
                  <p className="text-2xl font-bold text-[#1ed760]">${track.priceUSD}</p>
                  <p className="text-sm text-[#b3b3b3]">₦{track.priceNGN?.toLocaleString()}</p>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-xs text-[#b3b3b3] mb-1">{track.curriculum?.length || 0} Modules</p>
                  <p className="text-sm text-white font-bold">Complete Curriculum</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-black mb-6">Curriculum</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {track.curriculum?.map((module, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-[#282828] bg-[#181818] flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1ed760]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={16} className="text-[#1ed760]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{module}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-black mb-6">Subjects Covered</h2>
              <div className="flex flex-wrap gap-2">
                {track.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 rounded-full bg-[#282828] text-sm text-[#b3b3b3] border border-[#3a3a3a]"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-[#D4AF37]/30 bg-[#1a1a1a]">
              <div className="flex items-start gap-3">
                <BookOpen className="text-[#D4AF37] w-5 h-5 mt-1" />
                <div>
                  <h3 className="text-sm font-bold text-[#D4AF37] mb-2">
                    Elite School Connection
                  </h3>
                  <p className="text-xs text-[#b3b3b3]">{track.etonHarrowLink}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
