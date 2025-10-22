import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/utils/constants';

const QuickActions: React.FC = () => {
  const { t } = useTranslation();

  const actions = [
    {
      icon: '📖',
      title: t('continueLesson'),
      description: t('continueLessonDesc'),
      route: ROUTES.LESSONS,
      color: 'blue',
    },
    {
      icon: '🎴',
      title: t('flashcards'),
      description: t('flashcardsDesc'),
      route: ROUTES.FLASHCARDS,
      color: 'green',
    },
    {
      icon: '🎤',
      title: t('practice'),
      description: t('practiceDesc'),
      route: ROUTES.PRACTICE,
      color: 'purple',
    },
    {
      icon: '👥',
      title: t('partners'),
      description: t('partnersDesc'),
      route: ROUTES.PARTNERS,
      color: 'orange',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {actions.map((action) => (
        <Link key={action.title} to={action.route} aria-label={action.title}>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer h-full">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{action.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 mb-4">{action.description}</p>
                <Button
                  className={`w-full ${colorClasses[action.color as keyof typeof colorClasses]}`}
                >
                  {t('start')} →
                </Button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;