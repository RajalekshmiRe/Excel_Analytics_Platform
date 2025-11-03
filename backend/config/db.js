import mongoose from "mongoose";

export default async function connectDB(uri) {
  try {
    await mongoose.connect("mongodb+srv://Raja123:72003@cluster0.o20s8fb.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("Mongo error:", err.message);
    process.exit(1);
  }
}
