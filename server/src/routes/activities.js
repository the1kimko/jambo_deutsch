import express from 'express';
import { protect } from '../middleware/auth.js';
import { listActivities, recordActivity } from '../controllers/activityController.js';

const router = express.Router();

router.get('/', protect, listActivities);
router.post('/', protect, recordActivity);

export default router;
