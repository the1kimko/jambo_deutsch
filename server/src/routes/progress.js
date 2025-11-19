import express from 'express';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  progressStreakSchema,
  progressUpdateSchema,
  progressXpSchema,
} from '../validation/schemas/progressSchemas.js';
import {
  updateModuleProgress,
  updateStreak,
  awardXp,
} from '../controllers/progressController.js';

const router = express.Router();

router.post(
  '/update',
  protect,
  validateRequest(progressUpdateSchema),
  updateModuleProgress
);

router.post(
  '/streak',
  protect,
  validateRequest(progressStreakSchema),
  updateStreak
);

router.post(
  '/xp',
  protect,
  validateRequest(progressXpSchema),
  awardXp
);

export default router;
