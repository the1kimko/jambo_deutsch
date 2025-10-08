import express from 'express';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import {loginSchema, registerSchema} from "../validation/schemas/authSchemas.js";
import {protect} from "../middleware/auth.js";

const router = express.Router();

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({id: userId}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await User.findOne({email: validatedData.email});
    if (existingUser) {
      return res.status(400).json({error: 'User already exists'});
    }

    const user = new User(validatedData);
    await user.save();

    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.name === 'ZodError') {
      const firstError = error.errors?.[0]?.message || 'Invalid input';
      return res.status(400).json({error: firstError});
    }
    res.status(500).json({error: 'Server error'});
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const user = await User.findOne({email: validatedData.email}).select('+password');
    if (!user || !(await user.comparePassword(validatedData.password))) {
      return res.status(401).json({error: 'Invalid credentials'});
    }

    const token = generateToken(user.id);
    res.json({
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.name === 'ZodError') {
      return res.status(400).json({error: error.errors[0].message});
    }
    res.status(500).json({error: 'Server error'});
  }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({error: 'User not found!'});
    }
    res.json(user.toPublicJSON());
  } catch (error) {
    res.status(500).json({error: 'Server error'});
  }
});

export default router;


