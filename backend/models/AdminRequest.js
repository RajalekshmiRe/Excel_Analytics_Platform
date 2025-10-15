import mongoose from 'mongoose';

const adminRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewDate: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

// Index for faster queries
adminRequestSchema.index({ status: 1 });
adminRequestSchema.index({ userId: 1 });
adminRequestSchema.index({ createdAt: -1 });

const AdminRequest = mongoose.model('AdminRequest', adminRequestSchema);

export default AdminRequest;