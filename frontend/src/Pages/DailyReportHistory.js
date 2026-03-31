import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const DailyReportHistory = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { appData } = useAppContext();

  // Filters for the history list
  const [historyRange, setHistoryRange] = useState('1week');
  const allParticulars = Array.from(new Set(appData.dailyReport.entries.map(e => e.particulars)));
  const [historyParticular, setHistoryParticular] = useState('All');

  if (!date) {
    // Show list of all dates with transaction counts, filtered
    const now = new Date();
    let allDates = Array.from(new Set(appData.dailyReport.entries.map(e => e.date)));

    // Filter by item/particular
    if (historyParticular !== 'All') {
      allDates = allDates.filter(date => 
        appData.dailyReport.entries.some(e => e.date === date && e.particulars === historyParticular)
      );
    }

    // Filter by range
    if (historyRange === '1week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      allDates = allDates.filter(date => new Date(date) >= weekAgo && new Date(date) <= now);
    } else if (historyRange === '1month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      allDates = allDates.filter(date => new Date(date) >= monthAgo && new Date(date) <= now);
    } else if (historyRange === '1year') {
      const yearAgo = new Date(now);
      yearAgo.setFullYear(now.getFullYear() - 1);
      allDates = allDates.filter(date => new Date(date) >= yearAgo && new Date(date) <= now);
    }

    allDates = allDates.sort((a, b) => new Date(b) - new Date(a));

    return (
      <div className="px-2 min-h-screen bg-gray-50">
        <div className="mb-4">
          <button 
            className="text-blue-500 hover:text-blue-700 mb-4"
            onClick={() => navigate('/app/dwa')}
          >
            ← Back to Daily Report
          </button>
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-2">Transaction History - All Dates</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Show:</label>
              <select 
                value={historyRange} 
                onChange={(e) => setHistoryRange(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="1week">1 Week</option>
                <option value="1month">Last Month</option>
                <option value="1year">One Year</option>
                <option value="all">All</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Item:</label>
              <select 
                value={historyParticular} 
                onChange={(e) => setHistoryParticular(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="All">All</option>
                {allParticulars.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          {allDates.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No history available.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {allDates.map(date => {
                const count = appData.dailyReport.entries.filter(e => 
                  e.date === date && (historyParticular === 'All' || e.particulars === historyParticular)
                ).length;
                return (
                  <div 
                    key={date} 
                    className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                    onClick={() => navigate(`/app/daily-report/history/${date}`)}
                  >
                    <span className="font-medium">{date}</span>
                    <span className="text-sm text-gray-600">
                      {count} transaction{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show transactions for a specific date
  const entries = appData.dailyReport.entries.filter(e => e.date === date);

  return (
    <div className="px-2 min-h-screen bg-gray-50">
      <div className="mb-4">
        <button 
          className="text-blue-500 hover:text-blue-700 mb-4"
          onClick={() => navigate('/app/daily-report/history')}
        >
          ← Back to History List
        </button>
        <h1 className="text-2xl font-bold text-[#2C3E50] mb-2">Transactions for {date}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">DR No.</th>
                <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Particulars</th>
                <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Amount</th>
                <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Paid</th>
                <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Balance</th>
                <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Unit</th>
                <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Quantity</th>
                <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No entries for this day.
                  </td>
                </tr>
              ) : (
                entries.map((entry, idx) => (
                  <tr key={idx} className="text-sm text-[#4A5568] hover:bg-gray-50">
                    <td className="px-6 py-4">{entry.drNo}</td>
                    <td className="px-6 py-4">{entry.particulars}</td>
                    <td className="px-6 py-4">₹{entry.amount}</td>
                    <td className="px-6 py-4">₹{entry.paid}</td>
                    <td className="px-6 py-4">₹{entry.balance}</td>
                    <td className="px-6 py-4">{entry.unit}</td>
                    <td className="px-6 py-4">{entry.quantity}</td>
                    <td className="px-6 py-4">{entry.remarks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailyReportHistory;
