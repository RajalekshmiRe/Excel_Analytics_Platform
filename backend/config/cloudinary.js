import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';

// ✅ Configure Cloudinary (SAME credentials as Blogsphere)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Cloudinary Storage for Excel/CSV files (PRODUCTION)
const excelCloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'excel-analytics-platform',  // ⚠️ DIFFERENT from Blogsphere!
    allowed_formats: ['csv', 'xlsx', 'xls'],
    resource_type: 'raw',  // ⚠️ Important: 'raw' for non-image files!
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `file-${uniqueSuffix}`;
    }
  }
});

// ✅ Local Storage for Development
const excelLocalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'file-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// ✅ File filter for Excel/CSV files only
const excelFileFilter = (req, file, cb) => {
  const allowedTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
  const allowedExtensions = /xlsx|xls|csv/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  
  if (allowedTypes.includes(file.mimetype) || extname) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel and CSV files are allowed!'), false);
  }
};

// ✅ Choose storage based on environment
const isProduction = process.env.NODE_ENV === 'production';

// ✅ Export multer upload instance
export const uploadExcel = multer({
  storage: isProduction ? excelCloudinaryStorage : excelLocalStorage,
  fileFilter: excelFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for Excel files
  }
});

// ✅ Helper function to delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'  // Important for non-image files!
    });
    console.log('🗑️ Deleted from Cloudinary:', publicId, result);
    return result;
  } catch (error) {
    console.error('❌ Error deleting from Cloudinary:', error);
    throw error;
  }
};

// ✅ Helper to extract public_id from Cloudinary URL
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  
  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) return null;
    
    // Get everything after /upload/v1234567890/
    const pathParts = urlParts.slice(uploadIndex + 2);
    
    // Remove file extension
    const publicIdWithExt = pathParts.join('/');
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
};

// ✅ Helper to check if using cloud storage
export const isCloudStorage = () => process.env.NODE_ENV === 'production';

// ✅ Export cloudinary instance
export { cloudinary };

console.log(`📦 Excel Analytics Storage Mode: ${isProduction ? 'CLOUDINARY (Production)' : 'LOCAL (Development)'}`);
console.log(`📁 Cloudinary folder: excel-analytics-platform/`);