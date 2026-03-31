import React, { useTransition } from "react";
import { Search } from "lucide-react";
import { useToast } from "../context/ToastContext";

const InventoryItemToolBar = (props) => {
  const {
    itemDetailsData,
    setSearchItemResults,
    itemSelected,
    setShowItemDetailsModal,
    searchItemTerm,
    setSearchItemTerm,
    handleClear,
  } = props;

  const [isPending, startTransition] = useTransition(); // Add useTransition
  const { showInfo } = useToast();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <button className="border border-gray-300 bg-white rounded-md px-3 py-2 text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
            Filter
          </button>
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search"
              className="rounded-md px-3 py-2 text-sm pl-10 w-full"
              value={searchItemTerm}
              onChange={(e) => {
                const term = e.target.value;
                setSearchItemTerm(term);
                startTransition(() => {
                  const results = itemDetailsData.filter((item) =>
                    item.particulars.toLowerCase().includes(term.toLowerCase())
                  );
                  setSearchItemResults(results);
                });
              }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto justify-end">
          <button
            className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded"
            onClick={() => {
              setShowItemDetailsModal(true);
              showInfo("Add Data modal opened. Enter transaction details to add to inventory.");
            }}
          >
            Add Data
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
      {isPending && <p className="text-gray-500 text-xs sm:text-sm">Searching...</p>}{" "}
      {/* Show pending state */}
    </div>
  );
};

export default InventoryItemToolBar;
