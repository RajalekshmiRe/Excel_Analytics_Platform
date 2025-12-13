// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import Upload from "../models/Upload.js";
// import User from "../models/User.js";

// const router = express.Router();

// // GET /api/dashboard/stats - Get user dashboard statistics
// router.get("/stats", protect, async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Get total uploads count
//     const totalUploads = await Upload.countDocuments({ userId });

//     // Get processed files count
//     const filesProcessed = await Upload.countDocuments({ 
//       userId, 
//       status: "processed" 
//     });

//     // Calculate storage used (in GB)
//     const uploads = await Upload.find({ userId });
//     const totalBytes = uploads.reduce((sum, file) => sum + (file.size || 0), 0);
//     const storageUsedGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
//     const storageUsedPercent = Math.min(Math.round((storageUsedGB / 100) * 100), 100);

//     // Get active reports (processed files ready for analysis)
//     const activeReports = await Upload.countDocuments({ 
//       userId, 
//       status: "processed" 
//     });

//     // Count charts generated (you can track this in a separate collection later)
//     // For now, we'll estimate based on processed files
//     const chartsGenerated = filesProcessed * 3; // Assume 3 charts per file average

//     // Get charts generated this month
//     const startOfMonth = new Date();
//     startOfMonth.setDate(1);
//     startOfMonth.setHours(0, 0, 0, 0);

//     const chartsThisMonth = await Upload.countDocuments({
//       userId,
//       status: "processed",
//       createdAt: { $gte: startOfMonth }
//     }) * 3;

//     res.json({
//       totalUploads,
//       filesProcessed,
//       storageUsed: storageUsedPercent,
//       storageQuota: 100, // 100GB default quota
//       activeReports,
//       chartsGenerated,
//       chartsThisMonth
//     });
//   } catch (error) {
//     console.error("Dashboard stats error:", error);
//     res.status(500).json({ message: "Error fetching dashboard statistics" });
//   }
// });

// // GET /api/dashboard/recent-activity - Get recent file uploads
// router.get("/recent-activity", protect, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const limit = parseInt(req.query.limit) || 10;

//     // Get recent uploads
//     const recentUploads = await Upload.find({ userId })
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .select("filename originalName size status createdAt");

//     // Format the activities
//     const activities = recentUploads.map((upload, index) => {
//       // Format date
//       const date = new Date(upload.createdAt);
//       const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

//       // Format size
//       let formattedSize;
//       const sizeInBytes = upload.size || 0;
//       if (sizeInBytes < 1024) {
//         formattedSize = `${sizeInBytes} B`;
//       } else if (sizeInBytes < 1024 * 1024) {
//         formattedSize = `${(sizeInBytes / 1024).toFixed(1)} KB`;
//       } else {
//         formattedSize = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
//       }

//       return {
//         id: upload._id,
//         fileName: upload.originalName || upload.filename,
//         date: formattedDate,
//         size: formattedSize,
//         status: upload.status === "processed" ? "Processed" : "Ready"
//       };
//     });

//     res.json({ activities });
//   } catch (error) {
//     console.error("Recent activity error:", error);
//     res.status(500).json({ message: "Error fetching recent activity" });
//   }
// });

// // GET /api/dashboard/storage-details - Get detailed storage information
// router.get("/storage-details", protect, async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const uploads = await Upload.find({ userId });
    
//     // Calculate storage by file type
//     const storageByType = {};
//     let totalSize = 0;

//     uploads.forEach(file => {
//       const ext = file.originalName?.split('.').pop()?.toLowerCase() || 'unknown';
//       const size = file.size || 0;
      
//       if (!storageByType[ext]) {
//         storageByType[ext] = { size: 0, count: 0 };
//       }
      
//       storageByType[ext].size += size;
//       storageByType[ext].count += 1;
//       totalSize += size;
//     });

//     // Convert to array and format
//     const storageBreakdown = Object.entries(storageByType).map(([type, data]) => ({
//       type: type.toUpperCase(),
//       size: (data.size / (1024 * 1024)).toFixed(2) + ' MB',
//       sizeBytes: data.size,
//       count: data.count,
//       percentage: ((data.size / totalSize) * 100).toFixed(1)
//     }));

//     res.json({
//       totalSize: (totalSize / (1024 * 1024)).toFixed(2) + ' MB',
//       totalFiles: uploads.length,
//       breakdown: storageBreakdown.sort((a, b) => b.sizeBytes - a.sizeBytes)
//     });
//   } catch (error) {
//     console.error("Storage details error:", error);
//     res.status(500).json({ message: "Error fetching storage details" });
//   }
// });

// export default router;


import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Upload from "../models/Upload.js";

const router = express.Router();

/* ============================================================
   ✅ Get dashboard stats (GET /api/dashboard/stats)
============================================================ */
router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get total uploads count
    const totalUploads = await Upload.countDocuments({ userId });

    // Get processed files count
    const filesProcessed = await Upload.countDocuments({
      userId,
      status: "processed",
    });

    // Calculate storage used
    const uploads = await Upload.find({ userId });
    const totalBytes = uploads.reduce((sum, file) => sum + (file.size || 0), 0);
    const storageUsedGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
    const storageUsedPercent = Math.min(Math.round((storageUsedGB / 100) * 100), 100);

    // Get active reports
    const activeReports = await Upload.countDocuments({
      userId,
      status: "processed",
    });

    // Calculate charts generated this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const chartsThisMonth = await Upload.countDocuments({
      userId,
      status: "processed",
      createdAt: { $gte: startOfMonth },
    });

    res.json({
      totalUploads,
      filesProcessed,
      storageUsed: storageUsedPercent,
      storageQuota: 100,
      activeReports,
      chartsGenerated: chartsThisMonth * 3, // Estimate 3 charts per file
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
});

/* ============================================================
   ✅ Get recent activity (GET /api/dashboard/recent-activity)
============================================================ */
router.get("/recent-activity", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    const recentUploads = await Upload.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("filename originalName size status createdAt");

    const activities = recentUploads.map((upload) => {
      const date = new Date(upload.createdAt);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

      let formattedSize;
      const sizeInBytes = upload.size || 0;
      if (sizeInBytes < 1024) {
        formattedSize = `${sizeInBytes} B`;
      } else if (sizeInBytes < 1024 * 1024) {
        formattedSize = `${(sizeInBytes / 1024).toFixed(1)} KB`;
      } else {
        formattedSize = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
      }

      return {
        id: upload._id,
        fileName: upload.originalName || upload.filename,
        date: formattedDate,
        size: formattedSize,
        status: upload.status === "processed" ? "Processed" : "Ready",
      };
    });

    res.json({ activities });
  } catch (error) {
    console.error("Recent activity error:", error);
    res.status(500).json({ message: "Error fetching recent activity" });
  }
});

/* ============================================================
   ✅ Get storage details (GET /api/dashboard/storage-details)
============================================================ */
router.get("/storage-details", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const uploads = await Upload.find({ userId });

    const storageByType = {};
    let totalSize = 0;

    uploads.forEach((file) => {
      const ext = file.originalName?.split(".").pop()?.toLowerCase() || "unknown";
      const size = file.size || 0;

      if (!storageByType[ext]) {
        storageByType[ext] = { size: 0, count: 0 };
      }

      storageByType[ext].size += size;
      storageByType[ext].count += 1;
      totalSize += size;
    });

    const storageBreakdown = Object.entries(storageByType).map(([type, data]) => ({
      type: type.toUpperCase(),
      size: (data.size / (1024 * 1024)).toFixed(2) + " MB",
      sizeBytes: data.size,
      count: data.count,
      percentage: totalSize > 0 ? ((data.size / totalSize) * 100).toFixed(1) : "0",
    }));

    res.json({
      totalSize: (totalSize / (1024 * 1024)).toFixed(2) + " MB",
      totalFiles: uploads.length,
      breakdown: storageBreakdown.sort((a, b) => b.sizeBytes - a.sizeBytes),
    });
  } catch (error) {
    console.error("Storage details error:", error);
    res.status(500).json({ message: "Error fetching storage details" });
  }
});


export default router;