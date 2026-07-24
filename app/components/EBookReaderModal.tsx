"use client";

import { useState } from "react";
import { X, BookOpen, ChevronLeft, ChevronRight, Download, CheckCircle2, Sparkles, Sun, Moon, Type, List, Bookmark, ShieldCheck, Heart } from "lucide-react";
import { moneyFarmingBookData, MoneyFarmingChapter } from "../data/money-farming-content";
import { useToast } from "../contexts/ToastContext";

interface EBookReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialChapterId?: number;
}

export default function EBookReaderModal({
  isOpen,
  onClose,
  initialChapterId = 0,
}: EBookReaderModalProps) {
  const { showToast } = useToast();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(initialChapterId); // 0 = Intro, 1..7 = Chapters, 8 = Declaration
  const [readerTheme, setReaderTheme] = useState<"dark" | "sepia" | "light">("dark");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [showToc, setShowToc] = useState(false);

  if (!isOpen) return null;

  const totalSections = moneyFarmingBookData.chapters.length + 2; // Intro (0) + 7 Chapters + Declaration (8)

  const handlePrev = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentChapterIndex < totalSections - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const currentChapter: MoneyFarmingChapter | undefined = 
    currentChapterIndex > 0 && currentChapterIndex <= 7 
      ? moneyFarmingBookData.chapters[currentChapterIndex - 1] 
      : undefined;

  // Theme styling presets
  const themeStyles = {
    dark: "bg-[#080c16] text-zinc-200 border-white/10",
    sepia: "bg-[#fbf0d9] text-[#433422] border-[#e2d2b4]",
    light: "bg-white text-zinc-900 border-zinc-200",
  };

  const fontSizeStyles = {
    sm: "text-xs sm:text-sm leading-relaxed",
    base: "text-sm sm:text-base leading-relaxed",
    lg: "text-base sm:text-lg leading-relaxed",
    xl: "text-lg sm:text-xl leading-relaxed",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden animate-fadeIn">
      {/* Modal Container */}
      <div className={`relative w-full max-w-5xl h-[92vh] rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-colors duration-300 ${themeStyles[readerTheme]}`}>
        
        {/* Top Header Navigation Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-inherit flex items-center justify-between gap-3 shrink-0 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setShowToc(!showToc)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-current shrink-0 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Table of Contents"
            >
              <List className="w-4 h-4 text-[#60a5fa]" />
              <span className="hidden sm:inline">Contents</span>
            </button>
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#60a5fa] block">
                Official E-Book Reader
              </span>
              <h2 className="text-xs sm:text-sm font-black truncate">{moneyFarmingBookData.title}</h2>
            </div>
          </div>

          {/* Reader Controls: Themes & Font Size */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden xs:flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setReaderTheme("dark")}
                className={`p-1.5 rounded-lg text-xs transition-all ${readerTheme === "dark" ? "bg-[#60a5fa] text-black font-bold" : "text-zinc-400 hover:text-white"}`}
                title="Dark Obsidian"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme("sepia")}
                className={`p-1.5 rounded-lg text-xs transition-all ${readerTheme === "sepia" ? "bg-[#e2d2b4] text-[#433422] font-bold" : "text-zinc-400 hover:text-white"}`}
                title="Warm Paper Sepia"
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme("light")}
                className={`p-1.5 rounded-lg text-xs transition-all ${readerTheme === "light" ? "bg-zinc-200 text-black font-bold" : "text-zinc-400 hover:text-white"}`}
                title="Clean Light"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Font Size Selector */}
            <button
              onClick={() => {
                const sizes: Array<"sm" | "base" | "lg" | "xl"> = ["sm", "base", "lg", "xl"];
                const next = sizes[(sizes.indexOf(fontSize) + 1) % sizes.length];
                setFontSize(next);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Adjust Font Size"
            >
              <Type className="w-3.5 h-3.5 text-[#60a5fa]" />
              <span className="uppercase">{fontSize}</span>
            </button>

            {/* Download PDF Button */}
            <a
              href={moneyFarmingBookData.pdfUrl}
              download
              onClick={() => showToast("Downloading Money Farming PDF...", "info")}
              className="p-2 bg-[#60a5fa] hover:bg-[#3b82f6] text-black font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1 text-xs cursor-pointer"
              title="Download Full PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 bg-black/60 hover:bg-red-500 text-white rounded-xl transition-all border border-white/10 cursor-pointer"
              title="Close Reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Reader View Body */}
        <div className="relative flex-1 flex overflow-hidden">
          
          {/* Table of Contents Drawer */}
          {showToc && (
            <div className="absolute inset-y-0 left-0 z-20 w-72 sm:w-80 bg-[#070b14]/95 backdrop-blur-xl border-r border-white/10 p-4 overflow-y-auto animate-fadeIn text-white space-y-3 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#60a5fa] flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  <span>Table of Contents</span>
                </h3>
                <button onClick={() => setShowToc(false)} className="text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1 text-xs">
                <button
                  onClick={() => { setCurrentChapterIndex(0); setShowToc(false); }}
                  className={`w-full text-left p-2.5 rounded-xl font-bold transition-all ${currentChapterIndex === 0 ? "bg-[#60a5fa] text-black" : "hover:bg-white/10 text-zinc-300"}`}
                >
                  00. Introduction: The Farmer&apos;s Secret
                </button>

                {moneyFarmingBookData.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => { setCurrentChapterIndex(idx + 1); setShowToc(false); }}
                    className={`w-full text-left p-2.5 rounded-xl font-bold transition-all ${currentChapterIndex === idx + 1 ? "bg-[#60a5fa] text-black" : "hover:bg-white/10 text-zinc-300"}`}
                  >
                    {ch.id.toString().padStart(2, '0')}. {ch.title.replace('Chapter ', '')}
                  </button>
                ))}

                <button
                  onClick={() => { setCurrentChapterIndex(8); setShowToc(false); }}
                  className={`w-full text-left p-2.5 rounded-xl font-bold transition-all ${currentChapterIndex === 8 ? "bg-[#60a5fa] text-black" : "hover:bg-white/10 text-zinc-300"}`}
                >
                  08. Final Declaration & Author
                </button>
              </div>
            </div>
          )}

          {/* Reading Scroll Container */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-10 space-y-8 max-w-4xl mx-auto">
            
            {/* Section 0: Introduction */}
            {currentChapterIndex === 0 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-2 border-b border-inherit pb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#60a5fa]/20 border border-[#60a5fa]/40 rounded-full text-xs font-black text-[#60a5fa] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>INTRODUCTION</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{moneyFarmingBookData.introduction.title}</h1>
                  <h2 className="text-lg sm:text-xl font-bold text-[#60a5fa]">{moneyFarmingBookData.introduction.subtitle}</h2>
                </div>

                <div className="p-4 bg-black/20 rounded-2xl border border-inherit space-y-2 italic text-xs sm:text-sm">
                  <p className="font-semibold">{moneyFarmingBookData.dedication}</p>
                </div>

                <div className={`space-y-4 font-serif ${fontSizeStyles[fontSize]}`}>
                  {moneyFarmingBookData.introduction.content.map((p, idx) => (
                    <p key={idx} className="leading-relaxed">{p}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Sections 1-7: Chapters */}
            {currentChapter && (
              <div className="space-y-6 animate-fadeIn">
                {/* Chapter Header */}
                <div className="space-y-2 border-b border-inherit pb-6">
                  <div className="flex items-center justify-between text-xs font-bold opacity-75">
                    <span className="uppercase text-[#60a5fa]">CHAPTER {currentChapter.id} OF 7</span>
                    <span>Page {currentChapter.pageNumber}</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{currentChapter.title}</h1>
                  <h2 className="text-lg sm:text-xl font-bold text-[#60a5fa]">{currentChapter.subtitle}</h2>
                </div>

                {/* Principle Callout Box */}
                {currentChapter.principle && (
                  <div className="p-4 sm:p-5 bg-[#60a5fa]/10 border-l-4 border-[#60a5fa] rounded-r-2xl space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#60a5fa] tracking-wider block">CORE PRINCIPLE</span>
                    <p className="text-xs sm:text-sm font-bold leading-relaxed">{currentChapter.principle}</p>
                  </div>
                )}

                {/* Key Takeaways */}
                <div className="p-4 bg-black/20 rounded-2xl border border-inherit space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#60a5fa] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#60a5fa]" />
                    <span>Key Takeaways</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm">
                    {currentChapter.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#60a5fa]">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Manuscript Paragraphs */}
                <div className={`space-y-4 font-serif ${fontSizeStyles[fontSize]}`}>
                  {currentChapter.content.map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">{paragraph}</p>
                  ))}
                </div>

                {/* Action Step Card */}
                {currentChapter.actionStep && (
                  <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2 text-white">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Action Step</span>
                    </h4>
                    <p className="text-xs sm:text-sm font-medium text-zinc-200">{currentChapter.actionStep}</p>
                  </div>
                )}

                {/* Reflection Questions */}
                {currentChapter.reflectionQuestions && (
                  <div className="p-5 bg-black/30 border border-inherit rounded-2xl space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#60a5fa]">Reflection Questions</h4>
                    <ol className="space-y-2 text-xs sm:text-sm list-decimal list-inside text-zinc-300">
                      {currentChapter.reflectionQuestions.map((q, idx) => (
                        <li key={idx} className="leading-relaxed">{q}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Section 8: Declaration & About Author */}
            {currentChapterIndex === 8 && (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-2 border-b border-inherit pb-6 text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-black text-emerald-400 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>FINAL DECLARATION</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight">The Money Farming Creed</h1>
                </div>

                <div className="p-6 bg-gradient-to-br from-[#0d1424] to-[#172545] rounded-3xl border border-[#60a5fa]/30 space-y-3 text-white shadow-xl">
                  {moneyFarmingBookData.finalDeclaration.map((dec, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs sm:text-base font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#60a5fa] shrink-0" />
                      <span>{dec}</span>
                    </div>
                  ))}
                </div>

                {/* About Author */}
                <div className="p-6 bg-black/20 rounded-3xl border border-inherit space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#60a5fa]">About the Author</h3>
                  <h4 className="text-xl font-black">{moneyFarmingBookData.aboutAuthor.name}</h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                    {moneyFarmingBookData.aboutAuthor.bio}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Pagination Controls */}
        <div className="px-4 sm:px-6 py-3 border-t border-inherit flex items-center justify-between shrink-0 bg-black/20 backdrop-blur-md text-xs font-bold">
          <button
            onClick={handlePrev}
            disabled={currentChapterIndex === 0}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-zinc-400">
            Section {currentChapterIndex + 1} of {totalSections}
          </span>

          <button
            onClick={handleNext}
            disabled={currentChapterIndex === totalSections - 1}
            className="px-4 py-2 bg-[#60a5fa] hover:bg-[#3b82f6] text-black disabled:opacity-30 rounded-xl transition-all flex items-center gap-1 cursor-pointer shadow-md"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
