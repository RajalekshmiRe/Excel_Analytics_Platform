// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import mongoose from "mongoose";
// import cors from "cors";
// import authRoutes from "./routes/authRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import analysisRoutes from './routes/analysisRoutes.js';
// import adminRequestRoutes from './routes/adminRequests.js';
// import dashboardRoutes from './routes/dashboardRoutes.js'; // ✅ NEW

// dotenv.config();
// connectDB();

// const app = express();

// app.use(cors({ 
//   origin: "http://localhost:5173", 
//   credentials: true 
// }));
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/uploads", uploadRoutes);
// app.use('/api/analysis', analysisRoutes);
// app.use('/api/admin-requests', adminRequestRoutes);
// app.use('/api/dashboard', dashboardRoutes); // ✅ NEW - Dashboard routes

// // Root
// app.get("/", (req, res) => res.send("Excel Analytics API is running..."));

// // Error handling
// app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.error("❌ MongoDB error:", err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import adminRequestRoutes from "./routes/adminRequests.js";
import adminRoutes from "./routes/adminRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js"; // ← ADD THIS

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/datavisualizer")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/admin-requests", adminRequestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/superadmin", superAdminRoutes); // ← ADD THIS LINE

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});