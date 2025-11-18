import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import api from '@/utils/api';
import { MODULES, ROUTES } from '@/utils/constants';
import { formatStreak, formatXP } from '@/utils/formatters';

// UI Components (Shadcn)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Flame,
  Trophy,
  TrendingUp,
  LogOut,
  BookOpen,
  Mic2,
  PenTool,
  Headphones,
  Sparkles,
} from 'lucide-react';

// Dashboard Sub-components
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatsGrid from '@/components/dashboard/StatsGrid';
import ProgressSection from '@/components/dashboard/ProgressSection';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import MotivationCard from '@/components/dashboard/MotivationCard';
import TopNav from '@/components/common/TopNav';

interface ProgressData {
  [module: string]: number; // e.g., { greetings: 75 }
}

interface Activity {
  id: string;
  type: 'lesson' | 'flashcard' | 'quiz' | 'practice';
  module: string;
  timestamp: string;
  xp?: number;
}

interface LeaderboardEntry {
  name: string;
  points: number;
  rank: number;
}

const Home: React.FC = () => {
  const { user: clerkUser, isSignedIn } = useUser();
  const { user: authUser, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [progress, setProgress] = useState<ProgressData>({});
  const [activities, setActivities] = useState<Activity[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authUser?.email || !isSignedIn) return;

      try {
        const [userRes, activityRes, leaderboardRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/activities?limit=5'),
          api.get('/leaderboard?limit=3'),
        ]);

        const userData = userRes.data;
        const moduleProgress: ProgressData = {};

        // Convert Map → plain object
        if (userData.progress?.modules) {
          Object.entries(userData.progress.modules).forEach(([k, v]) => {
            moduleProgress[k] = v as number;
          });
        }

        setProgress(moduleProgress);
        setStreak(userData.progress?.streak || 0);
        setTotalXP(userData.progress?.xp || 0);
        setActivities(activityRes.data || []);
        setLeaderboard(leaderboardRes.data || []);
      } catch (err: Error | unknown) {
        console.error('Dashboard load error:', err);
        setError(t('errorLoadingDashboard'));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authUser?.email, isSignedIn, t]);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  // Loading & Auth Guard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-xl">{t('loading')}...</div>
      </div>
    );
  }

  if (!authUser || !isSignedIn) {
    navigate(ROUTES.LOGIN);
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  const completedCount = Object.values(progress).filter((p) => p === 100).length;
  const totalModules = MODULES.length;

  // Skills derived from module progress
  const skills = [
    { name: t('listening'), icon: Headphones, progress: progress.greetings || 0, color: 'text-secondary' },
    { name: t('speaking'), icon: Mic2, progress: progress.numbers || 0, color: 'text-accent' },
    { name: t('reading'), icon: BookOpen, progress: progress.directions || 0, color: 'text-primary' },
    { name: t('writing'), icon: PenTool, progress: progress.shopping || 0, color: 'text-success' },
  ];

  // Insert current user into leaderboard
  const finalLeaderboard = leaderboard.map((entry) => ({
    ...entry,
    name: entry.name === 'you' ? t('you') : entry.name,
  }));

  return (
    <main className="min-h-screen bg-background pb-20" aria-label={t('dashboard')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t('jambo')}!
            </h1>
            <p className="text-sm text-muted-foreground">{authUser.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            aria-label={t('logout')}
            className="hover:bg-muted"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Welcome Banner */}
        <section aria-label={t('welcome')} className="mb-8">
          <WelcomeBanner user={authUser} />
        </section>

        {/* Stats Grid */}
        <section aria-label={t('yourProgress')} className="mb-8">
          <StatsGrid
            streak={streak}
            totalXP={totalXP}
            completedLessons={completedCount}
            totalLessons={totalModules}
          />
        </section>

        {/* Overall A1 Progress */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-foreground">
                {t('a1Progress')}
              </h2>
              <span className="text-sm font-medium text-primary">
                {Math.round((completedCount / totalModules) * 100)}%
              </span>
            </div>
            <Progress
              value={(completedCount / totalModules) * 100}
              className="h-3 mb-2"
            />
            <p className="text-xs text-muted-foreground">{t('keepGoing')}</p>
          </CardContent>
        </Card>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Module Progress */}
            <ProgressSection progress={progress} />

            {/* Skills */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {t('yourSkills')}
              </h2>
              {skills.map((skill) => (
                <Card key={skill.name} className="p-4 shadow-card">
                  <div className="flex items-center gap-3 mb-2">
                    <skill.icon className={`w-5 h-5 ${skill.color}`} />
                    <span className="font-medium text-foreground flex-1">
                      {skill.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {skill.progress}%
                    </span>
                  </div>
                  <Progress value={skill.progress} className="h-2" />
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <RecentActivity activities={activities} />
          </div>

          {/* Right Column */}
          <aside className="space-y-6">
            <MotivationCard streak={streak} />

            {/* Leaderboard */}
            <Card className="p-6 shadow-card">
              <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                <Trophy className="w-5 h-5 text-success" />
                {t('leaderboard')}
              </h2>
              <div className="space-y-3">
                {finalLeaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      entry.name === t('you')
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          entry.rank === 1
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {entry.rank}
                      </div>
                      <span
                        className={`font-medium ${
                          entry.name === t('you') ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {entry.name}
                      </span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {formatXP(entry.points)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        </div>

        {/* Quick Actions */}
        <section aria-label={t('quickActions')} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            {t('quickActions')}
          </h2>
          <QuickActions />
        </section>

        {/* CTA */}
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          onClick={() => navigate(ROUTES.LESSONS)}
        >
          {t('continueLearning')}
        </Button>
      </div>

      {/* Bottom Navigation */}
      <TopNav />
    </main>
  );
};

export default Home;
