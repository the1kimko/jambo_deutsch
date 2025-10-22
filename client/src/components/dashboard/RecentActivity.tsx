import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/formatters';

interface Activity {
  id: string;
  type: 'lesson' | 'flashcard' | 'quiz' | 'practice';
  module: string;
  timestamp: string;
  xp?: number;
}

interface RecentActivityProps {
  activities?: Activity[];
}

const activityIcons = {
  lesson: '📖',
  flashcard: '🎴',
  quiz: '📝',
  practice: '🎤',
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities = [] }) => {
  const { t } = useTranslation();

  // Mock data if no activities provided
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'lesson',
      module: 'greetings',
      timestamp: new Date().toISOString(),
      xp: 50,
    },
    {
      id: '2',
      type: 'flashcard',
      module: 'numbers',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      xp: 25,
    },
    {
      id: '3',
      type: 'quiz',
      module: 'greetings',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      xp: 100,
    },
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  if (displayActivities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">🕒 {t('recentActivity')}</h2>
        <p className="text-gray-600 text-center py-8">
          {t('noRecentActivity')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">🕒 {t('recentActivity')}</h2>
      <div className="space-y-4">
        {displayActivities.map((activity) => (
          <div
            key={activity.id}
            aria-label={`${activity.type} in ${activity.module}`}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">
                {activityIcons[activity.type]}
              </div>
              <div>
                <p className="font-semibold text-gray-800 capitalize">
                  {t(activity.type)} - {t(activity.module)}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(activity.timestamp)}
                </p>
              </div>
            </div>
            {activity.xp && (
              <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-semibold">
                +{activity.xp} XP
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;