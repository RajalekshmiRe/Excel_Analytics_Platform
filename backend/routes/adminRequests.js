import express from 'express';
import AdminRequest from '../models/AdminRequest.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';
import checkSuperAdmin from '../middleware/checkSuperAdmin.js';
import { logOperation } from "../middleware/logOperation.js";

const router = express.Router();

// @route   POST /api/admin-requests
// @desc    Submit admin access request
// @access  Private (authenticated users)
router.post('/', authMiddleware, logOperation("REQUEST_ADMIN_ACCESS"), async (req, res) => {
  try {
    const { reason } = req.body;
    const userId = req.user._id;

    // Validation
    if (!reason || reason.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason (minimum 20 characters)'
      });
    }

    // Check if user already has admin role
    const user = await User.findById(userId);
    if (user.role === 'admin' || user.role === 'superadmin') {
      return res.status(400).json({
        success: false,
        message: 'You already have admin privileges'
      });
    }

    // Check for existing pending request
    const existingRequest = await AdminRequest.findOne({
      userId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending admin request'
      });
    }

    // Create new request
    const adminRequest = new AdminRequest({
      userId,
      userName: user.name,
      userEmail: user.email,
      reason: reason.trim()
    });

    await adminRequest.save();

    res.status(201).json({
      success: true,
      message: 'Admin request submitted successfully',
      data: adminRequest
    });
  } catch (error) {
    console.error('Submit admin request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit admin request',
      error: error.message
    });
  }
});

// @route   GET /api/admin-requests/my-request
// @desc    Get current user's admin request status
// @access  Private
router.get('/my-request', authMiddleware, async (req, res) => {
  try {
    const request = await AdminRequest.findOne({
      userId: req.user._id,
      status: 'pending'
    }).sort({ requestedAt: -1 });

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get my request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request',
      error: error.message
    });
  }
});

// @route   GET /api/admin-requests
// @desc    Get all admin requests (for super admin)
// @access  Private (super admin only)
router.get('/', checkSuperAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await AdminRequest.find(query)
      .sort({ requestedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email')
      .populate('reviewedBy', 'name email');

    const total = await AdminRequest.countDocuments(query);

    res.json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get admin requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin requests',
      error: error.message
    });
  }
});

// @route   GET /api/admin-requests/stats
// @desc    Get admin request statistics
// @access  Private (super admin only)
router.get('/stats', checkSuperAdmin, async (req, res) => {
  try {
    const [pending, approved, rejected, total] = await Promise.all([
      AdminRequest.countDocuments({ status: 'pending' }),
      AdminRequest.countDocuments({ status: 'approved' }),
      AdminRequest.countDocuments({ status: 'rejected' }),
      AdminRequest.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        pending,
        approved,
        rejected,
        total
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// @route   PUT /api/admin-requests/:id/approve
// @desc    Approve admin request
// @access  Private (super admin only)
router.put('/:id/approve', checkSuperAdmin,  logOperation("APPROVED_ADMIN_ACCESS"), async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const request = await AdminRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been reviewed'
      });
    }

    // Update user role to admin
    await User.findByIdAndUpdate(request.userId, {
      role: 'admin'
    });

    // Update request status
    request.status = 'approved';
    request.reviewedAt = new Date();
    request.reviewedBy = req.user._id;
    request.reviewNotes = notes || '';
    await request.save();

    res.json({
      success: true,
      message: 'Admin request approved successfully',
      data: request
    });
  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve request',
      error: error.message
    });
  }
});

// @route   PUT /api/admin-requests/:id/reject
// @desc    Reject admin request
// @access  Private (super admin only)
router.put('/:id/reject', checkSuperAdmin, logOperation("REJECTED_ADMIN_ACCESS"), async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const request = await AdminRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been reviewed'
      });
    }

    // Update request status
    request.status = 'rejected';
    request.reviewedAt = new Date();
    request.reviewedBy = req.user._id;
    request.reviewNotes = notes || 'Request rejected';
    await request.save();

    res.json({
      success: true,
      message: 'Admin request rejected',
      data: request
    });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject request',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin-requests/:id
// @desc    Delete admin request
// @access  Private (super admin only)
router.delete('/:id', checkSuperAdmin, logOperation("DELETE_ADMIN_ACCESS"), async (req, res) => {
  try {
    const { id } = req.params;

    const request = await AdminRequest.findByIdAndDelete(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete request',
      error: error.message
    });
  }
});

export default router;