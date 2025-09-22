// routes/userRoutes.js
import express from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getUsers);
router.patch('/:email', authMiddleware, updateUser);
router.delete('/:email', authMiddleware, deleteUser);

export default router;