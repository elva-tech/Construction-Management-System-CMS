import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Wallet, TrendingUp, DollarSign, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import { useToast } from "../context/ToastContext";
import NewProjectCard from "../Components/NewProjectCard";
import EditProjectModal from "../Components/EditProjectModal";
import AddProjectModal from "../Components/AddProjectModal";
import AddClientModal from '../Pages/Indent'; // or the correct path if AddClientModal is exported separately
import AddUserModal from '../Components/AddUserModal';
import { ClientProvider, useClientContext } from '../context/ClientContext';
import projectService from "../services/projectService";

// Utility function to format currency in Indian Rupees
const formatINR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

// Mock project data - in a real application, this would come from an API
// const projectsData = [
//   {
//     id: "MC001",
//     name: "Residential Complex",
//     status: "Active",
//     completion: 65,
//     budget: "₹ 15,00,000",
//     budgetValue: 1500000,
//     budgetSpent: 975000,
//     paymentsReceived: 800000,
//     startDate: "01 Jan 2025",
//     endDate: "30 Jun 2025",
//     color: "#4CAF50",
//     description: "Modern 3BHK villa construction with contemporary design",
//     location: "Whitefield, Bangalore",
//     owner: "Sai Elva"
//   },
//   {
//     id: "MC002",
//     name: "Commercial Tower",
//     status: "Active",
//     completion: 40,
//     budget: "₹ 18,00,000",
//     budgetValue: 1800000,
//     budgetSpent: 720000,
//     paymentsReceived: 600000,
//     startDate: "15 Dec 2024",
//     endDate: "15 Aug 2025",
//     color: "#2196F3",
//     description: "2BHK apartment renovation with modern amenities",
//     location: "Electronic City, Bangalore",
//     owner: "Sai Elva"
//   },
//   {
//     id: "MC003",
//     name: "Highway Extension",
//     status: "Active",
//     completion: 25,
//     budget: "₹ 11,25,000",
//     budgetValue: 1125000,
//     budgetSpent: 281250,
//     paymentsReceived: 225000,
//     startDate: "10 Jan 2025",
//     endDate: "10 Oct 2025",
//     color: "#FFC107",
//     description: "3-story commercial complex with retail and office spaces",
//     location: "JP Nagar, Bangalore",
//     owner: "Sai Elva"
//   },
//   {
//     id: "MC004",
//     name: "Hospital Building",
//     status: "Completed",
//     completion: 100,
//     budget: "₹ 17,00,000",
//     budgetValue: 1700000,
//     budgetSpent: 1700000,
//     paymentsReceived: 1700000,
//     startDate: "15 Oct 2024",
//     endDate: "15 Dec 2024",
//     color: "#9C27B0",
//     description: "Industrial warehouse with loading docks and storage facilities",
//     location: "Hosur Road, Bangalore",
//     owner: "Sai Elva"
//   },
//   {
//     id: "MC005",
//     name: "Shopping Mall",
//     status: "Active",
//     completion: 5,
//     budget: "₹ 11,00,000",
//     budgetValue: 1100000,
//     budgetSpent: 55000,
//     paymentsReceived: 44000,
//     startDate: "01 Mar 2025",
//     endDate: "01 Dec 2025",
//     color: "#FF5722",
//     description: "Premium 4BHK bungalow with swimming pool and landscaping",
//     location: "Koramangala, Bangalore",
//     owner: "Sai Elva"
//   },
//   {
//     id: "MC006",
//     name: "IT Park",
//     status: "Active",
//     completion: 0,
//     budget: "₹ 11,50,000",
//     budgetValue: 1150000,
//     budgetSpent: 0,
//     paymentsReceived: 0,
//     startDate: "15 Apr 2025",
//     endDate: "15 Nov 2025",
//     color: "#607D8B",
//     description: "Modern office complex with co-working spaces",
//     location: "Indiranagar, Bangalore",
//     owner: "Sai Elva"
//   }
// ];

// Stats Card Component
const StatsCard = ({ title, value, subtitle, icon: Icon, color, bgGradient }) => (
  <div className={`${bgGradient} rounded-lg p-4 text-white shadow-lg`}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon size={20} />
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
      </div>
    </div>
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-xs opacity-80">{subtitle}</div>
  </div>
);

// Helper to map raw API project to UI shape
const mapApiProject = (p, index) => {
  const colors = ["#4CAF50", "#2196F3", "#FFC107", "#9C27B0", "#FF5722", "#607D8B"];
  const budgetValue = Number(p.total_budget ?? 0);
  const budgetSpent = Number(p.budget_spent ?? 0);
  const completion = Number(p.completion_percentage ?? 0);

  // Format date from YYYY-MM-DD to DD MMM YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return {
    id: p.id,
    name: p.name ?? '',
    status: p.status ?? 'Active',
    completion,
    budget: budgetValue ? `₹ ${budgetValue.toLocaleString('en-IN')}` : '₹ 0',
    budgetValue,
    budgetSpent,
    // paymentsReceived is not in Project table — will come from Payment table later
    paymentsReceived: 0,
    startDate: formatDate(p.start_date),
    endDate: formatDate(p.end_date),
    color: colors[index % colors.length],
    description: p.address ?? '',
    location: p.address ?? '',
    owner: p.client_name ?? p.admin_name ?? ''
  };
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const { selectProject, selectedProject } = useProject();
  const { showSuccess, showError, showInfo } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [clientList, setClientList] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const { addOrUpdateClient } = useClientContext();

  // Fetch projects from API on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.getAll();
        console.log("[ProjectsPage] API response:", res);
        // apiService uses fetch wrapper — res = { success, data: [] } directly
        const rows = res?.data ?? [];
        const mapped = rows.map((p, idx) => mapApiProject(p, idx));
        setProjects(mapped);
        setFilteredProjects(mapped);
      } catch (e) {
        console.error("[ProjectsPage] fetch error:", e);
        // On error show empty — no mock fallback in production
        setProjects([]);
        setFilteredProjects([]);
      }
    };
    fetchProjects();
  }, []);

  // Calculate cumulative stats
  const calculateStats = () => {
    const totalBudget = projects.reduce((sum, project) => sum + project.budgetValue, 0);
    const totalSpent = projects.reduce((sum, project) => sum + project.budgetSpent, 0);
    const totalReceived = projects.reduce((sum, project) => sum + project.paymentsReceived, 0);
    const existingBalance = totalBudget - totalSpent;
    const balanceToBePaid = totalSpent - totalReceived;

    // Calculate percentages
    const existingBalancePercent = totalBudget > 0 ? ((existingBalance / totalBudget) * 100).toFixed(1) : 0;
    const paymentsReceivedPercent = totalBudget > 0 ? ((totalReceived / totalBudget) * 100).toFixed(1) : 0;
    const budgetSpentPercent = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(1) : 0;
    const balanceToBePaidPercent = totalBudget > 0 ? ((balanceToBePaid / totalBudget) * 100).toFixed(1) : 0;

    return {
      existingBalance,
      paymentsReceived: totalReceived,
      budgetSpent: totalSpent,
      balanceToBePaid,
      existingBalancePercent,
      paymentsReceivedPercent,
      budgetSpentPercent,
      balanceToBePaidPercent
    };
  };

  const stats = calculateStats();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Filter projects based on search term and status
  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [searchTerm, statusFilter, projects]);

  // Handle project selection
  const handleProjectSelect = (project) => {
    // Store selected project using context
    selectProject(project);
    // Navigate to project-specific dashboard
    navigate(`/app/project/${project.id}/dashboard`);
  };

  // Handle project edit
  const handleProjectEdit = (project) => {
    setEditingProject(project);
    setEditModalOpen(true);
  };

  // Handle project save
  const handleProjectSave = async (updatedProject) => {
    try {
      await projectService.update(updatedProject.id, {
        name: updatedProject.name,
        address: updatedProject.location,
        total_budget: updatedProject.budgetValue,
        status: updatedProject.status,
        start_date: updatedProject.startDate,
        end_date: updatedProject.endDate,
        budget_spent: updatedProject.budgetSpent,
        completion_percentage: updatedProject.completion,
        updated_by: user?.id ?? ''
      });
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === updatedProject.id ? updatedProject : project
        )
      );
      showSuccess(`Project "${updatedProject.name}" updated successfully!`);
    } catch (e) {
      console.error("[handleProjectSave] error:", e);
      showError('Failed to update project. Please try again.');
    }
  };

  // Handle project delete
  const handleProjectDelete = async (projectId) => {
    const deletedProject = projects.find(project => project.id === projectId);
    try {
      await projectService.delete(projectId);
      setProjects(prevProjects =>
        prevProjects.filter(project => project.id !== projectId)
      );
      showSuccess(`Project "${deletedProject?.name || 'Unknown'}" deleted successfully!`);
    } catch (e) {
      console.error("[handleProjectDelete] error:", e);
      showError('Failed to delete project. Please try again.');
    }
  };

  // Handle add project
  const handleAddProject = () => {
    setAddModalOpen(true);
  };

  // Handle project add save
  const handleProjectAdd = async (newProject) => {
    try {
      const payload = {
  name: newProject.name,
  client_id: 1,   // MUST come from modal
  address: newProject.location,
  total_budget: newProject.budgetValue,
  status: newProject.status ?? 'Active',
  start_date: newProject.startDate ?? null,
  end_date: newProject.endDate ?? null,
  budget_spent: newProject.budgetSpent ?? 0,
  completion_percentage: newProject.completion ?? 0,
  created_by: 1,
  admin_id: 1
};

const res = await projectService.create(payload);
      // apiService fetch wrapper — res = { success, data: {...} }
      const created = mapApiProject(res?.data ?? newProject, projects.length);
      setProjects(prevProjects => [...prevProjects, created]);
      showSuccess(`Project "${newProject.name}" created successfully!`);
    } catch (e) {
      console.error("[handleProjectAdd] error:", e);
      showError('Failed to create project. Please try again.');
    }
  };

  // Function to get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout(); // Clear authentication state from Keycloak
      navigate("/login"); // Navigate to login page
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate to login anyway, even if logout fails
      navigate("/login");
    }
  };

  const handleAddClient = (client) => {
    setClientList((prev) => [...prev, client]);
  };

  const handleAddUser = async (userData) => {
    try {
      // Validate required fields
      if (!userData.projects || userData.projects.length === 0) {
        showError('Please select at least one project for the user.');
        return;
      }

      // Create user account via backend API
      console.log('Creating new user:', userData);

      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const result = await response.json();

      if (!result.success) {
        showError(result.error || 'Failed to create user');
        return;
      }

      console.log('User created successfully:', result.data.user);

      // Store user data in localStorage for immediate UI updates
      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('cms_users')) || [];
      } catch (e) {
        users = [];
      }
      users.push(result.data.user);
      localStorage.setItem('cms_users', JSON.stringify(users));

      // If it's a client, also add to client context
      if (userData.role === 'client') {
        const newClient = {
          clientName: userData.name,
          email: userData.email,
          phone: userData.phone,
          projectNo: '',
          labourContractor: '',
          address: '',
          totalBudget: '',
          projects: userData.projects
        };
        addOrUpdateClient(newClient);
      }

      showSuccess(`${userData.role === 'supervisor' ? 'Supervisor' : 'Client'} "${userData.name}" has been created successfully!`);

      // Log user creation for admin reference
      console.log('User created:', {
        name: userData.name,
        username: userData.username,
        role: userData.role,
        projects: userData.projects,
        loginInstructions: `User can be managed through admin panel. Username: ${userData.username}, Password: ${userData.password}`
      });

    } catch (error) {
      console.error('Error creating user:', error);
      showError('Failed to create user. Please try again.');
    }
  };

  return (
    <>
      {/* Navbar Section */}
      <div className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate pr-4">
              {getGreeting()} {user?.name || 'User'}!
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-xs sm:text-sm font-medium min-w-0 flex-shrink-0"
                aria-label="Add User"
              >
                Add User
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors text-xs sm:text-sm font-medium min-w-0 flex-shrink-0"
                aria-label="Logout"
              >
                <span className="hidden xs:inline sm:inline">Logout</span>
                <span className="xs:hidden sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-gray-200 to-gray-400 p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 lg:mb-0">
              Construction Projects
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-initial">
                <input
                  type="text"
                  className="border border-gray-300 rounded-full pl-10 pr-4 py-2.5 w-full sm:w-64 lg:w-72 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] focus:border-transparent"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>

              {/* Status Filter */}
              <select
                className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7BAFD4] focus:border-transparent min-w-0 flex-1 sm:flex-initial"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Projects</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Add Project Button */}
              <button
                onClick={handleAddProject}
                className="flex items-center justify-center gap-2 bg-[#7BAFD4] hover:bg-[#5A8CAB] text-white px-3 sm:px-4 py-2.5 rounded-lg transition-colors text-sm font-medium min-h-[44px] touch-manipulation"
                aria-label="Add new project"
              >
                <Plus size={16} />
                <span className="hidden xs:inline">Add Project</span>
                <span className="xs:hidden">Add</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Existing Balance"
              value={formatINR(stats.existingBalance)}
              subtitle={`${stats.existingBalancePercent}% of Total Budget`}
              icon={Wallet}
              color="#4CAF50"
              bgGradient="bg-gradient-to-br from-blue-400 to-blue-600"
            />
            <StatsCard
              title="Payments Received"
              value={formatINR(stats.paymentsReceived)}
              subtitle={`${stats.paymentsReceivedPercent}% of Total Budget`}
              icon={TrendingUp}
              color="#2196F3"
              bgGradient="bg-gradient-to-br from-green-400 to-green-600"
            />
            <StatsCard
              title="Budget Spent"
              value={formatINR(stats.budgetSpent)}
              subtitle={`${stats.budgetSpentPercent}% of Total Budget`}
              icon={DollarSign}
              color="#FFC107"
              bgGradient="bg-gradient-to-br from-yellow-400 to-orange-500"
            />
            <StatsCard
              title="Balance To Be Paid"
              value={formatINR(stats.balanceToBePaid)}
              subtitle={`${stats.balanceToBePaidPercent}% of Total Budget`}
              icon={AlertCircle}
              color="#FF5722"
              bgGradient="bg-gradient-to-br from-red-400 to-pink-500"
            />
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="flex justify-center">
                <NewProjectCard
                  project={project}
                  onSelect={handleProjectSelect}
                  onDelete={(id) => {
                    handleProjectDelete(id);
                    setDeletingProjectId(null);
                  }}
                  onEdit={(proj) => {
                    handleProjectEdit(proj);
                    setDeletingProjectId(null);
                  }}
                  deletingProjectId={deletingProjectId}
                  setDeletingProjectId={setDeletingProjectId}
                />
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-10 sm:py-16">
              <p className="text-gray-600 text-sm sm:text-base px-4">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleProjectSave}
        project={editingProject}
      />

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleProjectAdd}
      />

      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onAdd={handleAddClient}
        existingClients={clientList.map(c => c.clientName)}
      />

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onAdd={handleAddUser}
        projects={projects}
      />
    </>
  );
};

export default ProjectsPage;