// import React, { useState, useEffect } from 'react';

// export default function FileManagement() {
//   const [files, setFiles] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     // TODO: Replace with actual API call
//     setFiles([
//       { id: 1, userId: 1, userName: 'Meenakshi', fileName: 'Sales_Data_Q1.xlsx', uploadDate: '2025-10-07', size: '2.4 MB', status: 'Processed' },
//       { id: 2, userId: 1, userName: 'Meenakshi', fileName: 'Employee_Records.csv', uploadDate: '2025-10-06', size: '1.8 MB', status: 'Ready' },
//       { id: 3, userId: 2, userName: 'Rajasree Reji', fileName: 'Financial_Report.xlsx', uploadDate: '2025-10-08', size: '3.2 MB', status: 'Processing' },
//       { id: 4, userId: 2, userName: 'Rajasree Reji', fileName: 'Inventory_Data.csv', uploadDate: '2025-10-05', size: '1.5 MB', status: 'Processed' },
//       { id: 5, userId: 4, userName: 'Sarah Smith', fileName: 'Marketing_Analytics.xlsx', uploadDate: '2025-10-04', size: '4.1 MB', status: 'Processed' },
//     ]);
//   }, []);

//   const handleDeleteFile = async (fileId) => {
//     if (window.confirm('Are you sure you want to delete this file?')) {
//       // TODO: Call API to delete file
//       setFiles(files.filter(f => f.id !== fileId));
//     }
//   };

//   const handleDownloadFile = (fileId) => {
//     // TODO: Implement file download
//     alert('Download functionality will be implemented with backend API');
//   };

//   const filteredFiles = files.filter(file =>
//     file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     file.userName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="p-8">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">File Management</h1>
//           <p className="text-gray-600 mb-6">Monitor and manage all uploaded files</p>

//           {/* Search Bar */}
//           <div className="relative">
//             <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//             <input
//               type="text"
//               placeholder="Search files by name or user..."
//               className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Files Grid */}
//         <div className="grid grid-cols-1 gap-4">
//           {filteredFiles.length === 0 ? (
//             <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               <p className="text-gray-600 font-medium">No files found</p>
//             </div>
//           ) : (
//             filteredFiles.map((file) => (
//               <div key={file.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4 flex-1">
//                     <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//                       <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-lg font-semibold text-gray-900">{file.fileName}</h3>
//                       <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
//                         <span>Uploaded by: <span className="font-semibold">{file.userName}</span></span>
//                         <span>•</span>
//                         <span>{file.size}</span>
//                         <span>•</span>
//                         <span>{new Date(file.uploadDate).toLocaleDateString()}</span>
//                       </div>
//                     </div>
//                     <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                       file.status === 'Processed' ? 'bg-green-100 text-green-800' :
//                       file.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
//                       'bg-blue-100 text-blue-800'
//                     }`}>
//                       {file.status}
//                     </span>
//                   </div>
//                   <div className="flex gap-2 ml-4">
//                     <button
//                       onClick={() => handleDownloadFile(file.id)}
//                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                       title="Download"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                       </svg>
//                     </button>
//                     <button
//                       className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
//                       title="View Details"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                       </svg>
//                     </button>
//                     <button
//                       onClick={() => handleDeleteFile(file.id)}
//                       className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                       title="Delete"
//                     >
//                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { adminAPI } from "../../api";

export default function FileManagement() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllFiles();
      setFiles(response.data?.files || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await adminAPI.deleteFile(fileId);
        setFiles(files.filter((f) => f.id !== fileId));
        alert("File deleted successfully");
      } catch (err) {
        console.error("Error deleting file:", err);
        alert("Failed to delete file");
      }
    }
  };

  const handleDownload = async (fileId) => {
    try {
      const response = await adminAPI.downloadFile(fileId);

      // Extract filename from Content-Disposition header
      const disposition = response.headers["content-disposition"];
      let filename = `file_${fileId}`;
      if (disposition && disposition.includes("filename=")) {
        filename = disposition
          .split("filename=")[1]
          .replace(/['"]/g, "")
          .trim();
      }

      // Create Blob with correct MIME type
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file");
    }
  };

  const filteredFiles = files.filter((file) => {
    // Safety checks for undefined/null values
    const fileName = file.fileName || "";
    const userName = file.userName || "";
    const fileStatus = file.status || "Unknown";

    const matchesSearch =
      fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || fileStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getFileTypeIcon = (fileName) => {
    if (!fileName) return "📁";
    const ext = fileName.split(".").pop().toLowerCase();
    const icons = {
      xlsx: "📊",
      xls: "📊",
      csv: "📋",
      pdf: "📄",
      json: "⚙️",
      txt: "📝",
    };
    return icons[ext] || "📁";
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading files...</p>
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
                File Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage uploaded Excel and data files
              </p>
            </div>
            <button
              onClick={fetchFiles}
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
                placeholder="Search files by name or uploader..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Processed">Processed</option>
              <option value="Processing">Processing</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Files List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">
                    File Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Uploaded By
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Size</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Upload Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
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
                            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                          />
                        </svg>
                        <p className="font-medium">No files found</p>
                        {searchTerm && (
                          <p className="text-sm mt-1">
                            Try adjusting your search
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredFiles.map((file, index) => (
                    <tr
                      key={file.id || index}
                      className={
                        index % 2 === 0
                          ? "bg-white hover:bg-gray-50"
                          : "bg-gray-50 hover:bg-gray-100"
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {getFileTypeIcon(file.fileName)}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {file.fileName || "Unnamed File"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {file.userName || "Unknown User"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {file.size || "0 KB"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {file.uploadDate
                          ? new Date(file.uploadDate).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            file.status === "Processed"
                              ? "bg-green-100 text-green-800"
                              : file.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : file.status === "Failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {file.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {/* Download button */}
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Download"
                            onClick={() => handleDownload(file.id)}
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
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>

                          {/* View button */}
                          <button
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                            title="View Details"
                            onClick={() =>
                              alert(
                                `File: ${file.fileName}\nUploader: ${file.userName}\nSize: ${file.size}`
                              )
                            }
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

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteFile(file.id)}
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
            <p className="text-sm text-gray-600">Total Files</p>
            <p className="text-2xl font-bold text-gray-900">{files.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <p className="text-sm text-gray-600">Processed</p>
            <p className="text-2xl font-bold text-green-600">
              {files.filter((f) => f.status === "Processed").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <p className="text-sm text-gray-600">Processing</p>
            <p className="text-2xl font-bold text-blue-600">
              {files.filter((f) => f.status === "Processing").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <p className="text-sm text-gray-600">Failed</p>
            <p className="text-2xl font-bold text-red-600">
              {files.filter((f) => f.status === "Failed").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
