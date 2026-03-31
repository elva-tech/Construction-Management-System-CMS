import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation, useParams } from "react-router-dom";
import { Coins, Calendar, Users, CheckCircle, Info, Copy, Trash2, Download, Edit2, AlertCircle, X } from "lucide-react";
import { useLabour } from "../context/LabourContext";
import { useToast } from "../context/ToastContext";
import WeekDetailsModal from "../Components/WeekDetailsModal";
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import DeleteVerificationDialog from "../Components/DeleteVerificationDialog";
import labourPaymentService from "../services/labourPaymentService";
import { useProject } from "../context/ProjectContext";

const LabourPayment = () => {
  const location = useLocation();
  const { projectId } = useParams();
  const { selectedProject } = useProject();
  const {
    currentWeekData,
    updateDailyData,
    completeWeek,
    isWeekComplete,
    labourPaymentData,
    hasDayEntry
  } = useLabour();
  const { showSuccess, showInfo, showError } = useToast();

  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState("");

  const emptyBreakdown = {
    Monday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, miscAmount: 0, amount: 0, isSaved: false },
    Tuesday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, miscAmount: 0, amount: 0, isSaved: false },
    Wednesday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, miscAmount: 0, amount: 0, isSaved: false },
    Thursday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, miscAmount: 0, amount: 0, isSaved: false },
    Friday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, miscAmount: 0, amount: 0, isSaved: false },
    Saturday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, miscAmount: 0, amount: 0, isSaved: false },
    Sunday: { headMason: 0, mason: 0, mHelper: 0, wHelper: 0, miscAmount: 0, amount: 0, isSaved: false }
  };

  const mapApiPaymentToWeek = (row, idx) => {
    const date = row?.date ? String(row.date).split("T")[0] : "";
    const totalAmount = Number(row?.labour_amount ?? row?.net_amount ?? row?.cumulative_amount ?? 0);
    return {
      id: row?.id ?? idx,
      weekNumber: row?.id ?? (idx + 1),
      startDate: date || "-",
      endDate: date || "-",
      totalDays: 0,
      totalAmount,
      status: "Completed",
      remarks: row?.remarks ?? "-",
      dailyBreakdown: row?.dailyBreakdown || emptyBreakdown,
      completedDate: date || "-"
    };
  };

  const fetchPayments = async () => {
    setPaymentsLoading(true);
    setPaymentsError("");
    try {
      const res = await labourPaymentService.getAll(selectedProject?.id);
      const rows = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setPayments(rows.map(mapApiPaymentToWeek));
    } catch (e) {
      console.error("Failed to fetch labour payments:", e);
      setPaymentsError(e?.message || "Failed to load payments");
    } finally {
      setPaymentsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject?.id]);

  // Reorder days to start from Monday
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [showZeroStaffModal, setShowZeroStaffModal] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showWeekProgress, setShowWeekProgress] = useState(false);
  const [showWeekDetails, setShowWeekDetails] = useState(false);
  const [dayFormData, setDayFormData] = useState({
    headMason: 0,
    mason: 0,
    mHelper: 0,
    wHelper: 0,
    miscAmount: 0,
    remarks: '',
    isSaved: false
  });

  // Toast notifications
  const showSuccessToast = (message) => toast.success(message);
  const showInfoToast = (message) => toast.info(message);
  const showWarningToast = (message) => toast.warning(message);

  // Load data for selected day
  const loadDayData = (day) => {
    const dayData = currentWeekData.dailyData[day];
    setDayFormData(dayData);
  };

  // Handle day selection
  const handleDaySelect = (day) => {
    const dayData = currentWeekData.dailyData[day];
    if (dayData.isSaved) {
      setShowEditConfirm(true);
    }
    setSelectedDay(day);
    loadDayData(day);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setDayFormData(prev => ({
      ...prev,
      [field]: field.includes('Mason') || field.includes('Helper') ? parseInt(value) || 0 : value
    }));
  };

  // Clear day data
  const handleClearDay = () => {
    if (currentWeekData.dailyData[selectedDay].amount > 0) {
      setShowConfirmClear(true);
      return;
    }
    clearDayData();
  };

  const clearDayData = () => {
    const emptyData = {
      headMason: 0,
      mason: 0,
      mHelper: 0,
      wHelper: 0,
      miscAmount: 0,
      remarks: '',
      isSaved: false
    };
    setDayFormData(emptyData);
    updateDailyData(selectedDay, emptyData);
    showInfoToast(`${selectedDay}'s data has been cleared.`);
    setShowConfirmClear(false);
  };

  // Copy previous day's data
  const handleCopyPreviousDay = () => {
    const currentDayIndex = days.indexOf(selectedDay);
    if (currentDayIndex > 0) {
      const previousDay = days[currentDayIndex - 1];
      const previousData = currentWeekData.dailyData[previousDay];
      
      if (previousData.amount > 0) {
        setDayFormData({
          headMason: previousData.headMason,
          mason: previousData.mason,
          mHelper: previousData.mHelper,
          wHelper: previousData.wHelper,
          miscAmount: previousData.miscAmount,
          remarks: `Copied from ${previousDay}`
        });
        showInfoToast(`Data copied from ${previousDay}.`);
      } else {
        showError("This is the first day of the week. Nothing to copy from.");
      }
    } else {
      showError("This is the first day of the week. Nothing to copy from.");
    }
  };

  // Calculate daily amount
  const calculateDailyAmount = (headMason, mason, mHelper, wHelper, miscAmount = 0) => {
    const rates = {
      headMason: 800,
      mason: 800,
      mHelper: 600,
      wHelper: 600
    };

    return (
      headMason * rates.headMason +
      mason * rates.mason +
      mHelper * rates.mHelper +
      wHelper * rates.wHelper +
      (parseInt(miscAmount) || 0)
    );
  };

  // Save daily data
  const saveDayData = () => {
    const totalStaff = dayFormData.headMason + dayFormData.mason + dayFormData.mHelper + dayFormData.wHelper;
    
    if (totalStaff === 0 && !dayFormData.miscAmount) {
      setShowZeroStaffModal(true);
      return;
    }

    proceedWithSave(totalStaff);
  };

  // Proceed with saving data
  const proceedWithSave = (totalStaff) => {
    const updatedDayData = { 
      ...dayFormData, 
      isSaved: true 
    };
    updateDailyData(selectedDay, updatedDayData);
    showSuccess(`${selectedDay}'s data saved successfully`);
    
    // Calculate total amount for the day
    const dayAmount = calculateDailyAmount(
      dayFormData.headMason,
      dayFormData.mason,
      dayFormData.mHelper,
      dayFormData.wHelper,
      dayFormData.miscAmount
    );
    
    // Show detailed toast
    showInfo(`Day Total: ₹${dayAmount} | Staff: ${totalStaff} | Misc: ₹${dayFormData.miscAmount || 0}`);

    setShowZeroStaffModal(false);
    setShowEditConfirm(false);

    // Auto-select next day if available
    const currentDayIndex = days.indexOf(selectedDay);
    if (currentDayIndex < days.length - 1) {
      const nextDay = days[currentDayIndex + 1];
      handleDaySelect(nextDay);
    }
  };

  // Handle week completion
  const handleWeekComplete = () => {
    const totalDays = Object.values(currentWeekData.dailyData).filter(day => day.isSaved).length;
    const weekTotal = currentWeekData.totalAmount;
    
    const resolvedProjectId = Number(projectId || selectedProject?.id);
    if (!resolvedProjectId) {
      showError("Project not selected. Please select a project before completing week.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    labourPaymentService.create({
      project_id: resolvedProjectId,
      particulars: `Week ${currentWeekData.weekNumber}`,
      date: today,
      net_amount: weekTotal,
      extra: 0,
      labour_amount: weekTotal,
      cumulative_amount: null,
      remarks: null
    }).then(() => fetchPayments())
      .catch((e) => {
        console.error("Failed to create labour payment:", e);
        setPaymentsError(e?.message || "Failed to create payment");
      });

    completeWeek();
    showSuccess(`Week completed successfully!`);
    showInfo(`Total Days: ${totalDays} | Week Total: ₹${weekTotal}`);
  };

  // Show week details
  const handleShowWeekDetails = (week) => {
    setSelectedWeek(week);
    setShowWeekDetails(true);
  };

  // Handle export to Excel
  const handleExportToExcel = () => {
    try {
      // Create worksheet from labour payment data
      const ws = XLSX.utils.json_to_sheet(payments.map(week => ({
        'Week Number': `Week ${week.weekNumber}`,
        'Date Range': `${week.startDate} to ${week.endDate}`,
        'Total Days': week.totalDays,
        'Total Amount': week.totalAmount,
        'Status': week.status || 'Pending',
        'Remarks': week.remarks || '-'
      })));

      // Add total row
      const totalAmount = payments.reduce((sum, week) => sum + week.totalAmount, 0);
      XLSX.utils.sheet_add_aoa(ws, [
        ['Total', '', '', totalAmount, '', '']
      ], { origin: -1 });

      // Set column widths
      ws['!cols'] = [
        { wch: 12 }, // Week Number
        { wch: 20 }, // Date Range
        { wch: 12 }, // Total Days
        { wch: 15 }, // Total Amount
        { wch: 12 }, // Status
        { wch: 20 }  // Remarks
      ];

      // Create workbook and append worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Labour Payments');

      // Generate Excel file
      XLSX.writeFile(wb, 'labour_payments.xlsx');
      showSuccessToast('Labour payment data exported successfully!');
    } catch (error) {
      showInfoToast('Error exporting data to Excel. Please try again.');
      console.error('Export error:', error);
    }
  };

  // Modal Components
  const ZeroStaffModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="text-yellow-500" />
          Confirm Zero Staff Entry
        </h3>
        <p className="text-gray-600 mb-4">
          You are about to save an entry with zero staff. Total amount: ₹{dayFormData.miscAmount}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowZeroStaffModal(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Fill Details
          </button>
          <button
            onClick={proceedWithSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            OK, Proceed
          </button>
        </div>
      </div>
    </div>
  );

  // Handle edit from week details
  const handleEditFromWeekDetails = (day) => {
    setSelectedDay(day);
    setDayFormData(currentWeekData.dailyData[day]);
    setShowEditConfirm(true);
  };

  // Week Details Modal
  const handleWeekDetailsEdit = () => {
    setShowWeekDetails(false);
    showInfo("Select the day you want to edit");
  };

  // Week Progress Info Modal
  const WeekProgressModal = ({ onClose, onEdit }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Week Progress Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {days.map(day => {
            const dayData = currentWeekData.dailyData[day];
            const totalStaff = dayData.headMason + dayData.mason + dayData.mHelper + dayData.wHelper;
            
            return (
              <div key={day} className="border-b pb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{day}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${dayData.isSaved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {dayData.isSaved ? 'Saved' : 'Pending'}
                  </span>
                </div>
                {dayData.isSaved && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>Total Staff: {totalStaff}</p>
                      <p>Head Mason: {dayData.headMason}</p>
                      <p>Mason: {dayData.mason}</p>
                      <p>Male Helper: {dayData.mHelper}</p>
                      <p>Female Helper: {dayData.wHelper}</p>
                    </div>
                    <div>
                      <p>Misc Amount: ₹{dayData.miscAmount || 0}</p>
                      <p>Total Amount: ₹{dayData.amount}</p>
                      {dayData.remarks && (
                        <p className="text-gray-600 mt-1">
                          Remarks: {dayData.remarks}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">Week Total: ₹{currentWeekData.totalAmount}</p>
            <p className="text-sm text-gray-600">
              {Object.values(currentWeekData.dailyData).filter(day => day.isSaved).length}/7 Days Completed
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Week
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Stats Grid Component
  const StatsGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-600 text-sm font-medium">Days Completed</p>
        <p className="text-2xl font-bold text-blue-800">
          {Object.values(currentWeekData.dailyData).filter(day => day.isSaved).length}/7
        </p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg relative group cursor-pointer"
        onClick={() => setShowWeekProgress(true)}
      >
        <div className="absolute top-2 right-2">
          <Info className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-green-600 text-sm font-medium">Week Total</p>
        <p className="text-2xl font-bold text-green-800">₹{currentWeekData.totalAmount}</p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-purple-600 text-sm font-medium">Avg Daily</p>
        <p className="text-2xl font-bold text-purple-800">
          ₹{currentWeekData.totalAmount > 0
            ? Math.round(currentWeekData.totalAmount / Object.values(currentWeekData.dailyData)
                .filter(day => day.isSaved).length)
            : 0}
        </p>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg">
        <p className="text-orange-600 text-sm font-medium">Status</p>
        <p className="text-lg font-bold text-orange-800">
          {isWeekComplete() ? 'Ready' : 'In Progress'}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <Navbar currentPath={location.pathname} icon={Coins} />
      <div className="p-4 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Labour Payment Management
          </h1>
          <p className="text-gray-600">
            Enter daily labour data (saves to Labour Bill) → Complete week (creates payment record)
          </p>
        </div>

        {/* Completed Weeks List */}
        {payments.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Weeks</h2>
            {paymentsError ? (
              <div className="text-sm text-red-600 mb-3">{paymentsError}</div>
            ) : null}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Week</th>
                    <th className="px-4 py-3 text-left">Period</th>
                    <th className="px-4 py-3 text-right">Total Amount</th>
                    <th className="px-4 py-3 text-center">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paymentsLoading ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    payments.map((week) => (
                      <tr key={week.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">Week {week.weekNumber}</td>
                        <td className="px-4 py-3">
                          {week.startDate} to {week.endDate}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">₹{week.totalAmount}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleShowWeekDetails(week)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View week details"
                          >
                            <Info className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Current Week Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Week {currentWeekData.weekNumber} Progress
            </h2>
            {isWeekComplete() && (
              <button
                onClick={handleWeekComplete}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Complete Week
              </button>
            )}
          </div>

          {/* Stats Grid */}
          <StatsGrid />

          {/* Week Progress Bar */}
          <div className="grid grid-cols-7 gap-2">
            {days.map(day => {
              const dayData = currentWeekData.dailyData[day];
              return (
                <div key={day} className="text-center">
                  <div className={`h-2 rounded-full mb-1 ${dayData.isSaved ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <p className="text-xs text-gray-600">{day.slice(0, 3)}</p>
                  <p className="text-xs font-semibold text-gray-800">₹{dayData.amount}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Labour Entry Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Daily Labour Entry
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleCopyPreviousDay}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100"
                title="Copy Previous Day"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={handleClearDay}
                className="text-gray-600 hover:text-red-600 p-2 rounded-md hover:bg-gray-100"
                title="Clear Day"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day Selection */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {days.map(day => {
              const dayData = currentWeekData.dailyData[day];
              return (
                <button
                  key={day}
                  onClick={() => handleDaySelect(day)}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-colors relative
                    ${selectedDay === day
                      ? 'bg-red-500 text-white'
                      : dayData.isSaved
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title={dayData.isSaved ? `₹${dayData.amount}` : 'No data entered'}
                >
                  {day.slice(0, 3)}
                  {dayData.isSaved && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full transform -translate-y-1 translate-x-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Staff Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Head Mason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Head Mason (₹800/day)
                </label>
                <input
                  type="number"
                  min="0"
                  value={dayFormData.headMason}
                  onChange={(e) => handleInputChange('headMason', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Mason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mason (₹800/day)
                </label>
                <input
                  type="number"
                  min="0"
                  value={dayFormData.mason}
                  onChange={(e) => handleInputChange('mason', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* M-Helper */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  M-Helper (₹600/day)
                </label>
                <input
                  type="number"
                  min="0"
                  value={dayFormData.mHelper}
                  onChange={(e) => handleInputChange('mHelper', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* W-Helper */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  W-Helper (₹400/day)
                </label>
                <input
                  type="number"
                  min="0"
                  value={dayFormData.wHelper}
                  onChange={(e) => handleInputChange('wHelper', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Miscellaneous Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Miscellaneous Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                value={dayFormData.miscAmount}
                onChange={(e) => handleInputChange('miscAmount', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter any additional amount"
              />
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                value={dayFormData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Additional notes or comments"
                rows="2"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={saveDayData}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2"
              >
                Save Daily Entry
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <button 
            onClick={handleExportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <Download size={18} />
            EXPORT TO EXCEL
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Clear Day */}
      {showConfirmClear && (
        <DeleteVerificationDialog
          isOpen={showConfirmClear}
          onClose={() => setShowConfirmClear(false)}
          onConfirm={clearDayData}
          itemName={selectedDay}
          itemType="Day"
          verificationText={selectedDay}
        />
      )}

      {/* Week Details Modal */}
      {showWeekDetails && selectedWeek && (
        <WeekDetailsModal
          weekData={selectedWeek}
          onClose={() => setShowWeekDetails(false)}
          onEdit={handleWeekDetailsEdit}
        />
      )}

      {/* Zero Staff Confirmation Modal */}
      {showZeroStaffModal && (
        <ZeroStaffModal />
      )}

      {/* Edit Confirmation Modal */}
      {showEditConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Edit2 className="text-blue-500" />
              Edit {selectedDay}'s Data
            </h3>
            <p className="text-gray-600 mb-4">
              You are about to modify existing data for {selectedDay}. This will update the overall week calculations.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEditConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowEditConfirm(false);
                  // Keep the current data loaded for editing
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Proceed with Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Week Progress Modal */}
      {showWeekProgress && (
        <WeekProgressModal 
          onClose={() => setShowWeekProgress(false)}
          onEdit={() => {
            setShowWeekProgress(false);
            // Handle edit functionality
            showInfo("Select the day you want to edit");
          }}
        />
      )}
    </>
  );
};

export default LabourPayment;
