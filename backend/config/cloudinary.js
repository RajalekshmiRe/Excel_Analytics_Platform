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

let isConfigured = false;

// Configure Cloudinary only when explicitly called
const configureCloudinary = () => {
  if (isConfigured) return;

  const hasCredentials = !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (hasCredentials) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }

  isConfigured = true;
};

// Check if Cloudinary credentials exist
const hasCloudinaryCredentials = () => !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// Local uploads folder for development
const uploadDir = 'uploads/';
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cloudinary storage for production
const getCloudinaryStorage = () =>
  hasCloudinaryCredentials()
    ? new CloudinaryStorage({
        cloudinary,
        params: {
          folder: 'excel-analytics-platform',
          resource_type: 'raw',
          use_filename: true,
          unique_filename: true,
          public_id: () => `file-${Date.now()}-${Math.round(Math.random() * 1e9)}`
        }
      })
    : null;

// Local disk storage fallback
const excelLocalStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) =>
    cb(null, 'file-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
});

// File filter for Excel/CSV
const excelFileFilter = (_, file, cb) => {
  const allowed = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ];
  const ext = /xlsx|xls|csv/.test(path.extname(file.originalname).toLowerCase());
  cb(null, allowed.includes(file.mimetype) || ext);
};

// Multer upload factory
export const getUploadExcel = () => {
  configureCloudinary();
  const storage =
    process.env.NODE_ENV === 'production'
      ? getCloudinaryStorage()
      : hasCloudinaryCredentials()
      ? getCloudinaryStorage()
      : excelLocalStorage;

  return multer({ storage, fileFilter: excelFileFilter, limits: { fileSize: 50 * 1024 * 1024 } });
};

// Backward compatible wrapper
export const uploadExcel = {
  single: (...args) => getUploadExcel().single(...args),
  array: (...args) => getUploadExcel().array(...args),
  fields: (...args) => getUploadExcel().fields(...args)
};

// Direct Cloudinary upload
export const uploadCloudinary = async (filePathOrBuffer, options = {}) => {
  configureCloudinary();
  if (!hasCloudinaryCredentials()) throw new Error('Cloudinary credentials not configured');

  return cloudinary.uploader.upload(filePathOrBuffer, {
    resource_type: 'raw',
    folder: options.folder || 'excel-analytics-platform',
    use_filename: options.use_filename !== false,
    unique_filename: options.unique_filename !== false
  });
};

// Delete helper
export const deleteFromCloudinary = async (publicId) => {
  configureCloudinary();
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

// Check if using cloud storage - SMART DETECTION
export const isCloudStorage = () => {
  configureCloudinary();
  
  // ✅ Always use Cloudinary if credentials are available
  // This works for BOTH local and production
  const hasCredentials = hasCloudinaryCredentials();
  
  console.log('🔍 Storage mode:', hasCredentials ? 'Cloudinary' : 'Local');
  
  return hasCredentials;
};
// Exports
export { cloudinary };
export const initializeCloudinary = () => {
  configureCloudinary();
  console.log('\n📦 Cloudinary initialized successfully');
  console.log('  - NODE_ENV:', process.env.NODE_ENV);
  console.log('  - Cloudinary:', hasCloudinaryCredentials() ? '✅ Configured' : '❌ Missing credentials');
};
