import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

// Stock Level Gauge Chart
export const StockLevelChart = ({ material }) => {
  const remaining = material.totalReceived - material.totalConsumed;
  const consumedPercentage = material.totalReceived > 0 ? (material.totalConsumed / material.totalReceived) * 100 : 0;
  const remainingPercentage = 100 - consumedPercentage;

  const data = {
    labels: ['Consumed', 'Remaining'],
    datasets: [
      {
        data: [consumedPercentage, remainingPercentage],
        backgroundColor: [
          '#EF4444', // Red for consumed
          '#10B981', // Green for remaining
        ],
        borderColor: [
          '#DC2626',
          '#059669',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          '#F87171',
          '#34D399',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: '500'
          }
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const actualValue = label === 'Consumed' ? material.totalConsumed : remaining;
            return `${label}: ${actualValue} ${material.unit} (${value.toFixed(1)}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
};

// Usage Trend Chart
export const UsageTrendChart = ({ material }) => {
  // Generate mock trend data based on transactions
  const generateTrendData = () => {
    const days = 7;
    const data = [];
    const labels = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Mock consumption data with some variation
      const baseConsumption = material.totalConsumed / days;
      const variation = (Math.random() - 0.5) * baseConsumption * 0.4;
      data.push(Math.max(0, baseConsumption + variation));
    }
    
    return { labels, data };
  };

  const trendData = generateTrendData();

  const data = {
    labels: trendData.labels,
    datasets: [
      {
        label: `Daily Consumption (${material.unit})`,
        data: trendData.data,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3B82F6',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value) {
            return value.toFixed(1);
          }
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
};

// Comparison Bar Chart
export const MaterialComparisonChart = ({ material }) => {
  const data = {
    labels: ['Received', 'Consumed', 'Remaining'],
    datasets: [
      {
        label: `Quantity (${material.unit})`,
        data: [
          material.totalReceived,
          material.totalConsumed,
          material.totalReceived - material.totalConsumed
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Green for received
          'rgba(239, 68, 68, 0.8)',   // Red for consumed
          'rgba(59, 130, 246, 0.8)',  // Blue for remaining
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(59, 130, 246)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.y} ${material.unit}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
          }
        }
      },
    },
  };

  return (
    <div className="h-64">
      <Bar data={data} options={options} />
    </div>
  );
};

// Stock Status Indicator
export const StockStatusIndicator = ({ material }) => {
  const remaining = material.totalReceived - material.totalConsumed;
  const remainingPercentage = material.totalReceived > 0 ? (remaining / material.totalReceived) * 100 : 0;
  
  const getStatusColor = () => {
    if (remainingPercentage > 50) return 'text-green-600 bg-green-100';
    if (remainingPercentage > 20) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusText = () => {
    if (remainingPercentage > 50) return 'Good Stock';
    if (remainingPercentage > 20) return 'Medium Stock';
    return 'Low Stock';
  };

  const getStatusIcon = () => {
    if (remainingPercentage > 50) return '●';
    if (remainingPercentage > 20) return '●';
    return '●';
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
      <span className="mr-2">{getStatusIcon()}</span>
      {getStatusText()}
    </div>
  );
};

// Mini Progress Bar
export const ProgressBar = ({ percentage, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      ></div>
    </div>
  );
};
