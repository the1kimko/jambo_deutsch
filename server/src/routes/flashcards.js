import express from 'express';
import { getFlashcardsByModule } from '../controllers/flashcardController.js';

const router = express.Router();

router.get('/:moduleId', getFlashcardsByModule);

export default router;
