import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

const DataMapping = ({ uploadedData }) => {
  const [headers, setHeaders] = useState([]);
  const [smartInsights, setSmartInsights] = useState([]);

  useEffect(() => {
    if (uploadedData && uploadedData.length > 0) {
      setHeaders(uploadedData[0]);
      setSmartInsights(detectColumnTypes(uploadedData));
    }
  }, [uploadedData]);

  const detectColumnTypes = (data) => {
    if (!data || data.length < 2) return [];

    const types = data[0].map((_, colIndex) => {
      const values = data.slice(1).map((row) => row[colIndex]);
      const numericValues = values.filter((v) => !isNaN(parseFloat(v)));
      const uniqueValues = [...new Set(values)];

      if (numericValues.length === values.length) return "Numeric";
      if (uniqueValues.length < values.length / 2) return "Categorical";
      return "Text";
    });

    return data[0].map((header, i) => ({
      column: header,
      detectedType: types[i],
      uniqueValues: [...new Set(data.slice(1).map((row) => row[i]))].length,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-10 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">Smart Data Mapping</h1>
          <p className="text-lg">Automatic detection of column types & patterns</p>
        </div>

        {/* Insights */}
        {smartInsights.length > 0 ? (
          <div className="px-8 pb-10 pt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-indigo-600" />
              Smart Analytics Overview
            </h3>
            <div className="overflow-auto">
              <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="px-4 py-3">Column</th>
                    <th className="px-4 py-3">Detected Type</th>
                    <th className="px-4 py-3">Unique Values</th>
                  </tr>
                </thead>
                <tbody>
                  {smartInsights.map((col, i) => (
                    <tr key={i} className="border-t text-gray-700 hover:bg-gray-50">
                      <td className="px-4 py-2">{col.column}</td>
                      <td className="px-4 py-2">{col.detectedType}</td>
                      <td className="px-4 py-2">{col.uniqueValues}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 text-lg">
            No data available for mapping. Please upload a file first from your Dashboard.
          </div>
        )}
      </div>
    </div>
  );
};

export default DataMapping;
