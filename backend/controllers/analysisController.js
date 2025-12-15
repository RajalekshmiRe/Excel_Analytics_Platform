// import mongoose from "mongoose";
// import Upload from '../models/Upload.js';
// import User from '../models/User.js';

// // Get chart data for analytics
// export const chartData = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Get user's uploads with file stats
//     const uploads = await Upload.find({ userId }).sort({ createdAt: -1 });

//     // Calculate statistics
//     const totalUploads = uploads.length;
//     const totalSize = uploads.reduce((sum, upload) => sum + (upload.size || 0), 0);
    
//     // Format data for charts
//     const uploadsByMonth = {};
//     const uploadsByType = {};
    
//     uploads.forEach(upload => {
//       // Group by month - using createdAt instead of uploadDate
//       const month = new Date(upload.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
//       uploadsByMonth[month] = (uploadsByMonth[month] || 0) + 1;
      
//       // Group by file type - using originalName instead of fileName
//       const ext = upload.originalName.split('.').pop().toUpperCase();
//       uploadsByType[ext] = (uploadsByType[ext] || 0) + 1;
//     });

//     // Convert to array format for charts
//     const monthlyData = Object.entries(uploadsByMonth).map(([month, count]) => ({
//       month,
//       uploads: count
//     }));

//     const typeData = Object.entries(uploadsByType).map(([type, count]) => ({
//       type,
//       count
//     }));

//     // Format recent uploads for frontend display
//     const recentUploads = uploads.slice(0, 10).map(upload => ({
//       fileName: upload.originalName,
//       fileSize: upload.size,
//       uploadDate: upload.createdAt
//     }));

//     res.json({
//       success: true,
//       data: {
//         totalUploads,
//         totalSize,
//         monthlyData,
//         typeData,
//         recentUploads
//       }
//     });
//   } catch (error) {
//     console.error('Chart data error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch chart data',
//       error: error.message
//     });
//   }
// };

// // Function to view user details
// export const viewUserDetails = async (req, res) => {
//     try {
//     const userId = req.params.userId;

//     // Fetch user details
//     const user = await User.findById(userId).select("name email role");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Fetch stats
//     const totalUploads = await Upload.countDocuments({ userId });
//     const filesProcessed = await Upload.countDocuments({ userId, status: "processed" });
//     const uploads = await Upload.find({ userId });

//     const totalBytes = uploads.reduce((sum, file) => sum + (file.size || 0), 0);
//     const storageUsedGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
//     const storageUsedPercent = Math.min(Math.round((storageUsedGB / 100) * 100), 100);

//     let storageUsed;
//     let storageUnit;

//     if (totalBytes < 1024 * 1024 * 1024) {
//         storageUsed = (totalBytes / (1024 * 1024)).toFixed(2);
//         storageUnit = "MB";
//     } else {
//         storageUsed = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
//         storageUnit = "GB";
//     }

//     const totalReportCount = await Upload.aggregate([
//       { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // 👈 Convert to ObjectId
//       { $group: { _id: null, total: { $sum: "$reportCount" } } }
//     ]);
 
//     const activeReports = totalReportCount.length > 0 ? totalReportCount[0].total : 0;

//     const startOfMonth = new Date();
//     startOfMonth.setDate(1);
//     startOfMonth.setHours(0, 0, 0, 0);

//     const chartCount = await Upload.aggregate([
//                             { 
//                                 $match: { 
//                                 userId: new mongoose.Types.ObjectId(userId),
//                                 createdAt: { $gte: startOfMonth } // 👈 Correctly inside $match
//                                 } 
//                             }, // Filter by user
//                             {
//                               $group: {
//                                 _id: null,
//                                 total: { $sum: "$chartCount" }, // 👈 Sum all reportCount fields
//                               }
//                             }
//                           ]);
//     const chartsGenerated = chartCount.length > 0 ? chartCount[0].total : 0;


//     const stats = {
//       totalUploads,
//       filesProcessed,
//       storageUsedPercent: storageUsedPercent,
//       storageUsed,
//       storageUnit,
//       storageQuota: 100,
//       activeReports,
//       chartsGenerated: chartsGenerated,
//     };

//     res.json({ user, stats });
//   } catch (error) {
//     console.error("Dashboard stats error:", error);
//     res.status(500).json({ message: "Error fetching dashboard statistics" });
//   }
// };

// // update chart generated count
// export const chartCountUpdate = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const upload = await Upload.findByIdAndUpdate(
//       id,
//       { $inc: { chartCount: 1 } }, // 🔼 Increment by 1
//       { new: true }
//     );

//     if (!upload)
//       return res.status(404).json({ success: false, error: "Document not found" });

//     res.json({
//       success: true,
//       message: "Chart count updated successfully",
//       data: upload,
//     });
//   } catch (err) {
//     console.error("Error incrementing chart count:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // update report generated count
// export const reportCountUpdate = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const upload = await Upload.findByIdAndUpdate(
//       id,
//       { $inc: { reportCount: 1 } }, // 🔼 Increment by 1
//       { new: true }
//     );

//     if (!upload)
//       return res.status(404).json({ success: false, error: "Document not found" });

//     res.json({
//       success: true,
//       message: "Report count updated successfully",
//       data: upload,
//     });
//   } catch (err) {
//     console.error("Error incrementing report count:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// // Alternative name for the same function (for backward compatibility)
// export const getAnalytics = chartData;




import mongoose from "mongoose";
import Upload from '../models/Upload.js';
import User from '../models/User.js';

// Get chart data for analytics
export const chartData = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id; // Support both formats

    // Get user's uploads with file stats
    const uploads = await Upload.find({ userId }).sort({ createdAt: -1 });

    // Calculate statistics
    const totalUploads = uploads.length;
    const totalSize = uploads.reduce((sum, upload) => sum + (upload.size || 0), 0);
    
    // Format data for charts
    const uploadsByMonth = {};
    const uploadsByType = {};
    
    uploads.forEach(upload => {
      // Group by month
      const month = new Date(upload.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      uploadsByMonth[month] = (uploadsByMonth[month] || 0) + 1;
      
      // Group by file type
      const ext = upload.originalName.split('.').pop().toUpperCase();
      uploadsByType[ext] = (uploadsByType[ext] || 0) + 1;
    });

    // Convert to array format for charts
    const monthlyData = Object.entries(uploadsByMonth).map(([month, count]) => ({
      month,
      uploads: count
    }));

    const typeData = Object.entries(uploadsByType).map(([type, count]) => ({
      type,
      count
    }));

    // Format recent uploads for frontend display
    const recentUploads = uploads.slice(0, 10).map(upload => ({
      fileName: upload.originalName,
      fileSize: upload.size,
      uploadDate: upload.createdAt
    }));

    res.json({
      success: true,
      data: {
        totalUploads,
        totalSize,
        monthlyData,
        typeData,
        recentUploads
      }
    });
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data',
      error: error.message
    });
  }
};

/* ============================================================
   ✅ NEW: Get Analytics Dashboard Data
   Route: GET /api/analysis/analytics?range=7days
============================================================ */
export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { timeRange = 'all' } = req.query;

    console.log(`📊 Fetching analytics for user: ${userId}, range: ${timeRange}`);

    // ✅ FIXED: Calculate date range correctly
    const now = new Date();
    let startDate;
    
    switch(timeRange) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        startDate = new Date(0); // ✅ Unix epoch (Jan 1, 1970) - includes ALL uploads
        break;
      default:
        startDate = new Date(0);
    }

    // ✅ FIXED: For "all" time, don't filter by date at all
    const query = timeRange === 'all' 
      ? { userId }  // No date filter
      : { userId, createdAt: { $gte: startDate } };  // With date filter

    // Fetch uploads within date range
    const uploads = await Upload.find(query).sort({ createdAt: -1 });

    console.log(`✅ Found ${uploads.length} uploads in date range: ${timeRange}`);

    // ... rest of the function stays the same

    // Calculate overview statistics
    const totalUploads = uploads.length;
    const totalStorage = uploads.reduce((sum, upload) => sum + (upload.size || 0), 0);
    const totalCharts = uploads.reduce((sum, upload) => sum + (upload.chartCount || 0), 0);
    const totalReports = uploads.reduce((sum, upload) => sum + (upload.reportCount || 0), 0);

    // Format storage (bytes to MB/KB)
   const formatStorage = (bytes) => {
  if (bytes === 0) return '0 MB';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`; // Always MB
};
    // Generate upload trend data (last 7 days)
    const uploadTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = uploads.filter(u => {
        const uploadDate = new Date(u.createdAt);
        return uploadDate >= date && uploadDate < nextDate;
      }).length;
      
      uploadTrend.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        uploads: count
      });
    }

    // File types distribution
    const fileTypeMap = {};
    uploads.forEach(upload => {
      const ext = upload.originalName?.split('.').pop()?.toUpperCase() || 'OTHER';
      fileTypeMap[ext] = (fileTypeMap[ext] || 0) + 1;
    });

    const fileTypes = Object.entries(fileTypeMap).map(([name, value]) => ({
      name,
      value
    }));

    // Storage usage over time
    let cumulativeSize = 0;
    const storageUsage = uploadTrend.map((item, index) => {
      const dayUploads = uploads.filter(u => {
        const uploadDate = new Date(u.createdAt);
        const trendDate = new Date();
        trendDate.setDate(trendDate.getDate() - (6 - index));
        trendDate.setHours(0, 0, 0, 0);
        return uploadDate <= trendDate;
      });
      cumulativeSize = dayUploads.reduce((sum, u) => sum + (u.size || 0), 0);
      return {
        date: item.date,
        storage: parseFloat((cumulativeSize / (1024 * 1024)).toFixed(2))
      };
    });

    // Recent activity (last 5 uploads)
    const recentActivity = uploads.slice(0, 5).map(upload => ({
      action: `Uploaded ${upload.originalName}`,
      time: new Date(upload.createdAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'success'
    }));

    // Top files (most recent with view counts)
    const topFiles = uploads.slice(0, 5).map(file => ({
      name: file.originalName,
      size: formatStorage(file.size || 0),
      views: file.chartCount || 0
    }));

    // Calculate trends (compare with previous period)
    const previousPeriodStart = new Date(startDate);
    const periodLength = now.getTime() - startDate.getTime();
    previousPeriodStart.setTime(startDate.getTime() - periodLength);
    
    const previousUploads = await Upload.find({
      userId,
      createdAt: { $gte: previousPeriodStart, $lt: startDate }
    });

    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const previousStorage = previousUploads.reduce((sum, u) => sum + (u.size || 0), 0);
    const previousCharts = previousUploads.reduce((sum, u) => sum + (u.chartCount || 0), 0);
    const previousReports = previousUploads.reduce((sum, u) => sum + (u.reportCount || 0), 0);

    const overview = {
      totalUploads,
      uploadsTrend: calculateTrend(totalUploads, previousUploads.length),
      totalStorage: formatStorage(totalStorage),
      storageTrend: calculateTrend(totalStorage, previousStorage),
      totalCharts,
      chartsTrend: calculateTrend(totalCharts, previousCharts),
      totalReports,
      reportsTrend: calculateTrend(totalReports, previousReports)
    };

    const analyticsData = {
      overview,
      uploadTrend,
      fileTypes,
      storageUsage,
      recentActivity,
      topFiles
    };

    console.log('✅ Analytics data prepared successfully');

    res.json(analyticsData);
  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    res.status(500).json({
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// Function to view user details
export const viewUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user details
    const user = await User.findById(userId).select("name email role");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch stats
    const totalUploads = await Upload.countDocuments({ userId });
    const filesProcessed = await Upload.countDocuments({ userId, status: "processed" });
    const uploads = await Upload.find({ userId });

    const totalBytes = uploads.reduce((sum, file) => sum + (file.size || 0), 0);
    const storageUsedGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
    const storageUsedPercent = Math.min(Math.round((storageUsedGB / 100) * 100), 100);

    let storageUsed;
    let storageUnit;

    if (totalBytes < 1024 * 1024 * 1024) {
      storageUsed = (totalBytes / (1024 * 1024)).toFixed(2);
      storageUnit = "MB";
    } else {
      storageUsed = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);
      storageUnit = "GB";
    }

    const totalReportCount = await Upload.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$reportCount" } } }
    ]);
 
    const activeReports = totalReportCount.length > 0 ? totalReportCount[0].total : 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // ✅ Counts ALL charts (matching Analytics behavior)
const chartCount = await Upload.aggregate([
  { 
    $match: { 
      userId: new mongoose.Types.ObjectId(userId)
      // ✅ No date filter - counts ALL charts
    } 
  },
  { $group: { _id: null, total: { $sum: "$chartCount" } } }
]);
    const chartsGenerated = chartCount.length > 0 ? chartCount[0].total : 0;

    // ✅ SIMPLIFIED RESPONSE: Return stats directly
    res.json({
      stats: {
        totalUploads,
        filesProcessed,
        storageUsedPercent,
        storageUsed,
        storageUnit,
        storageQuota: 100,
        activeReports,
        chartsGenerated,
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
}; // ✅ CLOSING BRACE WAS MISSING HERE!

// Update chart generated count
export const chartCountUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const upload = await Upload.findByIdAndUpdate(
      id,
      { $inc: { chartCount: 1 } },
      { new: true }
    );

    if (!upload)
      return res.status(404).json({ success: false, error: "Document not found" });

    res.json({
      success: true,
      message: "Chart count updated successfully",
      data: upload,
    });
  } catch (err) {
    console.error("Error incrementing chart count:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Update report generated count
export const reportCountUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const upload = await Upload.findByIdAndUpdate(
      id,
      { $inc: { reportCount: 1 } },
      { new: true }
    );

    if (!upload)
      return res.status(404).json({ success: false, error: "Document not found" });

    res.json({
      success: true,
      message: "Report count updated successfully",
      data: upload,
    });
  } catch (err) {
    console.error("Error incrementing report count:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};