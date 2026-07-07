"use client";

import { useAccessibility } from '../../contexts/AccessibilityContext';
import { Text, Contrast, Eye, Keyboard, Moon, RotateCcw } from 'lucide-react';

export default function AccessibilitySettingsPage() {
  const { settings, updateSettings, resetSettings } = useAccessibility();

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Accessibility Settings</h1>

        <div className="space-y-6">
          {/* Text Size */}
          <div className="bg-[#282828] p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Text className="w-6 h-6 text-[#60a5fa]" />
              <h2 className="text-xl font-bold">Text Size</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => updateSettings({ textSize: size })}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    settings.textSize === size
                      ? 'bg-[#60a5fa] text-black font-bold'
                      : 'bg-[#333] text-white hover:bg-[#444]'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="bg-[#282828] p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Contrast className="w-6 h-6 text-[#60a5fa]" />
              <h2 className="text-xl font-bold">High Contrast Mode</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Increase contrast for better visibility. This will make text and UI elements more distinct.
            </p>
            <button
              onClick={() => updateSettings({ highContrast: !settings.highContrast })}
              className={`px-6 py-3 rounded-lg transition-colors ${
                settings.highContrast
                  ? 'bg-[#60a5fa] text-black font-bold'
                  : 'bg-[#333] text-white hover:bg-[#444]'
              }`}
            >
              {settings.highContrast ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Screen Reader */}
          <div className="bg-[#282828] p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-[#60a5fa]" />
              <h2 className="text-xl font-bold">Screen Reader Optimizations</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Enable ARIA live regions and other screen reader-friendly features.
            </p>
            <button
              onClick={() => updateSettings({ screenReader: !settings.screenReader })}
              className={`px-6 py-3 rounded-lg transition-colors ${
                settings.screenReader
                  ? 'bg-[#60a5fa] text-black font-bold'
                  : 'bg-[#333] text-white hover:bg-[#444]'
              }`}
            >
              {settings.screenReader ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="bg-[#282828] p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Moon className="w-6 h-6 text-[#60a5fa]" />
              <h2 className="text-xl font-bold">Reduced Motion</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Minimize animations and transitions for users who prefer less motion.
            </p>
            <button
              onClick={() => updateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`px-6 py-3 rounded-lg transition-colors ${
                settings.reducedMotion
                  ? 'bg-[#60a5fa] text-black font-bold'
                  : 'bg-[#333] text-white hover:bg-[#444]'
              }`}
            >
              {settings.reducedMotion ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Keyboard Navigation */}
          <div className="bg-[#282828] p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <Keyboard className="w-6 h-6 text-[#60a5fa]" />
              <h2 className="text-xl font-bold">Keyboard Navigation</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Enhance keyboard navigation with visible focus indicators and shortcuts.
            </p>
            <button
              onClick={() => updateSettings({ keyboardNavigation: !settings.keyboardNavigation })}
              className={`px-6 py-3 rounded-lg transition-colors ${
                settings.keyboardNavigation
                  ? 'bg-[#60a5fa] text-black font-bold'
                  : 'bg-[#333] text-white hover:bg-[#444]'
              }`}
            >
              {settings.keyboardNavigation ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              onClick={resetSettings}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
