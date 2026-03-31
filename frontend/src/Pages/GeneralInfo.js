import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Edit, Save } from "lucide-react";
import { useClientContext } from '../context/ClientContext';
import { useProject } from '../context/ProjectContext';
import { useToast } from "../context/ToastContext";
import rateListService from "../services/rateListService";

const InformationTables = () => {
  const navigate = useNavigate();
  const { clientList, addOrUpdateClient } = useClientContext();
  const { selectedProject } = useProject();
  const { showSuccess, showError, showInfo } = useToast();

  // Modal state
  const [isGeneralInfoModalOpen, setIsGeneralInfoModalOpen] = useState(false);
  const [isRateListModalOpen, setIsRateListModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);

  // State for editing client information
  const [editClientForm, setEditClientForm] = useState({
    clientName: '',
    projectNo: '',
    labourContractor: '',
    address: '',
    totalBudget: ''
  });

  // --- API: rate list state ---
  const [rateList, setRateList] = useState({
    id: null,
    head_mason_rate: 800,
    mason_rate: 800,
    m_helper_rate: 600,
    w_helper_rate: 400,
    column_barbending_rate: 0
  });
  const [rateListForm, setRateListForm] = useState({ ...rateList });
  const [rateListLoading, setRateListLoading] = useState(false);
  const [rateListError, setRateListError] = useState('');

  // Fetch rate list from API on mount
  useEffect(() => {
    const fetchRateList = async () => {
      setRateListLoading(true);
      setRateListError('');
      try {
        const res = await rateListService.getAll();
        // apiService uses fetch wrapper — returns response.json() directly, so res = { success, data: [] }
        const rows = res?.data ?? [];
        if (rows.length > 0) {
          setRateList(rows[0]);
          setRateListForm(rows[0]);
        }
      } catch (e) {
        console.error("[InformationTables] fetchRateList error:", e);
        setRateListError('Failed to load rate list');
        // Keep default values on error — no mock fallback
      } finally {
        setRateListLoading(false);
      }
    };
    fetchRateList();
  }, []);

  // Handle saving rate list
  const handleSaveRateList = async (e) => {
    e.preventDefault();
    try {
      if (rateList.id) {
        // Update existing rate list
        await rateListService.update(rateList.id, {
          project_id: selectedProject?.id ?? rateList.project_id,
          head_mason_rate: Number(rateListForm.head_mason_rate),
          mason_rate: Number(rateListForm.mason_rate),
          m_helper_rate: Number(rateListForm.m_helper_rate),
          w_helper_rate: Number(rateListForm.w_helper_rate),
          column_barbending_rate: Number(rateListForm.column_barbending_rate ?? 0)
        });
      } else {
        // Create new rate list
        await rateListService.create({
          project_id: selectedProject?.id ?? 1,
          head_mason_rate: Number(rateListForm.head_mason_rate),
          mason_rate: Number(rateListForm.mason_rate),
          m_helper_rate: Number(rateListForm.m_helper_rate),
          w_helper_rate: Number(rateListForm.w_helper_rate),
          column_barbending_rate: Number(rateListForm.column_barbending_rate ?? 0)
        });
      }
      setRateList({ ...rateList, ...rateListForm });
      showSuccess('Rate list updated successfully!');
      setIsRateListModalOpen(false);
    } catch (e) {
      console.error("[InformationTables] saveRateList error:", e);
      showError('Failed to save rate list. Please try again.');
    }
  };

  // Find the client for the selected project
  let clientInfo = null;
  if (selectedProject) {
    clientInfo = clientList.find(client => (client.projects || []).includes(selectedProject.name));
  }

  // Check if client info is locked (already exists and has data)
  const isClientInfoLocked = () => {
    return clientInfo && clientInfo.clientName && clientInfo.clientName.trim() !== '';
  };

  // Handle opening edit client modal
  const handleEditClient = () => {
    // Prevent editing if client info is already locked
    if (isClientInfoLocked()) {
      showInfo('Client information cannot be modified once it has been set. This ensures data integrity.');
      return;
    }

    if (clientInfo) {
      setEditClientForm({
        clientName: clientInfo.clientName || '',
        projectNo: clientInfo.projectNo || '',
        labourContractor: clientInfo.labourContractor || '',
        address: clientInfo.address || '',
        totalBudget: clientInfo.totalBudget || ''
      });
    } else {
      setEditClientForm({
        clientName: '',
        projectNo: selectedProject?.id ? `#${selectedProject.id}` : '',
        labourContractor: '',
        address: '',
        totalBudget: selectedProject?.budget || ''
      });
    }
    setIsEditClientModalOpen(true);
  };

  // Handle saving client information
  const handleSaveClient = (e) => {
    e.preventDefault();

    if (!editClientForm.clientName.trim()) {
      showError('Please enter a client name');
      return;
    }

    if (!selectedProject) {
      showError('Please select a project first');
      return;
    }

    const updatedClient = {
      ...editClientForm,
      projects: [selectedProject.name]
    };

    addOrUpdateClient(updatedClient);

    // Show different message based on whether this is first time or update
    if (!clientInfo || !clientInfo.clientName) {
      showSuccess('Client information saved successfully! Note: This information is now locked and cannot be modified to ensure data integrity.');
    } else {
      showSuccess('Client information updated successfully!');
    }

    setIsEditClientModalOpen(false);
  };

  // Prepare dynamic data for display
  const getDisplayData = () => {
    if (!selectedProject) {
      return [
        ["Project", "No project selected"],
        ["Name Of Client", "Please select a project"],
        ["Project No.", "-"],
        ["Labour Contractor", "-"],
        ["Address", "-"],
        ["Total Budget", "-"],
        ["Start Date", "-"],
        ["End Date", "-"],
        ["Status", "-"],
        ["Completion", "-"]
      ];
    }

    return [
      ["Project Name", selectedProject.name || "-"],
      ["Name Of Client", clientInfo?.clientName || "Not assigned"],
      ["Project No.", clientInfo?.projectNo || selectedProject.id ? `#${selectedProject.id}` : "-"],
      ["Labour Contractor", clientInfo?.labourContractor || "Not assigned"],
      ["Address", clientInfo?.address || "Not provided"],
      ["Total Budget", selectedProject.budget || clientInfo?.totalBudget || "-"],
      ["Start Date", selectedProject.startDate || "-"],
      ["End Date", selectedProject.endDate || "-"],
      ["Status", selectedProject.status || "-"],
      ["Completion", selectedProject.completion ? `${selectedProject.completion}%` : "-"]
    ];
  };

  const displayData = getDisplayData();

  return (
    <div className="bg-gradient-to-b from-gray-200 to-gray-400 p-6 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* General Information Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 rounded-t-lg flex-wrap gap-2">
            <h2 className="font-semibold text-lg text-gray-900">
              General Information
              {selectedProject && (
                <span className="text-sm font-normal text-gray-600 ml-2">
                  - {selectedProject.name}
                </span>
              )}

            </h2>
            {!selectedProject ? (
              <button
                className="bg-gray-400 text-white text-sm font-semibold px-4 py-2 rounded flex items-center gap-2 cursor-not-allowed"
                type="button"
                disabled
              >
                <Edit size={16} />
                Select Project First
              </button>
            ) : isClientInfoLocked() ? (
              <button
                className="bg-gray-500 text-white text-sm font-semibold px-4 py-2 rounded flex items-center gap-2 cursor-not-allowed"
                type="button"
                onClick={handleEditClient}
              >
                Client Info Locked
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded flex items-center gap-2"
                type="button"
                onClick={handleEditClient}
              >
                <Edit size={16} />
                Add Client Info
              </button>
            )}
          </div>

          {!selectedProject ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 mb-4">No project selected</p>
              <p className="text-sm text-gray-400 mb-6">
                Please select a project from the Projects page to view its general information.
              </p>
              <button
                onClick={() => navigate('/app/projects')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                Go to Projects
              </button>
            </div>
          ) : (
            <table className="w-full text-gray-700 text-sm">
              <tbody>
                {displayData.map(([label, value], index) => (
                  <tr
                    key={index}
                    className="border-b last:border-0 border-gray-200"
                  >
                    <td className="px-6 py-3 w-1/3 font-medium">{label}</td>
                    <td className="px-6 py-3 text-gray-900 flex items-center justify-between">
                      <span>{value}</span>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        {/* Edit Client Info Modal */}
        {isEditClientModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Client Information</h2>
                <button
                  onClick={() => setIsEditClientModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveClient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    value={editClientForm.clientName}
                    onChange={(e) => setEditClientForm({...editClientForm, clientName: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter client name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project No.
                  </label>
                  <input
                    type="text"
                    value={editClientForm.projectNo}
                    onChange={(e) => setEditClientForm({...editClientForm, projectNo: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter project number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Labour Contractor
                  </label>
                  <input
                    type="text"
                    value={editClientForm.labourContractor}
                    onChange={(e) => setEditClientForm({...editClientForm, labourContractor: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter labour contractor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={editClientForm.address}
                    onChange={(e) => setEditClientForm({...editClientForm, address: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter address"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Budget
                  </label>
                  <input
                    type="text"
                    value={editClientForm.totalBudget}
                    onChange={(e) => setEditClientForm({...editClientForm, totalBudget: e.target.value})}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter total budget (e.g., ₹ 10,00,000)"
                  />
                </div>

                {selectedProject && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Project:</strong> {selectedProject.name}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      This client information will be associated with the selected project.
                    </p>
                  </div>
                )}

                {(!clientInfo || !clientInfo.clientName) && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800 font-medium">
                      Important Notice
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Once you save this client information, it will be <strong>locked and cannot be modified</strong> to ensure data integrity and prevent accidental changes.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditClientModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Rate List Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 rounded-t-lg flex-wrap gap-2">
            <h2 className="font-semibold text-lg text-gray-900">Rate List</h2>
            <button
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded"
              type="button"
              onClick={() => {
                setRateListForm({ ...rateList });
                setIsRateListModalOpen(true);
              }}
            >
              Rate List
            </button>
          </div>

          {rateListError ? (
            <div className="px-6 py-3 text-sm text-red-600">{rateListError}</div>
          ) : null}

          <table className="w-full text-gray-700 text-sm">
            <tbody>
              {[
                ["Head Mason", rateListLoading ? "..." : rateList.head_mason_rate],
                ["Mason", rateListLoading ? "..." : rateList.mason_rate],
                ["M - Helper", rateListLoading ? "..." : rateList.m_helper_rate],
                ["W - Helper", rateListLoading ? "..." : rateList.w_helper_rate],
              ].map(([label, value], index) => (
                <tr
                  key={index}
                  className="border-b last:border-0 border-gray-200"
                >
                  <td className="px-6 py-3 w-1/3">{label}</td>
                  <td className="px-6 py-3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Rate List Modal */}
        {isRateListModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Rate List</h2>
                <button onClick={() => setIsRateListModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <form onSubmit={handleSaveRateList} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Head Mason (₹/day)</label>
                  <input
                    type="number"
                    min="0"
                    value={rateListForm.head_mason_rate}
                    onChange={(e) => setRateListForm({ ...rateListForm, head_mason_rate: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mason (₹/day)</label>
                  <input
                    type="number"
                    min="0"
                    value={rateListForm.mason_rate}
                    onChange={(e) => setRateListForm({ ...rateListForm, mason_rate: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">M - Helper (₹/day)</label>
                  <input
                    type="number"
                    min="0"
                    value={rateListForm.m_helper_rate}
                    onChange={(e) => setRateListForm({ ...rateListForm, m_helper_rate: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">W - Helper (₹/day)</label>
                  <input
                    type="number"
                    min="0"
                    value={rateListForm.w_helper_rate}
                    onChange={(e) => setRateListForm({ ...rateListForm, w_helper_rate: e.target.value })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsRateListModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Rates
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InformationTables;