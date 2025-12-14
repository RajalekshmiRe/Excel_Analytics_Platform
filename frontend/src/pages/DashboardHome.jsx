// import React, { useState, useEffect, useRef } from "react";
// import {
//   Upload,
//   BarChart3,
//   FileSpreadsheet,
//   Brain,
//   Handshake,
//   FileText,
//   Map,
//   X,
//   Download,
//   PieChart,
//   TrendingUp,
// } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart as RechartsPie,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import toast, { Toaster } from "react-hot-toast";
// import ExportModal from "../components/ExportModal";
// import { adminAPI, userAPI } from "../api";
// import * as XLSX from "xlsx";
// import api from "../api";

// export default function DashboardHome({ currentUser, theme }) {
//   const [file, setFile] = useState(null);
//   const [fileData, setFileData] = useState(null);
//   const [stats, setStats] = useState({
//     uploads: 0,
//     storage: "0 MB",
//     reports: 0,
//     charts: 0,
//   });
//   const [activeModal, setActiveModal] = useState(null);
//   const [chartConfig, setChartConfig] = useState({
//     type: "bar",
//     xAxis: "",
//     yAxis: "",
//   });
//   const [mappingConfig, setMappingConfig] = useState({
//     sourceCol: "",
//     targetCol: "",
//     transformation: "none",
//   });
//   const [mappedData, setMappedData] = useState(null);
//   const [generatedChart, setGeneratedChart] = useState(null);
//   const [uploadRes, setUploadRes] = useState(null);

//   const fileInputRef = useRef();
//   const tableRef = useRef();
//   const chartRef = useRef();

//   // Default / fallback stats
//   const savedStats = { uploads: 0, storage: "0 MB", reports: 0, charts: 0 };

//   // Function to fetch user stats
//   const viewUserDetails = async (id) => {
//     try {
//       const response = await adminAPI.getUserStats(id);
//       const data = response.data;
//       setStats({
//         uploads: data.stats.totalUploads,
//         storage: data.stats.storageUsed + ' ' + data.stats.storageUnit,
//         reports: data.stats.activeReports,
//         charts: data.stats.chartsGenerated,
//       });
//     } catch (err) {
//       console.error("Error fetching user details:", err);
//       // fallback to default stats
//       setStats(savedStats);
//     }
//   };

//   // Call on page load (mount)
//   useEffect(() => {
//     if (currentUser?.id) {
//       viewUserDetails(currentUser.id);
//     } else {
//       setStats(savedStats);
//     }
//   }, [currentUser]);

//   const StatCard = ({ icon, title, value, subtitle, color, badge }) => {
//     const colorClasses = {
//       purple: "from-purple-500 to-pink-500",
//       orange: "from-orange-500 to-red-500",
//       blue: "from-blue-500 to-cyan-500",
//       green: "from-green-500 to-emerald-500",
//       red: "from-red-500 to-pink-600",
//       brown: "from-brown-200 to-gray-300",
//     };

//     return (
//       <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all relative">
//         {badge && (
//           <div className="absolute top-4 right-4">
//             <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
//               !
//             </span>
//           </div>
//         )}

//         {/* Icon & Title Inline */}
//         <div className="flex items-center mb-4 gap-3">
//           <div
//             className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-md`}
//           >
//             <div className="text-white">{icon}</div>
//           </div>
//           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//             {title}
//           </p>
//         </div>

//         <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
//         <p className="text-sm text-gray-500">{subtitle}</p>
//       </div>
//     );
//   };

//   const handleFileUpload = async (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;

//     const validTypes = [".csv", ".xlsx", ".xls"];
//     const fileExtension = selected.name
//       .substring(selected.name.lastIndexOf("."))
//       .toLowerCase();

//     if (!validTypes.includes(fileExtension)) {
//       toast.error("Please upload a CSV, XLS, or XLSX file!");
//       return;
//     }

//     setFile(selected);

//     // ============================================================
//     // UPLOAD TO BACKEND FIRST
//     // ============================================================
//     try {
//       const formData = new FormData();
//       formData.append("file", selected);

//       // Show loading toast
//       const loadingToast = toast.loading("Uploading file...");

//       console.log("📤 Starting upload:", {
//         fileName: selected.name,
//         fileSize: selected.size,
//         fileType: selected.type
//       });

//       // ✅ CORRECT - proper axios syntax with api instance
//       const response = await api.post('/uploads', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       // Dismiss loading toast
//       toast.dismiss(loadingToast);

//       console.log("✅ Upload successful:", response.data);

//       // Set upload response data
//       setUploadRes(response.data.file || response.data);

//       toast.success("File uploaded successfully! Check Upload History to view it.");

//       // Update stats
//       setStats((prev) => ({
//         ...prev,
//         uploads: prev.uploads + 1,
//         storage: `${(
//           parseFloat(prev.storage) +
//           selected.size / 1048576
//         ).toFixed(2)} MB`,
//       }));

//     } catch (error) {
//       toast.dismiss();
//       setUploadRes(null);
//       console.error("❌ Upload error:", error);
      
//       const errorMsg = error.response?.data?.message || 
//                       error.message || 
//                       "Failed to upload file to server!";
      
//       toast.error(errorMsg);
//       return; // Stop here if backend upload fails
//     }

//     // ============================================================
//     // CONTINUE WITH LOCAL PREVIEW (CSV & EXCEL)
//     // ============================================================
//     if (fileExtension === ".csv") {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const content = event.target.result;
//         const lines = content.split("\n").filter((line) => line.trim());

//         if (lines.length === 0) {
//           toast.error("File is empty!");
//           return;
//         }

//         const rows = lines.map((line) => {
//           const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
//           const matches = [];
//           let match;
//           while ((match = regex.exec(line)) !== null) {
//             matches.push(match[0].replace(/^"|"$/g, "").trim());
//           }
//           return matches.length > 0
//             ? matches
//             : line.split(",").map((cell) => cell.trim());
//         });

//         setFileData({
//           headers: rows[0] || [],
//           rows: rows.slice(1, 31),
//         });
//       };

//       reader.onerror = () => {
//         toast.error("Failed to read file!");
//       };

//       reader.readAsText(selected);
      
//     } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
//       // Handle Excel files
//       const reader = new FileReader();
      
//       reader.onload = (event) => {
//         try {
//           const data = new Uint8Array(event.target.result);
          
//           // Use the already imported XLSX
//           const workbook = XLSX.read(data, { type: 'array' });
          
//           // Get the first sheet
//           const firstSheetName = workbook.SheetNames[0];
//           const worksheet = workbook.Sheets[firstSheetName];
          
//           // Convert to JSON (array of arrays)
//           const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
//           if (jsonData.length === 0) {
//             toast.error("File is empty!");
//             return;
//           }
          
//           // Filter out empty rows
//           const filteredData = jsonData.filter(row => 
//             row.some(cell => cell !== null && cell !== undefined && cell !== '')
//           );
          
//           setFileData({
//             headers: filteredData[0] || [],
//             rows: filteredData.slice(1, 31), // Show first 30 rows
//           });
          
//           console.log("✅ Excel file parsed successfully");
//         } catch (error) {
//           console.error("❌ Error parsing Excel file:", error);
//           toast.error("Failed to parse Excel file!");
//         }
//       };

//       reader.onerror = () => {
//         toast.error("Failed to read Excel file!");
//       };

//       reader.readAsArrayBuffer(selected);
//     }
//   };

//   const closePreview = () => {
//     setFile(null);
//     setFileData(null);
//     setMappedData(null);
//     setGeneratedChart(null);
//   };

//   const handleCreateChart = () => {
//     if (!fileData) {
//       toast.error("Please upload a file first!");
//       return;
//     }
//     if (fileData.headers.length === 0) {
//       toast.error("No data columns found in the file!");
//       return;
//     }
//     setChartConfig({ type: "bar", xAxis: "", yAxis: "" });
//     setActiveModal("chart");
//   };

//   const handleDataMapping = () => {
//     if (!fileData) {
//       toast.error("Please upload a file first!");
//       return;
//     }
//     setActiveModal("mapping");
//   };

//   const handleExport = () => {
//     if (!fileData) {
//       toast.error("Please upload a file first!");
//       return;
//     }
//     setActiveModal("export");
//   };

//   const generateChart = async () => {
//     if (!chartConfig.xAxis || !chartConfig.yAxis) {
//       toast.error("Please select both X and Y axes!");
//       return;
//     }

//     const xIndex = fileData.headers.indexOf(chartConfig.xAxis);
//     const yIndex = fileData.headers.indexOf(chartConfig.yAxis);

//     if (xIndex === -1 || yIndex === -1) {
//       toast.error("Invalid column selection!");
//       return;
//     }

//     const chartData = fileData.rows
//       .map((row, idx) => {
//         const xValue = row[xIndex];
//         const yValue = row[yIndex];

//         let numericValue = parseFloat(
//           yValue?.toString().replace(/[^0-9.-]/g, "")
//         );

//         if (!xValue || xValue === "" || isNaN(numericValue)) {
//           return null;
//         }

//         return {
//           name: xValue.toString().substring(0, 30),
//           value: numericValue,
//           originalIndex: idx,
//         };
//       })
//       .filter((item) => item !== null);

//     if (chartData.length === 0) {
//       toast.error(
//         "No valid numeric data found for the selected Y-axis column!"
//       );
//       return;
//     }

//     setGeneratedChart({
//       data: chartData,
//       config: chartConfig,
//       xAxisLabel: chartConfig.xAxis,
//       yAxisLabel: chartConfig.yAxis,
//     });

//     // Update chart count in backend if upload ID exists
//     if (uploadRes?.id) {
//       try {
//         await userAPI.updateChart(uploadRes.id);
//       } catch (error) {
//         console.error("Error updating chart count:", error);
//       }
//     }

//     setStats((prev) => ({ ...prev, charts: prev.charts + 1 }));
//     setActiveModal(null);
//     toast.success(
//       `Chart created successfully with ${chartData.length} data points!`
//     );
//   };

//   const applyMapping = () => {
//     if (!mappingConfig.sourceCol || !mappingConfig.targetCol) {
//       toast.error("Please select source and target columns!");
//       return;
//     }

//     const sourceIdx = fileData.headers.indexOf(mappingConfig.sourceCol);
//     const targetIdx = fileData.headers.indexOf(mappingConfig.targetCol);

//     if (sourceIdx === -1 || targetIdx === -1) {
//       toast.error("Invalid column selection!");
//       return;
//     }

//     const numericTransformations = ["double", "half"];
//     if (numericTransformations.includes(mappingConfig.transformation)) {
//       const firstValue = fileData.rows[0]?.[sourceIdx];
//       const testNumeric = parseFloat(
//         firstValue?.toString().replace(/[^0-9.-]/g, "")
//       );

//       if (isNaN(testNumeric)) {
//         toast.error(
//           `Cannot apply numeric transformation "${mappingConfig.transformation}" to non-numeric column "${mappingConfig.sourceCol}"! Please select a numeric column or use text transformations.`
//         );
//         return;
//       }
//     }

//     const newRows = fileData.rows.map((row) => {
//       const newRow = [...row];
//       let value = row[sourceIdx];

//       switch (mappingConfig.transformation) {
//         case "uppercase":
//           value = value?.toString().toUpperCase();
//           break;
//         case "lowercase":
//           value = value?.toString().toLowerCase();
//           break;
//         case "double":
//           const doubleVal = parseFloat(
//             value?.toString().replace(/[^0-9.-]/g, "")
//           );
//           value = isNaN(doubleVal) ? value : (doubleVal * 2).toString();
//           break;
//         case "half":
//           const halfVal = parseFloat(
//             value?.toString().replace(/[^0-9.-]/g, "")
//           );
//           value = isNaN(halfVal) ? value : (halfVal / 2).toString();
//           break;
//         case "none":
//         default:
//           break;
//       }

//       newRow[targetIdx] = value;
//       return newRow;
//     });

//     setMappedData({
//       headers: fileData.headers,
//       rows: newRows,
//     });

//     setActiveModal(null);
//     toast.success(
//       `Data mapping applied successfully! ${mappingConfig.sourceCol} → ${mappingConfig.targetCol}`
//     );
//   };

//   // HELPER FUNCTION: Convert fileData to array format for export
//   const getExportData = () => {
//     const dataToExport = mappedData || fileData;
//     if (!dataToExport) return null;

//     // Convert to array format [headers, ...rows]
//     return [dataToExport.headers, ...dataToExport.rows];
//   };

//   const COLORS = [
//     "#3b82f6",
//     "#10b981",
//     "#f59e0b",
//     "#ef4444",
//     "#8b5cf6",
//     "#ec4899",
//     "#14b8a6",
//     "#f97316",
//   ];

//   const cardGradient =
//     theme === "dark"
//       ? "bg-gradient-to-br from-blue-900 to-blue-800"
//       : "bg-gradient-to-br from-blue-50 to-blue-100";
//   const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  
//   return (
//     <div className={`w-full min-h-screen bg-gradient-to-b from-[#fbf9fb] to-[#c4c799] transition-all`}>
//       <Toaster position="top-center" />

//       {/* Welcome Section */}
//       <div className="px-8 lg:px-12 pt-12 pb-6">
//         <h1 className="text-4xl lg:text-5xl font-bold flex items-center gap-3">
//           Welcome, {currentUser.name}!{" "}
//           <Handshake className="text-[#bc4e9c]" size={40} />
//         </h1>
//         <p className="text-[#9CA3AF] mt-3 text-lg">
//           Manage your data with ease and efficiency
//         </p>
//       </div>

//       {/* Stats Section */}
//       <div className="px-8 lg:px-12 py-10">
//         <h2 className="text-2xl lg:text-3xl font-bold mb-8">Your Statistics</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
//           <StatCard
//             icon={
//               <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />
//             }
//             title="Total Uploads"
//             value={stats.uploads}
//             color="brown"
//           />

//           <StatCard
//             icon={
//               <FileSpreadsheet className="h-8 w-8 text-blue-600 dark:text-blue-400" />
//             }
//             title="Storage Used"
//             value={stats.storage}
//             color="brown"
//           />

//           <StatCard
//             icon={
//               <Brain className="h-8 w-8 text-pink-600 dark:text-pink-400" />
//             }
//             title="Active Reports"
//             value={stats.reports}
//             color="brown"
//           />

//           <StatCard
//             icon={
//               <BarChart3 className="h-8 w-8 text-red-600 dark:text-red-400" />
//             }
//             title="Charts Generated"
//             value={stats.charts}
//             color="brown"
//           />
//         </div>
//       </div>

//       <div className="px-8 lg:px-12 py-2">
//         <hr className="border-t-2 border-[#bc4e9c] " />
//       </div>

//       {/* Upload Section */}
//       <div className="px-8 lg:px-12 py-10">
//         <h2 className="text-2xl lg:text-3xl font-bold mb-8">
//           Upload Your Data
//         </h2>
//         <div
//           className={`p-12 lg:p-5 rounded-3xl shadow-2xl ${cardGradient} border-2 border-[#bc4e9c] transition-all`}
//         >
//           <div className="flex flex-col items-center justify-center gap-8 py-8">
//             <div className="p-8 rounded-3xl bg-[#F472B6]/25 transition-all">
//               <Upload className="h-8 w-8 text-[#561292]" />
//             </div>
//             <div className="text-center">
//               <h3 className="text-2xl lg:text-3xl font-bold mb-3">
//                 Upload CSV, XLS, or XLSX Files
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 text-lg">
//                 Drag and drop or click to select files
//               </p>
//             </div>
//             <input
//               type="file"
//               accept=".xlsx,.xls,.csv"
//               ref={fileInputRef}
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//             <button
//               onClick={() => fileInputRef.current.click()}
//               className="bg-gradient-to-t from-[#bc4e9c] to-[#f80759] text-white px-12 py-4 rounded-2xl shadow-lg hover:shadow-2xl hover:from-[#7a3366] hover:to-[#ae063e] transition-all font-bold text-lg"
//             >
//               Choose File
//             </button>
//             {file && (
//               <p className={`text-[#bc4e9c] font-bold text-lg break-all`}>
//                 ✓ {file.name}
//               </p>
//             )}
//           </div>

//           {/* File Preview */}
//           {(fileData || mappedData) && (
//             <div className="mt-10 bg-[#e8bef270] rounded-3xl p-8 border-2 border-[#bc4e9c] shadow-lg">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="font-bold text-2xl text-white dark:text-black">
//                   {file.name} {mappedData && "(Mapped)"}
//                 </h3>
//                 <button
//                   onClick={closePreview}
//                   className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transition-all font-bold flex items-center"
//                 >
//                   Close Preview
//                 </button>
//               </div>
//               <div
//                 ref={tableRef}
//                 className="max-h-96 overflow-x-auto overflow-y-auto rounded-2xl border-2 border-[#bc4e9c]"
//               >
//                 <table className="w-full border-collapse text-base bg-gray-100">
//                   <thead className="bg-gradient-to-t from-[#561292] to-[#4a00e0] sticky top-0">
//                     <tr>
//                       {(mappedData || fileData).headers.map((header, idx) => (
//                         <th
//                           key={idx}
//                           className="border border-[#bc4e9c] px-6 py-4 text-left font-bold text-white"
//                         >
//                           {header}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(mappedData || fileData).rows.map((row, rowIdx) => (
//                       <tr
//                         key={rowIdx}
//                         className={`${
//                           rowIdx % 2 === 0
//                             ? "bg-gray-100"
//                             : "bg-gray-200"
//                         } hover:bg-gray-100 dark:hover:bg-gray-300 transition `}
//                       >
//                         {row.map((cell, cellIdx) => (
//                           <td
//                             key={cellIdx}
//                             className="border border-[#4a00e0] px-6 py-3 text-black"
//                           >
//                             {cell}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Generated Chart Display */}
//           {generatedChart &&
//             generatedChart.data &&
//             generatedChart.data.length > 0 && (
//               <div className="mt-10 bg-blue-100 rounded-3xl p-8 border-2 border-[#bc4e9c] shadow-lg">
//                 <div className="flex justify-between items-center mb-6">
//                   <div>
//                     <h3 className="font-bold text-2xl text-white dark:text-black">Generated Chart</h3>
//                     <p className="text-sm text-gray-600 dark:text-gray-800 mt-1">
//                       {generatedChart.xAxisLabel} vs {generatedChart.yAxisLabel}{" "}
//                       ({generatedChart.data.length} points)
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setActiveModal("export")}
//                     className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all font-bold flex items-center gap-2"
//                   >
//                     <Download size={18} />
//                     Export Chart
//                   </button>
//                 </div>
//                 <div
//                   ref={chartRef}
//                   style={{
//                     width: "100%",
//                     height: "533px",
//                     backgroundColor: theme === "dark" ? "rgba(215, 217, 222, 0.47)" : "#ffffff",
//                     padding: "30px",
//                     borderRadius: "12px",
//                   }}
//                 >
//                   {generatedChart.config.type === "bar" && (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={generatedChart.data}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="name"
//                           angle={-45}
//                           textAnchor="end"
//                           height={100}
//                           interval={0}
//                         />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar
//                           dataKey="value"
//                           fill="#3b82f6"
//                           name={generatedChart.yAxisLabel}
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   )}
//                   {generatedChart.config.type === "line" && (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={generatedChart.data}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="name"
//                           angle={-90}
//                           textAnchor="end"
//                           height={100}
//                         />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Line
//                           type="monotone"
//                           dataKey="value"
//                           stroke="#3b82f6"
//                           strokeWidth={2}
//                           name={generatedChart.yAxisLabel}
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   )}
//                   {generatedChart.config.type === "pie" && (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <RechartsPie>
//                         <Pie
//                           data={generatedChart.data}
//                           dataKey="value"
//                           nameKey="name"
//                           cx="50%"
//                           cy="50%"
//                           outerRadius={150}
//                           label={(entry) => `${entry.name}: ${entry.value}`}
//                         >
//                           {generatedChart.data.map((entry, index) => (
//                             <Cell
//                               key={`cell-${index}`}
//                               fill={COLORS[index % COLORS.length]}
//                             />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                         <Legend />
//                       </RechartsPie>
//                     </ResponsiveContainer>
//                   )}
//                 </div>
//               </div>
//             )}
//         </div>
//       </div>

//       <div className="px-8 lg:px-12 py-2">
//         <hr className="border-t-2 border-[#bc4e9c]" />
//       </div>

//       {/* Features Section */}
//       <div className="px-8 lg:px-12 py-10">
//         <h2 className="text-2xl lg:text-3xl font-bold mb-10">Key Features</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
//           {[
//             {
//               title: "Create Charts",
//               icon: BarChart3,
//               desc: "Generate stunning visual insights from your data",
//               action: handleCreateChart,
//             },
//             {
//               title: "Data Mapping",
//               icon: Map,
//               desc: "Map and organize your data with precision",
//               action: handleDataMapping,
//             },
//             {
//               title: "Export Reports",
//               icon: FileText,
//               desc: "Export detailed reports in multiple formats",
//               action: handleExport,
//             },
//           ].map(({ title, icon: Icon, desc, action }) => (
//             <div
//               key={title}
//               className={`p-10 lg:p-12 rounded-3xl shadow-2xl flex flex-col items-center gap-6 transition-all duration-300 hover:shadow-3xl hover:scale-105 ${cardGradient} border-2 border-[#bc4e9c] group`}
//             >
//               <div className="p-6 bg-[#F472B6]/25 group-hover:bg-[#F472B6]/35 rounded-2xl transition-all">
//                 <Icon className="h-12 w-12 text-[#561292]" />
//               </div>
//               <h3
//                 className={`text-2xl lg:text-3xl font-bold text-center ${textColor}`}
//               >
//                 {title}
//               </h3>
//               <p className="text-[#9CA3AF] text-center text-lg">
//                 {desc}
//               </p>
//               <button
//                 onClick={action}
//                 className="bg-gradient-to-t from-[#bc4e9c] to-[#f80759] hover:from-[#7a3366] hover:to-[#ae063e] text-white px-10 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold text-lg"
//               >
//                 Explore
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chart Creation Modal */}
//       {activeModal === "chart" && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div
//             className={`${cardGradient} rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-[#bc4e9c]`}
//           >
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-2xl font-bold">Create Chart</h3>
//               <button
//                 onClick={() => setActiveModal(null)}
//                 className="hover:text-gray-700 dark:hover:text-gray-500"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-bold mb-2">
//                   Chart Type
//                 </label>
//                 <select
//                   value={chartConfig.type}
//                   onChange={(e) =>
//                     setChartConfig({ ...chartConfig, type: e.target.value })
//                   }
//                   className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
//                 >
//                   <option value="bar">Bar Chart</option>
//                   <option value="line">Line Chart</option>
//                   <option value="pie">Pie Chart</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold mb-2">
//                   X-Axis Column (Labels)
//                 </label>
//                 <select
//                   value={chartConfig.xAxis}
//                   onChange={(e) =>
//                     setChartConfig({ ...chartConfig, xAxis: e.target.value })
//                   }
//                   className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
// >
// <option value="">Select column...</option>
// {fileData?.headers.map((header, idx) => (
// <option key={idx} value={header}>
// {header}
// </option>
// ))}
// </select>
// </div>
// <div>
//             <label className="block text-sm font-bold mb-2">
//               Y-Axis Column (Numeric Values)
//             </label>
//             <select
//               value={chartConfig.yAxis}
//               onChange={(e) =>
//                 setChartConfig({ ...chartConfig, yAxis: e.target.value })
//               }
//               className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
//             >
//               <option value="">Select column...</option>
//               {fileData?.headers.map((header, idx) => (
//                 <option key={idx} value={header}>
//                   {header}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             onClick={generateChart}
//             className="w-full bg-gradient-to-t from-[#bc4e9c] to-[#f80759] hover:from-[#7a3366] hover:to-[#ae063e] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold"
//           >
//             Generate Chart
//           </button>
//         </div>
//       </div>
//     </div>
//   )}

//   {/* Data Mapping Modal */}
//   {activeModal === "mapping" && (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//       <div
//         className={`${cardGradient} rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-[#bc4e9c]`}
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-2xl font-bold">Data Mapping</h3>
//           <button
//             onClick={() => setActiveModal(null)}
//             className="hover:text-gray-700 dark:hover:text-gray-100"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <div className="space-y-6">
//           <div>
//             <label className="block text-sm font-bold mb-2">
//               Source Column
//             </label>
//             <select
//               value={mappingConfig.sourceCol}
//               onChange={(e) =>
//                 setMappingConfig({
//                   ...mappingConfig,
//                   sourceCol: e.target.value,
//                 })
//               }
//               className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
//             >
//               <option value="">Select column...</option>
//               {fileData?.headers.map((header, idx) => (
//                 <option key={idx} value={header}>
//                   {header}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-bold mb-2">
//               Target Column
//             </label>
//             <select
//               value={mappingConfig.targetCol}
//               onChange={(e) =>
//                 setMappingConfig({
//                   ...mappingConfig,
//                   targetCol: e.target.value,
//                 })
//               }
//               className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
//             >
//               <option value="">Select column...</option>
//               {fileData?.headers.map((header, idx) => (
//                 <option key={idx} value={header}>
//                   {header}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-bold mb-2">
//               Transformation
//             </label>
//             <select
//               value={mappingConfig.transformation}
//               onChange={(e) =>
//                 setMappingConfig({
//                   ...mappingConfig,
//                   transformation: e.target.value,
//                 })
//               }
//               className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
//             >
//               <option value="none">None (Copy)</option>
//               <option value="uppercase">Uppercase</option>
//               <option value="lowercase">Lowercase</option>
//               <option value="double">Double (×2)</option>
//               <option value="half">Half (÷2)</option>
//             </select>
//           </div>

//           <button
//             onClick={applyMapping}
//             className="w-full bg-gradient-to-t from-[#bc4e9c] to-[#f80759] hover:from-[#7a3366] hover:to-[#ae063e] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold"
//           >
//             Apply Mapping
//           </button>
//         </div>
//       </div>
//     </div>
//   )}

//   {/* Export Modal */}
//   <ExportModal
//     isOpen={activeModal === "export"}
//     onClose={() => setActiveModal(null)}
//     data={getExportData()}
//     fileName={file?.name}
//     chartRef={chartRef.current}
//     uploadData={uploadRes}
//   />

//   <div className="h-16"></div>
// </div>
// );
// }




// import React, { useState, useEffect, useRef } from "react";
// import {
//   Upload,
//   BarChart3,
//   FileSpreadsheet,
//   Brain,
//   Handshake,
//   FileText,
//   Map,
//   X,
//   Download,
// } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   LineChart,
//   Line,
//   PieChart as RechartsPie,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import toast, { Toaster } from "react-hot-toast";
// import ExportModal from "../components/ExportModal";
// import { adminAPI, userAPI } from "../api";
// import * as XLSX from "xlsx";
// import api from "../api";

// export default function DashboardHome({ currentUser, theme }) {
//   const [file, setFile] = useState(null);
//   const [fileData, setFileData] = useState(null);
//   const [stats, setStats] = useState({
//     uploads: 0,
//     storage: "0 MB",
//     reports: 0,
//     charts: 0,
//   });
//   const [activeModal, setActiveModal] = useState(null);
//   const [chartConfig, setChartConfig] = useState({
//     type: "bar",
//     xAxis: "",
//     yAxis: "",
//   });
//   const [mappingConfig, setMappingConfig] = useState({
//     sourceCol: "",
//     targetCol: "",
//     transformation: "none",
//   });
//   const [mappedData, setMappedData] = useState(null);
//   const [generatedChart, setGeneratedChart] = useState(null);
//   const [uploadRes, setUploadRes] = useState(null);

//   const fileInputRef = useRef();
//   const tableRef = useRef();
//   const chartRef = useRef();

//   // Default / fallback stats
//   const savedStats = { uploads: 0, storage: "0 MB", reports: 0, charts: 0 };

//   // Function to fetch user stats
//   const viewUserDetails = async (id) => {
//     try {
//       const response = await adminAPI.getUserStats(id);
//       const data = response.data;
//       setStats({
//         uploads: data.stats.totalUploads || 0,
//         storage: (data.stats.storageUsed || 0) + ' ' + (data.stats.storageUnit || 'MB'),
//         reports: data.stats.activeReports || 0,
//         charts: data.stats.chartsGenerated || 0,
//       });
//     } catch (err) {
//       console.error("Error fetching user details:", err);
//       // fallback to default stats
//       setStats(savedStats);
//     }
//   };

//   // Call on page load (mount)
//   useEffect(() => {
//     if (currentUser?.id) {
//       viewUserDetails(currentUser.id);
//     } else {
//       setStats(savedStats);
//     }
//   }, [currentUser?.id]);

//   const StatCard = ({ icon, title, value, subtitle, color, badge }) => {
//     const colorClasses = {
//       purple: "from-purple-500 to-pink-500",
//       orange: "from-orange-500 to-red-500",
//       blue: "from-blue-500 to-cyan-500",
//       green: "from-green-500 to-emerald-500",
//       red: "from-red-500 to-pink-600",
//       brown: "from-amber-400 to-orange-500",
//     };

//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all relative">

//         {badge && (
//           <div className="absolute top-4 right-4">
//             <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
//               !
//             </span>
//           </div>
//         )}

//         {/* Icon & Title Inline */}
//         <div className="flex items-center mb-4 gap-3">
//           <div
//             className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-md`}
//           >
//             <div className="text-white">{icon}</div>
//           </div>
//           <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
//             {title}
//           </p>
//         </div>

//         <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{value}</p>
//         {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
//       </div>
//     );
//   };

//   const handleFileUpload = async (e) => {
//     const selected = e.target.files[0];
//     if (!selected) return;

//     const validTypes = [".csv", ".xlsx", ".xls"];
//     const fileExtension = selected.name
//       .substring(selected.name.lastIndexOf("."))
//       .toLowerCase();

//     if (!validTypes.includes(fileExtension)) {
//       toast.error("Please upload a CSV, XLS, or XLSX file!");
//       return;
//     }

//     setFile(selected);

//     // ============================================================
//     // UPLOAD TO BACKEND FIRST
//     // ============================================================
//     try {
//       const formData = new FormData();
//       formData.append("file", selected);

//       // Show loading toast
//       const loadingToast = toast.loading("Uploading file...");

//       console.log("📤 Starting upload:", {
//         fileName: selected.name,
//         fileSize: selected.size,
//         fileType: selected.type
//       });

//       // ✅ CORRECT - proper axios syntax with api instance
//       const response = await api.post('/uploads', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       // Dismiss loading toast
//       toast.dismiss(loadingToast);

//       console.log("✅ Upload successful:", response.data);

//       // Set upload response data
//       setUploadRes(response.data.file || response.data);

//       toast.success("File uploaded successfully!");

//       // Update stats
//       setStats((prev) => ({
//         ...prev,
//         uploads: prev.uploads + 1,
//         storage: `${(
//           parseFloat(prev.storage) +
//           selected.size / 1048576
//         ).toFixed(2)} MB`,
//       }));

//     } catch (error) {
//       toast.dismiss();
//       setUploadRes(null);
//       console.error("❌ Upload error:", error);
      
//       const errorMsg = error.response?.data?.message || 
//                       error.message || 
//                       "Failed to upload file to server!";
      
//       toast.error(errorMsg);
//       return; // Stop here if backend upload fails
//     }

//     // ============================================================
//     // CONTINUE WITH LOCAL PREVIEW (CSV & EXCEL)
//     // ============================================================
//     if (fileExtension === ".csv") {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         try {
//           const content = event.target.result;
//           const lines = content.split("\n").filter((line) => line.trim());

//           if (lines.length === 0) {
//             toast.error("File is empty!");
//             return;
//           }

//           const rows = lines.map((line) => {
//             const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
//             const matches = [];
//             let match;
//             while ((match = regex.exec(line)) !== null) {
//               matches.push(match[0].replace(/^"|"$/g, "").trim());
//             }
//             return matches.length > 0
//               ? matches
//               : line.split(",").map((cell) => cell.trim());
//           });

//           setFileData({
//             headers: rows[0] || [],
//             rows: rows.slice(1, 31),
//           });
//         } catch (error) {
//           console.error("CSV parsing error:", error);
//           toast.error("Failed to parse CSV file!");
//         }
//       };

//       reader.onerror = () => {
//         toast.error("Failed to read file!");
//       };

//       reader.readAsText(selected);
      
//     } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
//       // Handle Excel files
//       const reader = new FileReader();
      
//       reader.onload = (event) => {
//         try {
//           const data = new Uint8Array(event.target.result);
          
//           // Use the already imported XLSX
//           const workbook = XLSX.read(data, { type: 'array' });
          
//           // Get the first sheet
//           const firstSheetName = workbook.SheetNames[0];
//           const worksheet = workbook.Sheets[firstSheetName];
          
//           // Convert to JSON (array of arrays)
//           const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
//           if (jsonData.length === 0) {
//             toast.error("File is empty!");
//             return;
//           }
          
//           // Filter out empty rows
//           const filteredData = jsonData.filter(row => 
//             row.some(cell => cell !== null && cell !== undefined && cell !== '')
//           );
          
//           setFileData({
//             headers: filteredData[0] || [],
//             rows: filteredData.slice(1, 31), // Show first 30 rows
//           });
          
//           console.log("✅ Excel file parsed successfully");
//         } catch (error) {
//           console.error("❌ Error parsing Excel file:", error);
//           toast.error("Failed to parse Excel file!");
//         }
//       };

//       reader.onerror = () => {
//         toast.error("Failed to read Excel file!");
//       };

//       reader.readAsArrayBuffer(selected);
//     }
//   };

//   const closePreview = () => {
//     setFile(null);
//     setFileData(null);
//     setMappedData(null);
//     setGeneratedChart(null);
//   };

//   const handleCreateChart = () => {
//     if (!fileData) {
//       toast.error("Please upload a file first!");
//       return;
//     }
//     if (fileData.headers.length === 0) {
//       toast.error("No data columns found in the file!");
//       return;
//     }
//     setChartConfig({ type: "bar", xAxis: "", yAxis: "" });
//     setActiveModal("chart");
//   };

//   const handleDataMapping = () => {
//     if (!fileData) {
//       toast.error("Please upload a file first!");
//       return;
//     }
//     setActiveModal("mapping");
//   };

//   const handleExport = () => {
//     if (!fileData) {
//       toast.error("Please upload a file first!");
//       return;
//     }
//     setActiveModal("export");
//   };

//   const generateChart = async () => {
//     if (!chartConfig.xAxis || !chartConfig.yAxis) {
//       toast.error("Please select both X and Y axes!");
//       return;
//     }

//     const xIndex = fileData.headers.indexOf(chartConfig.xAxis);
//     const yIndex = fileData.headers.indexOf(chartConfig.yAxis);

//     if (xIndex === -1 || yIndex === -1) {
//       toast.error("Invalid column selection!");
//       return;
//     }

//     const chartData = fileData.rows
//       .map((row, idx) => {
//         const xValue = row[xIndex];
//         const yValue = row[yIndex];

//         let numericValue = parseFloat(
//           yValue?.toString().replace(/[^0-9.-]/g, "")
//         );

//         if (!xValue || xValue === "" || isNaN(numericValue)) {
//           return null;
//         }

//         return {
//           name: xValue.toString().substring(0, 30),
//           value: numericValue,
//           originalIndex: idx,
//         };
//       })
//       .filter((item) => item !== null);

//     if (chartData.length === 0) {
//       toast.error(
//         "No valid numeric data found for the selected Y-axis column!"
//       );
//       return;
//     }

//     setGeneratedChart({
//       data: chartData,
//       config: chartConfig,
//       xAxisLabel: chartConfig.xAxis,
//       yAxisLabel: chartConfig.yAxis,
//     });

//     // Update chart count in backend if upload ID exists
//     if (uploadRes?.id) {
//       try {
//         await userAPI.updateChart(uploadRes.id);
//       } catch (error) {
//         console.error("Error updating chart count:", error);
//       }
//     }

//     setStats((prev) => ({ ...prev, charts: prev.charts + 1 }));
//     setActiveModal(null);
//     toast.success(
//       `Chart created successfully with ${chartData.length} data points!`
//     );
//   };

//   const applyMapping = () => {
//     if (!mappingConfig.sourceCol || !mappingConfig.targetCol) {
//       toast.error("Please select source and target columns!");
//       return;
//     }

//     const sourceIdx = fileData.headers.indexOf(mappingConfig.sourceCol);
//     const targetIdx = fileData.headers.indexOf(mappingConfig.targetCol);

//     if (sourceIdx === -1 || targetIdx === -1) {
//       toast.error("Invalid column selection!");
//       return;
//     }

//     const numericTransformations = ["double", "half"];
//     if (numericTransformations.includes(mappingConfig.transformation)) {
//       const firstValue = fileData.rows[0]?.[sourceIdx];
//       const testNumeric = parseFloat(
//         firstValue?.toString().replace(/[^0-9.-]/g, "")
//       );

//       if (isNaN(testNumeric)) {
//         toast.error(
//           `Cannot apply numeric transformation "${mappingConfig.transformation}" to non-numeric column "${mappingConfig.sourceCol}"! Please select a numeric column or use text transformations.`
//         );
//         return;
//       }
//     }

//     const newRows = fileData.rows.map((row) => {
//       const newRow = [...row];
//       let value = row[sourceIdx];

//       switch (mappingConfig.transformation) {
//         case "uppercase":
//           value = value?.toString().toUpperCase();
//           break;
//         case "lowercase":
//           value = value?.toString().toLowerCase();
//           break;
//         case "double":
//           const doubleVal = parseFloat(
//             value?.toString().replace(/[^0-9.-]/g, "")
//           );
//           value = isNaN(doubleVal) ? value : (doubleVal * 2).toString();
//           break;
//         case "half":
//           const halfVal = parseFloat(
//             value?.toString().replace(/[^0-9.-]/g, "")
//           );
//           value = isNaN(halfVal) ? value : (halfVal / 2).toString();
//           break;
//         case "none":
//         default:
//           break;
//       }

//       newRow[targetIdx] = value;
//       return newRow;
//     });

//     setMappedData({
//       headers: fileData.headers,
//       rows: newRows,
//     });

//     setActiveModal(null);
//     toast.success(
//       `Data mapping applied successfully! ${mappingConfig.sourceCol} → ${mappingConfig.targetCol}`
//     );
//   };

//   // HELPER FUNCTION: Convert fileData to array format for export
//   const getExportData = () => {
//     const dataToExport = mappedData || fileData;
//     if (!dataToExport) return null;

//     // Convert to array format [headers, ...rows]
//     return [dataToExport.headers, ...dataToExport.rows];
//   };

//   const COLORS = [
//     "#3b82f6",
//     "#10b981",
//     "#f59e0b",
//     "#ef4444",
//     "#8b5cf6",
//     "#ec4899",
//     "#14b8a6",
//     "#f97316",
//   ];

//   const cardGradient =
//     theme === "dark"
//       ? "bg-gradient-to-br from-blue-900 to-blue-800"
//       : "bg-gradient-to-br from-blue-50 to-blue-100";
//   const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  
//   return (
//     <div className="w-full min-h-screen bg-gray-50 transition-all">

//       <Toaster position="top-center" />

//       {/* Welcome Section */}
//       <div className="px-8 lg:px-12 pt-12 pb-6">
//        <h1 className="text-3xl font-bold flex items-center gap-3">

//           Welcome, {currentUser?.name || 'User'}!{" "}
//           <Handshake className="text-[#bc4e9c]" size={40} />
//         </h1>
//         <p className="text-gray-500 mt-2 text-base">

//           Manage your data with ease and efficiency
//         </p>
//       </div>

//       {/* Stats Section */}
//       <div className="px-8 lg:px-12 py-10">
//         <h2 className="text-2xl lg:text-3xl font-bold mb-8">Your Statistics</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
//           <StatCard
//             icon={<Upload className="h-6 w-6" />}
//             title="Total Uploads"
//             value={stats.uploads}
//             color="green"
//           />

//           <StatCard
//             icon={<FileSpreadsheet className="h-6 w-6" />}
//             title="Storage Used"
//             value={stats.storage}
//             color="blue"
//           />

//           <StatCard
//             icon={<Brain className="h-6 w-6" />}
//             title="Active Reports"
//             value={stats.reports}
//             color="purple"
//           />

//           <StatCard
//             icon={<BarChart3 className="h-6 w-6" />}
//             title="Charts Generated"
//             value={stats.charts}
//             color="orange"
//           />
//         </div>
//       </div>

//       <div className="px-8 lg:px-12 py-2">
//        <hr className="border-t border-gray-200" />

//       </div>

//       {/* Upload Section */}
//       <div className="px-8 lg:px-12 py-10">
//         <h2 className="text-2xl lg:text-3xl font-bold mb-8">
//           Upload Your Data
//         </h2>
//         <div
//           className={`p-12 lg:p-5 rounded-3xl shadow-2xl ${cardGradient} border-2 border-[#bc4e9c] transition-all`}
//         >
//           <div className="flex flex-col items-center justify-center gap-8 py-8">
//             <div className="p-8 rounded-3xl bg-[#F472B6]/25 transition-all">
//               <Upload className="h-8 w-8 text-[#561292]" />
//             </div>
//             <div className="text-center">
//               <h3 className="text-2xl lg:text-3xl font-bold mb-3">
//                 Upload CSV, XLS, or XLSX Files
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 text-lg">
//                 Drag and drop or click to select files
//               </p>
//             </div>
//             <input
//               type="file"
//               accept=".xlsx,.xls,.csv"
//               ref={fileInputRef}
//               onChange={handleFileUpload}
//               className="hidden"
//             />
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="bg-gradient-to-t from-[#bc4e9c] to-[#f80759] text-white px-12 py-4 rounded-2xl shadow-lg hover:shadow-2xl hover:from-[#7a3366] hover:to-[#ae063e] transition-all font-bold text-lg"
//             >
//               Choose File
//             </button>
//             {file && (
//               <p className="text-[#bc4e9c] font-bold text-lg break-all">
//                 ✓ {file.name}
//               </p>
//             )}
//           </div>

//           {/* File Preview */}
//           {(fileData || mappedData) && (
//             <div className="mt-10 bg-[#e8bef270] rounded-3xl p-8 border-2 border-[#bc4e9c] shadow-lg">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="font-bold text-2xl text-white dark:text-black">
//                   {file?.name} {mappedData && "(Mapped)"}
//                 </h3>
//                 <button
//                   onClick={closePreview}
//                   className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transition-all font-bold flex items-center"
//                 >
//                   Close Preview
//                 </button>
//               </div>
//               <div
//                 ref={tableRef}
//                 className="max-h-96 overflow-x-auto overflow-y-auto rounded-2xl border-2 border-[#bc4e9c]"
//               >
//                 <table className="w-full border-collapse text-base bg-gray-100">
//                   <thead className="bg-gradient-to-t from-[#561292] to-[#4a00e0] sticky top-0">
//                     <tr>
//                       {(mappedData || fileData).headers.map((header, idx) => (
//                         <th
//                           key={idx}
//                           className="border border-[#bc4e9c] px-6 py-4 text-left font-bold text-white"
//                         >
//                           {header}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {(mappedData || fileData).rows.map((row, rowIdx) => (
//                       <tr
//                         key={rowIdx}
//                         className={`${
//                           rowIdx % 2 === 0
//                             ? "bg-gray-100"
//                             : "bg-gray-200"
//                         } hover:bg-gray-300 transition`}
//                       >
//                         {row.map((cell, cellIdx) => (
//                           <td
//                             key={cellIdx}
//                             className="border border-[#4a00e0] px-6 py-3 text-black"
//                           >
//                             {cell}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Generated Chart Display */}
//           {generatedChart &&
//             generatedChart.data &&
//             generatedChart.data.length > 0 && (
//               <div className="mt-10 bg-blue-100 rounded-3xl p-8 border-2 border-[#bc4e9c] shadow-lg">
//                 <div className="flex justify-between items-center mb-6">
//                   <div>
//                     <h3 className="font-bold text-2xl text-black">Generated Chart</h3>
//                     <p className="text-sm text-gray-700 mt-1">
//                       {generatedChart.xAxisLabel} vs {generatedChart.yAxisLabel}{" "}
//                       ({generatedChart.data.length} points)
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => setActiveModal("export")}
//                     className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all font-bold flex items-center gap-2"
//                   >
//                     <Download size={18} />
//                     Export Chart
//                   </button>
//                 </div>
//                 <div
//                   ref={chartRef}
//                   style={{
//                     width: "100%",
//                     height: "533px",
//                     backgroundColor: "#ffffff",
//                     padding: "30px",
//                     borderRadius: "12px",
//                   }}
//                 >
//                   {generatedChart.config.type === "bar" && (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={generatedChart.data}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="name"
//                           angle={-45}
//                           textAnchor="end"
//                           height={100}
//                           interval={0}
//                         />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Bar
//                           dataKey="value"
//                           fill="#3b82f6"
//                           name={generatedChart.yAxisLabel}
//                         />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   )}
//                   {generatedChart.config.type === "line" && (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={generatedChart.data}>
//                         <CartesianGrid strokeDasharray="3 3" />
//                         <XAxis
//                           dataKey="name"
//                           angle={-45}
//                           textAnchor="end"
//                           height={100}
//                         />
//                         <YAxis />
//                         <Tooltip />
//                         <Legend />
//                         <Line
//                           type="monotone"
//                           dataKey="value"
//                           stroke="#3b82f6"
//                           strokeWidth={2}
//                           name={generatedChart.yAxisLabel}
//                         />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   )}
//                   {generatedChart.config.type === "pie" && (
//                     <ResponsiveContainer width="100%" height="100%">
//                       <RechartsPie>
//                         <Pie
//                           data={generatedChart.data}
//                           dataKey="value"
//                           nameKey="name"
//                           cx="50%"
//                           cy="50%"
//                           outerRadius={150}
//                           label={(entry) => `${entry.name}: ${entry.value}`}
//                         >
//                           {generatedChart.data.map((entry, index) => (
//                             <Cell
//                               key={`cell-${index}`}
//                               fill={COLORS[index % COLORS.length]}
//                             />
//                           ))}
//                         </Pie>
//                         <Tooltip />
//                         <Legend />
//                       </RechartsPie>
//                     </ResponsiveContainer>
//                   )}
//                 </div>
//               </div>
//             )}
//         </div>
//       </div>

//       <div className="px-8 lg:px-12 py-2">
//         <hr className="border-t-2 border-[#bc4e9c]" />
//       </div>

//       {/* Features Section */}
//       <div className="px-8 lg:px-12 py-10">
//         <h2 className="text-2xl lg:text-3xl font-bold mb-10">Key Features</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
//           {[
//             {
//               title: "Create Charts",
//               icon: BarChart3,
//               desc: "Generate stunning visual insights from your data",
//               action: handleCreateChart,
//             },
//             {
//               title: "Data Mapping",
//               icon: Map,
//               desc: "Map and organize your data with precision",
//               action: handleDataMapping,
//             },
//             {
//               title: "Export Reports",
//               icon: FileText,
//               desc: "Export detailed reports in multiple formats",
//               action: handleExport,
//             },
//           ].map(({ title, icon: Icon, desc, action }) => (
//             <div
//               key={title}
//               className={`p-10 lg:p-12 rounded-3xl shadow-2xl flex flex-col items-center gap-6 transition-all duration-300 hover:shadow-3xl hover:scale-105 ${cardGradient} border-2 border-[#bc4e9c] group`}
//             >
//               <div className="p-6 bg-[#F472B6]/25 group-hover:bg-[#F472B6]/35 rounded-2xl transition-all">
//                 <Icon className="h-12 w-12 text-[#561292]" />
//               </div>
//               <h3
//                 className={`text-2xl lg:text-3xl font-bold text-center ${textColor}`}
//               >
//                 {title}
//               </h3>
//               <p className="text-[#9CA3AF] text-center text-lg">
//                 {desc}
//               </p>
//               <button
//                 onClick={action}
//                 className="bg-gradient-to-t from-[#bc4e9c] to-[#f80759] hover:from-[#7a3366] hover:to-[#ae063e] text-white px-10 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all font-bold text-lg"
//               >
//                 Explore
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chart Creation Modal */}
//       {activeModal === "chart" && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div
//             className={`${cardGradient} rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-[#bc4e9c]`}
//           >
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-2xl font-bold">Create Chart</h3>
//               <button
//                 onClick={() => setActiveModal(null)}
//                 className="hover:text-gray-700 dark:hover:text-gray-500"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-bold mb-2">
//                   Chart Type
//                 </label>
//                 <select
//                   value={chartConfig.type}
//                   onChange={(e) =>
//                     setChartConfig({ ...chartConfig, type: e.target.value })
//                   }
//                   className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
//                 >
//                   <option value="bar">Bar Chart</option>
//                   <option value="line">Line Chart</option>
//                   <option value="pie">Pie Chart</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold mb-2">
//                   X-Axis Column (Labels)
//                 </label>
//                 <select
//                   value={chartConfig.xAxis}
//                   onChange={(e) =>
//                     setChartConfig({ ...chartConfig, xAxis: e.target.value })
//                   }
//                   className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
//                 >
//                   <option value="">Select column...</option>
//                   {fileData?.headers.map((header, idx) => (
//                     <option key={idx} value={header}>
//                       {header}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold mb-2">
//                   Y-Axis Column (Numeric Values)
//                 </label>
//                 <select
//                   value={chartConfig.yAxis}
//                   onChange={(e) =>
//                     setChartConfig({ ...chartConfig, yAxis: e.target.value })
//                   }
//                   className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
//                 >
//                   <option value="">Select column...</option>
//                   {fileData?.headers.map((header, idx) => (
//                     <option key={idx} value={header}>
//                       {header}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <button
//                 onClick={generateChart}
//                 className="w-full bg-gradient-to-t from-[#bc4e9c] to-[#f80759] hover:from-[#7a3366] hover:to-[#ae063e] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold"
//               >
//                 Generate Chart
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Data Mapping Modal */}
//       {activeModal === "mapping" && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
//           <div
//             className={`${cardGradient} rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-[#bc4e9c]`}
//           >
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-2xl font-bold">Data Mapping</h3>
//               <button
//                 onClick={() => setActiveModal(null)}
//                 className="hover:text-gray-700 dark:hover:text-gray-100"
//               >
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-bold mb-2">
//                   Source Column
//                 </label>
//                 <select
//                   value={mappingConfig.sourceCol}
//                   onChange={(e) =>
//                     setMappingConfig({
//                       ...mappingConfig,
//                       sourceCol: e.target.value,
//                     })
//                   }
//                   className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
//                 >
//                   <option value="">Select column...</option>
//                   {fileData?.headers.map((header, idx) => (
//                     <option key={idx} value={header}>
//                       {header}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold mb-2">
//                   Target Column
//                 </label>
//                 <select
//                   value={mappingConfig.targetCol}
//                   onChange={(e) =>
//                     setMappingConfig({
//                       ...mappingConfig,
//                       targetCol: e.target.value,
//                     })
//                   }
//                   className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
//                 >
//                   <option value="">Select column...</option>
//                   {fileData?.headers.map((header, idx) => (
//                     <option key={idx} value={header}>
//                       {header}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-bold mb-2">
//                   Transformation
//                 </label>
//                 <select
//                   value={mappingConfig.transformation}
//                   onChange={(e) =>
//                     setMappingConfig({
//                       ...mappingConfig,
//                       transformation: e.target.value,
//                     })
//                   }
//                   className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
//                 >
//                   <option value="none">None (Copy)</option>
//                   <option value="uppercase">Uppercase</option>
//                   <option value="lowercase">Lowercase</option>
//                   <option value="double">Double (×2)</option>
//                   <option value="half">Half (÷2)</option>
//                 </select>
//               </div>

//               <button
//                 onClick={applyMapping}
//                 className="w-full bg-gradient-to-t from-[#bc4e9c] to-[#f80759] hover:from-[#7a3366] hover:to-[#ae063e] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold"
//               >
//                 Apply Mapping
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Export Modal */}
//       <ExportModal
//         isOpen={activeModal === "export"}
//         onClose={() => setActiveModal(null)}
//         data={getExportData()}
//         fileName={file?.name}
//         chartRef={chartRef.current}
//         uploadData={uploadRes}
//       />

//       <div className="h-16"></div>
//     </div>
//   );
// }



import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  BarChart3,
  FileSpreadsheet,
  Brain,
  Handshake,
  FileText,
  Map,
  X,
  Download,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";
import ExportModal from "../components/ExportModal";
import { adminAPI, userAPI } from "../api";
import * as XLSX from "xlsx";
import api from "../api";

export default function DashboardHome() {
  // Default / fallback stats - MOVED TO TOP
  const savedStats = { uploads: 0, storage: "0 MB", reports: 0, charts: 0 };

  const [currentUser, setCurrentUser] = useState(null);
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [stats, setStats] = useState(savedStats);

  const [activeModal, setActiveModal] = useState(null);
  const [chartConfig, setChartConfig] = useState({
    type: "bar",
    xAxis: "",
    yAxis: "",
  });
  const [mappingConfig, setMappingConfig] = useState({
    sourceCol: "",
    targetCol: "",
    transformation: "none",
  });
  const [mappedData, setMappedData] = useState(null);
  const [generatedChart, setGeneratedChart] = useState(null);
  const [uploadRes, setUploadRes] = useState(null);

  const fileInputRef = useRef();
  const tableRef = useRef();
  const chartRef = useRef();

  // ✅ FIXED: Moved BEFORE handleFileUpload
  const refreshStats = async () => {
    if (currentUser?.id) {
      await viewUserDetails(currentUser.id);
    }
  };

  // Function to fetch user stats - WITH DEBUGGING
  const viewUserDetails = async (id) => {
    try {
      console.log("🔍 Fetching stats for user ID:", id);
      
      // Try userAPI first (since you're logged in as a user, not admin)
      let response;
      try {
        response = await userAPI.getUserStats(id);
        console.log("✅ User API response:", response.data);
      } catch (userErr) {
        console.warn("⚠️ User API failed, trying admin API:", userErr);
        response = await adminAPI.getUserStats(id);
        console.log("✅ Admin API response:", response.data);
      }
      
      const data = response.data;
      
      // Log the full response to see structure
      console.log("📊 Full API data structure:", JSON.stringify(data, null, 2));
      
      // Handle different possible response structures
      const statsData = data.stats || data.data?.stats || data;
      
      const newStats = {
        uploads: statsData.totalUploads || statsData.uploads || 0,
        storage: statsData.storageUsed 
          ? `${statsData.storageUsed} ${statsData.storageUnit || 'MB'}`
          : (statsData.storage || '0 MB'),
        reports: statsData.activeReports || statsData.reports || 0,
        charts: statsData.chartsGenerated || statsData.charts || 0,
      };
      
      console.log("✅ Setting stats:", newStats);
      setStats(newStats);
    } catch (err) {
      console.error("❌ Error fetching user details:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setStats(savedStats);
    }
  };

  // Get user from localStorage on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      setCurrentUser(user);
    }
  }, []);
  
  useEffect(() => {
    if (currentUser?.id) {
      viewUserDetails(currentUser.id);
    } else {
      setStats(savedStats);
    }
  }, [currentUser]);

  const StatCard = ({ icon, title, value, subtitle, color, badge }) => {
    const colorClasses = {
      purple: "from-purple-500 to-pink-500",
      orange: "from-orange-500 to-red-500",
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500",
      red: "from-red-500 to-pink-600",
      brown: "from-amber-400 to-orange-500",
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all relative">
        {badge && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
              !
            </span>
          </div>
        )}

        <div className="flex items-center mb-4 gap-3">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-md`}
          >
            <div className="text-white">{icon}</div>
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {title}
          </p>
        </div>

        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    );
  };

  const handleFileUpload = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const validTypes = [".csv", ".xlsx", ".xls"];
    const fileExtension = selected.name
      .substring(selected.name.lastIndexOf("."))
      .toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      toast.error("Please upload a CSV, XLS, or XLSX file!");
      return;
    }

    setFile(selected);

    try {
      const formData = new FormData();
      formData.append("file", selected);

      const loadingToast = toast.loading("Uploading file...");

      console.log("📤 Starting upload:", {
        fileName: selected.name,
        fileSize: selected.size,
        fileType: selected.type
      });

      const response = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.dismiss(loadingToast);
      console.log("✅ Upload successful:", response.data);

      const uploadData = response.data.file || 
                        response.data.upload || 
                        response.data.data ||
                        response.data;
      
      if (uploadData && (uploadData.id || uploadData._id)) {
        const normalizedUpload = {
          id: uploadData.id || uploadData._id,
          filename: uploadData.filename || uploadData.originalName || selected.name,
          size: uploadData.size || selected.size,
          ...uploadData
        };
        setUploadRes(normalizedUpload);
        console.log("📁 Upload ID set:", normalizedUpload.id);
        toast.success("File uploaded successfully!");
        
        setTimeout(() => refreshStats(), 1000);
        
        setStats((prev) => ({
          ...prev,
          uploads: prev.uploads + 1,
          storage: `${(
            parseFloat(prev.storage) +
            selected.size / 1048576
          ).toFixed(2)} MB`,
        }));
      } else {
        console.warn("⚠️ No upload ID in response:", uploadData);
        setUploadRes(null);
      }

    } catch (error) {
      toast.dismiss();
      setUploadRes(null);
      console.error("❌ Upload error:", error);
      
      if (error.response?.status === 500) {
        console.warn("⚠️ Server error, continuing with local preview");
      } else {
        const errorMsg = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message || 
                        "Failed to upload file";
        toast.error(errorMsg);
      }
    }

    if (fileExtension === ".csv") {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target.result;
          const lines = content.split("\n").filter((line) => line.trim());

          if (lines.length === 0) {
            toast.error("File is empty!");
            return;
          }

          const rows = lines.map((line) => {
            const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
            const matches = [];
            let match;
            while ((match = regex.exec(line)) !== null) {
              matches.push(match[0].replace(/^"|"$/g, "").trim());
            }
            return matches.length > 0
              ? matches
              : line.split(",").map((cell) => cell.trim());
          });

          setFileData({
            headers: rows[0] || [],
            rows: rows.slice(1, 31),
          });
          
          console.log("✅ CSV file parsed successfully");
        } catch (error) {
          console.error("CSV parsing error:", error);
          toast.error("Failed to parse CSV file!");
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read file!");
      };

      reader.readAsText(selected);
      
    } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            toast.error("File is empty!");
            return;
          }
          
          const filteredData = jsonData.filter(row => 
            row.some(cell => cell !== null && cell !== undefined && cell !== '')
          );
          
          setFileData({
            headers: filteredData[0] || [],
            rows: filteredData.slice(1, 31),
          });
          
          console.log("✅ Excel file parsed successfully");
        } catch (error) {
          console.error("❌ Error parsing Excel file:", error);
          toast.error("Failed to parse Excel file!");
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read Excel file!");
      };

      reader.readAsArrayBuffer(selected);
    }
  };

  const closePreview = () => {
    setFile(null);
    setFileData(null);
    setMappedData(null);
    setGeneratedChart(null);
  };

  const handleCreateChart = () => {
    if (!fileData) {
      toast.error("Please upload a file first!");
      return;
    }
    if (fileData.headers.length === 0) {
      toast.error("No data columns found in the file!");
      return;
    }
    setChartConfig({ type: "bar", xAxis: "", yAxis: "" });
    setActiveModal("chart");
  };

  const handleDataMapping = () => {
    if (!fileData) {
      toast.error("Please upload a file first!");
      return;
    }
    setActiveModal("mapping");
  };

  const handleExport = () => {
    if (!fileData) {
      toast.error("Please upload a file first!");
      return;
    }
    setActiveModal("export");
  };

  const generateChart = async () => {
    if (!chartConfig.xAxis || !chartConfig.yAxis) {
      toast.error("Please select both X and Y axes!");
      return;
    }

    const xIndex = fileData.headers.indexOf(chartConfig.xAxis);
    const yIndex = fileData.headers.indexOf(chartConfig.yAxis);

    if (xIndex === -1 || yIndex === -1) {
      toast.error("Invalid column selection!");
      return;
    }

    const chartData = fileData.rows
      .map((row, idx) => {
        const xValue = row[xIndex];
        const yValue = row[yIndex];

        let numericValue = parseFloat(
          yValue?.toString().replace(/[^0-9.-]/g, "")
        );

        if (!xValue || xValue === "" || isNaN(numericValue)) {
          return null;
        }

        return {
          name: xValue.toString().substring(0, 30),
          value: numericValue,
          originalIndex: idx,
        };
      })
      .filter((item) => item !== null);

    if (chartData.length === 0) {
      toast.error(
        "No valid numeric data found for the selected Y-axis column!"
      );
      return;
    }

    setGeneratedChart({
      data: chartData,
      config: chartConfig,
      xAxisLabel: chartConfig.xAxis,
      yAxisLabel: chartConfig.yAxis,
    });

    if (uploadRes?.id) {
      try {
        await userAPI.updateChart(uploadRes.id);
        console.log("✅ Chart count updated");
      } catch (error) {
        console.error("⚠️ Error updating chart count:", error);
      }
    } else {
      console.warn("⚠️ No upload ID available, skipping chart count update");
    }

    setStats((prev) => ({ ...prev, charts: prev.charts + 1 }));
    setActiveModal(null);
    toast.success(
      `Chart created successfully with ${chartData.length} data points!`
    );
  };

  const applyMapping = () => {
    if (!mappingConfig.sourceCol || !mappingConfig.targetCol) {
      toast.error("Please select source and target columns!");
      return;
    }

    const sourceIdx = fileData.headers.indexOf(mappingConfig.sourceCol);
    const targetIdx = fileData.headers.indexOf(mappingConfig.targetCol);

    if (sourceIdx === -1 || targetIdx === -1) {
      toast.error("Invalid column selection!");
      return;
    }

    const numericTransformations = ["double", "half"];
    if (numericTransformations.includes(mappingConfig.transformation)) {
      const firstValue = fileData.rows[0]?.[sourceIdx];
      const testNumeric = parseFloat(
        firstValue?.toString().replace(/[^0-9.-]/g, "")
      );

      if (isNaN(testNumeric)) {
        toast.error(
          `Cannot apply numeric transformation "${mappingConfig.transformation}" to non-numeric column "${mappingConfig.sourceCol}"! Please select a numeric column or use text transformations.`
        );
        return;
      }
    }

    const newRows = fileData.rows.map((row) => {
      const newRow = [...row];
      let value = row[sourceIdx];

      switch (mappingConfig.transformation) {
        case "uppercase":
          value = value?.toString().toUpperCase();
          break;
        case "lowercase":
          value = value?.toString().toLowerCase();
          break;
        case "double":
          const doubleVal = parseFloat(
            value?.toString().replace(/[^0-9.-]/g, "")
          );
          value = isNaN(doubleVal) ? value : (doubleVal * 2).toString();
          break;
        case "half":
          const halfVal = parseFloat(
            value?.toString().replace(/[^0-9.-]/g, "")
          );
          value = isNaN(halfVal) ? value : (halfVal / 2).toString();
          break;
        case "none":
        default:
          break;
      }

      newRow[targetIdx] = value;
      return newRow;
    });

    setMappedData({
      headers: fileData.headers,
      rows: newRows,
    });

    setActiveModal(null);
    toast.success(
      `Data mapping applied successfully! ${mappingConfig.sourceCol} → ${mappingConfig.targetCol}`
    );
  };

  const getExportData = () => {
    const dataToExport = mappedData || fileData;
    if (!dataToExport) return null;

    return [dataToExport.headers, ...dataToExport.rows];
  };

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
  ];
  
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Toaster position="top-center" />

      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome, {currentUser?.name || 'User'}!
            </h1>
            <Handshake className="text-pink-600" size={40} />
          </div>
          <p className="text-gray-600 mt-2 text-base">
            Manage your data with ease and efficiency
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FileSpreadsheet size={24} />}
            title="Total Uploads"
            value={stats.uploads}
            color="purple"
          />
          <StatCard
            icon={<Upload size={24} />}
            title="Storage Used"
            value={stats.storage}
            color="orange"
          />
          <StatCard
            icon={<FileText size={24} />}
            title="Reports Generated"
            value={stats.reports}
            color="blue"
          />
          <StatCard
            icon={<BarChart3 size={24} />}
            title="Charts Created"
            value={stats.charts}
            color="green"
          />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Data</h2>
        <div className="bg-white rounded-2xl shadow-sm border-2 border-pink-600 p-12">
          <div className="flex flex-col items-center justify-center gap-8 py-10">
            <div className="p-8 rounded-3xl bg-pink-100">
              <Upload className="h-20 w-20 text-purple-700" />
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Upload CSV, XLS, or XLSX Files
              </h3>
              <p className="text-gray-600 text-lg">
                Drag and drop or click to select files
              </p>
            </div>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white px-12 py-4 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-lg"
            >
              Choose File
            </button>
            {file && (
              <p className="text-pink-700 font-bold text-lg break-all">
                ✓ {file.name}
              </p>
            )}
          </div>

          {(fileData || mappedData) && (
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border-2 border-pink-600 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-gray-900">
                  {file?.name} {mappedData && "(Mapped)"}
                </h3>
                <button
                  onClick={closePreview}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all font-semibold flex items-center gap-2"
                >
                  <X size={18} />
                  Close Preview
                </button>
              </div>
              <div
                ref={tableRef}
                className="max-h-96 overflow-auto rounded-lg border-2 border-gray-300 bg-white"
              >
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gradient-to-r from-purple-700 to-indigo-700 sticky top-0">
                    <tr>
                      {(mappedData || fileData).headers.map((header, idx) => (
                        <th
                          key={idx}
                          className="border border-gray-300 px-4 py-3 text-left font-semibold text-white"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(mappedData || fileData).rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className={`${
                          rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition`}
                      >
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="border border-gray-300 px-4 py-2 text-gray-900"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {generatedChart && generatedChart.data && generatedChart.data.length > 0 && (
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border-2 border-pink-600 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900">Generated Chart</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {generatedChart.xAxisLabel} vs {generatedChart.yAxisLabel}{" "}
                    ({generatedChart.data.length} points)
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal("export")}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all font-semibold flex items-center gap-2"
                >
                  <Download size={18} />
                  Export Chart
                </button>
              </div>
              <div
                ref={chartRef}
                style={{
                  width: "100%",
                  height: "400px",
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                {generatedChart.config.type === "bar" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generatedChart.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="value"
                        fill="#3b82f6"
                        name={generatedChart.yAxisLabel}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {generatedChart.config.type === "line" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generatedChart.data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name={generatedChart.yAxisLabel}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
                {generatedChart.config.type === "pie" && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={generatedChart.data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                      >
                        {generatedChart.data.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Create Charts",
              icon: BarChart3,
              desc: "Generate stunning visual insights from your data",
              action: handleCreateChart,
            },
            {
              title: "Data Mapping",
              icon: Map,
              desc: "Map and organize your data with precision",
              action: handleDataMapping,
            },
            {
              title: "Export Reports",
              icon: FileText,
              desc: "Export detailed reports in multiple formats",
              action: handleExport,
            },
          ].map(({ title, icon: Icon, desc, action }) => (
            <div
              key={title}
              className="bg-white rounded-2xl shadow-sm border-2 border-pink-600 p-10 flex flex-col items-center gap-6 hover:shadow-md transition-all group"
            >
              <div className="p-6 bg-pink-100 group-hover:bg-pink-200 rounded-2xl transition-all">
                <Icon className="h-12 w-12 text-purple-700" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center">
                {title}
              </h3>
              <p className="text-gray-600 text-center text-base">
                {desc}
              </p>
              <button
                onClick={action}
                className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white px-10 py-3 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-base"
              >
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>

      {activeModal === "chart" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Create Chart</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Chart Type
                </label>
                <select
                  value={chartConfig.type}
                  onChange={(e) =>
                    setChartConfig({ ...chartConfig, type: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-pink-600 focus:outline-none bg-white text-gray-900"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  X-Axis Column (Labels)
                </label>
                <select
                  value={chartConfig.xAxis}
                  onChange={(e) =>
                    setChartConfig({ ...chartConfig, xAxis: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-pink-600 focus:outline-none bg-white text-gray-900"
                >
                  <option value="">Select column...</option>
                  {fileData?.headers.map((header, idx) => (
                    <option key={idx} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Y-Axis Column (Numeric Values)
                </label>
                <select
                  value={chartConfig.yAxis}
                  onChange={(e) =>
                    setChartConfig({ ...chartConfig, yAxis: e.target.value })
                  }
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-pink-600 focus:outline-none bg-white text-gray-900"
                >
                  <option value="">Select column...</option>
                  {fileData?.headers.map((header, idx) => (
                    <option key={idx} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
             <button
            onClick={generateChart}
            className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-semibold"
          >
            Generate Chart
          </button>
        </div>
      </div>
    </div>
  )}

  {activeModal === "mapping" && (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Data Mapping</h3>
          <button
            onClick={() => setActiveModal(null)}
            className="hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Source Column
            </label>
            <select
              value={mappingConfig.sourceCol}
              onChange={(e) =>
                setMappingConfig({
                  ...mappingConfig,
                  sourceCol: e.target.value,
                })
              }
              className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-pink-600 focus:outline-none bg-white text-gray-900"
            >
              <option value="">Select column...</option>
              {fileData?.headers.map((header, idx) => (
                <option key={idx} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target Column
            </label>
            <select
              value={mappingConfig.targetCol}
              onChange={(e) =>
                setMappingConfig({
                  ...mappingConfig,
                  targetCol: e.target.value,
                })
              }
              className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-pink-600 focus:outline-none bg-white text-gray-900"
            >
              <option value="">Select column...</option>
              {fileData?.headers.map((header, idx) => (
                <option key={idx} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Transformation
            </label>
            <select
              value={mappingConfig.transformation}
              onChange={(e) =>
                setMappingConfig({
                  ...mappingConfig,
                  transformation: e.target.value,
                })
              }
              className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-pink-600 focus:outline-none bg-white text-gray-900"
            >
              <option value="none">None (Copy)</option>
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
              <option value="double">Double (×2)</option>
              <option value="half">Half (÷2)</option>
            </select>
          </div>

          <button
            onClick={applyMapping}
            className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all font-semibold"
          >
            Apply Mapping
          </button>
        </div>
      </div>
    </div>
  )}

  <ExportModal
    isOpen={activeModal === "export"}
    onClose={() => setActiveModal(null)}
    data={getExportData()}
    fileName={file?.name}
    chartRef={chartRef.current}
    uploadData={uploadRes}
  />

  <div className="h-16"></div>
</div>
);
}
