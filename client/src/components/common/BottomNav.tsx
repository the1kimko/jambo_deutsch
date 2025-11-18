import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, BookOpen, CreditCard, Users, Mic } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

const BottomNav: React.FC = () => {
  const { t, i18n } = useTranslation();

  const items = [
    { to: ROUTES.DASHBOARD, Icon: Home, label: t('nav.home') },
    { to: ROUTES.LESSONS, Icon: BookOpen, label: t('nav.lessons') },
    { to: ROUTES.FLASHCARDS, Icon: CreditCard, label: t('nav.cards') },
    { to: ROUTES.PARTNERS, Icon: Users, label: t('nav.partners') },
    { to: ROUTES.PRONUNCIATION, Icon: Mic, label: t('nav.practice') },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-2 px-4 py-2">
        <div className="flex flex-1 justify-around">
          {items.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-w-[60px] flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
        <select
          value={i18n.language}
          onChange={(event) => i18n.changeLanguage(event.target.value)}
          className="h-9 min-w-[72px] rounded-full border border-border bg-background px-3 text-xs font-semibold uppercase text-muted-foreground shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Change language"
        >
          <option value="en">EN</option>
          <option value="de">DE</option>
        </select>
      </div>
    </nav>
  );
};

export default BottomNav;
