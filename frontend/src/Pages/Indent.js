import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { BadgeInfo, X } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useClientContext, ClientProvider } from '../context/ClientContext';
import { useProject } from '../context/ProjectContext';

// General Information Modal Component
const AddGeneralInfoModal = ({ isOpen, onClose, onSave, clientList }) => {
  const { showSuccess, showError, showInfo } = useToast();

  const [formData, setFormData] = useState({
    clientName: "",
    projectNo: "",
    labourContractor: "",
    address: "",
    totalBudget: ""
  });

  // Auto-fill fields when client is selected
  const handleClientChange = (e) => {
    const selectedClient = e.target.value;
    setFormData((prev) => ({ ...prev, clientName: selectedClient }));
    const clientData = clientList.find((c) => c.clientName === selectedClient);
    if (clientData) {
      setFormData({
        clientName: clientData.clientName,
        projectNo: clientData.projectNo || "",
        labourContractor: clientData.labourContractor || "",
        address: clientData.address || "",
        totalBudget: clientData.totalBudget || ""
      });
      showInfo(`Client details for "${selectedClient}" auto-filled successfully!`);
    } else {
      setFormData({
        clientName: selectedClient,
        projectNo: "",
        labourContractor: "",
        address: "",
        totalBudget: ""
      });
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName || !formData.projectNo || !formData.labourContractor || !formData.address || !formData.totalBudget) {
      showError("Please fill in all required fields.");
      return;
    }
    onSave(formData);
    setFormData({
      clientName: "",
      projectNo: "",
      labourContractor: "",
      address: "",
      totalBudget: ""
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add General Information</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name of Client *
              </label>
              <select
                name="clientName"
                value={formData.clientName}
                onChange={handleClientChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Select a client</option>
                {clientList.map((client) => (
                  <option key={client.clientName} value={client.clientName}>
                    {client.clientName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project No. *
              </label>
              <input
                type="text"
                name="projectNo"
                value={formData.projectNo}
                onChange={handleFieldChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Labour Contractor *
              </label>
              <input
                type="text"
                name="labourContractor"
                value={formData.labourContractor}
                onChange={handleFieldChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFieldChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Budget (₹) *
              </label>
              <input
                type="text"
                name="totalBudget"
                value={formData.totalBudget}
                onChange={handleFieldChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Rate List Modal Component
const AddRateListModal = ({ isOpen, onClose, onSave, rateList }) => {
  const { showSuccess, showError, showInfo } = useToast();

  const [formData, setFormData] = useState({
    role: "",
    rate: ""
  });

  // Allow typing a new role or selecting existing
  const handleRoleChange = (e) => {
    setFormData((prev) => ({ ...prev, role: e.target.value }));
    const roleData = rateList.find((r) => r[0] === e.target.value);
    if (roleData) {
      setFormData({ role: roleData[0], rate: roleData[1] });
    } else {
      setFormData((prev) => ({ ...prev, rate: "" }));
    }
  };

  const handleRateChange = (e) => {
    setFormData({ ...formData, rate: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.role || !formData.rate) {
      return;
    }
    onSave({ role: formData.role, rate: formData.rate });
    setFormData({ role: "", rate: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Rate List Item</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <input
                type="text"
                name="role"
                list="role-list"
                value={formData.role}
                onChange={handleRoleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                placeholder="Type or select a role"
              />
              <datalist id="role-list">
                {rateList.map(([role]) => (
                  <option key={role} value={role} />
                ))}
              </datalist>
              {formData.role && !rateList.some(([role]) => role === formData.role) && (
                <button
                  type="button"
                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => {
                    if (formData.role && formData.rate) {
                      onSave({ role: formData.role, rate: formData.rate });
                      setFormData({ role: '', rate: '' });
                      onClose();
                    }
                  }}
                >
                  Add "{formData.role}" to roles
                </button>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate (₹) *
              </label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleRateChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Client Modal Component
const AddClientModal = ({ isOpen, onClose, onAdd, existingClients }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    projectNo: "",
    labourContractor: "",
    address: "",
    totalBudget: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all fields are filled
    if (Object.values(formData).some((v) => !v.trim())) {
      setError("All fields are required.");
      return;
    }
    // Prevent duplicate client names
    if (existingClients.includes(formData.clientName)) {
      setError("Client name already exists.");
      return;
    }
    onAdd(formData);
    setFormData({
      clientName: "",
      projectNo: "",
      labourContractor: "",
      address: "",
      totalBudget: ""
    });
    setError("");
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Client</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="clientName" value={formData.clientName} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Name of Client" />
          <input name="projectNo" value={formData.projectNo} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Project No." />
          <input name="labourContractor" value={formData.labourContractor} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Labour Contractor" />
          <input name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Address" />
          <input name="totalBudget" value={formData.totalBudget} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Total Budget" />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const IndentPage = () => {
  return null;
};

export default IndentPage;
