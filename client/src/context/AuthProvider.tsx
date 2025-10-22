// context/AuthProvider.tsx
import React, { useState, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { AuthContext } from './AuthContext';
import type { AuthUser } from '@/types/auth';
import { storage } from '@/utils/storage';
import api from '@/utils/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser } = useUser();
  const { getToken, signOut } = useClerkAuth();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sync Clerk user with your app’s user
    const syncUser = async () => {
      if (clerkUser) {
        const clerkToken = await getToken();
        setToken(clerkToken);

        // Fetch or sync user data from your backend
        try {
          const response = await api.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${clerkToken}` },
          });
          const backendUser = response.data;
          setAuthUser({
            id: clerkUser.id,
            name: clerkUser.fullName || '',
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
            createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : '',
          });
          storage.setUser(backendUser);
          storage.setToken(clerkToken);
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      } else {
        setAuthUser(null);
        setToken(null);
        storage.clearAll();
      }
      setLoading(false);
    };

    syncUser();
  }, [clerkUser, getToken]);

  const login = async () => {
    // Clerk handles login via <SignIn /> component
    // This is for custom logic if needed (e.g., sync with backend)
    const clerkToken = await getToken();
    if (clerkToken) {
      setToken(clerkToken);
      storage.setToken(clerkToken);
      // Sync user data as above
    }
  };

  const register = async (credentials: {
    name: string;
    email: string;
    password: string;
    goal?: string;
  }) => {
    // Clerk handles registration via <SignUp />
    // Sync custom fields (e.g., goal) to backend
    const clerkToken = await getToken();
    if (clerkToken && credentials.name) {
      try {
        await api.post(
          '/api/auth/register',
          { name: credentials.name, email: credentials.email, goal: credentials.goal },
          { headers: { Authorization: `Bearer ${clerkToken}` } }
        );
        setToken(clerkToken);
        storage.setToken(clerkToken);
      } catch (error) {
        console.error('Registration sync error:', error);
        throw new Error('Failed to sync user data');
      }
    }
  };

  const logout = async () => {
    await signOut();
    setAuthUser(null);
    setToken(null);
    storage.clearAll();
  };

  return (
    <AuthContext.Provider value={{ user: authUser, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};