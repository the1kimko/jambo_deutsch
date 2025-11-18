import express from 'express';
import { listPartners, getPartnerMessages, sendPartnerMessage } from '../controllers/partnerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', listPartners);
router.get('/:partnerId/messages', protect, getPartnerMessages);
router.post('/:partnerId/messages', protect, sendPartnerMessage);

export default router;
