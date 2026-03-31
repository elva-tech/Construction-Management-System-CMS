import React, { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { useToast } from "../context/ToastContext";

const EditProjectModal = ({ isOpen, onClose, onSave, project }) => {
  const { showError } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    status: "Planning",
    isWatermarked: false
  });

  // Convert display date format (e.g., "15 Jan 2023") to input date format (YYYY-MM-DD)
  const convertToInputDate = (displayDate) => {
    if (!displayDate) return "";

    try {
      // Parse the display date format "15 Jan 2023"
      const date = new Date(displayDate);
      if (isNaN(date.getTime())) return "";

      // Convert to YYYY-MM-DD format for date input
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error("Error converting date:", error);
      return "";
    }
  };

  // Update form data when project prop changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        startDate: convertToInputDate(project.startDate) || "",
        status: project.status || "Planning",
        isWatermarked: project.isWatermarked || false
      });
    }
  }, [project]);

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Convert input date format (YYYY-MM-DD) to display format (e.g., "15 Jan 2023")
  const convertToDisplayDate = (inputDate) => {
    if (!inputDate) return "";

    try {
      const date = new Date(inputDate);
      if (isNaN(date.getTime())) return "";

      // Convert to display format "15 Jan 2023"
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error converting date:", error);
      return "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const updatedProject = {
        ...project,
        ...formData,
        startDate: convertToDisplayDate(formData.startDate),
        isWatermarked: formData.status === "Approved" ? true : project?.isWatermarked || false
      };

      onSave(updatedProject);
      onClose();
    } else {
      showError("Please fill in all required fields correctly.");
    }
  };

  const handleClose = () => {
    // Reset form data to original project values
    if (project) {
      setFormData({
        name: project.name || "",
        startDate: convertToInputDate(project.startDate) || "",
        status: project.status || "Planning",
        isWatermarked: project.isWatermarked || false
      });
    }
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto p-2 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Edit Project</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <div className="relative">
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-base ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <Calendar className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
          </div>

          {/* Horizontal line (below which project status and owner name are rendered) */}
          <hr className="my-4 border-t border-gray-200" />

          {/* Project Status and Owner Name on the same line */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Project Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] text-base"
              >
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Approved">Approved</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-base font-medium touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-3 bg-[#7BAFD4] text-white rounded-md hover:bg-[#5A8CAB] transition-colors text-base font-medium touch-manipulation"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;
