"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Plus, Heart, User, BookOpen, Music, Star } from "lucide-react";
import Logo from "../Logo";
import { useUser } from "../../contexts/UserContext";
import { courses } from "../../data/courses";

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, enrolledCourses } = useUser();
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const mainLinks = [
    { href: "/", label: "Home", icon: <Home className="w-6 h-6" /> },
    { href: "/#courses", label: "Search", icon: <Search className="w-6 h-6" /> },
  ];

  // Get actually enrolled course objects
  const myEnrolledCourses = courses.filter(c => enrolledCourses.includes(c.id));

  const filterChips = ["Playlists", "Courses", "Skills"];

  return (
    <aside className="hidden md:flex flex-col w-72 bg-black h-screen sticky top-0 left-0 p-2 gap-2 flex-shrink-0 z-40">
      {/* Top Navigation Panel */}
      <div className="bg-[#121212] rounded-lg p-4 space-y-4">
        <div className="mb-4 px-2">
          <Link href="/" className="transition-transform hover:scale-105 inline-block">
            <Logo />
          </Link>
        </div>
        <nav className="space-y-1">
          {mainLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-5 px-3 py-3 rounded-md font-bold transition-all duration-200 group ${
                  isActive 
                    ? "text-white" 
                    : "text-[#b3b3b3] hover:text-white"
                }`}
              >
                <div className={`transition-transform duration-200 group-hover:scale-105 ${isActive ? "text-white" : ""}`}>
                  {link.icon}
                </div>
                <span className="text-sm tracking-tight">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Library Panel */}
      <div className="flex-1 bg-[#121212] rounded-lg flex flex-col overflow-hidden">
        <div className="p-4 shadow-md z-10 bg-[#121212]">
          <div className="flex items-center justify-between text-[#b3b3b3] px-2 mb-2">
            <button className="flex items-center gap-3 hover:text-white transition-colors font-bold group">
              <Library className="w-6 h-6 transition-transform group-hover:scale-105" />
              <span className="text-sm">Your Library</span>
            </button>
            <button className="p-1 hover:bg-[#1a1a1a] rounded-full transition-colors hover:text-white">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex gap-2 mt-4 px-2 overflow-x-auto no-scrollbar">
            {filterChips.map((chip) => (
              <button 
                key={chip} 
                onClick={() => setActiveFilter(activeFilter === chip ? "All" : chip)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap ${
                  activeFilter === chip 
                    ? "bg-white text-black" 
                    : "bg-[#2a2a2a] hover:bg-[#333] text-white"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-hide">
          <div className="space-y-1 mt-2">
            {(activeFilter === "All" || activeFilter === "Playlists") && (
              <Link href="/about" className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] transition-colors group">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1ed760] to-[#1db954] rounded flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Music className="text-black w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">Magify Intro</span>
                  <span className="text-xs text-[#b3b3b3]">Playlist • Official</span>
                </div>
              </Link>
            )}

            {(activeFilter === "All" || activeFilter === "Courses") && (
              <>
                {myEnrolledCourses.length > 0 ? (
                  myEnrolledCourses.map((course) => (
                    <Link key={course.id} href={`/learn/${course.id}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] transition-colors group">
                      <div className="w-12 h-12 rounded overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                        {course.imageUrl ? (
                          <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${course.bgGradient} flex items-center justify-center`}>
                            <course.icon className="text-white w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-sm font-bold text-white truncate">{course.title}</span>
                        <span className="text-xs text-[#b3b3b3]">Course • Enrolled</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  activeFilter === "Courses" && (
                    <div className="p-4 bg-[#242424] rounded-lg mt-4 mx-2">
                      <p className="text-sm font-bold text-white mb-2">Find your first course</p>
                      <Link href="/#courses" className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:scale-105 transition-transform inline-block">
                        Browse
                      </Link>
                    </div>
                  )
                )}
              </>
            )}

            {(activeFilter === "All" || activeFilter === "Skills") && (
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] transition-colors group cursor-not-allowed opacity-50">
                <div className="w-12 h-12 bg-[#282828] rounded flex items-center justify-center shadow-lg">
                  <Star className="text-[#1ed760] w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">Your Skills</span>
                  <span className="text-xs text-[#b3b3b3]">Coming soon</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {currentUser && (
          <div className="p-4 border-t border-[#282828] bg-[#121212]">
             <Link href="/profile" className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1a1a1a] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-[#282828] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <User className="text-[#b3b3b3] w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-white truncate">{currentUser.name}</span>
             </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
