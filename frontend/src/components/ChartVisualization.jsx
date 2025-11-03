import React, { useState } from 'react';
import { ArrowLeft, BarChart3, TrendingUp, PieChart as PieChartIcon, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316'];

const ChartVisualization = ({ data = [], headers = [], onBack, fileName }) => {
  const [chartType, setChartType] = useState('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');

  const prepareChartData = () => {
    if (!xAxis || !yAxis || !Array.isArray(data) || data.length < 2) return [];

    const xIndex = headers.indexOf(xAxis);
    const yIndex = headers.indexOf(yAxis);

    if (xIndex === -1 || yIndex === -1) return [];

    return data
      .slice(1)
      .map((row, idx) => {
        const xValue = row?.[xIndex];
        const yValue = parseFloat(row?.[yIndex]) || 0;

        return {
          name: xValue || `Item ${idx + 1}`,
          value: yValue,
          label: xValue || `Item ${idx + 1}`,
        };
      })
      .filter((item) => item.value !== 0 || item.name);
  };

  const chartData = prepareChartData();

  const renderChart = () => {
    if (!xAxis || !yAxis) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
          <BarChart3 size={64} className="mb-4" />
          <p className="text-xl font-semibold">Select X and Y axis to generate chart</p>
          <p className="text-sm mt-2">Choose columns from your data to visualize</p>
        </div>
      );
    }

    if (!Array.isArray(chartData) || chartData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
          <BarChart3 size={64} className="mb-4" />
          <p className="text-xl font-semibold">No valid data for selected columns</p>
          <p className="text-sm mt-2">Try selecting different columns</p>
        </div>
      );
    }

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8b5cf6" name={yAxis} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} name={yAxis} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 lg:px-8 py-5 lg:py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg transition-all mb-3"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 size={28} /> Chart Visualization
        </h2>
        <p className="text-purple-100 mt-1">{fileName}</p>
      </div>

      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Select Chart Type</h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setChartType('bar')}
              className={`p-4 rounded-xl border-2 transition-all ${
                chartType === 'bar'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <BarChart3
                size={32}
                className={`mx-auto mb-2 ${chartType === 'bar' ? 'text-purple-600' : 'text-gray-400'}`}
              />
              <p className="font-semibold text-sm">Bar Chart</p>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-4 rounded-xl border-2 transition-all ${
                chartType === 'line'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <TrendingUp
                size={32}
                className={`mx-auto mb-2 ${chartType === 'line' ? 'text-pink-600' : 'text-gray-400'}`}
              />
              <p className="font-semibold text-sm">Line Chart</p>
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`p-4 rounded-xl border-2 transition-all ${
                chartType === 'pie'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <PieChartIcon
                size={32}
                className={`mx-auto mb-2 ${chartType === 'pie' ? 'text-blue-600' : 'text-gray-400'}`}
              />
              <p className="font-semibold text-sm">Pie Chart</p>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">X-Axis (Labels)</label>
            <select
              value={xAxis}
              onChange={(e) => setXAxis(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            >
              <option value="">Select column...</option>
              {Array.isArray(headers) &&
                headers.map((header, idx) => (
                  <option key={idx} value={header}>
                    {header || `Column ${idx + 1}`}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Y-Axis (Values)</label>
            <select
              value={yAxis}
              onChange={(e) => setYAxis(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
            >
              <option value="">Select column...</option>
              {Array.isArray(headers) &&
                headers.map((header, idx) => (
                  <option key={idx} value={header}>
                    {header || `Column ${idx + 1}`}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl p-6 border-2 border-purple-200">
          {renderChart()}
        </div>

        {Array.isArray(chartData) && chartData.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Showing {chartData.length} data points
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartVisualization;
