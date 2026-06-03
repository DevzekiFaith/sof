"use client";

import { useUser } from "../../contexts/UserContext";
import { Lock, Check, Sparkles, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface PaymentPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  courseId?: string;
}

export default function PaymentPromptModal({ isOpen, onClose, featureName, courseId }: PaymentPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-[#181818] rounded-2xl p-8 shadow-2xl border border-[#282828]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1ed760]/30 to-[#1ed760]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-[#1ed760]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Purchase Course</h2>
          <p className="text-sm text-[#b3b3b3]">
            {featureName} requires course purchase
          </p>
        </div>

        {/* Features */}
        <div className="bg-[#282828] rounded-xl p-4 mb-6">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1ed760]" />
            Course includes:
          </h3>
          <ul className="space-y-2">
            {[
              "Full course access",
              "Video lessons & materials",
              "Interactive exercises",
              "Progress tracking",
              "Certificate of completion"
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                <Check className="w-4 h-4 text-[#1ed760] flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {courseId ? (
            <Link href={`/checkout?course=${courseId}`} className="block w-full" onClick={onClose}>
              <button className="w-full py-4 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Purchase Course
              </button>
            </Link>
          ) : (
            <Link href="/courses" className="block w-full" onClick={onClose}>
              <button className="w-full py-4 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Browse Courses
              </button>
            </Link>
          )}
          <button
            onClick={onClose}
            className="w-full py-3 bg-transparent border border-[#535353] text-white font-bold rounded-full hover:border-white transition-colors"
          >
            Maybe Later
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#b3b3b3] mt-4">
          Secure payment • One-time purchase
        </p>
      </div>
    </div>
  );
}
