import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';
import { MODULES } from '@/utils/constants';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatsGrid from '@/components/dashboard/StatsGrid';
import ProgressSection from '@/components/dashboard/ProgressSection';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import MotivationCard from '@/components/dashboard/MotivationCard';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { user: clerkUser } = useUser();
  const { user } = useAuth();
  const { streak, totalXP, progress } = useProgress();
  const { t } = useTranslation();

  if (!user) return null;

  const completedCount = Object.values(progress).filter((p) => p === 100).length;
  const totalModules = MODULES.length;

  return (
    <main className="min-h-screen bg-gray-50" aria-label={t('dashboard')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <WelcomeBanner user={user} />

        {/* Stats Overview */}
        <section aria-label={t('yourProgress')}>
          <StatsGrid
            streak={streak}
            totalXP={totalXP}
            completedLessons={completedCount}
            totalLessons={totalModules}
          />
        </section>

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" aria-label="Dashboard content">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ProgressSection progress={progress} />
            <RecentActivity />
          </div>

          {/* Right Column */}
          <aside className="space-y-6">
            <MotivationCard streak={streak} />
          </aside>
        </section>

        {/* Quick Actions */}
        <section aria-label="Quick actions">
          <h2 className="text-2xl font-bold mb-4">🚀 {t('quickActions')}</h2>
          <QuickActions />
        </section>
      </div>
    </main>
  );
};

export default Home;