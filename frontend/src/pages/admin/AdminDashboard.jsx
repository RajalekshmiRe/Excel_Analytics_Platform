// import React, { useState, useEffect } from 'react';

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     activeUsers: 0,
//     totalUploads: 0,
//     storageUsed: 0,
//     chartsGenerated: 0,
//     apiCalls: 0
//   });

//   const [recentActivity, setRecentActivity] = useState([]);

//   useEffect(() => {
//     // TODO: Replace with actual API calls
//     // Simulating data fetch
//     setStats({
//       totalUsers: 24,
//       activeUsers: 18,
//       totalUploads: 156,
//       storageUsed: 45.8,
//       chartsGenerated: 342,
//       apiCalls: 1247
//     });

//     setRecentActivity([
//       { id: 1, user: 'Meenakshi', action: 'Uploaded Sales_Data_Q1.xlsx', time: '2 mins ago', type: 'upload' },
//       { id: 2, user: 'Sarah Smith', action: 'Generated bar chart', time: '15 mins ago', type: 'chart' },
//       { id: 3, user: 'Rajasree Reji', action: 'Logged in', time: '1 hour ago', type: 'login' },
//       { id: 4, user: 'John Doe', action: 'Deleted Employee_Records.csv', time: '3 hours ago', type: 'delete' },
//     ]);
//   }, []);

//   return (
//     <div className="p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
//           <p className="text-gray-600">Monitor and manage system activities</p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           <StatCard
//             icon={
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//             }
//             title="Total Users"
//             value={stats.totalUsers}
//             subtitle={`${stats.activeUsers} active`}
//             color="blue"
//           />
//           <StatCard
//             icon={
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//               </svg>
//             }
//             title="Total Uploads"
//             value={stats.totalUploads}
//             subtitle="All time"
//             color="green"
//           />
//           <StatCard
//             icon={
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
//               </svg>
//             }
//             title="Storage Used"
//             value={`${stats.storageUsed}GB`}
//             subtitle="Of 100GB"
//             color="purple"
//           />
//           <StatCard
//             icon={
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//               </svg>
//             }
//             title="Charts Generated"
//             value={stats.chartsGenerated}
//             subtitle="This month"
//             color="orange"
//           />
//           <StatCard
//             icon={
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//             }
//             title="API Calls"
//             value={stats.apiCalls}
//             subtitle="Last 24 hours"
//             color="red"
//           />
//           <StatCard
//             icon={
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             }
//             title="System Status"
//             value="Healthy"
//             subtitle="All systems operational"
//             color="green"
//           />
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
//           <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-5 rounded-t-2xl">
//             <h2 className="text-xl font-semibold text-white flex items-center gap-2">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               Recent User Activity
//             </h2>
//           </div>
//           <div className="p-6">
//             <div className="space-y-4">
//               {recentActivity.map((activity) => (
//                 <ActivityLog key={activity.id} {...activity} />
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// const StatCard = ({ icon, title, value, subtitle, color }) => {
//   const colorClasses = {
//     blue: 'from-blue-500 to-cyan-500',
//     purple: 'from-purple-500 to-pink-500',
//     green: 'from-green-500 to-emerald-500',
//     orange: 'from-orange-500 to-amber-500',
//     red: 'from-red-500 to-pink-600'
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
//       <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
//         <div className="text-white">{icon}</div>
//       </div>
//       <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{title}</p>
//       <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
//       <p className="text-sm text-gray-500">{subtitle}</p>
//     </div>
//   );
// };

// const ActivityLog = ({ user, action, time, type }) => {
//   const getIcon = () => {
//     switch (type) {
//       case 'upload':
//         return (
//           <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//             <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//             </svg>
//           </div>
//         );
//       case 'chart':
//         return (
//           <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//             <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//             </svg>
//           </div>
//         );
//       case 'login':
//         return (
//           <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
//             <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//             </svg>
//           </div>
//         );
//       case 'delete':
//         return (
//           <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//             <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//             </svg>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
//       {getIcon()}
//       <div className="flex-1">
//         <p className="text-sm font-semibold text-gray-900">
//           {user} <span className="font-normal text-gray-600">{action}</span>
//         </p>
//         <p className="text-xs text-gray-500 mt-1">{time}</p>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalUploads: 0,
    totalStorage: 0,
    chartsGenerated: 0,
    reportsCreated: 0,
    systemHealth: 0,
    uptime: '0%',
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [userList, setUserList] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activityRes, usersRes, filesRes] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getRecentActivity?.() || Promise.resolve({ data: { activities: [] } }),
        adminAPI.getAllUsers?.() || Promise.resolve({ data: { users: [] } }),
        adminAPI.getAllFiles?.() || Promise.resolve({ data: { files: [] } })
      ]);

      setStats(statsRes.data?.data || statsRes.data?.stats || {});
      setRecentActivities(activityRes.data?.activities || []);
      setUserList(usersRes.data?.users || []);
      setFiles(filesRes.data?.files || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor user activities, file uploads, charts, and reports</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon="👥"
            title="Total Users"
            value={stats.totalUsers}
            subtitle={`${stats.activeUsers} active`}
            color="blue"
          />
          <StatCard
            icon="📁"
            title="Total Uploads"
            value={stats.totalUploads}
            subtitle="Files uploaded"
            color="green"
          />
          <StatCard
            icon="📊"
            title="Charts Generated"
            value={stats.chartsGenerated}
            subtitle="Data visualizations"
            color="purple"
          />
          <StatCard
            icon="📄"
            title="Reports Created"
            value={stats.reportsCreated}
            subtitle="User reports"
            color="orange"
          />
          <StatCard
            icon="💾"
            title="Storage Used"
            value={`${stats.storageUsed} ${stats.storageUnit}`}
            subtitle="Total storage"
            color="cyan"
          />
          <StatCard
            icon="⚡"
            title="System Health"
            value={`${stats.systemHealth}%`}
            subtitle="All systems operational"
            color="green"
          />
          <StatCard
            icon="🕐"
            title="Uptime"
            value={stats.uptime}
            subtitle="System availability"
            color="blue"
          />
          <StatCard
            icon="✅"
            title="Success Rate"
            value={`${stats.successRate}%`}
            subtitle="Operations successful"
            color="green"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {['overview', 'users', 'files', 'activity'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab stats={stats} />}
            {activeTab === 'users' && <UsersTab users={userList} />}
            {activeTab === 'files' && <FilesTab files={files} />}
            {activeTab === 'activity' && <ActivityTab activities={recentActivities} />}
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    cyan: 'bg-cyan-50 text-cyan-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
      <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4 text-2xl`}>
        {icon}
      </div>
      <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

const OverviewTab = ({ stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-2">Active Users</h3>
          <p className="text-3xl font-bold">{stats.activeUsers}</p>
          <p className="text-sm text-blue-100 mt-2">Currently online</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-2">Total Storage</h3>
          <p className="text-3xl font-bold">{stats.totalStorage} {stats.storageUnit}</p>
          <p className="text-sm text-green-100 mt-2">Used across platform</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-2">System Status</h3>
          <p className="text-3xl font-bold">{stats.systemHealth}%</p>
          <p className="text-sm text-purple-100 mt-2">Overall health</p>
        </div>
      </div>
    </div>
  );
};

const UsersTab = ({ users }) => {
  return (
    <div className="overflow-x-auto">
      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No users found</p>
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">User Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Uploads</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Join Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50 transition-all">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.uploads}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(user.joinDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const FilesTab = ({ files }) => {
  return (
    <div className="space-y-4">
      {files.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No files uploaded yet</p>
        </div>
      ) : (
        files.map(file => (
          <div key={file.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">📄</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{file.fileName}</p>
              <p className="text-xs text-gray-600 mt-1">
                {file.userName} • {file.size} • {new Date(file.uploadDate).toLocaleString()}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              file.status === 'Processed'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {file.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

const ActivityTab = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      upload: '📤',
      chart: '📊',
      report: '📄',
      export: '💾',
      delete: '🗑️'
    };
    return icons[type] || '📌';
  };

  return (
    <div className="space-y-3">
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No recent activities</p>
        </div>
      ) : (
        activities.map((activity, idx) => (
          <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{activity.user}</p>
              <p className="text-sm text-gray-600">{activity.action}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};