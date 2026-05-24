"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';

export interface DownloadedContent {
  id: string;
  type: 'course' | 'module' | 'audio';
  title: string;
  size: number; // in bytes
  downloadedAt: Date;
  lastAccessed: Date;
  isFullyDownloaded: boolean;
  progress: number; // 0-100
}

export interface OfflineSettings {
  autoDownload: boolean;
  wifiOnly: boolean;
  maxStorage: number; // in MB
  downloadQuality: 'low' | 'medium' | 'high';
}

interface OfflineContextType {
  downloadedContent: DownloadedContent[];
  isOnline: boolean;
  settings: OfflineSettings;
  usedStorage: number;
  downloadContent: (id: string, type: 'course' | 'module' | 'audio', title: string) => Promise<void>;
  removeContent: (id: string) => void;
  updateSettings: (settings: Partial<OfflineSettings>) => void;
  clearAllDownloads: () => void;
  getOfflineContent: (id: string) => DownloadedContent | undefined;
  isContentAvailableOffline: (id: string) => boolean;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const [downloadedContent, setDownloadedContent] = useState<DownloadedContent[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [settings, setSettings] = useState<OfflineSettings>({
    autoDownload: false,
    wifiOnly: true,
    maxStorage: 500, // 500 MB default
    downloadQuality: 'medium'
  });

  // Load offline settings from Supabase
  useEffect(() => {
    if (!currentUser) return;

    const loadSettings = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('offline_settings')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        console.error('Error loading offline settings:', error);
        return;
      }

      if (data?.offline_settings) {
        try {
          setSettings(JSON.parse(data.offline_settings as string));
        } catch (e) {
          console.error('Error parsing offline settings:', e);
        }
      }
    };

    loadSettings();
  }, [currentUser]);

  // Save offline settings to Supabase
  useEffect(() => {
    if (!currentUser) return;

    const saveSettings = async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ offline_settings: JSON.stringify(settings) })
        .eq('id', currentUser.id);

      if (error) {
        console.error('Error saving offline settings:', error);
      }
    };

    saveSettings();
  }, [settings, currentUser]);

  // Load downloaded content from localStorage (device-specific)
  useEffect(() => {
    const savedContent = localStorage.getItem('magify_downloads');

    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent);
        setDownloadedContent(parsed.map((c: any) => ({
          ...c,
          downloadedAt: new Date(c.downloadedAt),
          lastAccessed: new Date(c.lastAccessed)
        })));
      } catch (e) {
        console.error('Error loading downloads:', e);
      }
    }
  }, []);

  // Save downloaded content to localStorage (device-specific)
  useEffect(() => {
    localStorage.setItem('magify_downloads', JSON.stringify(downloadedContent));
  }, [downloadedContent]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const usedStorage = downloadedContent.reduce((sum, c) => sum + c.size, 0);

  const downloadContent = async (id: string, type: 'course' | 'module' | 'audio', title: string) => {
    // Check if already downloaded
    if (downloadedContent.find(c => c.id === id)) {
      return;
    }

    // Check storage limits
    const estimatedSize = type === 'course' ? 50 * 1024 * 1024 : type === 'module' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    const newTotalStorage = usedStorage + estimatedSize;
    
    if (newTotalStorage > settings.maxStorage * 1024 * 1024) {
      alert('Storage limit reached. Please remove some downloads first.');
      return;
    }

    // Simulate download progress
    const newDownload: DownloadedContent = {
      id,
      type,
      title,
      size: estimatedSize,
      downloadedAt: new Date(),
      lastAccessed: new Date(),
      isFullyDownloaded: false,
      progress: 0
    };

    setDownloadedContent(prev => [...prev, newDownload]);

    // Simulate download with progress updates
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setDownloadedContent(prev => prev.map(c => 
          c.id === id ? { ...c, isFullyDownloaded: true, progress: 100 } : c
        ));
      } else {
        setDownloadedContent(prev => prev.map(c => 
          c.id === id ? { ...c, progress } : c
        ));
      }
    }, 500);
  };

  const removeContent = (id: string) => {
    setDownloadedContent(prev => prev.filter(c => c.id !== id));
  };

  const updateSettings = (newSettings: Partial<OfflineSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const clearAllDownloads = () => {
    if (confirm('Are you sure you want to remove all downloaded content?')) {
      setDownloadedContent([]);
    }
  };

  const getOfflineContent = (id: string): DownloadedContent | undefined => {
    return downloadedContent.find(c => c.id === id);
  };

  const isContentAvailableOffline = (id: string): boolean => {
    const content = downloadedContent.find(c => c.id === id);
    return content?.isFullyDownloaded || false;
  };

  return (
    <OfflineContext.Provider
      value={{
        downloadedContent,
        isOnline,
        settings,
        usedStorage,
        downloadContent,
        removeContent,
        updateSettings,
        clearAllDownloads,
        getOfflineContent,
        isContentAvailableOffline
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
