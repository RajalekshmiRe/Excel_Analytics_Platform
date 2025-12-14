// // src/layout/DashboardLayout.jsx

// import React, { useState, useEffect } from "react";
// import {
//   Home,
//   Clock,
//   BarChart3,
//   UserCog,
//   Settings as SettingsIcon,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import DashboardHome from "../pages/DashboardHome";
// import Settings from "../pages/Settings";
// import RequestAdminAccess from "../pages/RequestAdminAccess";
// import toast, { Toaster } from "react-hot-toast";
// import { authAPI } from "../api";

// // Upload History Page
// function UploadHistory({ theme, currentUser }) {
//   const [uploads, setUploads] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUploads = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch("http://localhost:5000/api/uploads", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setUploads(data.uploads || []);
//         }
//       } catch (error) {
//         console.error("Error fetching uploads:", error);
//         toast.error("Failed to load upload history");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUploads();
//   }, []);

//   const bgColor =
//     theme === "dark"
//       ? "bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900"
//       : "bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50";

//   const cardGradient =
//     theme === "dark"
//       ? "bg-gradient-to-br from-blue-900 to-blue-800"
//       : "bg-gradient-to-br from-blue-50 to-blue-100";

//   return (
//     <div className={`p-8 lg:p-12 min-h-screen ${bgColor}`}>
//       <h2 className="text-3xl lg:text-4xl font-bold mb-10">Upload History</h2>
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#bc4e9c] "></div>
//         </div>
//       ) : uploads.length === 0 ? (
//         <p className="text-gray-600 dark:text-gray-400 text-lg">
//           No uploads yet.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {uploads.map((file, idx) => (
//             <div
//               key={idx}
//               className={`p-8 rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:scale-105 ${cardGradient} border-2 border-[#bc4e9c] `}
//             >
//               <h3 className="font-bold text-lg break-all mb-4">
//                 {file.originalName}
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 text-base">
//               <p>Size: {(file.size / 1048576).toFixed(4)} MB</p>
//               </p>
//               <p className="text-gray-600 dark:text-gray-400 text-base">
//                 Uploaded: {new Date(file.createdAt).toLocaleDateString()}
//               </p>
//               <p className="text-gray-600 dark:text-gray-400 text-base">
//                 Type: {file.fileType.toUpperCase()}
//               </p>
//               <p className="text-gray-600 dark:text-gray-400 text-base">
//                 Status:{" "}
//                 <span
//                   className={`font-bold ${
//                     file.status === "processed"
//                       ? "text-green-600"
//                       : "text-yellow-600"
//                   }`}
//                 >
//                   {file.status.toUpperCase()}
//                 </span>
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
// // Analytics Page
// function Analytics({ theme, currentUser }) {
//   const [analyticsData, setAnalyticsData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           setError("No authentication token found");
//           setLoading(false);
//           return;
//         }

//         const response = await fetch(
//           "http://localhost:5000/api/analysis/analytics",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         const data = await response.json();

//         if (!response.ok) {
//           throw new Error(data.message || `Server error: ${response.status}`);
//         }

//         if (data.success && data.data) {
//           setAnalyticsData(data.data);
//         } else {
//           throw new Error("Invalid response format");
//         }
//       } catch (error) {
//         console.error("Error fetching analytics:", error);
//         setError(error.message);
//         toast.error(`Failed to load analytics: ${error.message}`);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAnalytics();
//   }, []);

//   const bgColor =
//     theme === "dark"
//       ? "bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900"
//       : "bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50";
//   const cardGradient =
//     theme === "dark"
//       ? "bg-gradient-to-br from-blue-900 to-blue-800"
//       : "bg-gradient-to-br from-blue-50 to-blue-100";

//   if (loading) {
//     return (
//       <div
//         className={`p-8 lg:p-12 min-h-screen ${bgColor} flex items-center justify-center`} 
//       >
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#bc4e9c] mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400 text-lg">
//             Loading analytics...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`p-8 lg:p-12 min-h-screen ${bgColor}`}>
//         <Toaster position="top-center" />
//         <h2 className="text-3xl lg:text-4xl font-bold mb-10">
//           Analytics Dashboard
//         </h2>
//         <div
//           className={`p-10 rounded-2xl shadow-xl ${cardGradient} border-2 border-red-300 dark:border-red-600`}
//         >
//           <div className="text-center">
//             <div className="text-red-500 text-6xl mb-4">⚠️</div>
//             <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
//               Failed to Load Analytics
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all font-bold"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`p-8 lg:p-12 min-h-screen ${bgColor}`}>
//       <Toaster position="top-center" />
//       <h2 className="text-3xl lg:text-4xl font-bold mb-10">
//         Analytics Dashboard
//       </h2>

//       {analyticsData ? (
//         <>
//           {/* Stats Overview */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
//             <div
//               className={`p-8 rounded-2xl shadow-xl ${cardGradient} border-2 border-[#bc4e9c] `}
//             >
//               <h3 className="font-bold text-xl mb-4">Total Uploads</h3>
//               <p className="text-4xl font-bold text-[#bc4e9c]">
//                 {analyticsData.totalUploads || 0}
//               </p>
//             </div>

//             <div
//               className={`p-8 rounded-2xl shadow-xl ${cardGradient} border-2 border-[#bc4e9c] `}
//             >
//               <h3 className="font-bold text-xl mb-4">Total Storage</h3>
//               <p className="text-4xl font-bold text-[#bc4e9c]">
//                 {((analyticsData.totalSize || 0) / 1048576).toFixed(2)} MB
//               </p>
//             </div>

//             <div
//               className={`p-8 rounded-2xl shadow-xl ${cardGradient} border-2 border-[#bc4e9c] `}
//             >
//               <h3 className="font-bold text-xl mb-4">File Types</h3>
//               <p className="text-4xl font-bold text-[#bc4e9c]">
//                 {analyticsData.typeData?.length || 0}
//               </p>
//             </div>
//           </div>

//           {/* Charts */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div
//               className={`p-10 rounded-2xl shadow-xl ${cardGradient} border-2 border-[#bc4e9c] `}
//             >
//               <h3 className="font-bold text-xl mb-6">Uploads by Type</h3>
//               <div className="space-y-4">
//                 {analyticsData.typeData && analyticsData.typeData.length > 0 ? (
//                   analyticsData.typeData.map((item, idx) => (
//                     <div
//                       key={idx}
//                       className="flex justify-between items-center"
//                     >
//                       <span className="font-semibold">{item.type}</span>
//                       <span className="text-[#bc4e9c] font-bold">
//                         {item.count} files
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 dark:text-gray-400">
//                     No data available
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div
//               className={`p-10 rounded-2xl shadow-xl ${cardGradient} border-2 border-[#bc4e9c] `}
//             >
//               <h3 className="font-bold text-xl mb-6">Recent Uploads</h3>
//               <div className="space-y-4">
//                 {analyticsData.recentUploads &&
//                 analyticsData.recentUploads.length > 0 ? (
//                   analyticsData.recentUploads.slice(0, 5).map((upload, idx) => (
//                     <div
//                       key={idx}
//                       className="flex justify-between items-center"
//                     >
//                       <span className="font-semibold truncate max-w-[200px]">
//                         {upload.fileName}
//                       </span>
//                       <span className="text-sm text-gray-600 dark:text-gray-400">
//                         {new Date(upload.uploadDate).toLocaleDateString()}
//                       </span>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 dark:text-gray-400">
//                     No recent uploads
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </>
//       ) : (
//         <div
//           className={`p-10 rounded-2xl shadow-xl ${cardGradient} border-2 border-[#bc4e9c]  text-center`}
//         >
//           <p className="text-gray-600 dark:text-gray-400 text-lg">
//             No analytics data available
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// // Settings Page
// function SettingsPage({ currentUser, theme, setTheme }) {
//   const [name, setName] = useState(currentUser.name);
//   const [email, setEmail] = useState(currentUser.email);
//   const [password, setPassword] = useState("");
//   const [darkMode, setDarkMode] = useState(theme === "dark");

//   const handleSave = () => {
//     const updatedUser = { ...currentUser, name, email };
//     localStorage.setItem("user", JSON.stringify(updatedUser));
//     setTheme(darkMode ? "dark" : "light");
//     toast.success("Settings saved successfully!");
//   };

//   const bgColor =
//     theme === "dark"
//       ? "bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900"
//       : "bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50";
//   const cardGradient =
//     theme === "dark"
//       ? "bg-gradient-to-br from-blue-900 to-blue-800"
//       : "bg-gradient-to-br from-blue-50 to-blue-100";

//   return (
//     <div className={`p-8 lg:p-12 min-h-screen ${bgColor}`}>
//       <Toaster position="top-center" reverseOrder={false} />
//       <h2 className="text-3xl lg:text-4xl font-bold mb-12">Settings</h2>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//         {/* Profile Info */}
//         <div
//           className={`p-10 rounded-2xl shadow-xl ${cardGradient} border-2 border-blue-300 dark:border-blue-600`}
//         >
//           <h3 className="text-2xl lg:text-3xl font-bold mb-8">
//             Basic Information
//           </h3>
//           <div className="flex flex-col gap-8">
//             <div>
//               <label className="block text-base font-bold mb-3">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full px-6 py-4 text-base border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-900 dark:border-blue-600 dark:text-white"
//               />
//             </div>
//             <div>
//               <label className="block text-base font-bold mb-3">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-6 py-4 text-base border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-900 dark:border-blue-600 dark:text-white"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Password & Theme */}
//         <div
//           className={`p-10 rounded-2xl shadow-xl ${cardGradient} border-2 border-blue-300 dark:border-blue-600`}
//         >
//           <h3 className="text-2xl lg:text-3xl font-bold mb-8">
//             Security & Appearance
//           </h3>
//           <div className="flex flex-col gap-8">
//             <div>
//               <label className="block text-base font-bold mb-3">
//                 Change Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="Enter new password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-6 py-4 text-base border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-900 dark:border-blue-600 dark:text-white"
//               />
//             </div>

//             <div className="flex items-center justify-between p-6 bg-blue-500/15 rounded-xl border-2 border-blue-300 dark:border-blue-600">
//               <span className="font-bold text-lg">Dark Mode</span>
//               <input
//                 type="checkbox"
//                 checked={darkMode}
//                 onChange={(e) => setDarkMode(e.target.checked)}
//                 className="w-6 h-6 cursor-pointer accent-blue-500"
//               />
//             </div>

//             <button
//               onClick={handleSave}
//               className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all font-bold text-lg"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function DashboardLayout() {
//   const navigate = useNavigate();

//   const getUserFromStorage = () => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       return storedUser
//         ? JSON.parse(storedUser)
//         : { name: "Guest User", email: "guest@example.com" };
//     } catch {
//       return { name: "Guest User", email: "guest@example.com" };
//     }
//   };

//   const [user] = useState(getUserFromStorage());
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [activeView, setActiveView] = useState("dashboard");
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

//   useEffect(() => {
//     document.documentElement.classList.remove("light", "dark");
//     document.documentElement.classList.add(theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const handleLogout = async () => {
//     if (window.confirm("Are you sure you want to logout?")) {
    
//       const res = await authAPI.logout(user.id);
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       navigate("/login");
//     }
//   };

//   const initials = user.name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   const navLinks = [
//     { id: "dashboard", label: "Dashboard", icon: Home },
//     { id: "history", label: "Upload History", icon: Clock },
//     { id: "analytics", label: "Analytics", icon: BarChart3 },
//     { id: "request-admin", label: "Request Admin Access", icon: UserCog },
//     { id: "settings", label: "Settings", icon: SettingsIcon },
//   ];

//   const renderActiveView = () => {
//     switch (activeView) {
//       case "dashboard":
//         return <DashboardHome currentUser={user} theme={theme} />;
//       case "history":
//         return <UploadHistory theme={theme} currentUser={user} />;
//       case "analytics":
//         return <Analytics theme={theme} currentUser={user} />;
//       case "settings":
//         return (
//           <Settings currentUser={user} theme={theme} setTheme={setTheme} />
//         );
//       case "request-admin":
//         return <RequestAdminAccess currentUser={user} theme={theme} />;
//       default:
//         return (
//           <div className="p-12 text-center text-gray-600 dark:text-gray-300">
//             <h2 className="text-2xl font-bold">Page under development...</h2>
//           </div>
//         );
//     }
//   };

//   return (
//     <div
//       className={`flex h-screen transition-colors duration-300 ${
//         theme === "dark"
//           ? "text-black"
//           : "text-black"
//       }`}
//     >
//       {/* Sidebar */}
//       <aside
//         className={`hidden lg:flex flex-col transition-all duration-300 shadow-2xl bg-gradient-to-br from-[#561292] to-[#4a00e0] text-white ${
//           isSidebarOpen ? "w-72" : "w-24"
//         } `}
//       >
//         {/* User Section */}
//         <div className="p-6 border-b border-gray-500 dark:border-gray-600">
//           {isSidebarOpen ? (
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gradient-to-t from-[#bc4e9c] to-[#f80759] text-white font-bold shadow-lg text-lg">
//                   {initials}
//                 </div>
//                 <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
//               </div>
//               <div className="flex-1">
//                 <p className="font-bold text-white text-base truncate">
//                   {user.name}
//                 </p>
//                 <p className="text-sm text-blue-100 truncate">{user.email}</p>
//               </div>
//             </div>
//           ) : (
//             <div className="relative mx-auto">
//               <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold shadow-lg text-lg">
//                 {initials}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Sidebar Toggle */}
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="mx-4 mt-4 p-3 text-gray-700 dark:text-gray-200 hover:bg-[#f80759]/60 rounded-xl transition-all font-bold"
//         >
//           {isSidebarOpen ? (
//             <ChevronLeft className="h-6 w-6" />
//           ) : (
//             <ChevronRight className="h-6 w-6" />
//           )}
//         </button>

//         {/* Navigation */}
//         <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//           {navLinks.map(({ id, label, icon: Icon }) => (
//             <button
//               key={id}
//               onClick={() => setActiveView(id)}
//               className={`flex items-center gap-4 px-5 py-4 rounded-xl w-full transition-all font-semibold text-base ${
//                 activeView === id
//                   ? "bg-gradient-to-t from-[#bc4e9c] to-[#f80759] text-white shadow-lg scale-105"
//                   : "text-[#ffffff] hover:bg-[#f80759]/60 "
//               }`}
//             >
//               <Icon className="h-6 w-6" />
//               {isSidebarOpen && <span>{label}</span>}
//             </button>
//           ))}
//         </nav>

//         {/* Logout */}
//         <div className="p-4 border-t border-gray-500 dark:border-gray-700">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg"
//           >
//             <LogOut size={22} />
//             {isSidebarOpen && <span>Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto">{renderActiveView()}</main>
//     </div>
//   );
// }



// import React, { useState, useEffect } from "react";
// import {
//   Home,
//   Clock,
//   BarChart3,
//   UserCog,
//   Settings as SettingsIcon,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import DashboardHome from "../pages/DashboardHome";
// import Settings from "../pages/Settings";
// import RequestAdminAccess from "../pages/RequestAdminAccess";
// import Analytics from "../pages/Analytics"; // ✅ IMPORT THE FULL ANALYTICS COMPONENT
// import toast, { Toaster } from "react-hot-toast";
// import { authAPI, uploadAPI, analysisAPI } from "../api";

// // ============================================================
// // ✅ Upload History Component (Keep this one)
// // ============================================================
// function UploadHistory({ theme, currentUser }) {
//   const [uploads, setUploads] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUploads = async () => {
//       try {
//         setLoading(true);
        
//         const response = await uploadAPI.getUploads();
//         console.log("Upload history response:", response.data);
        
//         const uploadsArray = response.data.uploads || response.data || [];
//         setUploads(Array.isArray(uploadsArray) ? uploadsArray : []);
//       } catch (error) {
//         console.error("Error fetching uploads:", error);
//         toast.error("Failed to load upload history");
//         setUploads([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (currentUser) {
//       fetchUploads();
//     }
//   }, [currentUser]);

//   const bgColor =
//     theme === "dark"
//       ? "bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900"
//       : "bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50";

//   const cardGradient =
//     theme === "dark"
//       ? "bg-gradient-to-br from-blue-900 to-blue-800"
//       : "bg-gradient-to-br from-blue-50 to-blue-100";

//   return (
//     <div className={`p-8 lg:p-12 min-h-screen ${bgColor}`}>
//       <Toaster position="top-center" />
//       <h2 className="text-3xl lg:text-4xl font-bold mb-10">Upload History</h2>
//       {loading ? (
//         <div className="flex items-center justify-center py-20">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#bc4e9c]"></div>
//         </div>
//       ) : uploads.length === 0 ? (
//         <div className={`p-10 rounded-2xl shadow-xl ${cardGradient} border-2 border-[#bc4e9c] text-center`}>
//           <p className="text-gray-600 dark:text-gray-400 text-lg">
//             No uploads yet. Upload your first Excel file to get started!
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {uploads.map((file) => (
//             <div
//               key={file._id || file.id}
//               className={`p-8 rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:scale-105 ${cardGradient} border-2 border-[#bc4e9c]`}
//             >
//               <h3 className="font-bold text-lg break-all mb-4">
//                 {file.filename || file.originalName || file.originalname || 'Unknown File'}
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 text-base">
//                 Size: {((file.size || file.filesize || 0) / 1048576).toFixed(4)} MB
//               </p>
//               <p className="text-gray-600 dark:text-gray-400 text-base">
//                 Uploaded: {new Date(file.createdAt || file.uploadedAt).toLocaleDateString()}
//               </p>
//               <p className="text-gray-600 dark:text-gray-400 text-base">
//                 Status:{" "}
//                 <span
//                   className={`font-bold ${
//                     (file.status || '').toLowerCase() === "processed"
//                       ? "text-green-600"
//                       : "text-yellow-600"
//                   }`}
//                 >
//                   {(file.status || 'Ready').toUpperCase()}
//                 </span>
//               </p>
//               {file.chartCount !== undefined && (
//                 <p className="text-gray-600 dark:text-gray-400 text-base">
//                   Charts: {file.chartCount || 0}
//                 </p>
//               )}
//               {file.reportCount !== undefined && (
//                 <p className="text-gray-600 dark:text-gray-400 text-base">
//                   Reports: {file.reportCount || 0}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ============================================================
// // ❌ REMOVE THIS ANALYTICS COMPONENT - Use the imported one instead
// // ============================================================

// // Settings Page (unchanged)
// function SettingsPage({ currentUser, theme, setTheme }) {
//   const [name, setName] = useState(currentUser.name);
//   const [email, setEmail] = useState(currentUser.email);
//   const [password, setPassword] = useState("");
//   const [darkMode, setDarkMode] = useState(theme === "dark");

//   const handleSave = () => {
//     const updatedUser = { ...currentUser, name, email };
//     localStorage.setItem("user", JSON.stringify(updatedUser));
//     setTheme(darkMode ? "dark" : "light");
//     toast.success("Settings saved successfully!");
//   };

//   const bgColor =
//     theme === "dark"
//       ? "bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900"
//       : "bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50";
//   const cardGradient =
//     theme === "dark"
//       ? "bg-gradient-to-br from-blue-900 to-blue-800"
//       : "bg-gradient-to-br from-blue-50 to-blue-100";

//   return (
//     <div className={`p-8 lg:p-12 min-h-screen ${bgColor}`}>
//       <Toaster position="top-center" reverseOrder={false} />
//       <h2 className="text-3xl lg:text-4xl font-bold mb-12">Settings</h2>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//         {/* Profile Info */}
//         <div
//           className={`p-10 rounded-2xl shadow-xl ${cardGradient} border-2 border-blue-300 dark:border-blue-600`}
//         >
//           <h3 className="text-2xl lg:text-3xl font-bold mb-8">
//             Basic Information
//           </h3>
//           <div className="flex flex-col gap-8">
//             <div>
//               <label className="block text-base font-bold mb-3">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full px-6 py-4 text-base border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-900 dark:border-blue-600 dark:text-white"
//               />
//             </div>
//             <div>
//               <label className="block text-base font-bold mb-3">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-6 py-4 text-base border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-900 dark:border-blue-600 dark:text-white"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Password & Theme */}
//         <div
//           className={`p-10 rounded-2xl shadow-xl ${cardGradient} border-2 border-blue-300 dark:border-blue-600`}
//         >
//           <h3 className="text-2xl lg:text-3xl font-bold mb-8">
//             Security & Appearance
//           </h3>
//           <div className="flex flex-col gap-8">
//             <div>
//               <label className="block text-base font-bold mb-3">
//                 Change Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="Enter new password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-6 py-4 text-base border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-900 dark:border-blue-600 dark:text-white"
//               />
//             </div>

//             <div className="flex items-center justify-between p-6 bg-blue-500/15 rounded-xl border-2 border-blue-300 dark:border-blue-600">
//               <span className="font-bold text-lg">Dark Mode</span>
//               <input
//                 type="checkbox"
//                 checked={darkMode}
//                 onChange={(e) => setDarkMode(e.target.checked)}
//                 className="w-6 h-6 cursor-pointer accent-blue-500"
//               />
//             </div>

//             <button
//               onClick={handleSave}
//               className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all font-bold text-lg"
//             >
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ============================================================
// // Main Dashboard Layout
// // ============================================================
// export default function DashboardLayout() {
//   const navigate = useNavigate();

//   const getUserFromStorage = () => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       return storedUser
//         ? JSON.parse(storedUser)
//         : { name: "Guest User", email: "guest@example.com" };
//     } catch {
//       return { name: "Guest User", email: "guest@example.com" };
//     }
//   };

//   const [user] = useState(getUserFromStorage());
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [activeView, setActiveView] = useState("dashboard");
//   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

//   useEffect(() => {
//     document.documentElement.classList.remove("light", "dark");
//     document.documentElement.classList.add(theme);
//     localStorage.setItem("theme", theme);
//   }, [theme]);

//   const handleLogout = async () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       try {
//         await authAPI.logout(user.id);
//       } catch (error) {
//         console.error("Logout error:", error);
//       }
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       navigate("/login");
//     }
//   };

//   const initials = user.name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   const navLinks = [
//     { id: "dashboard", label: "Dashboard", icon: Home },
//     { id: "history", label: "Upload History", icon: Clock },
//     { id: "analytics", label: "Analytics", icon: BarChart3 },
//     { id: "request-admin", label: "Request Admin Access", icon: UserCog },
//     { id: "settings", label: "Settings", icon: SettingsIcon },
//   ];

//   const renderActiveView = () => {
//     switch (activeView) {
//       case "dashboard":
//         return <DashboardHome currentUser={user} theme={theme} />;
//       case "history":
//         return <UploadHistory theme={theme} currentUser={user} />;
//       case "analytics":
//         // ✅ NOW USING THE IMPORTED ANALYTICS COMPONENT
//         return <Analytics theme={theme} currentUser={user} />;
//       case "settings":
//         return (
//           <Settings currentUser={user} theme={theme} setTheme={setTheme} />
//         );
//       case "request-admin":
//         return <RequestAdminAccess currentUser={user} theme={theme} />;
//       default:
//         return (
//           <div className="p-12 text-center text-gray-600 dark:text-gray-300">
//             <h2 className="text-2xl font-bold">Page under development...</h2>
//           </div>
//         );
//     }
//   };

//   return (
//     <div
//       className={`flex h-screen transition-colors duration-300 ${
//         theme === "dark" ? "text-black" : "text-black"
//       }`}
//     >
//       {/* Sidebar */}
//       <aside
//         className={`hidden lg:flex flex-col transition-all duration-300 shadow-2xl bg-gradient-to-br from-[#561292] to-[#4a00e0] text-white ${
//           isSidebarOpen ? "w-72" : "w-24"
//         }`}
//       >
//         {/* User Section */}
//         <div className="p-6 border-b border-gray-500 dark:border-gray-600">
//           {isSidebarOpen ? (
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gradient-to-t from-[#bc4e9c] to-[#f80759] text-white font-bold shadow-lg text-lg">
//                   {initials}
//                 </div>
//                 <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-gray-900 rounded-full"></div>
//               </div>
//               <div className="flex-1">
//                 <p className="font-bold text-white text-base truncate">
//                   {user.name}
//                 </p>
//                 <p className="text-sm text-blue-100 truncate">{user.email}</p>
//               </div>
//             </div>
//           ) : (
//             <div className="relative mx-auto">
//               <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold shadow-lg text-lg">
//                 {initials}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Sidebar Toggle */}
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="mx-4 mt-4 p-3 text-gray-700 dark:text-gray-200 hover:bg-[#f80759]/60 rounded-xl transition-all font-bold"
//         >
//           {isSidebarOpen ? (
//             <ChevronLeft className="h-6 w-6" />
//           ) : (
//             <ChevronRight className="h-6 w-6" />
//           )}
//         </button>

//         {/* Navigation */}
//         <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
//           {navLinks.map(({ id, label, icon: Icon }) => (
//             <button
//               key={id}
//               onClick={() => setActiveView(id)}
//               className={`flex items-center gap-4 px-5 py-4 rounded-xl w-full transition-all font-semibold text-base ${
//                 activeView === id
//                   ? "bg-gradient-to-t from-[#bc4e9c] to-[#f80759] text-white shadow-lg scale-105"
//                   : "text-[#ffffff] hover:bg-[#f80759]/60"
//               }`}
//             >
//               <Icon className="h-6 w-6" />
//               {isSidebarOpen && <span>{label}</span>}
//             </button>
//           ))}
//         </nav>

//         {/* Logout */}
//         <div className="p-4 border-t border-gray-500 dark:border-gray-700">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg"
//           >
//             <LogOut size={22} />
//             {isSidebarOpen && <span>Logout</span>}
//           </button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto">{renderActiveView()}</main>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import {
  Home,
  Clock,
  BarChart3,
  UserCog,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { authAPI } from "../api";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const getUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser
        ? JSON.parse(storedUser)
        : { name: "Guest User", email: "guest@example.com" };
    } catch {
      return { name: "Guest User", email: "guest@example.com" };
    }
  };

  const [user] = useState(getUserFromStorage());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await authAPI.logout(user.id);
      } catch (error) {
        console.error("Logout error:", error);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const navLinks = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "history", label: "Upload History", icon: Clock, path: "/dashboard/history" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
    { id: "request-admin", label: "Request Admin Access", icon: UserCog, path: "/dashboard/request-admin" },
    { id: "settings", label: "Settings", icon: SettingsIcon, path: "/dashboard/settings" },
  ];

  // Determine active view based on current path
  const getActiveView = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "dashboard";
    if (path.startsWith("/dashboard/history")) return "history";
    if (path.startsWith("/dashboard/analytics")) return "analytics";
    if (path.startsWith("/dashboard/analysis")) return "analysis"; // For analysis view
    if (path.startsWith("/dashboard/settings")) return "settings";
    if (path.startsWith("/dashboard/request-admin")) return "request-admin";
    return "dashboard";
  };

  const activeView = getActiveView();

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-center" />
      
      {/* Sidebar */}
      <aside
        className={`hidden lg:flex flex-col transition-all duration-300 shadow-2xl bg-gradient-to-br from-[#561292] to-[#4a00e0] text-white ${
          isSidebarOpen ? "w-72" : "w-24"
        }`}
      >
        {/* User Section */}
        <div className="p-6 border-b border-white/20">
          {isSidebarOpen ? (
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gradient-to-t from-[#bc4e9c] to-[#f80759] text-white font-bold shadow-lg text-lg">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-[#561292] rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-base truncate">
                  {user.name}
                </p>
                <p className="text-sm text-blue-200 truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="relative mx-auto">
              <div className="h-14 w-14 flex items-center justify-center rounded-xl bg-gradient-to-t from-[#bc4e9c] to-[#f80759] text-white font-bold shadow-lg text-lg">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-[#561292] rounded-full"></div>
            </div>
          )}
        </div>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mx-4 mt-4 p-3 text-white hover:bg-white/10 rounded-xl transition-all font-bold"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-6 w-6" />
          ) : (
            <ChevronRight className="h-6 w-6" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navLinks.map(({ id, label, icon: Icon, path }) => (
            <button
              key={id}
              onClick={() => navigate(path)}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl w-full transition-all font-semibold text-base ${
                activeView === id
                  ? "bg-gradient-to-t from-[#bc4e9c] to-[#f80759] text-white shadow-lg scale-105"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <Icon className="h-6 w-6 flex-shrink-0" />
              {isSidebarOpen && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-all font-semibold shadow-lg"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content - Now uses React Router Outlet */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}