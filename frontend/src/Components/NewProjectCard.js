import React, { useState } from "react";
import { Edit, Trash2, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NewProjectCard = ({ project, onSelect, onDelete, onEdit, deletingProjectId, setDeletingProjectId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [verificationInput, setVerificationInput] = useState("");
  const { user } = useAuth();

  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete(project.id);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeletePopup(true);
    if (setDeletingProjectId) setDeletingProjectId(project.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (typeof onEdit === 'function') {
      onEdit(project);
    }
  };

  const handleSelect = () => {
    if (typeof onSelect === 'function') {
      onSelect(project);
    }
  };

  // Get card color based on project type/status
  const getCardColor = () => {
    switch (project.name) {
      case "Residential Complex":
        return "bg-gradient-to-br from-green-400 to-green-600";
      case "Commercial Tower":
        return "bg-gradient-to-br from-blue-400 to-blue-600";
      case "Highway Extension":
        return "bg-gradient-to-br from-yellow-400 to-orange-500";
      case "Hospital Building":
        return "bg-gradient-to-br from-purple-400 to-purple-600";
      case "Shopping Mall":
        return "bg-gradient-to-br from-red-400 to-red-600";
      case "IT Park":
        return "bg-gradient-to-br from-gray-400 to-gray-600";
      default:
        return "bg-gradient-to-br from-blue-400 to-blue-600";
    }
  };

  const getStatusColor = () => {
    switch (project.status) {
      case "Completed":
        return "bg-purple-500";
      case "Active":
        return "bg-blue-500";
      case "Planning":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const isOtherCardOpaque = deletingProjectId && deletingProjectId !== project.id;

  return (
    <div
      className={`relative w-full max-w-xs min-w-0 h-full ${isOtherCardOpaque ? 'opacity-40 pointer-events-none' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        maxWidth: 280, 
        minHeight: 200, 
        transition: 'transform 0.2s ease', 
        transform: isHovered ? 'scale(1.02)' : 'scale(1)' 
      }}
    >
      {/* Action Buttons */}
      <div className={`absolute top-2 right-2 flex space-x-1 transition-opacity duration-200 z-20 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button
          className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          onClick={handleDeleteClick}
          aria-label={`Delete project ${project.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleEdit}
          className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
          aria-label={`Edit project ${project.name}`}
        >
          <Edit className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Delete Popups */}
      {(showDeletePopup || showVerifyPopup) && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            onClick={() => {
              setShowDeletePopup(false);
              setShowVerifyPopup(false);
              setVerificationInput("");
              if (setDeletingProjectId) setDeletingProjectId(null);
            }}
          />
          {showDeletePopup && !showVerifyPopup && (
            <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Are you sure?</span>
                <button onClick={() => { setShowDeletePopup(false); if (setDeletingProjectId) setDeletingProjectId(null); }} className="text-gray-400 hover:text-gray-700">
                  <X size={18} />
                </button>
              </div>
              <div className="text-gray-700 text-sm mb-4">Do you want to delete the project "{project.name}"?</div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowDeletePopup(false); if (setDeletingProjectId) setDeletingProjectId(null); }}
                  className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >No</button>
                <button
                  onClick={() => { setShowDeletePopup(false); setShowVerifyPopup(true); }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                >Yes</button>
              </div>
            </div>
          )}
          {showVerifyPopup && (
            <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-72">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Confirm Deletion</span>
                <button onClick={() => { setShowVerifyPopup(false); setVerificationInput(""); if (setDeletingProjectId) setDeletingProjectId(null); }} className="text-gray-400 hover:text-gray-700">
                  <X size={18} />
                </button>
              </div>
              <div className="text-gray-700 text-sm mb-3">To confirm deletion, type the project name:</div>
              <div className="font-semibold text-gray-800 mb-2">{project.name}</div>
              <input
                type="text"
                value={verificationInput}
                onChange={e => setVerificationInput(e.target.value)}
                placeholder="Type project name"
                className="w-full px-2 py-1 border border-gray-300 rounded-md mb-3 text-sm"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowVerifyPopup(false); setVerificationInput(""); if (setDeletingProjectId) setDeletingProjectId(null); }}
                  className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >Cancel</button>
                <button
                  onClick={() => {
                    if (verificationInput.trim().toLowerCase() === project.name.trim().toLowerCase()) {
                      handleDelete();
                      setShowVerifyPopup(false);
                      setVerificationInput("");
                      if (setDeletingProjectId) setDeletingProjectId(null);
                    }
                  }}
                  className={`px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm ${verificationInput.trim().toLowerCase() !== project.name.trim().toLowerCase() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={verificationInput.trim().toLowerCase() !== project.name.trim().toLowerCase()}
                >Delete</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Project Card */}
      <div
        className={`relative w-full h-full cursor-pointer transition-all duration-200 rounded-lg overflow-hidden ${getCardColor()}`}
        onClick={handleSelect}
        style={{ minHeight: 200 }}
      >
        {/* Project Info */}
        <div className="p-4 h-full flex flex-col justify-between">
          <div>
            <h3 className="text-white font-bold text-lg mb-2">
              {project.name}
            </h3>
            <p className="text-white/90 text-sm mb-1">
              Budget: ₹{(project.budgetValue / 100000).toFixed(2)}L
            </p>
            <p className="text-white/90 text-sm mb-1">
              Period: {project.startDate} - {project.endDate}
            </p>
          </div>
          
          <div className="mt-4">
            <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor()}`}>
              {project.status}
            </div>
            <div className="mt-2 text-white/90 text-sm">
              Owner: {project.owner}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProjectCard;
