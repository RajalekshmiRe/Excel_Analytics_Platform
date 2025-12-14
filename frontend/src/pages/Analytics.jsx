import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, FileText, Upload, BarChart3, PieChart, Download, RefreshCw, AlertCircle } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

export default function Analytics({ currentUser, theme }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState('7days');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required. Please login first.");
        toast.error("Please login first");
        return;
      }

      console.log(`📊 Fetching analytics data for range: ${timeRange}`);
      
      const res = await api.get(`/analysis/analytics?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log("✅ Analytics data received:", res.data);
      setAnalytics(res.data);
    } catch (error) {
      console.error("❌ Error fetching analytics:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMsg = error.response?.data?.message || "Failed to load analytics data";
      setError(errorMsg);
      toast.error(errorMsg);
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

  // Matching DashboardHome design
  const bgColor = "bg-gradient-to-b from-[#fbf9fb] to-[#c4c799]";
  const cardBg = "bg-white";
  const textColor = "text-gray-900";
  const borderColor = "border-gray-200";

  // Loading State
  if (loading) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#bc4e9c] border-t-transparent mx-auto mb-4"></div>
          <p className={`${textColor} font-semibold text-lg`}>Loading analytics...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching your data insights</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center p-8`}>
        <Toaster position="top-center" />
        <div className={`${cardBg} rounded-3xl shadow-2xl p-8 border-2 border-[#bc4e9c] max-w-md w-full`}>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className={`text-xl font-bold ${textColor} mb-2`}>Unable to Load Analytics</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={fetchAnalytics}
                className="px-6 py-3 bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white rounded-xl font-semibold hover:from-[#a0428a] hover:to-[#e0064f] transition-all shadow-lg flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No Data State
  if (!analytics || !analytics.overview) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center p-8`}>
        <Toaster position="top-center" />
        <div className={`${cardBg} rounded-3xl shadow-2xl p-12 border-2 border-[#bc4e9c] max-w-md w-full text-center`}>
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-10 h-10 text-[#bc4e9c]" />
          </div>
          <h3 className={`text-xl font-bold ${textColor} mb-2`}>No Analytics Data Available</h3>
          <p className="text-gray-600 mb-6">
            Upload some files to start seeing your analytics
          </p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white rounded-xl font-semibold hover:from-[#a0428a] hover:to-[#e0064f] transition-all shadow-lg"
          >
            Refresh Analytics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} p-8`}>
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-4xl lg:text-5xl font-bold ${textColor} mb-2`}>Analytics Dashboard</h1>
              <p className="text-gray-600 text-lg">
                Track your data insights and activity
              </p>
            </div>
            <div className="flex gap-3">
              {/* Time Range Filter */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className={`px-4 py-2 rounded-xl border-2 border-[#bc4e9c] ${cardBg} ${textColor} font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500`}
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
                className="px-6 py-2 bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white rounded-xl font-semibold hover:from-[#a0428a] hover:to-[#e0064f] transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
          <hr className="border-t-2 border-[#bc4e9c]" />
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              title: "Total Uploads", 
              value: analytics.overview.totalUploads || 0, 
              trend: analytics.overview.uploadsTrend || 0,
              icon: Upload,
              color: "from-green-500 to-emerald-500"
            },
            { 
              title: "Storage Used", 
              value: analytics.overview.totalStorage || "0 MB", 
              trend: analytics.overview.storageTrend || 0,
              icon: FileText,
              color: "from-blue-500 to-cyan-500"
            },
            { 
              title: "Charts Created", 
              value: analytics.overview.totalCharts || 0, 
              trend: analytics.overview.chartsTrend || 0,
              icon: BarChart3,
              color: "from-purple-500 to-pink-500"
            },
            { 
              title: "Reports Generated", 
              value: analytics.overview.totalReports || 0, 
              trend: analytics.overview.reportsTrend || 0,
              icon: PieChart,
              color: "from-orange-500 to-red-500"
            }
          ].map((stat, idx) => (
            <div key={idx} className={`${cardBg} rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all`}>
              <div className="flex items-center mb-4 gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {stat.title}
                </p>
              </div>
              <div className="flex items-end justify-between">
                <p className={`text-3xl font-bold ${textColor}`}>{stat.value}</p>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(stat.trend)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upload Trend Chart */}
          <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6`}>
            <h3 className={`text-xl font-bold ${textColor} mb-4`}>Upload Trend</h3>
            {analytics.uploadTrend && analytics.uploadTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics.uploadTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="uploads" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No upload trend data available</p>
              </div>
            )}
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
                <p className="text-gray-500">No file type data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Storage Usage Over Time */}
        <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6 mb-8`}>
          <h3 className={`text-xl font-bold ${textColor} mb-4`}>Storage Usage Over Time</h3>
          {analytics.storageUsage && analytics.storageUsage.length > 0 ? (
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
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No storage usage data available</p>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6`}>
            <h3 className={`text-xl font-bold ${textColor} mb-4`}>Recent Activity</h3>
            <div className="space-y-4">
              {analytics.recentActivity && analytics.recentActivity.length > 0 ? (
                analytics.recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-0">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className={`font-medium ${textColor}`}>{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
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
                  <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <p className={`font-medium ${textColor} truncate`}>{file.name}</p>
                      <p className="text-sm text-gray-500">{file.size}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
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
              <p className="text-gray-600">Download your analytics data for further analysis</p>
            </div>
            <button 
              onClick={() => toast.success("Export feature coming soon!")}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
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