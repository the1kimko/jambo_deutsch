import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n.ts';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './context/AuthProvider.tsx';
import { SonnerToaster } from './components/ui/sonner-toaster.tsx';
import { ThemeProvider } from 'next-themes';


const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!pk) {
  throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={pk}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="jambo-theme"
      disableTransitionOnChange
    >
      <AuthProvider>
        <BrowserRouter>
          <App />
          <SonnerToaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </ClerkProvider>
);
