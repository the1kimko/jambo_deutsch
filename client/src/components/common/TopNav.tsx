import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useUser, UserButton } from '@clerk/clerk-react';
import { ROUTES } from '@/utils/constants';
import { Home, BookOpen, CreditCard, Mic, Users } from 'lucide-react';
import { Button } from '../ui/button';

const TopNav: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, token, logout } = useAuth();
  const { isSignedIn } = useUser(); // Clerk hook

  const navItems = [
    { to: ROUTES.DASHBOARD, Icon: Home, label: t('nav.home') },
    { to: ROUTES.LESSONS, Icon: BookOpen, label: t('nav.lessons') },
    { to: ROUTES.FLASHCARDS, Icon: CreditCard, label: t('nav.cards') },
    { to: ROUTES.PARTNERS, Icon: Users, label: t('nav.partners') },
    { to: ROUTES.PRONUNCIATION, Icon: Mic, label: t('nav.practice') },
  ];

  return (
    <header className="w-full bg-card border-b shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to={ROUTES.DASHBOARD} className="text-2xl font-bold text-primary">
          Jambo Deutsch
        </NavLink>

        {/* Desktop navigation */}
        <nav className="flex items-center gap-8">
          {isSignedIn && token &&
            navItems.map(({ to, Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{label}</span>
              </NavLink>
            ))}
        </nav>

        {/* Right side – language + user */}
        <div className="flex items-center gap-4">
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="border rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="en">EN</option>
            <option value="de">DE</option>
          </select>

          {isSignedIn && user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {t('welcome')}, {user.firstName}
              </span>
              <UserButton afterSignOutUrl={ROUTES.LOGIN} />
              <Button onClick={logout} variant="outline" size="sm">
                {t('logout')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
