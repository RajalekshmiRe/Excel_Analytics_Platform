import express from 'express';
import { protect } from "../middleware/authMiddleware.js";
import { chartData, getAnalytics, viewUserDetails, chartCountUpdate, reportCountUpdate } from '../controllers/analysisController.js';
import { logOperation } from "../middleware/logOperation.js";

const router = express.Router();

// Existing chart endpoint
router.post('/chart', protect, chartData);

// update chart counts
router.patch('/update-chart/:id', protect, logOperation("GENERATE_CHART"), chartCountUpdate);

// update reports counts
router.patch('/update-report/:id', protect, logOperation("GENERATE_REPORT"), reportCountUpdate);

// NEW: Analytics dashboard endpoint
router.get('/analytics', protect, getAnalytics);

// User details
router.get("/stats/:userId", viewUserDetails);


export default router;