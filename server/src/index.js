import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
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
import { registerSocketHandlers } from './sockets/index.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  },
});

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

registerSocketHandlers(io);

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();
    server.listen(PORT, () => {
      console.log(`🚀 Server + Socket.IO running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
