// import React, { useState } from 'react';

// export default function Reports() {
//   const [selectedPeriod, setSelectedPeriod] = useState('7days');

//   const reportData = {
//     userGrowth: [
//       { date: '2025-10-01', users: 18 },
//       { date: '2025-10-02', users: 19 },
//       { date: '2025-10-03', users: 20 },
//       { date: '2025-10-04', users: 21 },
//       { date: '2025-10-05', users: 22 },
//       { date: '2025-10-06', users: 23 },
//       { date: '2025-10-07', users: 24 },
//     ],
//     uploadStats: {
//       total: 156,
//       thisWeek: 34,
//       avgPerUser: 6.5
//     }
//   };

//   return (
//     <div className="p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
//               <p className="text-gray-600 mt-1">View detailed system reports</p>
//             </div>
//             <div className="flex gap-3">
//               <select
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={selectedPeriod}
//                 onChange={(e) => setSelectedPeriod(e.target.value)}
//               >
//                 <option value="7days">Last 7 Days</option>
//                 <option value="30days">Last 30 Days</option>
//                 <option value="90days">Last 90 Days</option>
//               </select>
//               <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2">
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                 </svg>
//                 Export
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-sm font-semibold text-gray-600 uppercase">Total Uploads</h3>
//               <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//               </svg>
//             </div>
//             <p className="text-3xl font-bold text-gray-900">{reportData.uploadStats.total}</p>
//             <p className="text-sm text-green-600 mt-2">+{reportData.uploadStats.thisWeek} this week</p>
//           </div>

//           <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-sm font-semibold text-gray-600 uppercase">Avg Per User</h3>
//               <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//             </div>
//             <p className="text-3xl font-bold text-gray-900">{reportData.uploadStats.avgPerUser}</p>
//             <p className="text-sm text-gray-500 mt-2">uploads per user</p>
//           </div>

//           <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-sm font-semibold text-gray-600 uppercase">User Growth</h3>
//               <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//               </svg>
//             </div>
//             <p className="text-3xl font-bold text-gray-900">+6</p>
//             <p className="text-sm text-green-600 mt-2">this week</p>
//           </div>
//         </div>

//         {/* User Growth Chart */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-6">User Growth Trend</h2>
//           <div className="h-64 flex items-end justify-between gap-4">
//             {reportData.userGrowth.map((item, index) => (
//               <div key={index} className="flex-1 flex flex-col items-center">
//                 <div
//                   className="w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg transition-all hover:from-blue-600 hover:to-purple-700"
//                   style={{ height: `${(item.users / 24) * 100}%` }}
//                   title={`${item.users} users`}
//                 ></div>
//                 <p className="text-xs text-gray-500 mt-2">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Activity Summary */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Summary</h2>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-900">File Uploads</p>
//                   <p className="text-sm text-gray-600">34 uploads this week</p>
//                 </div>
//               </div>
//               <span className="text-2xl font-bold text-blue-600">34</span>
//             </div>

//             <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-900">Charts Generated</p>
//                   <p className="text-sm text-gray-600">87 charts this week</p>
//                 </div>
//               </div>
//               <span className="text-2xl font-bold text-green-600">87</span>
//             </div>

//             <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-semibold text-gray-900">Active Users</p>
//                   <p className="text-sm text-gray-600">18 users active today</p>
//                 </div>
//               </div>
//               <span className="text-2xl font-bold text-purple-600">18</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { adminAPI } from "../../api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, chartsRes, usersRes, filesRes, activityRes] =
        await Promise.all([
          adminAPI.getDashboardStats(),
          adminAPI.getDashboardCharts(),
          adminAPI.getAllUsers(),
          adminAPI.getAllFiles(),
          adminAPI.getRecentActivity(),
        ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (chartsRes.data.success) {
        setChartData(chartsRes.data.data);
      }

      if (usersRes.data.success) {
        setUsers(usersRes.data.users);
      }

      if (filesRes.data.success) {
        setFiles(filesRes.data.files);
      }

      if (activityRes.data.success) {
        setActivities(activityRes.data.activities);
      }
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError("Failed to load report data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return "";
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) => Object.values(row).join(","));
    return [headers, ...rows].join("\n");
  };

  const exportUserReport = () => {
    const userData = users.map((user) => ({
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Status: user.status,
      Uploads: user.uploads,
      "Join Date": new Date(user.joinDate).toLocaleDateString(),
      "Last Active": new Date(user.lastActive).toLocaleDateString(),
    }));
    exportToCSV(userData, "user_report");
  };

  const exportFileReport = () => {
    const fileData = files.map((file) => ({
      "File Name": file.fileName,
      User: file.userName,
      "Upload Date": new Date(file.uploadDate).toLocaleDateString(),
      Size: file.size,
      Status: file.status,
    }));
    exportToCSV(fileData, "file_report");
  };

  const exportActivityReport = () => {
    const activityData = activities.map((activity) => ({
      User: activity.user,
      Action: activity.action,
      Time: activity.time,
      Type: activity.type,
    }));
    exportToCSV(activityData, "activity_report");
  };

  // chart download
  const chartWrapperRef = useRef(null);
  const pieChartRef     = useRef(null);
  const barChartRef1    = useRef(null);
  const barChartRef2    = useRef(null);



  // Line graph
  const handleDownload = async () => {
    const element = chartWrapperRef.current;
    if (!element) {
      alert("Chart not found");
      return;
    }

    try {
      const canvas = await html2canvas(element, { backgroundColor: "#fff" });
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = "upload_trend_chart.png";
      link.click();
    } catch (error) {
      console.error("Failed to capture chart:", error);
      alert("Failed to download chart");
    }
  };

  // Line graph
  const handleDownloadPie = async () => {
    const element = pieChartRef.current;
    if (!element) {
      alert("Chart not found");
      return;
    }

    try {
      const canvas = await html2canvas(element, { backgroundColor: "#fff" });
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = "storage_used_chart.png";
      link.click();
    } catch (error) {
      console.error("Failed to capture chart:", error);
      alert("Failed to download chart");
    }
  };

    // Bar graph 1
  const handleDownloadBar1 = async () => {
    const element = barChartRef1.current;
    if (!element) {
      alert("Chart not found");
      return;
    }

    try {
      const canvas = await html2canvas(element, { backgroundColor: "#fff" });
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = "weekly_user_activity.png";
      link.click();
    } catch (error) {
      console.error("Failed to capture chart:", error);
      alert("Failed to download chart");
    }
  };

  // Bar graph 2
  const handleDownloadBar2 = async () => {
    const element = barChartRef2.current;
    if (!element) {
      alert("Chart not found");
      return;
    }

    try {
      const canvas = await html2canvas(element, { backgroundColor: "#fff" });
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = "file_format_distribution.png";
      link.click();
    } catch (error) {
      console.error("Failed to capture chart:", error);
      alert("Failed to download chart");
    }
  };

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg
            className="w-12 h-12 text-red-500 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-600 font-semibold mb-2">{error}</p>
          <button
            onClick={fetchReportData}
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
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Reports & Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Excel Analytics Platform - System Reports
              </p>
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
              <button
                onClick={fetchReportData}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
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
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-2">
          <div className="flex gap-2">
            {["overview", "users", "files", "charts", "activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase">
                    Total Users
                  </h3>
                  <svg
                    className="w-8 h-8 text-blue-500"
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
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalUsers || 0}
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  {stats?.activeUsers || 0} active in last 7 days
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase">
                    Total Uploads
                  </h3>
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalUploads || 0}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  {stats?.successfulUploads || 0} successful
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase">
                    Storage Used
                  </h3>
                  <svg
                    className="w-8 h-8 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalStorage || 0} {stats?.storageUnit || 0}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Total storage consumed
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase">
                    Charts Generated
                  </h3>
                  <svg
                    className="w-8 h-8 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.chartsGenerated || 0}
                </p>
                <p className="text-sm text-orange-600 mt-2">
                  Visualizations created
                </p>
              </div>
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  System Health
                </h3>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="52"
                        stroke="#E5E7EB"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="52"
                        stroke="#10B981"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${
                          (stats?.systemHealth || 0) * 3.27
                        } 327`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {stats?.systemHealth || 0}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-4">
                  Uptime: {stats?.uptime || "N/A"}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Reports Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Completed
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      {stats?.completedReports || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Pending
                    </span>
                    <span className="text-lg font-bold text-yellow-600">
                      {stats?.pendingReports || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Failed
                    </span>
                    <span className="text-lg font-bold text-red-600">
                      {stats?.failedUploads || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  API Calls
                </h3>
                <div className="text-center py-8">
                  <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {stats?.apiCalls || 0}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Total API requests
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                User Management Report
              </h2>
              <button
                onClick={exportUserReport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.uploads}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(user.lastActive).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No users found
              </div>
            )}
          </div>
        )}

        {/* Files Tab */}
        {activeTab === "files" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                File Upload Report
              </h2>
              <button
                onClick={exportFileReport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Upload Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="font-medium text-gray-900">
                            {file.fileName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {file.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(file.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {file.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {file.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {files.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No files found
              </div>
            )}
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === "charts" && chartData && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Trend */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Upload Trend
                  </h2>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  >
                    Download
                  </button>
                </div>

                {/* ✅ Attach ref here */}
                <div ref={chartWrapperRef} className="p-5">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.uploadTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="uploads"
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Storage Usage */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Storage Used
                  </h2>
                  <button
                    onClick={handleDownloadPie}
                    className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  >
                    Download
                  </button>
                </div>
                <div ref={pieChartRef} className="p-5">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.storageUsage}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}GB`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.storageUsage.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User Activity */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Weekly User Activity
                  </h2>
                  <button
                    onClick={handleDownloadBar1}
                    className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  >
                    Download
                  </button>
                </div>
            
                <div ref={barChartRef1} className="p-5">
                    <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.userActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="active" fill="#10B981" />
                    </BarChart>
                    </ResponsiveContainer>
                </div>

              </div>

              {/* File Formats */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    File Format Distribution
                  </h2>
                  <button
                    onClick={handleDownloadBar2}
                    className="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                  >
                    Download
                  </button>
                </div>

                <div  ref={barChartRef2} className="p-5">
                    <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.fileFormats} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="format" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8B5CF6" />
                    </BarChart>
                    </ResponsiveContainer>
                </div>

              </div>
            </div>
          </>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Activity Log
              </h2>
              <button
                onClick={exportActivityReport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export CSV
              </button>
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === "upload"
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                    >
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {activity.type === "upload" ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
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
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {activity.user}
                      </p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
            {activities.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No recent activity
              </div>
            )}
          </div>
        )}

        {/* Summary Footer */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{users.length}</p>
              <p className="text-sm opacity-90 mt-1">Total Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{files.length}</p>
              <p className="text-sm opacity-90 mt-1">Total Files</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">
                {stats?.chartsGenerated || 0}
              </p>
              <p className="text-sm opacity-90 mt-1">Charts Created</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{stats?.systemHealth || 0}%</p>
              <p className="text-sm opacity-90 mt-1">System Health</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm opacity-90">
              Report generated on {new Date().toLocaleDateString()} at{" "}
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
