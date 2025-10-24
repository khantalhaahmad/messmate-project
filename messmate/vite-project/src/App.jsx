import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AddMessForm from "./components/AddMessForm";
import FloatingButtons from "./components/FloatingButtons";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardRouter from "./pages/DashboardRouter";
import MessMenu from "./pages/MessMenu";
import Checkout from "./pages/Checkout";
import DeliveryJoin from "./pages/DeliveryJoin";
import DeliveryPartners from "./pages/DeliveryPartners";
import PartnerLanding from "./pages/PartnerLanding"; // ✅ Zomato-style landing page

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminOwners from "./pages/AdminOwners";
import AdminRevenueReport from "./pages/AdminRevenueReport";
import AdminDeliveryAgents from "./pages/AdminDeliveryAgents";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* 🌟 Floating Buttons (Global UI) */}
        <FloatingButtons />

        <main>
          <Routes>
            {/* 🌐 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 🍱 Mess Menu */}
            <Route path="/messes/:mess_id" element={<MessMenu />} />

            {/* 🛒 Checkout */}
            <Route path="/checkout" element={<Checkout />} />

            {/* 🚴 Delivery Partner Routes */}
            <Route path="/delivery-partners" element={<DeliveryPartners />} />
            <Route path="/delivery-join" element={<DeliveryJoin />} />

            {/* 🏢 Mess Partner Routes */}
            <Route path="/partner-with-us" element={<PartnerLanding />} />
            <Route path="/addmess" element={<AddMessForm />} /> {/* ✅ Direct form */}

            {/* 🎯 User Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["student", "owner", "messowner"]}>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />

            {/* 🧑‍💼 Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/delivery-agents"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDeliveryAgents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/owners"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminOwners />
                </ProtectedRoute>
              }
            />
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
        </main>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
