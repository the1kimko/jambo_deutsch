import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatPercentage } from '@/utils/formatters';
import { MODULES } from '@/utils/constants';

interface ProgressSectionProps {
  progress: Record<string, number>;
}

const moduleIcons: Record<string, string> = {
  greetings: '👋',
  numbers: '🔢',
  directions: '🗺️',
  shopping: '🛒',
  family: '👪',
  food: '🍽️',
  time: '⏰',
  pronunciation: '🎙️',
};

const ProgressSection: React.FC<ProgressSectionProps> = ({ progress }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        📊 {t('yourProgress')}
      </h2>
      <div className="space-y-5">
        {MODULES.map((module) => {
          const percentage = progress[module] || 0;
          const icon = moduleIcons[module] || '📖';

          return (
            <div key={module}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{icon}</span>
                  <span className="font-semibold capitalize text-gray-800">
                    {t(module)}
                  </span>
                </div>
                <span className="text-gray-600 font-medium">
                  {formatPercentage(percentage)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSection;
