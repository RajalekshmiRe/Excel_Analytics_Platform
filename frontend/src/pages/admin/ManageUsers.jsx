// import React, { useState, useEffect } from 'react';

// export default function ManageUsers() {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');

//   useEffect(() => {
//     // TODO: Replace with actual API call
//     // Example: fetch('/api/admin/users').then(res => res.json()).then(setUsers);

//     setUsers([
//       { id: 1, name: "Meenakshi", email: "meenu@3gmail.com", status: "Active", uploads: 3, joinDate: "2025-01-15", lastActive: "2025-10-08" },
//       { id: 2, name: "Rajasree Reji", email: "rajasree@example.com", status: "Active", uploads: 5, joinDate: "2025-02-20", lastActive: "2025-10-07" },
//       { id: 3, name: "John Doe", email: "john@example.com", status: "Inactive", uploads: 2, joinDate: "2025-03-10", lastActive: "2025-09-30" },
//       { id: 4, name: "Sarah Smith", email: "sarah@example.com", status: "Active", uploads: 8, joinDate: "2025-01-05", lastActive: "2025-10-08" },
//     ]);
//   }, []);

//   const handleDeleteUser = async (userId) => {
//     if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
//       // TODO: Call API to delete user
//       // await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
//       setUsers(users.filter(u => u.id !== userId));
//     }
//   };

//   const handleToggleStatus = async (userId) => {
//     // TODO: Call API to toggle user status
//     // await fetch(`/api/admin/users/${userId}/toggle-status`, { method: 'PATCH' });
//     setUsers(users.map(u =>
//       u.id === userId ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
//     ));
//   };

//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesFilter = filterStatus === 'all' || user.status.toLowerCase() === filterStatus.toLowerCase();
//     return matchesSearch && matchesFilter;
//   });

//   return (
//     <div className="p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
//               <p className="text-gray-600 mt-1">Manage and monitor all users</p>
//             </div>
//             <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Add User
//             </button>
//           </div>

//           {/* Search and Filter */}
//           <div className="flex gap-4 flex-col sm:flex-row">
//             <div className="relative flex-1">
//               <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//               <input
//                 type="text"
//                 placeholder="Search users by name or email..."
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <select
//               className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value)}
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active Only</option>
//               <option value="inactive">Inactive Only</option>
//             </select>
//           </div>
//         </div>

//         {/* Users Table */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
//                 <tr>
//                   <th className="px-6 py-4 text-left font-semibold">User</th>
//                   <th className="px-6 py-4 text-left font-semibold">Email</th>
//                   <th className="px-6 py-4 text-left font-semibold">Status</th>
//                   <th className="px-6 py-4 text-left font-semibold">Uploads</th>
//                   <th className="px-6 py-4 text-left font-semibold">Join Date</th>
//                   <th className="px-6 py-4 text-left font-semibold">Last Active</th>
//                   <th className="px-6 py-4 text-left font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredUsers.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
//                       No users found
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredUsers.map((user, index) => (
//                     <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
//                             {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
//                           </div>
//                           <span className="font-semibold text-gray-900">{user.name}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-gray-700">{user.email}</td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                           user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}>
//                           {user.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-gray-700">{user.uploads}</td>
//                       <td className="px-6 py-4 text-gray-700">{new Date(user.joinDate).toLocaleDateString()}</td>
//                       <td className="px-6 py-4 text-gray-700">{new Date(user.lastActive).toLocaleDateString()}</td>
//                       <td className="px-6 py-4">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() => handleToggleStatus(user.id)}
//                             className={`p-2 rounded-lg transition-all ${
//                               user.status === 'Active' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
//                             }`}
//                             title={user.status === 'Active' ? 'Disable User' : 'Enable User'}
//                           >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
//                             </svg>
//                           </button>
//                           <button
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                             title="View Details"
//                           >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                             </svg>
//                           </button>
//                           <button
//                             onClick={() => handleDeleteUser(user.id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                             title="Delete User"
//                           >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { adminAPI } from "../../api";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔹 New states for password reset modal
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetLoading, setResetLoading] = useState(false);

    // For User details view  
    const [selectedUserStats, setSelectedUserStats] = useState(null);


    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
        setLoading(true);
        const response = await adminAPI.getAllUsers();
        setUsers(response.data?.users || []);
        setError(null);
        } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
        } finally {
        setLoading(false);
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
        await adminAPI.toggleUserStatus(userId);
        setUsers(
            users.map((u) =>
            u.id === userId
                ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
                : u
            )
        );
        alert("User status updated successfully");
        } catch (err) {
        console.error("Error toggling user status:", err);
        alert("Failed to update user status");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
        try {
            await adminAPI.deleteUser(userId);
            setUsers(users.filter((u) => u.id !== userId));
            alert("User deleted successfully");
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user");
        }
        }
    };

    // 🔹 Handle password reset
    const handleResetPassword = (user) => {
        setSelectedUser(user);
        setShowModal(true);
        setNewPassword("");
        setConfirmPassword("");
    };

    const submitPasswordReset = async () => {
        if (!newPassword || !confirmPassword) {
        alert("Please fill both password fields");
        return;
        }
        if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
        }

        try {
        setResetLoading(true);
        await adminAPI.resetUserPassword({
            userId: selectedUser.id,
            password: newPassword,
        });

        alert("Password reset successfully");
        setShowModal(false);
        } catch (err) {
        console.error("Error resetting password:", err);
        alert("Failed to reset password");
        } finally {
        setSearchTerm("");
        setResetLoading(false);
        }
    };

    // 🔹 Handle user details view
    const viewUserDetails = async (id) => {
  try {
    console.log('🔍 Fetching user details for:', id);
    setSelectedUserStats({ user: null, stats: null }); // Show loading
    
    const response = await adminAPI.getUserStats(id);
    
    console.log('✅ User details response:', response.data);
    
    setSelectedUserStats(response.data);
  } catch (err) {
    console.error('❌ Error fetching user details:', err);
    alert('Failed to fetch user details: ' + (err.response?.data?.message || err.message));
    setSelectedUserStats(null);
  }
};

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
        filterStatus === "all" || user.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
        <div className="p-8 flex items-center justify-center min-h-screen">
            <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
            </div>
        </div>
        );
    }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage users and control platform access
              </p>
            </div>
            <button
              onClick={fetchUsers}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">User</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Role</th>
                  <th className="px-6 py-4 text-left font-semibold">Uploads</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Last Active
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-16 h-16 text-gray-300 mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <p>No users found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                          <span className="font-semibold text-gray-900">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 capitalize">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">
                        {user.uploads}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">

                            <button
                                onClick={() => handleResetPassword(user)}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors duration-200"
                                title="Reset Password"
                            >
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                >
                                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                                </svg>
                            </button>

                            <button
                                onClick={() => handleToggleStatus(user.id)}
                                className={`p-2 rounded-lg transition-all ${
                                user.status === "Active"
                                    ? "text-orange-600 hover:bg-orange-50"
                                    : "text-green-600 hover:bg-green-50"
                                }`}
                                title={
                                user.status === "Active"
                                    ? "Deactivate"
                                    : "Activate"
                                }
                            >
                                <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                >
                                {user.status === "Active" ? (
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                    />
                                ) : (
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                )}
                                </svg>
                            </button>

                            <button
                                onClick={() => viewUserDetails(user.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="View Details"
                            >
                                <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                                </svg>
                            </button>

                            <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete"
                            >
                                <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                                </svg>
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <p className="text-sm text-gray-600">Active Users</p>
            <p className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.status === "Active").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <p className="text-sm text-gray-600">Inactive Users</p>
            <p className="text-2xl font-bold text-red-600">
              {users.filter((u) => u.status === "Inactive").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <p className="text-sm text-gray-600">Total Uploads</p>
            <p className="text-2xl font-bold text-blue-600">
              {users.reduce((sum, u) => sum + u.uploads, 0)}
            </p>
          </div>
        </div>

        {/* 🔹 Reset Password Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-md relative">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Reset Password
              </h2>
              <p className="text-gray-600 mb-4">
                Reset password for <b>{selectedUser?.name}</b>
              </p>

              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={submitPasswordReset}
                  disabled={resetLoading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {resetLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        )}

{/* View users details - FIXED VERSION */}
{selectedUserStats && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-96 max-w-full mx-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        User Statistics
      </h2>

      {/* Check if user data exists before rendering */}
      {selectedUserStats.user ? (
        <>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {selectedUserStats.user.name
                  ? selectedUserStats.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "??"}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedUserStats.user.name || "N/A"}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedUserStats.user.email || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold capitalize">
                {selectedUserStats.user.role || "user"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedUserStats.user.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {selectedUserStats.user.status || "Unknown"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600 font-medium">📊 Total Uploads</span>
              <span className="text-gray-900 font-bold">
                {selectedUserStats.stats?.totalUploads || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600 font-medium">📁 Files Processed</span>
              <span className="text-gray-900 font-bold">
                {selectedUserStats.stats?.filesProcessed || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600 font-medium">💾 Storage Used</span>
              <div className="text-right">
                <span className="text-gray-900 font-bold">
                  {selectedUserStats.stats?.storageUsedMB || 0} MB
                </span>
                {selectedUserStats.stats?.storageUsed > 0 && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({selectedUserStats.stats?.storageUsed}%)
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600 font-medium">📈 Active Reports</span>
              <span className="text-gray-900 font-bold">
                {selectedUserStats.stats?.activeReports || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">📉 Charts Generated</span>
              <span className="text-gray-900 font-bold">
                {selectedUserStats.stats?.chartsGenerated || 0}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setSelectedUserStats(null)}
          className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
