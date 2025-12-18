// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import api from "../api";
// import toast, { Toaster } from "react-hot-toast";

// const UploadHistory = ({ theme = "light" }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchHistory = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const res = await api.get("/uploads/history", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       console.log("Fetched history:", res.data);
      
//       // Handle both array and object responses
//       const historyData = Array.isArray(res.data) ? res.data : res.data.uploads || [];
//       setHistory(historyData);
//     } catch (error) {
//       console.error("Error fetching uploads history:", error);
//       setError(error.response?.data?.message || "Failed to load upload history");
//       toast.error(error.response?.data?.message || "Failed to load upload history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
    
//     // Refresh when window gets focus (user switches back to tab)
//     const handleFocus = () => {
//       console.log("Window focused, refreshing upload history...");
//       fetchHistory();
//     };
    
//     window.addEventListener('focus', handleFocus);
    
//     // Auto-refresh every 30 seconds (reduced from 10)
//     const interval = setInterval(() => {
//       fetchHistory();
//     }, 30000);
    
//     return () => {
//       window.removeEventListener('focus', handleFocus);
//       clearInterval(interval);
//     };
//   }, [location, navigate]);

//   const handleDelete = async (fileId) => {
//     if (!window.confirm("Are you sure you want to delete this file?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       await api.delete(`/uploads/${fileId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       toast.success("File deleted successfully!");
//       // Refresh the list after deletion
//       fetchHistory();
//     } catch (error) {
//       console.error("Error deleting file:", error);
//       toast.error(error.response?.data?.message || "Failed to delete file. Please try again.");
//     }
//   };

//   const handleAnalyze = (item) => {
//     // Navigate to dashboard with file data
//     navigate("/dashboard", { state: { fileData: item } });
//   };

//   const formatFileSize = (bytes) => {
//     if (!bytes) return "0 MB";
//     const mb = bytes / (1024 * 1024);
//     return `${mb.toFixed(2)} MB`;
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "processed":
//         return "bg-green-100 text-green-800";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "processing":
//         return "bg-blue-100 text-blue-800";
//       case "failed":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Matching DashboardHome design
//   const bgColor = "bg-gradient-to-b from-[#fbf9fb] to-[#c4c799]";
//   const cardBg = "bg-white";
//   const textColor = "text-gray-900";
//   const borderColor = "border-gray-200";

//   if (loading) {
//     return (
//       <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#bc4e9c] border-t-transparent mx-auto mb-4"></div>
//           <p className={`${textColor} font-semibold text-lg`}>Loading upload history...</p>
//           <p className="text-gray-500 text-sm mt-2">Please wait...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen ${bgColor} p-8`}>
//       <Toaster position="top-center" />
      
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className={`text-4xl lg:text-5xl font-bold ${textColor} mb-2`}>Upload History</h1>
//               <p className="text-gray-600 text-lg">
//                 View and manage all your uploaded files 
//                 <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
//                   {history.length} {history.length === 1 ? "file" : "files"}
//                 </span>
//               </p>
//             </div>
//             <div className="flex gap-3">
//               {/* Manual Refresh Button */}
//               <button
//                 onClick={fetchHistory}
//                 className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
//                 title="Refresh history"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Refresh
//               </button>
//               <button
//                 onClick={() => navigate("/dashboard")}
//                 className="px-6 py-3 bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white rounded-xl font-semibold hover:from-[#a0428a] hover:to-[#e0064f] transition-all shadow-lg hover:shadow-xl"
//               >
//                 Back to Dashboard
//               </button>
//             </div>
//           </div>
//           <hr className="border-t-2 border-[#bc4e9c]" />
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
//             <div className="flex items-center">
//               <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//               <p className="text-red-800 font-medium">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Table */}
//         <div className={`${cardBg} rounded-2xl shadow-xl border-2 border-[#bc4e9c] overflow-hidden`}>
//           {history.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gradient-to-r from-[#561292] to-[#4a00e0]">
//                   <tr>
//                     <th className="px-6 py-4 text-left font-bold text-white">Filename</th>
//                     <th className="px-6 py-4 text-left font-bold text-white">Upload Date</th>
//                     <th className="px-6 py-4 text-left font-bold text-white">Size</th>
//                     <th className="px-6 py-4 text-left font-bold text-white">Status</th>
//                     <th className="px-6 py-4 text-center font-bold text-white">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {history.map((item, index) => (
//                     <tr
//                       key={item._id || item.id || index}
//                       className={`${
//                         index % 2 === 0 ? "bg-white" : "bg-gray-50"
//                       } hover:bg-blue-50 transition-colors`}
//                     >
//                       <td className="px-6 py-5">
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                             <svg
//                               className="w-5 h-5 text-white"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                               />
//                             </svg>
//                           </div>
//                           <div className="min-w-0">
//                             <span className={`font-semibold ${textColor} block truncate`}>
//                               {item.filename || item.originalname}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                               {(item.filename || item.originalname || '').split(".").pop().toUpperCase()}
//                             </span>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-5 text-gray-600">
//                         {new Date(item.createdAt || item.uploadedAt).toLocaleString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </td>
//                       <td className="px-6 py-5 text-gray-600 font-medium">
//                         {formatFileSize(item.size || item.filesize)}
//                       </td>
//                       <td className="px-6 py-5">
//                         <span
//                           className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
//                             item.status
//                           )}`}
//                         >
//                           {item.status || "Ready"}
//                         </span>
//                       </td>
//                       <td className="px-6 py-5">
//                         <div className="flex gap-2 justify-center">
//                           <button
//                             onClick={() => handleAnalyze(item)}
//                             className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                             title="Analyze File"
//                           >
//                             <svg
//                               className="w-5 h-5"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                               />
//                             </svg>
//                           </button>
//                           <button
//                             onClick={() => handleDelete(item._id || item.id)}
//                             className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
//                             title="Delete File"
//                           >
//                             <svg
//                               className="w-5 h-5"
//                               fill="none"
//                               stroke="currentColor"
//                               viewBox="0 0 24 24"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                               />
//                             </svg>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="text-center py-16 px-6">
//               <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-10 h-10 text-purple-600"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                   />
//                 </svg>
//               </div>
//               <h3 className={`text-xl font-bold ${textColor} mb-2`}>No uploads yet</h3>
//               <p className="text-gray-600 mb-6">
//                 Upload your first file to see it here
//               </p>
//               <button
//                 onClick={() => navigate("/dashboard")}
//                 className="px-6 py-3 bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white rounded-xl font-semibold hover:from-[#a0428a] hover:to-[#e0064f] transition-all shadow-lg"
//               >
//                 Go to Dashboard
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Summary Stats */}
//         {history.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
//             <div className={`${cardBg} rounded-xl shadow-md border ${borderColor} p-6`}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600 font-medium">Total Files</p>
//                   <p className={`text-3xl font-bold ${textColor} mt-1`}>{history.length}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             <div className={`${cardBg} rounded-xl shadow-md border ${borderColor} p-6`}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600 font-medium">Total Size</p>
//                   <p className={`text-3xl font-bold ${textColor} mt-1`}>
//                     {formatFileSize(history.reduce((sum, item) => sum + (item.size || item.filesize || 0), 0))}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             <div className={`${cardBg} rounded-xl shadow-md border ${borderColor} p-6`}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600 font-medium">Latest Upload</p>
//                   <p className={`text-lg font-bold ${textColor} mt-1`}>
//                     {history.length > 0
//                       ? new Date(history[0].createdAt || history[0].uploadedAt).toLocaleDateString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                         })
//                       : "N/A"}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadHistory;




// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Clock, FileText, TrendingUp, RefreshCw, Trash2, BarChart3, AlertCircle } from "lucide-react";
// import api from "../api";
// import toast, { Toaster } from "react-hot-toast";

// const UploadHistory = ({ theme = "light" }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [refreshing, setRefreshing] = useState(false);

//   const fetchHistory = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const res = await api.get("/uploads/history", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       console.log("Fetched history:", res.data);
      
//       const historyData = Array.isArray(res.data) ? res.data : res.data.uploads || [];
//       setHistory(historyData);
//     } catch (error) {
//       console.error("Error fetching uploads history:", error);
//       setError(error.response?.data?.message || "Failed to load upload history");
//       toast.error(error.response?.data?.message || "Failed to load upload history");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchHistory();
//     setRefreshing(false);
//     toast.success("History refreshed!");
//   };

//   useEffect(() => {
//     fetchHistory();
    
//     const handleFocus = () => {
//       console.log("Window focused, refreshing upload history...");
//       fetchHistory();
//     };
    
//     window.addEventListener('focus', handleFocus);
    
//     const interval = setInterval(() => {
//       fetchHistory();
//     }, 30000);
    
//     return () => {
//       window.removeEventListener('focus', handleFocus);
//       clearInterval(interval);
//     };
//   }, [location, navigate]);

//   const handleDelete = async (fileId) => {
//     if (!window.confirm("Are you sure you want to delete this file?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       await api.delete(`/uploads/${fileId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       toast.success("File deleted successfully!");
//       fetchHistory();
//     } catch (error) {
//       console.error("Error deleting file:", error);
//       toast.error(error.response?.data?.message || "Failed to delete file. Please try again.");
//     }
//   };

//   const handleAnalyze = (item) => {
//     navigate("/dashboard", { state: { fileData: item } });
//   };

//   const formatFileSize = (bytes) => {
//     if (!bytes) return "0 MB";
//     const mb = bytes / (1024 * 1024);
//     return `${mb.toFixed(2)} MB`;
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "processed":
//         return "bg-green-100 text-green-600";
//       case "pending":
//         return "bg-yellow-100 text-yellow-600";
//       case "processing":
//         return "bg-blue-100 text-blue-600";
//       case "failed":
//         return "bg-red-100 text-red-600";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   // Matching Analytics design
//   const bgColor = "bg-gradient-to-b from-[#fbf9fb] to-[#c4c799]";
//   const cardBg = "bg-white";
//   const textColor = "text-gray-900";
//   const borderColor = "border-gray-200";

//   if (loading) {
//     return (
//       <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#bc4e9c] border-t-transparent mx-auto mb-4"></div>
//           <p className={`${textColor} font-semibold text-lg`}>Loading upload history...</p>
//           <p className="text-gray-500 text-sm mt-2">Please wait...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen ${bgColor} p-8`}>
//       <Toaster position="top-center" />
      
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className={`text-4xl lg:text-5xl font-bold ${textColor} mb-2`}>Upload History</h1>
//               <p className="text-gray-600 text-lg">
//                 View and manage all your uploaded files
//               </p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 className="px-6 py-2 bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white rounded-xl font-semibold hover:from-[#a0428a] hover:to-[#e0064f] transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
//               >
//                 <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
//                 {refreshing ? 'Refreshing...' : 'Refresh'}
//               </button>
//             </div>
//           </div>
//           <hr className="border-t-2 border-[#bc4e9c]" />
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3">
//             <AlertCircle className="w-5 h-5 text-red-500" />
//             <p className="text-red-800 font-medium">{error}</p>
//           </div>
//         )}

//         {/* Stats Overview */}
//         {history.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className={`${cardBg} rounded-xl shadow-md border ${borderColor} p-6 hover:shadow-lg transition-all`}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Files</p>
//                   <p className={`text-3xl font-bold ${textColor}`}>{history.length}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
//                   <FileText className="w-6 h-6 text-white" />
//                 </div>
//               </div>
//             </div>

//             <div className={`${cardBg} rounded-xl shadow-md border ${borderColor} p-6 hover:shadow-lg transition-all`}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Storage</p>
//                   <p className={`text-3xl font-bold ${textColor}`}>
//                     {formatFileSize(history.reduce((sum, item) => sum + (item.size || item.filesize || 0), 0))}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
//                   <TrendingUp className="w-6 h-6 text-white" />
//                 </div>
//               </div>
//             </div>

//             <div className={`${cardBg} rounded-xl shadow-md border ${borderColor} p-6 hover:shadow-lg transition-all`}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Latest Upload</p>
//                   <p className={`text-lg font-bold ${textColor}`}>
//                     {new Date(history[0].createdAt || history[0].uploadedAt).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                       year: "numeric"
//                     })}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
//                   <Clock className="w-6 h-6 text-white" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Files Grid */}
//         {history.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {history.map((item, index) => (
//               <div
//                 key={item._id || item.id || index}
//                 className={`${cardBg} rounded-2xl shadow-lg border ${borderColor} p-6 hover:shadow-xl transition-all hover:-translate-y-1`}
//               >
//                 {/* File Icon & Name */}
//                 <div className="flex items-start gap-3 mb-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
//                     <FileText className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className={`font-bold text-lg ${textColor} truncate mb-1`}>
//                       {item.filename || item.originalname}
//                     </h3>
//                     <span className="text-xs text-gray-500 uppercase font-semibold">
//                       {(item.filename || item.originalname || '').split(".").pop()}
//                     </span>
//                   </div>
//                 </div>

//                 {/* File Details */}
//                 <div className="space-y-3 mb-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Size:</span>
//                     <span className="text-sm font-semibold text-gray-900">
//                       {formatFileSize(item.size || item.filesize)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Uploaded:</span>
//                     <span className="text-sm font-semibold text-gray-900">
//                       {new Date(item.createdAt || item.uploadedAt).toLocaleDateString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                         year: "numeric"
//                       })}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Status:</span>
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
//                       {item.status || "Ready"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleAnalyze(item)}
//                     className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
//                     title="Analyze File"
//                   >
//                     <BarChart3 className="w-4 h-4" />
//                     Analyze
//                   </button>
//                   <button
//                     onClick={() => handleDelete(item._id || item.id)}
//                     className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
//                     title="Delete File"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className={`${cardBg} rounded-2xl shadow-lg border-2 border-[#bc4e9c] p-12 text-center`}>
//             <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <FileText className="w-10 h-10 text-[#bc4e9c]" />
//             </div>
//             <h3 className={`text-xl font-bold ${textColor} mb-2`}>No Uploads Yet</h3>
//             <p className="text-gray-600 mb-6">
//               Upload your first file to see it here
//             </p>
//             <button
//               onClick={() => navigate("/dashboard")}
//               className="px-6 py-3 bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white rounded-xl font-semibold hover:from-[#a0428a] hover:to-[#e0064f] transition-all shadow-lg"
//             >
//               Go to Dashboard
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadHistory;


// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Clock, FileText, TrendingUp, Trash2, BarChart3, AlertCircle, Upload } from "lucide-react";
// import api from "../api";
// import toast, { Toaster } from "react-hot-toast";

// const UploadHistory = ({ theme = "light", onNavigateToDashboard }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchHistory = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         navigate("/login");
//         return;
//       }

//       const res = await api.get("/uploads/history", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       console.log("Fetched history:", res.data);
      
//       const historyData = Array.isArray(res.data) ? res.data : res.data.uploads || [];
//       // ✅ ADD THIS: Debug file sizes
// console.log("📊 File size debugging:");
// historyData.forEach((item, idx) => {
//   console.log(`File ${idx + 1}:`, {
//     filename: item.filename || item.originalname,
//     size: item.size,
//     filesize: item.filesize,
//     fileSize: item.fileSize
//   });
// });
//       setHistory(historyData);
//     } catch (error) {
//       console.error("Error fetching uploads history:", error);
//       setError(error.response?.data?.message || "Failed to load upload history");
//       toast.error(error.response?.data?.message || "Failed to load upload history");
//     } finally {
//       setLoading(false);
//     }
//   };

// useEffect(() => {
//     // Initial fetch
//     fetchHistory();
    
//     // Refresh on window focus
//     const handleFocus = () => {
//       console.log("👁️ Window focused, refreshing upload history...");
//       fetchHistory();
//     };
//     window.addEventListener('focus', handleFocus);
    
//     // Auto-refresh every 30 seconds
//     const interval = setInterval(() => {
//       console.log("🔄 Auto-refreshing upload history...");
//       fetchHistory();
//     }, 30000);
    
//     // Cleanup
//     return () => {
//       window.removeEventListener('focus', handleFocus);
//       clearInterval(interval);
//     };
//   }, [location.pathname]); // Only re-run if URL changes

//   const handleDelete = async (fileId) => {
//     if (!window.confirm("Are you sure you want to delete this file?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       await api.delete(`/uploads/${fileId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       toast.success("File deleted successfully!");
//       fetchHistory();
//     } catch (error) {
//       console.error("Error deleting file:", error);
//       toast.error(error.response?.data?.message || "Failed to delete file. Please try again.");
//     }
//   };

//  const handleAnalyze = (item) => {
//   navigate(`/dashboard/analysis/${item._id || item.id}`);
// };
// const formatFileSize = (bytes) => {
//   // Handle undefined/null
//   if (bytes === undefined || bytes === null) return "Unknown";
  
//   // Handle actual zero bytes (empty files)
//   if (bytes === 0) return "0 MB";
  
//   // Convert to MB
//   const mb = bytes / (1024 * 1024);
  
//   // If less than 0.01 MB, show in KB
//   if (mb < 0.01) {
//     const kb = bytes / 1024;
//     return `${kb.toFixed(2)} KB`;
//   }
  
//   return `${mb.toFixed(2)} MB`;
// };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "processed":
//         return "bg-green-100 text-green-600";
//       case "pending":
//         return "bg-yellow-100 text-yellow-600";
//       case "processing":
//         return "bg-blue-100 text-blue-600";
//       case "failed":
//         return "bg-red-100 text-red-600";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   // 🎨 Light theme to match Settings and other pages
//   const bgColor = "bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef]";
//   const cardBg = "bg-white";
//   const textColor = "text-gray-900";
//   const borderColor = "border-gray-200";
//   const accentGradient = "from-[#bc4e9c] to-[#f80759]";

//   if (loading) {
//     return (
//       <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#bc4e9c] border-t-transparent mx-auto mb-4"></div>
//           <p className={`${textColor} font-semibold text-lg`}>Loading upload history...</p>
//           <p className="text-gray-500 text-sm mt-2">Please wait...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen ${bgColor} p-8`}>
//       <Toaster position="top-center" />
      
//       <div className="max-w-7xl mx-auto">
//         {/* Header - NO REFRESH BUTTON */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className={`text-4xl lg:text-5xl font-bold ${textColor} mb-2`}>
//                 Upload History
//               </h1>
//               <p className="text-gray-600 text-lg">
//                 View and manage all your uploaded files
//               </p>
//             </div>
//           </div>
//           <hr className="border-t-2 border-[#bc4e9c]" />
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3">
//             <AlertCircle className="w-5 h-5 text-red-500" />
//             <p className="text-red-800 font-medium">{error}</p>
//           </div>
//         )}

//         {/* Stats Overview */}
//         {history.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className={`${cardBg} rounded-2xl shadow-xl border-2 ${borderColor} p-6 hover:shadow-2xl hover:scale-105 transition-all`}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Files</p>
//                   <p className={`text-4xl font-bold ${textColor}`}>{history.length}</p>
//                 </div>
//                 <div className={`w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg`}>
//                   <FileText className="w-7 h-7 text-white" />
//                 </div>
//               </div>
//             </div>

//             <div className={`${cardBg} rounded-2xl shadow-xl border-2 ${borderColor} p-6 hover:shadow-2xl hover:scale-105 transition-all`}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Storage</p>
//                   <p className={`text-4xl font-bold ${textColor}`}>
//   {formatFileSize(
//     history.reduce((sum, item) => {
//       const fileSize = item.size || item.filesize || item.fileSize || 0;
//       return sum + fileSize;
//     }, 0)
//   )}
// </p>
//                 </div>
//                 <div className={`w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg`}>
//                   <TrendingUp className="w-7 h-7 text-white" />
//                 </div>
//               </div>
//             </div>

//             <div className={`${cardBg} rounded-2xl shadow-xl border-2 ${borderColor} p-6 hover:shadow-2xl hover:scale-105 transition-all`}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Latest Upload</p>
//                   <p className={`text-lg font-bold ${textColor}`}>
//                     {new Date(history[0].createdAt || history[0].uploadedAt).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                       year: "numeric"
//                     })}
//                   </p>
//                 </div>
//                 <div className={`w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg`}>
//                   <Clock className="w-7 h-7 text-white" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Files Grid */}
//         {history.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {history.map((item, index) => (
//               <div
//                 key={item._id || item.id || index}
//                 className={`${cardBg} rounded-2xl shadow-xl border-2 ${borderColor} p-6 hover:shadow-2xl hover:scale-105 transition-all`}
//               >
//                 {/* File Icon & Name */}
//                 <div className="flex items-start gap-3 mb-4">
//                   <div className={`w-12 h-12 bg-gradient-to-br ${accentGradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
//                     <FileText className="w-6 h-6 text-white" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className={`font-bold text-lg ${textColor} truncate mb-1`}>
//                       {item.filename || item.originalname}
//                     </h3>
//                     <span className="text-xs text-gray-500 uppercase font-semibold">
//                       {(item.filename || item.originalname || '').split(".").pop()}
//                     </span>
//                   </div>
//                 </div>

//                 {/* File Details */}
//                 <div className="space-y-3 mb-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
//                  <div className="flex justify-between items-center">
//   <span className="text-sm text-gray-600">Size:</span>
//   <span className="text-sm font-semibold text-gray-900">
//     {formatFileSize(item.size || item.filesize || item.fileSize || 0)}
//   </span>
// </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Uploaded:</span>
//                     <span className="text-sm font-semibold text-gray-900">
//                       {new Date(item.createdAt || item.uploadedAt).toLocaleDateString("en-US", {
//                         month: "short",
//                         day: "numeric",
//                         year: "numeric"
//                       })}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Status:</span>
//                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
//                       {item.status || "Ready"}
//                     </span>
//                   </div>
//                   {(item.chartCount !== undefined || item.reportCount !== undefined) && (
//                     <>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Charts:</span>
//                         <span className="text-sm font-semibold text-gray-900">{item.chartCount || 0}</span>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Reports:</span>
//                         <span className="text-sm font-semibold text-gray-900">{item.reportCount || 0}</span>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {/* Action Buttons - FIXED ANALYZE BUTTON */}
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => handleAnalyze(item)}
//                     className={`flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
//                     title="Analyze File"
//                   >
//                     <BarChart3 className="w-4 h-4" />
//                     Analyze
//                   </button>
//                   <button
//                     onClick={() => handleDelete(item._id || item.id)}
//                     className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
//                     title="Delete File"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className={`${cardBg} rounded-3xl shadow-2xl border-2 border-gray-200 p-12 text-center`}>
//             <div className={`w-24 h-24 bg-gradient-to-br ${accentGradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}>
//               <Upload className="w-12 h-12 text-white" />
//             </div>
//             <h3 className={`text-2xl font-bold ${textColor} mb-3`}>No Uploads Yet</h3>
//             <p className="text-gray-600 mb-8 text-lg">
//               Upload your first file to see it here
//             </p>
//             <button
//               onClick={() => navigate("/dashboard")}
//               className={`px-8 py-4 bg-gradient-to-r ${accentGradient} text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all shadow-lg`}
//             >
//               Go to Dashboard
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UploadHistory;




import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Clock, FileText, TrendingUp, Trash2, BarChart3, AlertCircle, Upload, Download } from "lucide-react";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

const UploadHistory = ({ theme = "light", onNavigateToDashboard }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await api.get("/uploads/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const historyData = Array.isArray(res.data) ? res.data : res.data.uploads || [];
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching uploads history:", error);
      setError(error.response?.data?.message || "Failed to load upload history");
      toast.error(error.response?.data?.message || "Failed to load upload history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    
    const handleFocus = () => {
      fetchHistory();
    };
    window.addEventListener('focus', handleFocus);
    
    const interval = setInterval(() => {
      fetchHistory();
    }, 30000);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [location.pathname]);

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/uploads/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("File deleted successfully!");
      fetchHistory();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(error.response?.data?.message || "Failed to delete file. Please try again.");
    }
  };

  const handleAnalyze = (item) => {
    navigate(`/dashboard/analysis/${item._id || item.id}`);
  };

  const handleDownload = async (item) => {
    const fileId = item._id || item.id;
    const filename = item.filename || item.originalname || item.originalName || 'file';
    
    try {
      const token = localStorage.getItem("token");
      
      const response = await api.get(`/uploads/${fileId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('File downloaded successfully!', { duration: 2000 });
    } catch (error) {
      console.error('Download error:', error);
      
      if (error.response?.status === 404) {
        toast.error('File no longer available. It may have been cleaned up from the server.', {
          duration: 5000,
          icon: '⚠️'
        });
      } else {
        toast.error('Failed to download file. Please try again.', { duration: 3000 });
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null) return "Unknown";
    if (bytes === 0) return "0 MB";
    
    const mb = bytes / (1024 * 1024);
    if (mb < 0.01) {
      const kb = bytes / 1024;
      return `${kb.toFixed(2)} KB`;
    }
    
    return `${mb.toFixed(2)} MB`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "processed":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "processing":
        return "bg-blue-100 text-blue-600";
      case "failed":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const bgColor = "bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef]";
  const cardBg = "bg-white";
  const textColor = "text-gray-900";
  const borderColor = "border-gray-200";
  const accentGradient = "from-[#bc4e9c] to-[#f80759]";

  if (loading) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#bc4e9c] border-t-transparent mx-auto mb-4"></div>
          <p className={`${textColor} font-semibold text-lg`}>Loading upload history...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} p-8`}>
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-4xl lg:text-5xl font-bold ${textColor} mb-2`}>
                Upload History
              </h1>
              <p className="text-gray-600 text-lg">
                View and manage all your uploaded files
              </p>
            </div>
          </div>
          <hr className="border-t-2 border-[#bc4e9c]" />
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={`${cardBg} rounded-2xl shadow-xl border-2 ${borderColor} p-6 hover:shadow-2xl hover:scale-105 transition-all`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Files</p>
                  <p className={`text-4xl font-bold ${textColor}`}>{history.length}</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg`}>
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div className={`${cardBg} rounded-2xl shadow-xl border-2 ${borderColor} p-6 hover:shadow-2xl hover:scale-105 transition-all`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Total Storage</p>
                  <p className={`text-4xl font-bold ${textColor}`}>
                    {formatFileSize(
                      history.reduce((sum, item) => {
                        const fileSize = item.size || item.filesize || item.fileSize || 0;
                        return sum + fileSize;
                      }, 0)
                    )}
                  </p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg`}>
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div className={`${cardBg} rounded-2xl shadow-xl border-2 ${borderColor} p-6 hover:shadow-2xl hover:scale-105 transition-all`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Latest Upload</p>
                  <p className={`text-lg font-bold ${textColor}`}>
                    {new Date(history[0].createdAt || history[0].uploadedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg`}>
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, index) => (
              <div
                key={item._id || item.id || index}
                className={`${cardBg} rounded-2xl shadow-xl border-2 ${borderColor} p-6 hover:shadow-2xl hover:scale-105 transition-all`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${accentGradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-lg ${textColor} truncate mb-1`}>
                      {item.filename || item.originalname}
                    </h3>
                    <span className="text-xs text-gray-500 uppercase font-semibold">
                      {(item.filename || item.originalname || '').split(".").pop()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Size:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatFileSize(item.size || item.filesize || item.fileSize || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Uploaded:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(item.createdAt || item.uploadedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {item.status || "Ready"}
                    </span>
                  </div>
                </div>

                {/* Three-button layout: Analyze, Download, Delete */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAnalyze(item)}
                    className="flex-1 px-3 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm"
                    title="Analyze File"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analyze
                  </button>
                  <button
                    onClick={() => handleDownload(item)}
                    className="px-3 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id || item.id)}
                    className="px-3 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 hover:scale-105 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                    title="Delete File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${cardBg} rounded-3xl shadow-2xl border-2 border-gray-200 p-12 text-center`}>
            <div className={`w-24 h-24 bg-gradient-to-br ${accentGradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}>
              <Upload className="w-12 h-12 text-white" />
            </div>
            <h3 className={`text-2xl font-bold ${textColor} mb-3`}>No Uploads Yet</h3>
            <p className="text-gray-600 mb-8 text-lg">
              Upload your first file to see it here
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className={`px-8 py-4 bg-gradient-to-r ${accentGradient} text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all shadow-lg`}
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadHistory;