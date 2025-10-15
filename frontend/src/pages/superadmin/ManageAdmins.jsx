import React, { useState, useEffect } from 'react';
import { superAdminAPI } from '../../api';

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await superAdminAPI.getAllAdmins();
      
      if (response.data.success) {
        setAdmins(response.data.admins);
      }
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Failed to load administrators');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async (adminId) => {
    if (window.confirm('Are you sure you want to revoke admin access? This will remove all admin privileges.')) {
      try {
        const response = await superAdminAPI.revokeAdmin(adminId);
        
        if (response.data.success) {
          setAdmins(admins.filter(admin => admin.id !== adminId));
          alert('Admin access revoked successfully.');
        } else {
          alert(response.data.message || 'Failed to revoke admin access');
        }
      } catch (err) {
        console.error('Error revoking admin:', err);
        alert('Failed to revoke admin access. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (adminId) => {
    const admin = admins.find(a => a.id === adminId);
    const newStatus = admin.status === 'Active' ? 'Suspended' : 'Active';
    
    try {
      const response = await superAdminAPI.toggleAdminStatus(adminId, newStatus);
      
      if (response.data.success) {
        setAdmins(admins.map(a => 
          a.id === adminId ? { ...a, status: newStatus } : a
        ));
        alert(`Admin ${newStatus === 'Active' ? 'activated' : 'suspended'} successfully.`);
      } else {
        alert(response.data.message || 'Failed to update admin status');
      }
    } catch (err) {
      console.error('Error toggling admin status:', err);
      alert('Failed to update admin status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading administrators...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <button 
            onClick={fetchAdmins}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Manage Administrators
              </h1>
              <p className="text-gray-600">Control admin access and permissions</p>
            </div>
            <button
              onClick={fetchAdmins}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {admins.length === 0 ? (
            <div className="text-center py-12 px-6">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-gray-600 font-medium">No administrators found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Administrator</th>
                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-left font-semibold">Approved Date</th>
                    <th className="px-6 py-4 text-left font-semibold">Last Active</th>
                    <th className="px-6 py-4 text-left font-semibold">Permissions</th>
                    <th className="px-6 py-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, index) => (
                    <tr key={admin.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {admin.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">{admin.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{admin.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          admin.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {admin.approvedDate ? new Date(admin.approvedDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {admin.lastActive ? new Date(admin.lastActive).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {admin.permissions && admin.permissions.length > 0 ? (
                            admin.permissions.map((perm, idx) => (
                              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                {perm}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs">No permissions</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleStatus(admin.id)}
                            className={`p-2 rounded-lg transition-all ${
                              admin.status === 'Active' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={admin.status === 'Active' ? 'Suspend' : 'Activate'}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleRevokeAccess(admin.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Revoke Access"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}