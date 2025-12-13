import 'dotenv/config';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';

const seedSuperAdmin = async () => {
  await connectDB(process.env.MONGO_URI);

  const exists = await User.findOne({ email: "super@admin.com" });
  if (exists) {
    console.log("Super admin already exists:", exists.email);
    process.exit(0);
  }

const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const user = await User.create({
    name: "Super Admin",
    email: "super@admin.com",
    password: hashedPassword,
    // password: "Admin@123",
    role: "SUPER_ADMIN"
  });

  console.log("✅ Super admin seeded:", user.email);
  process.exit(0);
};

seedSuperAdmin();
