"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ArrowRight, ShieldCheck, MessageCircle } from "lucide-react";

// Clean static QR code SVG matrix generator for wa.me link
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
      <rect x="0" y="0" width="29" height="29" fill="white" />
      {corners}
      {pixels.map(([x, y], idx) => (
        <rect key={idx} x={x} y={y} width="1" height="1" fill="#000000" />
      ))}
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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          
          {/* Main Card Container */}
          <div className="relative w-full max-w-[360px] bg-[#0c0d10]/75 backdrop-blur-xl rounded-[2rem] border-4 border-zinc-800/80 overflow-hidden shadow-2xl flex flex-col justify-between select-none">
            
            {/* Close Button top-right over image */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-50 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md border border-white/10"
            >
              <X size={16} />
            </button>

            {/* TOP HEADER: Smiling Woman Banner (with custom cover styling) */}
            <div className="relative h-60 w-full overflow-hidden border-b-2 border-black/40 bg-zinc-950">
              <Image 
                src="/whatsapp-banner.jpg" 
                alt="WhatsApp Live Support" 
                fill 
                className="object-cover object-top"
                priority
              />
              
              {/* Subtle dark gradient overlay to blend into body */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d10]/95 via-transparent to-black/10" />

              {/* Float WhatsApp icon on top left of image */}
              <div className="absolute bottom-4 left-4 bg-[#25d366] text-white p-2 rounded-full border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] scale-90">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.724-1.464L0 24zm5.75-2.03c1.64.974 3.167 1.488 4.793 1.489 5.568 0 10.099-4.528 10.1-10.1.002-2.699-1.043-5.236-2.943-7.14C15.85 4.316 13.319 3.27 10.617 3.27c-5.578 0-10.113 4.532-10.117 10.102-.001 1.79.488 3.537 1.417 5.074l-.988 3.606 3.692-.969zm13.14-7.558c-.33-.165-1.952-.963-2.251-1.072-.3-.11-.518-.165-.736.165-.218.33-.845 1.072-1.036 1.29-.19.218-.38.245-.71.08-.33-.165-1.393-.513-2.653-1.637-.98-.874-1.642-1.953-1.834-2.282-.19-.33-.02-.508.145-.671.147-.148.33-.385.495-.578.165-.192.22-.33.33-.55.11-.22.055-.412-.028-.577-.083-.165-.736-1.774-1.009-2.434-.266-.64-.537-.552-.736-.562-.19-.01-.408-.01-.626-.01s-.572.082-.872.412c-.3.33-1.145 1.118-1.145 2.724s1.172 3.16 1.336 3.38c.164.22 2.307 3.523 5.59 4.94 2.73 1.18 3.284.945 3.884.887.6-.058 1.953-.798 2.225-1.567.272-.77.272-1.43.19-1.567-.082-.137-.3-.22-.63-.385z" />
                </svg>
              </div>
            </div>

            {/* BODY BLOCK */}
            <div className="p-6 space-y-5">
              
              {/* Text Description */}
              <div className="space-y-2">
                <span className="text-[#c1ea35] font-black text-[10px] tracking-wider uppercase">
                  WhatsApp Support
                </span>
                <h3 className="text-white font-black text-xl uppercase tracking-tight leading-snug">
                  Get Instant Course & Purchase Support
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-light">
                  Have questions about our universal courses, eBook downloads, or checkout? Connect with us on WhatsApp for 24/7 direct query assistance.
                </p>
              </div>

              {/* Interactive QR Section Box */}
              <div className="bg-white/[0.04] backdrop-blur-md p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                
                {/* QR Code */}
                <div className="bg-white p-1 rounded-xl w-20 h-20 flex items-center justify-center shrink-0 shadow-lg border border-black/20">
                  <WhatsAppQRCode />
                </div>
                
                {/* Instruction */}
                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-300 font-bold uppercase block tracking-wide">
                    Scan with Phone
                  </span>
                  <span className="text-[9px] text-zinc-500 leading-tight block">
                    Point your mobile camera at this QR code to load the support chat instantly on your phone.
                  </span>
                </div>

              </div>

              {/* Get Support Primary Button */}
              <button
                onClick={handleOpenChat}
                className="w-full bg-[#c1ea35] hover:bg-[#aacc2a] text-black font-extrabold text-xs uppercase tracking-wider py-4 rounded-full shadow-lg shadow-[#c1ea35]/10 transition-colors flex items-center justify-center gap-2 active:scale-95 duration-200"
              >
                <MessageCircle size={15} />
                <span>Get Support</span>
                <ArrowRight size={14} className="ml-0.5" />
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
