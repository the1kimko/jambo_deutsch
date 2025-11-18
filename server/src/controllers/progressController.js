import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { XP_PER_PERCENT } from '../utils/constants.js';
import { getRequestUserEmail, getRequestUserId } from '../utils/requestUser.js';

const getUserOrThrow = async (req, res) => {
  const email = getRequestUserEmail(req);
  const externalId = getRequestUserId(req);

  if (!email && !externalId) {
    res.status(400).json({ error: 'Identity is required to sync progress' });
    return null;
  }

  const query = email ? { email } : { externalId };
  const user = await User.findOne(query);
  if (!user) {
    res.status(404).json({ error: 'User profile not found' });
    return null;
  }

  if (email && !user.email) {
    user.email = email;
  }

  return user;
};

export const updateModuleProgress = asyncHandler(async (req, res) => {
  const user = await getUserOrThrow(req, res);
  if (!user) return;

  const { moduleId, percentage } = req.validatedData;
  if (!user.progress) {
    user.progress = { modules: new Map(), streak: 0, xp: 0 };
  }

  if (!(user.progress.modules instanceof Map)) {
    user.progress.modules = new Map(Object.entries(user.progress.modules || {}));
  }

  const previous = user.progress.modules.get(moduleId) || 0;
  user.progress.modules.set(moduleId, percentage);

  const xpGain = Math.max(percentage - previous, 0) * XP_PER_PERCENT;
  user.progress.xp = (user.progress.xp || 0) + xpGain;
  user.progress.lastUpdated = new Date();

  await user.save();

  res.json({ progress: user.toPublicJSON().progress });
});

export const updateStreak = asyncHandler(async (req, res) => {
  const user = await getUserOrThrow(req, res);
  if (!user) return;

  const payload = req.validatedData || {};
  const nextStreak =
    typeof payload.streak === 'number'
      ? payload.streak
      : (user.progress?.streak || 0) + 1;

  if (!user.progress) {
    user.progress = { modules: new Map(), streak: 0, xp: 0 };
  }

  user.progress.streak = nextStreak;
  user.progress.lastUpdated = new Date();

  await user.save();

  res.json({ progress: user.toPublicJSON().progress });
});
