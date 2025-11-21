import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Auth
      login: 'Log In',
      register: 'Register',
      logout: 'Log Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',

      // Auth page specific
      welcome: 'Welcome',
      loginToContinue: 'Login to continue your learning journey',
      joinUs: 'Join Us',
      startLearning: 'Start your German learning adventure today',

      // Placeholders
      emailPlaceholder: 'your@email.com',
      passwordPlaceholder: '••••••••',
      confirmPasswordPlaceholder: '••••••••',
      namePlaceholder: 'John Doe',

      // Messages
      loggingIn: 'Logging in...',
      registering: 'Creating account...',
      loginError: 'Failed to log in',
      registerError: 'Failed to register',
      success: 'Success!',
      errorGeneric: 'Something went wrong',

      // Navigation
      nav: {
        home: 'Home',
        lessons: 'Lessons',
        cards: 'Flashcards',
        partners: 'Partners',
        practice: 'Practice',
      },
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      registerHere: 'Register here',
      loginHere: 'Login here',

      // Goals
      learningGoal: 'Learning Goal',
      general: 'General Learning',
      visaprep: 'Visa Preparation',
      examprep: 'Exam Preparation',

      // Dashboard
      dashboard: 'Dashboard',
      lessons: 'Lessons',
      flashcards: 'Flashcards',
      practice: 'Practice',
      partners: 'Partners',
      profile: 'Profile',
      greetings: 'Greetings',
      directions: 'Directions',
      shopping: 'Shopping',
      family: 'Family & Friends',
      food: 'Food & Drink',
      time: 'Days & Weather',
      pronunciation: 'Pronunciation',

      // Progress
      yourProgress: 'Your Progress',
      currentStreak: 'Current Streak',
      totalXP: 'Total XP',
      completedLessons: 'Completed Lessons',
      continueLesson: 'Continue Lesson',
      startNewLesson: 'Start New Lesson',
      yourSkills: 'Your Skills',
      speaking: 'Speaking',
      reading: 'Reading',
      writing: 'Writing',

      // Greetings
      goodMorning: 'Good Morning',
      goodAfternoon: 'Good Afternoon',
      goodEvening: 'Good Evening',
      welcomeMessage: 'Ready to continue your German learning journey?',
      yourGoal: 'Your Goal',

      // Quick Actions
      continueLessonDesc: 'Pick up where you left off',
      flashcardsDesc: 'Review vocabulary with flashcards',
      practiceDesc: 'Practice pronunciation with AI',
      partnersDesc: 'Connect with learning partners',
      listening: 'Listening',
      quickActions: 'Quick Actions',
      continueLearning: 'Continue Learning',
      start: 'Start',

      // Recent Activity
      recentActivity: 'Recent Activity',
      noRecentActivity: 'No recent activity. Start a lesson to get going!',
      lesson: 'Lesson',
      flashcard: 'Flashcard',
      quiz: 'Quiz',

      // Motivation
      startYourStreak: 'Start Your Streak Today!',
      keepGoing: 'Keep Going!',
      greatProgress: 'Great Progress!',
      amazing: 'You\'re Amazing!',
      legendary: 'Legendary Streak!',
      streakDaysMessage: 'You\'ve been learning for {{count}} days straight!',
      completeFirstLesson: 'Complete your first lesson to start your streak',

      // Misc
      language: 'Language',
      or: 'or',
      save: 'Save',
      cancel: 'Cancel',
      loading: 'Loading...',
      errorLoadingDashboard: 'Unable to load dashboard data right now.',
      leaderboard: 'Leaderboard',
      you: 'You',
      a1Progress: 'A1 Progress',
      jambo: 'Jambo!',
      numbers: 'Numbers',
      restaurant: 'Restaurant',
      workplace: 'Workplace',
    },
  },
  de: {
    translation: {
      // Auth
      login: 'Anmelden',
      register: 'Registrieren',
      logout: 'Abmelden',
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      fullName: 'Vollständiger Name',

      // Auth page specific
      welcome: 'Willkommen',
      loginToContinue: 'Melden Sie sich an, um Ihre Lernreise fortzusetzen',
      joinUs: 'Mach mit',
      startLearning: 'Beginnen Sie noch heute Ihr Deutsch-Lernabenteuer',

      // Placeholders
      emailPlaceholder: 'ihre@email.de',
      passwordPlaceholder: '••••••••',
      confirmPasswordPlaceholder: '••••••••',
      namePlaceholder: 'Max Mustermann',

      // Messages
      loggingIn: 'Anmeldung läuft...',
      registering: 'Konto wird erstellt...',
      loginError: 'Anmeldung fehlgeschlagen',
      registerError: 'Registrierung fehlgeschlagen',
      success: 'Erfolg!',
      errorGeneric: 'Etwas ist schiefgelaufen',

      // Navigation
      nav: {
        home: 'Startseite',
        lessons: 'Lektionen',
        cards: 'Karten',
        partners: 'Partner',
        practice: 'Üben',
      },
      noAccount: 'Noch kein Konto?',
      haveAccount: 'Haben Sie bereits ein Konto?',
      registerHere: 'Hier registrieren',
      loginHere: 'Hier anmelden',

      // Goals
      learningGoal: 'Lernziel',
      general: 'Allgemeines Lernen',
      visaprep: 'Visum-Vorbereitung',
      examprep: 'Prüfungsvorbereitung',

      // Dashboard
      dashboard: 'Dashboard',
      lessons: 'Lektionen',
      flashcards: 'Lernkarten',
      practice: 'Üben',
      partners: 'Partner',
      profile: 'Profil',
      greetings: 'Begrüßungen',
      directions: 'Wegbeschreibungen',
      shopping: 'Einkaufen',
      family: 'Familie & Freunde',
      food: 'Essen & Trinken',
      time: 'Tage & Wetter',
      pronunciation: 'Aussprache',

      // Progress
      yourProgress: 'Ihr Fortschritt',
      currentStreak: 'Aktuelle Serie',
      totalXP: 'Gesamt-XP',
      completedLessons: 'Abgeschlossene Lektionen',
      continueLesson: 'Lektion fortsetzen',
      startNewLesson: 'Neue Lektion starten',
      yourSkills: 'Ihre Fähigkeiten',
      speaking: 'Sprechen',
      reading: 'Lesen',
      writing: 'Schreiben',

      // Greetings
      goodMorning: 'Guten Morgen',
      goodAfternoon: 'Guten Tag',
      goodEvening: 'Guten Abend',
      welcomeMessage: 'Bereit, Ihre Deutsch-Lernreise fortzusetzen?',
      yourGoal: 'Ihr Ziel',

      // Quick Actions
      continueLessonDesc: 'Da weitermachen, wo Sie aufgehört haben',
      flashcardsDesc: 'Vokabeln mit Lernkarten wiederholen',
      practiceDesc: 'Aussprache mit KI üben',
      partnersDesc: 'Mit Lernpartnern verbinden',
      listening: 'Hören',
      quickActions: 'Schnelle Aktionen',
      continueLearning: 'Weiterlernen',
      start: 'Starten',

      // Recent Activity
      recentActivity: 'Letzte Aktivität',
      noRecentActivity: 'Keine aktuelle Aktivität. Beginnen Sie eine Lektion!',
      lesson: 'Lektion',
      flashcard: 'Lernkarte',
      quiz: 'Quiz',

      // Motivation
      startYourStreak: 'Starten Sie Ihre Serie heute!',
      keepGoing: 'Weiter so!',
      greatProgress: 'Großer Fortschritt!',
      amazing: 'Sie sind großartig!',
      legendary: 'Legendäre Serie!',
      streakDaysMessage: 'Sie lernen seit {{count}} Tagen ohne Unterbrechung!',
      completeFirstLesson: 'Schließen Sie Ihre erste Lektion ab, um Ihre Serie zu starten',

      // Misc
      language: 'Sprache',
      or: 'oder',
      save: 'Speichern',
      cancel: 'Abbrechen',
      loading: 'Laden...',
      errorLoadingDashboard: 'Das Dashboard konnte gerade nicht geladen werden.',
      leaderboard: 'Bestenliste',
      you: 'Du',
      a1Progress: 'A1-Fortschritt',
      jambo: 'Jambo!',
      numbers: 'Zahlen',
      restaurant: 'Restaurant',
      workplace: 'Arbeitsplatz',
    },
  },
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV, // Enable debug in development
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
