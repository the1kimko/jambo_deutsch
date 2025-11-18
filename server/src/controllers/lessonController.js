import LessonModule from '../models/LessonModule.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const summarizeModule = (module) => ({
  id: module.order,
  moduleId: module.moduleId,
  title: module.title,
  description: module.description,
  completed: module.completed,
  locked: module.locked,
  progress: module.progress,
});

export const getLessonModules = asyncHandler(async (req, res) => {
  const modules = await LessonModule.find().sort({ order: 1 });
  res.json(modules.map(summarizeModule));
});

export const getLessonDetail = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const numericId = Number(moduleId);

  const lessonModule = await LessonModule.findOne(
    Number.isNaN(numericId)
      ? { moduleId }
      : { $or: [{ moduleId }, { order: numericId }] }
  );

  if (!lessonModule) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  res.json({
    title: lessonModule.title,
    questions: lessonModule.questions,
    moduleId: lessonModule.moduleId,
  });
});
