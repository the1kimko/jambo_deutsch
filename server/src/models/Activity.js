import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: { type: String, index: true },
    userEmail: { type: String, index: true },
    type: {
      type: String,
      enum: ['lesson', 'flashcard', 'quiz', 'practice'],
      required: true,
    },
    module: { type: String, required: true },
    xp: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
