import { clerkClient } from '@clerk/clerk-sdk-node';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getRequestUserEmail,
  getRequestUserNames,
  getRequestUserId,
} from '../utils/requestUser.js';
import { ensureUserRecord, defaultModuleProgress } from '../utils/userProfile.js';

const fetchClerkIdentity = async (userId) => {
  if (!userId) return null;
  try {
    return await clerkClient.users.getUser(userId);
  } catch (error) {
    console.error(`Failed to fetch Clerk user ${userId}:`, error);
    return null;
  }
};

const resolveIdentity = async (req) => {
  let email = getRequestUserEmail(req);
  const externalId = getRequestUserId(req);
  let { firstName, lastName } = getRequestUserNames(req);

  if (externalId && (!email || !firstName || !lastName)) {
    const clerkIdentity = await fetchClerkIdentity(externalId);
    if (clerkIdentity) {
      const primaryEmail =
        clerkIdentity.primaryEmailAddress?.emailAddress ||
        clerkIdentity.emailAddresses?.[0]?.emailAddress;
      email = email || primaryEmail || null;
      firstName = firstName || clerkIdentity.firstName || '';
      lastName = lastName || clerkIdentity.lastName || '';
    }
  }

  if (!email && externalId) {
    email = `${externalId}@placeholder.local`;
  }

  return { email, externalId, firstName, lastName };
};

export const handleClerkWebhook = asyncHandler(async (req, res) => {
  const { data } = req.body || {};
  if (!data) {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  const email = data.email_addresses?.[0]?.email_address;
  const firstName = data.first_name || '';
  const lastName = data.last_name || '';

  if (!email) {
    return res.status(400).json({ error: 'Email missing in webhook payload' });
  }

  await ensureUserRecord({
    email,
    externalId: data.id,
    defaults: {
      name: `${firstName} ${lastName}`.trim() || email.split('@')[0],
      firstName,
      lastName,
      goal: 'General',
    },
  });

  res.status(200).json({ success: true });
});

export const registerUser = asyncHandler(async (req, res) => {
  const { email, externalId, firstName: resolvedFirst, lastName: resolvedLast } = await resolveIdentity(req);
  if (!email && !externalId) {
    return res.status(400).json({ error: 'Identity is required to sync user profile' });
  }

  const {
    name,
    firstName = resolvedFirst,
    lastName = resolvedLast,
    goal = 'General',
    partnerPreferences,
    role,
    location,
  } = req.validatedData || {};

  const identifier = email ? { email } : { externalId };
  const displayName =
    name || `${firstName || ''} ${lastName || ''}`.trim() || email?.split('@')[0] || 'Learner';

  const profileUpdate = {
    name: displayName,
    firstName: firstName || '',
    lastName: lastName || '',
    goal,
    partnerPreferences,
    role: role || 'user',
    email,
    externalId: externalId || req.auth?.userId,
    location,
  };

  Object.keys(profileUpdate).forEach((key) => {
    if (profileUpdate[key] === undefined) {
      delete profileUpdate[key];
    }
  });

  const user = await User.findOneAndUpdate(
    identifier,
    {
      $set: profileUpdate,
      $setOnInsert: {
        progress: {
          modules: defaultModuleProgress(),
          streak: 0,
          xp: 0,
        },
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  res.status(201).json({ user: user.toPublicJSON() });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { email, externalId, firstName, lastName } = await resolveIdentity(req);
  if (!email && !externalId) {
    return res.status(400).json({ error: 'Identity is required' });
  }

  let user = await User.findOne(email ? { email } : { externalId });

  if (!user && (email || externalId)) {
    user = await ensureUserRecord({
      email,
      externalId: externalId || req.auth?.userId,
      defaults: {
        name:
          `${firstName || ''} ${lastName || ''}`.trim() ||
          email?.split('@')[0] ||
          req.auth?.username ||
          'Learner',
        firstName,
        lastName,
      },
    });
  }

  if (!user) {
    return res.status(404).json({ error: 'Unable to create user profile' });
  }

  res.json(user.toPublicJSON());
});
