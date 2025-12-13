import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = ({ chartType, labels, values }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !labels || !values || labels.length === 0) {
      return;
    }

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const colors = [
      'rgba(79, 70, 229, 0.8)',
      'rgba(168, 85, 247, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(251, 146, 60, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)',
    ];

    const borderColors = [
      'rgba(79, 70, 229, 1)',
      'rgba(168, 85, 247, 1)',
      'rgba(236, 72, 153, 1)',
      'rgba(59, 130, 246, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(251, 146, 60, 1)',
      'rgba(239, 68, 68, 1)',
      'rgba(139, 92, 246, 1)',
    ];

    const chartConfig = {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
          label: 'Data',
          data: values,
          backgroundColor: chartType === 'pie' 
            ? colors 
            : 'rgba(139, 92, 246, 0.6)',
          borderColor: chartType === 'pie' 
            ? borderColors 
            : 'rgba(139, 92, 246, 1)',
          borderWidth: 2,
          tension: chartType === 'line' ? 0.4 : 0,
          fill: chartType === 'line' ? true : false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: chartType === 'pie',
            position: 'right',
            labels: {
              font: {
                size: 12,
                family: "'Inter', sans-serif"
              },
              padding: 15,
              usePointStyle: true,
            }
          },
          title: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            displayColors: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(2);
                } else if (context.parsed !== null) {
                  label += context.parsed.toFixed(2);
                }
                return label;
              }
            }
          }
        },
        scales: chartType !== 'pie' ? {
          x: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              font: {
                size: 11
              },
              maxRotation: 45,
              minRotation: 0
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              font: {
                size: 11
              }
            }
          }
        } : {},
        animation: {
          duration: 800,
          easing: 'easeInOutQuart'
        }
      }
    };

    chartInstance.current = new Chart(ctx, chartConfig);

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartType, labels, values]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
      <div style={{ height: '400px', position: 'relative' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ChartComponent;