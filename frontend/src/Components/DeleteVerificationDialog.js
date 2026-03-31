import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const DeleteVerificationDialog = ({ isOpen, onClose, onConfirm, itemName, itemType, verificationText }) => {
  const [verificationInput, setVerificationInput] = useState('');
  const { showSuccess, showError } = useToast();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (verificationInput.toLowerCase() === verificationText.toLowerCase()) {
      onConfirm();
      onClose();
      showSuccess(`${itemType} "${itemName}" deleted successfully!`);
    } else {
      showError(`Incorrect ${itemType} name. Please try again.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-md p-2 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-900">Are you sure?</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        {/* Content */}
        <div className="p-4">
          <p className="text-gray-600 mb-4 text-sm">
            This will permanently delete the project "{itemName}" and all its contents. This action cannot be undone.
          </p>
          <p className="text-gray-700 mb-2 text-base">
            To confirm deletion, please type the project name: <span className="font-semibold">{itemName}</span>
          </p>
          <input
            type="text"
            value={verificationInput}
            onChange={(e) => setVerificationInput(e.target.value)}
            placeholder={`Type ${itemType.toLowerCase()} name to confirm`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        {/* Action Buttons */}
        <div className="flex flex-row justify-end gap-3 border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-base font-medium touch-manipulation"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-base font-medium touch-manipulation"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteVerificationDialog; 