// routes/tourGuideRoutes.js
import express from 'express';
import { getTourGuides, getRandomTourGuides, getTourGuideById } from '../controllers/tourGuideController.js';

const router = express.Router();

router.get('/', getTourGuides);
router.get('/random', getRandomTourGuides);
router.get('/:id', getTourGuideById);

export default router;