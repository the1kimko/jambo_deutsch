import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import lessonsRoutes from './routes/lessons.js';
import flashcardRoutes from './routes/flashcards.js';
import partnerRoutes from './routes/partners.js';
import progressRoutes from './routes/progress.js';
import activitiesRoutes from './routes/activities.js';
import leaderboardRoutes from './routes/leaderboard.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { seedDatabase } from './utils/seedData.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Jambo Deutsch API is running' });
});

app.get('/health', (req, res) => {
  res.json({ message: 'Jambo Deutsch API healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
