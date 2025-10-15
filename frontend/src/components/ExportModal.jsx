import React, { useState } from 'react';
import { X, Download, FileImage, FileText, FileSpreadsheet, FileJson, CheckCircle } from 'lucide-react';
import { 
  exportChartToPNG, 
  exportChartToPDF, 
  exportToCSV, 
  exportToExcel,
  exportToJSON 
} from '../utils/exportUtils';

const ExportModal = ({ isOpen, onClose, data, fileName, chartRef }) => {
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState('');
  const [exportError, setExportError] = useState('');

  if (!isOpen) return null;

const handleExport = async (type) => {
  setExporting(true);
  setExportError('');
  setExportSuccess('');

  try {
    const baseFileName = fileName?.replace(/\.[^/.]+$/, '') || 'export';

    switch (type) {
      case 'png':
        if (!chartRef) {
          throw new Error('No chart available to export. Please generate a chart first by clicking "Create Charts" and selecting data columns.');
        }
        await exportChartToPNG(chartRef, baseFileName);
        setExportSuccess('Chart exported as PNG successfully!');
        break;

      case 'pdf':
        if (!chartRef) {
          throw new Error('No chart available to export. Please generate a chart first by clicking "Create Charts" and selecting data columns.');
        }
        await exportChartToPDF(chartRef, baseFileName);
        setExportSuccess('Chart exported as PDF successfully!');
        break;

      case 'csv':
        if (!data || data.length === 0) {
          throw new Error('No data available to export');
        }
        exportToCSV(data, baseFileName);
        setExportSuccess('Data exported as CSV successfully!');
        break;

      case 'excel':
        if (!data || data.length === 0) {
          throw new Error('No data available to export');
        }
        exportToExcel(data, baseFileName);
        setExportSuccess('Data exported as Excel successfully!');
        break;

      case 'json':
        if (!data || data.length === 0) {
          throw new Error('No data available to export');
        }
        exportToJSON(data, baseFileName);
        setExportSuccess('Data exported as JSON successfully!');
        break;

      default:
        throw new Error('Unknown export type');
    }

    setTimeout(() => {
      setExportSuccess('');
    }, 3000);
  } catch (error) {
    console.error('Export error:', error);
    setExportError(error.message || 'Export failed. Please try again.');
    setTimeout(() => {
      setExportError('');
    }, 5000);
  } finally {
    setExporting(false);
  }
};
  const ExportOption = ({ icon: Icon, title, description, format, color, available = true }) => (
    <button
      onClick={() => available && handleExport(format)}
      disabled={!available || exporting}
      className={`${
        available
          ? `bg-gradient-to-br ${color} hover:shadow-xl hover:scale-105 cursor-pointer`
          : 'bg-gray-200 cursor-not-allowed opacity-50'
      } rounded-2xl p-6 text-white shadow-lg transition-all transform disabled:transform-none disabled:cursor-not-allowed`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 ${available ? 'bg-white/20' : 'bg-gray-400/20'} rounded-xl flex items-center justify-center`}>
          <Icon size={28} />
        </div>
        {available && (
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Download size={18} />
          </div>
        )}
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-white/80">{description}</p>
      {!available && (
        <p className="text-xs mt-2 font-semibold">Not available</p>
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Download size={32} />
                Export Your Data
              </h2>
              <p className="text-green-100 mt-1">Choose your preferred format</p>
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
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Alerts */}
          {exportSuccess && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-5 shadow-lg mb-6 animate-pulse">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} />
                <div>
                  <h3 className="font-bold text-lg">Success!</h3>
                  <p className="text-sm text-green-100">{exportSuccess}</p>
                </div>
              </div>
            </div>
          )}

          {exportError && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl p-5 shadow-lg mb-6">
              <div className="flex items-center gap-3">
                <X size={24} />
                <div>
                  <h3 className="font-bold text-lg">Error</h3>
                  <p className="text-sm text-red-100">{exportError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">📊 Export Charts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ExportOption
                  icon={FileImage}
                  title="PNG Image"
                  description="High-quality image format"
                  format="png"
                  color="from-blue-500 to-cyan-500"
                  available={!!chartRef}
                />
                <ExportOption
                  icon={FileText}
                  title="PDF Document"
                  description="Printable PDF format"
                  format="pdf"
                  color="from-red-500 to-pink-500"
                  available={!!chartRef}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">📁 Export Data</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ExportOption
                  icon={FileSpreadsheet}
                  title="CSV File"
                  description="Comma-separated values"
                  format="csv"
                  color="from-green-500 to-emerald-500"
                  available={!!data && data.length > 0}
                />
                <ExportOption
                  icon={FileSpreadsheet}
                  title="Excel File"
                  description="Microsoft Excel format"
                  format="excel"
                  color="from-purple-500 to-pink-500"
                  available={!!data && data.length > 0}
                />
                <ExportOption
                  icon={FileJson}
                  title="JSON Data"
                  description="JavaScript object notation"
                  format="json"
                  color="from-orange-500 to-amber-500"
                  available={!!data && data.length > 0}
                />
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-700">
            <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
              💡 Export Tips
            </h4>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>• PNG format is best for presentations and web use</li>
              <li>• PDF is ideal for printing and sharing reports</li>
              <li>• CSV and Excel formats preserve all your data</li>
              <li>• JSON is useful for developers and data integration</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-slate-900 px-8 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              File: <span className="font-semibold">{fileName || 'Untitled'}</span>
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white dark:bg-slate-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;