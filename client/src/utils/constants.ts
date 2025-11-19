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
    PARTNER_CHAT: '/partners/:partnerId/chat',
    PRONUNCIATION: '/pronunciation',
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
    STREAK: 'streak',
    PROFILE_SETUP: 'profile_setup',
} as const;

export const MODULES = [
    'greetings',
    'numbers',
    'directions',
    'shopping',
    'family',
    'food',
    'time',
    'pronunciation',
] as const;

export const buildPartnerChatRoute = (partnerId: string) => `/partners/${partnerId}/chat`;
