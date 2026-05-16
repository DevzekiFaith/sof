import Link from "next/link";
import Logo from "../Logo";
import Copyright from "../Copyright";
import { Twitter, Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#000000] border-t border-[#282828] mt-20 sm:mt-32">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Main brand section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Logo />
              <span className="text-3xl font-black text-white tracking-tighter">MAGIFY</span>
            </div>
            <p className="text-xl text-[#b3b3b3] max-w-md leading-relaxed mb-8">
              Formation for every stage of life. Practical, structured, and built to transform how you think, decide, and lead.
            </p>
            <div className="flex gap-4">
              {[
                { name: 'Twitter', icon: <Twitter size={20} /> },
                { name: 'Instagram', icon: <Instagram size={20} /> },
                { name: 'LinkedIn', icon: <Linkedin size={20} /> }
              ].map((social) => (
                <a key={social.name} href="#" className="w-10 h-10 rounded-full bg-[#282828] flex items-center justify-center text-[#b3b3b3] hover:text-white hover:bg-[#333] transition-all">
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Platform</h3>
            <ul className="space-y-4">
              <li><Link href="/#courses" className="text-[#b3b3b3] hover:text-white transition-colors font-medium">Browse Courses</Link></li>
              <li><Link href="/#pricing" className="text-[#b3b3b3] hover:text-white transition-colors font-medium">Pricing Plans</Link></li>
              <li><Link href="/about" className="text-[#b3b3b3] hover:text-white transition-colors font-medium">Our Mission</Link></li>
              <li><Link href="/contact" className="text-[#b3b3b3] hover:text-white transition-colors font-medium">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-[#b3b3b3] hover:text-white transition-colors font-medium">Privacy Policy</a></li>
              <li><a href="#" className="text-[#b3b3b3] hover:text-white transition-colors font-medium">Terms of Service</a></li>
              <li><a href="#" className="text-[#b3b3b3] hover:text-white transition-colors font-medium">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#282828] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-[#b3b3b3] font-medium">
            <Copyright />
          </div>
          <div className="flex gap-8 text-sm text-[#b3b3b3] font-bold">
            <span>Quality Education</span>
            <span>Lifelong Learning</span>
            <span>Skill Development</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

