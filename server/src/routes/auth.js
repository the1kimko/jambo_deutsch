import express from 'express';
import { protect } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerSchema } from '../validation/schemas/authSchemas.js';
import {
  getCurrentUser,
  handleClerkWebhook,
  registerUser,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/webhooks/user-created', handleClerkWebhook);
router.post('/register', protect, validateRequest(registerSchema), registerUser);
router.get('/me', protect, getCurrentUser);

export default router;
