import React, { useState, useEffect, type ReactNode } from 'react';
// import type { ProgressContextType } from '@/types/progress';
import { storage } from '@/utils/storage';
import type { ProgressContextType } from '@/types/progress';
import { ProgressContext } from './ProgressContext';
import api from '@/utils/api';

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [streak, setStreak] = useState<number>(0);
  const [totalXP, setTotalXP] = useState<number>(0);

  useEffect(() => {
    // Load from localStorage
    const storedProgress = storage.getProgress();
    const storedStreak = storage.getStreak();

    const initialProgress = Object.keys(storedProgress).length > 0
      ? storedProgress
      : {
          greetings: 75,
          numbers: 50,
          directions: 25,
          shopping: 0,
          restaurant: 0,
          workplace: 0,
        };

    setProgress(initialProgress);
    setStreak(storedStreak || 5); // Mock 5-day streak
    setTotalXP(1250); // Mock XP
  }, []);

  const updateProgress = async (
    moduleId: string,
    percentage: number,
    // _completedLessons: number,
    // _totalLessons: number
  ): Promise<void> => {
    const newProgress = { ...progress, [moduleId]: percentage };
    setProgress(newProgress);
    storage.setProgress(newProgress);

    // Calculate XP gained (10 XP per percentage point)
    const xpGained = percentage * 10;
    setTotalXP((prev) => prev + xpGained);

    // Sync with backend
    try {
      await api.post('/progress/update', {
        moduleId,
        percentage,
        // completedLessons,
        // totalLessons
      });
    } catch (error) {
      console.error('Failed to sync progress:', error);
    }
  };

  const incrementStreak = async (): Promise<void> => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    storage.setStreak(newStreak);

    // Sync with backend
    try {
      await api.post('/progress/streak', { streak: newStreak });
    } catch (error) {
      console.error('Failed to sync streak:', error);
    }
  };

  const getModuleProgress = (moduleId: string): number => {
    return progress[moduleId] || 0;
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        streak,
        totalXP,
        updateProgress,
        incrementStreak,
        getModuleProgress
      } satisfies ProgressContextType}
    >
      {children}
    </ProgressContext.Provider>
  );
};