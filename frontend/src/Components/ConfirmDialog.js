import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, description }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  if (!isOpen) return null;

  // Check if we're on the projects page (no sidebar)
  const isProjectsPage = location.pathname === "/app/projects";



  // Determine the appropriate CSS class based on context
  const getOverlayClass = () => {
    if (isMobile || isProjectsPage) {
      return "dialog-overlay full-screen fixed z-[9999] bg-black bg-opacity-80 backdrop-blur-sm";
    } else {
      return "dialog-overlay dashboard-content fixed z-[9999] bg-black bg-opacity-80 backdrop-blur-sm";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all duration-200 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-6 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-sm font-medium"
          >
            {title.includes('Logout') ? 'Logout' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
