import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AddDailyReportModal = ({ isOpen, onClose, onAdd, entries }) => {
  const { appData } = useAppContext();
  const sourceEntries = useMemo(
    () => (Array.isArray(entries) && entries.length ? entries : appData.dailyReport.entries),
    [entries, appData.dailyReport.entries]
  );
  
  // Get all particulars from localStorage (Inventory) and daily report
  let allParticulars = [];
  try {
    const saved = localStorage.getItem('allParticulars');
    if (saved) {
      allParticulars = JSON.parse(saved).map(p => p.particulars);
    }
  } catch (e) { allParticulars = []; }
  const uniqueParticulars = Array.from(
    new Set([
      ...allParticulars,
      ...sourceEntries.map(entry => entry.particulars)
    ])
  ).sort();

  // Function to generate next DR number
  const getNextDRNumber = () => {
    // Get all existing DR numbers
    const existingDRs = sourceEntries
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

  const [formData, setFormData] = useState({
    particulars: '',
    date: new Date().toISOString().split('T')[0],
    amount: '',
    paid: '',
    unit: '',
    quantity: '1',
    remarks: '',
    drNo: getNextDRNumber()
  });

  // Reset form and generate new DR number when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        drNo: getNextDRNumber(),
        particulars: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        paid: '',
        unit: '',
        quantity: '1',
        remarks: ''
      }));
    }
  }, [isOpen]);

  // Get all unique amounts for the selected particular
  const amountOptions = formData.particulars
    ? Array.from(new Set(appData.dailyReport.entries
        .filter(entry => entry.particulars === formData.particulars)
        .map(entry => entry.amount)
      )).sort((a, b) => a - b)
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    const balance = Number(formData.amount) - Number(formData.paid);
    onAdd({
      ...formData,
      amount: Number(formData.amount),
      paid: Number(formData.paid),
      balance,
      quantity: Number(formData.quantity)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#2C3E50]">Add Daily Report Entry</h2>
          <button
            onClick={onClose}
            className="text-[#7C8CA1] hover:text-[#2C3E50]"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                DR. No.
              </label>
              <input
                type="text"
                name="drNo"
                value={formData.drNo}
                readOnly
                className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Particulars*
              </label>
              <select
                name="particulars"
                value={formData.particulars}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              >
                <option value="">Select from Inventory List</option>
                {uniqueParticulars.map((particular) => (
                  <option key={particular} value={particular}>
                    {particular}
                  </option>
                ))}
              </select>
              {uniqueParticulars.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  No items in inventory list. Please add items to inventory first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Date*
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Amount (₹)*
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                list="amount-suggestions"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              />
              {amountOptions.length > 0 && (
                <datalist id="amount-suggestions">
                  {amountOptions.map((amt) => (
                    <option key={amt} value={amt} />
                  ))}
                </datalist>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Paid Amount (₹)*
              </label>
              <input
                type="number"
                name="paid"
                value={formData.paid}
                onChange={handleChange}
                required
                min="0"
                max={formData.amount}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Unit
              </label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#2C3E50] mb-1">
                Remarks
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="2"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-[#4A5568]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#7C8CA1] hover:text-[#2C3E50]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uniqueParticulars.length === 0}
              className={`px-6 py-2 rounded-lg transition-colors ${
                uniqueParticulars.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-[#7BAFD4] text-white hover:bg-[#6B9FD4]'
              }`}
            >
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDailyReportModal; 