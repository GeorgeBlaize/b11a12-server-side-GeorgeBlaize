// routes/storyRoutes.js
import express from 'express';
import {
  getStories,
  getRandomStories,
  createStory,
  updateStory,
  deleteStory,
} from '../controllers/storyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router({});

router.get('/', getStories);
router.get('/random', getRandomStories);
router.post('/', authMiddleware, createStory);
router.patch('/:id', authMiddleware, updateStory);
router.delete('/:id', authMiddleware, deleteStory);

export default router;