import User from "../models/User.js";
import Upload from "../models/Upload.js";
import Settings from '../models/Settings.js';
import AdminRequest from '../models/AdminRequest.js';
import AuditLog from '../models/AuditLog.js';

// Get SuperAdmin Dashboard Stats
export const getSuperAdminStats = async (req, res) => {
  try {
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalUsers = await User.countDocuments();
    const pendingRequests = await AdminRequest.countDocuments({ status: 'pending' });
    const approvedRequests = await AdminRequest.countDocuments({ status: 'approved' });
    const rejectedRequests = await AdminRequest.countDocuments({ status: 'rejected' });

    res.json({
      success: true,
      data: {
        totalAdmins,
        pendingRequests,
        totalUsers,
        approvedRequests,
        rejectedRequests
      }
    });
  } catch (error) {
    console.error('Error fetching superadmin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

// Get all users (excluding superadmins)
export const getAllUsers = async (req, res) => {
  try {
    // ✅ FIXED: Only get regular users, exclude superadmins
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    const formattedUsers = await Promise.all(
      users.map(async (user) => {
        const uploadCount = await Upload.countDocuments({ userId: user._id });
        
        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status || 'Active',
          joinDate: user.createdAt,
          lastActive: user.updatedAt,
          uploads: uploadCount
        };
      })
    );

    res.json({
      success: true,
      users: formattedUsers,
      total: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get all admin requests
export const getAdminRequests = async (req, res) => {
  try {
    const requests = await AdminRequest.find()
      .populate('userId', 'name email createdAt')
      .sort({ createdAt: -1 });

    const formattedRequests = await Promise.all(
      requests.map(async (request) => {
        const uploadCount = await Upload.countDocuments({ userId: request.userId._id });

        return {
          id: request._id,
          userId: request.userId._id,
          userName: request.userId.name,
          userEmail: request.userId.email,
          requestDate: request.createdAt,
          reason: request.reason,
          status: request.status,
          uploads: uploadCount,
          joinDate: request.userId.createdAt,
          reviewDate: request.reviewDate,
          rejectionReason: request.rejectionReason
        };
      })
    );

    res.json({
      success: true,
      requests: formattedRequests,
      total: requests.length
    });
  } catch (error) {
    console.error('Error fetching admin requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin requests',
      error: error.message
    });
  }
};

// Approve admin request
export const approveAdminRequest = async (req, res) => {
  try {
    const request = await AdminRequest.findById(req.params.id).populate('userId', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Update user role to admin
    await User.findByIdAndUpdate(request.userId._id, { role: 'admin' });

    // Update request status
    request.status = 'approved';
    request.reviewDate = new Date();
    request.reviewedBy = req.user._id;
    await request.save();

    // Create audit log
    await AuditLog.create({
      action: 'Admin Request Approved',
      user: req.user._id,
      userName: req.user.name,
      target: request.userId._id,
      targetName: request.userId.name,
      type: 'approval',
      details: `Approved admin access request for ${request.userId.name}`,
      ipAddress: req.ip || req.connection.remoteAddress || 'Unknown'
    });

    res.json({
      success: true,
      message: 'Admin request approved successfully'
    });
  } catch (error) {
    console.error('Error approving admin request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve request',
      error: error.message
    });
  }
};

// Reject admin request
export const rejectAdminRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const request = await AdminRequest.findById(req.params.id).populate('userId', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    request.status = 'rejected';
    request.reviewDate = new Date();
    request.reviewedBy = req.user._id;
    request.rejectionReason = reason || 'No reason provided';
    await request.save();

    // Create audit log
    await AuditLog.create({
      action: 'Admin Request Rejected',
      user: req.user._id,
      userName: req.user.name,
      target: request.userId._id,
      targetName: request.userId.name,
      type: 'rejection',
      details: `Rejected admin request for ${request.userId.name}. Reason: ${reason}`,
      ipAddress: req.ip || req.connection.remoteAddress || 'Unknown'
    });

    res.json({
      success: true,
      message: 'Admin request rejected'
    });
  } catch (error) {
    console.error('Error rejecting admin request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject request',
      error: error.message
    });
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' })
      .select('-password')
      .sort({ createdAt: -1 });

    const formattedAdmins = admins.map(admin => ({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status || 'Active',
      approvedDate: admin.createdAt,
      lastActive: admin.updatedAt,
      permissions: admin.permissions || ['View Analytics', 'Manage Users', 'View Reports']
    }));

    res.json({
      success: true,
      admins: formattedAdmins,
      total: admins.length
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admins',
      error: error.message
    });
  }
};

// Revoke admin access
export const revokeAdminAccess = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (admin.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot revoke superadmin access'
      });
    }

    admin.role = 'user';
    await admin.save();

    // Create audit log
    await AuditLog.create({
      action: 'Admin Access Revoked',
      user: req.user._id,
      userName: req.user.name,
      target: admin._id,
      targetName: admin.name,
      type: 'revocation',
      details: `Revoked admin privileges from ${admin.name}`,
      ipAddress: req.ip || req.connection.remoteAddress || 'Unknown'
    });

    res.json({
      success: true,
      message: 'Admin access revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking admin access:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke access',
      error: error.message
    });
  }
};

// Toggle admin status
export const toggleAdminStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const admin = await User.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (admin.role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify superadmin status'
      });
    }

    admin.status = status;
    await admin.save();

    // Create audit log
    await AuditLog.create({
      action: `Admin Status Changed to ${status}`,
      user: req.user._id,
      userName: req.user.name,
      target: admin._id,
      targetName: admin.name,
      type: 'status-change',
      details: `Changed ${admin.name}'s status to ${status}`,
      ipAddress: req.ip || req.connection.remoteAddress || 'Unknown'
    });

    res.json({
      success: true,
      message: `Admin status changed to ${status}`,
      status: admin.status
    });
  } catch (error) {
    console.error('Error toggling admin status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
};

// Get audit logs
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('user', 'name')
      .populate('target', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    const formattedLogs = logs.map(log => ({
      id: log._id,
      action: log.action,
      user: log.userName || log.user?.name || 'System',
      target: log.targetName || log.target?.name || 'System',
      timestamp: log.createdAt,
      type: log.type,
      details: log.details,
      ipAddress: log.ipAddress || 'Unknown'
    }));

    res.json({
      success: true,
      logs: formattedLogs,
      total: logs.length
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message
    });
  }
};

// Get recent activity for dashboard
export const getRecentActivity = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const activities = logs.map(log => ({
      id: log._id,
      type: log.type || 'admin',
      message: log.action || log.details,
      time: getTimeAgo(log.createdAt)
    }));

    res.json({
      success: true,
      activities
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity',
      error: error.message
    });
  }
};

// Get settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        siteName: 'Admin Dashboard',
        maxUploadSize: 10485760, // 10MB
        allowedFileTypes: ['.pdf', '.doc', '.docx', '.txt'],
        maintenanceMode: false,
        emailNotifications: true
      });
    }

    res.json({
      success: true,
      settings
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
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        req.body,
        { new: true, runValidators: true }
      );
    }

    // Create audit log
    await AuditLog.create({
      action: 'Settings Updated',
      user: req.user._id,
      userName: req.user.name,
      type: 'settings',
      details: 'System settings were updated',
      ipAddress: req.ip || req.connection.remoteAddress || 'Unknown'
    });

    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings
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



// Helper function
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}