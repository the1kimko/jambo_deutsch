import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema(
  {
    moduleId: { type: String, required: true, index: true },
    front: { type: String, required: true },
    back: { type: String, required: true },
    category: { type: String, default: 'General' },
    audio: { type: String },
  },
  { timestamps: true }
);

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

export default Flashcard;
