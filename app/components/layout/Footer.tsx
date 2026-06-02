import Link from "next/link";
import Logo from "../Logo";
import Copyright from "../Copyright";
import { MessageCircle, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#000000] border-t border-[#282828] mt-20 sm:mt-32">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Main brand section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Logo />
              <span className="text-3xl font-black text-white tracking-tighter">ORIGIN</span>
            </div>
            <p className="text-xl text-[#b3b3b3] max-w-md leading-relaxed mb-8">
              Formation for every stage of life. Practical, structured, and built to transform how you think, decide, and lead.
            </p>
            <div className="flex gap-4">
              {[
                { 
                  name: 'GitHub', 
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                      <path d="M9 18c-4.51 2-5-2-7-2"/>
                    </svg>
                  ) 
                },
                { name: 'Email', icon: <Mail size={20} /> },
                { name: 'Chat', icon: <MessageCircle size={20} /> }
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

