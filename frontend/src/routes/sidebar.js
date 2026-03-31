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
  },
  {
    path: "/app/generalinfo",
    icon: <BadgeInfo size={18} />,
    name: "General Info",
  },
  {
    path: "/app/clientpayments",
    icon: <CreditCard size={18} />,
    name: "Client Payments",
  },
  {
    path: "/app/drawings",
    icon: <DraftingCompass size={18} />,
    name: "Drawings",
  },
  {
    path: "/app/dwa",
    icon: <ListTodo size={18} />,
    name: "Daily Report",
  },
  {
    path: "/app/inventory",
    icon: <Boxes size={18} />,
    name: "Inventory",
  },
  {
    path: "/app/labourpayments",
    icon: <HandCoins size={18} />,
    name: "Labour Payments",
  },
];

export default sidebarroutes;
