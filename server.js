// server.js
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import storyRoutes from './routes/storyRoutes.js';
import tourGuideRoutes from './routes/tourGuideRoutes.js';
import userRoutes from './routes/userRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
let db;
connectDB().then((database) => {
  db = database;
  app.locals.db = db;
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/tour-guides', tourGuideRoutes);
app.use('/api/users', userRoutes);
app.use('/api/candidates', candidateRoutes);

// Error Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});