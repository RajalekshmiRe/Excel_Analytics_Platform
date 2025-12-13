// import React, { useState } from 'react';

// export default function AdminSettings() {
//   const [settings, setSettings] = useState({
//     siteName: 'Excel Analytics Platform',
//     maxFileSize: 15,
//     allowedFormats: ['.xlsx', '.xls', '.csv'],
//     maintenanceMode: false,
//     emailNotifications: true,
//     storageLimit: 100
//   });

//   const handleSave = () => {
//     // TODO: Call API to save settings
//     alert('Settings saved successfully!');
//   };

//   return (
//     <div className="p-8">
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//           <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
//           <p className="text-gray-600 mt-1">Configure system settings and preferences</p>
//         </div>

//         {/* General Settings */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
//           <div className="space-y-6">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Site Name
//               </label>
//               <input
//                 type="text"
//                 value={settings.siteName}
//                 onChange={(e) => setSettings({...settings, siteName: e.target.value})}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Maximum File Size (MB)
//               </label>
//               <input
//                 type="number"
//                 value={settings.maxFileSize}
//                 onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value)})}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 Storage Limit (GB)
//               </label>
//               <input
//                 type="number"
//                 value={settings.storageLimit}
//                 onChange={(e) => setSettings({...settings, storageLimit: parseInt(e.target.value)})}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//         </div>

//         {/* System Settings */}
//         <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-6">System Settings</h2>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div>
//                 <p className="font-semibold text-gray-900">Maintenance Mode</p>
//                 <p className="text-sm text-gray-600">Disable user access for maintenance</p>
//               </div>
//               <button
//                 onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                   settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
//                 }`}
//               >
//                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                   settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
//                 }`} />
//               </button>
//             </div>

//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//               <div>
//                 <p className="font-semibold text-gray-900">Email Notifications</p>
//                 <p className="text-sm text-gray-600">Send email notifications to users</p>
//               </div>
//               <button
//                 onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                   settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
//                 }`}
//               >
//                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                   settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
//                 }`} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Save Button */}
//         <div className="flex justify-end">
//           <button
//             onClick={handleSave}
//             className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
//           >
//             Save Settings
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../api';

export default function AdminSettings() {
  const { user, token } = useAuth();
  const [settings, setSettings] = useState({
    siteName: 'Excel Analytics Platform',
    maxFileSize: 50,
    allowedFormats: ['.xlsx', '.xls', '.csv'],
    maintenanceMode: false,
    emailNotifications: true,
    storageLimit: 1000,
    chartExportFormats: ['pdf', 'png', 'svg'],
    dataMapEnabled: true,
    autoAnalytics: true
  });
  const [originalSettings, setOriginalSettings] = useState(settings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings));
  }, [settings, originalSettings]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSettings();
      const fetchedSettings = response.data?.data || {};
      
      // Merge with default settings to ensure all fields exist
      const mergedSettings = {
        siteName: fetchedSettings.siteName || 'Excel Analytics Platform',
        maxFileSize: fetchedSettings.maxFileSize || 50,
        allowedFormats: Array.isArray(fetchedSettings.allowedFormats) ? fetchedSettings.allowedFormats : ['.xlsx', '.xls', '.csv'],
        maintenanceMode: fetchedSettings.maintenanceMode || false,
        emailNotifications: fetchedSettings.emailNotifications !== undefined ? fetchedSettings.emailNotifications : true,
        storageLimit: fetchedSettings.storageLimit || 1000,
        chartExportFormats: Array.isArray(fetchedSettings.chartExportFormats) ? fetchedSettings.chartExportFormats : ['pdf', 'png', 'svg'],
        dataMapEnabled: fetchedSettings.dataMapEnabled !== undefined ? fetchedSettings.dataMapEnabled : true,
        autoAnalytics: fetchedSettings.autoAnalytics !== undefined ? fetchedSettings.autoAnalytics : true
      };
      
      setSettings(mergedSettings);
      setOriginalSettings(mergedSettings);
      setMessage('');
    } catch (err) {
      console.error('Error fetching settings:', err);
      setMessage('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              (name === 'maxFileSize' || name === 'storageLimit') 
              ? parseInt(value) || 0 
              : value
    }));
  };

  const handleFormatChange = (format) => {
    setSettings(prev => {
      const currentFormats = Array.isArray(prev.allowedFormats) ? prev.allowedFormats : [];
      return {
        ...prev,
        allowedFormats: currentFormats.includes(format)
          ? currentFormats.filter(f => f !== format)
          : [...currentFormats, format]
      };
    });
  };

  const handleExportFormatChange = (format) => {
    setSettings(prev => {
      const currentFormats = Array.isArray(prev.chartExportFormats) ? prev.chartExportFormats : [];
      return {
        ...prev,
        chartExportFormats: currentFormats.includes(format)
          ? currentFormats.filter(f => f !== format)
          : [...currentFormats, format]
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await adminAPI.updateSettings(settings);
      const savedSettings = response.data?.data || settings;
      setSettings(savedSettings);
      setOriginalSettings(savedSettings);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      const errMsg = err.response?.data?.message || 'Failed to save settings';
      setMessage(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setMessage('');
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Ensure arrays are always arrays for safe rendering
  const allowedFormats = Array.isArray(settings.allowedFormats) ? settings.allowedFormats : [];
  const chartExportFormats = Array.isArray(settings.chartExportFormats) ? settings.chartExportFormats : [];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600 mt-1">Configure system settings for Excel Analytics</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`p-4 rounded-lg font-medium ${
            message.includes('success') 
              ? 'bg-green-100 text-green-800 border border-green-400' 
              : 'bg-red-100 text-red-800 border border-red-400'
          }`}>
            {message}
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Administrator Profile</h2>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'AD'}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{user?.name || 'Administrator'}</p>
              <p className="text-gray-600">{user?.email || 'admin@example.com'}</p>
              <p className="text-sm text-gray-500 mt-1">Administrator</p>
            </div>
          </div>
        </div>

        {/* Platform Settings */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">Platform Configuration</h2>

          {/* Site Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Platform Name
            </label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Enter platform name"
            />
          </div>

          {/* File Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Max File Size (MB)
              </label>
              <input
                type="number"
                name="maxFileSize"
                value={settings.maxFileSize || 0}
                onChange={handleInputChange}
                min="1"
                max="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Storage Limit (GB)
              </label>
              <input
                type="number"
                name="storageLimit"
                value={settings.storageLimit || 0}
                onChange={handleInputChange}
                min="1"
                max="10000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Allowed File Formats */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Allowed File Formats
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['.xlsx', '.xls', '.csv', '.json'].map(format => (
                <label key={format} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowedFormats.includes(format)}
                    onChange={() => handleFormatChange(format)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{format}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Chart Export Formats */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Chart Export Formats
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['pdf', 'png', 'svg', 'jpg'].map(format => (
                <label key={format} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chartExportFormats.includes(format)}
                    onChange={() => handleExportFormatChange(format)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 uppercase">{format}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Data Mapping</p>
                <p className="text-sm text-gray-600">Enable column mapping features</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="dataMapEnabled"
                  checked={settings.dataMapEnabled || false}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Auto Analytics</p>
                <p className="text-sm text-gray-600">Automatically generate insights</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="autoAnalytics"
                  checked={settings.autoAnalytics || false}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Enable report email notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications || false}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Maintenance Mode</p>
                <p className="text-sm text-gray-600">Disable system during maintenance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode || false}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleReset}
            disabled={!hasChanges || saving}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center gap-2"
          >
            {saving && <span className="animate-spin">⟳</span>}
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}