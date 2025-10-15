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
// import mongoose from "mongoose";

// export default async function connectDB() {
//   const password = encodeURIComponent("72003"); // Atlas password
//   const uri = `mongodb+srv://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@cluster0.o20s8fb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


//   try {
//     await mongoose.connect(uri);
//     console.log("✅ MongoDB connected");
//   } catch (err) {
//     console.error("MongoDB connection error:", err.message);
//     process.exit(1);
//   }
// }
