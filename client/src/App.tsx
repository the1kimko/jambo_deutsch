import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { ProgressProvider } from '@/context/ProgressProvider';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import Home from '@/pages/dashboard/Home';
import Lessons from '@/pages/lessons/Lessons';
import LessonDetail from '@/pages/lessons/LessonDetails';
import Flashcards from '@/pages/flashcards/Flashcards';
import Partners from '@/pages/partners/Partners';
import PartnerChat from '@/pages/partners/PartnerChat';
import Pronunciation from '@/pages/pronunciation/Pronunciation';
import { ROUTES } from '@/utils/constants';

// Helper: protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

const App: React.FC = () => {
  return (
    <ProgressProvider>
      <Routes>
        {/* Public */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Protected – wrapped with AppLayout */}
        <Route element={<AppLayout />}>
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.LESSONS}
            element={
              <ProtectedRoute>
                <Lessons />
              </ProtectedRoute>
            }
          />
          <Route
            path={`${ROUTES.LESSONS}/:id`}
            element={
              <ProtectedRoute>
                <LessonDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FLASHCARDS}
            element={
              <ProtectedRoute>
                <Flashcards />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PARTNERS}
            element={
              <ProtectedRoute>
                <Partners />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PARTNER_CHAT}
            element={
              <ProtectedRoute>
                <PartnerChat />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PRONUNCIATION}
            element={
              <ProtectedRoute>
                <Pronunciation />
              </ProtectedRoute>
            }
          />
          {/* Add more protected pages here */}
        </Route>

        {/* Redirects */}
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </ProgressProvider>
  );
};

export default App;
