import Flashcard from '../models/Flashcard.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getFlashcardsByModule = asyncHandler(async (req, res) => {
  const { moduleId } = req.params;
  const flashcards = await Flashcard.find({ moduleId });
  const formatted = flashcards.map((card) => ({
    id: card._id,
    module: card.moduleId,
    front: card.front,
    back: card.back,
    audio: card.audio,
  }));
  res.json(formatted);
});
