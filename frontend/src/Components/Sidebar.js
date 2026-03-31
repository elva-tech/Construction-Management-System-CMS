import React from "react";
import { Home, ClipboardList, FileText, List, LogOut } from "lucide-react";
import logo1 from "../Images/logo1.png";
import sidebarroutes from "../routes/sidebar";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import elvalogo from "../Images/elva-logo-1.png";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const { logout, user } = useAuth();
  const { selectedProject } = useProject();

  // Log the current path for debugging
  console.log('Current path:', location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get the current project ID from URL or selected project
  const getCurrentProjectId = () => {
    if (projectId) return projectId;
    if (selectedProject) return selectedProject.id.toString();
    return null;
  };

  // Generate project-specific route path
  const getProjectRoute = (basePath) => {
    const currentProjectId = getCurrentProjectId();
    if (currentProjectId) {
      return `/app/project/${currentProjectId}${basePath.replace('/app', '')}`;
    }
    return basePath;
  };

  // Check if the current path matches the route path
  const isActive = (routePath) => {
    const projectSpecificPath = getProjectRoute(routePath);

    // Check both the original path and project-specific path
    return location.pathname === routePath ||
           location.pathname === projectSpecificPath ||
           location.pathname.startsWith(routePath + '/') ||
           location.pathname.startsWith(projectSpecificPath + '/');
  };

  // Handle navigation with project-specific routes
  const handleNavigation = (routePath) => {
    const targetPath = getProjectRoute(routePath);
    navigate(targetPath);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[201px] bg-[#669BBC] shadow-lg text-white flex flex-col p-4 rounded-r-2xl overflow-y-auto z-20">
      <div className="flex items-center justify-center mb-6 sticky top-0 bg-[#669BBC] pt-2 pb-4 z-10">
        <img
          src={logo1}
          alt="S B Patil Group Logo"
          className="w-[171px] h-[65px] max-w-full rounded-lg"
        />
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {sidebarroutes.map((route, index) => (
            <li key={index}>
              <div
                className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer text-md transition-all duration-200
                  ${isActive(route.path)
                    ? 'bg-white text-[#669BBC] font-semibold shadow-sm'
                    : 'text-black hover:bg-white/90 hover:text-[#669BBC]'
                  }`}
                onClick={() => handleNavigation(route.path)}
              >
                {route.icon} {route.name}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 sticky bottom-0 bg-[#669BBC] pb-2">
        <div className="flex items-center gap-4 mb-4 p-2 rounded-xl bg-white/10">
          <div className="w-10 h-10 bg-red-600 text-white flex items-center justify-center rounded-full">
            {user && user.name ? user.name.charAt(0) : 'A'}
          </div>
          <p className="text-lg font-semibold text-black">{user && user.name ? user.name : 'Abhishek U'}</p>
        </div>
        <button
          className="bg-red-600 w-full py-2 rounded-xl cursor-pointer hover:bg-red-700 text-lg flex items-center justify-center text-white transition-colors duration-200"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          LOGOUT
        </button>
      </div>
    </aside>
  );
}
