export const GOALS = [
    'General',
    'Visa Prep',
    'Exam Prep'
] as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    LESSONS: '/lessons',
    FLASHCARDS: '/flashcards',
    PRACTICE: '/practice',
    PARTNERS: '/partners',
    PROFILE: '/profile',
    SETTINGS: '/settings'
} as const;

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: '/auth/me',
        LOGOUT: '/auth/logout',
    },
    LESSONS: '/lessons',
    FLASHCARDS: '/flashcards',
    PROGRESS: '/progress',
    PRONUNCIATION: '/pronunciation',
    USERS: '/users',
    PARTNERS: '/partners',
} as const;

export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    PROGRESS: 'progress',
    STREAK: 'streak'
} as const;

export const MODULES = [
    'greetings',
    'numbers',
    'directions',
    'shopping',
    'restaurant',
    'workplace',
] as const;