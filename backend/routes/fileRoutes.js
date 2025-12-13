import express from 'express';
import { protect } from "../middleware/authMiddleware.js";
import { viewFile, downloadFile } from '../controllers/fileController.js'; // adjust path as needed
import { logOperation } from "../middleware/logOperation.js";

const router = express.Router();

// View file route
router.get('/view/:fileId', protect, viewFile);

// Download file route
router.get('/download/:fileId', protect, logOperation("DOWNLOAD_DOCUMENT"),  downloadFile);

export default router;