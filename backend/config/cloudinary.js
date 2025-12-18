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

// ✅ Configure Cloudinary immediately if credentials exist
if (hasCloudinaryCredentials()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('✅ Cloudinary configured:', process.env.CLOUDINARY_CLOUD_NAME);
} else {
  console.log('⚠️ Cloudinary credentials not found - using local storage');
}

// Local uploads folder for development
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Create storage instances ONCE at module load
let cloudinaryStorage = null;
let localStorageEngine = null;

if (hasCloudinaryCredentials()) {
  console.log('📦 Creating Cloudinary storage...');
  
  cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      // ✅ CRITICAL: This must be a FUNCTION that returns params
      const ext = path.extname(file.originalname).substring(1) || 'csv';
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      console.log('☁️ Cloudinary upload params:', {
        originalname: file.originalname,
        ext,
        uniqueId
      });
      
      return {
        folder: 'excel-analytics-platform',
        resource_type: 'raw', // Critical for non-image files
        format: ext,
        public_id: `file-${uniqueId}`,
        use_filename: false, // Use our custom public_id instead
        unique_filename: false // We're already making it unique
      };
    }
  });
  
  console.log('✅ Cloudinary storage created');
} else {
  console.log('📦 Creating local disk storage...');
  
  localStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `file-${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  });
  
  console.log('✅ Local storage created');
}

// ✅ File filter - Accept files based on extension only
const excelFileFilter = (req, file, cb) => {
  console.log('📄 File filter:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  const ext = path.extname(file.originalname).toLowerCase();
  
  if (['.csv', '.xls', '.xlsx'].includes(ext)) {
    console.log('✅ File accepted:', ext);
    return cb(null, true);
  }
  
  console.log('❌ File rejected:', ext);
  const error = new Error(`Invalid file type. Only CSV, XLS, and XLSX files allowed. Got: ${ext}`);
  error.code = 'INVALID_FILE_TYPE';
  return cb(error, false);
};

// ✅ Create multer instance with proper storage
export const uploadExcel = multer({
  storage: cloudinaryStorage || localStorageEngine,
  fileFilter: excelFileFilter,
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 1
  }
});

// Direct Cloudinary upload (for programmatic uploads)
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

// Delete from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  if (!hasCloudinaryCredentials()) {
    console.log('⚠️ Skipping Cloudinary delete (no credentials)');
    return { result: 'skipped' };
  }
  
  try {
    const result = await cloudinary.uploader.destroy(publicId, { 
      resource_type: 'raw' 
    });
    console.log('✅ Deleted from Cloudinary:', publicId);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    throw error;
  }
};

// Extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    // Get everything after 'upload' and version number
    const pathParts = parts.slice(uploadIndex + 2);
    const publicIdWithExt = pathParts.join('/');
    
    // Remove file extension
    return publicIdWithExt.replace(/\.[^/.]+$/, '');
  } catch (error) {
    console.error('Error extracting public ID:', error);
    return null;
  }
};

// Check if using cloud storage
export const isCloudStorage = () => hasCloudinaryCredentials();

// Export cloudinary instance
export { cloudinary };

// Initialization logging
export const initializeCloudinary = () => {
  console.log('\n📦 Storage Configuration:');
  console.log('  - Environment:', process.env.NODE_ENV || 'development');
  console.log('  - Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || '❌ Not set');
  console.log('  - API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Not set');
  console.log('  - API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Not set');
  console.log('  - Storage Mode:', hasCloudinaryCredentials() ? '☁️  Cloudinary' : '💾 Local Disk');
  console.log('');
};