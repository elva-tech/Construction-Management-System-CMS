import React, { useState, useEffect } from "react";
import { X, Edit2, Save, XCircle } from "lucide-react";
import { useToast } from "../context/ToastContext";

const ItemDetailsModal = ({ isOpen, onClose, itemDetails, isUpdate, onSubmit }) => {
  const { showSuccess, showError } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    drNo: "",
    particulars: "",
    date: "",
    amount: "",
    paid: "",
    balance: "",
    remarks: ""
  });

  useEffect(() => {
    if (itemDetails && isUpdate) {
      setFormData({
        drNo: itemDetails.drNo || "",
        particulars: itemDetails.particulars || "",
        date: itemDetails.date || new Date().toISOString().split('T')[0],
        amount: itemDetails.amount || "",
        paid: itemDetails.paid || "",
        balance: itemDetails.balance || "",
        remarks: itemDetails.remarks || ""
      });
    }
  }, [itemDetails, isUpdate]);

  if (!isOpen || !itemDetails) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If amount or paid is changed, calculate balance automatically
    if (name === 'amount' || name === 'paid') {
      const amount = name === 'amount' ? parseFloat(value) || 0 : parseFloat(formData.amount) || 0;
      const paid = name === 'paid' ? parseFloat(value) || 0 : parseFloat(formData.paid) || 0;
      const balance = amount - paid;

      setFormData({
        ...formData,
        [name]: value,
        balance: balance.toString()
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.drNo || !formData.particulars || !formData.date || !formData.amount) {
      showError("Please fill in all required fields");
      return;
    }

    try {
      await onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        paid: parseFloat(formData.paid),
        balance: parseFloat(formData.balance)
      });
      setIsEditing(false);
    } catch (error) {
      showError("Failed to update item");
    }
  };

  // Sort transactions by date (most recent first)
  const materialData = itemDetails.transactions ? [...itemDetails.transactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  ) : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-[#2C3E50]">{itemDetails.particulars}</h2>
            <p className="text-sm text-gray-600">
              {isUpdate ? (isEditing ? "Edit Item Details" : "Item Details") : "Transaction History"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isUpdate && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-[#7BAFD4] hover:text-[#6B9FD4] hover:bg-blue-50 rounded-md transition-colors"
                title="Edit item"
              >
                <Edit2 size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#7C8CA1] hover:text-[#2C3E50] hover:bg-gray-50 rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {isUpdate && isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DR. No</label>
                <input
                  type="text"
                  name="drNo"
                  value={formData.drNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7BAFD4]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Particulars</label>
                <input
                  type="text"
                  name="particulars"
                  value={formData.particulars}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7BAFD4]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7BAFD4]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7BAFD4]"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid</label>
                <input
                  type="number"
                  name="paid"
                  value={formData.paid}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7BAFD4]"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7BAFD4]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center gap-2"
              >
                <XCircle size={16} />
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-[#7BAFD4] hover:bg-[#6B9FD4] rounded-md flex items-center gap-2"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">DR. No.</th>
                    <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Date</th>
                    <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Amount</th>
                    <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Paid</th>
                    <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Balance</th>
                    <th className="px-6 py-3 text-sm font-semibold text-[#2C3E50]">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {materialData.map((item, index) => (
                    <tr key={index} className="text-sm hover:bg-gray-50">
                      <td className="px-6 py-4 text-[#2C3E50]">{item.drNo || '-'}</td>
                      <td className="px-6 py-4 text-[#4A5568]">{item.date}</td>
                      <td className="px-6 py-4 text-[#2C3E50]">₹{item.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-[#2C3E50]">
                        {item.paid > 0 ? `₹${item.paid.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-[#2C3E50]">
                        {item.balance > 0 ? `₹${item.balance.toLocaleString()}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-[#7C8CA1]">{item.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-right font-semibold text-[#2C3E50]">
                      Total
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#2C3E50]">
                      ₹{itemDetails.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ₹{itemDetails.paid.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-red-600">
                      ₹{itemDetails.balance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetailsModal; 