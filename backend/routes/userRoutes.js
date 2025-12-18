import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/userController.js";
import upload from "../middleware/upload.js";
import Upload from "../models/Upload.js"; // ✅ Use your Upload.js model
import fs from "fs";
import { protect } from "../middleware/authMiddleware.js";
import { logOperation } from "../middleware/logOperation.js";
import { uploadAvatar } from '../config/cloudinary.js';
import { updateAvatar } from '../controllers/userController.js';


const router = express.Router();
router.put('/avatar', protect, uploadAvatar.single('avatar'), updateAvatar);
// Single file upload route
router.post("/", upload.single("file"), logOperation("FILE_UPLOAD"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    file: req.file,
  });
});

// Get uploaded file preview
router.get("/uploads/:fileId", protect, async (req, res) => {
  const fileId = req.params.fileId;
  const file = await FileModel.findById(fileId);
  if (!file || file.userId.toString() !== req.user._id.toString())
    return res.status(404).send("File not found");

  // Sample preview (replace with Excel parsing later)
  const preview = "First few lines of the file...";

  res.json({ filename: file.name, preview });
});

// Delete uploaded file
router.delete("/uploads/:fileId", protect, async (req, res) => {
  const fileId = req.params.fileId;
  const file = await FileModel.findById(fileId);
  if (!file || file.userId.toString() !== req.user._id.toString())
    return res.status(404).send("File not found");

  await file.remove();
  fs.unlinkSync(file.path); // Delete from storage
  res.status(200).send("File deleted");
});

// Auth routes
router.post("/register", logOperation("REGISTER"), registerUser);
router.post("/login", logOperation("LOGIN"), loginUser);
router.post("/logout", logOperation("LOGOUT"), logoutUser);



// In your auth routes (e.g., userRoutes.js)
router.post("/logout", (req, res) => {
  // If using cookies, clear them
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
