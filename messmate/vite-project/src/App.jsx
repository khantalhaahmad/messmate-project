import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

              {/* ➕ Add Mess Page (Protected) */}
              <Route
                path="/addmess"
                element={
                  <ProtectedRoute>
                    <AddMessForm />
                  </ProtectedRoute>
                }
              />

              {/* 🍱 Mess Menu Page (Important Fix: match backend param) */}
              <Route path="/messes/id/:mess_id" element={<MessMenu />} />

              {/* 🛒 Checkout Page */}
              <Route path="/checkout" element={<Checkout />} />

              {/* 🔒 Owner Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <AddMessButton />
          </main>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
