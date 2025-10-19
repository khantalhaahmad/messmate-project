// src/pages/DashboardRouter.jsx
import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import UserDashboard from "./UserDashboard";
import OwnerDashboard from "./OwnerDashboard";

const DashboardRouter = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role || localStorage.getItem("role");

  if (role === "owner") {
    return <OwnerDashboard />;
  } else if (role === "student") {
    return <UserDashboard />;
  } else {
    window.location.href = "/login"; // not logged in or invalid role
    return null;
  }
};

export default DashboardRouter;
