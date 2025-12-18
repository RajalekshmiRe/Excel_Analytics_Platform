import express from 'express';
import { protect } from "../middleware/authMiddleware.js";
import { chartData, getAnalytics, viewUserDetails, chartCountUpdate, reportCountUpdate } from '../controllers/analysisController.js';
import { logOperation } from "../middleware/logOperation.js";

const router = express.Router();

// ✅ IMPORTANT: More specific routes MUST come BEFORE dynamic routes
// Analytics dashboard endpoint - MUST be before /:userId
router.get('/analytics', protect, getAnalytics);

// Existing chart endpoint
router.post('/chart', protect, chartData);

// Update chart counts
router.patch('/chart/:id', protect, logOperation("GENERATE_CHART"), chartCountUpdate);

// Update reports counts
router.patch('/report/:id', protect, logOperation("GENERATE_REPORT"), reportCountUpdate);

// ✅ User can access their own stats - MUST be LAST (dynamic route)
router.get('/:userId', protect, viewUserDetails);

export default router;