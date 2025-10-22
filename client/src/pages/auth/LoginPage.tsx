import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SignIn } from '@clerk/clerk-react';
import { ROUTES } from '@/utils/constants';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  // const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {t('welcome')} 👋
          </h1>
          <p className="text-gray-600">{t('loginToContinue')}</p>
        </div>

        <SignIn
          afterSignInUrl={from}
          signUpUrl={ROUTES.REGISTER}
          redirectUrl={from}
          appearance={{
            elements: {
              card: 'bg-white rounded-lg shadow-2xl p-6',
              headerTitle: 'text-3xl font-bold text-gray-800',
              headerSubtitle: 'text-gray-600',
              formFieldInput: 'border-gray-300 rounded-lg p-2 w-full',
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white w-full mt-4',
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

export default LoginPage;