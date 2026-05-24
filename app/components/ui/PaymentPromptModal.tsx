"use client";

import { useUser } from "../../contexts/UserContext";
import { Crown, Lock, Check, Sparkles } from "lucide-react";
import Link from "next/link";

interface PaymentPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  plan?: 'monthly' | 'annual' | 'lifetime';
}

export default function PaymentPromptModal({ isOpen, onClose, featureName, plan = 'monthly' }: PaymentPromptModalProps) {
  if (!isOpen) return null;

  const planDetails = {
    monthly: { price: 9.99, period: 'month', name: 'Monthly' },
    annual: { price: 79.99, period: 'year', name: 'Annual', savings: 'Save 33%' },
    lifetime: { price: 149, period: 'once', name: 'Lifetime' }
  };

  const currentPlan = planDetails[plan] || planDetails.monthly;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-[#181818] rounded-2xl p-8 shadow-2xl border border-[#282828]">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1ed760]/30 to-[#1ed760]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-[#1ed760]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Upgrade to {currentPlan.name}</h2>
          <p className="text-sm text-[#b3b3b3]">
            {featureName} is a {currentPlan.name} feature
          </p>
        </div>

        {/* Features */}
        <div className="bg-[#282828] rounded-xl p-4 mb-6">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1ed760]" />
            {currentPlan.name} includes:
          </h3>
          <ul className="space-y-2">
            {[
              "All courses access",
              "Full gamification (XP, achievements)",
              "Full social features (friends, challenges)",
              "Offline downloads",
              "Priority support"
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                <Check className="w-4 h-4 text-[#1ed760] flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
            {plan === 'annual' && (
              <li className="flex items-center gap-2 text-sm text-[#1ed760]">
                <Check className="w-4 h-4 text-[#1ed760] flex-shrink-0" />
                <span>Exclusive masterclasses & coaching</span>
              </li>
            )}
            {plan === 'lifetime' && (
              <>
                <li className="flex items-center gap-2 text-sm text-[#1ed760]">
                  <Check className="w-4 h-4 text-[#1ed760] flex-shrink-0" />
                  <span>All future courses</span>
                </li>
                <li className="flex items-center gap-2 text-sm text-[#1ed760]">
                  <Check className="w-4 h-4 text-[#1ed760] flex-shrink-0" />
                  <span>VIP support & exclusive community</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Price */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black text-white">${currentPlan.price}</span>
            <span className="text-sm text-[#b3b3b3]">/{currentPlan.period}</span>
          </div>
          {currentPlan.savings && (
            <p className="text-xs text-[#1ed760] mt-1 font-bold">{currentPlan.savings}</p>
          )}
          <p className="text-xs text-[#b3b3b3] mt-1">Cancel anytime</p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Link href={`/checkout?plan=${plan}`} className="block w-full" onClick={onClose}>
            <button className="w-full py-4 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2">
              <Crown className="w-5 h-5" />
              Upgrade Now
            </button>
          </Link>
          <button
            onClick={onClose}
            className="w-full py-3 bg-transparent border border-[#535353] text-white font-bold rounded-full hover:border-white transition-colors"
          >
            Maybe Later
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#b3b3b3] mt-4">
          Secure payment • 30-day money-back guarantee
        </p>
      </div>
    </div>
  );
}
