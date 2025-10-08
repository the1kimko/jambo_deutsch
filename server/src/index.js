import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import authRoutes from './routes/auth.js';
import {errorHandler} from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({message: 'Jambo Deutsch API is running'});
});

app.use('/api/auth', authRoutes);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
