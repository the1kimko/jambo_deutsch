import mongoose from 'mongoose';
import PartnerProfile from '../models/PartnerProfile.js';
import PartnerMessage from '../models/PartnerMessage.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getRequestUserEmail,
  getRequestUserId,
  getRequestUserNames,
} from '../utils/requestUser.js';
import { ensureUserRecord } from '../utils/userProfile.js';

const formatMessage = (message) => ({
  id: message._id,
  partnerId: message.partner?._id || message.partner,
  userId: message.user?._id || message.user,
  senderType: message.senderType,
  text: message.text,
  attachments: message.attachments || [],
  readAt: message.readAt,
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
  partner: message.partner?._id
    ? {
        id: message.partner._id,
        name: message.partner.name,
        level: message.partner.level,
        location: message.partner.location,
        goal: message.partner.goal,
        online: message.partner.online,
      }
    : undefined,
});

const resolveRequestUserProfile = async (req) => {
  const email = getRequestUserEmail(req);
  const externalId = getRequestUserId(req);
  if (!email && !externalId) {
    const error = new Error('User identity is required');
    error.statusCode = 401;
    throw error;
  }
  const { firstName, lastName } = getRequestUserNames(req);
  let user = await User.findOne(email ? { email } : { externalId });

  if (!user) {
    user = await ensureUserRecord({
      email,
      externalId: externalId || req.auth?.userId,
      defaults: {
        name:
          `${firstName || ''} ${lastName || ''}`.trim() ||
          email?.split('@')[0] ||
          req.auth?.username ||
          'Learner',
        firstName,
        lastName,
      },
    });
  }

  return user;
};

export const listPartners = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { location: new RegExp(search, 'i') },
      { goal: new RegExp(search, 'i') },
    ];
  }

  const partners = await PartnerProfile.find(query).sort({ updatedAt: -1 });
  const formatted = partners.map((partner) => ({
    id: partner._id,
    name: partner.name,
    location: partner.location,
    level: partner.level,
    goal: partner.goal,
    interests: partner.interests,
    online: partner.online,
  }));
  res.json(formatted);
});

export const getPartnerMessages = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(partnerId)) {
    return res.status(400).json({ error: 'Invalid partner id' });
  }

  const user = await resolveRequestUserProfile(req);
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);

  const messages = await PartnerMessage.find({
    partner: partnerId,
    user: user._id,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('partner');

  res.json(messages.map((message) => formatMessage(message)));
});

export const sendPartnerMessage = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(partnerId)) {
    return res.status(400).json({ error: 'Invalid partner id' });
  }

  const partner = await PartnerProfile.findById(partnerId);
  if (!partner) {
    return res.status(404).json({ error: 'Partner not found' });
  }

  const { text, attachments = [] } = req.body || {};
  if (!text?.trim() && attachments.length === 0) {
    return res.status(400).json({ error: 'Message text or attachment required' });
  }

  const user = await resolveRequestUserProfile(req);

  const sanitizedAttachments = attachments.map((file) => ({
    url: file.url,
    type: file.type,
    name: file.name,
  }));

  const message = await PartnerMessage.create({
    partner: partner._id,
    user: user._id,
    senderType: 'user',
    text: text?.trim(),
    attachments: sanitizedAttachments,
  });

  res.status(201).json(formatMessage(message));
});
