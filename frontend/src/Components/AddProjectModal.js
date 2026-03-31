import React, { useState, useEffect } from 'react';
import { X, Calendar, Building } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const AddProjectModal = ({ isOpen, onClose, onSave }) => {
  const { showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    status: 'Planning',
    isWatermarked: false
  });

  const [errors, setErrors] = useState({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        startDate: '',
        status: 'Planning',
        isWatermarked: false
      });
      setErrors({});
    }
  }, [isOpen]);

  // Get today's date in YYYY-MM-DD format for min date validation
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Generate a random color for the new project
      const colors = ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722', '#607D8B', '#E91E63', '#00BCD4'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      // Generate new project ID (in real app, this would come from backend)
      const newProject = {
        id: Date.now(), // Simple ID generation
        name: formData.name,
        status: formData.status,
        completion: formData.status === 'Planning' ? 0 : formData.status === 'Completed' ? 100 : 5,
        budget: '₹ 1.0 Cr', // Default budget
        startDate: formatDate(formData.startDate),
        endDate: formatDate(formData.startDate, 365), // Default to 1 year from start
        color: randomColor,
        isWatermarked: formData.status === 'Approved'
      };

      onSave(newProject);
      onClose();
    } else {
      showError("Please fill in all required fields correctly.");
    }
  };

  // Format date to display format
  const formatDate = (dateString, addDays = 0) => {
    const date = new Date(dateString);
    if (addDays > 0) {
      date.setDate(date.getDate() + addDays);
    }
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-2 sm:p-6">
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
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
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

          {/* Project Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-base"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-base font-medium touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[#7BAFD4] text-white rounded-md hover:bg-[#5A8CAB] transition-colors text-base font-medium touch-manipulation"
            >
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
