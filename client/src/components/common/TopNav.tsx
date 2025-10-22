import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useUser, UserButton } from '@clerk/clerk-react';
import { ROUTES } from '@/utils/constants';
import { Home, BookOpen, CreditCard, Mic } from 'lucide-react';
import { Button } from '../ui/button';

const TopNav: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, token, logout } = useAuth();
  const { isSignedIn } = useUser(); // Clerk hook

  const navItems = [
    { to: ROUTES.DASHBOARD, icon: Home, text: t('dashboard') },
    { to: ROUTES.LESSONS, icon: BookOpen, text: t('lessons') },
    { to: ROUTES.FLASHCARDS, icon: CreditCard, text: t('flashcards') },
    { to: ROUTES.PRACTICE, icon: Mic, label: t('practice') },
  ];

  return (
    <header className="w-full bg-white shadow-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <NavLink to={ROUTES.DASHBOARD} className="text-2xl font-bold text-blue-600">
          Jambo Deutsch
        </NavLink>

        <nav className="flex items-center gap-6">
          {isSignedIn && token &&
            navItems.map(({ to, icon: Icon, text }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <Icon className="w-5 h-5" size={18} />
                <span className="text-sm">{t(text)}</span>
              </NavLink>
            ))}

          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">🇬🇧 EN</option>
            <option value="de">🇩🇪 DE</option>
          </select>

          {isSignedIn && user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {t('welcome')}, {user.firstName}
              </span>
              <UserButton afterSignOutUrl={ROUTES.LOGIN} /> {/* Clerk logout */}
              <Button onClick={logout} variant="outline" size="sm">
                {t('logout')}
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default TopNav;