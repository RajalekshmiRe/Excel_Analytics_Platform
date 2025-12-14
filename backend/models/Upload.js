import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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
      required: true
    },
   size: {
  type: Number,
  required: true,
  default: 0
},
    mimetype: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'processed', 'failed'],
      default: 'pending'
    },
    fileType: {
      type: String,
      enum: ['xlsx', 'xls', 'csv', 'other'],
      default: 'other'
    },
    rowCount: {
      type: Number,
      default: 0
    },
    columnCount: {
      type: Number,
      default: 0
    },
    headers: [String],
    metadata: {
      type: Map,
      of: String
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    chartCount: {
      type: Number,
      default: 0,
    },

  },
  
  { 
    timestamps: true 
  }
);

// Index for faster queries
uploadSchema.index({ userId: 1, createdAt: -1 });
uploadSchema.index({ status: 1 });

const Upload = mongoose.models.Upload || mongoose.model("Upload", uploadSchema);

export default Upload;