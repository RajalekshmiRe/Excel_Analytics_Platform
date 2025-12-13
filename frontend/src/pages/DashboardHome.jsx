// import { useAuth } from "../auth/AuthProvider";
// import FileUpload from "../components/FileUpload";  // adjust path if needed

// export default function DashboardHome() {
//   const { user } = useAuth();
//   return (
//     <div className="space-y-4">
//       <h2 className="text-2xl font-semibold">Welcome, {user?.name}</h2>
//       <div className="grid md:grid-cols-3 gap-4">
//         <div className="bg-white p-4 rounded-xl shadow">Total Uploads: 0</div>
//         <div className="bg-white p-4 rounded-xl shadow">Last Login: just now</div>
//         <div className="bg-white p-4 rounded-xl shadow">Role: {user?.role}</div>
//       </div>
//     </div>
//   );
// }
// export default DashboardHome;
// import React, { useRef, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx";
// import api from "../api";
// import ChartComponent from "../components/ChartComponent";

// // ✅ Dashboard Component
// const DashboardHome = () => {
//   const navigate = useNavigate();

//   // -------------------- AUTH --------------------
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       } else {
//         navigate("/login"); // redirect if no user
//       }
//     } catch (err) {
//       console.error("Error parsing user:", err);
//       localStorage.removeItem("user");
//       navigate("/login");
//     }
//   }, [navigate]);

//   // -------------------- STATE --------------------
//   const fileInputRef = useRef(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadCount, setUploadCount] = useState(0);
//   const [fileData, setFileData] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showPreview, setShowPreview] = useState(false);
//   const [file, setFile] = useState(null);
//   const [uploadId, setUploadId] = useState(null);
//   const [columns, setColumns] = useState([]);
//   const [xColumn, setXColumn] = useState("");
//   const [yColumn, setYColumn] = useState("");
//   const [chartData, setChartData] = useState(null);

//   // -------------------- LOGOUT --------------------
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   // -------------------- FETCH HISTORY --------------------
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await api.get("/uploads/history", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setHistory(res.data);
//       } catch (error) {
//         console.error("Error fetching uploads history:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHistory();
//   }, []);

//   // -------------------- FILE HANDLING --------------------
//   const handleChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setSelectedFile(file);
//     setUploadCount((prev) => prev + 1);

//     // Parse Excel file
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//       setFileData(jsonData);
//       setShowPreview(true);
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const handleButtonClick = () => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   };

//   // -------------------- INITIALS --------------------
//   const initials = user?.name
//     ? user.name
//         .split(" ")
//         .map((n) => n[0])
//         .join("")
//         .toUpperCase()
//     : "UN";

//   // -------------------- RENDER --------------------
//   if (!user) return <p className="p-6 text-gray-700">Loading...</p>;

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* ---------------- HEADER ---------------- */}
//       <header className="w-full bg-white shadow px-8 py-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-blue-700">
//           Excel Analytics Platform
//         </h1>

//         <div className="flex items-center space-x-4">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           {/* User initials + Logout */}
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold">
//               {initials}
//             </div>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* ---------------- MAIN ---------------- */}
//       <main className="p-8">
//         {/* Welcome */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-800">
//             Welcome, {user?.name || "Guest"} 👋
//           </h2>
//         </div>

//         {/* Stats */}
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <StatCard title="Total Uploads" value={uploadCount} color="from-blue-500 to-indigo-500" />
//           <StatCard title="Reports Generated" value="0" color="from-green-400 to-emerald-500" />
//           <StatCard title="Server Status" value="✅ Online" color="from-purple-500 to-pink-500" />
//         </section>

//         {/* Upload */}
//         <section className="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-100">
//           <h2 className="text-xl font-semibold mb-4 text-gray-800">
//             Upload Excel File
//           </h2>
//           <button
//             onClick={handleButtonClick}
//             className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
//           >
//             📤 Upload File
//           </button>
//           <input
//             type="file"
//             accept=".xlsx,.xls"
//             ref={fileInputRef}
//             onChange={handleChange}
//             style={{ display: "none" }}
//           />

//           {selectedFile && (
//             <p className="mt-3 text-gray-600">
//               Selected File:{" "}
//               <button
//                 onClick={() => navigate("/file-preview")}
//                 className="font-semibold text-blue-700 underline hover:text-blue-900"
//               >
//                 {selectedFile.name}
//               </button>
//             </p>
//           )}

//           {/* Preview */}
//           {showPreview && fileData.length > 0 && (
//             <FilePreview data={fileData} onClose={() => setShowPreview(false)} />
//           )}
//         </section>
//       </main>
//     </div>
//   );
// };

// // -------------------- COMPONENTS --------------------
// const StatCard = ({ title, value, color }) => (
//   <div
//     className={`bg-gradient-to-r ${color} text-white p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105`}
//   >
//     <h2 className="text-lg font-semibold">{title}</h2>
//     <p className="text-3xl font-bold mt-2">{value}</p>
//   </div>
// );

// const FilePreview = ({ data, onClose }) => (
//   <div className="bg-white rounded-xl shadow-lg p-6 mt-6 border border-gray-100 overflow-x-auto">
//     <div className="flex justify-between items-center mb-4">
//       <h2 className="text-xl font-semibold text-gray-800">File Preview</h2>
//       <button
//         onClick={onClose}
//         className="text-red-500 hover:text-red-700 font-medium"
//       >
//         ✖ Close
//       </button>
//     </div>
//     <table className="w-full border-collapse">
//       <tbody>
//         {data.map((row, i) => (
//           <tr key={i} className="hover:bg-gray-50 transition">
//             {row.map((cell, j) => (
//               <td
//                 key={j}
//                 className="border px-4 py-2 text-sm text-gray-700"
//               >
//                 {cell}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// export default DashboardHome;
// import React, { useRef, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx";
// import api from "../api";

// const DashboardHome = () => {
//   const navigate = useNavigate();

//   // -------------------- AUTH --------------------
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       } else {
//         navigate("/login");
//       }
//     } catch (err) {
//       console.error("Error parsing user:", err);
//       localStorage.removeItem("user");
//       navigate("/login");
//     }
//   }, [navigate]);

//   // -------------------- STATE --------------------
//   const fileInputRef = useRef(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadCount, setUploadCount] = useState(0);
//   const [fileData, setFileData] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showPreview, setShowPreview] = useState(false);

//   // -------------------- LOGOUT --------------------
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   // -------------------- FETCH HISTORY --------------------
//   const fetchHistory = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await api.get("/uploads/history", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHistory(res.data);
//     } catch (error) {
//       console.error("Error fetching uploads history:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   // -------------------- FILE HANDLING --------------------
//   const handleChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     setSelectedFile(file);
//     setUploadCount((prev) => prev + 1);

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//       setFileData(jsonData);
//       setShowPreview(true);
//     };
//     reader.readAsArrayBuffer(file);

//     handleUpload(file);
//   };

//   const handleUpload = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const token = localStorage.getItem("token");
//       await api.post("/uploads", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       fetchHistory(); // refresh history
//     } catch (err) {
//       console.error("Error uploading file:", err);
//     }
//   };

//   const handleButtonClick = () => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   };

//   // -------------------- INITIALS --------------------
//   const initials = user?.name
//     ? user.name
//         .split(" ")
//         .map((n) => n[0])
//         .join("")
//         .toUpperCase()
//     : "UN";

//   // -------------------- RENDER --------------------
//   if (!user) return <p className="p-6 text-gray-700">Loading...</p>;

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* ---------------- HEADER ---------------- */}
//       <header className="w-full bg-white shadow px-8 py-4 flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-blue-700">
//           Excel Analytics Platform
//         </h1>

//         <div className="flex items-center space-x-4">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search files..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-72 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
//           </div>

//           <div className="relative group">
//             <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold cursor-pointer">
//               {initials}
//             </div>
//             <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-10 w-36">
//               <p className="text-gray-800 px-4 py-2 cursor-default">
//                 {user.name}
//               </p>
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ---------------- MAIN ---------------- */}
//       <main className="p-8">
//         {/* Welcome */}
//         <div className="mb-8">
//           <h2 className="text-2xl font-bold text-gray-800">
//             Welcome, {user?.name || "Guest"} 👋
//           </h2>
//         </div>

//         {/* Stats */}
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <StatCard
//             title="Total Uploads"
//             value={uploadCount}
//             color="from-blue-500 to-indigo-500"
//             icon="📁"
//           />
//           <StatCard
//             title="Reports Generated"
//             value="0"
//             color="from-green-400 to-emerald-500"
//             icon="📊"
//           />
//           <StatCard
//             title="Server Status"
//             value="✅ Online"
//             color="from-purple-500 to-pink-500"
//             icon="🟢"
//           />
//         </section>

//         {/* Upload */}
//         <section className="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-100">
//           <h2 className="text-xl font-semibold mb-4 text-gray-800">
//             Upload Excel File
//           </h2>
//           <button
//             onClick={handleButtonClick}
//             className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
//           >
//             📤 Upload File
//           </button>
//           <input
//             type="file"
//             accept=".xlsx,.xls"
//             ref={fileInputRef}
//             onChange={handleChange}
//             style={{ display: "none" }}
//           />

//           {showPreview && fileData.length > 0 && (
//             <FilePreview
//               data={fileData}
//               onClose={() => setShowPreview(false)}
//             />
//           )}
//         </section>

//         {/* Upload History */}
//         <section className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//           <h2 className="text-xl font-semibold mb-4 text-gray-800">
//             Upload History
//           </h2>
//           {loading ? (
//             <p className="text-gray-600">Loading history...</p>
//           ) : history.length > 0 ? (
//             <ul className="space-y-3">
//               {history.map((item) => (
//                 <li
//                   key={item._id}
//                   className="p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
//                 >
//                   <span className="font-medium text-gray-800">
//                     {item.filename}
//                   </span>
//                   <span className="text-sm text-gray-500">
//                     {new Date(item.createdAt).toLocaleString()}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className="text-gray-600">No uploads yet.</p>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// };

// // -------------------- COMPONENTS --------------------
// const StatCard = ({ title, value, color, icon }) => (
//   <div
//     className={`bg-gradient-to-r ${color} text-white p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 flex justify-between items-center`}
//   >
//     <div>
//       <h2 className="text-lg font-semibold">{title}</h2>
//       <p className="text-3xl font-bold mt-2">{value}</p>
//     </div>
//     <div className="text-4xl opacity-30">{icon}</div>
//   </div>
// );

// const FilePreview = ({ data, onClose }) => (
//   <div className="bg-white rounded-xl shadow-lg p-6 mt-6 border border-gray-100 overflow-x-auto">
//     <div className="flex justify-between items-center mb-4">
//       <h2 className="text-xl font-semibold text-gray-800">📄 File Preview</h2>
//       <button
//         onClick={onClose}
//         className="text-red-500 hover:text-red-700 font-medium"
//       >
//         ✖ Close
//       </button>
//     </div>
//     <table className="w-full border-collapse border border-gray-200">
//       <thead>
//         {data[0] && (
//           <tr className="bg-gray-100">
//             {data[0].map((header, index) => (
//               <th
//                 key={index}
//                 className="border px-4 py-2 text-left text-sm font-semibold text-gray-700"
//               >
//                 {header}
//               </th>
//             ))}
//           </tr>
//         )}
//       </thead>
//       <tbody>
//         {data.slice(1).map((row, rowIndex) => (
//           <tr key={rowIndex} className="hover:bg-gray-50 transition">
//             {row.map((cell, cellIndex) => (
//               <td
//                 key={cellIndex}
//                 className="border px-4 py-2 text-sm text-gray-700"
//               >
//                 {cell}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// );

// export default DashboardHome;

// import React, { useState, useRef } from "react";

// // Mock user data (since we can't use localStorage)
// const mockUser = {
//   name: "Meenakshi",
//   email: "meenu@3gmail.com"
// };

// const mockInitialHistory = [
//   {
//     _id: '1',
//     filename: 'Sales_Data_Q1.xlsx',
//     createdAt: new Date().toISOString(),
//     status: 'Processed',
//     size: '2.4 MB'
//   },
//   {
//     _id: '2',
//     filename: 'Employee_Records.csv',
//     createdAt: new Date(Date.now() - 86400000).toISOString(),
//     status: 'Ready',
//     size: '1.8 MB'
//   }
// ];

// // Dashboard Layout Component
// const DashboardLayout = ({ children, onLogout }) => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const initials = mockUser.name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside
//         className={`${
//           isSidebarOpen ? 'w-64' : 'w-20'
//         } bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}
//       >
//         {/* Sidebar Header */}
//         <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//           {isSidebarOpen ? (
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold shadow-lg">
//                 {initials}
//               </div>
//               <div>
//                 <p className="font-semibold text-gray-900 text-sm">{mockUser.name}</p>
//                 <p className="text-xs text-gray-500">{mockUser.email}</p>
//               </div>
//             </div>
//           ) : (
//             <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold shadow-lg mx-auto">
//               {initials}
//             </div>
//           )}
//         </div>

//         {/* Toggle Button */}
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="p-2 mx-4 mt-4 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
//         >
//           {isSidebarOpen ? (
//             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           ) : (
//             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           )}
//         </button>

//         {/* Navigation */}
//         <nav className="flex-1 p-4 space-y-1">
//           <NavButton
//             icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
//             label="Overview"
//             isActive={true}
//             isOpen={isSidebarOpen}
//           />
//           <NavButton
//             icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
//             label="Upload History"
//             isActive={false}
//             isOpen={isSidebarOpen}
//           />
//           <NavButton
//             icon={<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
//             label="Settings"
//             isActive={false}
//             isOpen={isSidebarOpen}
//           />
//         </nav>

//         {/* Logout Button */}
//         <div className="p-4 border-t border-gray-200">
//           <button
//             onClick={onLogout}
//             className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
//           >
//             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             {isSidebarOpen && <span className="font-medium">Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 overflow-y-auto">
//         {children}
//       </div>
//     </div>
//   );
// };

// const NavButton = ({ icon, label, isActive, isOpen }) => (
//   <button
//     className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full ${
//       isActive
//         ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
//         : 'text-gray-700 hover:bg-gray-100'
//     }`}
//   >
//     {icon}
//     {isOpen && <span className="font-medium">{label}</span>}
//   </button>
// );

// // Dashboard Home Component
// const DashboardHome = () => {
//   const fileInputRef = useRef(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadCount, setUploadCount] = useState(3);
//   const [fileData, setFileData] = useState([]);
//   const [history, setHistory] = useState(mockInitialHistory);
//   const [showPreview, setShowPreview] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [uploadError, setUploadError] = useState("");
//   const [uploadSuccess, setUploadSuccess] = useState("");

//   const handleChange = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const validTypes = [
//       'application/vnd.ms-excel',
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//       'text/csv'
//     ];

//     if (!validTypes.includes(file.type)) {
//       setUploadError("Please select a valid Excel (.xlsx, .xls) or CSV file");
//       setTimeout(() => setUploadError(""), 3000);
//       return;
//     }

//     setSelectedFile(file);
//     setUploadError("");
//     setUploading(true);

//     setTimeout(() => {
//       setUploading(false);
//       setUploadSuccess("File uploaded successfully! Ready for analysis.");
//       setTimeout(() => setUploadSuccess(""), 3000);

//       setUploadCount(prev => prev + 1);

//       const newItem = {
//         _id: Date.now().toString(),
//         filename: file.name,
//         createdAt: new Date().toISOString(),
//         status: 'Processing',
//         size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
//       };
//       setHistory(prev => [newItem, ...prev]);

//       const sampleData = [
//         ['Column A', 'Column B', 'Column C', 'Column D', 'Column E'],
//         ['Data 1', 'Data 2', 'Data 3', 'Data 4', 'Data 5'],
//         ['Row 2-1', 'Row 2-2', 'Row 2-3', 'Row 2-4', 'Row 2-5'],
//         ['Row 3-1', 'Row 3-2', 'Row 3-3', 'Row 3-4', 'Row 3-5'],
//         ['Row 4-1', 'Row 4-2', 'Row 4-3', 'Row 4-4', 'Row 4-5'],
//         ['Row 5-1', 'Row 5-2', 'Row 5-3', 'Row 5-4', 'Row 5-5']
//       ];
//       setFileData(sampleData);
//       setShowPreview(true);
//     }, 2000);
//   };

//   const handleButtonClick = () => {
//     if (fileInputRef.current) fileInputRef.current.click();
//   };

//   const handleDelete = (fileId) => {
//     if (!window.confirm("Are you sure you want to delete this file?")) return;
//     setHistory(prev => prev.filter(item => item._id !== fileId));
//     setUploadCount(prev => Math.max(0, prev - 1));
//   };

//   const recentUploads = history.slice(0, 5);
//   const storageUsed = Math.min(uploadCount * 15, 100);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Welcome back, {mockUser.name}
//               </h1>
//               <p className="text-gray-600">
//                 Excel Analytics Platform - Upload, analyze, and visualize your data
//               </p>
//             </div>
//             <div className="hidden lg:block">
//               <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
//                 {mockUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
//               </div>
//             </div>
//           </div>
//         </div>

//         {uploadError && (
//           <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md">
//             <div className="flex items-start">
//               <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//               <div>
//                 <h3 className="font-semibold text-red-800">Upload Error</h3>
//                 <p className="text-sm text-red-700">{uploadError}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {uploadSuccess && (
//           <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 shadow-md">
//             <div className="flex items-start">
//               <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <div>
//                 <h3 className="font-semibold text-green-800">Success!</h3>
//                 <p className="text-sm text-green-700">{uploadSuccess}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <StatCard
//             icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>}
//             title="Total Uploads"
//             value={uploadCount}
//             subtitle={uploadCount + " files processed"}
//             color="blue"
//           />
//           <StatCard
//             icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>}
//             title="Storage Used"
//             value={storageUsed + "%"}
//             subtitle="Of 100GB quota"
//             color="purple"
//           />
//           <StatCard
//             icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
//             title="Active Reports"
//             value={uploadCount}
//             subtitle="Ready for analysis"
//             color="green"
//           />
//           <StatCard
//             icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
//             title="Charts Generated"
//             value="24"
//             subtitle="This month"
//             color="orange"
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
//               <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5 rounded-t-2xl">
//                 <h2 className="text-xl font-semibold text-white flex items-center gap-2">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
//                   Upload Excel File
//                 </h2>
//                 <p className="text-blue-100 text-sm mt-1">Supported formats: .xlsx, .xls, .csv</p>
//               </div>

//               <div className="p-8">
//                 <div
//                   onClick={handleButtonClick}
//                   className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group"
//                 >
//                   <div className="flex flex-col items-center">
//                     <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
//                       {uploading ? (
//                         <svg className="animate-spin h-10 w-10 text-white" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                       ) : (
//                         <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
//                       )}
//                     </div>
//                     <p className="text-xl font-semibold text-gray-800 mb-2">
//                       {uploading ? "Uploading your file..." : "Drop your Excel file here"}
//                     </p>
//                     <p className="text-gray-500 mb-8 text-sm">
//                       or click to browse from your computer
//                     </p>
//                     <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
//                       {uploading ? (
//                         <>
//                           <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                           <span>Processing...</span>
//                         </>
//                       ) : (
//                         <>
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
//                           <span>Choose File</span>
//                         </>
//                       )}
//                     </button>
//                     <p className="text-xs text-gray-400 mt-4">
//                       Maximum file size: 15MB
//                     </p>
//                   </div>
//                   <input
//                     type="file"
//                     accept=".xlsx,.xls,.csv"
//                     ref={fileInputRef}
//                     onChange={handleChange}
//                     className="hidden"
//                   />
//                 </div>

//                 {showPreview && fileData.length > 0 && (
//                   <FilePreview
//                     data={fileData}
//                     fileName={selectedFile?.name}
//                     onClose={() => setShowPreview(false)}
//                   />
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-6">
//               <FeatureCard icon="📊" title="Create Charts" desc="2D & 3D visualizations" />
//               <FeatureCard icon="📈" title="Data Mapping" desc="X & Y axis selection" />
//               <FeatureCard icon="💾" title="Export Data" desc="PNG, PDF formats" />
//             </div>
//           </div>

//           <div className="space-y-6">
//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
//               <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 rounded-t-2xl">
//                 <h2 className="text-lg font-semibold text-white flex items-center gap-2">
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
//                   Recent Uploads
//                 </h2>
//               </div>

//               <div className="p-5">
//                 {recentUploads.length > 0 ? (
//                   <div className="space-y-3">
//                     {recentUploads.map((item) => (
//                       <ActivityItem
//                         key={item._id}
//                         filename={item.filename}
//                         date={item.createdAt}
//                         status={item.status}
//                         size={item.size}
//                         onDelete={() => handleDelete(item._id)}
//                       />
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12">
//                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
//                     </div>
//                     <p className="text-gray-600 font-medium">No uploads yet</p>
//                     <p className="text-sm text-gray-400 mt-1">Upload your first file to begin</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
//                 <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
//                 Quick Actions
//               </h3>
//               <div className="space-y-3">
//                 <ActionButton icon="📊" label="Create New Chart" />
//                 <ActionButton icon="📈" label="View Analytics" />
//                 <ActionButton icon="📥" label="Export Reports" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatCard = ({ icon, title, value, subtitle, color }) => {
//   const colorClasses = {
//     blue: 'from-blue-500 to-cyan-500',
//     purple: 'from-purple-500 to-pink-500',
//     green: 'from-green-500 to-emerald-500',
//     orange: 'from-orange-500 to-amber-500'
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
//       <div className={"w-12 h-12 bg-gradient-to-br " + colorClasses[color] + " rounded-xl flex items-center justify-center mb-4 shadow-md"}>
//         <div className="text-white">{icon}</div>
//       </div>
//       <p className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{title}</p>
//       <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
//       <p className="text-sm text-gray-500">{subtitle}</p>
//     </div>
//   );
// };

// const FeatureCard = ({ icon, title, desc }) => (
//   <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all text-center">
//     <div className="text-3xl mb-3">{icon}</div>
//     <h4 className="font-semibold text-gray-800 text-sm mb-1">{title}</h4>
//     <p className="text-xs text-gray-500">{desc}</p>
//   </div>
// );

// const ActivityItem = ({ filename, date, status, size, onDelete }) => (
//   <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all group border border-gray-200">
//     <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
//       <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
//     </div>
//     <div className="flex-1 min-w-0">
//       <p className="text-sm font-semibold text-gray-900 truncate">{filename}</p>
//       <div className="flex items-center gap-2 mt-1">
//         <p className="text-xs text-gray-500">{new Date(date).toLocaleDateString()}</p>
//         <span className="text-xs text-gray-400">•</span>
//         <p className="text-xs text-gray-500">{size}</p>
//       </div>
//     </div>
//     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//       <button
//         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//         title="Analyze"
//       >
//         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
//       </button>
//       <button
//         onClick={onDelete}
//         className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
//         title="Delete"
//       >
//         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//       </button>
//     </div>
//   </div>
// );

// const ActionButton = ({ icon, label }) => (
//   <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all text-left border border-gray-200">
//     <span className="text-xl">{icon}</span>
//     <span className="font-medium text-gray-700">{label}</span>
//   </button>
// );

// const FilePreview = ({ data, fileName, onClose }) => (
//   <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200 shadow-md">
//     <div className="flex justify-between items-center mb-5">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//           <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
//           File Preview
//         </h3>
//         <p className="text-sm text-gray-600 mt-1">{fileName}</p>
//       </div>
//       <button
//         onClick={onClose}
//         className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors text-sm shadow-md"
//       >
//         Close
//       </button>
//     </div>

//     <div className="overflow-x-auto bg-white rounded-lg shadow-md">
//       <table className="w-full text-sm">
//         <thead>
//           {data[0] && (
//             <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
//               {data[0].map((header, index) => (
//                 <th key={index} className="px-4 py-3 text-left font-semibold border-r border-blue-500 last:border-r-0">
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           )}
//         </thead>
//         <tbody>
//           {data.slice(1, 11).map((row, rowIndex) => (
//             <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//               {row.map((cell, cellIndex) => (
//                 <td key={cellIndex} className="px-4 py-3 text-gray-700 border-r border-gray-200 last:border-r-0">
//                   {cell || '-'}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>

//     {data.length > 11 && (
//       <p className="text-center text-sm text-gray-600 mt-4 font-medium">
//         Showing first 10 rows of {data.length - 1} total rows
//       </p>
//     )}
//   </div>
// );
// export default function App() {
//   const [isLoggedOut, setIsLoggedOut] = useState(false);

//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       setIsLoggedOut(true);
//       alert("Logged out successfully!");
//     }
//   };

//   if (isLoggedOut) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
//           <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Logged Out</h2>
//           <p className="text-gray-600 mb-6">You have been successfully logged out.</p>
//           <button
//             onClick={() => setIsLoggedOut(false)}
//             className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
//           >
//             Login Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <DashboardLayout onLogout={handleLogout}>
//       <DashboardHome />
//     </DashboardLayout>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { Upload, BarChart3, PieChart, TrendingUp, Clock, Download, FileSpreadsheet, Bell, X, LogOut, Eye, ChevronLeft } from 'lucide-react';
// import { BarChart, Bar, LineChart, Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const DashboardHome = () => {
//   const [dashboardData, setDashboardData] = useState({
//     totalUploads: 0,
//     filesProcessed: 0,
//     storageUsed: 0,
//     storageQuota: 100,
//     activeReports: 0,
//     chartsGenerated: 0,
//     chartsThisMonth: 0
//   });

//   const [recentActivity, setRecentActivity] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showNotification, setShowNotification] = useState(true);
//   const [uploading, setUploading] = useState(false);
//   const [userData, setUserData] = useState({
//     name: 'Rajasree Reji',
//     email: 'rajasree7@gmail.com',
//     adminPending: true
//   });

//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [fileData, setFileData] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [showChartCreator, setShowChartCreator] = useState(false);
//   const [chartConfig, setChartConfig] = useState({
//     type: 'bar',
//     xAxis: '',
//     yAxis: '',
//     title: ''
//   });
//   const [generatedChart, setGeneratedChart] = useState(null);

//   const API_BASE_URL = 'http://localhost:5000';

//   useEffect(() => {
//     loadUserData();
//     fetchDashboardData();
//     fetchRecentActivity();
//   }, []);

//   const loadUserData = () => {
//     try {
//       const storedUser = sessionStorage.getItem('user') || sessionStorage.getItem('userData');
//       if (storedUser) {
//         const user = JSON.parse(storedUser);
//         setUserData({
//           name: user.name || user.username || 'User',
//           email: user.email || '',
//           adminPending: user.role !== 'admin'
//         });
//       }
//     } catch (error) {
//       console.error('Error loading user data:', error);
//     }
//   };

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const token = sessionStorage.getItem('token') || sessionStorage.getItem('authToken');

//       const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setDashboardData({
//           totalUploads: data.totalUploads || 0,
//           filesProcessed: data.filesProcessed || 0,
//           storageUsed: data.storageUsed || 0,
//           storageQuota: data.storageQuota || 100,
//           activeReports: data.activeReports || 0,
//           chartsGenerated: data.chartsGenerated || 0,
//           chartsThisMonth: data.chartsThisMonth || 0
//         });
//       }
//     } catch (error) {
//       console.log('Error fetching dashboard data:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRecentActivity = async () => {
//     try {
//       const token = sessionStorage.getItem('token') || sessionStorage.getItem('authToken');
//       const response = await fetch(`${API_BASE_URL}/api/dashboard/recent-activity`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setRecentActivity(data.activities || []);
//       }
//     } catch (error) {
//       console.log('Error fetching recent activity:', error.message);
//     }
//   };

//   const parseCSV = (text) => {
//     const lines = text.split('\n').filter(line => line.trim());
//     const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
//     const rows = lines.slice(1).map(line => {
//       const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
//       const row = {};
//       headers.forEach((header, index) => {
//         row[header] = values[index] || '';
//       });
//       return row;
//     });
//     return { headers, rows };
//   };

//   const parseExcel = async (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         try {
//           const text = e.target.result;
//           const parsed = parseCSV(text);
//           resolve(parsed);
//         } catch (error) {
//           reject(error);
//         }
//       };
//       reader.onerror = reject;
//       reader.readAsText(file);
//     });
//   };

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const maxSize = 15 * 1024 * 1024;
//     if (file.size > maxSize) {
//       alert('⚠️ File size exceeds 15MB limit. Please choose a smaller file.');
//       event.target.value = '';
//       return;
//     }

//     const validExtensions = ['.xlsx', '.xls', '.csv'];
//     const fileName = file.name.toLowerCase();
//     const isValid = validExtensions.some(ext => fileName.endsWith(ext));

//     if (!isValid) {
//       alert('⚠️ Please upload only Excel (.xlsx, .xls) or CSV files');
//       event.target.value = '';
//       return;
//     }

//     await uploadFile(file);
//     event.target.value = '';
//   };

//   const uploadFile = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       setUploading(true);
//       const token = sessionStorage.getItem('token') || sessionStorage.getItem('authToken');

//       const response = await fetch(`${API_BASE_URL}/api/uploads`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       if (response.ok) {
//         const result = await response.json();
//         alert('✅ File uploaded successfully!');

//         await parseAndPreviewFile(file);

//         await fetchDashboardData();
//         await fetchRecentActivity();
//       } else {
//         const error = await response.json().catch(() => ({ message: 'Upload failed' }));
//         alert(`❌ ${error.message || 'Upload failed. Please try again.'}`);
//       }
//     } catch (error) {
//       console.error('❌ Error uploading file:', error);
//       await parseAndPreviewFile(file);
//       alert('⚠️ File parsed locally. Upload to server failed.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const parseAndPreviewFile = async (file) => {
//     try {
//       let parsedData;

//       if (file.name.toLowerCase().endsWith('.csv')) {
//         const text = await file.text();
//         parsedData = parseCSV(text);
//       } else {
//         parsedData = await parseExcel(file);
//       }

//       setUploadedFile(file);
//       setFileData(parsedData);
//       setShowPreview(true);
//     } catch (error) {
//       console.error('Error parsing file:', error);
//       alert('❌ Error parsing file. Please check the file format.');
//     }
//   };

//   const handleCreateChart = () => {
//     if (!fileData || !chartConfig.xAxis || !chartConfig.yAxis) {
//       alert('⚠️ Please select both X and Y axis');
//       return;
//     }

//     const chartData = fileData.rows.map(row => ({
//       [chartConfig.xAxis]: row[chartConfig.xAxis],
//       [chartConfig.yAxis]: parseFloat(row[chartConfig.yAxis]) || 0
//     })).filter(item => item[chartConfig.xAxis] && !isNaN(item[chartConfig.yAxis]));

//     setGeneratedChart({
//       data: chartData,
//       config: { ...chartConfig }
//     });
//   };

//   const handleLogout = () => {
//     sessionStorage.clear();
//     window.location.href = '/login';
//   };

//   const handleNavigation = (page) => {
//     console.log('Navigating to:', page);
//   };

//   const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

//   const StatCard = ({ icon: Icon, title, value, subtitle, gradient }) => (
//     <div className={`${gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
//       <div className="flex items-center justify-between mb-3">
//         <Icon className="w-8 h-8" />
//       </div>
//       <div className="text-sm opacity-90 mb-1">{title}</div>
//       <div className="text-4xl font-bold mb-1">{loading ? '...' : value}</div>
//       <div className="text-xs opacity-80">{subtitle}</div>
//     </div>
//   );

//   if (showPreview && fileData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//         <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-10">
//           <div className="p-6">
//             <div className="flex items-center space-x-3 mb-8">
//               <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
//                 {userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-800 text-sm">{userData.name}</div>
//                 <div className="text-xs text-gray-500 truncate max-w-[140px]">{userData.email}</div>
//               </div>
//             </div>

//             <nav className="space-y-2">
//               <button
//                 onClick={() => setShowPreview(false)}
//                 className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//                 <span className="font-medium">Back to Dashboard</span>
//               </button>
//             </nav>
//           </div>

//           <div className="absolute bottom-6 left-6 right-6">
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
//             >
//               <LogOut className="w-5 h-5" />
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>

//         <div className="ml-64 p-8">
//           <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center space-x-3">
//                 <FileSpreadsheet className="w-6 h-6 text-purple-600" />
//                 <h2 className="text-2xl font-bold text-gray-800">{uploadedFile?.name}</h2>
//               </div>
//               <button
//                 onClick={() => setShowChartCreator(!showChartCreator)}
//                 className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition"
//               >
//                 <BarChart3 className="w-5 h-5 inline mr-2" />
//                 Create Chart
//               </button>
//             </div>

//             <div className="text-sm text-gray-600 mb-4">
//               {fileData.rows.length} rows × {fileData.headers.length} columns
//             </div>

//             <div className="overflow-auto max-h-96 border rounded-lg">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50 sticky top-0">
//                   <tr>
//                     {fileData.headers.map((header, index) => (
//                       <th key={index} className="px-4 py-3 text-left font-semibold text-gray-700 border-b whitespace-nowrap">
//                         {header}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {fileData.rows.map((row, rowIndex) => (
//                     <tr key={rowIndex} className="hover:bg-gray-50">
//                       {fileData.headers.map((header, colIndex) => (
//                         <td key={colIndex} className="px-4 py-3 border-b text-gray-600 whitespace-nowrap">
//                           {row[header]}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {showChartCreator && (
//             <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//               <h3 className="text-xl font-bold text-gray-800 mb-4">Chart Configuration</h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
//                  <select
//   value={chartConfig.type}
//   onChange={(e) => setChartConfig({ ...chartConfig, type: e.target.value })}
//   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
// >
//   <option value="bar">Bar Chart</option>
//   <option value="line">Line Chart</option>
//   <option value="pie">Pie Chart</option>
// </select>

//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis</label>
//                   <select
//                     value={chartConfig.xAxis}
//                     onChange={(e) => setChartConfig({...chartConfig, xAxis: e.target.value})}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//                   >
//                     <option value="">Select column</option>
//                     {fileData.headers.map((header, index) => (
//                       <option key={index} value={header}>{header}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Y-Axis</label>
//                   <select
//                     value={chartConfig.yAxis}
//                     onChange={(e) => setChartConfig({...chartConfig, yAxis: e.target.value})}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//                   >
//                     <option value="">Select column</option>
//                     {fileData.headers.map((header, index) => (
//                       <option key={index} value={header}>{header}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Chart Title</label>
//                   <input
//                     type="text"
//                     value={chartConfig.title}
//                     onChange={(e) => setChartConfig({...chartConfig, title: e.target.value})}
//                     placeholder="Enter title"
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               <button
//                 onClick={handleCreateChart}
//                 className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
//               >
//                 Generate Chart
//               </button>
//             </div>
//           )}

// {generatedChart && (
//   <div className="bg-white rounded-2xl shadow-xl p-6">
//     <h3 className="text-xl font-bold text-gray-800 mb-4">
//       {generatedChart.config.title || 'Generated Chart'}
//     </h3>

//     <ResponsiveContainer width="100%" height={400}>
//       {generatedChart.config.type === 'bar' && (
//         <BarChart data={generatedChart.data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey={generatedChart.config.xAxis} />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey={generatedChart.config.yAxis} fill="#8b5cf6" />
//         </BarChart>
//       )}

//       {generatedChart.config.type === 'line' && (
//         <LineChart data={generatedChart.data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey={generatedChart.config.xAxis} />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey={generatedChart.config.yAxis}
//             stroke="#8b5cf6"
//             strokeWidth={2}
//             dot={{ r: 4 }}
//             activeDot={{ r: 6 }}
//           />
//         </LineChart>
//       )}

//       {generatedChart.config.type === 'pie' && (
//         <RePieChart>
//           <Pie
//             data={generatedChart.data}
//             dataKey={generatedChart.config.yAxis}
//             nameKey={generatedChart.config.xAxis}
//             cx="50%"
//             cy="50%"
//             outerRadius={150}
//             label
//           >
//             {generatedChart.data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//             ))}
//           </Pie>
//           <Tooltip />
//           <Legend />
//         </RePieChart>
//       )}
//     </ResponsiveContainer>
//   </div>
// )}

//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-10">
//         <div className="p-6">
//           <div className="flex items-center space-x-3 mb-8">
//             <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
//               {userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
//             </div>
//             <div>
//               <div className="font-semibold text-gray-800 text-sm">{userData.name}</div>
//               <div className="text-xs text-gray-500 truncate max-w-[140px]">{userData.email}</div>
//             </div>
//           </div>

//           <nav className="space-y-2">
//             <button
//               onClick={() => handleNavigation('overview')}
//               className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
//             >
//               <BarChart3 className="w-5 h-5" />
//               <span className="font-medium">Overview</span>
//             </button>
//             <button
//               onClick={() => handleNavigation('history')}
//               className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition"
//             >
//               <Clock className="w-5 h-5" />
//               <span>Upload History</span>
//             </button>
//             <button
//               onClick={() => handleNavigation('settings')}
//               className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition"
//             >
//               <Bell className="w-5 h-5" />
//               <span>Settings</span>
//             </button>
//           </nav>
//         </div>

//         <div className="absolute bottom-6 left-6 right-6">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
//           >
//             <LogOut className="w-5 h-5" />
//             <span>Logout</span>
//           </button>
//         </div>
//       </div>

//       <div className="ml-64 p-8">
//         <div className="mb-8">
//           <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-4xl font-bold mb-2">Welcome back, {userData.name.split(' ')[0]}! 👋</h1>
//                 <p className="text-lg opacity-90">Your analytics workspace is ready to transform data into insights</p>
//               </div>
//               {userData.adminPending && (
//                 <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-6 py-3">
//                   <div className="text-sm opacity-90">Request Pending</div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {showNotification && userData.adminPending && (
//           <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <Bell className="w-5 h-5 text-blue-600" />
//               </div>
//               <div>
//                 <div className="font-semibold text-blue-900">Need Admin Access?</div>
//                 <div className="text-sm text-blue-700">Your request is pending review by the superadmin</div>
//               </div>
//             </div>
//             <button onClick={() => setShowNotification(false)} className="text-blue-400 hover:text-blue-600">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             icon={Upload}
//             title="Total Uploads"
//             value={dashboardData.totalUploads}
//             subtitle={`${dashboardData.filesProcessed} files processed`}
//             gradient="bg-gradient-to-br from-cyan-400 to-blue-500"
//           />
//           <StatCard
//             icon={BarChart3}
//             title="Storage Used"
//             value={`${dashboardData.storageUsed}%`}
//             subtitle={`of ${dashboardData.storageQuota}GB quota`}
//             gradient="bg-gradient-to-br from-pink-400 to-pink-600"
//           />
//           <StatCard
//             icon={PieChart}
//             title="Active Reports"
//             value={dashboardData.activeReports}
//             subtitle="Ready for analysis"
//             gradient="bg-gradient-to-br from-green-400 to-emerald-600"
//           />
//           <StatCard
//             icon={TrendingUp}
//             title="Charts Generated"
//             value={dashboardData.chartsGenerated}
//             subtitle={`${dashboardData.chartsThisMonth} this month`}
//             gradient="bg-gradient-to-br from-orange-400 to-orange-600"
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//           <div className="lg:col-span-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl">
//             <div className="flex items-center space-x-3 mb-6">
//               <Upload className="w-6 h-6" />
//               <h2 className="text-2xl font-bold">Upload Your Data</h2>
//             </div>
//             <p className="text-sm opacity-90 mb-6">Excel (.xlsx, .xls) or CSV formats supported</p>

//             <div className={`bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 border-2 border-dashed border-white border-opacity-30 text-center hover:bg-opacity-20 transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
//               <div className="flex justify-center mb-4">
//                 <div className={`w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center ${uploading ? 'animate-pulse' : ''}`}>
//                   <Upload className="w-10 h-10 text-white" />
//                 </div>
//               </div>
//               <h3 className="text-xl font-semibold mb-2">
//                 {uploading ? 'Uploading...' : 'Drop your file here'}
//               </h3>
//               <p className="text-sm opacity-80 mb-4">
//                 {uploading ? 'Please wait while we process your file' : 'or click to browse from your computer'}
//               </p>
//               <label className={`inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold ${uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-opacity-90'} transition`}>
//                 {uploading ? 'Uploading...' : 'Choose File'}
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept=".xlsx,.xls,.csv"
//                   onChange={handleFileUpload}
//                   disabled={uploading}
//                 />
//               </label>
//               <p className="text-xs opacity-70 mt-3">Maximum file size: 15MB</p>
//             </div>
//           </div>

//           <div className="bg-white rounded-2xl p-6 shadow-xl">
//             <div className="flex items-center space-x-3 mb-4">
//               <Clock className="w-6 h-6 text-blue-600" />
//               <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
//             </div>
//             <div className="space-y-3 max-h-96 overflow-y-auto">
//               {recentActivity.length > 0 ? (
//                 recentActivity.map((activity) => (
//                   <div key={activity.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition cursor-pointer">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <FileSpreadsheet className="w-5 h-5 text-purple-600" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="font-semibold text-gray-800 text-sm truncate">{activity.fileName}</div>
//                         <div className="text-xs text-gray-500">{activity.date} • {activity.size}</div>
//                       </div>
//                     </div>
//                     <div className="mt-2">
//                       <span className={`text-xs px-2 py-1 rounded ${
//                         activity.status === 'Processed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
//                       }`}>
//                         {activity.status}
//                       </span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 text-gray-400">
//                   <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 opacity-50" />
//                   <p className="text-sm">No recent activity</p>
//                   <p className="text-xs mt-1">Upload files to see them here</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <button
//             onClick={() => handleNavigation('charts')}
//             className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition cursor-pointer group text-left"
//           >
//             <BarChart3 className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
//             <h3 className="text-xl font-bold mb-2">Create Charts</h3>
//             <p className="text-sm opacity-90 mb-3">Bar, line & pie charts</p>
//             <p className="text-xs opacity-70">Upload a file first</p>
//           </button>

//           <button
//             onClick={() => handleNavigation('mapping')}
//             className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition cursor-pointer group text-left"
//           >
//             <TrendingUp className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
//             <h3 className="text-xl font-bold mb-2">Data Mapping</h3>
//             <p className="text-sm opacity-90 mb-3">Smart analytics & stats</p>
//             <p className="text-xs opacity-70">Upload a file first</p>
//           </button>

//           <button
//             onClick={() => handleNavigation('export')}
//             className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition cursor-pointer group text-left"
//           >
//             <Download className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
//             <h3 className="text-xl font-bold mb-2">Export Data</h3>
//             <p className="text-sm opacity-90 mb-3">CSV, Excel, JSON, PNG</p>
//             <p className="text-xs opacity-70">Upload a file first</p>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHome;

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
  PieChart,
  TrendingUp,
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

export default function DashboardHome({ currentUser, theme }) {
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [stats, setStats] = useState({
    uploads: 0,
    storage: "0 MB",
    reports: 0,
    charts: 0,
  });
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

  // Default / fallback stats
  const savedStats = { uploads: 0, storage: "0 MB", reports: 0, charts: 0 };

  // Function to fetch user stats
  const viewUserDetails = async (id) => {
    try {
      const response = await adminAPI.getUserStats(id);
      const data = response.data;
        setStats({
            uploads: data.stats.totalUploads,
            storage: data.stats.storageUsed+' '+data.stats.storageUnit,
            reports: data.stats.activeReports,
            charts: data.stats.chartsGenerated,
        }); 
    } catch (err) {
      console.error("Error fetching user details:", err);
      alert("Failed to fetch user details");
      // fallback to default stats
      setStats((prev) => ({
        ...prev,
        stats: savedStats,
      }));
    }
  };

  // Call on page load (mount)
  useEffect(() => {
    if (currentUser.id) {
      viewUserDetails(currentUser.id);
    } else {
      // if userId not available, still set defaults
      setStats((prev) => ({
        ...prev,
        stats: savedStats,
      }));
    }
  }, [currentUser]);

  const StatCard = ({ icon, title, value, subtitle, color, badge }) => {
    const colorClasses = {
      purple: "from-purple-500 to-pink-500",
      orange: "from-orange-500 to-red-500",
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500",
      red: "from-red-500 to-pink-600",
      brown: "from-brown-200 to-gray-300",
    };

    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all relative">
        {badge && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
              !
            </span>
          </div>
        )}

        {/* Icon & Title Inline */}
        <div className="flex items-center mb-4 gap-3">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-md`}
          >
            <div className="text-white">{icon}</div>
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {title}
          </p>
        </div>

        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    );
  };

  // const handleFileUpload = async (e) => {
  //   const selected = e.target.files[0];
  //   if (!selected) return;

  //   const validTypes = [".csv", ".xlsx", ".xls"];
  //   const fileExtension = selected.name
  //     .substring(selected.name.lastIndexOf("."))
  //     .toLowerCase();

  //   if (!validTypes.includes(fileExtension)) {
  //     toast.error("Please upload a CSV, XLS, or XLSX file!");
  //     return;
  //   }

  //   setFile(selected);

  //   // ============================================================
  //   // UPLOAD TO BACKEND FIRST
  //   // ============================================================
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", selected);

  //     const token = localStorage.getItem("token");

  //     // Show loading toast
  //     const loadingToast = toast.loading("Uploading file...");

  //     const response = await fetch("http://localhost:5000/api/uploads", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formData,
  //     });

  //     const result = await response.json();

  //     // Dismiss loading toast
  //     toast.dismiss(loadingToast);

  //     if (!response.ok) {
  //       throw new Error(result.message || "Upload failed");
  //     }

  //     toast.success(
  //       "File uploaded successfully! Check Upload History to view it."
  //     );
  //     console.log("Upload response:", result);

  //     // Update stats
  //     setStats((prev) => ({
  //       ...prev,
  //       uploads: prev.uploads + 1,
  //       storage: `${(
  //         parseFloat(prev.storage) +
  //         selected.size / 1048576
  //       ).toFixed(2)} MB`,
  //     }));
  //   } catch (error) {
  //     console.error("Upload error:", error);
  //     toast.error(error.message || "Failed to upload file to server!");
  //     return; // Stop here if backend upload fails
  //   }

  //   // ============================================================
  //   // CONTINUE WITH LOCAL PREVIEW (CSV ONLY)
  //   // ============================================================
  //   if (fileExtension === ".csv") {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const content = event.target.result;
  //       const lines = content.split("\n").filter((line) => line.trim());

  //       if (lines.length === 0) {
  //         toast.error("File is empty!");
  //         return;
  //       }

  //       const rows = lines.map((line) => {
  //         const regex = /(".*?"|[^",\s]+)(?=\s*,|\s*$)/g;
  //         const matches = [];
  //         let match;
  //         while ((match = regex.exec(line)) !== null) {
  //           matches.push(match[0].replace(/^"|"$/g, "").trim());
  //         }
  //         return matches.length > 0
  //           ? matches
  //           : line.split(",").map((cell) => cell.trim());
  //       });

  //       setFileData({
  //         headers: rows[0] || [],
  //         rows: rows.slice(1, 31),
  //       });
  //     };

  //     reader.onerror = () => {
  //       toast.error("Failed to read file!");
  //     };

  //     reader.readAsText(selected);
  //   } else {
  //     // For Excel files, just show success message (already uploaded to backend)
  //     console.log("Excel file uploaded successfully to backend");
  //   }
  // };



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

    // ============================================================
    // UPLOAD TO BACKEND FIRST
    // ============================================================
    try {
      const formData = new FormData();
      formData.append("file", selected);

      const token = localStorage.getItem("token");

      // Show loading toast
      const loadingToast = toast.loading("Uploading file...");

      // const response = await fetch("http://localhost:5000/api/uploads", 
      const response = await api.get('/uploads',{
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      // setting Response
      setUploadRes(result.file);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      toast.success(
        "File uploaded successfully! Check Upload History to view it."
      );
      console.log("Upload response:", result);

      // Update stats
      setStats((prev) => ({
        ...prev,
        uploads: prev.uploads + 1,
        storage: `${(
          parseFloat(prev.storage) +
          selected.size / 1048576
        ).toFixed(2)} MB`,
      }));
    } catch (error) {
      setUploadRes(null);
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file to server!");
      return; // Stop here if backend upload fails
    }

    // ============================================================
    // CONTINUE WITH LOCAL PREVIEW (CSV & EXCEL)
    // ============================================================
    if (fileExtension === ".csv") {
      const reader = new FileReader();
      reader.onload = (event) => {
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
      };

      reader.onerror = () => {
        toast.error("Failed to read file!");
      };

      reader.readAsText(selected);
    } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      // Handle Excel files
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          
          // Dynamically import XLSX
          const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs');
          
          // Read the workbook
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get the first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON (array of arrays)
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length === 0) {
            toast.error("File is empty!");
            return;
          }
          
          // Filter out empty rows
          const filteredData = jsonData.filter(row => 
            row.some(cell => cell !== null && cell !== undefined && cell !== '')
          );
          
          setFileData({
            headers: filteredData[0] || [],
            rows: filteredData.slice(1, 31), // Show first 30 rows
          });
          
          console.log("Excel file parsed successfully");
        } catch (error) {
          console.error("Error parsing Excel file:", error);
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
      .filter((item) => item !== null); // ✅ removed .slice(0, 30)

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

    const res = await userAPI.updateChart(uploadRes.id);

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

  // HELPER FUNCTION: Convert fileData to array format for export
  const getExportData = () => {
    const dataToExport = mappedData || fileData;
    if (!dataToExport) return null;

    // Convert to array format [headers, ...rows]
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

  const cardGradient =
    theme === "dark"
      ? "bg-gradient-to-br from-blue-900 to-blue-800"
      : "bg-gradient-to-br from-blue-50 to-blue-100";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  return (
    <div className={`w-full min-h-screen bg-gradient-to-b from-[#fbf9fb] to-[#c4c799] transition-all`}>
      <Toaster position="top-center" />

      {/* Welcome Section */}
      <div className="px-8 lg:px-12 pt-12 pb-6">
        <h1 className="text-4xl lg:text-5xl font-bold flex items-center gap-3">
          Welcome, {currentUser.name}!{" "}
          <Handshake className="text-[#bc4e9c]" size={40} />
        </h1>
        <p className="text-[#9CA3AF] mt-3 text-lg">
          Manage your data with ease and efficiency
        </p>
      </div>

      {/* Stats Section */}
      <div className="px-8 lg:px-12 py-10">
        <h2 className="text-2xl lg:text-3xl font-bold mb-8">Your Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <StatCard
            icon={
              <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />
            }
            title="Total Uploads"
            value={stats.uploads}
            color="brown"
          />

          <StatCard
            icon={
              <FileSpreadsheet className="h-8 w-8 text-bule-600 dark:text-blue-400" />
            }
            title="Storage Used"
            value={stats.storage}
            color="brown"
          />

          <StatCard
            icon={
              <Brain className="h-8 w-8 text-pink-600 dark:text-pink-400" />
            }
            title="Active Reports"
            value={stats.reports}
            color="brown"
          />

          <StatCard
            icon={
              <BarChart3 className="h-8 w-8 text-red-600 dark:text-red-400" />
            }
            title="Charts Generated"
            value={stats.charts}
            color="brown"
          />
        </div>
      </div>

      <div className="px-8 lg:px-12 py-2">
        <hr className="border-t-2 border-[#bc4e9c] " />
      </div>

      {/* Upload Section */}
      <div className="px-8 lg:px-12 py-10">
        <h2 className="text-2xl lg:text-3xl font-bold mb-8">
          Upload Your Data
        </h2>
        <div
          className={`p-12 lg:p-5 rounded-3xl shadow-2xl ${cardGradient} border-2 border-[#bc4e9c] transition-all`}
        >
          <div className="flex flex-col items-center justify-center gap-8 py-8">
            <div className="p-8 rounded-3xl bg-[#F472B6]/25 transition-all">
              <Upload className="h-8 w-8 text-[#561292]" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                Upload CSV, XLS, or XLSX Files
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Drag and drop or click to select files
              </p>
            </div>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-gradient-to-t from-[#bc4e9c] to-[#f80759] text-white px-12 py-4 rounded-2xl shadow-lg hover:shadow-2xl hover:from-[#7a3366] hover:to-[#ae063e] transition-all font-bold text-lg"
            >
              Choose File
            </button>
            {file && (
              <p
                className={`text-[#bc4e9c] font-bold text-lg break-all`}
              >
                ✓ {file.name}
              </p>
            )}
          </div>

          {/* File Preview */}
          {(fileData || mappedData) && (
            <div className="mt-10 bg-[#e8bef270] rounded-3xl p-8 border-2 border-[#bc4e9c] shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-2xl text-white dark:text-black">
                  {file.name} {mappedData && "(Mapped)"}
                </h3>
                <button
                  onClick={closePreview}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transition-all font-bold flex items-center"
                >
                  Close Preview
                </button>
              </div>
              <div
                ref={tableRef}
                className="max-h-96 overflow-x-auto overflow-y-auto rounded-2xl border-2 border-[#bc4e9c]"
              >
                <table className="w-full border-collapse text-base bg-gray-100">
                  <thead className="bg-gradient-to-t from-[#561292] to-[#4a00e0] sticky top-0">
                    <tr>
                      {(mappedData || fileData).headers.map((header, idx) => (
                        <th
                          key={idx}
                          className="border border-[#bc4e9c] px-6 py-4 text-left font-bold text-white"
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
                          rowIdx % 2 === 0
                            ? "bg-gray-100"
                            : "bg-gray-200"
                        } hover:bg-gray-100 dark:hover:bg-gray-300 transition `}
                      >
                        {row.map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="border border-[#4a00e0] px-6 py-3  text-black"
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

          {/* Generated Chart Display */}
          {generatedChart &&
            generatedChart.data &&
            generatedChart.data.length > 0 && (
              <div className="mt-10 bg-blue-100  rounded-3xl p-8 border-2 border-[#bc4e9c] shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-bold text-2xl text-white dark:text-black">Generated Chart</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-800 mt-1">
                      {generatedChart.xAxisLabel} vs {generatedChart.yAxisLabel}{" "}
                      ({generatedChart.data.length} points)
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveModal("export")}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all font-bold flex items-center gap-2"
                  >
                    <Download size={18} />
                    Export Chart
                  </button>
                </div>
                <div
                  ref={chartRef}
                  style={{
                    width: "100%",
                    height: "533px",
                    backgroundColor: theme === "dark" ? "rgba(215, 217, 222, 0.47)" : "#ffffff",
                    padding: "30px",
                    borderRadius: "12px",
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
                          angle={-90}
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
                          outerRadius={150}
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

      <div className="px-8 lg:px-12 py-2">
        <hr className="border-t-2 border-[#bc4e9c]" />
      </div>

      {/* Features Section */}
      <div className="px-8 lg:px-12 py-10">
        <h2 className="text-2xl lg:text-3xl font-bold mb-10">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
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
              className={`p-10 lg:p-12 rounded-3xl shadow-2xl flex flex-col items-center gap-6 transition-all duration-300 hover:shadow-3xl hover:scale-105 ${cardGradient} border-2 border-[#bc4e9c] group`}
            >
              <div className="p-6 bg-[#F472B6]/25 group-hover:bg-[#F472B6]/35 rounded-2xl transition-all">
                <Icon className="h-12 w-12 text-[#561292]" />
              </div>
              <h3
                className={`text-2xl lg:text-3xl font-bold text-center ${textColor}`}
              >
                {title}
              </h3>
              <p className="text-[#9CA3AF] text-center text-lg">
                {desc}
              </p>
              <button
                onClick={action}
                className="bg-gradient-to-t from-[#bc4e9c] to-[#f80759] hover:from-[#7a3366] hover:to-[#ae063e] text-white px-10 py-3 rounded-2xl shadow-lg hover:shadow-xl  transition-all font-bold text-lg"
              >
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Creation Modal */}
      {activeModal === "chart" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            className={`${cardGradient} rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-[#bc4e9c]`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Create Chart</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="hover:text-gray-700 dark:hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Chart Type
                </label>
                <select
                  value={chartConfig.type}
                  onChange={(e) =>
                    setChartConfig({ ...chartConfig, type: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 ">
                  X-Axis Column (Labels)
                </label>
                <select
                  value={chartConfig.xAxis}
                  onChange={(e) =>
                    setChartConfig({ ...chartConfig, xAxis: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
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
                <label className="block text-sm font-bold mb-2 ">
                  Y-Axis Column (Numeric Values)
                </label>
                <select
                  value={chartConfig.yAxis}
                  onChange={(e) =>
                    setChartConfig({ ...chartConfig, yAxis: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
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
                className="w-full bg-gradient-to-t from-[#bc4e9c] to-[#f80759] hover:from-[#7a3366] hover:to-[#ae063e] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold"
              >
                Generate Chart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Mapping Modal */}
      {activeModal === "mapping" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div
            className={`${cardGradient} rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-[#bc4e9c]`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Data Mapping</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="hover:text-gray-700  dark:hover:text-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 ">
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
                  className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
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
                <label className="block text-sm font-bold mb-2 ">
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
                  className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
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
                <label className="block text-sm font-bold mb-2 ">
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
                  className="w-full p-3 rounded-xl border-2 border-[#bc4e9c] bg-white dark:bg-gray-100 text-gray-900 dark:text-gray-700"
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
                className="w-full bg-gradient-to-t from-[#bc4e9c] to-[#f80759] hover:from-[#7a3366] hover:to-[#ae063e] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all font-bold"
              >
                Apply Mapping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
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
