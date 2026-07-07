"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Check, Clock, Wifi, Target, ArrowRight } from "lucide-react";
import { useLanguage, Language } from "../contexts/LanguageContext";
import { useUser } from "../contexts/UserContext";

export default function OnboardingPage() {
  const router = useRouter();
  const { setLanguage, availableLanguages, language } = useLanguage();
  const { currentUser } = useUser();
  const [step, setStep] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [learningGoal, setLearningGoal] = useState("");
  const [timeAvailable, setTimeAvailable] = useState("");
  const [internetAccess, setInternetAccess] = useState("");

  // Skip if already onboarded
  // TODO: Check user profile for onboarding status
  // if (currentUser?.onboarded) {
  //   router.push("/");
  //   return null;
  // }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    // Save onboarding preferences
    setLanguage(selectedLanguage);
    // TODO: Save other preferences to user profile
    router.push("/");
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },
    { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
    { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
  ];

  const goals = [
    { id: 'job', icon: '💼', title: 'Job Skills', desc: 'Get hired or promoted' },
    { id: 'exam', icon: '📚', title: 'Exam Prep', desc: 'Pass important tests' },
    { id: 'personal', icon: '🌱', title: 'Personal Growth', desc: 'Develop life skills' },
    { id: 'business', icon: '🚀', title: 'Entrepreneurship', desc: 'Start or grow a business' },
  ];

  const timeOptions = [
    { id: '5-15', icon: '⚡', title: '5-15 min/day', desc: 'Quick learning sessions' },
    { id: '30', icon: '⏱️', title: '30 min/day', desc: 'Balanced approach' },
    { id: '60', icon: '📖', title: '1+ hour/day', desc: 'Deep learning' },
  ];

  const internetOptions = [
    { id: 'always', icon: '📶', title: 'Always Online', desc: 'Stable internet connection' },
    { id: 'sometimes', icon: '📡', title: 'Sometimes', desc: 'Limited or shared connection' },
    { id: 'rarely', icon: '📴', title: 'Rarely', desc: 'Need offline mode' },
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* Progress Bar */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#b3b3b3]">Step {step} of 4</span>
          <span className="text-sm text-[#60a5fa]">{Math.round((step / 4) * 100)}%</span>
        </div>
        <div className="w-full bg-[#282828] rounded-full h-2">
          <div
            className="bg-[#60a5fa] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-black mb-2">Welcome to Origin</h1>
                <p className="text-[#b3b3b3]">Choose your preferred language</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code as Language)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      selectedLanguage === lang.code
                        ? 'border-[#60a5fa] bg-[#60a5fa]/10'
                        : 'border-[#282828] bg-[#181818] hover:border-[#333]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{lang.flag}</span>
                      {selectedLanguage === lang.code && (
                        <Check className="w-5 h-5 text-[#60a5fa]" />
                      )}
                    </div>
                    <p className="font-semibold">{lang.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-black mb-2">What's your goal?</h1>
                <p className="text-[#b3b3b3]">Select what you want to achieve</p>
              </div>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setLearningGoal(goal.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                      learningGoal === goal.id
                        ? 'border-[#60a5fa] bg-[#60a5fa]/10'
                        : 'border-[#282828] bg-[#181818] hover:border-[#333]'
                    }`}
                  >
                    <span className="text-3xl">{goal.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{goal.title}</p>
                      <p className="text-sm text-[#b3b3b3]">{goal.desc}</p>
                    </div>
                    {learningGoal === goal.id && <Check className="w-5 h-5 text-[#60a5fa]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-black mb-2">How much time?</h1>
                <p className="text-[#b3b3b3]">Choose your daily learning time</p>
              </div>
              <div className="space-y-3">
                {timeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setTimeAvailable(option.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                      timeAvailable === option.id
                        ? 'border-[#60a5fa] bg-[#60a5fa]/10'
                        : 'border-[#282828] bg-[#181818] hover:border-[#333]'
                    }`}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{option.title}</p>
                      <p className="text-sm text-[#b3b3b3]">{option.desc}</p>
                    </div>
                    {timeAvailable === option.id && <Check className="w-5 h-5 text-[#60a5fa]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-black mb-2">Internet access?</h1>
                <p className="text-[#b3b3b3]">Help us optimize for your connection</p>
              </div>
              <div className="space-y-3">
                {internetOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setInternetAccess(option.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                      internetAccess === option.id
                        ? 'border-[#60a5fa] bg-[#60a5fa]/10'
                        : 'border-[#282828] bg-[#181818] hover:border-[#333]'
                    }`}
                  >
                    <span className="text-3xl">{option.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{option.title}</p>
                      <p className="text-sm text-[#b3b3b3]">{option.desc}</p>
                    </div>
                    {internetAccess === option.id && <Check className="w-5 h-5 text-[#60a5fa]" />}
                  </button>
                ))}
              </div>
              {internetAccess === 'rarely' && (
                <div className="p-4 bg-[#60a5fa]/10 border border-[#60a5fa]/20 rounded-xl">
                  <p className="text-sm text-[#60a5fa]">
                    <strong>Offline mode enabled:</strong> We'll optimize for downloading content when you have internet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-[#282828]">
        <div className="flex gap-3 max-w-md mx-auto">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 bg-[#282828] text-white font-bold rounded-full hover:bg-[#333] transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !selectedLanguage) ||
              (step === 2 && !learningGoal) ||
              (step === 3 && !timeAvailable) ||
              (step === 4 && !internetAccess)
            }
            className="flex-1 py-4 bg-[#60a5fa] text-black font-bold rounded-full hover:bg-[#1db954] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {step === 4 ? 'Start Learning' : 'Next'}
            {step < 4 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
