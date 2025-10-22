import React from 'react';
import { useTranslation } from 'react-i18next';

interface MotivationCardProps {
  streak: number;
}

const MotivationCard: React.FC<MotivationCardProps> = ({ streak }) => {
  const { t } = useTranslation();

  const getMotivationMessage = () => {
    if (streak === 0) return t('startYourStreak');
    if (streak < 7) return t('keepGoing');
    if (streak < 30) return t('greatProgress');
    if (streak < 100) return t('amazing');
    return t('legendary');
  };

  const getStreakEmoji = () => {
    if (streak === 0) return '🌱';
    if (streak < 7) return '🔥';
    if (streak < 30) return '🚀';
    if (streak < 100) return '⭐';
    return '👑';
  };

  return (
    <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-md p-6 text-white">
      <div className="text-center">
        <div className="text-6xl mb-4">{getStreakEmoji()}</div>
        <h3 className="text-2xl font-bold mb-2">{getMotivationMessage()}</h3>
        <p className="text-lg opacity-90">
          {streak > 0
            ? t('streakDaysMessage', { count: streak })
            : t('completeFirstLesson')}
        </p>
      </div>
    </div>
  );
};

export default MotivationCard;