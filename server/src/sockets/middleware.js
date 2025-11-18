import { verifyToken } from '@clerk/clerk-sdk-node';

export const verifyClerkSocket = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '');
    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    let payload;
    try {
      payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
    } catch (error) {
      if (error?.reason === 'token-expired') {
        return next(new Error('Session expired'));
      }
      throw error;
    }

    const claims = payload || {};
    socket.user = {
      id: claims.sub,
      email: claims.email,
      sessionId: claims.sid,
      firstName: claims.first_name || '',
      lastName: claims.last_name || '',
    };

    return next();
  } catch (error) {
    console.error('Socket auth failed:', error);
    return next(new Error('Not authorized'));
  }
};
