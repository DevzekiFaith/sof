"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "../Logo";
import AuthButton from "../ui/AuthButton";
import { useUser } from "../../contexts/UserContext";
import { useTheme } from "../../contexts/ThemeContext";
import { MenuIcon } from "../Icons";

interface HeaderProps {
  variant?: "default" | "simple" | "course";
  showAuth?: boolean;
  backLink?: {
    href: string;
    text: string;
  };
}

export default function Header({
  variant = "default",
  showAuth = false,
  backLink
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useUser();
  const { isDark, toggleTheme } = useTheme();

  // Simple header for pages like About and Contact
  if (variant === "simple") {
    return (
      <header className="border-b border-white/5 bg-transparent">
        <nav className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="transition-transform hover:scale-105 duration-300">
            <Logo />
          </Link>
          <div className="hidden sm:flex items-center gap-4 sm:gap-6">
            <Link href="/" className="text-[#e6eef6] hover:text-[#60a5fa] font-semibold transition-colors text-base sm:text-lg">
              Home
            </Link>
            <Link href="/#courses" className="text-[#e6eef6] hover:text-[#60a5fa] font-semibold transition-colors text-base sm:text-lg">
              Courses
            </Link>
            <Link href="/about" className="text-[#e6eef6] hover:text-[#60a5fa] font-semibold transition-colors text-base sm:text-lg">
              About
            </Link>
            <Link href="/contact" className="text-[#9aa4b2] hover:text-white font-semibold transition-colors text-base sm:text-lg">
              Contact
            </Link>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/5 transition-colors">
              {isDark ? "🌙" : "☀️"}
            </button>
          </div>
        </nav>
      </header>
    );
  }

  // Course detail page header
  if (variant === "course" && backLink) {
    return (
      <header className="border-b border-white/5 bg-transparent">
        <nav className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="transition-transform hover:scale-105 duration-300">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/5 transition-colors">
              {isDark ? "🌙" : "☀️"}
            </button>
            <Link
              href={backLink.href}
              className="text-[#e6eef6] hover:text-[#60a5fa] font-semibold transition-colors text-sm sm:text-base"
            >
              {backLink.text}
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  // Default header with mobile menu and auth (for home page)
  return (
    <header className="sticky top-0 z-50 bg-transparent border-b border-white/5 backdrop-blur-sm">
      <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <Link href="/" className="transition-transform hover:scale-105 duration-300">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center gap-6 sm:gap-8">
          <Link
            href="/#courses"
            className="text-[#e6eef6] hover:text-[#60a5fa] font-semibold transition-colors text-base sm:text-lg"
          >
            Courses
          </Link>
          <Link
            href="/about"
            className="text-[#e6eef6] hover:text-[#60a5fa] font-semibold transition-colors text-base sm:text-lg"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-[#e6eef6] hover:text-[#60a5fa] font-semibold transition-colors text-base sm:text-lg"
          >
            Contact
          </Link>
          {showAuth && (
            <>
              {currentUser && (
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-black font-bold transition-colors text-base sm:text-lg"
                >
                  Profile
                </Link>
              )}
              <AuthButton />
            </>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/5 transition-colors hidden md:block">
            {isDark ? "🌙" : "☀️"}
          </button>
        </div>
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/5 transition-colors">
            {isDark ? "🌙" : "☀️"}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#e6eef6] dark:text-[#e6eef6] hover:text-[#60a5fa] transition-colors"
          >
            <MenuIcon />
          </button>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0b1220]">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4">
            <Link href="/#courses" className="text-[#e6eef6] hover:text-[#60a5fa] font-semibold text-base sm:text-lg">
              Courses
            </Link>
            <Link href="/about" className="text-[#e6eef6] hover:text-[#60a5fa] font-semibold text-base sm:text-lg">
              About
            </Link>
            <Link href="/contact" className="text-[#e6eef6] hover:text-[#60a5fa] font-semibold text-base sm:text-lg">
              Contact
            </Link>
            {showAuth && (
              <>
                {currentUser && (
                  <Link href="/profile" className="text-[#e6eef6] hover:text-[#60a5fa] font-semibold text-base sm:text-lg">
                    Profile
                  </Link>
                )}
                <AuthButton />
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

