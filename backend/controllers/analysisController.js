import mongoose from "mongoose";
import Upload from '../models/Upload.js';
import User from '../models/User.js';

// Get chart data for analytics
export const chartData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's uploads with file stats
    const uploads = await Upload.find({ userId }).sort({ createdAt: -1 });

    // Calculate statistics
    const totalUploads = uploads.length;
    const totalSize = uploads.reduce((sum, upload) => sum + (upload.size || 0), 0);
    
    // Format data for charts
    const uploadsByMonth = {};
    const uploadsByType = {};
    
    uploads.forEach(upload => {
      // Group by month - using createdAt instead of uploadDate
      const month = new Date(upload.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      uploadsByMonth[month] = (uploadsByMonth[month] || 0) + 1;
      
      // Group by file type - using originalName instead of fileName
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
      { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // 👈 Convert to ObjectId
      { $group: { _id: null, total: { $sum: "$reportCount" } } }
    ]);
 
    const activeReports = totalReportCount.length > 0 ? totalReportCount[0].total : 0;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const chartCount = await Upload.aggregate([
                            { 
                                $match: { 
                                userId: new mongoose.Types.ObjectId(userId),
                                createdAt: { $gte: startOfMonth } // 👈 Correctly inside $match
                                } 
                            }, // Filter by user
                            {
                              $group: {
                                _id: null,
                                total: { $sum: "$chartCount" }, // 👈 Sum all reportCount fields
                              }
                            }
                          ]);
    const chartsGenerated = chartCount.length > 0 ? chartCount[0].total : 0;


    const stats = {
      totalUploads,
      filesProcessed,
      storageUsedPercent: storageUsedPercent,
      storageUsed,
      storageUnit,
      storageQuota: 100,
      activeReports,
      chartsGenerated: chartsGenerated,
    };

    res.json({ user, stats });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
};

// update chart generated count
export const chartCountUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const upload = await Upload.findByIdAndUpdate(
      id,
      { $inc: { chartCount: 1 } }, // 🔼 Increment by 1
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

// update report generated count
export const reportCountUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    const upload = await Upload.findByIdAndUpdate(
      id,
      { $inc: { reportCount: 1 } }, // 🔼 Increment by 1
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

// Alternative name for the same function (for backward compatibility)
export const getAnalytics = chartData;