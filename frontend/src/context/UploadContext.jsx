// import React, { createContext, useState } from "react";

// export const UploadContext = createContext();

// export const UploadProvider = ({ children }) => {
//   const [uploads, setUploads] = useState([]);

//   // Add a new upload
//   const addUpload = (fileData) => {
//     setUploads((prev) => [...prev, fileData]);
//   };

//   // Clear uploads
//   const clearUploads = () => {
//     setUploads([]);
//   };

//   return (
//     <UploadContext.Provider value={{ uploads, addUpload, clearUploads }}>
//       {children}
//     </UploadContext.Provider>
//   );
// };

import React, { createContext, useState } from "react";

export const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
const [currentUpload, setCurrentUpload] = useState(null);
const [analysisData, setAnalysisData] = useState([]);
const [numericColumns, setNumericColumns] = useState([]);
const [textColumns, setTextColumns] = useState([]);

return (
<UploadContext.Provider
value={{
currentUpload,
setCurrentUpload,
analysisData,
setAnalysisData,
numericColumns,
setNumericColumns,
textColumns,
setTextColumns,
}}
>
{children}
</UploadContext.Provider>
);
};
