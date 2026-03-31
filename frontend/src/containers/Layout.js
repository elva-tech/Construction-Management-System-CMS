import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import MobileNav from "../Components/MobileNav";
import pageroutes from "../routes/index";
import Page404 from "../Pages/Page404";
import PageTransition from "../Components/common/PageTransition";
import { AnimatePresence } from "framer-motion";

const Layout = () => {
  const location = useLocation();
  const isProjectsPage = location.pathname === "/app/projects";

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
                element: React.createElement(Navigate, { to: "/app/projects", replace: true })
              }),
              pageroutes.map((route, index) =>
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
