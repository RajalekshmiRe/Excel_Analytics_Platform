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
 import axios from 'axios';
  import { UploadContext } from '../context/UploadContext'; 
  export default function FileUpload() { 
    const { setCurrentUpload } = useContext(UploadContext);
     const [file, setFile] = useState(null); 
     const [previewRows, setPreviewRows] = useState([]); 
     const token = localStorage.getItem('token'); // adjust if stored differently 
     const onSelect = (e) => { setFile(e.target.files[0]); 
     };
    const handleUpload = async () => {
       if (!file) return alert('Please select a file'); 
       const form = new FormData(); form.append('file', file); 
       try { 
        const res = await axios.post('/api/uploads', form, {
          headers: { 
            'Content-Type': 'multipart/form-data',
             Authorization: `Bearer ${token}` } }); 
         // save metadata to context 
          setCurrentUpload(res.data);
           setPreviewRows(res.data.previewRows || []); 
           alert('Upload successful');
           } catch (err) { 
            console.error(err);
             alert(err.response?.data?.message || 'Upload failed');
             } 
            };
             return ( <div className="card p-4">
               <h3>Upload Excel File</h3>
                <input type="file" accept=".xlsx,.xls" onChange={onSelect} /> 
                <button onClick={handleUpload} className="btn btn-primary mt-2">Upload File</button>
                 {previewRows.length > 0 && (
                   <div className="mt-3">
                     <h5>Preview (first {previewRows.length} rows)</h5> 
                     <div style={{ overflowX: 'auto' }}>
                       <table className="table table-sm">
                         <thead>
                           <tr> 
                            {Object.keys(previewRows[0]).map(h => <th key={h}>{h}</th>)}
                             </tr>
                              </thead> 
                              <tbody>
                                 {previewRows.map((r, i) => ( <tr key={i}> {Object.keys(previewRows[0]).map(k => <td key={k}>{String(r[k] ?? '')}</td>)} 
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