import fs from 'fs';
import path from 'path';
import Recording from '../models/Recording.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ensureUserRecord } from '../utils/userProfile.js';
import { getRequestUserEmail, getRequestUserId } from '../utils/requestUser.js';

export const uploadRecording = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Audio file is required' });
  }

  const email = getRequestUserEmail(req);
  const externalId = getRequestUserId(req);
  const user = await ensureUserRecord({ email, externalId });
  if (!user) {
    fs.unlinkSync(req.file.path);
    return res.status(401).json({ error: 'Unable to identify user' });
  }

  const recording = await Recording.create({
    user: user._id,
    phrase: req.body.phrase,
    location: req.body.location,
    url: req.file.path,
    duration: Number(req.body.duration) || 0,
  });

  res.status(201).json({
    id: recording._id,
    uploadedAt: recording.createdAt,
    url: recording.url,
  });
});
