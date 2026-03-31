import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';

const AddClientModal = ({ isOpen, onClose, onAdd, existingClients }) => {
  const { selectedProject } = useProject();
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
    // Associate client with selected project
    const clientWithProject = {
      ...formData,
      projects: selectedProject ? [selectedProject.name] : []
    };
    onAdd(clientWithProject);
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

export default AddClientModal;