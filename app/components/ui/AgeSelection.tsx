"use client";

import { useState } from "react";
import AnimatedSection from "./AnimatedSection";

interface AgeSelectionProps {
  isOpen: boolean;
  onSelectAge: (ageGroup: string) => void;
  onClose: () => void;
}

const ageGroups = [
  {
    value: "10-15",
    label: "Ages 10-15",
    description: "Kids & Early Teens",
    emoji: "🌟",
    emoji: "🌟",
    color: "from-green-400 to-green-600"
  },
  {
    value: "16-25",
    label: "Ages 16-25",
    description: "Teens & Young Adults",
    emoji: "🚀",
    color: "from-[#1ed760] to-[#1db954]"
  },
  {
    value: "26-35",
    label: "Ages 26-35",
    description: "Adults",
    emoji: "💼",
    color: "from-green-600 to-teal-700"
  },
  {
    value: "36-45",
    label: "Ages 36-45",
    description: "Experienced Adults",
    emoji: "🌟",
    color: "from-[#1ed760] to-green-800"
  }
];

export default function AgeSelection({ isOpen, onSelectAge, onClose }: AgeSelectionProps) {
  const [selectedAge, setSelectedAge] = useState<string>("");

  if (!isOpen) return null;

  const handleSelectAge = (ageGroup: string) => {
    setSelectedAge(ageGroup);
    setTimeout(() => {
      onSelectAge(ageGroup);
    }, 500); // Small delay for animation
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <AnimatedSection>
        <div className="bg-[#181818] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#282828]">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-[#282828]">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Choose Your Age Group
              </h2>
              <p className="text-lg sm:text-xl text-[#b3b3b3] max-w-xl mx-auto">
                To provide you with the most relevant content and examples for your life stage, please select your age group.
              </p>
            </div>
          </div>

          {/* Age Selection Grid */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {ageGroups.map((ageGroup, index) => (
                <AnimatedSection key={ageGroup.value} delay={index * 100}>
                  <button
                    onClick={() => handleSelectAge(ageGroup.value)}
                    className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group ${selectedAge === ageGroup.value
                        ? "border-[#1ed760] bg-[#1ed760]/5 shadow-lg shadow-[#1ed760]/10"
                        : "border-[#282828] hover:border-[#1ed760]/50 bg-[#121212]"
                      }`}
                  >
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${ageGroup.color} flex items-center justify-center mb-4 mx-auto text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20`}>
                      {ageGroup.emoji}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
                      {ageGroup.label}
                    </h3>
                    <p className="text-base sm:text-lg text-[#b3b3b3] text-center">
                      {ageGroup.description}
                    </p>
                    {selectedAge === ageGroup.value && (
                      <div className="mt-4 flex justify-center">
                        <div className="w-6 h-6 bg-[#1ed760] rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    )}
                  </button>
                </AnimatedSection>
              ))}
            </div>

            {/* Skip Option */}
            <div className="mt-8 pt-6 border-t border-[#282828]">
              <div className="text-center">
                <p className="text-[#a7a7a7] mb-4">Prefer not to specify?</p>
                <button
                  onClick={() => handleSelectAge("general")}
                  className="px-6 py-3 bg-[#282828] hover:bg-[#333] text-[#b3b3b3] font-semibold rounded-lg transition-colors duration-300"
                >
                  View General Content
                </button>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}