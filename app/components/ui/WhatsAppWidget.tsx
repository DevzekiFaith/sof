"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ArrowRight, ShieldCheck, MessageCircle } from "lucide-react";

// Clean static QR code SVG matrix generator for wa.me link with logo overlay
function WhatsAppQRCode() {
  const corners = (
    <>
      {/* Top Left Positioning Block */}
      <rect x="0" y="0" width="7" height="7" fill="#000000" />
      <rect x="1" y="1" width="5" height="5" fill="white" />
      <rect x="2" y="2" width="3" height="3" fill="#000000" />
      {/* Top Right Positioning Block */}
      <rect x="22" y="0" width="7" height="7" fill="#000000" />
      <rect x="23" y="1" width="5" height="5" fill="white" />
      <rect x="24" y="2" width="3" height="3" fill="#000000" />
      {/* Bottom Left Positioning Block */}
      <rect x="0" y="22" width="7" height="7" fill="#000000" />
      <rect x="1" y="23" width="5" height="5" fill="white" />
      <rect x="2" y="24" width="3" height="3" fill="#000000" />
      {/* Small Alignment Block */}
      <rect x="20" y="20" width="5" height="5" fill="#000000" />
      <rect x="21" y="21" width="3" height="3" fill="white" />
      <rect x="22" y="22" width="1" height="1" fill="#000000" />
    </>
  );

  const pixels = [
    [8,1],[9,2],[12,1],[14,2],[17,1],[19,2],[21,1],
    [9,3],[11,3],[13,4],[16,3],[18,4],[20,3],
    [8,5],[10,5],[12,6],[14,5],[17,6],[19,5],
    [8,8],[9,9],[12,8],[15,9],[19,8],[20,9],[21,8],
    [2,9],[4,10],[10,12],[14,11],[18,12],[22,11],[25,10],
    [11,14],[13,15],[16,14],[17,15],[25,14],[27,15],
    [9,18],[15,19],[21,18],[23,19],[26,18],[28,19],
    [10,22],[12,23],[14,24],[16,25],[18,26],[20,24]
  ];

  return (
    <svg className="w-full h-full" viewBox="0 0 29 29" shapeRendering="crispEdges">
      <defs>
        <clipPath id="waCircleView">
          <circle cx="14.5" cy="14.5" r="3" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="29" height="29" fill="white" />
      {corners}
      {pixels.map(([x, y], idx) => (
        <rect key={idx} x={x} y={y} width="1" height="1" fill="#000000" />
      ))}
      {/* Circle mask and Logo overlay */}
      <circle cx="14.5" cy="14.5" r="4.2" fill="white" />
      <image href="/origin.png" x="11.5" y="11.5" width="6" height="6" clipPath="url(#waCircleView)" />
    </svg>
  );
}

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Show floating widget after scrolling slightly
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setHasScrolled(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenChat = () => {
    window.open("https://wa.me/2349119059859?text=Hello%20Origin!%20I%20want%20to%20know%20more%20about%20your%20courses.", "_blank");
  };

  return (
    <>
      {/* Floating WhatsApp Action Button */}
      <div
        className={`fixed bottom-6 right-6 z-[9999] transition-all duration-500 transform ${
          hasScrolled ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-[#25d366] hover:bg-[#20ba5a] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(37,211,102,0.4)] transition-all hover:scale-110 active:scale-95"
        >
          {/* Pulsing overlay */}
          <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-25 group-hover:hidden" />
          
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.724-1.464L0 24zm5.75-2.03c1.64.974 3.167 1.488 4.793 1.489 5.568 0 10.099-4.528 10.1-10.1.002-2.699-1.043-5.236-2.943-7.14C15.85 4.316 13.319 3.27 10.617 3.27c-5.578 0-10.113 4.532-10.117 10.102-.001 1.79.488 3.537 1.417 5.074l-.988 3.606 3.692-.969zm13.14-7.558c-.33-.165-1.952-.963-2.251-1.072-.3-.11-.518-.165-.736.165-.218.33-.845 1.072-1.036 1.29-.19.218-.38.245-.71.08-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.642-1.953-1.834-2.282-.19-.33-.02-.508.145-.671.147-.148.33-.385.495-.578.165-.192.22-.33.33-.55.11-.22.055-.412-.028-.577-.083-.165-.736-1.774-1.009-2.434-.266-.64-.537-.552-.736-.562-.19-.01-.408-.01-.626-.01s-.572.082-.872.412c-.3.33-1.145 1.118-1.145 2.724s1.172 3.16 1.336 3.38c.164.22 2.307 3.523 5.59 4.94 2.73 1.18 3.284.945 3.884.887.6-.058 1.953-.798 2.225-1.567.272-.77.272-1.43.19-1.567-.082-.137-.3-.22-.63-.385z" />
          </svg>
        </button>
      </div>

      {/* Modal Popup Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          
          <div className="relative flex flex-col items-center gap-3">
            {/* External Close Button - Always visible above the phone card! */}
            <button
              onClick={() => setIsOpen(false)}
              className="self-end bg-black/60 hover:bg-black text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-md border border-white/20"
              title="Close Support"
            >
              <X size={18} />
            </button>

            {/* Smartphone Mockup matching homepage cards */}
            <div className="relative w-[260px] aspect-[9/18.5] bg-zinc-950 border-[6px] border-zinc-800 rounded-[2.5rem] p-2 flex flex-col justify-between overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] select-none">
              
              {/* Speaker and Camera notch at top */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-800 rounded-full flex items-center justify-center z-50">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
              </div>

              {/* Screen Area */}
              <div className="flex-1 bg-white rounded-[2rem] flex flex-col justify-between p-3.5 relative overflow-hidden text-zinc-800">
                
                {/* Top Status Bar & Header */}
                <div className="space-y-1.5 pt-2">
                  {/* Signal & battery status */}
                  <div className="flex justify-between items-center text-[8px] text-zinc-400 font-bold px-1">
                    <span>12:30</span>
                    <div className="flex items-center gap-1">
                      {/* Wifi Icon */}
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 21a2 2 0 1 1-2-2 2 2 0 0 1 2 2zm1-5.32a10.93 10.93 0 0 0-14 0l1.42 1.42a8.94 8.94 0 0 1 11.16 0zM12 2a19.92 19.92 0 0 0-20 0l1.42 1.42a17.92 17.92 0 0 1 37.16 0z" />
                      </svg>
                      {/* Battery Icon */}
                      <svg className="w-3.5 h-2 fill-current" viewBox="0 0 24 12">
                        <rect x="0" y="0" width="20" height="12" rx="2" fill="currentColor" />
                        <rect x="21" y="3" width="3" height="6" rx="1" fill="currentColor" />
                      </svg>
                    </div>
                  </div>

                  {/* Navigation Title Bar */}
                  <div className="flex items-center gap-1.5 border-b border-zinc-100 pb-1.5">
                    {/* Cyan Chevron Left */}
                    <svg className="w-3.5 h-3.5 text-cyan-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-[10px] font-bold text-zinc-700 truncate w-full">
                      WhatsApp Live Support
                    </span>
                  </div>

                  {/* Green Status Banner */}
                  <div className="bg-[#10b981] text-white py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-[9px] font-black tracking-wide shadow-sm">
                    {/* White Check Circle */}
                    <svg className="w-3 h-3 bg-white text-[#10b981] rounded-full p-0.5 fill-current shrink-0" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Agent Online & Active!</span>
                  </div>
                </div>

                {/* Middle QR Code inside Cyan Corner Brackets */}
                <div className="flex-1 flex flex-col items-center justify-center my-3 gap-2">
                  <div className="relative p-3 flex items-center justify-center">
                    
                    {/* Cyan Corner Brackets */}
                    <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400 rounded-tl-sm" />
                    <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400 rounded-tr-sm" />
                    <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400 rounded-bl-sm" />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400 rounded-br-sm" />

                    {/* REAL Scannable WhatsApp Link QR Code encoding https://sof-beta.vercel.app/ */}
                    <div className="relative w-24 h-24 bg-white flex items-center justify-center p-1.5">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://sof-beta.vercel.app/"
                        alt="Scannable WhatsApp Support QR"
                        className="w-full h-full object-contain"
                      />
                      
                      {/* Circular Logo overlay in the center */}
                      <div className="absolute w-6.5 h-6.5 bg-white rounded-full flex items-center justify-center shadow-md p-0.5 border border-zinc-200/50">
                        <img
                          src="/origin.png"
                          className="rounded-full w-full h-full object-cover"
                          alt="Origin"
                        />
                      </div>
                    </div>

                  </div>
                  
                  <span className="text-[8px] text-zinc-400 text-center px-2 leading-relaxed">
                    Scan with your mobile camera or click below to chat instantly.
                  </span>
                </div>

                {/* Chat Action Button inside screen */}
                <div className="space-y-2">
                  <button
                    onClick={handleOpenChat}
                    className="w-full bg-[#25d366] hover:bg-[#20ba5a] text-white font-extrabold text-[10px] uppercase tracking-wider py-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 active:scale-95 duration-200"
                  >
                    <MessageCircle size={13} />
                    <span>Open Live Chat</span>
                  </button>

                  {/* Bottom Stats Section */}
                  <div className="grid grid-cols-2 gap-2 border-t border-zinc-100 pt-2 text-center">
                    <div className="border-r border-zinc-100">
                      <span className="text-[7px] text-zinc-400 font-extrabold uppercase tracking-wide block">
                        Response Time
                      </span>
                      <span className="text-[9px] font-black text-zinc-800">
                        &lt; 5 Minutes
                      </span>
                    </div>
                    <div>
                      <span className="text-[7px] text-zinc-400 font-extrabold uppercase tracking-wide block">
                        Availability
                      </span>
                      <span className="text-[9px] font-black text-zinc-800">
                        24/7 Live
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Floating scanner visual overlay in mockup border */}
              <div className="absolute inset-x-8 top-[36%] bottom-[42%] border border-cyan-500/20 pointer-events-none rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
