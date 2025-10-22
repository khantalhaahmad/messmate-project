import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminOwners from "./pages/AdminOwners";
import AdminRevenueReport from "./pages/AdminRevenueReport";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* 🧭 Floating UI Elements (Global) */}
        <FloatingButtons />

        <main>
          <Routes>
            {/* 🌐 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 🍱 Mess Menu (Student/Visitor) */}
            <Route path="/messes/:mess_id" element={<MessMenu />} />

            {/* 🛒 Checkout */}
            <Route path="/checkout" element={<Checkout />} />

            {/* ➕ Add Mess (Only for Owners) */}
            <Route
              path="/addmess"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <AddMessForm />
                </ProtectedRoute>
              }
            />

            {/* 🎯 Unified Dashboard (Student / Owner) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["student", "owner", "messowner"]}>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />

            {/* 🧑‍💼 ADMIN DASHBOARD */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 🎓 STUDENTS PAGE */}
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminStudents />
                </ProtectedRoute>
              }
            />

            {/* 👨‍🍳 OWNERS PAGE */}
            <Route
              path="/admin/owners"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminOwners />
                </ProtectedRoute>
              }
            />

            {/* 📈 REVENUE REPORT */}
            <Route
              path="/admin/revenue-report"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminRevenueReport />
                </ProtectedRoute>
              }
            />

            {/* 🚪 Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* ✅ Floating Add Mess Button (Owners Only) */}
          <AddMessButton />
        </main>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
