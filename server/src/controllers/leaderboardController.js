import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getLeaderboard = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 10, 100);
  const users = await User.find().sort({ 'progress.xp': -1 }).limit(limit);

  const leaderboard = users.map((user, index) => ({
    id: user._id,
    name: user.fullName || user.email,
    points: user.progress?.xp || 0,
    rank: index + 1,
  }));

  res.json(leaderboard);
});
