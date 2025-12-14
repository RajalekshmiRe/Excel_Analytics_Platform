// import { Router } from "express";
// import multer from "multer";
// import { protect } from "../middleware/authMiddleware.js";
// import { uploadExcel, myUploads, getUpload } from "../controllers/uploadController.js";

// const router = Router();
// const upload = multer({
//   storage: multer.memoryStorage(),
//   fileFilter: (req, file, cb) => {
//     const ok = [
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       "application/vnd.ms-excel"
//     ].includes(file.mimetype);
//     cb(ok ? null : new Error("Only .xls or .xlsx allowed"), ok);
//   }
// });

// router.post("/", protect, upload.single("file"), uploadExcel);
// router.get("/", protect, myUploads);
// router.get("/:id", protect, getUpload);

// export default router;
// import express,{ Router } from "express";
// import multer from "multer";
// import uploads from "../models/ExcelData.js"; 
// import { protect } from "../middleware/authMiddleware.js";
// import { uploadExcel, myUploads, getUpload } from "../controllers/uploadController.js";

// const router =express.Router();

// // Save files to "uploads" folder
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // make sure uploads/ folder exists
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // unique filename
//   }
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const ok = [
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       "application/vnd.ms-excel"
//     ].includes(file.mimetype);
//     cb(ok ? null : new Error("Only .xls or .xlsx allowed"), ok);
//   }
// });

// router.post("/", protect, upload.single("file"), uploadExcel);
// router.get("/", protect, myUploads);
// router.get("/:id", protect, getUpload);

// export default router;



// // 🔹 Fetch upload history for logged-in user
// router.get("/history", protect, getUploadHistory );async (req, res) => {
//   try {
//     const uploads = await Upload.find({ user: req.user._id })
//       .sort({ createdAt: -1 });
//     res.json(uploads);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch history" });
//   }
// });

// import express from "express";
// import multer from "multer";
// import { protect } from "../middleware/authMiddleware.js";
// import { uploadExcel, getUploadHistory } from "../controllers/uploadController.js";

// const router = express.Router();

// // Multer storage config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });

// const upload = multer({ storage });

// // Upload file (saves to DB)
// router.post("/", protect, upload.single("file"), async (req, res) => {
//   try {
//     const newUpload = new ExcelData({
//       user: req.user._id,
//       filename: req.file.originalname,
//       storedName: req.file.filename,
//       path: req.file.path,
//       sheetName: "",
//       headers: [],
//       rowCount: 0,
//       data: [],
//     });

//     const savedUpload = await newUpload.save();
//     res.json(savedUpload);
//   } catch (error) {
//     console.error("File upload error:", error.message);
//     res.status(500).json({ message: "File upload failed" });
//   }
// });

// // Use controller endpoints
// router.post("/upload", protect, uploadExcel);
// router.get("/history", protect, getUploadHistory);

// export default router;


// import express from "express";
// import upload from "../middleware/upload.js";
// import Upload from "../models/Upload.js";
// import { protect } from "../middleware/authMiddleware.js";
// import { logOperation } from "../middleware/logOperation.js";
// import fs from "fs";
// import xlsx from "xlsx";

// const router = express.Router();

// /* ============================================================
//    ✅ Upload a file (POST /api/uploads)
// ============================================================ */
// router.post("/", protect, upload.single("file"), logOperation("UPLOAD_FILE"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const userId = req.user._id;

//     // Determine file type
//     const ext = req.file.originalname.split(".").pop().toLowerCase();
//     let fileType = "other";
//     if (["xlsx", "xls"].includes(ext)) fileType = "xlsx";
//     else if (ext === "csv") fileType = "csv";

//     // Parse metadata
//     let rowCount = 0;
//     let columnCount = 0;
//     let headers = [];

//     try {
//       const workbook = xlsx.readFile(req.file.path);
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const data = xlsx.utils.sheet_to_json(sheet);

//       rowCount = data.length;
//       if (data.length > 0) {
//         headers = Object.keys(data[0]);
//         columnCount = headers.length;
//       }
//     } catch (parseError) {
//       console.log("⚠️ File parse skipped; will process later.");
//     }

//     // Save metadata to DB
//     const newUpload = await Upload.create({
//       userId,
//       filename: req.file.filename,
//       originalName: req.file.originalname,
//       path: req.file.path,
//       size: req.file.size,
//       mimetype: req.file.mimetype,
//       status: rowCount > 0 ? "processed" : "pending",
//       fileType,
//       rowCount,
//       columnCount,
//       headers,
//     });

//     res.status(201).json({
//       message: "File uploaded successfully",
//       file: {
//         id: newUpload._id,
//         filename: newUpload.originalName,
//         size: newUpload.size,
//         status: newUpload.status,
//         uploadedAt: newUpload.createdAt,
//       },
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ message: "Error uploading file", error: error.message });
//   }
// });

// /* ============================================================
//    ✅ Get upload history (GET /api/uploads/history)
//    UPDATED: Returns array directly for UploadHistory.jsx
// ============================================================ */
// router.get("/history", protect, async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const uploads = await Upload.find({ userId })
//       .sort({ createdAt: -1 })
//       .select("originalName size status createdAt fileType rowCount columnCount");

//     // Return array directly (matches UploadHistory.jsx expectations)
//     const formattedUploads = uploads.map((upload) => ({
//       _id: upload._id.toString(),
//       filename: upload.originalName,
//       size: upload.size, // Return as number, will format in frontend
//       status: upload.status,
//       createdAt: upload.createdAt,
//       fileType: upload.fileType,
//       rows: upload.rowCount || 0,
//       columns: upload.columnCount || 0,
//     }));

//     res.json(formattedUploads);
//   } catch (error) {
//     console.error("Get upload history error:", error);
//     res.status(500).json({ message: "Error fetching uploads history" });
//   }
// });

// /* ============================================================
//    ✅ Get recent files (GET /api/uploads/recent)
// ============================================================ */
// router.get("/recent", protect, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const limit = parseInt(req.query.limit) || 5;

//     const recentFiles = await Upload.find({ userId })
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .select("originalName size status createdAt fileType");

//     const formattedFiles = recentFiles.map((file) => ({
//       id: file._id,
//       name: file.originalName,
//       size: file.size,
//       status: file.status,
//       uploadedAt: file.createdAt,
//       date: file.createdAt,
//       fileType: file.fileType,
//     }));

//     res.json(formattedFiles);
//   } catch (error) {
//     console.error("Get recent files error:", error);
//     res.status(500).json({ message: "Error fetching recent files" });
//   }
// });

// /* ============================================================
//    ✅ Get all user uploads (GET /api/uploads)
// ============================================================ */
// router.get("/", protect, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const uploads = await Upload.find({ userId })
//       .sort({ createdAt: -1 })
//       .select("-path");

//     res.json({ uploads });
//   } catch (error) {
//     console.error("Get uploads error:", error);
//     res.status(500).json({ message: "Error fetching uploads" });
//   }
// });

// /* ============================================================
//    ✅ Get specific upload details (GET /api/uploads/:id)
// ============================================================ */
// router.get("/:id", protect, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const upload = await Upload.findOne({ _id: req.params.id, userId });

//     if (!upload) return res.status(404).json({ message: "File not found" });

//     try {
//       const workbook = xlsx.readFile(upload.path);
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const data = xlsx.utils.sheet_to_json(sheet);

//       res.json({
//         upload: {
//           id: upload._id,
//           filename: upload.originalName,
//           size: upload.size,
//           status: upload.status,
//           rowCount: data.length,
//           columnCount: upload.headers?.length || 0,
//           headers: upload.headers,
//           uploadedAt: upload.createdAt,
//         },
//         preview: data.slice(0, 10),
//       });
//     } catch {
//       res.json({
//         upload: {
//           id: upload._id,
//           filename: upload.originalName,
//           size: upload.size,
//           status: upload.status,
//           uploadedAt: upload.createdAt,
//         },
//         error: "Could not parse file",
//       });
//     }
//   } catch (error) {
//     console.error("Get upload error:", error);
//     res.status(500).json({ message: "Error fetching upload details" });
//   }
// });

// /* ============================================================
//    ✅ Delete an upload (DELETE /api/uploads/:id)
// ============================================================ */
// router.delete("/:id", protect, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const upload = await Upload.findOne({ _id: req.params.id, userId });

//     if (!upload) return res.status(404).json({ message: "File not found" });

//     // Delete physical file
//     if (fs.existsSync(upload.path)) {
//       fs.unlinkSync(upload.path);
//     }

//     // Delete from database
//     await Upload.deleteOne({ _id: req.params.id });

//     res.json({ message: "File deleted successfully" });
//   } catch (error) {
//     console.error("Delete upload error:", error);
//     res.status(500).json({ message: "Error deleting file" });
//   }
// });

// /* ============================================================
//    ✅ Update upload status (PUT /api/uploads/:id/status)
// ============================================================ */
// router.put("/:id/status", protect, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { status } = req.body;

//     if (!["pending", "processing", "processed", "failed"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const upload = await Upload.findOneAndUpdate(
//       { _id: req.params.id, userId },
//       { status },
//       { new: true }
//     );

//     if (!upload) return res.status(404).json({ message: "File not found" });

//     res.json({ message: "Status updated", upload });
//   } catch (error) {
//     console.error("Update status error:", error);
//     res.status(500).json({ message: "Error updating status" });
//   }
// });

// export default router;




import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { protect } from '../middleware/authMiddleware.js';
import Upload from '../models/Upload.js';
import { logOperation } from '../middleware/logOperation.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /xlsx|xls|csv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only Excel and CSV files are allowed!'));
    }
  }
});

// POST /api/uploads - Upload a file
router.post('/', protect, logOperation('UPLOAD_FILE'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newUpload = new Upload({
      userId: req.user.id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      status: 'processed',
      chartCount: 0,
      reportCount: 0
    });

    await newUpload.save();

    console.log('✅ File uploaded successfully:', newUpload);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      file: newUpload
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
});

// GET /api/uploads/history - Get user's upload history
router.get('/history', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log(`📂 Fetching upload history for user: ${userId}`);

    // Fetch all uploads for the user, sorted by most recent
    const uploads = await Upload.find({ userId })
      .sort({ createdAt: -1 })
      .select('filename originalName size mimetype status createdAt chartCount reportCount path');

    console.log(`✅ Found ${uploads.length} uploads for user ${userId}`);

    // Transform the data to match frontend expectations
    const formattedUploads = uploads.map(upload => ({
      _id: upload._id,
      id: upload._id, // Include both for compatibility
      filename: upload.filename,
      originalname: upload.originalName,
      size: upload.size,
      filesize: upload.size, // Include both for compatibility
      status: upload.status || 'Ready',
      createdAt: upload.createdAt,
      uploadedAt: upload.createdAt, // Include both for compatibility
      chartCount: upload.chartCount || 0,
      reportCount: upload.reportCount || 0,
      mimetype: upload.mimetype,
      path: upload.path
    }));

    res.json(formattedUploads);
  } catch (error) {
    console.error('❌ Error fetching upload history:', error);
    res.status(500).json({
      message: 'Failed to load upload history',
      error: error.message
    });
  }
});

// GET /api/uploads/:id - Get single upload details
router.get('/:id', protect, async (req, res) => {
  try {
    const upload = await Upload.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!upload) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json(upload);
  } catch (error) {
    console.error('Error fetching upload:', error);
    res.status(500).json({
      message: 'Error fetching file details',
      error: error.message
    });
  }
});

// DELETE /api/uploads/:id - Delete a file
router.delete('/:id', protect, logOperation('DELETE_FILE'), async (req, res) => {
  try {
    const upload = await Upload.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!upload) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Delete physical file
    if (fs.existsSync(upload.path)) {
      fs.unlinkSync(upload.path);
    }

    // Delete database record
    await Upload.findByIdAndDelete(req.params.id);

    console.log('✅ File deleted successfully:', upload.filename);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
});

export default router;