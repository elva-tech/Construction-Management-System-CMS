import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../Components/Navbar";
import ItemDetailsModal from "../Components/ItemDetailsModal";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CircleDollarSign,
  Wallet,
  AlertCircle,
  Package,
  Download,
  Edit2,
  Plus,
  X,
  XCircle,
} from "lucide-react";
import { useAppContext } from '../context/AppContext';
import * as XLSX from 'xlsx';
import { useToast } from "../context/ToastContext";
import AddItemDetailsModal from "../Components/AddItemDetailsModal";
import MaterialAnalytics from '../Components/MaterialAnalytics';
import dailyReportService from '../services/dailyReportService';
import materialService from '../services/materialService';
import materialTrackingService from '../services/materialTrackingService';
import { useProject } from '../context/ProjectContext';

// Utility function to format currency in Indian Rupees
const formatINR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

// Analytics component for Material Flow detail view
function MaterialFlowAnalytics({ particular, getTransactionsForParticular }) {
  const txns = getTransactionsForParticular(particular);
  let totalReceived = 0, totalConsumed = 0, unit = '-';
  let totalEstimated = 0;

  if (txns.length > 0) {
    totalReceived = txns.reduce((sum, t) => sum + (Number(t.received) || 0), 0);
    totalConsumed = txns.reduce((sum, t) => sum + (Number(t.consumed) || 0), 0);
    unit = txns[0].unit || '-';
    totalEstimated = txns[0].totalEstimated ? Number(txns[0].totalEstimated) : 0;
  }

  const remaining = totalReceived - totalConsumed;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-500 text-white p-4 rounded-lg">
        <h4 className="text-sm font-medium">Total Received</h4>
        <p className="text-2xl font-bold">{totalReceived} {unit}</p>
      </div>
      <div className="bg-red-500 text-white p-4 rounded-lg">
        <h4 className="text-sm font-medium">Total Consumed</h4>
        <p className="text-2xl font-bold">{totalConsumed} {unit}</p>
      </div>
      <div className="bg-green-500 text-white p-4 rounded-lg">
        <h4 className="text-sm font-medium">Remaining In Stock</h4>
        <p className="text-2xl font-bold">{remaining} {unit}</p>
      </div>
      <div className="bg-purple-500 text-white p-4 rounded-lg">
        <h4 className="text-sm font-medium">Total Estimated</h4>
        <p className="text-2xl font-bold">{totalEstimated} {unit}</p>
      </div>
    </div>
  );
}

const Inventory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appData, updateDailyReport } = useAppContext();
  const { showSuccess, showInfo, showError } = useToast();
  const { selectedProject } = useProject();

  // State for active tab
  const [activeTab, setActiveTab] = useState("Material Tracking List");

  // PRODUCTION: real material tracking entries from API
  const [materialEntries, setMaterialEntries] = useState([]);

  // Fetch material tracking data from API — filtered by project
  useEffect(() => {
    const fetchMaterialData = async () => {
      try {
        const [materialsRes, trackingRes] = await Promise.all([
          materialService.getAll(selectedProject?.id),
          materialTrackingService.getAll(selectedProject?.id)
        ]);

        const materials = Array.isArray(materialsRes?.data) ? materialsRes.data : [];
        const trackingEntries = Array.isArray(trackingRes?.data) ? trackingRes.data : [];

        const materialMap = materials.reduce((acc, m) => {
          if (m?.id !== undefined && m?.id !== null) {
            acc[m.id] = { particulars: m?.particulars || '', unit: m?.unit || '' };
          }
          return acc;
        }, {});

        const merged = trackingEntries.map(entry => ({
          ...entry,
          particulars: materialMap?.[entry?.material_id]?.particulars || '',
          unit: materialMap?.[entry?.material_id]?.unit || entry?.unit || '',
          received: Number(entry?.received_quantity || 0),
          consumed: Number(entry?.consumed_quantity || 0),
          date: entry?.date ? String(entry.date).split('T')[0] : ''
        }));

        setMaterialEntries(merged);
      } catch (e) {
        console.error('[Inventory] fetchMaterialData error:', e);
        setMaterialEntries([]);
      }
    };
    fetchMaterialData();
  }, [selectedProject?.id]);

  // State for item details modal
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);

  // State for update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItemForUpdate, setSelectedItemForUpdate] = useState(null);

  // State for add particular modal
  const [showAddParticularModal, setShowAddParticularModal] = useState(false);

  // Add state for fetched daily report data
  const [fetchedParticularData, setFetchedParticularData] = useState(null);

  // Add this state to track all particulars
  const [allParticulars, setAllParticulars] = useState(() => {
    // Try to load from localStorage for persistence
    const saved = localStorage.getItem('allParticulars');
    return saved ? JSON.parse(saved) : [];
  });

  // Update localStorage whenever allParticulars changes
  React.useEffect(() => {
    localStorage.setItem('allParticulars', JSON.stringify(allParticulars));
  }, [allParticulars]);

  // Add state for selected particular
  const [selectedParticular, setSelectedParticular] = useState(null);
  const [selectedTrackingItem, setSelectedTrackingItem] = useState(null);

  // Add at the top of the Inventory component
  const [showConsumeModal, setShowConsumeModal] = useState(false);
  const [consumeForm, setConsumeForm] = useState({ quantity: '', date: '' });
  const [consumeError, setConsumeError] = useState('');

  // State for material analytics modal
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedMaterialForAnalytics, setSelectedMaterialForAnalytics] = useState(null);

  // Function to generate next DR number
  const getNextDRNumber = () => {
    // Get all existing DR numbers
    const existingDRs = appData.dailyReport.entries
      .map(entry => entry.drNo)
      .filter(drNo => drNo && drNo.startsWith('DR'))
      .map(drNo => {
        const num = parseInt(drNo.replace('DR', ''));
        return isNaN(num) ? 0 : num;
      });

    // Find the highest number
    const maxDR = Math.max(0, ...existingDRs);

    // Generate next number, zero-padded to 3 digits
    return `DR${(maxDR + 1).toString().padStart(3, '0')}`;
  };

  // Modify the newParticular state to include auto-generated DR number
  const [newParticular, setNewParticular] = useState({
    drNo: getNextDRNumber(),
    particulars: "",
    date: new Date().toISOString().split('T')[0],
    amount: "",
    paid: "",
    balance: "",
    remarks: ""
  });

  // Memoize expensive calculations
  const { transactions, totalAmount, totalPaid, totalBalance, paymentPercentage, balancePercentage } = useMemo(() => {
    const aggregated = appData.dailyReport.entries.reduce((acc, entry) => {
      const key = entry.particulars.toLowerCase();

      if (!acc[key]) {
        acc[key] = {
          particulars: entry.particulars,
          totalAmount: 0,
          totalPaid: 0,
          totalBalance: 0,
          transactions: []
        };
      }

      acc[key].totalAmount += entry.amount;
      acc[key].totalPaid += entry.paid;
      acc[key].totalBalance += entry.balance;
      acc[key].transactions.push(entry);

      return acc;
    }, {});

    const transactions = Object.values(aggregated);
    const totalAmount = transactions.reduce((sum, item) => sum + item.totalAmount, 0);
    const totalPaid = transactions.reduce((sum, item) => sum + item.totalPaid, 0);
    const totalBalance = transactions.reduce((sum, item) => sum + item.totalBalance, 0);

    return {
      transactions,
      totalAmount,
      totalPaid,
      totalBalance,
      paymentPercentage: totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0,
      balancePercentage: totalAmount > 0 ? Math.round((totalBalance / totalAmount) * 100) : 0
    };
  }, [appData.dailyReport.entries]);

  const monthlyData = useMemo(() => {
    const data = {};
    appData.dailyReport.entries.forEach(item => {
      const date = new Date(item.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

      if (!data[monthYear]) {
        data[monthYear] = {
          amount: 0,
          paid: 0,
          balance: 0
        };
      }

      data[monthYear].amount += item.amount;
      data[monthYear].paid += item.paid;
      data[monthYear].balance += item.balance;
    });

    return Object.entries(data).map(([month, values]) => ({
      month,
      ...values
    }));
  }, [appData.dailyReport.entries]);

  const itemCounts = useMemo(() => {
    const counts = {};
    appData.dailyReport.entries.forEach(item => {
      counts[item.particulars] = (counts[item.particulars] || 0) + 1;
    });
    return counts;
  }, [appData.dailyReport.entries]);

  // Get unique particulars from REAL material tracking entries (not daily report)
  const uniqueParticulars = useMemo(() => {
    const materialsMap = new Map();

    materialEntries.forEach(entry => {
      if (entry.particulars && entry.particulars.trim() !== "") {
        const particular = entry.particulars.trim();
        const key = particular.toLowerCase();

        if (!materialsMap.has(key)) {
          materialsMap.set(key, {
            name: particular,
            totalReceived: 0,
            totalConsumed: 0,
            unit: entry.unit || '-',
            transactions: []
          });
        }

        const material = materialsMap.get(key);
        material.totalReceived += Number(entry.received) || 0;
        material.totalConsumed += Number(entry.consumed) || 0;
        material.transactions.push(entry);

        // Use the most recent unit if available
        if (entry.unit && entry.unit !== '-') {
          material.unit = entry.unit;
        }
      }
    });

    return Array.from(materialsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [materialEntries]);

  // Function to handle clicking on particulars
  const handleParticularsClick = (transaction) => {
    setSelectedItemDetails(transaction);
    setShowItemDetailsModal(true);
  };

  // Get transactions for a particular from REAL material tracking entries
  const getTransactionsForParticular = (particular) => {
    return materialEntries.filter(entry =>
      entry.particulars.toLowerCase() === particular.toLowerCase()
    );
  };

  // Handler to open modal
  const handleOpenConsumeModal = () => {
    setConsumeForm({ quantity: '', date: '' });
    setConsumeError('');
    setShowConsumeModal(true);
  };

  // Handler to submit consumed entry — PRODUCTION: saves to API
  const handleConsumeSubmit = async () => {
    const quantity = Number(consumeForm.quantity);
    const date = consumeForm.date;

    if (!quantity || quantity <= 0) {
      setConsumeError('Please enter a valid consumed quantity.');
      return;
    }

    if (!date) {
      setConsumeError('Please select a date.');
      return;
    }

    // Prevent negative stock
    const txns = getTransactionsForParticular(selectedParticular);
    const totalReceived = txns.reduce((sum, t) => sum + (Number(t.received) || 0), 0);
    const totalConsumed = txns.reduce((sum, t) => sum + (Number(t.consumed) || 0), 0);
    const remaining = totalReceived - totalConsumed;

    if (quantity > remaining) {
      setConsumeError('Consumed quantity cannot exceed remaining stock.');
      return;
    }

    // Prevent consuming before any received date
    const receivedDates = txns.filter(t => Number(t.received) > 0 && t.date).map(t => new Date(t.date));
    if (receivedDates.length === 0) {
      setConsumeError('Cannot consume before any stock is received.');
      return;
    }

    const minReceivedDate = new Date(Math.min(...receivedDates.map(d => d.getTime())));
    const consumeDate = new Date(date);
    if (consumeDate < minReceivedDate) {
      setConsumeError(`Consumed date cannot be before first received date (${minReceivedDate.toLocaleDateString()}).`);
      return;
    }

    // Add new consumed entry for this particular
    const newEntry = {
      no: Date.now().toString(),
      drNo: '-',
      particulars: selectedParticular,
      date,
      received: 0,
      consumed: quantity,
      unit: (txns[0] && txns[0].unit) || '-',
      remarks: 'Consumed entry',
    };

    try {
      // PRODUCTION: save to API
      await dailyReportService.create({
        project_id: selectedProject?.id ?? null,
        material_id: null,
        material_dr_number: '-',
        particulars: selectedParticular,
        date,
        amount: 0,
        paid: 0,
        balance: 0,
        units: (txns[0] && txns[0].unit) || '-',
        quantity,
        remarks: 'Consumed entry'
      });

      // Keep local context in sync
      if (typeof updateDailyReport === 'function') {
        updateDailyReport({ ...newEntry, isNew: true });
      }
      showSuccess('Consumed entry added successfully');
    } catch (e) {
      console.error('[Inventory] handleConsumeSubmit error:', e);
      showError('Failed to save consumed entry. Please try again.');
      return;
    }

    setShowConsumeModal(false);
  };

  // Handler to open analytics modal
  const handleOpenAnalytics = (materialName) => {
    const material = uniqueParticulars.find(m => m.name === materialName);
    if (material) {
      setSelectedMaterialForAnalytics(material);
      setShowAnalytics(true);
    }
  };

  // Handler to close analytics modal
  const handleCloseAnalytics = () => {
    setShowAnalytics(false);
    setSelectedMaterialForAnalytics(null);
  };

  // Function to render circular progress
  const renderCircularProgress = (percentage, color = "red") => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const colorClasses = {
      red: "stroke-red-500",
      pink: "stroke-red-500",
      blue: "stroke-[#7BAFD4]",
    };

    return (
      <svg className="w-16 h-16 sm:w-20 sm:h-20" viewBox="0 0 100 100">
        <circle
          className="stroke-white fill-none opacity-30"
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="10"
        />
        <circle
          className={`fill-none ${colorClasses[color]}`}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
    );
  };

  // Function to render bar chart
  const renderBarChart = () => {
    if (monthlyData.length === 0) {
      return <div className="text-white text-center py-10">No data available</div>;
    }

    const maxValue = Math.max(
      ...monthlyData.map(data => Math.max(data.amount, data.paid))
    );

    return (
      <div className="flex h-40 items-end justify-between space-x-0.5 sm:space-x-1 px-1 sm:px-2 overflow-x-auto">
        {monthlyData.map((data, index) => (
          <div key={index} className="flex flex-col items-center flex-shrink-0">
            <div className="flex space-x-0.5 sm:space-x-1">
              <div
                className="w-2 sm:w-3 md:w-4 bg-red-500 rounded-t-sm"
                style={{
                  height: `${(data.amount / maxValue) * 100}%`,
                  minHeight: '8px'
                }}
              ></div>
              <div
                className="w-2 sm:w-3 md:w-4 bg-red-400 rounded-t-sm"
                style={{
                  height: `${(data.paid / maxValue) * 100}%`,
                  minHeight: '8px'
                }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">{data.month}</div>
          </div>
        ))}
      </div>
    );
  };

  // Function to group and sort transactions by particulars
  const getGroupedTransactions = () => {
    const grouped = appData.dailyReport.entries.reduce((acc, entry) => {
      const key = entry.particulars.toLowerCase();
      if (!acc[key]) {
        acc[key] = {
          drNo: entry.drNo || '-',
          particulars: entry.particulars,
          date: entry.date,
          amount: entry.amount,
          paid: entry.paid,
          balance: entry.balance,
          transactions: [entry]
        };
      } else {
        // Update the aggregated values
        acc[key].amount += entry.amount;
        acc[key].paid += entry.paid;
        acc[key].balance += entry.balance;
        acc[key].transactions.push(entry);

        // Keep track of the latest transaction date and DR number
        const currentDate = new Date(entry.date);
        const existingDate = new Date(acc[key].date);
        if (currentDate > existingDate) {
          acc[key].date = entry.date;
          acc[key].drNo = entry.drNo || '-';
        }
      }
      return acc;
    }, {});

    // Convert to array and sort by date (most recent first)
    return Object.values(grouped).sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );
  };

  // Handle export to Excel
  const handleExportToExcel = () => {
    try {
      // Create worksheet from transactions data
      const ws = XLSX.utils.json_to_sheet(transactions.map(item => ({
        'Particulars': item.particulars,
        'Total Amount (₹)': item.totalAmount,
        'Total Paid (₹)': item.totalPaid,
        'Total Balance (₹)': item.totalBalance,
        'Payment %': `${Math.round((item.totalPaid / item.totalAmount) * 100)}%`,
        'Balance %': `${Math.round((item.totalBalance / item.totalAmount) * 100)}%`
      })));

      // Add total row
      XLSX.utils.sheet_add_aoa(ws, [
        ['Total', totalAmount, totalPaid, totalBalance, `${paymentPercentage}%`, `${balancePercentage}%`]
      ], { origin: -1 });

      // Set column widths
      ws['!cols'] = [
        { wch: 20 }, // Particulars
        { wch: 18 }, // Total Amount (₹)
        { wch: 18 }, // Total Paid (₹)
        { wch: 18 }, // Total Balance (₹)
        { wch: 12 }, // Payment %
        { wch: 12 }  // Balance %
      ];

      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Inventory');

      // Generate Excel file
      XLSX.writeFile(wb, 'inventory_report.xlsx');
      showSuccess('Inventory data exported successfully!');
    } catch (error) {
      showInfo('Error exporting data to Excel. Please try again.');
      console.error('Export error:', error);
    }
  };

  // Add function to handle update button click
  const handleUpdateClick = (item) => {
    setSelectedItemForUpdate(item);
    setShowUpdateModal(true);
  };

  // Add function to handle update submission
  const handleUpdateSubmit = async (updatedData) => {
    try {
      // Update the item in the appData context
      const updatedEntries = appData.dailyReport.entries.map(entry => {
        if (entry.particulars === selectedItemForUpdate.particulars) {
          return { ...entry, ...updatedData };
        }
        return entry;
      });

      // Update the context with new data
      await updateDailyReport({
        ...updatedData,
        isNew: false,
        entries: updatedEntries
      });

      showSuccess("Item updated successfully");
      setShowUpdateModal(false);
      setSelectedItemForUpdate(null);
    } catch (error) {
      console.error('Error updating item:', error);
      showError("Failed to update item");
    }
  };

  // Add function to handle adding new particular — PRODUCTION: saves to API
  const handleAddParticular = async (formData) => {
    try {
      // Validate required fields
      if (!formData.particulars || !formData.date || !formData.amount) {
        showError("Please fill in all required fields (Particulars, Date, and Amount)");
        return;
      }

      // Validate numeric fields
      const amount = parseFloat(formData.amount);
      const paid = parseFloat(formData.paid) || 0;

      if (isNaN(amount) || amount <= 0) {
        showError("Amount must be a positive number");
        return;
      }

      if (isNaN(paid) || paid < 0) {
        showError("Paid amount must be a non-negative number");
        return;
      }

      if (paid > amount) {
        showError("Paid amount cannot be greater than the total amount");
        return;
      }

      // Calculate balance
      const balance = amount - paid;

      // PRODUCTION: save to API first
      await dailyReportService.create({
        project_id: selectedProject?.id ?? null,
        material_id: null,
        material_dr_number: formData.drNo || getNextDRNumber(),
        particulars: formData.particulars,
        date: formData.date,
        amount,
        paid,
        balance,
        units: formData.unit || '',
        quantity: formData.quantity || 0,
        remarks: formData.remarks || ''
      });

      // Keep local context in sync
      const newEntry = {
        ...formData,
        amount,
        paid,
        balance,
        drNo: formData.drNo || getNextDRNumber(),
        isNew: true
      };
      await updateDailyReport(newEntry);

      showSuccess("New particular added successfully");
      setShowAddParticularModal(false);
      setNewParticular({
        drNo: getNextDRNumber(),
        particulars: "",
        date: new Date().toISOString().split('T')[0],
        amount: "",
        paid: "",
        balance: "",
        remarks: ""
      });
    } catch (error) {
      console.error('Error adding particular:', error);
      showError(error.message || "Failed to add particular. Please try again.");
    }
  };

  // Helper to compute analytics for a particular
  const getAnalyticsForParticular = (particular) => {
    const txns = getTransactionsForParticular(particular);
    let totalReceived = 0, totalConsumed = 0;
    txns.forEach(txn => {
      if (txn.received) totalReceived += Number(txn.received);
      if (txn.consumed) totalConsumed += Number(txn.consumed);
      // fallback for amount/paid if used
      if (txn.amount && !txn.received) totalReceived += Number(txn.amount);
      if (txn.paid && !txn.consumed) totalConsumed += Number(txn.paid);
    });
    const totalEstimated = 100; // TODO: Replace with actual estimate if available
    const remaining = totalReceived - totalConsumed;
    return { totalReceived, totalConsumed, totalEstimated, remaining };
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={Package} />
      <section className="w-full px-2 sm:px-4 lg:px-6 mx-0 sm:mx-2 max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200 mb-4">
          <div className="flex flex-wrap space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("Material Tracking List")}
              className={`py-2 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === "Material Tracking List"
                  ? "border-[#7BAFD4] text-[#7BAFD4]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Material Tracking List
            </button>
            <button
              onClick={() => setActiveTab("Material Flow")}
              className={`py-2 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${activeTab === "Material Flow"
                  ? "border-[#7BAFD4] text-[#7BAFD4]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              Material Flow
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "Material Flow" && (
          <div className="p-3 sm:p-4 md:p-6">
            {/* Material List or Detail View */}
            {!selectedParticular ? (
              <div>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg">
                    <h4 className="text-sm font-medium opacity-90">Total Materials</h4>
                    <p className="text-2xl font-bold">{uniqueParticulars.length}</p>
                    <p className="text-xs opacity-75">Different material types</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow-lg">
                    <h4 className="text-sm font-medium opacity-90">Active Materials</h4>
                    <p className="text-2xl font-bold">
                      {uniqueParticulars.filter(m => m.totalReceived > 0).length}
                    </p>
                    <p className="text-xs opacity-75">Materials with stock received</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-lg">
                    <h4 className="text-sm font-medium opacity-90">Low Stock Items</h4>
                    <p className="text-2xl font-bold">
                      {uniqueParticulars.filter(m => {
                        const remaining = m.totalReceived - m.totalConsumed;
                        return remaining > 0 && remaining <= m.totalReceived * 0.2;
                      }).length}
                    </p>
                    <p className="text-xs opacity-75">Items with ≤20% stock left</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Material Flow Overview</h3>
                    <p className="text-sm text-gray-600">Click a material to view detailed flow analysis and records.</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">NO.</th>
                          <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Particulars</th>
                          <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Unit</th>
                          <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Total Received</th>
                          <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Total Consumed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {uniqueParticulars.map((material, idx) => {
                          const remaining = material.totalReceived - material.totalConsumed;
                          return (
                            <tr
                              key={material.name}
                              className="text-sm text-[#4A5568] hover:bg-gray-50"
                            >
                              <td className="px-6 py-4">{String(idx + 1).padStart(2, '0')}</td>
                              <td className="px-6 py-4">
                                <div
                                  className="cursor-pointer"
                                  onClick={() => setSelectedParticular(material.name)}
                                >
                                  <span className="text-[#7BAFD4] hover:text-[#6B9FD4] font-medium">{material.name}</span>
                                  <div className="text-xs text-gray-500 mt-1">
                                    Remaining: {remaining} {material.unit}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">{material.unit}</td>
                              <td className="px-6 py-4">
                                <span className="font-medium text-green-600">{material.totalReceived}</span> {material.unit}
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-medium text-red-600">{material.totalConsumed}</span> {material.unit}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              // If a particular is selected, show detailed view matching the design
              <div>
                {/* Header with Back button and Add Consumed Entry button */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    className="bg-[#7BAFD4] hover:bg-[#6B9FD4] text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                    onClick={() => setSelectedParticular(null)}
                  >
                    ← Back to List
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                    onClick={handleOpenConsumeModal}
                  >
                    + Add Consumed Entry
                  </button>
                </div>

                {/* Consume Modal */}
                {showConsumeModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                      <h3 className="text-lg font-semibold mb-4">Add Consumed Quantity</h3>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Consumed Quantity</label>
                        <input
                          type="number"
                          value={consumeForm.quantity}
                          onChange={(e) => setConsumeForm(f => ({ ...f, quantity: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          min="1"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Date</label>
                        <input
                          type="date"
                          value={consumeForm.date}
                          onChange={(e) => setConsumeForm(f => ({ ...f, date: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      {consumeError && (
                        <div className="mb-4 text-red-500 text-sm">{consumeError}</div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={handleConsumeSubmit}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setShowConsumeModal(false)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Responsive Layout: 30% Stats, 70% Table */}
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Compact Stats Section - 30% */}
                  <div className="lg:w-[30%] w-full">
                    {(() => {
                      const txns = getTransactionsForParticular(selectedParticular);
                      const totalReceived = txns.reduce((sum, t) => sum + (Number(t.received) || 0), 0);
                      const totalConsumed = txns.reduce((sum, t) => sum + (Number(t.consumed) || 0), 0);
                      const unit = txns.length > 0 && txns[0].unit ? txns[0].unit : 'bags';
                      const remaining = totalReceived - totalConsumed;

                      const consumedPercentage = totalReceived > 0 ? Math.round((totalConsumed / totalReceived) * 100) : 0;
                      const remainingPercentage = totalReceived > 0 ? Math.round((remaining / totalReceived) * 100) : 0;

                      return (
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Material Overview</h3>

                          {/* Compact Stats Cards */}
                          <div className="space-y-3 mb-4">
                            <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs font-medium text-blue-600 uppercase">Received</p>
                                  <p className="text-xl font-bold text-blue-700">{totalReceived}</p>
                                  <p className="text-xs text-blue-500">{unit}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-bold">R</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-pink-50 rounded-lg p-3 border-l-4 border-pink-500">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs font-medium text-pink-600 uppercase">Consumed</p>
                                  <p className="text-xl font-bold text-pink-700">{totalConsumed}</p>
                                  <p className="text-xs text-pink-500">{unit}</p>
                                </div>
                                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                  <span className="text-pink-600 font-bold">C</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs font-medium text-green-600 uppercase">Remaining</p>
                                  <p className="text-xl font-bold text-green-700">{remaining}</p>
                                  <p className="text-xs text-green-500">{unit}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-green-600 font-bold">S</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-600 mb-2">
                              <span>Usage Progress</span>
                              <span>{consumedPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-pink-400 to-pink-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${consumedPercentage}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Simple Bar Chart */}
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Stock Distribution</p>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <div className="w-16 text-xs text-gray-600">Consumed</div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                                  <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${consumedPercentage}%` }}></div>
                                </div>
                                <div className="w-8 text-xs text-gray-600">{consumedPercentage}%</div>
                              </div>
                              <div className="flex items-center">
                                <div className="w-16 text-xs text-gray-600">Remaining</div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${remainingPercentage}%` }}></div>
                                </div>
                                <div className="w-8 text-xs text-gray-600">{remainingPercentage}%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Table Section - 70% */}
                  <div className="lg:w-[70%] w-full">

                    {/* Quantity Transaction Details Table */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Quantity Transaction Details</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-2 sm:px-3 py-2 text-xs font-semibold text-[#2C3E50]">No.</th>
                              <th className="px-2 sm:px-3 py-2 text-xs font-semibold text-[#2C3E50] hidden sm:table-cell">DR No.</th>
                              <th className="px-2 sm:px-3 py-2 text-xs font-semibold text-[#2C3E50]">Item Name</th>
                              <th className="px-2 sm:px-3 py-2 text-xs font-semibold text-[#2C3E50] hidden md:table-cell">Date</th>
                              <th className="px-2 sm:px-3 py-2 text-xs font-semibold text-[#2C3E50]">Received</th>
                              <th className="px-2 sm:px-3 py-2 text-xs font-semibold text-[#2C3E50]">Used</th>
                              <th className="px-2 sm:px-3 py-2 text-xs font-semibold text-[#2C3E50]">Remaining</th>
                              <th className="px-2 sm:px-3 py-2 text-xs font-semibold text-[#2C3E50] hidden lg:table-cell">Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {(() => {
                              const txns = getTransactionsForParticular(selectedParticular);
                              return txns.map((txn, idx) => {
                                const received = Number(txn.received) || 0;
                                const used = Number(txn.consumed) || 0;

                                // Calculate running remaining quantity
                                const prevTxns = txns.slice(0, idx);
                                const prevReceived = prevTxns.reduce((sum, t) => sum + (Number(t.received) || 0), 0);
                                const prevUsed = prevTxns.reduce((sum, t) => sum + (Number(t.consumed) || 0), 0);
                                const runningRemaining = prevReceived + received - (prevUsed + used);
                                const unit = txn.unit || (txns[0] && txns[0].unit) || 'bags';

                                return (
                                  <tr key={idx} className="text-xs text-[#4A5568] hover:bg-gray-50">
                                    <td className="px-2 sm:px-3 py-2">{String(idx + 1).padStart(2, '0')}</td>
                                    <td className="px-2 sm:px-3 py-2 hidden sm:table-cell">{txn.drNo || `DR${String(idx + 1).padStart(3, '0')}`}</td>
                                    <td className="px-2 sm:px-3 py-2">{txn.particulars}</td>
                                    <td className="px-2 sm:px-3 py-2 hidden md:table-cell">{txn.date}</td>
                                    <td className="px-2 sm:px-3 py-2">{received} {unit}</td>
                                    <td className="px-2 sm:px-3 py-2">{used} {unit}</td>
                                    <td className="px-2 sm:px-3 py-2">{runningRemaining} {unit}</td>
                                    <td className="px-2 sm:px-3 py-2 hidden lg:table-cell">{txn.remarks || (received > 0 ? 'Received from supplier' : used > 0 ? 'Old cement' : '-')}</td>
                                  </tr>
                                );
                              });
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Material Tracking List Tab */}
        {activeTab === "Material Tracking List" && (
          <div className="p-3 sm:p-4 md:p-6">
            {/* If no item is selected, show the list */}
            {!selectedTrackingItem ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Material Tracking List</h3>
                  </div>
                  <button
                    onClick={() => setShowAddParticularModal(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <Plus size={20} />
                    <span>Add Particular</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">NO.</th>
                        <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Particulars</th>
                        <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Date</th>
                        <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Amount (₹)</th>
                        <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Paid (₹)</th>
                        <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Balance (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {getGroupedTransactions().map((item, idx) => (
                        <tr
                          key={item.particulars}
                          className="text-sm hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedTrackingItem(item)}
                        >
                          <td className="px-6 py-4">{String(idx + 1).padStart(2, '0')}</td>
                          <td className="px-6 py-4">
                            <span
                              className="text-[#7BAFD4] hover:text-[#6B9FD4] cursor-pointer font-medium"
                              onClick={() => setSelectedTrackingItem(item)}
                            >
                              {item.particulars}
                            </span>
                          </td>
                          <td className="px-6 py-4">{item.date}</td>
                          <td className="px-6 py-4">{formatINR(item.amount)}</td>
                          <td className="px-6 py-4">{formatINR(item.paid)}</td>
                          <td className="px-6 py-4">{formatINR(item.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // If an item is selected, show analytics and transaction table for that item
              <div className="bg-white min-h-screen">
                {/* Header with Back Button */}
                <div className="px-6 py-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center gap-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                      onClick={() => setSelectedTrackingItem(null)}
                    >
                      ← Back to List
                    </button>
                  </div>
                </div>

                {/* Responsive Layout: 30% Stats, 70% Table */}
                <div className="flex flex-col lg:flex-row gap-6 p-4">
                  {/* Compact Financial Stats Section - 30% */}
                  <div className="lg:w-[30%] w-full">
                    {(() => {
                      const txns = getTransactionsForParticular(selectedTrackingItem.particulars);
                      const totalAmount = txns.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
                      const totalPaid = txns.reduce((sum, t) => sum + (Number(t.paid) || 0), 0);
                      const totalBalance = txns.reduce((sum, t) => sum + (Number(t.balance) || 0), 0);
                      const paymentPercentage = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;
                      const balancePercentage = totalAmount > 0 ? Math.round((totalBalance / totalAmount) * 100) : 0;

                      return (
                        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h3>

                          {/* Compact Financial Cards */}
                          <div className="space-y-3 mb-4">
                            <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs font-medium text-blue-600 uppercase">Required</p>
                                  <p className="text-xl font-bold text-blue-700">{formatINR(totalAmount)}</p>
                                  <p className="text-xs text-blue-500">Total Amount</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-blue-600 font-bold">R</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs font-medium text-green-600 uppercase">Paid</p>
                                  <p className="text-xl font-bold text-green-700">{formatINR(totalPaid)}</p>
                                  <p className="text-xs text-green-500">{paymentPercentage}% Complete</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-green-600 font-bold">P</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-red-50 rounded-lg p-3 border-l-4 border-red-500">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs font-medium text-red-600 uppercase">Pending</p>
                                  <p className="text-xl font-bold text-red-700">{formatINR(totalBalance)}</p>
                                  <p className="text-xs text-red-500">{balancePercentage}% Remaining</p>
                                </div>
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                  <span className="text-red-600 font-bold">B</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Payment Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-600 mb-2">
                              <span>Payment Progress</span>
                              <span>{paymentPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${paymentPercentage}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Simple Financial Chart */}
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Payment Distribution</p>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <div className="w-12 text-xs text-gray-600">Paid</div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${paymentPercentage}%` }}></div>
                                </div>
                                <div className="w-8 text-xs text-gray-600">{paymentPercentage}%</div>
                              </div>
                              <div className="flex items-center">
                                <div className="w-12 text-xs text-gray-600">Pending</div>
                                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${balancePercentage}%` }}></div>
                                </div>
                                <div className="w-8 text-xs text-gray-600">{balancePercentage}%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Table Section - 70% */}
                  <div className="lg:w-[70%] w-full">

                    {/* Transaction Table Section */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <h5 className="text-lg font-semibold text-gray-900">Transaction Details</h5>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Item No.</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">DR No.</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Item Name</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Date</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Amount (₹)</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Paid (₹)</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Pending (₹)</th>
                              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Remarks</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {getTransactionsForParticular(selectedTrackingItem.particulars).map((txn, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-3 text-sm text-gray-900 border-b border-gray-100">{String(idx + 1).padStart(2, '0')}</td>
                                <td className="px-6 py-3 text-sm text-gray-900 border-b border-gray-100">{txn.drNo || `DR${String(idx + 1).padStart(3, '0')}`}</td>
                                <td className="px-6 py-3 text-sm text-gray-900 border-b border-gray-100">{txn.particulars}</td>
                                <td className="px-6 py-3 text-sm text-gray-900 border-b border-gray-100">{txn.date}</td>
                                <td className="px-6 py-3 text-sm font-medium text-gray-900 border-b border-gray-100">{formatINR(txn.amount)}</td>
                                <td className="px-6 py-3 text-sm font-medium text-gray-900 border-b border-gray-100">{formatINR(txn.paid)}</td>
                                <td className="px-6 py-3 text-sm font-medium text-gray-900 border-b border-gray-100">{formatINR(txn.balance)}</td>
                                <td className="px-6 py-3 text-sm text-gray-600 border-b border-gray-100">{txn.remarks || 'Received from supplier'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Item Details Modal */}
      <ItemDetailsModal
        isOpen={showItemDetailsModal}
        onClose={() => setShowItemDetailsModal(false)}
        itemDetails={selectedItemDetails}
      />

      {/* Update Item Modal */}
      <ItemDetailsModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedItemForUpdate(null);
        }}
        itemDetails={selectedItemForUpdate}
        isUpdate={true}
        onSubmit={handleUpdateSubmit}
      />

      {/* Add Particular Modal */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showAddParticularModal ? '' : 'hidden'}`}>
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-[#2C3E50]">Add New Particular</h2>
              <p className="text-sm text-gray-600">Enter the name for the new particular. It will appear in the Material Flow list once it is added to the Daily Report.</p>
            </div>
            <button
              onClick={() => setShowAddParticularModal(false)}
              className="p-2 text-[#7C8CA1] hover:text-[#2C3E50] hover:bg-gray-50 rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={e => {
            e.preventDefault();
            if (!newParticular.particulars.trim()) {
              showError('Please enter a particular name.');
              return;
            }
            // Add to allParticulars if not already present
            if (!allParticulars.some(p => p.particulars.toLowerCase() === newParticular.particulars.toLowerCase())) {
              setAllParticulars([
                ...allParticulars,
                { drNo: getNextDRNumber(), particulars: newParticular.particulars }
              ]);
            }
            setShowAddParticularModal(false);
            showSuccess('Particular name added! Now add it to the Daily Report to see full details.');
            setNewParticular({ ...newParticular, particulars: '' });
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Particular Name</label>
              <input
                type="text"
                value={newParticular.particulars}
                onChange={e => setNewParticular({ ...newParticular, particulars: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7BAFD4]"
                required
                placeholder="Enter new particular name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddParticularModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2"
              >
                <XCircle size={16} />
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#7BAFD4] hover:bg-[#6B9FD4] rounded-md flex items-center gap-2"
              >
                <Plus size={16} />
                Add Particular
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Material Analytics Modal */}
      {showAnalytics && selectedMaterialForAnalytics && (
        <MaterialAnalytics
          material={selectedMaterialForAnalytics}
          onClose={handleCloseAnalytics}
        />
      )}
    </>
  );
};

export default Inventory;