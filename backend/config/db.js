import mongoose from "mongoose";

export default async function connectDB(uri) {
  try {
    // Use the uri parameter (which comes from process.env.MONGO_URI)
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("Mongo error:", err.message);
    process.exit(1);
  }
}