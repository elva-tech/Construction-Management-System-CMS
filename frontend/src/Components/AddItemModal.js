import React from "react";
import { useToast } from "../context/ToastContext";

const AddItemModal = (props) => {
  const { setShowItemModal, handleAddItem, newItem, setNewItem } = props;
  const { showSuccess, showError } = useToast();

  const handleAdd = () => {
    if (newItem.trim()) {
      handleAddItem();
      showSuccess(`Item "${newItem}" added successfully!`);
    } else {
      showError("Please enter an item name before adding.");
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 px-4 sm:px-0">
      <div className="bg-white p-4 sm:p-6 rounded-md shadow-lg w-full max-w-xs sm:max-w-sm">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Add New Item</h2>
        <input
          type="text"
          className="border rounded w-full px-3 py-2 mb-4 text-sm"
          placeholder="Enter item name"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAdd();
            }
          }}
        />
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm"
            onClick={() => setShowItemModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm"
            onClick={handleAdd}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
