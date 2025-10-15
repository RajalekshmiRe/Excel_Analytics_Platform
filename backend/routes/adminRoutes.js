import express from "express";
import {
  getAllUsers,
  getUserById,
  deleteUser,
  toggleUserStatus,
  getDashboardStats,
  getDashboardCharts,
  getRecentActivity,
  getAllFiles,
  deleteFile,
  getSettings,
  updateSettings,
  validateSettings
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Protect all admin routes - use ONLY protect and adminOnly
router.use(protect);
router.use(adminOnly);

// Dashboard routes
router.get("/stats", getDashboardStats);
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/charts", getDashboardCharts);
router.get("/activity", getRecentActivity);

// User management routes
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/toggle-status", toggleUserStatus);

// File management routes
router.get("/files", getAllFiles);
router.delete("/files/:id", deleteFile);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', validateSettings, updateSettings);

export default router;