import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { ProgressProvider } from '@/context/ProgressProvider';
import TopNav from '@/components/common/TopNav';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import Home from '@/pages/dashboard/Home';
// import Lessons from '@/pages/lessons/Lessons';
// import LessonDetail from '@/pages/lessons/LessonDetail';
// import Flashcards from '@/pages/flashcards/Flashcards';
// import Partners from '@/pages/partners/Partners';
// import Pronunciation from '@/pages/pronunciation/Pronunciation';
// import WireframeViewer from '@/pages/wireframes/WireframeViewer';
import { ROUTES } from '@/utils/constants';

const App: React.FC = () => {
  return (
        <ProgressProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col items-center">
            <TopNav />
            <main className="w-full max-w-7xl flex-grow p-4">
              <Routes>
                {/* Public Routes */}
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                {/* Protected Routes */}
                <Route
                  path={ROUTES.DASHBOARD}
                  element={
                    <>
                      <SignedIn>
                        <Home />
                      </SignedIn>
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    </>
                  }
                />
                {/* <Route
                  path={ROUTES.LESSONS}
                  element={
                    <ProtectedRoute>
                      <Lessons />
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
                /> */}
                {/* Redirects */}
                {/* <Route path="/wireframes" element={<WireframeViewer />} /> */} {/* Dev page */}
                <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              </Routes>
            </main>

          </div>
        </ProgressProvider>
  );
};

export default App;