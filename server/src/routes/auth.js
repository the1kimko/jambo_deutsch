import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { registerSchema } from '../validation/schemas/authSchemas.js';

const router = express.Router();

// Webhook to sync Clerk user to MongoDB
router.post('/webhooks/user-created', async (req, res) => {
  try {
    const { data } = req.body;
    const { id, email_addresses, first_name, last_name } = data;
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim();

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const user = new User({
        email,
        name: name || email.split('@')[0],
        goal: 'General',
      });
      await user.save();
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// Custom register for goal sync
router.post('/register', protect, async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await User.findOneAndUpdate(
      { email: req.auth.email }, // Use Clerk's email
      { name: validatedData.name, goal: validatedData.goal },
      { new: true, upsert: true }
    );
    res.status(201).json({ user: user.toPublicJSON() });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Invalid input';
      return res.status(400).json({ error: firstError });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch user data
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.auth.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.toPublicJSON());
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;