import express from 'express';
import { protect } from "../middleware/authMiddleware.js";
import { chartData, getAnalytics } from '../controllers/analysisController.js';

const router = express.Router();

// Existing chart endpoint
router.post('/chart', protect, chartData);

// NEW: Analytics dashboard endpoint
router.get('/analytics', protect, getAnalytics);

export default router;