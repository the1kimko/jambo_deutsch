import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatStreak, formatXP } from '@/utils/formatters';
import StatsCard from './StatsCard';

interface StatsGridProps {
  streak: number;
  totalXP: number;
  completedLessons: number;
  totalLessons: number;
}

const StatsGrid: React.FC<StatsGridProps> = ({
  streak,
  totalXP,
  completedLessons,
  totalLessons,
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        icon="🔥"
        label={t('currentStreak')}
        value={formatStreak(streak)}
        accent="primary"
      />
      <StatsCard
        icon="⭐"
        label={t('totalXP')}
        value={formatXP(totalXP)}
        accent="secondary"
      />
      <StatsCard
        icon="📚"
        label={t('completedLessons')}
        value={`${completedLessons}/${totalLessons}`}
        accent="success"
      />
    </div>
  );
};

export default StatsGrid;
