"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Bell, Users, ShoppingBag, ChevronUp, ChevronDown } from "lucide-react";
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
  ];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="md:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#1ed760] text-black p-3 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
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
          <button className="flex flex-col items-center gap-1 transition-all duration-300 text-[#b3b3b3] hover:text-white relative">
            <div className="relative">
              <Bell className="w-6 h-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1ed760] text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight">Alerts</span>
          </button>
          {/* Friends Button */}
          <button className="flex flex-col items-center gap-1 transition-all duration-300 text-[#b3b3b3] hover:text-white relative">
            <div className="relative">
              <Users className="w-6 h-6" />
              {friendRequestCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1ed760] text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {friendRequestCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-tight">Friends</span>
          </button>
        </div>
      </nav>
    </>
  );
}
