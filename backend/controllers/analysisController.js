import Upload from '../models/Upload.js';

// Get chart data for analytics
export const chartData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's uploads with file stats
    const uploads = await Upload.find({ userId }).sort({ createdAt: -1 });

    // Calculate statistics
    const totalUploads = uploads.length;
    const totalSize = uploads.reduce((sum, upload) => sum + (upload.size || 0), 0);
    
    // Format data for charts
    const uploadsByMonth = {};
    const uploadsByType = {};
    
    uploads.forEach(upload => {
      // Group by month - using createdAt instead of uploadDate
      const month = new Date(upload.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      uploadsByMonth[month] = (uploadsByMonth[month] || 0) + 1;
      
      // Group by file type - using originalName instead of fileName
      const ext = upload.originalName.split('.').pop().toUpperCase();
      uploadsByType[ext] = (uploadsByType[ext] || 0) + 1;
    });

    // Convert to array format for charts
    const monthlyData = Object.entries(uploadsByMonth).map(([month, count]) => ({
      month,
      uploads: count
    }));

    const typeData = Object.entries(uploadsByType).map(([type, count]) => ({
      type,
      count
    }));

    // Format recent uploads for frontend display
    const recentUploads = uploads.slice(0, 10).map(upload => ({
      fileName: upload.originalName,
      fileSize: upload.size,
      uploadDate: upload.createdAt
    }));

    res.json({
      success: true,
      data: {
        totalUploads,
        totalSize,
        monthlyData,
        typeData,
        recentUploads
      }
    });
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data',
      error: error.message
    });
  }
};

// Alternative name for the same function (for backward compatibility)
export const getAnalytics = chartData;