import React, { useState, useRef, useEffect } from "react";
import { Edit, Trash2, X } from "lucide-react";
import DeleteVerificationDialog from "./DeleteVerificationDialog";
import { useAuth } from "../context/AuthContext";
import { getProjectDashboardData } from '../services/dashboardDataService';

const ProjectCard = ({ project, onSelect, onDelete, onEdit, deletingProjectId, setDeletingProjectId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);
  const [verificationInput, setVerificationInput] = useState("");
  const { user } = useAuth();
  const deleteBtnRef = useRef(null);
  const popupRef = useRef(null);

  // Get dashboard data for this project
  const dashboardData = getProjectDashboardData(project)?.dashboardData;

  const handleDelete = () => {
    // Call the onDelete prop if it exists
    if (typeof onDelete === 'function') {
      onDelete(project.id);
    } else {
      console.log("Deleting project:", project.id);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeletePopup(true);
    if (setDeletingProjectId) setDeletingProjectId(project.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    // Call the onEdit prop if it exists
    if (typeof onEdit === 'function') {
      onEdit(project);
    } else {
      console.log("Editing project:", project.id);
    }
  };

  const handleSelect = () => {
    if (typeof onSelect === 'function') {
      onSelect(project);
    }
  };

  // Helper to darken a hex color
  function darkenColor(hex, percent) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.floor(r * (1 - percent));
    g = Math.floor(g * (1 - percent));
    b = Math.floor(b * (1 - percent));
    return `rgb(${r},${g},${b})`;
  }

  const baseColor = project.color || '#7BAFD4';
  const hoveredColor = darkenColor(baseColor, 0.12); // 12% darker

  const isOtherCardOpaque = deletingProjectId && deletingProjectId !== project.id;

  // Close popups if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !deleteBtnRef.current.contains(event.target)
      ) {
        setShowDeletePopup(false);
        setShowVerifyPopup(false);
        setVerificationInput("");
      }
    }
    if (showDeletePopup || showVerifyPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDeletePopup, showVerifyPopup]);

  return (
    <div
      className={`relative w-full max-w-xs sm:max-w-sm min-w-0 h-full ${isOtherCardOpaque ? 'opacity-40 pointer-events-none' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ maxWidth: 200, minHeight: 160, transition: 'transform 0.2s ease', transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
    >
      {/* Action Buttons - move outside clickable area */}
      <div className={`absolute top-1 sm:top-2 right-1 sm:right-2 flex space-x-1 transition-opacity duration-200 z-20 ${isHovered ? 'opacity-100' : 'opacity-100 sm:opacity-0'}`}>
        <button
          className="p-1.5 sm:p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors touch-manipulation min-h-[32px] sm:min-h-auto"
          onClick={handleDeleteClick}
          aria-label={`Delete project ${project.name}`}
          title="Delete project"
          ref={deleteBtnRef}
        >
          <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>
        <button
          onClick={handleEdit}
          className="p-1.5 sm:p-1.5 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors touch-manipulation min-h-[32px] sm:min-h-auto"
          aria-label={`Edit project ${project.name}`}
          title="Edit project"
        >
          <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>
      </div>

      {/* Backdrop and Popups rendered at the top level, outside the card */}
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
          {/* Step 1: Are you sure? Popup */}
          {showDeletePopup && !showVerifyPopup && (
            <div ref={popupRef} className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Are you sure?</span>
                <button onClick={() => { setShowDeletePopup(false); if (setDeletingProjectId) setDeletingProjectId(null); }} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
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
          {/* Step 2: Verification Popup */}
          {showVerifyPopup && (
            <div ref={popupRef} className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-72">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Confirm Deletion</span>
                <button onClick={() => { setShowVerifyPopup(false); setVerificationInput(""); if (setDeletingProjectId) setDeletingProjectId(null); }} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
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
      <div
        className="relative w-full h-full cursor-pointer transition-all duration-200"
        onClick={handleSelect}
        style={{ maxWidth: 200, minHeight: 160 }}
      >
        {/* Folder Tab */}
        <div
          className="absolute -top-2 left-3 w-12 h-3 rounded-t-lg"
          style={{ backgroundColor: baseColor }}
        />
        {/* Folder Body */}
        <div
          className="relative w-full h-full rounded-lg overflow-hidden"
          style={{ backgroundColor: isHovered ? hoveredColor : baseColor, transition: 'background 0.2s', minHeight: 160, maxWidth: 200 }}
        >
          {/* Watermark for Approved Projects */}
          {project.isWatermarked && (
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: 'rotate(-25deg)',
                opacity: 0.18,
                zIndex: 1,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span 
                className="whitespace-nowrap"
                style={{
                  fontSize: '2.2rem',
                  fontWeight: 700,
                  color: '#555',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                }}
              >
                APPROVED
              </span>
            </div>
          )}

          {/* Project Info */}
          <div className="p-3 relative z-10" style={{ paddingBottom: 36 }}>
            <h3 className="text-white font-semibold text-sm mb-1 truncate">
              {project.name}
            </h3>
            <p className="text-white/90 text-xs truncate mb-1">
              Budget: ₹{dashboardData?.budgetSpent?.total?.toLocaleString() || 'N/A'}
            </p>
            <p className="text-white/90 text-xs truncate mb-1">
              Period: {project.startDate} - {project.endDate}
            </p>
          </div>
          {/* Status Indicator at bottom right */}
          <div className="absolute bottom-8 right-3 z-20">
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
              project.status === 'Completed' ? 'bg-white/30' : 
              project.status === 'Approved' ? 'bg-white/40' : 
              'bg-white/30'
            } text-white`}>
              {project.status}
            </span>
          </div>
          {/* Line above owner */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', width: '100%', position: 'absolute', left: 0, bottom: 28 }}></div>
          {/* Owner at the bottom */}
          <div style={{ position: 'absolute', left: 0, bottom: 4, width: '100%' }}>
            <p className="text-white/90 text-xs truncate text-left px-3">Owner: {project.owner || user?.name || 'User'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
