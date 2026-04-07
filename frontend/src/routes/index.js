import { lazy } from "react";

const DailyReport = lazy(() => import("../Pages/DailyReport.js"));
const DailyReportHistory = lazy(() => import("../Pages/DailyReportHistory.js"));
const Inventory = lazy(() => import("../Pages/Inventory.js"));
const Billing = lazy(() => import("../Pages/Billing.js"));
const Indent = lazy(() => import("../Pages/Indent.js"));
const Dashboard = lazy(() => import("../Pages/Dashboard.js"));
const WOListing = lazy(() => import("../Pages/WOListing.js"));
const LabourPayments = lazy(() => import("../Pages/LabourPayment.js"));
const ClientPayments = lazy(() => import("../Pages/ClientPayments.js"));
const AddClientPayment = lazy(() => import("../Pages/AddClientPayment.js"));
const Projects = lazy(() => import("../Pages/Projects.js"));
const MaterialTrackingDetails = lazy(() => import("../Pages/MaterialTrackingDetails.js"));
const GeneralInfo = lazy(() => import("../Pages/GeneralInfo.js"));

const pageroutes = [
  {
    path: "/app/projects",
    component: Projects,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/dwa",
    component: DailyReport,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/daily-report/history/:date",
    component: DailyReportHistory,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/daily-report/history",
    component: DailyReportHistory,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/inventory",
    component: Inventory,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/drawings",
    component: Billing,
    roles: ["admin", "supervisor", "client"]
  },
  {
    path: "/app/generalinfo",
    component: GeneralInfo,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/dashboard",
    component: Dashboard,
    roles: ["admin", "supervisor", "client"] 
  },
  {
    path: "/app/project/:projectId/dashboard",
    component: Dashboard,
    roles: ["admin", "supervisor", "client"]
  },
  {
    path: "/app/project/:projectId/dwa",
    component: DailyReport,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/project/:projectId/daily-report/history/:date",
    component: DailyReportHistory,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/project/:projectId/daily-report/history",
    component: DailyReportHistory,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/project/:projectId/inventory",
    component: Inventory,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/project/:projectId/drawings",
    component: Billing,
    roles: ["admin", "supervisor", "client"]
  },
  {
    path: "/app/project/:projectId/generalinfo",
    component: GeneralInfo,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/project/:projectId/labourpayments",
    component: LabourPayments,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/project/:projectId/dwa/wo",
    component: WOListing,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/dwa/wo",
    component: WOListing,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/labourpayments",
    component: LabourPayments,
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/clientpayments",
    component: ClientPayments,
    roles: ["admin", "client"] //  supervisor removed
  },
  {
    path: "/app/clientpayments/add",
    component: AddClientPayment,
    roles: ["admin", "client"]
  },
  {
    path: "/app/project/:projectId/clientpayments",
    component: ClientPayments,
    roles: ["admin", "client"]
  },
  {
    path: "/app/project/:projectId/clientpayments/add",
    component: AddClientPayment,
    roles: ["admin", "client"]
  },
  {
    path: "/app/material-tracking/:particularName",
    component: MaterialTrackingDetails,
    roles: ["admin", "supervisor"]
  }
];

export default pageroutes;