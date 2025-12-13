// import { Link } from "react-router-dom"; // or "next/link" if using Next.js

// export default function AdminLayout({ children }) {
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-900 text-white flex flex-col">
//         <div className="p-6 text-2xl font-bold border-b border-gray-700">
//           Admin Panel
//         </div>
//         <nav className="flex-1 p-4 space-y-3">
//           <Link to="/admin" className="block hover:bg-gray-700 p-2 rounded">
//             Dashboard
//           </Link>
//           <Link to="/admin/users" className="block hover:bg-gray-700 p-2 rounded">
//             Manage Users
//           </Link>
//           <Link to="/admin/reports" className="block hover:bg-gray-700 p-2 rounded">
//             Reports
//           </Link>
//           <Link to="/admin/settings" className="block hover:bg-gray-700 p-2 rounded">
//             Settings
//           </Link>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6">
//         <header className="mb-6 flex justify-between items-center">
//           <h1 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h1>
//           <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
//             Logout
//           </button>
//         </header>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Example Admin Widgets */}
//           <div className="bg-white shadow rounded p-4">
//             <h2 className="text-lg font-medium text-gray-600">Total Users</h2>
//             <p className="text-2xl font-bold mt-2">1,245</p>
//           </div>
//           <div className="bg-white shadow rounded p-4">
//             <h2 className="text-lg font-medium text-gray-600">Revenue</h2>
//             <p className="text-2xl font-bold mt-2">$56,000</p>
//           </div>
//           <div className="bg-white shadow rounded p-4">
//             <h2 className="text-lg font-medium text-gray-600">Active Sessions</h2>
//             <p className="text-2xl font-bold mt-2">87</p>
//           </div>
//         </div>

//         {/* Inject child components */}
//         <div className="mt-6">{children}</div>
//       </main>
//     </div>
//   );
// }


import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from '../api.js';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
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
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col shadow-2xl">
        <div className="p-6 text-2xl font-bold border-b border-gray-700 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          Admin Panel
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link 
            to="/admin" 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-lg' 
                : 'hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          
          <Link 
            to="/admin/users" 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === 'users' 
                ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-lg' 
                : 'hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Manage Users
          </Link>
          
          <Link 
            to="/admin/files" 
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === 'files' 
                ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-lg' 
                : 'hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            File Management
          </Link>
          
          <Link 
            to="/admin/reports" 
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === 'reports' 
                ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-lg' 
                : 'hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Reports
          </Link>
          
          <Link 
            to="/admin/settings" 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === 'settings' 
                ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-lg' 
                : 'hover:bg-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all font-semibold shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50">
        {children}
      </main>
    </div>
  );
}