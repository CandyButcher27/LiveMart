// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import RetailerDashboard from "./pages/retailer/RetailerDashboard";
import MyOrdersPage from "./pages/customer/MyOrdersPage";
import RetailerOrdersPage from "./pages/retailer/RetailerOrdersPage";
import RetailerProductsPage from "./pages/retailer/RetailerProductsPage";
import WholesalerDashboard from "./pages/wholesaler/WholesalerDashboard";
import WholesalerProductsPage from "./pages/wholesaler/WholesalerProductsPage";
import WholesalerOrdersPage from "./pages/wholesaler/WholesalerOrdersPage";
import BuyWholesalePage from "./pages/retailer/BuyWholesalePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* Auth */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />

      {/* Protected role routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <MyOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/retailer"
        element={
          <ProtectedRoute allowedRoles={["retailer"]}>
            <RetailerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/retailer/orders"
        element={
          <ProtectedRoute allowedRoles={["retailer"]}>
            <RetailerOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/retailer/products"
        element={
          <ProtectedRoute allowedRoles={["retailer"]}>
            <RetailerProductsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/retailer/buy-wholesale"
        element={
          <ProtectedRoute allowedRoles={["retailer"]}>
            <BuyWholesalePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wholesaler"
        element={
          <ProtectedRoute allowedRoles={["wholesaler"]}>
            <WholesalerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wholesaler/products"
        element={
          <ProtectedRoute allowedRoles={["wholesaler"]}>
            <WholesalerProductsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/wholesaler/orders"
        element={
          <ProtectedRoute allowedRoles={["wholesaler"]}>
            <WholesalerOrdersPage />
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}
