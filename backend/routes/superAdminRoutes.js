import express from 'express';
import { 
  getSuperAdminStats,
  getAdminRequests,
  approveAdminRequest,
  rejectAdminRequest,
  getAllAdmins,
  revokeAdminAccess,
  toggleAdminStatus,
  getAuditLogs,
  getRecentActivity,
  getAllUsers,
  getSettings,
  updateSettings
} from '../controllers/superAdminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { superAdminOnly } from '../middleware/superAdminMiddleware.js';
import { logOperation } from "../middleware/logOperation.js";

const router = express.Router();

// Protect all superadmin routes
router.use(protect);
router.use(superAdminOnly);

// Dashboard
router.get('/stats', getSuperAdminStats);
router.get('/activity', getRecentActivity);

// Admin Requests - FIXED ROUTES
router.get('/requests', getAdminRequests);
router.post('/requests/:id/approve', logOperation("APPROVE_ADMIN_PERMISSION"), approveAdminRequest);
router.post('/requests/:id/reject', logOperation("REJECT_ADMIN_PERMISSION"), rejectAdminRequest);

// Manage Admins
router.get('/admins', getAllAdmins);
router.delete('/admins/:id', logOperation("DELETE_ADMIN_PERMISSION"), revokeAdminAccess);
router.patch('/admins/:id/toggle-status', logOperation("CHANGE_ADMIN_PERMISSION"), toggleAdminStatus);

// Users Management
router.get('/users', getAllUsers);

// Audit Logs
router.get('/audit', getAuditLogs);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;