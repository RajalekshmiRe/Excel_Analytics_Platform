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

// Download file
export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    // 🧩 Step 1: Validate file record in database
    const file = await Upload.findById(fileId);
    if (!file) {
      return res.status(404).json({ error: "File not found in database" });
    }

    // 🧩 Step 2: Define and resolve upload directory
    const uploadsDir = path.resolve("./uploads");

    // 🧩 Step 3: Resolve full path safely
    const filePath = path.isAbsolute(file.path)
      ? file.path
      : path.join(uploadsDir, path.basename(file.path));

    // 🧩 Step 4: Security check — prevent directory traversal
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(403).json({ error: "Access denied: Invalid file path" });
    }

    // 🧩 Step 5: Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found on server" });
    }

    // 🧩 Step 6: Get file stats
    let stats;
    try {
      stats = fs.statSync(filePath);
    } catch (err) {
      console.error("Stat error:", err);
      return res.status(500).json({ error: "Unable to read file metadata" });
    }

    // 🧩 Step 7: Detect MIME type properly
    const mimeType =
      file.mimetype ||
      mime.lookup(file.filename || filePath) ||
      "application/octet-stream";

    // 🧩 Step 8: Determine download filename
    const safeFilename =
      file.originalname ||
      file.filename ||
      path.basename(filePath) ||
      `file_${fileId}`;

    // 🧩 Step 9: Set headers before streaming
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Length", stats.size);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(safeFilename)}"`
    );

    // 🧩 Step 10: Create and pipe the stream
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // 🧩 Step 11: Handle stream errors gracefully
    fileStream.on("error", (err) => {
      console.error("File stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error reading file stream" });
      } else {
        res.end();
      }
    });

    // 🧩 Step 12: Clean up on client disconnect
    req.on("close", () => {
      fileStream.destroy();
    });
  } catch (error) {
    console.error("Download error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Server error while processing download" });
    } else {
      res.end();
    }
  }
};
