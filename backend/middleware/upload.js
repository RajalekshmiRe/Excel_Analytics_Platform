// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Create uploads directory if it doesn't exist
// const uploadDir = "./uploads";
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     // Create unique filename: timestamp-randomstring-originalname
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     const nameWithoutExt = path.basename(file.originalname, ext);
//     cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
//   }
// });

// // File filter - only allow Excel and CSV files
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     "application/vnd.ms-excel", // .xls
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
//     "text/csv", // .csv
//   ];

//   const ext = path.extname(file.originalname).toLowerCase();
//   const allowedExtensions = [".xls", ".xlsx", ".csv"];

//   if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only Excel (.xlsx, .xls) and CSV files are allowed"), false);
//   }
// };

// // Configure multer
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 15 * 1024 * 1024, // 15MB limit
//   }
// });

// export default upload;


import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [".csv", ".xlsx", ".xls"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only CSV, XLS, and XLSX files are allowed."), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

export default upload;