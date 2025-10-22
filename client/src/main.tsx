import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n.ts';
import { BrowserRouter } from 'react-router-dom';
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './context/AuthProvider.tsx';

const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!pk) {
  throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={pk}>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </ClerkProvider>
);
