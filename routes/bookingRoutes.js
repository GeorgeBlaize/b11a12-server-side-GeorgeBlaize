import express from 'express';
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  createPaymentIntent,
} from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getBookings);
router.post('/', authMiddleware, createBooking);
router.patch('/:id', authMiddleware, updateBooking);
router.delete('/:id', authMiddleware, deleteBooking);
router.post('/create-payment-intent', authMiddleware, createPaymentIntent);

export default router;