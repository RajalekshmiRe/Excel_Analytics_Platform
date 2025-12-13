import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, FileText, Upload, BarChart3, PieChart, Download, RefreshCw } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

export default function Analytics({ currentUser, theme }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const res = await api.get(`/analysis/analytics?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("Analytics data:", res.data);
      setAnalytics(res.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error(error.response?.data?.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
    toast.success("Analytics refreshed!");
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const bgColor = theme === "dark" 
    ? "bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900" 
    : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50";
  const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";

  if (loading) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className={`${textColor} font-semibold`}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
        <div className="text-center">
          <p className={`${textColor} font-semibold`}>No analytics data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} p-8`}>
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${textColor} mb-2`}>Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your data insights and activity
            </p>
          </div>
          <div className="flex gap-3">
            {/* Time Range Filter */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-4 py-2 rounded-xl border-2 ${borderColor} ${cardBg} ${textColor} font-semibold`}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
            
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: "Total Uploads", 
              value: analytics.overview.totalUploads, 
              trend: analytics.overview.uploadsTrend,
              icon: Upload,
              color: "blue"
            },
            { 
              title: "Storage Used", 
              value: analytics.overview.totalStorage, 
              trend: analytics.overview.storageTrend,
              icon: FileText,
              color: "green"
            },
            { 
              title: "Charts Created", 
              value: analytics.overview.totalCharts, 
              trend: analytics.overview.chartsTrend,
              icon: BarChart3,
              color: "purple"
            },
            { 
              title: "Reports Generated", 
              value: analytics.overview.totalReports, 
              trend: analytics.overview.reportsTrend,
              icon: PieChart,
              color: "orange"
            }
          ].map((stat, idx) => (
            <div key={idx} className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6 transition-all hover:shadow-xl`}>
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(stat.trend)}%
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.title}</h3>
              <p className={`text-3xl font-bold ${textColor}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upload Trend Chart */}
          <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6`}>
            <h3 className={`text-xl font-bold ${textColor} mb-4`}>Upload Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.uploadTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="uploads" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* File Types Distribution */}
          <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6`}>
            <h3 className={`text-xl font-bold ${textColor} mb-4`}>File Types Distribution</h3>
            {analytics.fileTypes && analytics.fileTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPie>
                  <Pie
                    data={analytics.fileTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.fileTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No file data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Storage Usage Over Time */}
        <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6 mb-8`}>
          <h3 className={`text-xl font-bold ${textColor} mb-4`}>Storage Usage Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.storageUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="storage" stroke="#10b981" strokeWidth={3} name="Storage (MB)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6`}>
            <h3 className={`text-xl font-bold ${textColor} mb-4`}>Recent Activity</h3>
            <div className="space-y-4">
              {analytics.recentActivity && analytics.recentActivity.length > 0 ? (
                analytics.recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className={`font-medium ${textColor}`}>{activity.action}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </div>
          </div>

          {/* Top Files */}
          <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6`}>
            <h3 className={`text-xl font-bold ${textColor} mb-4`}>Most Recent Files</h3>
            <div className="space-y-4">
              {analytics.topFiles && analytics.topFiles.length > 0 ? (
                analytics.topFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="flex-1">
                      <p className={`font-medium ${textColor} truncate`}>{file.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{file.size}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-semibold">
                        {file.views} views
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No files yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6 mt-8`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-bold ${textColor} mb-2`}>Export Analytics Report</h3>
              <p className="text-gray-600 dark:text-gray-400">Download your analytics data for further analysis</p>
            </div>
            <button 
              onClick={() => toast.success("Export feature coming soon!")}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}