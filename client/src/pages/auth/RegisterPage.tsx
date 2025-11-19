import React, { useState } from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { ROUTES, GOALS } from '@/utils/constants';
import { storage } from '@/utils/storage';
import ThemeToggle from '@/components/common/ThemeToggle';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [goal, setGoal] = useState<typeof GOALS[number]>('General');
  const [location, setLocation] = useState('');
  const [saved, setSaved] = useState(false);

  const handlePreferencesSave = (event: React.FormEvent) => {
    event.preventDefault();
    storage.setProfileSetup({ goal, location: location.trim() || undefined });
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="flex flex-col justify-between bg-gradient-to-br from-teal-500 via-emerald-500 to-lime-400 px-10 py-14 text-white">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Plan your journey</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">
              Craft a learning goal and we’ll guide you every step.
            </h1>
            <p className="mt-4 max-w-md text-white/90">{t('startLearning')}</p>
          </div>
          <div className="mt-10 rounded-3xl bg-white/15 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-white/70">Why share preferences?</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>• Match with partners in similar timezones.</li>
              <li>• Receive lesson suggestions that fit your goals.</li>
              <li>• Unlock local pronunciation and culture tips.</li>
            </ul>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <p className="text-sm font-semibold text-primary">{t('joinUs')} 🚀</p>
              <h2 className="text-3xl font-bold text-foreground">Create your account</h2>
              <p className="text-muted-foreground">Save preferences then finish signup with Clerk.</p>
            </div>

            <form onSubmit={handlePreferencesSave} className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-card">
              <div>
                <label className="block text-sm font-semibold text-foreground">
                  Preferred learning goal
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {GOALS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={goal === option}
                      onClick={() => {
                        setGoal(option);
                        setSaved(false);
                      }}
                      className={`cursor-pointer rounded-2xl border px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                        goal === option ? 'border-primary bg-primary/10 text-primary shadow-glow' : 'border-border text-muted-foreground hover:border-primary/60'
                      }`}
                    >
                      {t(option.toLowerCase().replace(' ', '')) ?? option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground">
                  Where are you learning from?
                </label>
                <input
                  type="text"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => {
                    setSaved(false);
                    setLocation(e.target.value);
                  }}
                  className="mt-2 w-full rounded-2xl border border-border px-3 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  We use this to match you with nearby partners.
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-primary py-3 text-sm font-semibold text-white shadow-glow transition hover:translate-y-0.5"
              >
                {saved ? 'Preferences saved!' : 'Save preferences'}
              </button>
            </form>

            <SignUp
              afterSignUpUrl={ROUTES.DASHBOARD}
              signInUrl={ROUTES.LOGIN}
              appearance={{
                variables: {
                  colorPrimary: '#22c55e',
                  colorBackground: 'transparent',
                  borderRadius: '18px',
                  fontFamily: 'Inter, sans-serif',
                },
                elements: {
                  rootBox: 'rounded-3xl border border-border bg-card px-6 py-4 shadow-card',
                  card: 'bg-transparent',
                  headerTitle: 'text-2xl font-semibold text-foreground',
                  headerSubtitle: 'text-sm text-muted-foreground',
                  socialButtonsBlockButton:
                    'border border-border bg-background text-foreground rounded-2xl h-12',
                  formFieldInput:
                    'rounded-2xl border-border h-12 bg-background text-base focus:ring-2 focus:ring-primary',
                  formButtonPrimary:
                    'bg-gradient-to-r from-emerald-500 to-lime-400 text-white rounded-2xl h-12 font-semibold shadow-elegant',
                  footer: 'hidden',
                  dividerLine: 'bg-border',
                  dividerText: 'text-muted-foreground text-xs uppercase tracking-wide',
                },
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
