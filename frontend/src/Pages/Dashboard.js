import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../Components/Navbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useProject } from "../context/ProjectContext";
import { useAppContext } from "../context/AppContext";
import {
  ChartColumnBig,
  Wallet,
  CircleDollarSign,
  BarChart3,
  AlertCircle,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Info,
  Package,
  Users,
  Clock,
  Target,
  DollarSign,
  Activity,
  PieChart,
  Building
} from "lucide-react";

// Utility function to format currency in Indian Rupees
const formatINR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { selectedProject, isLoading, selectProject } = useProject();
  const { appData } = useAppContext();

  // Calculate real project statistics from appData
  const projectStats = useMemo(() => {
    if (!appData || !appData.dailyReport) return null;

    const entries = appData.dailyReport.entries || [];

    // Financial Analysis
    const totalAmount = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    const totalPaid = entries.reduce((sum, entry) => sum + (entry.paid || 0), 0);
    const totalBalance = entries.reduce((sum, entry) => sum + (entry.balance || 0), 0);
    const paymentPercentage = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

    // Material Analysis
    const materials = {};
    entries.forEach(entry => {
      if (entry.particulars) {
        if (!materials[entry.particulars]) {
          materials[entry.particulars] = {
            name: entry.particulars,
            totalReceived: 0,
            totalConsumed: 0,
            totalAmount: 0,
            totalPaid: 0,
            unit: entry.unit || 'units'
          };
        }
        materials[entry.particulars].totalReceived += entry.received || 0;
        materials[entry.particulars].totalConsumed += entry.consumed || 0;
        materials[entry.particulars].totalAmount += entry.amount || 0;
        materials[entry.particulars].totalPaid += entry.paid || 0;
      }
    });

    const materialList = Object.values(materials);
    const activeMaterials = materialList.filter(m => m.totalReceived > 0);
    const lowStockMaterials = materialList.filter(m => {
      const remaining = m.totalReceived - m.totalConsumed;
      return remaining > 0 && remaining <= m.totalReceived * 0.2;
    });

    // Monthly Analysis
    const monthlyData = {};
    entries.forEach(entry => {
      if (entry.date) {
        const date = new Date(entry.date);
        if (isNaN(date.getTime())) return;
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-IN', { month: 'short' });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthName,
            totalAmount: 0,
            totalPaid: 0,
            totalBalance: 0,
            transactions: 0
          };
        }

        monthlyData[monthKey].totalAmount += entry.amount || 0;
        monthlyData[monthKey].totalPaid += entry.paid || 0;
        monthlyData[monthKey].totalBalance += entry.balance || 0;
        monthlyData[monthKey].transactions += 1;
      }
    });

    const monthlyArray = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

    return {
      financial: {
        totalAmount,
        totalPaid,
        totalBalance,
        paymentPercentage,
        existingBalance: appData.dailyReport.existingBalance || 0
      },
      materials: {
        total: materialList.length,
        active: activeMaterials.length,
        lowStock: lowStockMaterials.length,
        list: materialList
      },
      monthly: monthlyArray,
      transactions: {
        total: entries.length,
        recent: entries.slice(-5).reverse()
      }
    };
  }, [appData.dailyReport.entries]);

  // Load project from URL parameter if not already selected
  useEffect(() => {
    if (!isLoading && !selectedProject && !projectId) {
      // No project selected and no projectId in URL, redirect to projects page
      navigate('/app/projects');
    }
  }, [projectId, selectedProject, isLoading, navigate]);

const renderFinancialChart = () => {
    if (!projectStats || !projectStats.monthly || projectStats.monthly.length === 0) {
      return <div className="flex items-center justify-center h-40 text-white">No financial data available</div>;
    }

    const maxValue = Math.max(
      ...projectStats.monthly.map(data => Math.max(data.totalAmount || 0, data.totalPaid || 0))
    );

    // Fixed px heights — % heights don't work without explicit parent height
    const maxBarHeight = 120;

    return (
      <div className="flex items-end justify-around px-2" style={{ height: `${maxBarHeight + 24}px` }}>
        {projectStats.monthly.map((data, index) => {
          const amountHeight = maxValue > 0 ? Math.max(4, (data.totalAmount / maxValue) * maxBarHeight) : 4;
          const paidHeight = maxValue > 0 ? Math.max(4, (data.totalPaid / maxValue) * maxBarHeight) : 4;

          return (
            <div key={index} className="flex flex-col items-center">
              <div className="flex space-x-1 items-end" style={{ height: `${maxBarHeight}px` }}>
                <div
                  className="w-4 bg-blue-400 rounded-t-sm"
                  style={{ height: `${amountHeight}px` }}
                  title={`Amount: ${formatINR(data.totalAmount)}`}
                ></div>
                <div
                  className="w-4 bg-green-400 rounded-t-sm"
                  style={{ height: `${paidHeight}px` }}
                  title={`Paid: ${formatINR(data.totalPaid)}`}
                ></div>
              </div>
              <div className="text-[10px] text-white mt-1 font-medium">{data.month}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMaterialChart = () => {
    if (!projectStats || !projectStats.materials || projectStats.materials.list.length === 0) {
      return <div className="flex items-center justify-center h-40 text-white">No material data available</div>;
    }

    const materials = projectStats.materials.list.slice(0, 6); // Show top 6 materials
    const maxValue = Math.max(...materials.map(m => Math.max(m.totalReceived, m.totalConsumed)));

    return (
      <div className="space-y-3">
        {materials.map((material, index) => {
          const receivedPercentage = maxValue > 0 ? (material.totalReceived / maxValue) * 100 : 0;
          const consumedPercentage = maxValue > 0 ? (material.totalConsumed / maxValue) * 100 : 0;
          const remaining = material.totalReceived - material.totalConsumed;

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs text-white">
                <span className="font-medium">{material.name}</span>
                <span>{remaining} {material.unit} remaining</span>
              </div>
              <div className="flex space-x-1">
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div
                    className="bg-blue-400 h-2 rounded-full"
                    style={{ width: `${receivedPercentage}%` }}
                    title={`Received: ${material.totalReceived} ${material.unit}`}
                  ></div>
                </div>
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div
                    className="bg-red-400 h-2 rounded-full"
                    style={{ width: `${consumedPercentage}%` }}
                    title={`Consumed: ${material.totalConsumed} ${material.unit}`}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderCircularProgress = (percentage, color = "blue") => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const colorClasses = {
      blue: "stroke-blue-500",
      green: "stroke-green-500",
      red: "stroke-red-500",
      orange: "stroke-orange-500"
    };

    return (
      <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 100 100">
        <circle
          className="stroke-white fill-none opacity-30"
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="8"
        />
        <circle
          className={`fill-none ${colorClasses[color]}`}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="50" textAnchor="middle" dy="0.3em" className="fill-white text-sm font-bold">
          {Math.round(percentage)}%
        </text>
      </svg>
    );
  };

  // Function to go back to projects page
  const handleBackToProjects = () => {
    navigate('/app/projects');
  };

  // Show loading state while data is being prepared
  if (!projectStats) {
    return (
      <>
        <Navbar currentPath={location.pathname} icon={ChartColumnBig} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7BAFD4] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar currentPath={location.pathname} icon={ChartColumnBig} />

      {/* Project Header */}
      <div className="px-4 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          {selectedProject && (
            <button
              onClick={handleBackToProjects}
              className="flex items-center text-[#7BAFD4] hover:text-[#5A8CAB] transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span>Back to Projects</span>
            </button>
          )}
        </div>

        {/* Project Info */}
        {selectedProject && (
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{selectedProject.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Building size={16} className="mr-1" />
                <span>{selectedProject.location}</span>
              </div>
              <div className="flex items-center">
                <DollarSign size={16} className="mr-1" />
                <span>Budget: {selectedProject.budget}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedProject.status === 'Active' ? 'bg-green-100 text-green-800' :
                selectedProject.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedProject.status}
              </span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#7BAFD4]">{formatINR(projectStats.financial.totalAmount)}</div>
            <div className="text-xs text-gray-600">Total Amount</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatINR(projectStats.financial.totalPaid)}</div>
            <div className="text-xs text-gray-600">Total Paid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{projectStats.materials.total}</div>
            <div className="text-xs text-gray-600">Materials</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{projectStats.transactions.total}</div>
            <div className="text-xs text-gray-600">Transactions</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="p-4 space-y-6">
        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Amount Card */}
          <div className="bg-white border-2 border-[#7BAFD4] rounded-lg p-4 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-[#7BAFD4]"></div>
            <div className="flex justify-between items-start mt-2">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatINR(projectStats.financial.totalAmount)}
                </div>
                <div className="text-gray-600 text-sm font-medium mt-1">Total Amount</div>
                <div className="text-xs text-gray-500 mt-1">Project Budget</div>
              </div>
              <div className="bg-[#7BAFD4] p-2 rounded-lg">
                <Wallet size={20} className="text-white" />
              </div>
            </div>
          </div>

          {/* Total Paid Card */}
          <div className="bg-white border-2 border-green-500 rounded-lg p-4 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-green-500"></div>
            <div className="flex justify-between items-start mt-2">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatINR(projectStats.financial.totalPaid)}
                </div>
                <div className="text-gray-600 text-sm font-medium mt-1">Total Paid</div>
                <div className="text-xs text-green-600 mt-1">{projectStats.financial.paymentPercentage}% Complete</div>
              </div>
              <div className="bg-green-500 p-2 rounded-lg">
                <CircleDollarSign size={20} className="text-white" />
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-white border-2 border-orange-500 rounded-lg p-4 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-orange-500"></div>
            <div className="flex justify-between items-start mt-2">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {formatINR(projectStats.financial.totalBalance)}
                </div>
                <div className="text-gray-600 text-sm font-medium mt-1">Pending Balance</div>
                <div className="text-xs text-orange-600 mt-1">{100 - projectStats.financial.paymentPercentage}% Remaining</div>
              </div>
              <div className="bg-orange-500 p-2 rounded-lg">
                <AlertCircle size={20} className="text-white" />
              </div>
            </div>
          </div>

          {/* Materials Card */}
          <div className="bg-white border-2 border-purple-500 rounded-lg p-4 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-purple-500"></div>
            <div className="flex justify-between items-start mt-2">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {projectStats.materials.active}/{projectStats.materials.total}
                </div>
                <div className="text-gray-600 text-sm font-medium mt-1">Active Materials</div>
                <div className="text-xs text-purple-600 mt-1">{projectStats.materials.lowStock} Low Stock</div>
              </div>
              <div className="bg-purple-500 p-2 rounded-lg">
                <Package size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Progress */}
          <div className="bg-[#7BAFD4] rounded-lg p-6 shadow-md text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Payment Progress</h3>
              <Activity size={20} />
            </div>
            <div className="flex justify-center mb-4">
              {renderCircularProgress(projectStats.financial.paymentPercentage, "green")}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">{formatINR(projectStats.financial.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className="font-medium">{formatINR(projectStats.financial.totalPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span>Balance:</span>
                <span className="font-medium">{formatINR(projectStats.financial.totalBalance)}</span>
              </div>
            </div>
          </div>

          {/* Material Overview */}
          <div className="bg-[#7BAFD4] rounded-lg p-6 shadow-md text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Material Overview</h3>
              <Package size={20} />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{projectStats.materials.total}</div>
                <div className="text-xs opacity-75">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">{projectStats.materials.active}</div>
                <div className="text-xs opacity-75">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-300">{projectStats.materials.lowStock}</div>
                <div className="text-xs opacity-75">Low Stock</div>
              </div>
            </div>
            <div className="space-y-2">
              {projectStats.materials.list.slice(0, 3).map((material, index) => {
                const remaining = material.totalReceived - material.totalConsumed;
                const usagePercentage = material.totalReceived > 0 ? Math.round((material.totalConsumed / material.totalReceived) * 100) : 0;
                return (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="truncate">{material.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">{remaining} {material.unit}</span>
                      <div className="w-12 bg-white/20 rounded-full h-1">
                        <div
                          className="bg-white h-1 rounded-full"
                          style={{ width: `${usagePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <Clock size={20} className="text-gray-500" />
            </div>
            <div className="space-y-3">
              {projectStats.transactions.recent.map((txn, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm text-gray-900">{txn.particulars}</div>
                    <div className="text-xs text-gray-500">{txn.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">{formatINR(txn.amount)}</div>
                    <div className="text-xs text-gray-500">
                      {txn.received ? `+${txn.received} ${txn.unit}` :
                       txn.consumed ? `-${txn.consumed} ${txn.unit}` : 'Financial'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Financial Trends Chart */}
          <div className="bg-[#7BAFD4] rounded-lg p-6 shadow-md text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Financial Trends</h3>
              <BarChart3 size={20} />
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-xs">Total Amount</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs">Amount Paid</span>
              </div>
            </div>
            
            {renderFinancialChart()}
          </div>

          {/* Material Usage Chart */}
          <div className="bg-[#7BAFD4] rounded-lg p-6 shadow-md text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Material Usage</h3>
              <PieChart size={20} />
            </div>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-xs">Received</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                <span className="text-xs">Consumed</span>
              </div>
            </div>
            {renderMaterialChart()}
          </div>
        </div>

        {/* Project Insights */}
        {projectStats.materials.lowStock > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle size={20} className="text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h4 className="text-yellow-800 font-medium">Low Stock Alert</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  {projectStats.materials.lowStock} material(s) are running low on stock. Consider reordering soon.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Statistics */}
        <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#7BAFD4] mb-2">{projectStats.financial.paymentPercentage}%</div>
              <div className="text-sm text-gray-600">Payment Completion</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-[#7BAFD4] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${projectStats.financial.paymentPercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{projectStats.materials.active}</div>
              <div className="text-sm text-gray-600">Active Materials</div>
              <div className="text-xs text-gray-500 mt-1">Out of {projectStats.materials.total} total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{projectStats.transactions.total}</div>
              <div className="text-sm text-gray-600">Total Transactions</div>
              <div className="text-xs text-gray-500 mt-1">Financial & Material</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{formatINR(projectStats.financial.existingBalance)}</div>
              <div className="text-sm text-gray-600">Existing Balance</div>
              <div className="text-xs text-gray-500 mt-1">Available funds</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;