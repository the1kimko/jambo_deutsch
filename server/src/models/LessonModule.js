import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    type: { type: String, default: 'multiple-choice' },
    question: { type: String, required: true },
    audio: { type: Boolean, default: false },
    options: [{ type: String, required: true }],
    correct: { type: Number, required: true },
  },
  { _id: false }
);

const lessonModuleSchema = new mongoose.Schema(
  {
    moduleId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    locked: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    order: { type: Number, default: 1 },
    questions: [questionSchema],
  },
  { timestamps: true }
);

const LessonModule = mongoose.model('LessonModule', lessonModuleSchema);

export default LessonModule;
