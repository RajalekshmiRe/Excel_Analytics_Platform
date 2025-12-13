import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Excel Analytics Platform'
  },
  maxFileSize: {
    type: Number,
    default: 15
  },
  allowedFormats: {
    type: [String],
    default: ['.xlsx', '.xls', '.csv', '.json']
  },
  chartExportFormats: {
    type: [String],
    default: ['.pdf', '.png', '.svg', 'jpg']
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  storageLimit: {
    type: Number,
    default: 100
  },
  autoApproveAdmins: {
    type: Boolean,
    default: false
  },
  dataMapEnabled: {
    type: Boolean,
    default: true
  },
  autoAnalytics : {
    type: Boolean,
    default: true
  },
  requireAdminApproval: {
    type: Boolean,
    default: true
  },
  maxAdmins: {
    type: Number,
    default: 10
  },
  sessionTimeout: {
    type: Number,
    default: 30
  }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;