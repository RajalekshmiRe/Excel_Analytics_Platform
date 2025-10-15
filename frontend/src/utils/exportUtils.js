// exportUtils.js - Complete utility functions for data export
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Export data to CSV format
 */
export const exportToCSV = (data, fileName = 'data') => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }
  
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export data to Excel format
 */
export const exportToExcel = (data, fileName = 'data') => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

/**
 * Export data to JSON format
 */
export const exportToJSON = (data, fileName = 'data') => {
  if (!data || data.length < 2) {
    throw new Error('No data to export');
  }

  const headers = data[0];
  const rows = data.slice(1);
  
  const jsonData = rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header || `Column_${index + 1}`] = row[index];
    });
    return obj;
  });

  const jsonString = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export chart to PNG format - IMPROVED VERSION
 */
export const exportChartToPNG = async (chartRef, fileName = 'chart') => {
  if (!chartRef) {
    throw new Error('Chart reference is not available. Please generate a chart first.');
  }

  try {
    // Add a small delay to ensure chart is fully rendered
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(chartRef, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      windowWidth: chartRef.scrollWidth,
      windowHeight: chartRef.scrollHeight,
    });

    // Convert canvas to blob and download
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create image blob'));
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${fileName}_${Date.now()}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve();
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error exporting chart to PNG:', error);
    throw new Error(`Failed to export chart as PNG: ${error.message}`);
  }
};

/**
 * Export chart to PDF format - IMPROVED VERSION
 */
export const exportChartToPDF = async (chartRef, fileName = 'chart') => {
  if (!chartRef) {
    throw new Error('Chart reference is not available. Please generate a chart first.');
  }

  try {
    // Add a small delay to ensure chart is fully rendered
    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(chartRef, {
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      windowWidth: chartRef.scrollWidth,
      windowHeight: chartRef.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions
    const imgWidthPx = canvas.width;
    const imgHeightPx = canvas.height;
    
    // Convert to mm for jsPDF (assuming 96 DPI)
    const imgWidthMm = (imgWidthPx * 25.4) / 96;
    const imgHeightMm = (imgHeightPx * 25.4) / 96;
    
    // Create PDF with proper dimensions
    const pdf = new jsPDF({
      orientation: imgWidthMm > imgHeightMm ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [imgWidthMm + 20, imgHeightMm + 20] // Add 20mm padding
    });

    // Add image with 10mm margins
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidthMm, imgHeightMm);
    
    // Add metadata
    pdf.setProperties({
      title: `${fileName} - Chart Export`,
      subject: 'Data Visualization',
      author: 'Data Management Dashboard',
      keywords: 'chart, export, data',
      creator: 'Dashboard Export'
    });

    pdf.save(`${fileName}_${Date.now()}.pdf`);
  } catch (error) {
    console.error('Error exporting chart to PDF:', error);
    throw new Error(`Failed to export chart as PDF: ${error.message}`);
  }
};