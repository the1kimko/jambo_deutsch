import User from '../models/User.js';
import { MODULES } from './constants.js';

export const defaultModuleProgress = () => {
  const entries = MODULES.map((module) => [module, 0]);
  return new Map(entries);
};

export const ensureUserRecord = async ({ email, externalId, defaults = {} }) => {
  if (!email && !externalId) return null;

  const query = email ? { email } : { externalId };
  const update = {
    $setOnInsert: {
      ...defaults,
      progress: {
        modules: defaultModuleProgress(),
        streak: 0,
        xp: 0,
      },
    },
    $set: {},
  };

  if (email) {
    update.$set.email = email;
  }
  if (externalId) {
    update.$set.externalId = externalId;
  }
  if (Object.keys(update.$set).length === 0) {
    delete update.$set;
  }

  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  const user = await User.findOneAndUpdate(query, update, options);
  return user;
};
