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
import { adminResetPassword } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { logOperation } from "../middleware/logOperation.js";

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
router.delete("/users/:id", logOperation("DELETE_USER"), deleteUser);
router.patch("/users/:id/toggle-status", logOperation("CHANGE_USER_STATUS"), toggleUserStatus);

// File management routes
router.get("/files", getAllFiles);
router.delete("/files/:id", deleteFile);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', validateSettings, logOperation("UPDATE_STATUS"), updateSettings);

// Reset users password
router.post("/user-password-reset", logOperation("UPDATE_USER_PASSWORD"), adminResetPassword);

export default router;