// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import api from "../api";

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
    
//     // Auto-refresh every 10 seconds
//     const interval = setInterval(() => {
//       fetchHistory();
//     }, 10000);
    
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
      
//       // Refresh the list after deletion
//       fetchHistory();
//     } catch (error) {
//       console.error("Error deleting file:", error);
//       alert(error.response?.data?.message || "Failed to delete file. Please try again.");
//     }
//   };

//   const handleAnalyze = (item) => {
//     // Navigate to analysis page with file data
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
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
//       case "processing":
//         return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
//       case "failed":
//         return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
//     }
//   };

//   const bgColor = theme === "dark" 
//     ? "bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900" 
//     : "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50";

//   const cardBg = theme === "dark" ? "bg-gray-800" : "bg-white";
//   const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
//   const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-200";

//   if (loading) {
//     return (
//       <div className={`min-h-screen ${bgColor} flex items-center justify-center`}>
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
//           <p className={`${textColor} font-semibold`}>Loading upload history...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen ${bgColor} p-8`}>
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className={`text-3xl font-bold ${textColor} mb-2`}>Upload History</h1>
//             <p className="text-gray-600 dark:text-gray-400">
//               View and manage all your uploaded files 
//               <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
//                 {history.length} {history.length === 1 ? "file" : "files"}
//               </span>
//             </p>
//           </div>
//           <div className="flex gap-3">
//             {/* Manual Refresh Button */}
//             <button
//               onClick={fetchHistory}
//               className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
//               title="Refresh history"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               Refresh
//             </button>
//             <button
//               onClick={() => navigate("/dashboard")}
//               className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg">
//             <div className="flex items-center">
//               <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//               <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Table */}
//         <div className={`${cardBg} rounded-2xl shadow-xl border ${borderColor} overflow-hidden`}>
//           {history.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
//                   <tr>
//                     <th className="px-6 py-4 text-left font-semibold">Filename</th>
//                     <th className="px-6 py-4 text-left font-semibold">Upload Date</th>
//                     <th className="px-6 py-4 text-left font-semibold">Size</th>
//                     <th className="px-6 py-4 text-left font-semibold">Status</th>
//                     <th className="px-6 py-4 text-center font-semibold">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {history.map((item, index) => (
//                     <tr
//                       key={item._id}
//                       className={`${
//                         index % 2 === 0 
//                           ? theme === "dark" ? "bg-gray-800" : "bg-white" 
//                           : theme === "dark" ? "bg-gray-750" : "bg-gray-50"
//                       } hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors`}
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
//                             <span className="text-xs text-gray-500 dark:text-gray-400">
//                               {(item.filename || item.originalname || '').split(".").pop().toUpperCase()}
//                             </span>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-5 text-gray-600 dark:text-gray-400">
//                         {new Date(item.createdAt || item.uploadedAt).toLocaleString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                           year: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </td>
//                       <td className="px-6 py-5 text-gray-600 dark:text-gray-400 font-medium">
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
//                             className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
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
//                             className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
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
//               <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <svg
//                   className="w-10 h-10 text-purple-600 dark:text-purple-400"
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
//               <p className="text-gray-600 dark:text-gray-400 mb-6">
//                 Upload your first file to see it here
//               </p>
//               <button
//                 onClick={() => navigate("/dashboard")}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
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
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Files</p>
//                   <p className={`text-3xl font-bold ${textColor} mt-1`}>{history.length}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             <div className={`${cardBg} rounded-xl shadow-md border ${borderColor} p-6`}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Size</p>
//                   <p className={`text-3xl font-bold ${textColor} mt-1`}>
//                     {formatFileSize(history.reduce((sum, item) => sum + (item.size || item.filesize || 0), 0))}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             <div className={`${cardBg} rounded-xl shadow-md border ${borderColor} p-6`}>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Latest Upload</p>
//                   <p className={`text-lg font-bold ${textColor} mt-1`}>
//                     {history.length > 0
//                       ? new Date(history[0].createdAt || history[0].uploadedAt).toLocaleDateString("en-US", {
//                           month: "short",
//                           day: "numeric",
//                         })
//                       : "N/A"}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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




import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import toast, { Toaster } from "react-hot-toast";

const UploadHistory = ({ theme = "light" }) => {
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
      
      console.log("Fetched history:", res.data);
      
      // Handle both array and object responses
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
    
    // Refresh when window gets focus (user switches back to tab)
    const handleFocus = () => {
      console.log("Window focused, refreshing upload history...");
      fetchHistory();
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Auto-refresh every 30 seconds (reduced from 10)
    const interval = setInterval(() => {
      fetchHistory();
    }, 30000);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [location, navigate]);

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/uploads/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast.success("File deleted successfully!");
      // Refresh the list after deletion
      fetchHistory();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(error.response?.data?.message || "Failed to delete file. Please try again.");
    }
  };

  const handleAnalyze = (item) => {
    // Navigate to dashboard with file data
    navigate("/dashboard", { state: { fileData: item } });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 MB";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "processed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Matching DashboardHome design
  const bgColor = "bg-gradient-to-b from-[#fbf9fb] to-[#c4c799]";
  const cardBg = "bg-white";
  const textColor = "text-gray-900";
  const borderColor = "border-gray-200";

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-4xl lg:text-5xl font-bold ${textColor} mb-2`}>Upload History</h1>
              <p className="text-gray-600 text-lg">
                View and manage all your uploaded files 
                <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                  {history.length} {history.length === 1 ? "file" : "files"}
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              {/* Manual Refresh Button */}
              <button
                onClick={fetchHistory}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                title="Refresh history"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white rounded-xl font-semibold hover:from-[#a0428a] hover:to-[#e0064f] transition-all shadow-lg hover:shadow-xl"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
          <hr className="border-t-2 border-[#bc4e9c]" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className={`${cardBg} rounded-2xl shadow-xl border-2 border-[#bc4e9c] overflow-hidden`}>
          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#561292] to-[#4a00e0]">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-white">Filename</th>
                    <th className="px-6 py-4 text-left font-bold text-white">Upload Date</th>
                    <th className="px-6 py-4 text-left font-bold text-white">Size</th>
                    <th className="px-6 py-4 text-left font-bold text-white">Status</th>
                    <th className="px-6 py-4 text-center font-bold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr
                      key={item._id || item.id || index}
                      className={`${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition-colors`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <span className={`font-semibold ${textColor} block truncate`}>
                              {item.filename || item.originalname}
                            </span>
                            <span className="text-xs text-gray-500">
                              {(item.filename || item.originalname || '').split(".").pop().toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-gray-600">
                        {new Date(item.createdAt || item.uploadedAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-5 text-gray-600 font-medium">
                        {formatFileSize(item.size || item.filesize)}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status || "Ready"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleAnalyze(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Analyze File"
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
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(item._id || item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete File"
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
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className={`text-xl font-bold ${textColor} mb-2`}>No uploads yet</h3>
              <p className="text-gray-600 mb-6">
                Upload your first file to see it here
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white rounded-xl font-semibold hover:from-[#a0428a] hover:to-[#e0064f] transition-all shadow-lg"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {history.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className={`${cardBg} rounded-xl shadow-md border ${borderColor} p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Files</p>
                  <p className={`text-3xl font-bold ${textColor} mt-1`}>{history.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className={`${cardBg} rounded-xl shadow-md border ${borderColor} p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Size</p>
                  <p className={`text-3xl font-bold ${textColor} mt-1`}>
                    {formatFileSize(history.reduce((sum, item) => sum + (item.size || item.filesize || 0), 0))}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
              </div>
            </div>

            <div className={`${cardBg} rounded-xl shadow-md border ${borderColor} p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Latest Upload</p>
                  <p className={`text-lg font-bold ${textColor} mt-1`}>
                    {history.length > 0
                      ? new Date(history[0].createdAt || history[0].uploadedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadHistory;