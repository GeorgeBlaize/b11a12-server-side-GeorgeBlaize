import express from 'express';
import {
  getCandidates,
  createCandidate,
  updateCandidateStatus,
  deleteCandidate,
} from '../controllers/candidateController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getCandidates);
router.post('/', authMiddleware, createCandidate);
router.patch('/:id', authMiddleware, updateCandidateStatus);
router.delete('/:id', authMiddleware, deleteCandidate);

export default router;