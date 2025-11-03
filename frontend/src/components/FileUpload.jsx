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
