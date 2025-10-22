export interface Progress {
    moduleId: string;
    percentage: number;
    completedLessons: number;
    totalLessons: number;
    lastAccessed: string;
}

export interface ProgressContextType {
    progress: Record<string, number>; // moduleId to percentage
    streak: number;
    totalXP: number;
    updateProgress: (moduleId: string, percentage: number, completedLessons: number, totalLessons: number) => Promise<void>;
    incrementStreak: () => Promise<void>;
    getModuleProgress: (moduleId: string) => number;
}