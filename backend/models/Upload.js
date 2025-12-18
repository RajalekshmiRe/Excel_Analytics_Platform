// backend/models/Upload.js
import mongoose from 'mongoose';

const uploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    filename: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: false // Optional - used for local storage
    },
    size: {
      type: Number,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },

    // ✅ Cloudinary fields
    cloudUrl: {
      type: String,
      required: false,
      default: null
    },
    cloudPublicId: {
      type: String,
      required: false,
      default: null
    },

    status: {
      type: String,
      enum: ['pending', 'processing', 'processed', 'failed'],
      default: 'pending'
    },

    // ✅ Analytics tracking (FIX)
    chartCount: {
      type: Number,
      default: 0
    },
    reportCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// ✅ Index for faster queries
uploadSchema.index({ userId: 1, createdAt: -1 });

// ✅ Virtual field to check if file is available
uploadSchema.virtual('fileAvailable').get(function () {
  return !!(this.cloudUrl || this.path);
});

// ✅ Ensure virtuals are included in JSON
uploadSchema.set('toJSON', { virtuals: true });
uploadSchema.set('toObject', { virtuals: true });

const Upload = mongoose.model('Upload', uploadSchema);

export default Upload;
