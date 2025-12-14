import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layout/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import UploadHistory from './pages/UploadHistory';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';  // ← Make sure this exists
import RequestAdminAccess from './pages/RequestAdminAccess';
import AnalysisView from './pages/AnalysisView';

import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import FileManagement from './pages/admin/FileManagement';
import Reports from './pages/admin/Reports';
import AdminSettings from './pages/admin/AdminSettings';

import SuperAdminLayout from './layout/SuperAdminLayout';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import AdminRequests from './pages/superadmin/AdminRequests';
import ManageAdmins from './pages/superadmin/ManageAdmins';
import AuditLogs from './pages/superadmin/AuditLogs';
import SuperAdminSettings from './pages/superadmin/SuperAdminSettings';

import './index.css';
import Contacts from './pages/superadmin/Contacts';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (adminToken && (user.role === 'admin' || user.role === 'superadmin')) 
    ? children 
    : <Navigate to="/login" />;
};

const SuperAdminProtectedRoute = ({ children }) => {
  const superAdminToken = localStorage.getItem('superAdminToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (superAdminToken && user.role === 'superadmin') 
    ? children 
    : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="App">
      <Routes>
        {/* HOME PAGE - Landing Page */}
        <Route path="/" element={<HomePage />} />
        
        {/* Public Routes - ONE LOGIN FOR ALL */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* User Dashboard Routes */}
       <Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<DashboardHome />} />
  <Route path="analysis/:fileId" element={<AnalysisView />} />
  <Route path="history" element={<UploadHistory />} />
  <Route path="analytics" element={<Analytics />} />  {/* ← ADD THIS */}
  <Route path="request-admin" element={<RequestAdminAccess />} />  {/* ← ADD THIS */}
  <Route path="settings" element={<Settings />} />
</Route>

        {/* User Request Admin Access */}
        <Route 
          path="/dashboard/request-admin" 
          element={
            <ProtectedRoute>
              <RequestAdminAccess />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes - NO SEPARATE LOGIN */}
        <Route 
          path="/admin" 
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <ManageUsers />
              </AdminLayout>
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/files" 
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <FileManagement />
              </AdminLayout>
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/reports" 
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <Reports />
              </AdminLayout>
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <AdminProtectedRoute>
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            </AdminProtectedRoute>
          } 
        />

        {/* Super Admin Routes - NO SEPARATE LOGIN */}
        <Route 
          path="/superadmin" 
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminLayout>
                <SuperAdminDashboard />
              </SuperAdminLayout>
            </SuperAdminProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin/requests" 
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminLayout>
                <AdminRequests />
              </SuperAdminLayout>
            </SuperAdminProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin/admins" 
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminLayout>
                <ManageAdmins />
              </SuperAdminLayout>
            </SuperAdminProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin/users" 
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminLayout>
                <ManageUsers />
              </SuperAdminLayout>
            </SuperAdminProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin/audit" 
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminLayout>
                <AuditLogs />
              </SuperAdminLayout>
            </SuperAdminProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin/contact" 
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminLayout>
                <Contacts />
              </SuperAdminLayout>
            </SuperAdminProtectedRoute>
          } 
        />
        <Route 
          path="/superadmin/settings" 
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminLayout>
                <SuperAdminSettings />
              </SuperAdminLayout>
            </SuperAdminProtectedRoute>
          } 
        />

        {/* Catch all - redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;