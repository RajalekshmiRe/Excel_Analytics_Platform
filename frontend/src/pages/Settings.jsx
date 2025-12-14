// import React, { useState, useEffect } from "react";
// import { User, Mail, Lock, Bell, Shield, Save, Moon, Sun, Check, X } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";

// const Settings = ({ currentUser, theme, setTheme }) => {
//   const [formData, setFormData] = useState({
//     name: currentUser?.name || "",
//     email: currentUser?.email || "",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [notifications, setNotifications] = useState(() => {
//     const saved = localStorage.getItem("notifications");
//     return saved ? JSON.parse(saved) : {
//       emailNotifications: true,
//       uploadAlerts: true,
//       weeklyReports: false,
//       securityAlerts: true,
//     };
//   });

//   const [loading, setLoading] = useState(false);

//   const bgColor = theme === "dark" 
//     ? "bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900" 
//     : "bg-gradient-to-b from-blue-50 via-blue-100 to-blue-50";
  
//   const cardGradient = theme === "dark" 
//     ? "bg-gradient-to-br from-blue-900 to-blue-800" 
//     : "bg-gradient-to-br from-blue-50 to-blue-100";

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleNotificationChange = (key) => {
//     setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
//   };

//   const handleSaveProfile = async () => {
//     if (!formData.name || !formData.email) {
//       toast.error("Name and email are required!");
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       toast.error("Please enter a valid email address!");
//       return;
//     }

//     setLoading(true);
//     const loadingToast = toast.loading("Updating profile...");

//     try {
//       const token = localStorage.getItem('token');
      
//       if (!token) {
//         throw new Error("No authentication token found. Please login again.");
//       }

//       // const response = await fetch('http://localhost:5000/api/auth/update-profile', {
//       const response = await fetch('api/auth/update-profile',{
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           name: formData.name,
//           email: formData.email
//         })
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to update profile');
//       }

//       // Update local storage
//       const updatedUser = { ...currentUser, name: formData.name, email: formData.email };
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       toast.dismiss(loadingToast);
//       toast.success("Profile updated successfully!");
      
//       // Refresh page to update user info everywhere
//       setTimeout(() => window.location.reload(), 1500);
//     } catch (error) {
//       console.error('Profile update error:', error);
//       toast.dismiss(loadingToast);
//       toast.error(error.message || "Failed to update profile!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChangePassword = async () => {
//     if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
//       toast.error("All password fields are required!");
//       return;
//     }

//     if (formData.newPassword.length < 6) {
//       toast.error("New password must be at least 6 characters!");
//       return;
//     }

//     if (formData.newPassword !== formData.confirmPassword) {
//       toast.error("New passwords do not match!");
//       return;
//     }

//     setLoading(true);
//     const loadingToast = toast.loading("Changing password...");

//     try {
//       const token = localStorage.getItem('token');
      
//       if (!token) {
//         throw new Error("No authentication token found. Please login again.");
//       }

//       // const response = await fetch('http://localhost:5000/api/auth/change-password', {
//       const response = await fetch('api/auth/change-password',{
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           currentPassword: formData.currentPassword,
//           newPassword: formData.newPassword
//         })
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to change password');
//       }

//       // Clear password fields
//       setFormData({
//         ...formData,
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: ""
//       });

//       toast.dismiss(loadingToast);
//       toast.success("Password changed successfully!");
//     } catch (error) {
//       console.error('Password change error:', error);
//       toast.dismiss(loadingToast);
//       toast.error(error.message || "Failed to change password!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveNotifications = () => {
//     localStorage.setItem("notifications", JSON.stringify(notifications));
//     toast.success("Notification preferences saved!");
//   };

//   const handleThemeToggle = () => {
//     const newTheme = theme === "dark" ? "light" : "dark";
//     setTheme(newTheme);
//     localStorage.setItem("theme", newTheme);
//     document.documentElement.classList.remove("light", "dark");
//     document.documentElement.classList.add(newTheme);
//     toast.success(`${newTheme === "dark" ? "Dark" : "Light"} mode enabled!`);
//   };

//   const initials = currentUser?.name
//     ?.split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase() || "U";

//     useEffect(() => {
//       const savedTheme = localStorage.getItem("theme") || "light";
//       setTheme(savedTheme);
//       document.documentElement.classList.add(savedTheme);
//     }, []);

//   return (
//     <div className={`min-h-screen ${bgColor} p-4 md:p-8 lg:p-12`}>
//       <Toaster position="top-center" />
      
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className={`${cardGradient} rounded-3xl shadow-2xl p-8 border-2 border-[#bc4e9c]`}>
//           <h1 className="text-4xl lg:text-5xl font-bold mb-3 flex items-center gap-3">
//             Settings <Shield className="text-[#bc4e9c]" size={40} />
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 text-lg">
//             Manage your account preferences and security
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Profile Card */}
//           <div className="lg:col-span-1">
//             <div className={`${cardGradient} rounded-3xl shadow-2xl p-8 border-2 border-[#bc4e9c] text-center`}>
//               <div className="relative inline-block mb-6">
//                 <div className="w-32 h-32 bg-gradient-to-t from-[#bc4e9c] to-[#f80759] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
//                   {initials}
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 border-4 border-white rounded-full"></div>
//               </div>
//               <h2 className="text-2xl font-bold mb-2">{currentUser?.name}</h2>
//               <p className="text-gray-600 dark:text-gray-400 break-all">{currentUser?.email}</p>
              
//               {/* Theme Toggle */}
//               {/* <div className="mt-8 pt-6 border-t-2 border-blue-300 dark:border-blue-600">
//                 <button
//                   onClick={handleThemeToggle}
//                   className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-black dark:text-white px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all font-bold flex items-center justify-center gap-3"
//                 >
//                   {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
//                   {theme === "dark" ? "Light Mode" : "Dark Mode"}
//                 </button>
//               </div> */}
//             </div>
//           </div>

//           {/* Settings Forms */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Profile Information */}
//             <div className={`${cardGradient} rounded-3xl shadow-2xl p-8 border-2 border-[#bc4e9c]`}>
//               <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
//                 <User className="text-[#bc4e9c]" size={28} />
//                 Profile Information
//               </h2>
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-bold mb-2 ">
//                     Full Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-6 py-4 rounded-xl border-2 border-[#bc4e9c] focus:outline-none focus:ring-2 focus:ring-pink-500"
//                     placeholder="Enter your full name"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="w-full px-6 py-4 rounded-xl border-2 border-[#bc4e9c]  focus:outline-none focus:ring-2 focus:ring-pink-500"
//                     placeholder="Enter your email"
//                   />
//                 </div>
//                 <button
//                   onClick={handleSaveProfile}
//                   disabled={loading}
//                   className="w-full bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-[#733060] hover:to-[#7d042c] transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Save size={20} />
//                   {loading ? "Saving..." : "Save Profile Changes"}
//                 </button>
//               </div>
//             </div>

//             {/* Change Password */}
//             <div className={`${cardGradient} rounded-3xl shadow-2xl p-8 border-2 border-[#bc4e9c]`}>
//               <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
//                 <Lock className="text-[#bc4e9c]" size={28} />
//                 Change Password
//               </h2>
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-bold mb-2 ">
//                     Current Password
//                   </label>
//                   <input
//                     type="password"
//                     name="currentPassword"
//                     value={formData.currentPassword}
//                     onChange={handleInputChange}
//                     className="w-full px-6 py-4 rounded-xl border-2 border-[#bc4e9c] focus:outline-none focus:ring-2 focus:ring-pink-500"
//                     placeholder="Enter current password"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2 ">
//                     New Password
//                   </label>
//                   <input
//                     type="password"
//                     name="newPassword"
//                     value={formData.newPassword}
//                     onChange={handleInputChange}
//                     className="w-full px-6 py-4 rounded-xl border-2 border-[#bc4e9c]  focus:outline-none focus:ring-2 focus:ring-pink-500"
//                     placeholder="Enter new password (min 6 characters)"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-bold mb-2 ">
//                     Confirm New Password
//                   </label>
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     className="w-full px-6 py-4 rounded-xl border-2 border-[#bc4e9c]  focus:outline-none focus:ring-2 focus:ring-pink-500"
//                     placeholder="Confirm new password"
//                   />
//                 </div>
//                 <button
//                   onClick={handleChangePassword}
//                   disabled={loading}
//                   className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Lock size={20} />
//                   {loading ? "Updating..." : "Update Password"}
//                 </button>
//               </div>
//             </div>

//             {/* Notifications */}
//             <div className={`${cardGradient} rounded-3xl shadow-2xl p-8 border-2 border-[#bc4e9c]`}>
//               <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
//                 <Bell className="text-[#bc4e9c]" size={28} />
//                 Notification Preferences
//               </h2>
//               <div className="space-y-4">
//                 {[
//                   { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email" },
//                   { key: "uploadAlerts", label: "Upload Alerts", desc: "Get notified when uploads complete" },
//                   { key: "weeklyReports", label: "Weekly Reports", desc: "Receive weekly activity summaries" },
//                   { key: "securityAlerts", label: "Security Alerts", desc: "Important security notifications" },
//                 ].map(({ key, label, desc }) => (
//                   <div
//                     key={key}
//                     className="flex items-center justify-between p-6 bg-blue-500/10 rounded-xl border-2 border-[#bc4e9c] hover:bg-blue-500/15 transition-all"
//                   >
//                     <div className="flex-1">
//                       <h3 className="font-bold text-lg mb-1">{label}</h3>
//                       <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
//                     </div>
//                     <button
//                       onClick={() => handleNotificationChange(key)}
//                       className={`w-16 h-8 rounded-full transition-all duration-300 ${
//                         notifications[key]
//                           ? "bg-green-500"
//                           : "bg-gray-300 dark:bg-gray-600"
//                       }`}
//                     >
//                       <div
//                         className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-300 flex items-center justify-center ${
//                           notifications[key] ? "translate-x-9" : "translate-x-1"
//                         }`}
//                       >
//                         {notifications[key] ? (
//                           <Check size={14} className="text-green-500" />
//                         ) : (
//                           <X size={14} className="text-gray-400" />
//                         )}
//                       </div>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={handleSaveNotifications}
//                 className="w-full mt-6 bg-gradient-to-t from-[#bc4e9c] to-[#f80759] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-[#733060] hover:to-[#7d042c] transition-all font-bold flex items-center justify-center gap-2"
//               >
//                 <Save size={20} />
//                 Save Notification Preferences
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;


import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Bell, Shield, Save, Check, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api from "../api";

const Settings = ({ currentUser, theme, setTheme }) => {
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : {
      emailNotifications: true,
      uploadAlerts: true,
      weeklyReports: false,
      securityAlerts: true,
    };
  });

  const [loading, setLoading] = useState(false);

  const bgColor = "bg-gradient-to-b from-[#fbf9fb] to-[#c4c799]";
  const cardGradient = "bg-gradient-to-br from-blue-50 to-blue-100";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required!");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Updating profile...");

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      // ✅ Use api instance instead of fetch
      const response = await api.put('/auth/update-profile', {
        name: formData.name,
        email: formData.email
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local storage
      const updatedUser = { ...currentUser, name: formData.name, email: formData.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.dismiss(loadingToast);
      toast.success("Profile updated successfully!");
      
      // Refresh page to update user info everywhere
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || error.message || "Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("All password fields are required!");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters!");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Changing password...");

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      // ✅ Use api instance instead of fetch
      const response = await api.put('/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      toast.dismiss(loadingToast);
      toast.success("Password changed successfully!");
    } catch (error) {
      console.error('Password change error:', error);
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || error.message || "Failed to change password!");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
    toast.success("Notification preferences saved!");
  };

  const initials = currentUser?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (setTheme) {
      setTheme(savedTheme);
    }
    document.documentElement.classList.add(savedTheme);
  }, [setTheme]);

  return (
    <div className={`min-h-screen ${bgColor} p-4 md:p-8 lg:p-12`}>
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className={`${cardGradient} rounded-3xl shadow-2xl p-8 border-2 border-[#bc4e9c]`}>
          <h1 className="text-4xl lg:text-5xl font-bold mb-3 flex items-center gap-3">
            Settings <Shield className="text-[#bc4e9c]" size={40} />
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account preferences and security
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className={`${cardGradient} rounded-3xl shadow-2xl p-8 border-2 border-[#bc4e9c] text-center`}>
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gradient-to-t from-[#bc4e9c] to-[#f80759] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {initials}
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-green-500 border-4 border-white rounded-full"></div>
              </div>
              <h2 className="text-2xl font-bold mb-2">{currentUser?.name}</h2>
              <p className="text-gray-600 break-all">{currentUser?.email}</p>
            </div>
          </div>

          {/* Settings Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Information */}
            <div className={`${cardGradient} rounded-3xl shadow-2xl p-8 border-2 border-[#bc4e9c]`}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <User className="text-[#bc4e9c]" size={28} />
                Profile Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-xl border-2 border-[#bc4e9c] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-xl border-2 border-[#bc4e9c] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-[#a0428a] hover:to-[#e0064f] transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={20} />
                  {loading ? "Saving..." : "Save Profile Changes"}
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div className={`${cardGradient} rounded-3xl shadow-2xl p-8 border-2 border-[#bc4e9c]`}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Lock className="text-[#bc4e9c]" size={28} />
                Change Password
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-xl border-2 border-[#bc4e9c] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-xl border-2 border-[#bc4e9c] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter new password (min 6 characters)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-xl border-2 border-[#bc4e9c] bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock size={20} />
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className={`${cardGradient} rounded-3xl shadow-2xl p-8 border-2 border-[#bc4e9c]`}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Bell className="text-[#bc4e9c]" size={28} />
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {[
                  { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email" },
                  { key: "uploadAlerts", label: "Upload Alerts", desc: "Get notified when uploads complete" },
                  { key: "weeklyReports", label: "Weekly Reports", desc: "Receive weekly activity summaries" },
                  { key: "securityAlerts", label: "Security Alerts", desc: "Important security notifications" },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-6 bg-blue-500/10 rounded-xl border-2 border-[#bc4e9c] hover:bg-blue-500/15 transition-all"
                  >
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{label}</h3>
                      <p className="text-sm text-gray-600">{desc}</p>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(key)}
                      className={`w-16 h-8 rounded-full transition-all duration-300 ${
                        notifications[key]
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-300 flex items-center justify-center ${
                          notifications[key] ? "translate-x-9" : "translate-x-1"
                        }`}
                      >
                        {notifications[key] ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <X size={14} className="text-gray-400" />
                        )}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSaveNotifications}
                className="w-full mt-6 bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-[#a0428a] hover:to-[#e0064f] transition-all font-bold flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Save Notification Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;