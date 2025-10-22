// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AddMessForm from "./components/AddMessForm";
import FloatingButtons from "./components/FloatingButtons";
import AddMessButton from "./components/AddMessButton";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardRouter from "./pages/DashboardRouter";
import MessMenu from "./pages/MessMenu";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <FloatingButtons />

          <main>
            <Routes>
              {/* 🌐 Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* 🍱 Mess Menu Page (FIXED route path) */}
              <Route path="/messes/:mess_id" element={<MessMenu />} />

              {/* 🛒 Checkout Page */}
              <Route path="/checkout" element={<Checkout />} />

              {/* ➕ Add Mess (Protected) */}
              <Route
                path="/addmess"
                element={
                  <ProtectedRoute allowedRoles={["owner"]}>
                    <AddMessForm />
                  </ProtectedRoute>
                }
              />

              {/* 🔒 Unified Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />

              {/* 🚪 Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <AddMessButton />
          </main>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
