import React from "react";
import AdminLayout from "./components/AdminLayout";
import Courses from "./pages/Courses";
import Players from "./pages/Players";
import Reports from "./pages/Reports";
import AwardsClaims from "./pages/AwardsClaims";
import Settings from "./pages/Settings";

export const adminRoutes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Courses /> },           // default /admin -> Courses
      { path: "courses", element: <Courses /> },
      { path: "players", element: <Players /> },
      { path: "reports", element: <Reports /> },
      { path: "claims", element: <AwardsClaims /> },
      { path: "settings", element: <Settings /> },
    ],
  },
];
