import {
  ChartColumnBig,
  BriefcaseBusiness,
  Boxes,
  ReceiptIndianRupee,
  DraftingCompass,
  BadgeInfo,
  HandCoins,
  ListTodo,
  CreditCard,
} from "lucide-react";

const sidebarroutes = [
  {
    path: "/app/dashboard",
    icon: <ChartColumnBig size={18} />,
    name: "Dashboard",
    roles: ["admin", "supervisor", "client"] 
  },
  {
    path: "/app/generalinfo",
    icon: <BadgeInfo size={18} />,
    name: "General Info",
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/clientpayments",
    icon: <CreditCard size={18} />,
    name: "Client Payments",
    roles: ["admin", "client"] //  supervisor removed
  },
  {
    path: "/app/drawings",
    icon: <DraftingCompass size={18} />,
    name: "Drawings",
    roles: ["admin", "supervisor", "client"]
  },
  {
    path: "/app/dwa",
    icon: <ListTodo size={18} />,
    name: "Daily Report",
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/inventory",
    icon: <Boxes size={18} />,
    name: "Inventory",
    roles: ["admin", "supervisor"]
  },
  {
    path: "/app/labourpayments",
    icon: <HandCoins size={18} />,
    name: "Labour Payments",
    roles: ["admin", "supervisor"]
  },
];

export default sidebarroutes;