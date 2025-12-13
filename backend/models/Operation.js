// models/Operation.js
import mongoose from "mongoose";

const operationSchema = new mongoose.Schema({
  type: String,             // e.g., "UPLOAD_FILE", "LOGIN", "GET_USER"
  status: {                 // success or fail
    type: String,
    enum: ["success", "fail"],
    required: true
  },
  userId: {                 // optional, track which user triggered
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  details: String,          // optional, extra info
  createdAt: { type: Date, default: Date.now }
});

const Operation = mongoose.models.Operation || mongoose.model("Operation", operationSchema);
export default Operation;
