import React from 'react';
import { X, Calendar, IndianRupee, Edit2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const WeekDetailsModal = ({ weekData, onClose }) => {
  const { showInfo } = useToast();

  const handleEdit = () => {
    onClose();
    showInfo("Select the day you want to edit from the calendar view");
  };

  if (!weekData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Week {weekData.weekNumber} Details
            </h2>
            <p className="text-sm text-gray-600">
              {weekData.startDate} to {weekData.endDate}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-md hover:bg-blue-50 flex items-center gap-1"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-blue-800 font-medium mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Total Days
            </h3>
            <p className="text-2xl font-bold text-blue-900">{weekData.totalDays}/7</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-purple-800 font-medium mb-1 flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Total Amount
            </h3>
            <p className="text-2xl font-bold text-purple-900">₹{weekData.totalAmount}</p>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Daily Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Day</th>
                  <th className="px-4 py-2 text-center">Head Mason</th>
                  <th className="px-4 py-2 text-center">Mason</th>
                  <th className="px-4 py-2 text-center">M-Helper</th>
                  <th className="px-4 py-2 text-center">W-Helper</th>
                  <th className="px-4 py-2 text-right">Misc. Amount</th>
                  <th className="px-4 py-2 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {Object.entries(weekData.dailyBreakdown).map(([day, data]) => {
                  const totalStaff = data.headMason + data.mason + data.mHelper + data.wHelper;
                  return (
                    <tr key={day} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">{day.slice(0, 3)}</td>
                      <td className="px-4 py-2 text-center">{data.headMason || 0}</td>
                      <td className="px-4 py-2 text-center">{data.mason || 0}</td>
                      <td className="px-4 py-2 text-center">{data.mHelper || 0}</td>
                      <td className="px-4 py-2 text-center">{data.wHelper || 0}</td>
                      <td className="px-4 py-2 text-right">₹{data.miscAmount || 0}</td>
                      <td className="px-4 py-2 text-right font-medium">₹{data.amount || 0}</td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan={6} className="px-4 py-2">Total</td>
                  <td className="px-4 py-2 text-right">₹{weekData.totalAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Completed on: {weekData.completedDate}</span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekDetailsModal; 