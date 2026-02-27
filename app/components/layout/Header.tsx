"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "../Logo";
import AuthButton from "../ui/AuthButton";
import { useUser } from "../../contexts/UserContext";
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

  // Simple header for pages like About and Contact
  if (variant === "simple") {
    return (
      <header className="border-b-2 border-gray-200">
        <nav className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="transition-transform hover:scale-105 duration-300">
            <Logo />
          </Link>
          <div className="hidden sm:flex items-center gap-4 sm:gap-6">
            <Link href="/" className="text-gray-700 hover:text-black font-bold transition-colors text-base sm:text-lg">
              Home
            </Link>
            <Link href="/#courses" className="text-gray-700 hover:text-black font-bold transition-colors text-base sm:text-lg">
              Courses
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-black font-bold transition-colors text-base sm:text-lg">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black font-bold transition-colors text-base sm:text-lg">
              Contact
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  // Course detail page header
  if (variant === "course" && backLink) {
    return (
      <header className="border-b-2 border-gray-200">
        <nav className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="transition-transform hover:scale-105 duration-300">
            <Logo />
          </Link>
          <Link
            href={backLink.href}
            className="text-gray-700 hover:text-black font-bold transition-colors text-sm sm:text-base"
          >
            {backLink.text}
          </Link>
        </nav>
      </header>
    );
  }

  // Default header with mobile menu and auth (for home page)
  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
        <Link href="/" className="transition-transform hover:scale-105 duration-300">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center gap-6 sm:gap-8">
          <Link
            href="/#courses"
            className="text-gray-700 hover:text-black font-bold transition-colors text-base sm:text-lg"
          >
            Courses
          </Link>
          <Link
            href="/about"
            className="text-gray-700 hover:text-black font-bold transition-colors text-base sm:text-lg"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-gray-700 hover:text-black font-bold transition-colors text-base sm:text-lg"
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
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 hover:text-black transition-colors"
        >
          <MenuIcon />
        </button>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-gray-200 bg-white">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4">
            <Link href="/#courses" className="text-gray-700 hover:text-black font-bold text-base sm:text-lg">
              Courses
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-black font-bold text-base sm:text-lg">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-black font-bold text-base sm:text-lg">
              Contact
            </Link>
            {showAuth && (
              <>
                {currentUser && (
                  <Link href="/profile" className="text-gray-700 hover:text-black font-bold text-base sm:text-lg">
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

