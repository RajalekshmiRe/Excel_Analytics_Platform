import express from "express";
import { registerUser, loginUser, updateProfile, changePassword, logoutUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { logOperation } from "../middleware/logOperation.js";

const router = express.Router();

// Existing routes
router.post("/register", logOperation("REGISTER_USER"), registerUser);
router.post("/login", logOperation("LOGIN_USER"), loginUser);
router.patch("/logout/:id", logOperation("LOGOUT_USER"), logoutUser);


// NEW: Profile management routes (protected)
router.put("/update-profile", protect, logOperation("UPDATE_PROFILE"), updateProfile);
router.put("/change-password", protect, logOperation("UPDATE_PASSWORD"), changePassword);

export default router;