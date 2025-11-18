import LessonModule from '../models/LessonModule.js';
import Flashcard from '../models/Flashcard.js';
import PartnerProfile from '../models/PartnerProfile.js';
import Activity from '../models/Activity.js';
import { lessonModules } from '../data/lessons.js';
import { flashcardSeed } from '../data/flashcards.js';
import { partnerSeed } from '../data/partners.js';
import { activitySeed } from '../data/activities.js';

export const seedDatabase = async () => {
  const lessonCount = await LessonModule.countDocuments();
  if (lessonCount === 0) {
    await LessonModule.insertMany(
      lessonModules.map((module, index) => ({
        ...module,
        order: module.order || index + 1,
      }))
    );
  }

  const flashcardCount = await Flashcard.countDocuments();
  if (flashcardCount === 0) {
    await Flashcard.insertMany(flashcardSeed);
  }

  const partnerCount = await PartnerProfile.countDocuments();
  if (partnerCount === 0) {
    await PartnerProfile.insertMany(partnerSeed);
  }

  const activityCount = await Activity.countDocuments();
  if (activityCount === 0) {
    await Activity.insertMany(activitySeed);
  }
};
