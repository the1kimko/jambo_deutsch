import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import { uploadRecording } from '../controllers/practiceController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/recordings',
  protect,
  upload.single('audio'),
  uploadRecording
);

export default router;
