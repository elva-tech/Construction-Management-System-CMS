import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import MobileNav from "../Components/MobileNav";
import pageroutes from "../routes/index";
import Page404 from "../Pages/Page404";
import PageTransition from "../Components/common/PageTransition";
import { AnimatePresence } from "framer-motion";

import { useAuth } from "../context/AuthContext";

const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) return null;

  if (user.roles.includes("admin")) {
    return <Navigate to="/app/dashboard" replace />;
  }

  if (user.roles.includes("supervisor")) {
    return <Navigate to="/app/dashboard" replace />;
  }

 if (user.roles.includes("client")) {
  return <Navigate to="/app/dashboard" replace />;
}

  return <Navigate to="/app/projects" replace />;
};

const Layout = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isProjectsPage = location.pathname === "/app/projects";

  if (location.pathname === "/app/projects" && user?.roles?.includes("client")) {
  return <Navigate to="/app/clientpayments" replace />;
}


  return React.createElement(
    'div',
    { className: "min-h-screen bg-gradient-to-b from-gray-200 to-gray-400" },
    !isProjectsPage && React.createElement(MobileNav, null),
    React.createElement(
      'div',
      { className: "flex min-h-screen" },
      !isProjectsPage && React.createElement(
        'div',
        { className: "hidden lg:block w-[201px] flex-shrink-0" },
        React.createElement(Sidebar, null)
      ),
      React.createElement(
        'main',
        { className: "flex-1 overflow-hidden" },
        React.createElement(
          AnimatePresence,
          { mode: "wait" },
          React.createElement(
            PageTransition,
            { key: location.pathname },
            React.createElement(
              Routes,
              { location: location },
              React.createElement(Route, {
                path: "/",
                element: React.createElement(RoleBasedRedirect, null)
              }),
              pageroutes
                .filter((route) => {
                  if (!route.roles) return true;
                  return route.roles.some(role => user?.roles?.includes(role));
                })
                .map((route, index) =>
                  React.createElement(Route, {
                    key: index,
                    path: route.path.replace('/app/', ''),
                    element: React.createElement(route.component)
                  })
                ),
              React.createElement(Route, {
                path: "*",
                element: React.createElement(Page404)
              })
            )
          )
        )
      )
    )
  );
};

export default Layout;
