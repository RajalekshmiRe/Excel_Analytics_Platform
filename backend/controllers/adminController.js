import mongoose from "mongoose";
import User from "../models/User.js";
import Upload from "../models/Upload.js";
import Settings from '../models/Settings.js';
import Operation from "../models/Operation.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const uploadCount = await Upload.countDocuments({ userId: user._id });
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status || 'Active',
          uploads: uploadCount,
          joinDate: user.createdAt,
          lastActive: user.updatedAt
        };
      })
    );

    res.json({
      success: true,
      users: usersWithStats,
      total: users.length
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch users", 
      error: error.message 
    });
  }
};

// Get single user details
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    const uploads = await Upload.find({ userId: user._id });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        uploads: uploads
      }
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch user", 
      error: error.message 
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (user.role === 'admin' || user.role === 'superadmin') {
      return res.status(403).json({ 
        success: false,
        message: "Cannot delete admin users" 
      });
    }

    await Upload.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User and associated data deleted successfully"
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete user", 
      error: error.message 
    });
  }
};

// Toggle user status
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    await user.save();

    res.json({
      success: true,
      message: `User status changed to ${user.status}`,
      status: user.status
    });
  } catch (error) {
    console.error("Toggle user status error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update user status", 
      error: error.message 
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    
    const twoMinutesAgo = new Date(Date.now() - 1 * 60 * 1000); // 2 minutes in milliseconds

    const activeUsers = await User.countDocuments({ online: true });

    const totalUploads = await Upload.countDocuments();

    const totalOperations = await Operation.countDocuments();


    const uploads = await Upload.find();
    const totalBytes = uploads.reduce((sum, file) => sum + (file.size || 0), 0);
    const storageUsedGB = (totalBytes / (1024 * 1024 * 1024)).toFixed(2);

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
                            {
                                $group: {
                                _id: null,
                                total: { $sum: "$reportCount" } // 👈 Sum all reportCount fields
                                }
                            }
                            ]);
    const reportsCreated = totalReportCount.length > 0 ? totalReportCount[0].total : 0;

    const monthChartCount = await Upload.aggregate([
                            {
                              $group: {
                                _id: null,
                                total: { $sum: "$chartCount" }, // 👈 Sum all reportCount fields
                              }
                            }
                          ]);
    const chartsGenerated = monthChartCount.length > 0 ? monthChartCount[0].total : 0;
    

    // system Health
     const dbState = mongoose.connection.readyState === 1; // 1 = connected

    // Add other checks (cache, external API, etc.)
    const allSystemsOperational = dbState ? "100": "0"; 

    // Uptime
    const serverStartTime = req.app.locals.serverStartTime; // 👈 access here
    const uptimeMs = Date.now() - serverStartTime;
    const uptimeHours = Math.floor(uptimeMs / 1000 / 60 / 60);
    const uptimeMinutes = Math.floor((uptimeMs / 1000 / 60) % 60);

    // success rate
    const totalOps = await Operation.countDocuments({});
    const successfulOps = await Operation.countDocuments({ status: "success" });

    const successRate = totalOps > 0 ? ((successfulOps / totalOps) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalUploads,
        totalStorage: parseFloat(storageUsed),
        storageUsed,
        storageUnit,
        systemHealth: allSystemsOperational,
        uptime: `${uptimeHours}h ${uptimeMinutes}m`,
        successRate: successRate,
        chartsGenerated: chartsGenerated || 0,
        reportsCreated: reportsCreated || 0,
        apiCalls: totalOperations,
        pendingReports: 0,
        completedReports: reportsCreated,
        failedUploads: 0,
        successfulUploads: totalUploads
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get dashboard chart data
export const getDashboardCharts = async (req, res) => {
  try {
    const chartData = {
      uploadTrend: [
        { month: 'Jan', uploads: 45 },
        { month: 'Feb', uploads: 52 },
        { month: 'Mar', uploads: 48 },
        { month: 'Apr', uploads: 61 },
        { month: 'May', uploads: 55 },
        { month: 'Jun', uploads: 67 }
      ],
      storageUsage: [
        { name: 'Used', value: 450 },
        { name: 'Available', value: 550 }
      ],
      userActivity: [
        { day: 'Mon', active: 35 },
        { day: 'Tue', active: 42 },
        { day: 'Wed', active: 38 },
        { day: 'Thu', active: 45 },
        { day: 'Fri', active: 50 },
        { day: 'Sat', active: 28 },
        { day: 'Sun', active: 22 }
      ],
      fileFormats: [
        { format: '.xlsx', count: 450 },
        { format: '.csv', count: 380 },
        { format: '.pdf', count: 250 },
        { format: '.json', count: 100 },
        { format: 'Others', count: 70 }
      ]
    };

    res.json({
      success: true,
      data: chartData
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data',
      error: error.message
    });
  }
};

// Get recent activity
export const getRecentActivity = async (req, res) => {
  try {
    const recentUploads = await Upload.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const activities = recentUploads.map(upload => ({
      id: upload._id,
      user: upload.userId?.name || 'Unknown',
      action: `Uploaded ${upload.originalName}`,
      time: getTimeAgo(upload.createdAt),
      type: 'upload'
    }));

    res.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error("Get recent activity error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch activity", 
      error: error.message 
    });
  }
};

// Get all files
export const getAllFiles = async (req, res) => {
  try {
    const files = await Upload.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const filesData = files.map(file => ({
      id: file._id,
      userId: file.userId?._id,
      userName: file.userId?.name || 'Unknown',
      fileName: file.filename,
      uploadDate: file.createdAt,
      size: formatFileSize(file.size || 0),
      status: file.status || 'Processed',
      filePath: file.path
    }));

    res.json({
      success: true,
      files: filesData,
      total: files.length
    });
  } catch (error) {
    console.error("Get all files error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch files", 
      error: error.message 
    });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ 
        success: false,
        message: "File not found" 
      });
    }

    await Upload.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "File deleted successfully"
    });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to delete file", 
      error: error.message 
    });
  }
};

// Get settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ isActive: true });
    
    if (!settings) {
      settings = new Settings({
        siteName: 'MERN Dashboard',
        maxFileSize: 15,
        allowedFormats: ['.xlsx', '.xls', '.csv'],
        maintenanceMode: false,
        emailNotifications: true,
        storageLimit: 100,
        isActive: true
      });
      await settings.save();
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message
    });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const { siteName, maxFileSize, allowedFormats, chartExportFormats, maintenanceMode, emailNotifications, storageLimit, dataMapEnabled, autoAnalytics} = req.body;

    let settings = await Settings.findOne({ isActive: true });

    if (!settings) {
      settings = new Settings({
        siteName,
        maxFileSize,
        allowedFormats,
        chartExportFormats,
        maintenanceMode,
        emailNotifications,
        storageLimit,
        isActive: true,
        dataMapEnabled,
        autoAnalytics
      });
    } else {
      settings.siteName = siteName;
      settings.maxFileSize = maxFileSize;
      settings.allowedFormats = allowedFormats;
      settings.chartExportFormats = chartExportFormats;
      settings.maintenanceMode = maintenanceMode;
      settings.emailNotifications = emailNotifications;
      settings.storageLimit = storageLimit;
      settings.dataMapEnabled = dataMapEnabled,
      settings.autoAnalytics = autoAnalytics
      settings.updatedAt = new Date();
    }

    await settings.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    });
  }
};

// Validate settings middleware
export const validateSettings = (req, res, next) => {
  const { siteName, maxFileSize, storageLimit, allowedFormats } = req.body;

  if (!siteName || siteName.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Site name is required'
    });
  }

  if (!Number.isInteger(maxFileSize) || maxFileSize < 1 || maxFileSize > 1000) {
    return res.status(400).json({
      success: false,
      message: 'Max file size must be between 1 and 1000 MB'
    });
  }

  if (!Number.isInteger(storageLimit) || storageLimit < 1 || storageLimit > 10000) {
    return res.status(400).json({
      success: false,
      message: 'Storage limit must be between 1 and 10000 GB'
    });
  }

  if (!Array.isArray(allowedFormats) || allowedFormats.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one file format must be selected'
    });
  }

  next();
};

// Helper functions
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
