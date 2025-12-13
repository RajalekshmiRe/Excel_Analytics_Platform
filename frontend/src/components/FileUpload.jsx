// import { useState, useContext } from "react";
// import axios from "axios";
// // ✅ Import specific named exports
// import { useNavigate } from 'react-router-dom';
// import { UploadContext } from "../context/UploadContext";

// export default function FileUpload() {
//   const { addUpload } = useContext(UploadContext);
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState(""); // ✅ added
//   const navigate = useNavigate(); // ✅ added
  // const [message, setMessage] = useState("");

  // const handleUpload = async () => {
  //   if (!file) {
  //     setMessage("⚠️ Please select a file first");
  //     return;
  //   }

  //    const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     const res = await axios.post("http://localhost:5000/api/upload", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     console.log(res.data);
  //     setMessage("✅ File uploaded successfully");
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("❌ Upload failed (check backend running on port 5000)");
  //   }
  // };

  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };
//     const handleFileChange = (e) => {
//     setFile(e.target.files[0]); // ✅ added
//   };

//   const handleUpload = async () => {
//     if (!file) return alert("Select a file first");
//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     const token = localStorage.getItem("token"); // get token from storage

//     const res = await axios.post("http://localhost:5000/api/upload", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`, // 🔥 required
//       },
//     });
//       if (res.upload) {
//         addUpload(res.upload); // update context immediately
//         setFile(null); // reset input
//       }

//     console.log(res.data);
//     setMessage("✅ File uploaded successfully");
//     navigate(`/file-preview/${res.data.fileId}`);
//       // ✅ Update upload history + count
//       addUpload(res.data);  
//       // you can also just call addUpload() if your context fetches again
//   } catch (err) {
//     console.error(err);
//     setMessage("❌ Upload failed (check backend running on port 5000)");
//   }
// };

//   return (
//     <div className="p-4 border rounded bg-white shadow-md">
//       <input
//         type="file"
//         accept=".xls,.xlsx"
//          onChange={handleFileChange}
//         // onChange={(e) => setFile(e.target.files[0])}
//       />
//       <button
//         onClick={handleUpload}
//         className="bg-blue-500 text-white px-3 py-1 rounded ml-2"
//       >
//         Upload
//       </button>

//       {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
//     </div>
//   );
// }
import React, { useState, useContext } from 'react';
import api from '../api';
import { UploadContext } from '../context/UploadContext';

export default function FileUpload() {
  const { setCurrentUpload } = useContext(UploadContext);
  const [file, setFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  const onSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError('');
    
    console.log('📁 File selected:', {
      name: selectedFile?.name,
      size: selectedFile?.size,
      type: selectedFile?.type
    });
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError(`File too large! Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress('Preparing upload...');

    const formData = new FormData();
    formData.append('file', file);

    console.log('🚀 Starting upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    try {
      setUploadProgress('Uploading to server...');
      
      // Add timeout to detect hanging requests
      const uploadPromise = api.post('/uploads', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(`Uploading... ${percentCompleted}%`);
          console.log(`📊 Upload progress: ${percentCompleted}%`);
        }
      });

      // 30 second timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout - server not responding')), 30000)
      );

      const res = await Promise.race([uploadPromise, timeoutPromise]);
      
      console.log('✅ Upload successful:', res.data);
      setUploadProgress('Processing file...');

      // Save metadata to context
      setCurrentUpload(res.data);
      setPreviewRows(res.data.previewRows || []);
      setFile(null);
      setUploadProgress('');
      
      alert('Upload successful! ✅');
    } catch (err) {
      console.error('❌ Upload error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });

      let errorMsg = 'Upload failed. ';
      
      if (err.message.includes('timeout')) {
        errorMsg += 'Server not responding. Please check if backend is running.';
      } else if (err.response?.status === 413) {
        errorMsg += 'File too large!';
      } else if (err.response?.status === 401) {
        errorMsg += 'Authentication failed. Please login again.';
      } else if (err.response?.status === 500) {
        errorMsg += 'Server error. Please try again or contact support.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMsg += 'Network error. Please check your connection.';
      } else {
        errorMsg += err.response?.data?.message || err.message || 'Please try again.';
      }

      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="card p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Upload Excel File</h3>
      
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress && (
        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700 rounded">
          <p className="font-semibold">{uploadProgress}</p>
        </div>
      )}

      {/* File Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Excel File (.xlsx or .xls)
        </label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={onSelect}
          disabled={uploading}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none hover:bg-gray-100 p-2"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: <span className="font-semibold">{file.name}</span> ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
          uploading || !file
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
        }`}
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {uploadProgress || 'Uploading...'}
          </span>
        ) : (
          'Upload File'
        )}
      </button>

      {/* Preview Table */}
      {previewRows.length > 0 && (
        <div className="mt-6">
          <h5 className="text-lg font-semibold mb-3 text-gray-800">
            Preview (first {previewRows.length} rows)
          </h5>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
                <tr>
                  {Object.keys(previewRows[0]).map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewRows.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {Object.keys(previewRows[0]).map((k) => (
                      <td key={k} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {String(r[k] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}