import React, { useState, useEffect } from 'react';
import { X, TrendingUp, BarChart2, PieChart, Hash, Type, Calendar, CheckCircle } from 'lucide-react';
import { generateStatistics } from '../utils/exportUtils';

const DataMappingModal = ({ isOpen, onClose, data, fileName }) => {
  const [statistics, setStatistics] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);

  useEffect(() => {
    if (data && data.length > 1) {
      const stats = generateStatistics(data);
      setStatistics(stats);
    }
  }, [data]);

  if (!isOpen) return null;

  const getColumnIcon = (type) => {
    if (type === 'numeric') return <Hash className="text-blue-500" size={20} />;
    if (type === 'text') return <Type className="text-purple-500" size={20} />;
    return <BarChart2 className="text-green-500" size={20} />;
  };

  const getTypeColor = (type) => {
    if (type === 'numeric') return 'bg-blue-100 text-blue-700';
    if (type === 'text') return 'bg-purple-100 text-purple-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <TrendingUp size={32} />
                Data Mapping & Analytics
              </h2>
              <p className="text-purple-100 mt-1">
                Smart analysis for {fileName || 'your data'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!statistics ? (
            <div className="text-center py-12">
              <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 font-semibold">Analyzing your data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Hash size={28} />
                    <span className="text-3xl font-bold">
                      {statistics.filter(s => s.type === 'numeric').length}
                    </span>
                  </div>
                  <p className="text-blue-100 font-semibold">Numeric Columns</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Type size={28} />
                    <span className="text-3xl font-bold">
                      {statistics.filter(s => s.type === 'text').length}
                    </span>
                  </div>
                  <p className="purple-100 font-semibold">Text Columns</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart2 size={28} />
                    <span className="text-3xl font-bold">{data.length - 1}</span>
                  </div>
                  <p className="text-green-100 font-semibold">Total Rows</p>
                </div>
              </div>

              {/* Column Statistics */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PieChart className="text-purple-600" size={24} />
                  Column Analysis
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {statistics.map((stat, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedColumn(selectedColumn === index ? null : index)}
                      className={`bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-5 border-2 transition-all cursor-pointer hover:shadow-lg ${
                        selectedColumn === index
                          ? 'border-purple-500 shadow-lg'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md">
                            {getColumnIcon(stat.type)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-gray-800 text-lg">
                                {stat.column}
                              </h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(
                                  stat.type
                                )}`}
                              >
                                {stat.type}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                              <div className="bg-white rounded-lg p-3 shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Total Values</p>
                                <p className="text-lg font-bold text-gray-800">{stat.count}</p>
                              </div>

                              <div className="bg-white rounded-lg p-3 shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Missing</p>
                                <p className="text-lg font-bold text-red-600">{stat.missing}</p>
                              </div>

                              <div className="bg-white rounded-lg p-3 shadow-sm">
                                <p className="text-xs text-gray-500 mb-1">Unique</p>
                                <p className="text-lg font-bold text-purple-600">{stat.unique}</p>
                              </div>

                              {stat.type === 'numeric' ? (
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                  <p className="text-xs text-gray-500 mb-1">Average</p>
                                  <p className="text-lg font-bold text-blue-600">{stat.mean}</p>
                                </div>
                              ) : (
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                  <p className="text-xs text-gray-500 mb-1">Most Common</p>
                                  <p className="text-sm font-bold text-green-600 truncate">
                                    {stat.mostCommon}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Expanded Details */}
                            {selectedColumn === index && stat.type === 'numeric' && (
                              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3">
                                  <p className="text-xs text-gray-600 mb-1">Minimum</p>
                                  <p className="text-xl font-bold text-blue-700">{stat.min}</p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3">
                                  <p className="text-xs text-gray-600 mb-1">Median</p>
                                  <p className="text-xl font-bold text-purple-700">{stat.median}</p>
                                </div>
                                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-3">
                                  <p className="text-xs text-gray-600 mb-1">Maximum</p>
                                  <p className="text-xl font-bold text-red-700">{stat.max}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="ml-4">
                          {selectedColumn === index ? (
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="text-white" size={20} />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-500 text-xs font-bold">{index + 1}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insights Section */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  💡 Smart Insights
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-700">
                      Your dataset contains <strong>{data.length - 1} rows</strong> and{' '}
                      <strong>{statistics.length} columns</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-700">
                      <strong>{statistics.filter(s => s.type === 'numeric').length}</strong> columns
                      are suitable for mathematical analysis
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                    <span className="text-gray-700">
                      Data quality: {((1 - statistics.reduce((sum, s) => sum + s.missing, 0) / ((data.length - 1) * statistics.length)) * 100).toFixed(1)}% complete
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMappingModal;