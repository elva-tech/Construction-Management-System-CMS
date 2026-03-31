import React, { useState, useRef, useMemo, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { CreditCard, Plus, X, Upload, Download, Wallet, CircleDollarSign, BarChart3, AlertCircle } from "lucide-react";
import { useToast } from "../context/ToastContext";
import * as XLSX from 'xlsx';
import AddPaymentModal from "../Components/AddPaymentModal";
import { useProject } from "../context/ProjectContext";
import { useClientContext } from "../context/ClientContext";

import paymentService from "../services/paymentService";
import paymentPlanService from "../services/paymentPlanService";

const ClientPayments = () => {
  const location = useLocation();
  const { showSuccess, showInfo } = useToast();
  const fileInputRef = useRef(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState([]);
  const [editPlanRows, setEditPlanRows] = useState(null);
  const { selectedProject } = useProject();
  const { clientList } = useClientContext();

  // --- FIX: declare API state here in the parent component ---
  const [apiPaymentData, setApiPaymentData] = useState(null);
  const [apiPaymentPlan, setApiPaymentPlan] = useState(null);

  const [paymentData, setPaymentData] = useState([
    {
      no: "01",
      particulars: "Installment - 1",
      date: "01/01/2025",
      amount: 200000,
      paidThrough: "Cash",
      remarks: "-"
    },
    {
      no: "02",
      particulars: "Installment - 2",
      date: "08/01/2025",
      amount: 200000,
      paidThrough: "Cheque",
      remarks: "-"
    }
  ]);

  // PRODUCTION: use ONLY API data — no mock fallback
  const finalPaymentData = apiPaymentData ?? [];
  const finalPaymentPlan = apiPaymentPlan ?? [];

  // Find the client for the selected project
  const client = clientList.find(c => (c.projects || []).includes(selectedProject?.name));
  const totalBudget = client?.totalBudget || '0';

  // Calculate analytics data
  // FIX analytics (ONLY replace paymentData → finalPaymentData)
  const analytics = useMemo(() => {
    const totalAmount = finalPaymentData.reduce((sum, item) => sum + item.amount, 0);
    const totalAmountInLakhs = (totalAmount / 100000).toFixed(1);
  
    const totalExpectedInLakhs = 10;
    const totalInstallmentsNeeded = 5;
    const currentInstallments = finalPaymentData.length;
  
    const paymentsDonePercent = Math.round((totalAmountInLakhs / totalExpectedInLakhs) * 100);
    const expectedPaymentsPercent = Math.round(((totalExpectedInLakhs - totalAmountInLakhs) / totalExpectedInLakhs) * 100);
  
    const monthlyData = finalPaymentData.reduce((acc, payment) => {
      const date = new Date(payment.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
  
      if (!acc[monthYear]) {
        acc[monthYear] = {
          month: monthYear,
          amount: 0,
          count: 0
        };
      }
  
      acc[monthYear].amount += payment.amount / 100000;
      acc[monthYear].count += 1;
  
      return acc;
    }, {});
  
    return {
      totalInstallments: {
        current: currentInstallments,
        total: totalInstallmentsNeeded,
        display: `${currentInstallments} / ${totalInstallmentsNeeded}`
      },
      paymentsDone: {
        current: totalAmountInLakhs,
        total: totalExpectedInLakhs,
        display: `${totalAmountInLakhs} L / ${totalExpectedInLakhs} L`
      },
      percentages: {
        done: paymentsDonePercent,
        expected: expectedPaymentsPercent
      },
      monthlyTrends: Object.values(monthlyData)
    };
  }, [finalPaymentData]);

  // --- FIX: fetch functions moved to parent component scope ---
  const fetchPaymentsFromAPI = async () => {
    const projectId = selectedProject?.id;
    console.log("[fetchPaymentsFromAPI] selectedProject.id:", projectId);
    if (!projectId) {
      console.warn("[fetchPaymentsFromAPI] No projectId — skipping API call");
      return;
    }
  
    try {
      const res = await paymentService.getByProject(projectId);
      console.log("[fetchPaymentsFromAPI] API response:", res);
  
      // apiService uses fetch (not axios) — returns response.json() directly, so res = { success, data: [] }
      const rows = res?.data ?? [];
  
      const mapped = rows.map((row, idx) => ({
        no: String((row?.serial_number ?? idx + 1)).padStart(2, '0'),
        particulars: row?.particulars ?? '',
        date: row?.date ?? '',
        amount: Number(row?.amount ?? 0),
        paidThrough: row?.paid_through ?? '',
        remarks: row?.remarks ?? ''
      }));
  
      setApiPaymentData(mapped);
    } catch (e) {
      console.error("API PAYMENT ERROR:", e);
      // Set empty array on error so UI shows empty state instead of null crash
      setApiPaymentData([]);
    }
  };
  
  const fetchPlansFromAPI = async () => {
    const projectId = selectedProject?.id;
    console.log("[fetchPlansFromAPI] selectedProject.id:", projectId);
    if (!projectId) {
      console.warn("[fetchPlansFromAPI] No projectId — skipping API call");
      return;
    }
  
    try {
      const res = await paymentPlanService.getAll();
      console.log("[fetchPlansFromAPI] API response:", res);
  
      // apiService uses fetch (not axios) — returns response.json() directly, so res = { success, data: [] }
      const rows = res?.data ?? [];
  
      const filtered = projectId
        ? rows.filter(p => Number(p.project_id) === Number(projectId))
        : rows;
  
      const mapped = filtered.map(p => ({
        date: p?.date ?? '',
        amount: p?.amount ?? 0,
        remarks: p?.particulars ?? ''
      }));
  
      setApiPaymentPlan(mapped);
    } catch (e) {
      console.error("API PLAN ERROR:", e);
      // Set empty array on error so UI shows empty state instead of null crash
      setApiPaymentPlan([]);
    }
  };

  useEffect(() => {
    fetchPaymentsFromAPI();
    fetchPlansFromAPI();
  }, [selectedProject?.id]);

  // Render circular progress
  const renderCircularProgress = (percentage, color = "#EF4444") => {
    const size = 120;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2C3E50"
          strokeOpacity="0.3"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
    );
  };

  // Render bar chart
  const renderBarChart = () => {
    if (!analytics.monthlyTrends || analytics.monthlyTrends.length === 0) {
      return <div className="flex items-center justify-center h-40 text-white">No data available</div>;
    }

    const maxValue = Math.max(
      ...analytics.monthlyTrends.map(data => Math.max(data.amount, data.amount))
    );

    return (
      <div className="flex h-40 items-end justify-between space-x-0.5 sm:space-x-1 px-1 sm:px-2 overflow-x-auto">
        {analytics.monthlyTrends.map((data, index) => {
          const amountHeight = `${(data.amount / maxValue) * 100}%`;
          const countHeight = `${(data.amount / maxValue) * 100}%`;

          return (
            <div key={index} className="flex flex-col items-center flex-shrink-0">
              <div className="flex space-x-0.5 sm:space-x-1">
                <div
                  className="w-2 sm:w-3 md:w-4 bg-red-500 rounded-t-sm"
                  style={{
                    height: amountHeight,
                    minHeight: '8px'
                  }}
                ></div>
                <div
                  className="w-2 sm:w-3 md:w-4 bg-red-400 rounded-t-sm"
                  style={{
                    height: countHeight,
                    minHeight: '8px'
                  }}
                ></div>
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600 mt-1 font-medium">{data.month}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-IN');
  };

  // Handle adding new payment
  const handleAddPayment = async (newPayment) => {
    const projectId = selectedProject?.id;
    if (!projectId) {
      showInfo("No project selected. Please select a project first.");
      return;
    }
    try {
      await paymentService.create({
        project_id: projectId,
        particulars: newPayment.particulars,
        date: newPayment.date,
        amount: parseFloat(newPayment.amount),
        paid_through: newPayment.paidThrough,
        remarks: newPayment.remarks || null
      });
      // Refresh from API to keep UI source-of-truth consistent
      await fetchPaymentsFromAPI();
      showSuccess("New payment entry added successfully!");
    } catch (e) {
      console.error("[handleAddPayment] error:", e);
      showInfo("Failed to add payment. Please try again.");
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      showInfo("Please upload an Excel file (.xlsx or .xls)");
      return;
    }

    showSuccess("Payment plan uploaded successfully!");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle export to Excel
  const handleExportToExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(
        finalPaymentData.map(item => ({
          'No.': item.no,
          'Particulars': item.particulars,
          'Date': item.date,
          'Amount': item.amount,
          'Paid Through': item.paidThrough,
          'Remarks': item.remarks
        }))
      );

      XLSX.utils.sheet_add_aoa(ws, [
        ['Total', '', '', analytics.paymentsDone.current * 100000, '', '']
      ], { origin: -1 });

      ws['!cols'] = [
        { wch: 5 },
        { wch: 20 },
        { wch: 12 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Client Payments');

      XLSX.writeFile(wb, 'client_payments.xlsx');
      showSuccess('Payment data exported successfully!');
    } catch (error) {
      showInfo('Error exporting data to Excel. Please try again.');
      console.error('Export error:', error);
    }
  };



  return (
    <>
      <Navbar currentPath={location.pathname} icon={CreditCard} />
      <div className="p-4 sm:p-6 min-h-screen">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Installments Card */}
          <div className="bg-white rounded-lg p-4">
            <div className="text-xl font-semibold mb-1">
              {analytics.totalInstallments.display}
            </div>
            <div className="text-gray-600 text-sm">Total Installments</div>
          </div>

          {/* Payments Done Card */}
          <div className="bg-white rounded-lg p-4">
            <div className="text-xl font-semibold mb-1">
              {analytics.paymentsDone.display}
            </div>
            <div className="text-gray-600 text-sm">Payments Done</div>
          </div>

          {/* Payments Done % Card */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center mb-1">
              <div className="relative w-full h-2 bg-gray-200 rounded">
                <div
                  className="absolute top-0 left-0 h-full bg-red-500 rounded"
                  style={{ width: `${analytics.percentages.done}%` }}
                ></div>
              </div>
              <div className="ml-2 text-sm font-medium text-gray-700">
                {analytics.percentages.done}%
              </div>
            </div>
            <div className="text-gray-600 text-sm">Payments Done %</div>
          </div>

          {/* Expected Payments Card */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center mb-1">
              <div className="relative w-full h-2 bg-gray-200 rounded">
                <div
                  className="absolute top-0 left-0 h-full bg-red-500 rounded"
                  style={{ width: `${analytics.percentages.expected}%` }}
                ></div>
              </div>
              <div className="ml-2 text-sm font-medium text-gray-700">
                {analytics.percentages.expected}%
              </div>
            </div>
            <div className="text-gray-600 text-sm">Expected Payments</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 flex items-center gap-2 min-w-[180px] justify-center"
          >
            <Plus size={18} />
            ADD PAYMENT
          </button>
          <button
            onClick={() => setIsAddPlanModalOpen(true)}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 flex items-center gap-2 min-w-[180px] justify-center"
          >
            <Upload size={18} />
            ADD PAYMENT PLAN
          </button>
          <button
            onClick={handleExportToExcel}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 flex items-center gap-2 min-w-[180px] justify-center"
          >
            <Download size={18} />
            EXPORT DATA
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
            className="hidden"
          />
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-center">NO.</th>
                  <th className="px-6 py-3">Particulars</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-center">Amount</th>
                  <th className="px-6 py-3">Paid Through</th>
                  <th className="px-6 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {finalPaymentData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No payments found</td>
                  </tr>
                ) : (
                  finalPaymentData.map((payment) => (
                    <tr key={payment.no} className="border-b">
                      <td className="px-6 py-3 text-center">{payment.no}</td>
                      <td className="px-6 py-3">{payment.particulars}</td>
                      <td className="px-6 py-3">{payment.date}</td>
                      <td className="px-6 py-3 text-center">{formatNumber(payment.amount)}</td>
                      <td className="px-6 py-3">{payment.paidThrough}</td>
                      <td className="px-6 py-3">{payment.remarks}</td>
                    </tr>
                  ))
                )}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-6 py-3 text-center">Total</td>
                  <td></td>
                  <td></td>
                  <td className="px-6 py-3 text-center">{formatNumber(analytics.paymentsDone.current * 100000)}</td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Plan Table (Pre-planned) */}
        {finalPaymentPlan.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8 overflow-hidden mt-8">
            <div className="flex items-center justify-between p-4 font-semibold text-lg border-b">
              <span>Payment Plan (Pre-planned)</span>
              <button
                className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 text-sm"
                onClick={() => {
                  setEditPlanRows(paymentPlan);
                  setIsAddPlanModalOpen(true);
                }}
              >Edit</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3 text-center">Amount</th>
                    <th className="px-6 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {finalPaymentPlan.map((row, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-6 py-3">{row.date}</td>
                      <td className="px-6 py-3 text-center">{formatNumber(Number(row.amount))}</td>
                      <td className="px-6 py-3">{row.remarks || '-'}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-6 py-3 text-right">Total</td>
                    <td className="px-6 py-3 text-center">{formatNumber(finalPaymentPlan.reduce((sum, row) => sum + Number(row.amount), 0))}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Payment Modal */}
        <AddPaymentModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddPayment}
        />

        {/* Add Payment Plan Modal */}
        <AddPaymentPlanModal
          isOpen={isAddPlanModalOpen}
          onClose={() => { setIsAddPlanModalOpen(false); setEditPlanRows(null); }}
          onSave={(rows) => {
            setPaymentPlan(rows);
            setIsAddPlanModalOpen(false);
            setEditPlanRows(null);
            showSuccess('Payment plan added successfully!');
          }}
          totalBudget={totalBudget}
          initialRows={editPlanRows}
        />


      </div>
    </>
  );
};

function AddPaymentPlanModal({ isOpen, onClose, onSave, totalBudget, initialRows }) {
  const [rows, setRows] = useState(initialRows || [{ date: '', amount: '', remarks: '' }]);
  const [error, setError] = useState('');

  // If initialRows changes (editing), update rows
  React.useEffect(() => {
    if (isOpen) {
      setRows(initialRows && initialRows.length > 0 ? initialRows : [{ date: '', amount: '', remarks: '' }]);
    }
  }, [initialRows, isOpen]);

  const handleRowChange = (idx, field, value) => {
    const updated = [...rows];
    updated[idx][field] = value;
    setRows(updated);
  };

  const addRow = () => setRows([...rows, { date: '', amount: '', remarks: '' }]);
  const removeRow = (idx) => setRows(rows.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    const sum = rows.reduce((acc, row) => acc + Number(row.amount), 0);
    const budget = Number(String(totalBudget).replace(/,/g, ''));
    if (sum !== budget) {
      setError(`Total of all payments (${sum}) must match the project total budget (${budget})`);
      return;
    }
    setError('');
    onSave(rows.filter(row => row.date && row.amount));
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Add Payment Plan</h2>
        <form onSubmit={handleSubmit}>
          <table className="w-full mb-4">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Remarks</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td><input type="date" value={row.date} onChange={e => handleRowChange(idx, 'date', e.target.value)} required className="border p-1 rounded" /></td>
                  <td><input type="number" value={row.amount} onChange={e => handleRowChange(idx, 'amount', e.target.value)} required className="border p-1 rounded" /></td>
                  <td><input value={row.remarks} onChange={e => handleRowChange(idx, 'remarks', e.target.value)} className="border p-1 rounded" /></td>
                  <td>
                    {rows.length > 1 && <button type="button" onClick={() => removeRow(idx)} className="text-red-500">-</button>}
                    {idx === rows.length - 1 && <button type="button" onClick={addRow} className="text-green-500 ml-2">+</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save Payment Plan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientPayments;