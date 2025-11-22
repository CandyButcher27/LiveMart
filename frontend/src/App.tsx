import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import ProtectedRoute from "./routes/ProtectedRoute";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import MyOrdersPage from "./pages/customer/MyOrdersPage";
import FeedbackPage from "./pages/customer/FeedbackPage";
import ViewFeedbackPage from "./pages/customer/ViewFeedbackPage";

import RetailerDashboard from "./pages/retailer/RetailerDashboard";
import RetailerOrdersPage from "./pages/retailer/RetailerOrdersPage";
import RetailerProductsPage from "./pages/retailer/RetailerProductsPage";
import RetailerWholesaleOrdersPage from "./pages/retailer/RetailerWholesaleOrdersPage";
import BuyWholeSalePage from "./pages/retailer/BuyWholeSalePage";

import WholesalerDashboard from "./pages/wholesaler/WholesalerDashboard";
import WholesalerProductsPage from "./pages/wholesaler/WholesalerProductsPage";
import WholesalerOrdersPage from "./pages/wholesaler/WholesalerOrdersPage";

import { AuthProvider } from "./contexts/AuthContext";
import ProxyWholesalePage from "./pages/customer/ProxyWholeSalePage";

function AppContent() {
  return (
    <Routes>

      {/* Root → default landing page */}
      <Route path="/" element={<Navigate to="/customer" replace />} />

      {/* Auth routes */}
      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* All protected routes inside layout */}
      <Route element={<Layout />}>

        {/* CUSTOMER */}
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
          path="/customer/feedback"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/feedback/view"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <ViewFeedbackPage />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMER PROXY WHOLESALE ACCESS */}
        <Route
          path="/customer/proxy-wholesale"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <ProxyWholesalePage />
            </ProtectedRoute>
          }
        />

        {/* RETAILER */}
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
          path="/retailer/wholesale-orders"
          element={
            <ProtectedRoute allowedRoles={["retailer"]}>
              <RetailerWholesaleOrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/retailer/buy-wholesale"
          element={
            <ProtectedRoute allowedRoles={["retailer"]}>
              <BuyWholeSalePage />
            </ProtectedRoute>
          }
        />

        {/* WHOLESALER */}
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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
