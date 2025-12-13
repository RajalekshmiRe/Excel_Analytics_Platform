// import { Link } from "react-router-dom"; // use next/link if using Next.js

// export default function SuperAdminLayout({ children }) {
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-72 bg-indigo-900 text-white flex flex-col">
//         <div className="p-6 text-2xl font-bold border-b border-indigo-700">
//           Super Admin
//         </div>
//         <nav className="flex-1 p-4 space-y-3">
//           <Link to="/super-admin" className="block hover:bg-indigo-700 p-2 rounded">
//             Dashboard
//           </Link>
//           <Link to="/super-admin/admins" className="block hover:bg-indigo-700 p-2 rounded">
//             Manage Admins
//           </Link>
//           <Link to="/super-admin/users" className="block hover:bg-indigo-700 p-2 rounded">
//             Manage Users
//           </Link>
//           <Link to="/super-admin/settings" className="block hover:bg-indigo-700 p-2 rounded">
//             System Settings
//           </Link>
//           <Link to="/super-admin/logs" className="block hover:bg-indigo-700 p-2 rounded">
//             Activity Logs
//           </Link>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         <header className="mb-6 flex justify-between items-center">
//           <h1 className="text-3xl font-semibold text-gray-800">Super Admin Dashboard</h1>
//           <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
//             Logout
//           </button>
//         </header>

//         {/* Super Admin Widgets */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-white shadow rounded p-4">
//             <h2 className="text-lg font-medium text-gray-600">Total Admins</h2>
//             <p className="text-2xl font-bold mt-2">12</p>
//           </div>
//           <div className="bg-white shadow rounded p-4">
//             <h2 className="text-lg font-medium text-gray-600">Total Users</h2>
//             <p className="text-2xl font-bold mt-2">5,420</p>
//           </div>
//           <div className="bg-white shadow rounded p-4">
//             <h2 className="text-lg font-medium text-gray-600">System Uptime</h2>
//             <p className="text-2xl font-bold mt-2">99.98%</p>
//           </div>
//           <div className="bg-white shadow rounded p-4">
//             <h2 className="text-lg font-medium text-gray-600">Errors Logged</h2>
//             <p className="text-2xl font-bold mt-2">23</p>
//           </div>
//         </div>

//         {/* Inject page-specific content */}
//         <div className="mt-6">{children}</div>
//       </main>
//     </div>
//   );
// }
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "../api";

export default function SuperAdminLayout({ children }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

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

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {

      const res = await authAPI.logout(user.id);

      localStorage.removeItem("superAdminToken");
      localStorage.removeItem("superAdminUser");
      navigate("/superadmin/login");
    }
  };

  return (
    <div className="flex h-screen  bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col shadow-2xl">
        <div className="p-6 text-2xl font-bold border-b border-indigo-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          Super Admin
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/superadmin"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === "dashboard"
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                : "hover:bg-indigo-800"
            }`}
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </Link>

          <Link
            to="/superadmin/requests"
            onClick={() => setActiveTab("requests")}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === "requests"
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                : "hover:bg-indigo-800"
            }`}
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Admin Requests
          </Link>

          <Link
            to="/superadmin/admins"
            onClick={() => setActiveTab("admins")}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === "admins"
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                : "hover:bg-indigo-800"
            }`}
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Manage Admins
          </Link>

          <Link
            to="/superadmin/users"
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === "users"
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                : "hover:bg-indigo-800"
            }`}
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            All Users
          </Link>

          <Link
            to="/superadmin/audit"
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === "audit"
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                : "hover:bg-indigo-800"
            }`}
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Audit Logs
          </Link>

          <Link
            to="/superadmin/contact"
            onClick={() => setActiveTab("contact")}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === "contact"
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                : "hover:bg-indigo-800"
            }`}
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
                d="M16.434.001a.826.826 0 00-.164.008l-3.423.543a2.635 2.635 0 01-2.189 3.01 2.629 2.629 0 01-3.01-2.185l-3.417.538a.818.818 0 00-.677.931l3.24 20.467a.818.818 0 00.931.677l3.423-.543a2.635 2.635 0 012.189-3.01 2.629 2.629 0 013.01 2.185l3.422-.543a.818.818 0 00.677-.93L17.2.685a.816.816 0 00-.767-.685zm-3.22 6.534c.066 0 .128.005.185.017.423.09.975.6 1.315.955.178.187.192.519.048.73l-1.228 1.795a.89.89 0 01-.437.283c-.504.125-1.248-.95-1.771 1.507-.524 2.458.59 1.776 1.003 2.098a.828.828 0 01.283.437l.394 2.14a.613.613 0 01-.341.649c-.456.182-1.167.427-1.589.336-.907-.192-2.342-2.4-1.57-6.044.725-3.415 2.71-4.89 3.708-4.903Z"
              />
            </svg>{" "}
            Enquiry
          </Link>

          <Link
            to="/superadmin/settings"
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === "settings"
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                : "hover:bg-indigo-800"
            }`}
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-indigo-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-purple-50">
        {children}
      </main>
    </div>
  );
}
