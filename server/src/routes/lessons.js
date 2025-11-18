import express from 'express';
import { getLessonDetail, getLessonModules } from '../controllers/lessonController.js';

const router = express.Router();

router.get('/', getLessonModules);
router.get('/:moduleId', getLessonDetail);

export default router;
