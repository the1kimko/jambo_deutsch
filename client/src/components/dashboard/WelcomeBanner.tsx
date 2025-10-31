import React from 'react';
import { useTranslation } from 'react-i18next';
// import type { DashboardUser } from '@/types/user';

interface WelcomeBannerProps {
  user: {
    name: string;
    firstName?: string;
    email: string;
    // add updatedAt only if "last seen" is displayed
    updatedAt?: string;
    goal?: 'General' | 'Visa Prep' | 'Exam Prep' | 'Other';
  };
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user }) => {
  const { t } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('goodMorning');
    if (hour < 18) return t('goodAfternoon');
    return t('goodEvening');
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-8 mb-6 text-white">
      <h1 className="text-4xl font-bold mb-2" aria-live="polite">
        {getGreeting()}, {user.firstName}! <span role="img" aria-label="wave">👋</span>
      </h1>
      <p className="text-lg opacity-90">
        {t('welcomeMessage')}
      </p>
      {user.goal && (
        <div className="mt-4 inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="font-semibold">🎯 {t('yourGoal')}: </span>
          {t(user.goal.toLowerCase().replace(' ', ''))}
        </div>
      )}
    </div>
  );
};

export default WelcomeBanner;