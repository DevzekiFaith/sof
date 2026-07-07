import Link from "next/link";
import Image from "next/image";

export default function SimplifiedFooter() {
  return (
    <footer className="bg-black border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 overflow-hidden rounded-xl shadow-lg shadow-[#60a5fa]/20">
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
            </div>
            <p className="text-[#b3b3b3] text-sm leading-relaxed">Master life&apos;s essential skills. Personalized learning that adapts to your journey.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/store" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Store
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-white font-bold mb-4">Courses</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses/problem-solving" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Problem Solving
                </Link>
              </li>
              <li>
                <Link href="/courses/decision-making" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Decision Making
                </Link>
              </li>
              <li>
                <Link href="/courses/team-person" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Team Person
                </Link>
              </li>
              <li>
                <Link href="/courses/communication" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Communication
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-bold mb-4">The Becoming Store</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/store" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/store?category=ebooks" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  eBooks
                </Link>
              </li>
              <li>
                <Link href="/store?category=hardcopy" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Hardcopy Books
                </Link>
              </li>
              <li>
                <Link href="/store?category=merch" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Merch
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-[#b3b3b3] hover:text-white transition-colors text-sm">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#666] text-sm">© 2024 Origin. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-[#b3b3b3]">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
