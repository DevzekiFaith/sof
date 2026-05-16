"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library } from "lucide-react";
import { useUser } from "../../contexts/UserContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { currentUser } = useUser();

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="w-6 h-6" /> },
    { href: "/#courses", label: "Search", icon: <Search className="w-6 h-6" /> },
    { href: "/profile", label: "Your Library", icon: <Library className="w-6 h-6" /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#000000]/95 backdrop-blur-xl border-t border-white/5 px-8 py-3 z-50 flex justify-between items-center pb-safe">
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
            <div className={`${isActive ? "text-white" : "text-[#b3b3b3]"}`}>
              {link.icon}
            </div>
            <span className="text-[10px] font-bold tracking-tight">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
