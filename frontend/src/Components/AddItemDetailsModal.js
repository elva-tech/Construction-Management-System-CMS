import React, { useState } from "react";
import { useToast } from "../context/ToastContext";

const AddItemDetailsModal = (props) => {
  const { setShowItemDetailsModal, handleAddItemDetails, selectedItem } = props;
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    drno: "",
    particulars: selectedItem.name || "",
    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    amount: "",
    balance: "",
    paid: "",
    remarks: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.drno || !formData.particulars || !formData.date || !formData.amount) {
      showError("Please fill in all required fields");
      return;
    }

    // Call the parent function to add the item
    handleAddItemDetails(formData);
    showSuccess(`Item details for "${formData.particulars}" added successfully!`);

    // Close the modal
    setShowItemDetailsModal(false);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center min-h-screen p-4 z-50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-md w-full max-w-xs sm:max-w-sm p-4 sm:p-6 relative"
      >
        <h2
          id="modal-title"
          className="font-semibold text-lg sm:text-xl text-black mb-1 leading-tight"
        >
          Add Data
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-5 leading-tight">
          Fill in the details below to add new data to the system.
        </p>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Dr. No", name: "drno", type: "text", placeholder: "DR001" },
            { label: "Particulars", name: "particulars", type: "text", placeholder: "Material name" },
            { label: "Amount (₹)", name: "amount", type: "number", placeholder: "0.00" },
            { label: "Balance (₹)", name: "balance", type: "number", placeholder: "0.00" },
            { label: "Paid (₹)", name: "paid", type: "number", placeholder: "0.00" },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name} className="mb-2 sm:mb-3 flex items-center">
              <label
                htmlFor={name}
                className="font-semibold text-black w-[80px] sm:w-[90px] flex-shrink-0 mr-2 sm:mr-4 text-xs sm:text-sm"
              >
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="border border-gray-300 rounded-md px-2 sm:px-3 py-1 w-full text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                min={type === "number" ? "0" : undefined}
                step={type === "number" ? "0.01" : undefined}
              />
            </div>
          ))}

          <div className="mb-2 sm:mb-3 flex items-center">
            <label
              htmlFor="date"
              className="font-semibold text-black w-[60px] sm:w-[70px] flex-shrink-0 mr-2 sm:mr-4 text-xs sm:text-sm"
            >
              Date
            </label>
            <div className="relative w-full">
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-2 py-1 w-full text-gray-500 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>
          <div className="mb-3 sm:mb-4 flex items-start">
            <label
              htmlFor="remarks"
              className="font-semibold text-black w-[60px] sm:w-[70px] flex-shrink-0 pt-1 mr-2 sm:mr-4 text-xs sm:text-sm"
            >
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              rows="3"
              value={formData.remarks}
              onChange={handleChange}
              className="border border-gray-300 rounded-md text-xs sm:text-sm px-2 sm:px-3 py-1 w-full resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2 sm:space-x-3">
            <button
              type="button"
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-xs sm:text-sm"
              onClick={() => setShowItemDetailsModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md bg-red-500 text-white font-semibold text-xs sm:text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemDetailsModal;
