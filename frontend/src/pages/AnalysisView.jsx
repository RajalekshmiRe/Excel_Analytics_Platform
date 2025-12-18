// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Download, Table, BarChart3, Loader2, AlertCircle } from 'lucide-react';
// import Papa from 'papaparse';
// import * as XLSX from 'xlsx';
// import api from '../api';
// import toast, { Toaster } from 'react-hot-toast';

// const AnalysisView = () => {
//   const { fileId } = useParams();
//   const navigate = useNavigate();
//   console.log('🔥 AnalysisView loaded! FileId:', fileId);
  
//   const [loading, setLoading] = useState(true);
//   const [fileInfo, setFileInfo] = useState(null);
//   const [fileData, setFileData] = useState(null);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('preview');
  
//   // ✅ Prevent duplicate toasts and loads
//   const loadAttemptedRef = useRef(false);
//   const toastShownRef = useRef(false);

//   useEffect(() => {
//     // ✅ Only load once, even in Strict Mode
//     if (!loadAttemptedRef.current) {
//       loadAttemptedRef.current = true;
//       toastShownRef.current = false; // Reset toast flag
//       loadFileData();
//     }
    
//     // Cleanup
//     return () => {
//       loadAttemptedRef.current = false;
//       toastShownRef.current = false;
//     };
//   }, [fileId]);

//   const loadFileData = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       // Step 1: Get file metadata
//       console.log('📂 Fetching metadata for file:', fileId);
//       const metaResponse = await api.get(`/uploads/${fileId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       console.log('✅ Metadata received:', metaResponse.data);
//       setFileInfo(metaResponse.data);
      
//       // Step 2: Try downloading and parsing file
//       try {
//         console.log('📥 Downloading file...');
//         const downloadResponse = await api.get(
//           `/uploads/${fileId}/download`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//             responseType: 'blob'
//           }
//         );

//         console.log('✅ File downloaded, size:', downloadResponse.data.size);

//         // Determine file type and parse
//         const blob = downloadResponse.data;
//         const fileName = metaResponse.data.originalName || metaResponse.data.filename || '';
//         const fileExtension = fileName.split('.').pop().toLowerCase();
        
//         console.log('🔍 Parsing file type:', fileExtension);
        
//         if (fileExtension === 'csv') {
//           await parseCSV(blob);
//         } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
//           await parseExcel(blob);
//         } else {
//           throw new Error(`Unsupported file format: ${fileExtension}`);
//         }
        
//       } catch (downloadErr) {
//         // Handle file download/parsing errors gracefully
//         if (downloadErr.response?.status === 404) {
//           console.warn('⚠️ File not found on server (may have been cleaned up)');
//           if (!toastShownRef.current) {
//             toast('File content unavailable. Metadata is still shown.', {
//               id: `file-unavailable-${fileId}`,
//               icon: 'ℹ️',
//               duration: 4000
//             });
//             toastShownRef.current = true;
//           }
//         } else if (downloadErr.message?.includes('Unsupported')) {
//           console.error('❌ Unsupported file format');
//           if (!toastShownRef.current) {
//             toast.error(downloadErr.message, {
//               id: `unsupported-${fileId}`
//             });
//             toastShownRef.current = true;
//           }
//           throw downloadErr;
//         } else {
//           console.error('❌ Download/parsing error:', downloadErr);
//           if (!toastShownRef.current) {
//             toast.error('Failed to load file content', {
//               id: `load-error-${fileId}`
//             });
//             toastShownRef.current = true;
//           }
//           throw downloadErr;
//         }
//       }
      
//     } catch (err) {
//       console.error('❌ Error loading file:', err);
//       const errorMessage = err.response?.data?.message || err.message || 'Failed to load file';
//       setError(errorMessage);
//       if (!toastShownRef.current) {
//         toast.error('Failed to load file data', {
//           id: `error-${fileId}`
//         });
//         toastShownRef.current = true;
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const parseCSV = async (blob) => {
//     return new Promise((resolve, reject) => {
//       const text = blob.text();
      
//       text.then(content => {
//         Papa.parse(content, {
//           header: true,
//           dynamicTyping: true,
//           skipEmptyLines: true,
//           complete: (results) => {
//             console.log('✅ CSV parsed:', results.data.length, 'rows');
            
//             if (results.data.length === 0 || !results.meta.fields || results.meta.fields.length === 0) {
//               console.warn('⚠️ CSV file is empty or has no headers');
//               if (!toastShownRef.current) {
//                 toast('CSV file appears to be empty', {
//                   id: `empty-csv-${fileId}`,
//                   icon: 'ℹ️',
//                   duration: 4000
//                 });
//                 toastShownRef.current = true;
//               }
//               resolve();
//               return;
//             }
            
//             setFileData({
//               headers: results.meta.fields,
//               rows: results.data,
//               rowCount: results.data.length
//             });
            
//             if (!toastShownRef.current) {
//               toast.success(`CSV loaded! ${results.data.length} rows`, {
//                 id: `csv-success-${fileId}`,
//                 duration: 3000
//               });
//               toastShownRef.current = true;
//             }
//             resolve();
//           },
//           error: (error) => {
//             console.error('❌ CSV parsing error:', error);
//             reject(new Error('CSV parsing failed: ' + error.message));
//           }
//         });
//       }).catch(err => {
//         console.error('❌ Error reading blob:', err);
//         reject(err);
//       });
//     });
//   };

//   const parseExcel = async (blob) => {
//     return new Promise((resolve, reject) => {
//       try {
//         const arrayBuffer = blob.arrayBuffer();
        
//         arrayBuffer.then(buffer => {
//           const workbook = XLSX.read(buffer, { type: 'array' });
//           const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
//           const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
//           if (jsonData.length === 0) {
//             console.warn('⚠️ Excel file is empty');
//             if (!toastShownRef.current) {
//               toast('Excel file appears to be empty', {
//                 id: `empty-excel-${fileId}`,
//                 icon: 'ℹ️',
//                 duration: 4000
//               });
//               toastShownRef.current = true;
//             }
//             resolve();
//             return;
//           }
          
//           const headers = jsonData[0];
//           const rows = jsonData.slice(1).map(row => {
//             const obj = {};
//             headers.forEach((header, index) => {
//               obj[header] = row[index];
//             });
//             return obj;
//           });
          
//           if (rows.length === 0) {
//             console.warn('⚠️ Excel file has headers but no data rows');
//             if (!toastShownRef.current) {
//               toast('Excel file has no data rows', {
//                 id: `no-data-excel-${fileId}`,
//                 icon: 'ℹ️',
//                 duration: 4000
//               });
//               toastShownRef.current = true;
//             }
//           }
          
//           console.log('✅ Excel parsed:', rows.length, 'rows');
//           setFileData({
//             headers: headers,
//             rows: rows,
//             rowCount: rows.length
//           });
          
//           if (!toastShownRef.current) {
//             toast.success(`Excel loaded! ${rows.length} rows`, {
//               id: `excel-success-${fileId}`,
//               duration: 3000
//             });
//             toastShownRef.current = true;
//           }
//           resolve();
//         }).catch(err => {
//           console.error('❌ Error reading array buffer:', err);
//           reject(err);
//         });
//       } catch (err) {
//         console.error('❌ Excel parsing error:', err);
//         reject(new Error('Excel parsing failed: ' + err.message));
//       }
//     });
//   };

//   const handleDownload = async () => {
//     try {
//       const token = localStorage.getItem('token');

//       const response = await api.get(
//         `/uploads/${fileId}/download`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           responseType: 'blob'
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', fileInfo?.originalName || 'file');
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);

//       toast.success('File downloaded!', {
//         id: `download-${fileId}`,
//         duration: 2000
//       });
//     } catch (err) {
//       if (err.response?.status === 404) {
//         console.warn('⚠️ File not found on server (Render cleanup)');
//         toast('File no longer available. Please re-upload if needed.', {
//           id: `download-404-${fileId}`,
//           icon: 'ℹ️',
//           duration: 4000
//         });
//         return;
//       }

//       console.error('Download error:', err);
//       toast.error('Download failed', {
//         id: `download-error-${fileId}`
//       });
//     }
//   };

//   const getColumnStats = (columnName) => {
//     if (!fileData) return null;
    
//     const values = fileData.rows
//       .map(row => row[columnName])
//       .filter(val => val !== null && val !== undefined && val !== '');
    
//     const numericValues = values.filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
    
//     if (numericValues.length > 0) {
//       const sum = numericValues.reduce((a, b) => a + b, 0);
//       const avg = sum / numericValues.length;
//       const min = Math.min(...numericValues);
//       const max = Math.max(...numericValues);
      
//       return { sum, avg: avg.toFixed(2), min, max, count: numericValues.length, type: 'numeric' };
//     }
    
//     return { count: values.length, unique: new Set(values).size, type: 'text' };
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-16 h-16 animate-spin text-[#bc4e9c] mx-auto mb-4" />
//           <p className="text-gray-900 font-semibold text-lg">Loading file analysis...</p>
//           <p className="text-gray-500 text-sm mt-2">Please wait...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center p-8">
//         <Toaster position="top-center" />
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading File</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => navigate('/dashboard/history')}
//             className="px-6 py-3 bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white rounded-xl font-semibold hover:shadow-xl transition-all"
//           >
//             Back to Upload History
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] p-8">
//       <Toaster position="top-center" />
      
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => navigate('/dashboard/history')}
//             className="flex items-center gap-2 text-gray-600 hover:text-[#bc4e9c] transition-colors mb-4"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span className="font-semibold">Back to Upload History</span>
//           </button>
          
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-bold text-gray-900 mb-2">
//                 {fileInfo?.originalName}
//               </h1>
//               <p className="text-gray-600">
//                 {fileData?.rowCount || 0} rows • {fileData?.headers?.length || 0} columns
//               </p>
//             </div>
//             <button
//               onClick={handleDownload}
//               className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
//             >
//               <Download className="w-5 h-5" />
//               Download
//             </button>
//           </div>
//           <hr className="border-t-2 border-[#bc4e9c] mt-4" />
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 mb-6">
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab('preview')}
//               className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
//                 activeTab === 'preview'
//                   ? 'text-[#bc4e9c] border-b-2 border-[#bc4e9c]'
//                   : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               <Table className="w-5 h-5" />
//               Data Preview
//             </button>
//             <button
//               onClick={() => setActiveTab('stats')}
//               className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
//                 activeTab === 'stats'
//                   ? 'text-[#bc4e9c] border-b-2 border-[#bc4e9c]'
//                   : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               <BarChart3 className="w-5 h-5" />
//               Column Statistics
//             </button>
//           </div>

//           <div className="p-6">
//             {activeTab === 'preview' && fileData && fileData.rows.length > 0 && (
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white">
//                       {fileData.headers.map((header, idx) => (
//                         <th key={idx} className="px-4 py-3 text-left font-semibold text-sm">
//                           {header}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {fileData.rows.slice(0, 100).map((row, rowIdx) => (
//                       <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                         {fileData.headers.map((header, colIdx) => (
//                           <td key={colIdx} className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
//                             {row[header]?.toString() || '-'}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 {fileData.rows.length > 100 && (
//                   <p className="text-center text-gray-600 mt-4 text-sm">
//                     Showing first 100 rows of {fileData.rowCount}
//                   </p>
//                 )}
//               </div>
//             )}

//             {activeTab === 'stats' && fileData && fileData.rows.length > 0 && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {fileData.headers.map((header, idx) => {
//                   const stats = getColumnStats(header);
//                   return (
//                     <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
//                       <h3 className="font-bold text-gray-900 mb-3 text-lg">{header}</h3>
//                       <div className="space-y-2">
//                         {stats.type === 'numeric' ? (
//                           <>
//                             <div className="flex justify-between text-sm">
//                               <span className="text-gray-600">Count:</span>
//                               <span className="font-semibold text-gray-900">{stats.count}</span>
//                             </div>
//                             <div className="flex justify-between text-sm">
//                               <span className="text-gray-600">Average:</span>
//                               <span className="font-semibold text-gray-900">{stats.avg}</span>
//                             </div>
//                             <div className="flex justify-between text-sm">
//                               <span className="text-gray-600">Min:</span>
//                               <span className="font-semibold text-gray-900">{stats.min}</span>
//                             </div>
//                             <div className="flex justify-between text-sm">
//                               <span className="text-gray-600">Max:</span>
//                               <span className="font-semibold text-gray-900">{stats.max}</span>
//                             </div>
//                           </>
//                         ) : (
//                           <>
//                             <div className="flex justify-between text-sm">
//                               <span className="text-gray-600">Total Values:</span>
//                               <span className="font-semibold text-gray-900">{stats.count}</span>
//                             </div>
//                             <div className="flex justify-between text-sm">
//                               <span className="text-gray-600">Unique:</span>
//                               <span className="font-semibold text-gray-900">{stats.unique}</span>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}

//             {/* Show message if no file data (metadata only) */}
//             {(!fileData || fileData.rows.length === 0) && !error && (
//               <div className="text-center py-12">
//                 <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <p className="text-gray-600 text-lg font-semibold mb-2">File Content Unavailable</p>
//                 <p className="text-gray-500">
//                   {!fileData 
//                     ? 'The file may have been cleaned up from the server.' 
//                     : 'The file contains no data rows.'}
//                 </p>
//                 <p className="text-gray-500 text-sm mt-2">Metadata is still available above.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnalysisView;




import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Table, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import api from '../api';
import toast, { Toaster } from 'react-hot-toast';

const AnalysisView = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [fileInfo, setFileInfo] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [fileAvailable, setFileAvailable] = useState(true);
  
  const loadAttemptedRef = useRef(false);
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (!loadAttemptedRef.current) {
      loadAttemptedRef.current = true;
      toastShownRef.current = false;
      loadFileData();
    }
    
    return () => {
      loadAttemptedRef.current = false;
      toastShownRef.current = false;
    };
  }, [fileId]);

  const loadFileData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('📂 Fetching metadata for file:', fileId);
      const metaResponse = await api.get(`/uploads/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Metadata received:', metaResponse.data);
      setFileInfo(metaResponse.data);
      
 try {
  console.log('📥 Downloading file...');
  const downloadResponse = await api.get(
    `/uploads/${fileId}/download`,
    {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    }
  );

  console.log('✅ File downloaded:', {
    size: downloadResponse.data.size,
    type: downloadResponse.data.type
  });

  const blob = downloadResponse.data;
  const fileName = metaResponse.data.originalName || metaResponse.data.filename || '';
  const fileExtension = fileName.split('.').pop().toLowerCase();
  
  console.log('🔍 Parsing file type:', fileExtension);
  
  // ✅ Parse based on file type
  if (fileExtension === 'csv') {
    // Convert blob to text for CSV
    const text = await blob.text();
    console.log('📝 CSV text length:', text.length);
    await parseCSV(text);
  } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
    await parseExcel(blob);
  } else {
    throw new Error(`Unsupported file format: ${fileExtension}`);
  }
  
  setFileAvailable(true);
        
      } catch (downloadErr) {
        if (downloadErr.response?.status === 404) {
          console.warn('⚠️ File not found on server (ephemeral storage cleanup)');
          setFileAvailable(false);
          if (!toastShownRef.current) {
            toast('File content unavailable. Showing metadata only.', {
              id: `file-unavailable-${fileId}`,
              icon: 'ℹ️',
              duration: 4000
            });
            toastShownRef.current = true;
          }
        } else if (downloadErr.message?.includes('Unsupported')) {
          console.error('❌ Unsupported file format');
          if (!toastShownRef.current) {
            toast.error(downloadErr.message, {
              id: `unsupported-${fileId}`
            });
            toastShownRef.current = true;
          }
          throw downloadErr;
        } else {
          console.error('❌ Download/parsing error:', downloadErr);
          setFileAvailable(false);
          if (!toastShownRef.current) {
            toast.error('Failed to load file content', {
              id: `load-error-${fileId}`
            });
            toastShownRef.current = true;
          }
        }
      }
      
    } catch (err) {
      console.error('❌ Error loading file:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load file';
      setError(errorMessage);
      if (!toastShownRef.current) {
        toast.error('Failed to load file data', {
          id: `error-${fileId}`
        });
        toastShownRef.current = true;
      }
    } finally {
      setLoading(false);
    }
  };

 const parseCSV = async (content) => {
  return new Promise((resolve, reject) => {
    // Handle both string and blob
    const parseText = (text) => {
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('✅ CSV parsed:', results.data.length, 'rows');
          
          if (results.data.length === 0 || !results.meta.fields || results.meta.fields.length === 0) {
            console.warn('⚠️ CSV file is empty or has no headers');
            if (!toastShownRef.current) {
              toast('CSV file appears to be empty', {
                id: `empty-csv-${fileId}`,
                icon: 'ℹ️',
                duration: 4000
              });
              toastShownRef.current = true;
            }
            resolve();
            return;
          }
          
          setFileData({
            headers: results.meta.fields,
            rows: results.data,
            rowCount: results.data.length
          });
          
          if (!toastShownRef.current) {
            toast.success(`CSV loaded! ${results.data.length} rows`, {
              id: `csv-success-${fileId}`,
              duration: 3000
            });
            toastShownRef.current = true;
          }
          resolve();
        },
        error: (error) => {
          console.error('❌ CSV parsing error:', error);
          reject(new Error('CSV parsing failed: ' + error.message));
        }
      });
    };

    // Check if content is already a string
    if (typeof content === 'string') {
      parseText(content);
    } 
    // If it's a Blob, convert to text first
    else if (content instanceof Blob) {
      content.text()
        .then(text => parseText(text))
        .catch(err => {
          console.error('❌ Error reading blob:', err);
          reject(err);
        });
    } 
    // Otherwise reject
    else {
      reject(new Error('Invalid content type for CSV parsing'));
    }
  });
};

  const parseExcel = async (blob) => {
    return new Promise((resolve, reject) => {
      try {
        const arrayBuffer = blob.arrayBuffer();
        
        arrayBuffer.then(buffer => {
          const workbook = XLSX.read(buffer, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          if (jsonData.length === 0) {
            console.warn('⚠️ Excel file is empty');
            if (!toastShownRef.current) {
              toast('Excel file appears to be empty', {
                id: `empty-excel-${fileId}`,
                icon: 'ℹ️',
                duration: 4000
              });
              toastShownRef.current = true;
            }
            resolve();
            return;
          }
          
          const headers = jsonData[0];
          const rows = jsonData.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
          
          if (rows.length === 0) {
            console.warn('⚠️ Excel file has headers but no data rows');
            if (!toastShownRef.current) {
              toast('Excel file has no data rows', {
                id: `no-data-excel-${fileId}`,
                icon: 'ℹ️',
                duration: 4000
              });
              toastShownRef.current = true;
            }
          }
          
          console.log('✅ Excel parsed:', rows.length, 'rows');
          setFileData({
            headers: headers,
            rows: rows,
            rowCount: rows.length
          });
          
          if (!toastShownRef.current) {
            toast.success(`Excel loaded! ${rows.length} rows`, {
              id: `excel-success-${fileId}`,
              duration: 3000
            });
            toastShownRef.current = true;
          }
          resolve();
        }).catch(err => {
          console.error('❌ Error reading array buffer:', err);
          reject(err);
        });
      } catch (err) {
        console.error('❌ Excel parsing error:', err);
        reject(new Error('Excel parsing failed: ' + err.message));
      }
    });
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await api.get(
        `/uploads/${fileId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileInfo?.originalName || fileInfo?.filename || 'file');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('File downloaded successfully!', {
        id: `download-${fileId}`,
        duration: 2000
      });
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('⚠️ File not found on server');
        toast.error('File no longer available. It may have been cleaned up from the server.', {
          id: `download-404-${fileId}`,
          duration: 5000
        });
        return;
      }

      console.error('Download error:', err);
      toast.error('Download failed', {
        id: `download-error-${fileId}`
      });
    }
  };

  const getColumnStats = (columnName) => {
    if (!fileData) return null;
    
    const values = fileData.rows
      .map(row => row[columnName])
      .filter(val => val !== null && val !== undefined && val !== '');
    
    const numericValues = values.filter(val => !isNaN(parseFloat(val))).map(val => parseFloat(val));
    
    if (numericValues.length > 0) {
      const sum = numericValues.reduce((a, b) => a + b, 0);
      const avg = sum / numericValues.length;
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      
      return { sum, avg: avg.toFixed(2), min, max, count: numericValues.length, type: 'numeric' };
    }
    
    return { count: values.length, unique: new Set(values).size, type: 'text' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-[#bc4e9c] mx-auto mb-4" />
          <p className="text-gray-900 font-semibold text-lg">Loading file analysis...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] flex items-center justify-center p-8">
        <Toaster position="top-center" />
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading File</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard/history')}
            className="px-6 py-3 bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Back to Upload History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] p-8">
      <Toaster position="top-center" />
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/history')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#bc4e9c] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Upload History</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {fileInfo?.originalName || fileInfo?.filename}
              </h1>
              <p className="text-gray-600">
                {fileData?.rowCount || 0} rows • {fileData?.headers?.length || 0} columns
                {!fileAvailable && (
                  <span className="ml-2 text-orange-600 font-semibold">
                    (File content unavailable)
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleDownload}
              disabled={!fileAvailable}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                fileAvailable
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title={!fileAvailable ? 'File no longer available on server' : 'Download file'}
            >
              <Download className="w-5 h-5" />
              Download
            </button>
          </div>
          <hr className="border-t-2 border-[#bc4e9c] mt-4" />
        </div>

        {!fileAvailable && (
          <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-orange-800 font-semibold">File Content Unavailable</p>
                <p className="text-orange-700 text-sm mt-1">
                  The physical file has been cleaned up from the server due to ephemeral storage limitations. 
                  File metadata is still available. Please re-upload if you need to access the content.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'preview'
                  ? 'text-[#bc4e9c] border-b-2 border-[#bc4e9c]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table className="w-5 h-5" />
              Data Preview
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 transition-colors ${
                activeTab === 'stats'
                  ? 'text-[#bc4e9c] border-b-2 border-[#bc4e9c]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Column Statistics
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'preview' && fileData && fileData.rows.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#bc4e9c] to-[#f80759] text-white">
                      {fileData.headers.map((header, idx) => (
                        <th key={idx} className="px-4 py-3 text-left font-semibold text-sm">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {fileData.rows.slice(0, 100).map((row, rowIdx) => (
                      <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        {fileData.headers.map((header, colIdx) => (
                          <td key={colIdx} className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                            {row[header]?.toString() || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {fileData.rows.length > 100 && (
                  <p className="text-center text-gray-600 mt-4 text-sm">
                    Showing first 100 rows of {fileData.rowCount}
                  </p>
                )}
              </div>
            )}

            {activeTab === 'stats' && fileData && fileData.rows.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fileData.headers.map((header, idx) => {
                  const stats = getColumnStats(header);
                  return (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">{header}</h3>
                      <div className="space-y-2">
                        {stats.type === 'numeric' ? (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Count:</span>
                              <span className="font-semibold text-gray-900">{stats.count}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Average:</span>
                              <span className="font-semibold text-gray-900">{stats.avg}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Min:</span>
                              <span className="font-semibold text-gray-900">{stats.min}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Max:</span>
                              <span className="font-semibold text-gray-900">{stats.max}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total Values:</span>
                              <span className="font-semibold text-gray-900">{stats.count}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Unique:</span>
                              <span className="font-semibold text-gray-900">{stats.unique}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {(!fileData || fileData.rows.length === 0) && !error && (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-semibold mb-2">File Content Unavailable</p>
                <p className="text-gray-500">
                  {!fileData 
                    ? 'The file has been cleaned up from the server.' 
                    : 'The file contains no data rows.'}
                </p>
                <p className="text-gray-500 text-sm mt-2">Metadata is still available above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;