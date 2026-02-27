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
    color: "from-yellow-400 to-orange-500"
  },
  {
    value: "16-25",
    label: "Ages 16-25",
    description: "Teens & Young Adults",
    emoji: "🚀",
    color: "from-orange-400 to-amber-500"
  },
  {
    value: "26-35",
    label: "Ages 26-35",
    description: "Adults",
    emoji: "💼",
    color: "from-amber-400 to-orange-500"
  },
  {
    value: "36-45",
    label: "Ages 36-45",
    description: "Experienced Adults",
    emoji: "🌟",
    color: "from-orange-400 to-yellow-500"
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
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Choose Your Age Group
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto">
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
                        ? "border-black bg-gray-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                  >
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${ageGroup.color} flex items-center justify-center mb-4 mx-auto text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300`}>
                      {ageGroup.emoji}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 text-center">
                      {ageGroup.label}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 text-center">
                      {ageGroup.description}
                    </p>
                    {selectedAge === ageGroup.value && (
                      <div className="mt-4 flex justify-center">
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    )}
                  </button>
                </AnimatedSection>
              ))}
            </div>

            {/* Skip Option */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-500 mb-4">Prefer not to specify?</p>
                <button
                  onClick={() => handleSelectAge("general")}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-300"
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