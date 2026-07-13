"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, QrCode } from "lucide-react";

export default function FlyerPage() {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  // Reusable QR Code generator for the flyer
  const corners = (
    <>
      <rect x="0" y="0" width="7" height="7" fill="black" />
      <rect x="1" y="1" width="5" height="5" fill="white" />
      <rect x="2" y="2" width="3" height="3" fill="black" />
      
      <rect x="22" y="0" width="7" height="7" fill="black" />
      <rect x="23" y="1" width="5" height="5" fill="white" />
      <rect x="24" y="2" width="3" height="3" fill="black" />
      
      <rect x="0" y="22" width="7" height="7" fill="black" />
      <rect x="1" y="23" width="5" height="5" fill="white" />
      <rect x="2" y="24" width="3" height="3" fill="black" />
      
      <rect x="20" y="20" width="5" height="5" fill="black" />
      <rect x="21" y="21" width="3" height="3" fill="white" />
      <rect x="22" y="22" width="1" height="1" fill="black" />
    </>
  );

  // High density mock QR pixels
  const qrPixels = [
    [8,2],[10,2],[12,2],[15,2],[17,2],[19,2],
    [9,3],[11,3],[14,3],[18,3],[20,3],[21,3],
    [8,4],[13,4],[15,4],[16,4],[19,4],
    [9,5],[10,5],[12,5],[14,5],[17,5],[20,5],
    [8,8],[9,9],[12,8],[15,9],[19,8],[20,9],
    [2,9],[4,10],[10,12],[14,11],[18,12],[22,11],
    [11,14],[13,15],[16,14],[17,15],[25,14],[27,15],
    [9,18],[15,19],[21,18],[23,19],[26,18],[28,19],
    [10,22],[12,23],[14,24],[16,25],[18,26],[27,24]
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans selection:bg-[#60a5fa]/30">
      
      {/* Control bar */}
      <div className="h-16 bg-zinc-950/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-50 print:hidden">
        <Link href="/" className="flex items-center gap-2 text-sm text-[#9aa4b2] hover:text-white transition-colors">
          <ArrowLeft size={16} /> Home
        </Link>
        <button
          onClick={handlePrint}
          className="bg-[#007eff] hover:bg-[#0066cc] text-white px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-[#007eff]/10"
        >
          <Printer size={14} /> Print Poster
        </button>
      </div>

      <div className="grow flex items-center justify-center p-8 bg-[#0e0e11] print:p-0 print:bg-white">
        
        {/* Poster Wrapper */}
        <div 
          ref={printAreaRef}
          className="w-full max-w-[500px] aspect-[3/4] bg-[#007eff] rounded-[2.5rem] border-[10px] border-black overflow-hidden flex flex-col justify-between relative shadow-2xl print:border-none print:shadow-none print:rounded-none"
        >
          
          {/* Header block (Vivid Blue) */}
          <div className="pt-10 px-8 flex flex-col items-center text-center relative z-20">
            {/* Sparks cartoon */}
            <div className="absolute top-6 left-12 flex gap-1 -rotate-12">
              <div className="w-1.5 h-6 bg-yellow-300 rounded-full transform rotate-12" />
              <div className="w-1.5 h-6 bg-yellow-300 rounded-full transform -rotate-12 translate-y-2" />
            </div>

            <div className="space-y-1">
              <span className="text-yellow-300 font-black tracking-widest text-lg uppercase block drop-shadow-[0_2px_0_rgba(0,0,0,1)]">
                ORIGIN
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-none drop-shadow-[0_4px_0_rgba(0,0,0,1)]">
                COMMUNITY
              </h1>
            </div>

            {/* Speech bubble welcome */}
            <div className="absolute right-6 top-8 bg-white text-black border-[3px] border-black font-extrabold px-3 py-1.5 rounded-full text-xs rotate-12 flex items-center gap-1 shadow-[2px_2px_0_rgba(0,0,0,1)]">
              <span>welcome</span>
            </div>
          </div>

          {/* Center Card containing the QR Code */}
          <div className="px-10 py-4 flex justify-center relative z-20">
            {/* Asterisk decoration left */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-black -rotate-12">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            {/* Yellow scan arrow pointing to QR */}
            <div className="absolute right-4 top-10 bg-yellow-400 text-black border-[3px] border-black font-black px-4 py-2 rounded-xl -rotate-12 flex items-center gap-1 shadow-[3px_3px_0_rgba(0,0,0,1)]">
              <span className="text-xs uppercase tracking-wider">OPEN</span>
              <svg className="w-3.5 h-3.5 transform -rotate-90" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-6l-7 7-7-7" />
              </svg>
            </div>

            {/* The white QR Frame card */}
            <div className="bg-white p-8 rounded-[2.5rem] border-[4px] border-black shadow-[6px_6px_0_rgba(0,0,0,1)] flex flex-col items-center justify-center aspect-square w-64 md:w-72">
              <svg className="w-full h-full text-black" viewBox="0 0 29 29" shapeRendering="crispEdges">
                <rect x="0" y="0" width="29" height="29" fill="white" />
                {corners}
                {qrPixels.map(([x, y], idx) => (
                  <rect key={idx} x={x} y={y} width="1.1" height="1.1" fill="black" />
                ))}
              </svg>
            </div>

            {/* Peeking Googly Eyes right below QR code frame */}
            <div className="absolute right-4 bottom-[-10px] flex scale-90 md:scale-100 z-30">
              <div className="w-14 h-16 bg-white border-[3px] border-black rounded-full flex items-center justify-center -rotate-6 shadow-[2px_2px_0_rgba(0,0,0,0.15)]">
                <div className="w-5 h-6 bg-black rounded-full translate-x-1" />
              </div>
              <div className="w-14 h-16 bg-white border-[3px] border-black rounded-full flex items-center justify-center rotate-6 -ml-3 shadow-[2px_2px_0_rgba(0,0,0,0.15)]">
                <div className="w-5 h-6 bg-black rounded-full -translate-x-0.5" />
              </div>
            </div>
          </div>

          {/* Bottom Banner Wave (Vivid Black) */}
          <div className="relative z-10 w-full">
            {/* Wavy black canvas curve */}
            <svg viewBox="0 0 1440 320" className="w-full h-24 fill-black translate-y-3">
              <path d="M0,224 C288,288 576,160 864,224 C1152,288 1296,160 1440,224 L1440,320 L0,320 Z" />
            </svg>
            
            {/* Wave footer text */}
            <div className="absolute bottom-4 inset-x-0 text-center z-20">
              <span className="text-white font-extrabold text-sm uppercase tracking-[0.3em]">
                origin
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
