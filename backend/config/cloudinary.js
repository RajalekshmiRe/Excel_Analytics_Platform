// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // ✅ Smart environment detection
// const isProduction = process.env.NODE_ENV === 'production';
// const hasCloudinaryCredentials = !!(
//   process.env.CLOUDINARY_CLOUD_NAME && 
//   process.env.CLOUDINARY_API_KEY && 
//   process.env.CLOUDINARY_API_SECRET
// );

// // ✅ Only use Cloudinary if credentials exist AND in production
// const useCloudinary = isProduction && hasCloudinaryCredentials;

// // ✅ Configure Cloudinary (only if credentials exist)
// if (hasCloudinaryCredentials) {
//   cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
//   });
//   console.log('✅ Cloudinary configured successfully');
// } else {
//   console.log('⚠️ Cloudinary credentials missing - using local storage');
// }

// // ✅ Ensure uploads directory exists
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log('📁 Created uploads directory');
// }

// // ✅ Cloudinary Storage for Excel/CSV files (PRODUCTION)
// const excelCloudinaryStorage = hasCloudinaryCredentials ? new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'excel-analytics-platform',
//     allowed_formats: ['csv', 'xlsx', 'xls'],
//     resource_type: 'raw',
//     public_id: (req, file) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       return `file-${uniqueSuffix}`;
//     }
//   }
// }) : null;

// // ✅ Local Storage for Development
// const excelLocalStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, 'file-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// // ✅ File filter for Excel/CSV files only
// const excelFileFilter = (req, file, cb) => {
//   const allowedTypes = [
//     'application/vnd.ms-excel', 
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
//     'text/csv'
//   ];
//   const allowedExtensions = /xlsx|xls|csv/;
//   const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  
//   if (allowedTypes.includes(file.mimetype) || extname) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only Excel and CSV files are allowed!'), false);
//   }
// };

// // ✅ Export multer upload instance - choose storage based on availability
// export const uploadExcel = multer({
//   storage: useCloudinary ? excelCloudinaryStorage : excelLocalStorage,
//   fileFilter: excelFileFilter,
//   limits: {
//     fileSize: 50 * 1024 * 1024 // 50MB limit
//   }
// });

// // ✅ Helper function to delete file from Cloudinary
// export const deleteFromCloudinary = async (publicId) => {
//   if (!hasCloudinaryCredentials) {
//     console.log('⚠️ Cloudinary not configured, skipping delete');
//     return { result: 'skipped' };
//   }

//   try {
//     const result = await cloudinary.uploader.destroy(publicId, {
//       resource_type: 'raw'
//     });
//     console.log('🗑️ Deleted from Cloudinary:', publicId, result);
//     return result;
//   } catch (error) {
//     console.error('❌ Error deleting from Cloudinary:', error);
//     throw error;
//   }
// };

// // ✅ Helper to extract public_id from Cloudinary URL
// export const getPublicIdFromUrl = (url) => {
//   if (!url) return null;
  
//   try {
//     const urlParts = url.split('/');
//     const uploadIndex = urlParts.indexOf('upload');
    
//     if (uploadIndex === -1) return null;
    
//     const pathParts = urlParts.slice(uploadIndex + 2);
//     const publicIdWithExt = pathParts.join('/');
//     const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
    
//     return publicId;
//   } catch (error) {
//     console.error('Error extracting public_id:', error);
//     return null;
//   }
// };

// // ✅ Helper to check if using cloud storage
// export const isCloudStorage = () => useCloudinary;

// // ✅ Export cloudinary instance
// export { cloudinary };

// // ✅ Startup logs
// console.log('\n📦 Excel Analytics Storage Configuration:');
// console.log('  - NODE_ENV:', process.env.NODE_ENV || 'not set');
// console.log('  - Is Production:', isProduction);
// console.log('  - Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing');
// console.log('  - Cloudinary API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Missing');
// console.log('  - Cloudinary API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Missing');
// console.log('  - Using Storage:', useCloudinary ? '☁️ CLOUDINARY' : '💾 LOCAL');
// console.log('  - Storage folder:', useCloudinary ? 'excel-analytics-platform/' : 'uploads/');
// console.log('');
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Check if Cloudinary credentials exist
const hasCloudinaryCredentials = () => !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// ✅ FIXED: Configure Cloudinary immediately if credentials exist
if (hasCloudinaryCredentials()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured immediately:', process.env.CLOUDINARY_CLOUD_NAME);
} else {
  console.log('⚠️ Cloudinary credentials not found - using local storage');
}

// Local uploads folder for development
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ FIXED: Create storage instances ONCE at module load
let cloudinaryStorage = null;
let localStorage = null;

if (hasCloudinaryCredentials()) {
  console.log('📦 Creating Cloudinary storage instance...');
  cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'excel-analytics-platform',
      resource_type: 'raw',
      allowed_formats: ['csv', 'xls', 'xlsx'],
      use_filename: true,
      unique_filename: true
    }
  });
  console.log('✅ Cloudinary storage created');
} else {
  console.log('📦 Creating local disk storage instance...');
  localStorage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadDir),
    filename: (_, file, cb) =>
      cb(null, 'file-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
  });
  console.log('✅ Local storage created');
}

// File filter for Excel/CSV
const excelFileFilter = (_, file, cb) => {
  const allowed = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/octet-stream'
  ];
  const ext = /xlsx|xls|csv/.test(path.extname(file.originalname).toLowerCase());
  cb(null, allowed.includes(file.mimetype) || ext);
};

// ✅ FIXED: Use pre-created storage instances
export const uploadExcel = multer({
  storage: cloudinaryStorage || localStorage,
  fileFilter: excelFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Direct Cloudinary upload
export const uploadCloudinary = async (filePathOrBuffer, options = {}) => {
  if (!hasCloudinaryCredentials()) {
    throw new Error('Cloudinary credentials not configured');
  }

  return cloudinary.uploader.upload(filePathOrBuffer, {
    resource_type: 'raw',
    folder: options.folder || 'excel-analytics-platform',
    use_filename: options.use_filename !== false,
    unique_filename: options.unique_filename !== false
  });
};

// Delete helper
export const deleteFromCloudinary = async (publicId) => {
  if (!hasCloudinaryCredentials()) return { result: 'skipped' };
  return cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
};

// Public ID extractor
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split('/');
    const idx = parts.indexOf('upload');
    if (idx === -1) return null;
    return parts.slice(idx + 2).join('/').replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
};

// Check if using cloud storage
export const isCloudStorage = () => hasCloudinaryCredentials();

// Export cloudinary instance
export { cloudinary };

// Initialization function (for logging only, config already done above)
export const initializeCloudinary = () => {
  console.log('\n📦 Cloudinary Status Check:');
  console.log('  - NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('  - Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || '❌ Not set');
  console.log('  - API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('  - API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Not set');
  console.log('  - Credentials:', hasCloudinaryCredentials() ? '✅ Available' : '❌ Missing');
  console.log('  - Storage Mode:', hasCloudinaryCredentials() ? 'Cloudinary ☁️' : 'Local Disk 💾');
  console.log('');
};