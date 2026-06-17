"use client";

import { useState } from "react";
import { X, ShoppingCart, Star, Clock, Award, User, Check } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useRouter } from "next/navigation";
import { Course } from "../../data/courses";

interface CoursePurchaseModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export default function CoursePurchaseModal({ course, isOpen, onClose }: CoursePurchaseModalProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(course);
    setTimeout(() => {
      setIsAdding(false);
      onClose();
      router.push("/cart");
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#181818] rounded-2xl border border-[#282828] max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <div className={`h-48 bg-gradient-to-br ${course.bgGradient} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/80" style={{ fontSize: '64px' }}>
                <course.icon />
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="absolute bottom-4 left-4 bg-[#D4AF37] text-black text-lg font-bold px-4 py-2 rounded-lg">
              ${course.priceUSD}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-2">{course.title}</h2>
          <p className="text-[#b3b3b3] text-sm mb-4">{course.description}</p>

          {/* Instructor */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#282828]">
            <div className="w-10 h-10 rounded-full bg-[#282828] flex items-center justify-center">
              <User className="w-5 h-5 text-[#b3b3b3]" />
            </div>
            <div>
              <p className="text-white font-medium">{course.instructor || "Origin Academy"}</p>
              <p className="text-xs text-[#b3b3b3]">{course.instructorTitle || "Expert Instructor"}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#121212] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                <span className="text-white font-bold">{course.rating || 4.8}</span>
              </div>
              <p className="text-xs text-[#b3b3b3]">Rating</p>
            </div>
            <div className="bg-[#121212] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-[#1ed760]" />
                <span className="text-white font-bold">{course.duration || "8h"}</span>
              </div>
              <p className="text-xs text-[#b3b3b3]">Duration</p>
            </div>
            <div className="bg-[#121212] rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="w-4 h-4 text-[#1ed760]" />
                <span className="text-white font-bold">{course.level || "All"}</span>
              </div>
              <p className="text-xs text-[#b3b3b3]">Level</p>
            </div>
          </div>

          {/* What you'll learn */}
          {course.outcomes && course.outcomes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white font-bold mb-3">What you'll learn</h3>
              <ul className="space-y-2">
                {course.outcomes.slice(0, 4).map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-[#b3b3b3]">
                    <Check className="w-4 h-4 text-[#1ed760] flex-shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Students */}
          <div className="mb-6 text-sm text-[#b3b3b3]">
            <span className="text-white font-medium">{course.studentCount || 8000}+</span> students enrolled
          </div>

          {/* Price and CTA */}
          <div className="bg-[#121212] rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[#b3b3b3] text-sm">Total Price</p>
                <p className="text-3xl font-bold text-white">${course.priceUSD}</p>
              </div>
              <div className="text-right">
                <p className="text-[#b3b3b3] text-sm">NGN</p>
                <p className="text-xl font-bold text-white">₦{(course.priceUSD || 0) * 1500}</p>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full bg-[#1ed760] hover:bg-[#1db954] text-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Guarantee */}
          <div className="text-center text-xs text-[#b3b3b3]">
            <p>30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  );
}
