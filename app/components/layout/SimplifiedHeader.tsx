"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, BookOpen } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../contexts/CartContext";

export default function SimplifiedHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, mounted } = useCart();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/events", label: "Events" },
    { href: "/store", label: "The Becoming Store" },
    { href: "/community", label: "Community" },
  ];

  return (
    <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-xl shadow-lg shadow-[#60a5fa]/20 group-hover:shadow-[#60a5fa]/40 transition-all">
              <Image
                src="/origin.png"
                alt="Origin Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white leading-none tracking-tight">Origin</span>
              <span className="text-[9px] text-[#60a5fa] tracking-[0.2em] font-semibold uppercase">Education</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors ${
                  pathname === link.href ? "text-white" : "text-[#b3b3b3] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/cart" className="relative text-[#b3b3b3] hover:text-white transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#60a5fa] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/purchases" className="text-[#b3b3b3] hover:text-white transition-colors">
              <BookOpen className="w-6 h-6" />
            </Link>
            <Link href="/courses" className="bg-[#60a5fa] text-black px-6 py-2 rounded-full font-bold hover:bg-[#1db954] transition-colors">
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block font-medium transition-colors ${
                  pathname === link.href ? "text-white" : "text-[#b3b3b3] hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-2">
              <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="relative text-[#b3b3b3] hover:text-white transition-colors flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                <span>Cart</span>
                {mounted && cartCount > 0 && (
                  <span className="bg-[#60a5fa] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/purchases" onClick={() => setMobileMenuOpen(false)} className="text-[#b3b3b3] hover:text-white transition-colors flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                <span>Purchases</span>
              </Link>
            </div>
            <Link href="/courses" className="w-full bg-[#60a5fa] text-black px-6 py-2 rounded-full font-bold hover:bg-[#1db954] transition-colors text-center block">
              Get Started
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
