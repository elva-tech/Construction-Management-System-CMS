import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StockLevelChart,
  UsageTrendChart,
  MaterialComparisonChart,
  StockStatusIndicator,
  ProgressBar
} from './Charts/MaterialFlowCharts';

const MaterialAnalytics = ({ material, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const remaining = material.totalReceived - material.totalConsumed;
  const consumedPercentage = material.totalReceived > 0 ? (material.totalConsumed / material.totalReceived) * 100 : 0;
  const remainingPercentage = 100 - consumedPercentage;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'trends', label: 'Trends', icon: '📈' },
    { id: 'comparison', label: 'Comparison', icon: '📋' },
    { id: 'details', label: 'Details', icon: '🔍' }
  ];

  const stats = [
    {
      label: 'Total Received',
      value: material.totalReceived,
      unit: material.unit,
      color: 'green',
      icon: '📦',
      change: '+12%'
    },
    {
      label: 'Total Consumed',
      value: material.totalConsumed,
      unit: material.unit,
      color: 'red',
      icon: '🔨',
      change: '+8%'
    },
    {
      label: 'Remaining Stock',
      value: remaining,
      unit: material.unit,
      color: 'blue',
      icon: '📋',
      change: '+4%'
    },
    {
      label: 'Efficiency Rate',
      value: consumedPercentage.toFixed(1),
      unit: '%',
      color: 'purple',
      icon: '⚡',
      change: '+2%'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{material.name} Analytics</h2>
              <p className="text-blue-100 mt-1">Comprehensive material flow analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <StockStatusIndicator material={material} />
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value} <span className="text-sm font-normal text-gray-500">{stat.unit}</span>
                    </p>
                    <p className="text-xs text-green-600 mt-1">{stat.change} from last week</p>
                  </div>
                  <div className="text-2xl">{stat.icon}</div>
                </div>
                <div className="mt-3">
                  <ProgressBar 
                    percentage={stat.label === 'Efficiency Rate' ? stat.value : (stat.value / material.totalReceived) * 100} 
                    color={stat.color} 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Distribution</h3>
                  <StockLevelChart material={material} />
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Comparison</h3>
                  <MaterialComparisonChart material={material} />
                </div>
              </motion.div>
            )}

            {activeTab === 'trends' && (
              <motion.div
                key="trends"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Usage Trend</h3>
                <UsageTrendChart material={material} />
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Insight:</strong> Average daily consumption is {(material.totalConsumed / 7).toFixed(1)} {material.unit}. 
                    At this rate, current stock will last approximately {Math.ceil(remaining / (material.totalConsumed / 7))} days.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'comparison' && (
              <motion.div
                key="comparison"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Comparison</h3>
                  <MaterialComparisonChart material={material} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <h4 className="font-semibold text-green-800">Received</h4>
                    <p className="text-2xl font-bold text-green-600">{material.totalReceived} {material.unit}</p>
                    <p className="text-sm text-green-600">100% of total</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <h4 className="font-semibold text-red-800">Consumed</h4>
                    <p className="text-2xl font-bold text-red-600">{material.totalConsumed} {material.unit}</p>
                    <p className="text-sm text-red-600">{consumedPercentage.toFixed(1)}% of total</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-800">Remaining</h4>
                    <p className="text-2xl font-bold text-blue-600">{remaining} {material.unit}</p>
                    <p className="text-sm text-blue-600">{remainingPercentage.toFixed(1)}% of total</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Basic Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Material Name:</span>
                          <span className="font-medium">{material.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Unit of Measurement:</span>
                          <span className="font-medium">{material.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Transactions:</span>
                          <span className="font-medium">{material.transactions?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Utilization Rate:</span>
                          <span className="font-medium">{consumedPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Waste Percentage:</span>
                          <span className="font-medium">2.1%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Efficiency Score:</span>
                          <span className="font-medium text-green-600">Good</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { date: '2025-01-15', action: 'Received', amount: 25, unit: material.unit },
                      { date: '2025-01-14', action: 'Consumed', amount: 15, unit: material.unit },
                      { date: '2025-01-13', action: 'Received', amount: 30, unit: material.unit },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            activity.action === 'Received' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm text-gray-600">{activity.date}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{activity.action}</span>
                          <span className="text-gray-600 ml-2">{activity.amount} {activity.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MaterialAnalytics;
