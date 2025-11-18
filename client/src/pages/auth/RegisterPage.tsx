import React, { useState } from 'react';
import { SignUp } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { ROUTES, GOALS } from '@/utils/constants';
import { storage } from '@/utils/storage';

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
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('joinUs')} 🚀
          </h1>
          <p className="text-gray-600">{t('startLearning')}</p>
        </div>
        <form onSubmit={handlePreferencesSave} className="space-y-4 mb-6">
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Preferred learning goal
            </label>
            <select
              value={goal}
              onChange={(e) => {
                setSaved(false);
                setGoal(e.target.value as typeof GOALS[number]);
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {GOALS.map((option) => (
                <option key={option} value={option}>
                  {t(option.toLowerCase().replace(' ', '')) ?? option}
                </option>
              ))}
            </select>
          </div>
          <div className="text-left">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              We use this to match you with nearby study partners.
            </p>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 py-2 text-sm font-semibold text-white shadow hover:shadow-md transition"
          >
            {saved ? 'Preferences saved!' : 'Save preferences before signing up'}
          </button>
        </form>
        <SignUp
          afterSignUpUrl={ROUTES.DASHBOARD}
          signInUrl={ROUTES.LOGIN}
          appearance={{
            elements: {
              card: 'bg-white rounded-lg shadow-2xl p-6',
              headerTitle: 'text-3xl font-bold text-gray-800',
              headerSubtitle: 'text-gray-600',
              formFieldInput: 'border-gray-300 rounded-lg p-2 w-full',
              formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-white w-full mt-4',
              socialButtonsBlockButton: 'bg-blue-600 hover:bg-blue-700 text-white w-full mb-4',
              dividerLine: 'border-t border-gray-300 my-4',
              dividerText: 'text-gray-500',
            },
          }}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
