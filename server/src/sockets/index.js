import { verifyClerkSocket } from './middleware.js';
import registerPartnerSockets from './partnerSockets.js';

export const registerSocketHandlers = (io) => {
  io.use(verifyClerkSocket);

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected ${socket.id} (user: ${socket.user?.id || 'anonymous'})`);

    registerPartnerSockets(io, socket);

    socket.on('disconnect', (reason) => {
      console.log(`⚡️ Socket disconnected ${socket.id}: ${reason}`);
    });
  });
};

export default registerSocketHandlers;
