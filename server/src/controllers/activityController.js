import Activity from '../models/Activity.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getRequestUserEmail, getRequestUserId } from '../utils/requestUser.js';
import { activitySeed } from '../data/activities.js';

const formatActivity = (activity) => ({
  id: activity._id,
  type: activity.type,
  module: activity.module,
  xp: activity.xp,
  timestamp: activity.createdAt,
});

export const listActivities = asyncHandler(async (req, res) => {
  const email = getRequestUserEmail(req);
  const externalId = getRequestUserId(req);
  const limit = Number(req.query.limit) || 5;

  if (!email && !externalId) {
    return res.json(activitySeed.slice(0, limit));
  }

  const query = email ? { userEmail: email } : { userId: externalId };

  let activities = await Activity.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);

  if (activities.length === 0 && activitySeed.length > 0) {
    const seeded = activitySeed.map((item) => ({
      ...item,
      userEmail: email,
      userId: externalId,
    }));
    await Activity.insertMany(seeded);
    activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  res.json(activities.map(formatActivity));
});

export const recordActivity = asyncHandler(async (req, res) => {
  const email = getRequestUserEmail(req);
  const externalId = getRequestUserId(req);
  if (!email && !externalId) {
    return res.status(400).json({ error: 'Identity is required to record activity' });
  }

  const { type, module, xp = 0 } = req.body;
  if (!type || !module) {
    return res.status(400).json({ error: 'Type and module are required' });
  }

  const activity = await Activity.create({
    userEmail: email,
    userId: externalId,
    type,
    module,
    xp,
  });

  res.status(201).json(formatActivity(activity));
});
