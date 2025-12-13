import express from 'express';
import {
  createAdminRequest,
  getAllRequests,
  reviewAdminRequest,
  getUserRequests
} from '../controllers/adminRequestController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// User creates a request
router.post('/', protect, createAdminRequest);

// Admin views all requests
router.get('/', protect, adminOnly, getAllRequests);

// Get user by id
router.get('/:userId', protect, getUserRequests);

// Admin approves/rejects a request
router.put('/:id/review', protect, adminOnly, reviewAdminRequest);

export default router;
