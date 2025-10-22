export interface Streak {
    count: number;
    lastActive: string; // ISO date string
}

export interface LeaderboardEntry {
    userId: string;
    email: string;
    score: number;
}