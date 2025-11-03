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
