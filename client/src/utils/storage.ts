import { STORAGE_KEYS } from './constants';

export const storage = {
  // Token
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },
  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  },
  removeToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  // User
  getUser: <T>(): T | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  setUser: <T>(user: T): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Progress
  getProgress: (): Record<string, number> => {
    const progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return progress ? JSON.parse(progress) : {};
  },
  setProgress: (progress: Record<string, number>): void => {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  },

  // Streak
  getStreak: (): number => {
    const streak = localStorage.getItem(STORAGE_KEYS.STREAK);
    return streak ? parseInt(streak, 10) : 0;
  },
  setStreak: (streak: number): void => {
    localStorage.setItem(STORAGE_KEYS.STREAK, streak.toString());
  },

  // Clear all
  clearAll: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.STREAK);
  },
};