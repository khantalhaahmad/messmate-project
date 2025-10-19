import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./pages/CartContext"; // ✅ fixed

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
import Checkout from "./pages/Checkout"; // ✅ this stays same

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

              {/* ➕ Add Mess Page */}
              <Route
                path="/addmess"
                element={
                  <ProtectedRoute>
                    <AddMessForm />
                  </ProtectedRoute>
                }
              />

              {/* 🍱 Mess Menu Page */}
              <Route path="/messes/id/:id" element={<MessMenu />} />

              {/* 🛒 Checkout */}
              <Route path="/checkout" element={<Checkout />} />

              {/* 🔒 Dashboard */}
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
