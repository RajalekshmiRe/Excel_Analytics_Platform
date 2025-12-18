import express from 'express';
import { protect } from "../middleware/authMiddleware.js";
import { 
  analyzeFile,           // ✅ NEW - File analysis with data preview
  getColumnData,         // ✅ NEW - Get column data for charts
  chartData,             // ✅ Existing
  getAnalytics,          // ✅ Existing
  viewUserDetails,       // ✅ Existing
  chartCountUpdate,      // ✅ Existing
  reportCountUpdate      // ✅ Existing
} from '../controllers/analysisController.js';
import { logOperation } from "../middleware/logOperation.js";

const router = express.Router();

// ✅ NEW - File analysis endpoints (MUST be before dynamic routes)
router.get('/file/:fileId/analyze', protect, analyzeFile);
router.get('/file/:fileId/columns', protect, getColumnData);

// ✅ Analytics dashboard endpoint
router.get('/analytics', protect, getAnalytics);

// ✅ Existing chart endpoint
router.post('/chart', protect, chartData);

// ✅ Update chart counts
router.patch('/chart-count/:id', protect, logOperation("GENERATE_CHART"), chartCountUpdate);

// ✅ Update reports counts
router.patch('/report-count/:id', protect, logOperation("GENERATE_REPORT"), reportCountUpdate);

// ✅ User stats - MUST be LAST (dynamic route)
router.get('/:userId', protect, viewUserDetails);

export default router;