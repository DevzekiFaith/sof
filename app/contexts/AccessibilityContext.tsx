"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';

export type TextSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface AccessibilitySettings {
  textSize: TextSize;
  highContrast: boolean;
  screenReader: boolean;
  reducedMotion: boolean;
  keyboardNavigation: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  textSize: 'medium',
  highContrast: false,
  screenReader: false,
  reducedMotion: false,
  keyboardNavigation: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from Supabase
  useEffect(() => {
    if (!currentUser) return;

    const loadSettings = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('accessibility_settings')
        .eq('id', currentUser.id)
        .single();

      if (!error && data?.accessibility_settings) {
        try {
          const parsed = JSON.parse(data.accessibility_settings as string);
          setSettings({ ...defaultSettings, ...parsed });
        } catch (e) {
          // Error parsing settings
        }
      }
    };

    loadSettings();
  }, [currentUser]);

  // Save settings to Supabase
  useEffect(() => {
    if (!currentUser) return;

    const saveSettings = async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ accessibility_settings: JSON.stringify(settings) })
        .eq('id', currentUser.id);
    };

    saveSettings();
  }, [settings, currentUser]);

  // Apply settings to document
  useEffect(() => {
    // Apply text size
    const textSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px',
    };
    document.documentElement.style.fontSize = textSizeMap[settings.textSize];

    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }

    // Apply screen reader optimizations
    if (settings.screenReader) {
      document.documentElement.setAttribute('aria-live', 'polite');
    } else {
      document.documentElement.removeAttribute('aria-live');
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
