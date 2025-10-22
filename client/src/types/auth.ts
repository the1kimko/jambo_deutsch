// src/types/auth.ts
export interface AuthUser {
    id: string;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;

    // Optional dashboard-related fields
    progress?: Record<string, number>;
    streak?: number;
    updatedAtts?: string[];
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: AuthUser;
}

export interface AuthError {
    error: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    goal?: 'General' | 'Visa Prep' | 'Exam Prep' | 'Other';
}

export interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    // fetchUser: () => Promise<void>;
}