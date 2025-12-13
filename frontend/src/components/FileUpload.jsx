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
import api from '../api'; // ✅ Import api instance
import { UploadContext } from '../context/UploadContext';

export default function FileUpload() {
  const { setCurrentUpload } = useContext(UploadContext);
  const [file, setFile] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onSelect = (e) => {
    setFile(e.target.files[0]);
    setError(''); // Clear previous errors
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // ✅ Use api instance, NO Content-Type header (axios sets it automatically)
      const res = await api.post('/uploads', formData);
      
      console.log('✅ Upload successful:', res.data);

      // Save metadata to context
      setCurrentUpload(res.data);
      setPreviewRows(res.data.previewRows || []);
      setFile(null); // Clear file input
      
      alert('Upload successful! ✅');
    } catch (err) {
      console.error('❌ Upload error:', err);
      const errorMsg = err.response?.data?.message || 'Upload failed. Please try again.';
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Upload Excel File</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={onSelect}
          disabled={uploading}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none hover:bg-gray-100 p-2"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
          uploading || !file
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        }`}
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Uploading...
          </span>
        ) : (
          'Upload File'
        )}
      </button>

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
                      <td key={k} className="px-4 py-3 text-sm text-gray-700">
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