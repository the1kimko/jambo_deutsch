import PartnerMessage from '../models/PartnerMessage.js';
import { ensureUserRecord } from '../utils/userProfile.js';

const rooms = (partnerId, userId) => [`partner:${partnerId}`, `user:${userId}`];

const registerPartnerSockets = (io, socket) => {
  const joinedPartners = new Set();

  const getOrCreateUser = async () => {
    if (socket.mongoUser) return socket.mongoUser;
    const { email, id: externalId, firstName, lastName } = socket.user || {};
    const user = await ensureUserRecord({
      email,
      externalId,
      defaults: {
        name: `${firstName || ''} ${lastName || ''}`.trim() || email?.split('@')[0] || 'Learner',
        firstName,
        lastName,
      },
    });
    socket.mongoUser = user;
    return user;
  };

  socket.on('partner:join', async ({ partnerId }) => {
    if (!partnerId) return;
    const user = await getOrCreateUser();
    const joinRooms = rooms(partnerId, user._id);
    joinRooms.forEach((room) => socket.join(room));
    joinedPartners.add(partnerId);
    socket.to(`partner:${partnerId}`).emit('partner:presence', {
      partnerId,
      userId: user._id,
      online: true,
      location: user.location,
    });
  });

  socket.on('partner:typing', async ({ partnerId, typing }) => {
    if (!partnerId) return;
    const user = await getOrCreateUser();
    socket.to(`partner:${partnerId}`).emit('partner:typing', {
      partnerId,
      typing: Boolean(typing),
      userId: user._id,
    });
  });

  socket.on('partner:read', async ({ partnerId, messageIds = [] }) => {
    if (!partnerId || !messageIds.length) return;
    const user = await getOrCreateUser();
    const now = new Date();
    await PartnerMessage.updateMany(
      { _id: { $in: messageIds }, partner: partnerId, user: user._id, senderType: { $ne: 'user' } },
      { $set: { readAt: now } }
    );

    socket.to(`partner:${partnerId}`).emit('partner:read', {
      partnerId,
      userId: user._id,
      messageIds,
      readAt: now,
    });
  });

  socket.on('partner:message', async ({ partnerId, text, attachments }) => {
    if (!partnerId || (!text && !(attachments?.length))) return;
    const user = await getOrCreateUser();
    const sanitizedAttachments = (attachments || []).map((file) => ({
      url: file?.url,
      type: file?.type,
      name: file?.name,
    }));

    const message = await PartnerMessage.create({
      partner: partnerId,
      user: user._id,
      senderType: 'user',
      text: text?.trim(),
      attachments: sanitizedAttachments,
    });
    const serialized = message.toObject({ getters: true, virtuals: true });

    const targetRooms = rooms(partnerId, user._id);
    targetRooms.forEach((room) => {
      io.to(room).emit('partner:message', serialized);
    });
  });

  socket.on('disconnect', async () => {
    if (!joinedPartners.size) return;
    const user = socket.mongoUser || (socket.user && (await getOrCreateUser()));
    if (!user) return;
    joinedPartners.forEach((partnerId) => {
      io.to(`partner:${partnerId}`).emit('partner:presence', {
        partnerId,
        userId: user._id,
        online: false,
        location: user.location,
      });
    });
    joinedPartners.clear();
  });
};

export default registerPartnerSockets;
