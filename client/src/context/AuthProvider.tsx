// context/AuthProvider.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { AuthContext } from './AuthContext';
import type { AuthUser } from '@/types/auth';
import { storage } from '@/utils/storage';
import api, { setApiTokenProvider } from '@/utils/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser } = useUser();
  const { getToken, signOut } = useClerkAuth();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessionToken = useCallback(async () => {
    const template = import.meta.env.VITE_CLERK_TOKEN_TEMPLATE;
    const requestToken = (options?: Parameters<typeof getToken>[0]) =>
      getToken(options).catch((error) => {
        console.error('Clerk token error:', error);
        throw error;
      });

    if (!template) {
      return requestToken();
    }

    try {
      return await requestToken({ template });
    } catch (error) {
      console.warn(`Falling back to default Clerk session token (template "${template}" was not found).`);
      return requestToken();
    }
  }, [getToken]);

  useEffect(() => {
    setApiTokenProvider(fetchSessionToken);
  }, [fetchSessionToken]);

  useEffect(() => {
    // Sync Clerk user with your app’s user
    const syncUser = async () => {
      if (clerkUser) {
        const clerkToken = await fetchSessionToken();
        if (!clerkToken) {
          throw new Error('Unable to retrieve Clerk session token.');
        }

        setToken(clerkToken);
        storage.setToken(clerkToken);

        const pendingProfile = storage.getProfileSetup();

        // Fetch or sync user data from your backend
        try {
          const response = await api.get('/auth/me');
          const backendUser = response.data;
          const normalizedUser: AuthUser = {
            id: clerkUser.id,
            name: clerkUser.fullName || '',
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            firstName: clerkUser.firstName || '',
            lastName: clerkUser.lastName || '',
            createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : '',
          };
          setAuthUser(normalizedUser);
          storage.setUser(backendUser);

          if (pendingProfile && (pendingProfile.goal || pendingProfile.location)) {
            try {
              await api.post('/auth/register', {
                name: normalizedUser.name,
                goal: pendingProfile.goal,
                location: pendingProfile.location,
              });
              storage.clearProfileSetup();
            } catch (syncError) {
              console.error('Profile preference sync error:', syncError);
            }
          }
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
  }, [clerkUser, fetchSessionToken]);

  const login = async () => {
    // Clerk handles login via <SignIn /> component
    // This is for custom logic if needed (e.g., sync with backend)
    const clerkToken = await fetchSessionToken();
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
    location?: string;
  }) => {
    // Clerk handles registration via <SignUp />
    // Sync custom fields (e.g., goal) to backend
    const clerkToken = await fetchSessionToken();
    if (clerkToken && credentials.name) {
      try {
        await api.post('/auth/register', {
          name: credentials.name,
          email: credentials.email,
          goal: credentials.goal,
          location: credentials.location,
        });
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
