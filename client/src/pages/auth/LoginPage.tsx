import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SignIn } from '@clerk/clerk-react';
import { ROUTES } from '@/utils/constants';
import ThemeToggle from '@/components/common/ThemeToggle';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 px-12 py-16 text-white lg:flex lg:flex-col">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Jambo Deutsch</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              {t('welcomeMessage')}
            </h1>
            <p className="mt-4 max-w-md text-white/90">{t('loginToContinue')}</p>
          </div>
          <div className="mt-auto space-y-8">
            <div className="rounded-3xl bg-white/15 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-wide text-white/70">Today’s Tip</p>
              <p className="mt-2 text-lg font-semibold">
                “Consistency beats intensity. Aim for 15 minutes daily.”
              </p>
            </div>
            <div className="flex gap-4">
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <p className="text-xs text-white/70">{t('currentStreak')}</p>
                <p className="text-3xl font-bold">7</p>
              </div>
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <p className="text-xs text-white/70">{t('totalXP')}</p>
                <p className="text-3xl font-bold">850</p>
              </div>
            </div>
          </div>
        </section>
        <section className="flex items-center justify-center bg-background px-6 py-12">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center">
              <p className="text-sm font-semibold text-primary">{t('welcome')} 👋</p>
              <h2 className="text-3xl font-bold text-foreground">Sign in to continue</h2>
              <p className="text-muted-foreground">
                Access your lessons, streaks, flashcards, and partner chats.
              </p>
            </div>

            <SignIn
              afterSignInUrl={from}
              signUpUrl={ROUTES.REGISTER}
              redirectUrl={from}
              appearance={{
                variables: {
                  colorPrimary: '#f59e0b',
                  colorBackground: 'transparent',
                  colorText: '#1f1b16',
                  borderRadius: '18px',
                  fontFamily: 'Inter, sans-serif',
                },
                elements: {
                  rootBox: 'shadow-card rounded-3xl border border-border bg-card px-6 py-4',
                  card: 'bg-transparent',
                  headerTitle: 'text-2xl font-semibold text-foreground',
                  headerSubtitle: 'text-sm text-muted-foreground',
                  socialButtonsBlockButton:
                    'border border-border bg-background text-foreground rounded-2xl h-12',
                  formFieldInput:
                    'rounded-2xl border-border h-12 bg-background text-base focus:ring-2 focus:ring-primary',
                  formButtonPrimary:
                    'bg-gradient-primary text-white rounded-2xl h-12 font-semibold shadow-elegant',
                  footer: 'hidden',
                  dividerLine: 'bg-border',
                  dividerText: 'text-muted-foreground text-xs uppercase tracking-wide',
                },
              }}
            />

            <p className="text-center text-sm text-muted-foreground">
              {t('noAccount')} <a href={ROUTES.REGISTER} className="font-semibold text-primary">Sign up</a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
