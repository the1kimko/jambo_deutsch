import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@/hooks/useAuth';
import TopNav from '@/components/common/TopNav';
import ThemeToggle from '@/components/common/ThemeToggle';
import BottomNav from '@/components/common/BottomNav';

export default function AppLayout() {
  const { isSignedIn } = useUser();
  const { token } = useAuth();
  const showNavigation = isSignedIn && Boolean(token);

  return (
    <div className="min-h-screen bg-background">
      {showNavigation && (
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
      )}

      {/* Desktop header – hidden on <lg */}
      {showNavigation && (
        <div className="hidden lg:block">
          <TopNav />
        </div>
      )}

      {/* Main content */}
      <main className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10 lg:pt-24">
        <Outlet />
      </main>

      {/* Mobile bottom nav – hidden on ≥lg */}
      {showNavigation && (
        <div className="lg:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}
