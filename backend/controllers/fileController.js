import axios from 'axios';
import fs from 'fs';
import path from 'path';
import mime from "mime-types";
import Upload from '../models/Upload.js';

// View file
export const viewFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    
    // Get file from MongoDB
    const file = await Upload.findById(fileId);
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Check if file exists on disk
    if (!fs.existsSync(file.filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }
    
    // Get file extension to determine content type
    const ext = path.extname(file.fileName).toLowerCase();
    const contentTypes = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.txt': 'text/plain',
      '.csv': 'text/csv'
    };
    
    // Set headers for viewing in browser
    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
    res.setHeader('Content-Disposition', 'inline'); // Use 'inline' to view in browser
    
    // Stream the file
    const fileStream = fs.createReadStream(file.filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('File stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error streaming file' });
      }
    });
    
  } catch (error) {
    console.error('View error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await Upload.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    console.log('📥 Download request:', {
      fileId,
      hasCloudUrl: !!file.cloudUrl,
      hasLocalPath: !!file.path
    });

    // ✅ 1️⃣ Prefer local file (old uploads)
    if (file.path && fs.existsSync(file.path)) {
      const mimeType = file.mimetype || mime.lookup(file.originalName) || 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${file.originalName}"`
      );

      return fs.createReadStream(file.path).pipe(res);
    }

    // ✅ 2️⃣ Stream from Cloudinary (THIS FIXES PREVIEW)
    if (file.cloudUrl) {
      const cloudResponse = await axios.get(file.cloudUrl, {
        responseType: 'arraybuffer'
      });

      res.setHeader(
        'Content-Type',
        file.mimetype || 'application/octet-stream'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${file.originalName}"`
      );

      return res.send(Buffer.from(cloudResponse.data));
    }

    return res.status(404).json({
      error: 'File content unavailable',
      message: 'Re-upload required'
    });

  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({ error: 'Server error while downloading' });
  }
};