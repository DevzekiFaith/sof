"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Bell, Users, ShoppingBag, ChevronUp, ChevronDown, MessageSquare, Heart, Sparkles, GraduationCap, Settings, Star } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import { useSocial } from "../../contexts/SocialContext";
import { useCart } from "../../contexts/CartContext";
import { supabase } from "../../../lib/supabase";

export default function BottomNav() {
  const pathname = usePathname();
  const { currentUser } = useUser();
  const { pendingRequests } = useSocial();
  const { cartCount, mounted } = useCart();
  const [notificationCount, setNotificationCount] = useState(0);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFriendRequests, setShowFriendRequests] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    // Listen for friend requests in real-time
    const friendsChannel = supabase
      .channel('friend_requests_changes_mobile')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friends',
          filter: `friend_id=eq.${currentUser.id}`,
        },
        (payload: any) => {
          setFriendRequestCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Listen for notifications in real-time
    const notificationsChannel = supabase
      .channel('notifications_changes_mobile')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload: any) => {
          setNotificationCount(prev => prev + 1);
        }
      )
      .subscribe();

    // Load initial notification count
    const loadNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('is_read', false);

      if (!error && data) {
        setNotificationCount(data.length);
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

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="w-6 h-6" /> },
    { href: "/search", label: "Search", icon: <Search className="w-6 h-6" /> },
    { href: "/profile", label: "Your Library", icon: <Library className="w-6 h-6" /> },
    { href: "/cart", label: "Cart", icon: <ShoppingBag className="w-6 h-6" />, badge: mounted ? cartCount : 0 },
    { href: "/community", label: "Community", icon: <MessageSquare className="w-6 h-6" /> },
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#60a5fa] text-black p-3 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
      >
        {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>

      <nav className={`md:hidden fixed bottom-0 left-0 right-0 bg-[#000000]/95 backdrop-blur-xl border-t border-white/5 z-50 transition-all duration-300 ${
        isMinimized ? "h-16" : "h-20"
      }`}>
        <div className={`px-8 py-3 flex justify-between items-center pb-safe transition-all duration-300 ${
          isMinimized ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive ? "text-white scale-110" : "text-[#b3b3b3]"
                }`}
              >
                <div className={`${isActive ? "text-white" : "text-[#b3b3b3]"} relative`}>
                  {link.icon}
                  {link.badge && link.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-black text-xs font-bold rounded-full flex items-center justify-center">
                      {link.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold tracking-tight">{link.label}</span>
              </Link>
            );
          })}
          {/* Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex flex-col items-center gap-1 transition-all duration-300 text-[#b3b3b3] hover:text-white relative"
            >
              <div className="relative">
                <Bell className="w-6 h-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#60a5fa] text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-tight">Alerts</span>
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute bottom-full right-0 mb-2 w-80 bg-[#181818] border border-[#282828] rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-[#282828]">
                  <h3 className="text-sm font-bold text-white">Notifications</h3>
                </div>
                <div className="p-4 text-center text-[#b3b3b3] text-sm">
                  No notifications yet
                </div>
              </div>
            )}
          </div>
          
          {/* Friends Button */}
          <div className="relative">
            <button 
              onClick={() => setShowFriendRequests(!showFriendRequests)}
              className="flex flex-col items-center gap-1 transition-all duration-300 text-[#b3b3b3] hover:text-white relative"
            >
              <div className="relative">
                <Users className="w-6 h-6" />
                {friendRequestCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#60a5fa] text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {friendRequestCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold tracking-tight">Friends</span>
            </button>
            
            {/* Friend Requests Dropdown */}
            {showFriendRequests && (
              <div className="absolute bottom-full right-0 mb-2 w-80 bg-[#181818] border border-[#282828] rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-[#282828]">
                  <h3 className="text-sm font-bold text-white">Friend Requests</h3>
                </div>
                {pendingRequests.length === 0 ? (
                  <div className="p-4 text-center text-[#b3b3b3] text-sm">
                    No pending requests
                  </div>
                ) : (
                  <div className="divide-y divide-[#282828]">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="p-4 hover:bg-[#282828] transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-[#282828] flex items-center justify-center">
                            <Users className="text-[#b3b3b3] w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{request.name}</p>
                            <p className="text-xs text-[#b3b3b3]">Level {request.level}</p>
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
      </nav>
    </>
  );
}
