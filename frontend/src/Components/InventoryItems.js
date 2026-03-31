import React, { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import DeleteVerificationDialog from "./DeleteVerificationDialog";

const InventoryItems = (props) => {
  const { items, setItems, setSelectedItem, setItemSelected, selectedItem } =
    props;
  const { searchTerm, setSearchTerm, searchResults } = props;

  const [isPending, startTransition] = useTransition(); // Add useTransition
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleClear = () => {
    setSelectedItem({});
    setItemSelected(false);
  };

  const handleDeleteClick = (e, item) => {
    e.stopPropagation();
    setItemToDelete(item);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      startTransition(() => {
        const updatedItems = items
          .filter((i) => i.id !== itemToDelete.id)
          .map((item, index) => ({ ...item, id: index + 1 }));
        setItems(updatedItems);
        if (selectedItem.id === itemToDelete.id) {
          handleClear();
        }
      });
    }
  };

  return (
    <div className="overflow-x-auto rounded-md">
      <table className="w-full text-left text-xs sm:text-sm text-gray-600 border border-gray-200 rounded-md">
        <thead className="bg-gray-200 border-b border-gray-200">
          <tr className="font-semibold text-black">
            <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 w-12 sm:w-16">
              No.
            </th>
            <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3">
              Particulars
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {(searchTerm ? searchResults : items).map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                setSelectedItem(item);
                setItemSelected(true);
              }}
            >
              <td className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-900">
                {item.id}
              </td>
              <td className="px-2 sm:px-4 py-2 sm:py-3 justify-between flex items-center">
                <span className="flex-1 truncate">{item.name}</span>
                <button
                  onClick={(e) => handleDeleteClick(e, item)}
                >
                  <Trash2 size={16} className="sm:w-5 sm:h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPending && <p className="text-gray-500 text-xs sm:text-sm">Updating...</p>}

      <DeleteVerificationDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.name || ''}
        itemType="Item"
        verificationText={itemToDelete?.name || ''}
      />
    </div>
  );
};

export default InventoryItems;
