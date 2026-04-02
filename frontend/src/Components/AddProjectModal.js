import React, { useState, useEffect } from 'react';
import { X, Calendar, Building } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const AddProjectModal = ({ isOpen, onClose, onSave, clients = [] }) => {
  const { showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    address: '',
    total_budget: '',
    startDate: '',
    endDate: '',
    status: 'In Progress',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        client_id: '',
        address: '',
        total_budget: '',
        startDate: '',
        endDate: '',
        status: 'In Progress',
      });
      setErrors({});
    }
  }, [isOpen]);

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.client_id) newErrors.client_id = 'Client is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showError('Please fill in all required fields.');
      return;
    }

    const colors = ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722', '#607D8B'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    onSave({
      name: formData.name.trim(),
      client_id: formData.client_id,
      location: formData.address.trim(),
      address: formData.address.trim(),
      budgetValue: formData.total_budget ? Number(formData.total_budget) : 0,
      total_budget: formData.total_budget ? Number(formData.total_budget) : 0,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      status: formData.status,
      completion: formData.status === 'Completed' ? 100 : 0,
      budgetSpent: 0,
      budget_spent: 0,
      completion_percentage: formData.status === 'Completed' ? 100 : 0,
      color: randomColor,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center">
            <Building className="mr-2" size={18} />
            Add New Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 touch-manipulation"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-base ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter project name"
              autoComplete="off"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client *
            </label>
            {clients.length > 0 ? (
              <select
                name="client_id"
                value={formData.client_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-base ${
                  errors.client_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a client</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name || c.username}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name="client_id"
                value={formData.client_id}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-base ${
                  errors.client_id ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter client ID"
                autoComplete="off"
              />
            )}
            {errors.client_id && <p className="text-red-500 text-xs mt-1">{errors.client_id}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address / Location
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-base"
              placeholder="Enter project location"
              autoComplete="off"
            />
          </div>

          {/* Total Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Budget (₹)
            </label>
            <input
              type="number"
              name="total_budget"
              value={formData.total_budget}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-base"
              placeholder="e.g. 1500000"
              min="0"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline mr-1" size={14} />
              Start Date *
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              min={getTodayDate()}
              className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-base ${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline mr-1" size={14} />
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              min={formData.startDate || getTodayDate()}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-base"
            />
          </div>

          {/* Status */}
        <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Project Status
  </label>
  <select
    name="status"
    value={formData.status}
    onChange={handleInputChange}
    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-base"
  >
    <option value="Active">Active</option>
    <option value="On Hold">On Hold</option>
    <option value="Completed">Completed</option>
  </select>
</div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-base font-medium touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-[#7BAFD4] text-white rounded-md hover:bg-[#5A8CAB] transition-colors text-base font-medium touch-manipulation"
            >
              Add Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;