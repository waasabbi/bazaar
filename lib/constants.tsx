import {
    LayoutDashboard,
    Shapes,
    ShoppingBag,
    Tag,
    UsersRound,
} from "lucide-react";
  
  export const navLinks = [
    // {
    //   url: "/",
    //   icon: <LayoutDashboard />,
    //   label: "Dashboard",
    // },
    // {
    //   url: "/dashboard",
    //   icon: <LayoutDashboard />,
    //   label: "Dashboard 4 Real",
    // },
    {
      url: "/collections",
      icon: <Shapes />,
      label: "Collections",
    },
    {
      url: "/products",
      icon: <Tag />,
      label: "Products",
    },
    {
      url: "/orders",
      icon: <ShoppingBag />,
      label: "Orders",
    },
    {
      url: "/customers",
      icon: <UsersRound />,
      label: "Customers",
    },
  ];