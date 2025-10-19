// src/components/ProtectedRoute.jsx
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // ✅ Check token OR context user
    const token = localStorage.getItem("token");
    if (token || user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  // 🕒 While checking auth (just once)
  if (isAuthenticated === null) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px", fontSize: "1.2rem" }}>
        Checking authentication...
      </div>
    );
  }

  // 🚪 Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ If authenticated, render the protected page
  return children;
};

export default ProtectedRoute;
