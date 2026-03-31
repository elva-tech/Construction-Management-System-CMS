import React, { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo1 from "../Images/logo1.png";
import sidebarroutes from "../routes/sidebar";
import { useAuth } from "../context/AuthContext";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Check if the current path matches the route path
  const isActive = (routePath) => {
    // Special case for dashboard
    if (routePath === '/app/dashboard' && (location.pathname === '/app' || location.pathname === '/')) {
      return true;
    }
    // Special case for DWA
    if (routePath === '/app/dwa' && location.pathname === '/app') {
      return true;
    }
    // This will handle both exact matches and sub-routes
    return location.pathname === routePath || location.pathname.startsWith(routePath + '/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close menu after navigation
  };

  // Helper function to render icon
  const renderIcon = (icon) => {
    if (React.isValidElement(icon)) {
      return icon;
    }
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return <IconComponent size={20} />;
    }
    return null;
  };

  return (
    <div className="lg:hidden">
      {/* Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
          <img
            src={logo1}
            alt="Logo"
            className="h-8 w-auto"
          />
        </div>
        <button
          onClick={toggleMenu}
          className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#669BBC] rounded-lg"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-16">
          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto px-4 py-2">
            {sidebarroutes.map((route) => (
              <button
                key={route.path}
                onClick={() => handleNavigation(route.path)}
                className={`flex items-center w-full px-4 py-3 mb-2 text-left rounded-lg transition-colors duration-200 ${
                  isActive(route.path)
                    ? 'bg-[#669BBC] text-white'
                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                <span className="mr-3 flex-shrink-0">
                  {renderIcon(route.icon)}
                </span>
                <span className="text-base font-medium">{route.name}</span>
              </button>
            ))}
          </nav>

          {/* User Profile and Logout */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-white shadow-sm">
              <div className="w-10 h-10 bg-[#669BBC] text-white flex items-center justify-center rounded-full font-semibold">
                {user && user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user && user.name ? user.name : 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user && user.email ? user.email : 'user@example.com'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 font-medium"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
