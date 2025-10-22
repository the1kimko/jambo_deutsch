export type UserGoal = 'General' | 'Visa Prep' | 'Exam Prep' | 'Other';

export interface DashboardUser {
    id: string;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    goal?: UserGoal;
    progress: Record<string, number>; // e.g., { "Module1": 50, "Module2": 100 }
    streak: number;
    partnerPrefs?: Record<string, string>; // e.g., { "language": "Spanish", "level": "Intermediate" }
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
    goal?: UserGoal;
}
