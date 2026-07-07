"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from './UserContext';
import { useOffline } from './OfflineContext';

export interface SyncItem {
  id: string;
  type: 'progress' | 'quiz' | 'activity' | 'note';
  data: any;
  timestamp: Date;
  synced: boolean;
}

interface SyncContextType {
  syncQueue: SyncItem[];
  isSyncing: boolean;
  pendingSyncCount: number;
  addToSyncQueue: (item: Omit<SyncItem, 'timestamp' | 'synced'>) => void;
  syncNow: () => Promise<void>;
  clearSyncQueue: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export function SyncProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useUser();
  const { isOnline } = useOffline();
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load sync queue from localStorage
  useEffect(() => {
    const savedQueue = localStorage.getItem('origin_sync_queue');
    if (savedQueue) {
      try {
        const parsed = JSON.parse(savedQueue);
        setSyncQueue(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (e) {
        // Error loading sync queue
      }
    }
  }, []);

  // Save sync queue to localStorage
  useEffect(() => {
    localStorage.setItem('origin_sync_queue', JSON.stringify(syncQueue));
  }, [syncQueue]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && syncQueue.length > 0 && !isSyncing) {
      syncNow();
    }
  }, [isOnline]);

  const addToSyncQueue = (item: Omit<SyncItem, 'timestamp' | 'synced'>) => {
    const syncItem: SyncItem = {
      ...item,
      timestamp: new Date(),
      synced: false
    };
    setSyncQueue(prev => [...prev, syncItem]);
  };

  const syncNow = async () => {
    if (!currentUser || !isOnline || syncQueue.length === 0) {
      return;
    }

    setIsSyncing(true);

    const unsyncedItems = syncQueue.filter(item => !item.synced);
    const syncedItems: string[] = [];

    for (const item of unsyncedItems) {
      try {
        switch (item.type) {
          case 'progress':
            await supabase
              .from('user_progress')
              .upsert({
                user_id: currentUser.id,
                course_id: item.data.courseId,
                module_index: item.data.moduleIndex,
                completed: item.data.completed,
                last_accessed: new Date().toISOString()
              });
            break;

          case 'quiz':
            await supabase
              .from('quiz_results')
              .insert({
                user_id: currentUser.id,
                course_id: item.data.courseId,
                module_index: item.data.moduleIndex,
                score: item.data.score,
                answers: item.data.answers,
                completed_at: new Date().toISOString()
              });
            break;

          case 'activity':
            await supabase
              .from('activity_submissions')
              .insert({
                user_id: currentUser.id,
                course_id: item.data.courseId,
                module_index: item.data.moduleIndex,
                activity_type: item.data.activityType,
                response: item.data.response,
                completed_at: new Date().toISOString()
              });
            break;

          case 'note':
            await supabase
              .from('user_notes')
              .upsert({
                user_id: currentUser.id,
                course_id: item.data.courseId,
                module_index: item.data.moduleIndex,
                content: item.data.content,
                updated_at: new Date().toISOString()
              });
            break;
        }

        syncedItems.push(item.id);
      } catch (error) {
        // Log error but continue with other items
      }
    }

    // Mark synced items
    if (syncedItems.length > 0) {
      setSyncQueue(prev => prev.filter(item => !syncedItems.includes(item.id)));
    }

    setIsSyncing(false);
  };

  const clearSyncQueue = () => {
    if (confirm('Are you sure you want to clear all pending sync items? This will lose unsaved progress.')) {
      setSyncQueue([]);
    }
  };

  const pendingSyncCount = syncQueue.filter(item => !item.synced).length;

  return (
    <SyncContext.Provider
      value={{
        syncQueue,
        isSyncing,
        pendingSyncCount,
        addToSyncQueue,
        syncNow,
        clearSyncQueue
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
}
