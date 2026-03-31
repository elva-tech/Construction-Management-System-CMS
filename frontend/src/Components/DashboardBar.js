import React from "react";
import { FaWallet, FaMoneyCheckAlt, FaChartPie, FaHandHoldingUsd } from "react-icons/fa";

const formatCurrency = (value) => {
  if (typeof value === "string") value = parseFloat(value);
  if (isNaN(value)) return "₹0";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`;
  return `₹${value.toLocaleString()}`;
};

const ProgressBar = ({ percent, color }) => (
  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
    <div
      className={`h-2 rounded-full transition-all duration-300 ${color}`}
      style={{ width: `${Math.min(percent, 100)}%` }}
    ></div>
  </div>
);

const DashboardBar = ({ existingBalance, paymentsReceived, budgetSpent, balanceToBePaid, totalBudget }) => {
  // Calculate analytics
  const budgetSpentPercent = totalBudget ? ((budgetSpent / totalBudget) * 100).toFixed(1) : 0;
  const paymentsReceivedPercent = totalBudget ? ((paymentsReceived / totalBudget) * 100).toFixed(1) : 0;
  const balanceToBePaidPercent = totalBudget ? ((balanceToBePaid / totalBudget) * 100).toFixed(1) : 0;
  const existingBalancePercent = totalBudget ? ((existingBalance / totalBudget) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Existing Balance: blue-yellow */}
      <div className="bg-gradient-to-br from-blue-500 to-yellow-400 p-6 rounded-xl text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <FaWallet className="text-2xl opacity-80" />
          <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
            {existingBalancePercent}%
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Existing Balance</h3>
        <p className="text-2xl font-bold mb-2">{formatCurrency(existingBalance)}</p>
        <p className="text-sm opacity-80">{existingBalancePercent}% of Total Budget</p>
        <ProgressBar percent={existingBalancePercent} color="bg-white/30" />
      </div>

      {/* Payments Received: green-red */}
      <div className="bg-gradient-to-br from-green-500 to-red-400 p-6 rounded-xl text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <FaMoneyCheckAlt className="text-2xl opacity-80" />
          <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
            {paymentsReceivedPercent}%
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Payments Received</h3>
        <p className="text-2xl font-bold mb-2">{formatCurrency(paymentsReceived)}</p>
        <p className="text-sm opacity-80">{paymentsReceivedPercent}% of Total Budget</p>
        <ProgressBar percent={paymentsReceivedPercent} color="bg-white/30" />
      </div>

      {/* Budget Spent: yellow-purple */}
      <div className="bg-gradient-to-br from-yellow-500 to-purple-500 p-6 rounded-xl text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <FaChartPie className="text-2xl opacity-80" />
          <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
            {budgetSpentPercent}%
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Budget Spent</h3>
        <p className="text-2xl font-bold mb-2">{formatCurrency(budgetSpent)}</p>
        <p className="text-sm opacity-80">{budgetSpentPercent}% of Total Budget</p>
        <ProgressBar percent={budgetSpentPercent} color="bg-white/30" />
      </div>

      {/* Balance To Be Paid: red-white */}
      <div className="bg-gradient-to-br from-red-500 to-white p-6 rounded-xl text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <FaHandHoldingUsd className="text-2xl opacity-80" />
          <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full text-gray-800">
            {balanceToBePaidPercent}%
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Balance To Be Paid</h3>
        <p className="text-2xl font-bold mb-2 text-gray-800">{formatCurrency(balanceToBePaid)}</p>
        <p className="text-sm opacity-80 text-gray-700">{balanceToBePaidPercent}% of Total Budget</p>
        <ProgressBar percent={balanceToBePaidPercent} color="bg-gray-800/30" />
      </div>
    </div>
  );
};

export default DashboardBar;
