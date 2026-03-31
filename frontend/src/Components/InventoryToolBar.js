import React from "react";
import { Search } from "lucide-react";
import { useToast } from "../context/ToastContext";

const InventoryToolBar = (props) => {
  const {
    items,
    setSearchResults,
    itemSelected,
    setShowItemModal,
    searchTerm,
    setSearchTerm,
    handleClear,
  } = props;

  const { showInfo } = useToast();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search"
              className="rounded-md px-3 py-2 text-sm pl-10 w-full"
              value={searchTerm}
              onChange={(e) => {
                const term = e.target.value;
                setSearchTerm(term);
                const results = items.filter((item) =>
                  item.name.toLowerCase().includes(term.toLowerCase())
                );
                setSearchResults(results);
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto justify-end">
          <button
            className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded"
            onClick={() => {
              setShowItemModal(true);
              showInfo("Add Item modal opened. Enter item details to add to inventory.");
            }}
          >
            Add Item
          </button>
          {itemSelected && (
            <button
              className="bg-gray-50 text-black text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded"
              onClick={() => {
                handleClear();
              }}
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryToolBar;
