import React from "react";

const InventoryItemDetails = (props) => {
  const { itemDetailsData, setSearchItemTerm, searchItemTerm, searchItemResults } =
    props;
  return (
    <div>
      <div className="overflow-x-auto rounded-md">
        <table className="w-full text-left text-xs sm:text-sm text-gray-600 border border-gray-200 rounded-md">
          <thead className="bg-gray-200 border-b border-gray-200">
            <tr className="font-semibold text-black">
              <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3 w-10 sm:w-16">
                No.
              </th>
              <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3">
                DR. No.
              </th>
              <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3">
                Particulars
              </th>
              <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3">
                Date
              </th>
              <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3">
                Amount
              </th>
              <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3">
                Paid
              </th>
              <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3">
                Balance
              </th>
              <th scope="col" className="px-2 sm:px-4 py-2 sm:py-3">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(searchItemTerm ? searchItemResults : itemDetailsData).map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-2 sm:px-4 py-2 sm:py-3 font-semibold text-gray-900">
                  {item.id}
                </td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{item.drNo}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{item.particulars}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{item.date}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{item.amount}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{item.paid}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{item.balance}</td>
                <td className="px-2 sm:px-4 py-2 sm:py-3">{item.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryItemDetails;
