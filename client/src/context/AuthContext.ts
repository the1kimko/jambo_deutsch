import { createContext } from 'react';
import type { AuthContextType } from '@/types/auth';
// import { useAuth as useClerkAuth } from '@clerk/clerk-react';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Optional: Add default context value with Clerk integration
// export const AuthContextDefault = {
//   user: null,
//   token: useClerkAuth().getToken() || null,
//   loading: true,
//   login: async () => {},
//   register: async () => {},
//   logout: async () => {},
// };