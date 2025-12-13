// import Upload from "../models/Upload.js";

// // Saving uploaded file
// const uploadExcel = async (req, res) => {
//   const { userId, filename, sheetName, data } = req.body;
//   try {
//     const newUpload = await ExcelData.create({
//       user: userId,
//       filename,
//       sheetName,
//       data,
//     });
//     res.status(201).json(newUpload);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Fetch user upload history
// const getUploadHistory = async (req, res) => {
//   try {
//     const uploads = await ExcelData.find({ user: req.user._id }).sort({ createdAt: -1 });
//     res.json(uploads);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export { uploadExcel, getUploadHistory };
import Upload from '../models/Upload.js';

// Existing chart data endpoint
export const chartData = async (req, res) => { 
    try { 
        const { uploadId, xColumn, yColumn, agg = 'sum' } = req.body;
        if (!uploadId || !xColumn) return res.status(400).json({ message: 'Missing params' }); 
        
        const upload = await Upload.findById(uploadId);
        if (!upload) return res.status(404).json({ message: 'Upload not found' }); 
        
        const rows = upload.data || []; 
        const grouped = {};
        
        rows.forEach(row => {
            const x = row[xColumn];
            if (x === null || x === undefined) return;
            
            if (agg === 'count') { 
                grouped[x] = (grouped[x] || 0) + 1;
            } else { 
                const y = Number(row[yColumn]);
                if (isNaN(y)) return;
                if (!grouped[x]) grouped[x] = { sum: 0, count: 0 };
                grouped[x].sum += y; 
                grouped[x].count += 1;
            }
        });
        
        const labels = Object.keys(grouped).sort((a,b) => (''+a).localeCompare(b));
        const values = labels.map(l => { 
            if (agg === 'count') return grouped[l]; 
            if (agg === 'avg') return grouped[l].sum / grouped[l].count;
            return grouped[l].sum;
        });
        
        res.json({ labels, values }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message }); 
    } 
};

// NEW: Analytics dashboard endpoint
export const getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;
        const { range = '7days' } = req.query;
        
        // Calculate date range
        let dateFilter = {};
        const now = new Date();
        
        if (range === '7days') {
            dateFilter = { uploadedAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        } else if (range === '30days') {
            dateFilter = { uploadedAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        } else if (range === '90days') {
            dateFilter = { uploadedAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } };
        }
        
        // Get all user uploads
        const uploads = await Upload.find({ userId, ...dateFilter }).sort({ uploadedAt: -1 });
        
        // Calculate total storage
        const totalStorage = uploads.reduce((sum, upload) => sum + (upload.size || 0), 0);
        const totalStorageMB = (totalStorage / (1024 * 1024)).toFixed(2);
        
        // Get file type distribution
        const fileTypes = {};
        uploads.forEach(upload => {
            const ext = upload.filename.split('.').pop().toUpperCase();
            fileTypes[ext] = (fileTypes[ext] || 0) + 1;
        });
        
        const fileTypesArray = Object.keys(fileTypes).map(key => ({
            name: key,
            value: fileTypes[key]
        }));
        
        // Calculate upload trend (last 7 days)
        const last7Days = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dayStart = new Date(date.setHours(0, 0, 0, 0));
            const dayEnd = new Date(date.setHours(23, 59, 59, 999));
            
            const count = uploads.filter(upload => {
                const uploadDate = new Date(upload.uploadedAt);
                return uploadDate >= dayStart && uploadDate <= dayEnd;
            }).length;
            
            last7Days.push({
                date: dayNames[date.getDay()],
                uploads: count
            });
        }
        
        // Calculate storage usage over time (last 4 weeks)
        const storageOverTime = [];
        for (let i = 3; i >= 0; i--) {
            const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
            const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
            
            const weekUploads = uploads.filter(upload => {
                const uploadDate = new Date(upload.uploadedAt);
                return uploadDate >= weekStart && uploadDate <= weekEnd;
            });
            
            const weekStorage = weekUploads.reduce((sum, upload) => sum + (upload.size || 0), 0);
            
            storageOverTime.push({
                date: `Week ${4 - i}`,
                storage: Math.round(weekStorage / (1024 * 1024))
            });
        }
        
        // Get recent activity
        const recentActivity = uploads.slice(0, 5).map(upload => ({
            action: `Uploaded ${upload.filename}`,
            time: getTimeAgo(upload.uploadedAt),
            status: upload.status || 'success'
        }));
        
        // Get top files (most recent)
        const topFiles = uploads.slice(0, 5).map(upload => ({
            name: upload.filename,
            views: Math.floor(Math.random() * 50) + 1, // Mock views for now
            size: formatFileSize(upload.size)
        }));
        
        // Calculate trends (compare with previous period)
        const previousPeriodStart = range === '7days' ? 14 : range === '30days' ? 60 : 180;
        const previousUploads = await Upload.find({
            userId,
            uploadedAt: {
                $gte: new Date(now.getTime() - previousPeriodStart * 24 * 60 * 60 * 1000),
                $lt: dateFilter.uploadedAt?.$gte || new Date(0)
            }
        });
        
        const uploadsTrend = calculateTrend(uploads.length, previousUploads.length);
        const storageTrend = calculateTrend(totalStorage, previousUploads.reduce((sum, u) => sum + (u.size || 0), 0));
        
        // Build response
        const analytics = {
            overview: {
                totalUploads: uploads.length,
                totalStorage: `${totalStorageMB} MB`,
                totalCharts: 0, // You can track this separately if needed
                totalReports: 0, // You can track this separately if needed
                uploadsTrend,
                storageTrend,
                chartsTrend: 0,
                reportsTrend: 0
            },
            uploadTrend: last7Days,
            fileTypes: fileTypesArray,
            storageUsage: storageOverTime,
            recentActivity,
            topFiles
        };
        
        res.json(analytics);
        
    } catch (err) {
        console.error('Analytics error:', err);
        res.status(500).json({ message: err.message });
    }
};

// Helper functions
function formatFileSize(bytes) {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
}

function calculateTrend(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
}