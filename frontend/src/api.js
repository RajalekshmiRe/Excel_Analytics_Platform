import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';
const API_URL = import.meta.env.VITE_API_URL || 'https://excel-analytics-backend-buq3.onrender.com/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Adding token to request:', config.url);
    } else {
      console.warn('⚠️ No token found for request:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      console.error('🚫 Authentication failed - clearing tokens and redirecting');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('superAdminToken');
      localStorage.removeItem('adminToken');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    // For 403 errors, handle gracefully (don’t logout)
    else if (error.response?.status === 403) {
      console.warn('⚠️ Forbidden: Access denied to resource');
      // Optionally show a toast or alert
      // alert('You do not have permission to perform this action.');
    } 
    // For file-related or 404 errors, just notify
    else if (error.response?.status === 404) {
      console.warn('📁 Resource not found:', url);
      // alert('Requested file not found.');
    } 
    // For any other errors
    else {
      console.warn('⚠️ Unexpected error:', error.response?.status);
    }
    return Promise.reject(error);
  }
);

// User API Calls 
export const guestAPI = {
  contact: (data) => api.post('/contact', data),
};

// User API Calls 
export const userAPI = {
  requestAdminAccess: (data) => api.post('/request', data),
  getUserRequest: (userId) => api.get(`/request/${userId}`),

  // To update chart and report counts
  updateChart: (id) => api.patch(`/analysis/update-chart/${id}`),
  updateReport: (id) => api.patch(`/analysis/update-report/${id}`),
};

// Admin API calls
export const adminAPI = {
  // Dashboard Stats
  getDashboardStats: () => api.get('/admin/stats'),
  getStats: () => api.get('/admin/stats'),
  
  // Dashboard Charts
  getDashboardCharts: () => api.get('/admin/dashboard/charts'),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
  
  // Users Management
  getAllUsers: (page = 1, limit = 10, search = '') => 
    api.get(`/admin/users?page=${page}&limit=${limit}&search=${search}`),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
  
  // Files Management
  getAllFiles: (page = 1, limit = 10, search = '') => 
    api.get(`/admin/files?page=${page}&limit=${limit}&search=${search}`),
  getFileById: (id) => api.get(`/admin/files/${id}`),
  deleteFile: (id) => api.delete(`/admin/files/${id}`),
  quarantineFile: (id, reason = '') => api.post(`/admin/files/${id}/quarantine`, { reason }),
  releaseFile: (id) => api.post(`/admin/files/${id}/release`),
  
  // Activity Log
  getRecentActivity: (limit = 10) => api.get(`/admin/activity?limit=${limit}`),
  
  // Reports
  getReports: (page = 1, limit = 10) => api.get(`/admin/reports?page=${page}&limit=${limit}`),
  getReportById: (id) => api.get(`/admin/reports/${id}`),
  createReport: (data) => api.post('/admin/reports', data),
  updateReport: (id, data) => api.put(`/admin/reports/${id}`, data),
  deleteReport: (id) => api.delete(`/admin/reports/${id}`),
  downloadReport: (id, format = 'pdf') => api.get(`/admin/reports/${id}/download?format=${format}`),
  
  // Uploads/File Management (legacy support)
  getUploads: (page = 1, limit = 10) => api.get(`/admin/uploads?page=${page}&limit=${limit}`),
  deleteUpload: (id) => api.delete(`/admin/uploads/${id}`),
  
  // Analytics
  getAnalytics: () => api.get('/admin/analytics'),

  // Password-reset
  resetUserPassword: (data) => api.post('/admin/user-password-reset', data),

  // Get single user details
  getUserStats: (userId) => api.get(`/analysis/stats/${userId}`),

  downloadFile: (fileId) => api.get(`/files/download/${fileId}`),

};

// Super Admin API calls
export const superAdminAPI = {

  // Dashboard
  getStats: () => api.get('/superadmin/stats'),
  getDashboardStats: () => api.get('/superadmin/stats'),
  getSuperAdminStats: () => api.get('/superadmin/stats'),
  getRecentActivity: (limit = 10) => api.get(`/superadmin/activity?limit=${limit}`),
  getSystemHealth: () => api.get('/superadmin/system-health'),
  
  // Audit Logs
  getAuditLogs: (type = 'all', page = 1, limit = 20, search = '') => 
    api.get(`/superadmin/audit?type=${type}&page=${page}&limit=${limit}&search=${search}`),
  getAuditLogById: (id) => api.get(`/superadmin/audit/${id}`),
  exportAuditLogs: (format = 'csv', type = 'all') => 
    api.get(`/superadmin/audit/export?format=${format}&type=${type}`, { responseType: 'blob' }),
  
  // Admin Requests
  getAdminRequests: (status = 'pending', page = 1, limit = 10) => 
    api.get(`/superadmin/requests?status=${status}&page=${page}&limit=${limit}`),
  getAdminRequestById: (id) => api.get(`/superadmin/requests/${id}`),
  approveAdminRequest: (id, reason = '') => 
    api.post(`/superadmin/requests/${id}/approve`, { reason }),
  rejectAdminRequest: (id, reason = '') => 
    api.post(`/superadmin/requests/${id}/reject`, { reason }),
  
  // Admins Management
  getAllAdmins: (page = 1, limit = 10, search = '', status = 'all') => 
    api.get(`/superadmin/admins?page=${page}&limit=${limit}&search=${search}&status=${status}`),
  getAdminById: (id) => api.get(`/superadmin/admins/${id}`),
  updateAdmin: (id, data) => api.put(`/superadmin/admins/${id}`, data),
  revokeAdminAccess: (id, reason = '') => 
    api.delete(`/superadmin/admins/${id}`, { data: { reason } }),
  revokeAdmin: (id, reason = '') => 
    api.delete(`/superadmin/admins/${id}`, { data: { reason } }),
  suspendAdmin: (id, reason = '', duration = null) => 
    api.post(`/superadmin/admins/${id}/suspend`, { reason, duration }),
  unsuspendAdmin: (id) => api.post(`/superadmin/admins/${id}/unsuspend`),
  toggleAdminStatus: (id, status) => 
    api.patch(`/superadmin/admins/${id}/toggle-status`, { status }),
  resetAdminPassword: (id) => api.post(`/superadmin/admins/${id}/reset-password`),
  
  // Users Management
  getAllUsers: (page = 1, limit = 10, search = '', role = 'all') => 
    api.get(`/superadmin/users?page=${page}&limit=${limit}&search=${search}&role=${role}`),
  getUserById: (id) => api.get(`/superadmin/users/${id}`),
  updateUser: (id, data) => api.put(`/superadmin/users/${id}`, data),
  deleteUser: (id, reason = '') => 
    api.delete(`/superadmin/users/${id}`, { data: { reason } }),
  deactivateUser: (id, reason = '') => 
    api.post(`/superadmin/users/${id}/deactivate`, { reason }),
  reactivateUser: (id) => api.post(`/superadmin/users/${id}/reactivate`),
  suspendUser: (id, reason = '', duration = null) => 
    api.post(`/superadmin/users/${id}/suspend`, { reason, duration }),
  unsuspendUser: (id) => api.post(`/superadmin/users/${id}/unsuspend`),
  resetUserPassword: (id) => api.post(`/superadmin/users/${id}/reset-password`),
  exportUsers: (format = 'csv') => 
    api.get(`/superadmin/users/export?format=${format}`, { responseType: 'blob' }),
  
  // Files Management
  getAllFiles: (page = 1, limit = 10, search = '', userId = null, status = 'all') => {
    let url = `/superadmin/files?page=${page}&limit=${limit}&search=${search}&status=${status}`;
    if (userId) url += `&userId=${userId}`;
    return api.get(url);
  },
  getFileById: (id) => api.get(`/superadmin/files/${id}`),
  deleteFile: (id, reason = '') => 
    api.delete(`/superadmin/files/${id}`, { data: { reason } }),
  quarantineFile: (id, reason = '') => 
    api.post(`/superadmin/files/${id}/quarantine`, { reason }),
  releaseFile: (id) => api.post(`/superadmin/files/${id}/release`),
  scanFile: (id) => api.post(`/superadmin/files/${id}/scan`),
  downloadFile: (id) => api.get(`/superadmin/files/${id}/download`),
  
  // Settings
  getSettings: () => api.get('/superadmin/settings'),
  updateSettings: (data) => api.put('/superadmin/settings', data),
  resetSettings: () => api.post('/superadmin/settings/reset'),
  getEmailSettings: () => api.get('/superadmin/settings/email'),
  updateEmailSettings: (data) => api.put('/superadmin/settings/email', data),
  getSecuritySettings: () => api.get('/superadmin/settings/security'),
  updateSecuritySettings: (data) => api.put('/superadmin/settings/security', data),
  
  // Reports
  getReports: (page = 1, limit = 10, type = 'all') => 
    api.get(`/superadmin/reports?page=${page}&limit=${limit}&type=${type}`),
  getReportById: (id) => api.get(`/superadmin/reports/${id}`),
  generateReport: (reportType, filters = {}) => 
    api.post('/superadmin/reports/generate', { reportType, filters }),
  downloadReport: (id, format = 'pdf') => 
    api.get(`/superadmin/reports/${id}/download?format=${format}`, { responseType: 'blob' }),
  deleteReport: (id) => api.delete(`/superadmin/reports/${id}`),
  
  // Notifications
  getNotifications: (page = 1, limit = 20, read = 'all') => 
    api.get(`/superadmin/notifications?page=${page}&limit=${limit}&read=${read}`),
  markNotificationAsRead: (id) => 
    api.put(`/superadmin/notifications/${id}/read`),
  markAllNotificationsAsRead: () => 
    api.put('/superadmin/notifications/mark-all-read'),
  deleteNotification: (id) => api.delete(`/superadmin/notifications/${id}`),
  
  // Backup & Maintenance
  createBackup: (type = 'full') => 
    api.post('/superadmin/maintenance/backup', { type }),
  getBackups: (page = 1, limit = 10) => 
    api.get(`/superadmin/maintenance/backups?page=${page}&limit=${limit}`),
  restoreBackup: (backupId) => 
    api.post('/superadmin/maintenance/restore', { backupId }),
  deleteBackup: (backupId) => 
    api.delete(`/superadmin/maintenance/backups/${backupId}`),
  downloadBackup: (backupId) => 
    api.get(`/superadmin/maintenance/backups/${backupId}/download`, { responseType: 'blob' }),
  
  // Logs & Monitoring
  getSystemLogs: (page = 1, limit = 20, level = 'all') => 
    api.get(`/superadmin/logs?page=${page}&limit=${limit}&level=${level}`),
  getErrorLogs: (page = 1, limit = 10) => 
    api.get(`/superadmin/logs/errors?page=${page}&limit=${limit}`),
  getAccessLogs: (page = 1, limit = 20) => 
    api.get(`/superadmin/logs/access?page=${page}&limit=${limit}`),
  
  // Analytics
  getAnalytics: (startDate, endDate) => 
    api.get(`/superadmin/analytics?startDate=${startDate}&endDate=${endDate}`),
  getUserAnalytics: (startDate, endDate) => 
    api.get(`/superadmin/analytics/users?startDate=${startDate}&endDate=${endDate}`),
  getFileAnalytics: (startDate, endDate) => 
    api.get(`/superadmin/analytics/files?startDate=${startDate}&endDate=${endDate}`),

  // Fetch contact list
  getAllContacts: () => api.get("/contacts"),

};

// User API Calls 
export const authAPI = {
  logout: (id) => api.patch(`/auth/logout/${id}`),
};

export default api;