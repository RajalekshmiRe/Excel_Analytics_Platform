import express from "express";
import { registerUser, loginUser, updateProfile, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Existing routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// NEW: Profile management routes (protected)
router.put("/update-profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;