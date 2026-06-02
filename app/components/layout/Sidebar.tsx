"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Plus, Heart, User, BookOpen, Music, Star, Bell, Users } from "lucide-react";
import Logo from "../Logo";
import { useUser } from "../../contexts/UserContext";
import { useSocial } from "../../contexts/SocialContext";
import { courses } from "../../data/courses";
import { supabase } from "../../../lib/supabase";

export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser, enrolledCourses } = useUser();
  const { pendingRequests } = useSocial();
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [notificationCount, setNotificationCount] = useState(0);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    // Listen for friend requests in real-time
    const friendsChannel = supabase
      .channel('friend_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friends',
          filter: `friend_id=eq.${currentUser.id}`,
        },
        (payload: any) => {
          console.log('Friend request change:', payload);
          // Reload friend requests
          setFriendRequestCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Listen for notifications in real-time
    const notificationsChannel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload: any) => {
          console.log('New notification:', payload);
          setNotificationCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Load initial notification count and notifications
    const loadNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) {
        setNotifications(data);
        const unreadCount = data.filter((n: any) => !n.is_read).length;
        setNotificationCount(unreadCount);
      }
    };

    loadNotifications();

    return () => {
      supabase.removeChannel(friendsChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [currentUser]);

  useEffect(() => {
    setFriendRequestCount(pendingRequests.length);
  }, [pendingRequests]);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

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
        <div className="mb-4 px-2 flex items-center justify-between">
          <Link href="/" className="transition-transform hover:scale-105 inline-block">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            {/* Notifications Button */}
            <button
              onClick={handleBellClick}
              className="relative p-2 hover:bg-[#282828] rounded-full transition-colors"
            >
              <Bell className="w-5 h-5 text-[#b3b3b3] hover:text-white" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#1ed760] text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
            {/* Friends Button */}
            <button className="relative p-2 hover:bg-[#282828] rounded-full transition-colors">
              <Users className="w-5 h-5 text-[#b3b3b3] hover:text-white" />
              {friendRequestCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#1ed760] text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {friendRequestCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-12 right-0 w-80 bg-[#181818] border border-[#282828] rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-[#282828]">
                  <h3 className="text-sm font-bold text-white">Notifications</h3>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-[#b3b3b3] text-sm">
                    No notifications yet
                  </div>
                ) : (
                  <div className="divide-y divide-[#282828]">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-4 hover:bg-[#282828] cursor-pointer transition-colors ${
                          !notification.is_read ? 'bg-[#282828]/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-[#1ed760] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white mb-1">{notification.title}</p>
                            <p className="text-xs text-[#b3b3b3] leading-relaxed">{notification.message}</p>
                            {notification.link && (
                              <Link
                                href={notification.link}
                                className="text-xs text-[#1ed760] hover:underline mt-1 inline-block"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View →
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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
                          <Image src={course.imageUrl} alt={course.title} fill className="object-cover" sizes="48px" />
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
