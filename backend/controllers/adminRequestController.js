import AdminRequest from '../models/AdminRequest.js';
import User from '../models/User.js';

// User submits a request
export const createAdminRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, reason, date, status } = req.body;

    // Prevent multiple pending requests
    const existing = await AdminRequest.findOne({ userId, status: 'pending' });
    if (existing)
      return res.status(400).json({ message: 'You already have a pending request' });

    const request = new AdminRequest({ userId, reason, date, status });
    await request.save();

    res.status(201).json({ message: 'Admin request submitted successfully', request });
  } catch (error) {
    console.error('Error creating admin request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin views all requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await AdminRequest.find()
      .populate('userId', 'name email role')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin views all requests
export const getUserRequests = async (req, res) => {
  try {

    const { userId } = req.params;

    const latestRequest = await AdminRequest.findOne({ userId }) // only one document
    .populate('userId', 'name email role')      // populate requester info
    .populate('reviewedBy', 'name email')      // populate reviewer info
    .sort({ createdAt: -1 })                   // get the newest request first
    .select('reason status rejectionReason createdAt reviewedBy'); // only needed fields

    if (!latestRequest) {
      return res.status(404).json({ message: 'No request found for this user.' });
    }
      
    res.json(latestRequest);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin reviews request (approve/reject)
export const reviewAdminRequest = async (req, res) => {
  try {
    const { id } = req.params; // request id
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await AdminRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'This request has already been reviewed' });
    }

    request.status = status;
    request.reviewDate = new Date();
    request.reviewedBy = req.user._id;
    request.rejectionReason = status === 'rejected' ? rejectionReason : undefined;

    await request.save();

    // If approved → update user role
    if (status === 'approved') {
      await User.findByIdAndUpdate(request.userId, { role: 'admin' });
    }

    res.json({ message: `Request ${status} successfully`, request });
  } catch (error) {
    console.error('Error reviewing request:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
