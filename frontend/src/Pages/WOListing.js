import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import {
  BriefcaseBusiness,
  Boxes,
  ReceiptIndianRupee,
  FolderKanban,
  Search,
} from "lucide-react";
import ReactPaginate from "react-paginate";

const WOListing = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [filterRegion, setFilterRegion] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [data, setData] = useState([]);
  const itemsPerPage = 15;

  const regions = ["TUMKUR", "BALLARI", "SIRA", "MANDYA", "MYSURU"];
  const statuses = [
    { status: "TO DO", statusColor: "text-red-500" },
    { status: "IN PROGRESS", statusColor: "text-yellow-500" },
    { status: "COMPLETED", statusColor: "text-green-500" },
  ];

  useEffect(() => {
    const generateRandomData = (length) => {
      return Array.from({ length }, (_, i) => {
        const randomRegion =
          regions[Math.floor(Math.random() * regions.length)];
        const randomStatus =
          statuses[Math.floor(Math.random() * statuses.length)];
        return {
          id: (i + 1).toString().padStart(2, "0"),
          wo: `WO-95840${i + 30}`,
          region: randomRegion,
          status: randomStatus.status,
          statusColor: randomStatus.statusColor,
        };
      });
    };
    setData(generateRandomData(30));
  }, []);
  console.log("status filter", filterStatus);
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.wo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = filterRegion === "" || item.region === filterRegion;

    const matchesStatus = filterStatus === "" || item.status === filterStatus;

    return matchesSearch && matchesRegion && matchesStatus;
  });
  console.log("filteredData", filteredData);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentData = filteredData.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <>
      <Navbar currentPath={location.pathname} />
      <div className="flex-1 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">
            WO LISTING [{filteredData?.length}]
          </h1>
          <div className="flex space-x-4">
            <select
              className="border rounded-lg pl-4 pr-8 py-2"
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
            >
              <option value="">All Regions</option>
              {regions.map((region, index) => (
                <option key={index} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <select
              className="border rounded-lg pl-4 pr-8 py-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statuses.map((status, index) => (
                <option key={index} value={status.status}>
                  {status.status}
                </option>
              ))}
            </select>
            <div className="relative">
              <input
                type="text"
                className="border rounded-lg pl-10 pr-4 py-2"
                placeholder="DWA Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden p-4">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-3">NO.</th>
                <th className="py-2 px-4">Work order</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Region</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((wo, index) => (
                <tr key={wo.id} className={index % 1 === 0 ? "bg-gray-50" : ""}>
                  <td className="py-2 px-4 border-b">{wo.id}</td>
                  <td className="py-2 px-4 border-b text-red-500">{wo.wo}</td>
                  <td className={`py-2 px-4 border-b ${wo.statusColor}`}>
                    {wo.status}
                  </td>
                  <td className="py-2 px-4 border-b">{wo.region}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <ReactPaginate
              previousLabel={"<"}
              nextLabel={">"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"flex space-x-2"}
              activeClassName={"bg-red-500 text-white px-3 py-1 rounded"}
              pageClassName={"px-3 py-1 bg-gray-200 rounded cursor-pointer"}
              previousClassName={"px-3 py-1 bg-gray-300 rounded cursor-pointer"}
              nextClassName={"px-3 py-1 bg-gray-300 rounded cursor-pointer"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WOListing;
