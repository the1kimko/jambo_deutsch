// middleware/auth.js
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const protect = ClerkExpressRequireAuth({
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  onError: (error, req, res, next) => {
    console.error('Clerk auth error:', error);
    res.status(401).json({ error: 'Not authorized' });
    next(error); // Pass error to next middleware
  },
});