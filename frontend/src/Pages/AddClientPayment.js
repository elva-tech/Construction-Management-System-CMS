import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard } from "lucide-react";
import Navbar from "../Components/Navbar";
import { useToast } from "../context/ToastContext";
import { useProject } from "../context/ProjectContext";
import paymentService from "../services/paymentService";

const AddClientPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess, showInfo } = useToast();
  const { selectedProject } = useProject();
  
  const [formData, setFormData] = useState({
    particulars: "",
    date: new Date().toISOString().split('T')[0],
    amount: "",
    paid_through: "",
    remarks: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectId = selectedProject?.id;
    if (!projectId) {
      showInfo("No project selected. Please select a project first.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would typically save the data to your backend
      await paymentService.create({
        project_id: projectId,
        particulars: formData.particulars,
        date: formData.date,
        amount: parseFloat(formData.amount),
        paid_through: formData.paid_through,
        remarks: formData.remarks || null
      });

      showSuccess("Payment entry added successfully!");
      navigate("/app/clientpayments");
    } catch (error) {
      console.error("[AddClientPayment] API error:", error);
      showInfo("Failed to add payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={CreditCard} />
      <div className="p-4 sm:p-6 min-h-screen">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Payment Entry</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Particulars *
                </label>
                <input
                  type="text"
                  value={formData.particulars}
                  onChange={(e) => setFormData({ ...formData, particulars: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Installment - 6"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paid Through *
                </label>
                <select
                  value={formData.paid_through}
                  onChange={(e) => setFormData({ ...formData, paid_through: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select payment method</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="NEFT">NEFT</option>
                  <option value="RTGS">RTGS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes or comments"
                  rows="3"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/app/clientpayments")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Add Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddClientPayment;