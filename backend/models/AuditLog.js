import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: {
    type: String,
    required: true
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  targetName: {
    type: String,
    default: 'System'
  },
  type: {
    type: String,
    required: true,
    enum: ['approval', 'rejection', 'revocation', 'deletion', 'login', 'admin-login', 'upload', 'settings', 'status-change', 'user', 'admin']
  },
  details: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    default: 'Unknown'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ type: 1 });
auditLogSchema.index({ user: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;