// routes/packageRoutes.js
import express from 'express';
import {
  getPackages,
  getRandomPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/packageController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPackages);
router.get('/random', getRandomPackages);
router.get('/:id', getPackageById);
router.post('/', authMiddleware, createPackage);
router.patch('/:id', authMiddleware, updatePackage);
router.delete('/:id', authMiddleware, deletePackage);

export default router;