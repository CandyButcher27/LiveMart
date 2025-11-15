import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import RetailerDashboard from "./pages/retailer/RetailerDashboard";
import MyOrdersPage from "./pages/customer/MyOrdersPage";
import RetailerOrdersPage from "./pages/retailer/RetailerOrdersPage";
import RetailerProductsPage from "./pages/retailer/RetailerProductsPage";
import RetailerWholesaleOrdersPage from "./pages/retailer/RetailerWholesaleOrdersPage";
import WholesalerDashboard from "./pages/wholesaler/WholesalerDashboard";
import WholesalerProductsPage from "./pages/wholesaler/WholesalerProductsPage";
import WholesalerOrdersPage from "./pages/wholesaler/WholesalerOrdersPage";
import BuyWholeSalePage from "./pages/retailer/BuyWholeSalePage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// A component to handle redirection based on authentication status
function AuthRedirect() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Don't redirect if we're still loading auth state
  if (loading) {
    return null; // or a loading spinner
  }

  // Don't redirect if we're already on an auth page
  if (location.pathname.startsWith("/auth/")) {
    return null;
  }

  // Only redirect to login if not on an auth page and not logged in
  if (!currentUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Default redirect for logged-in users (only if not already on a protected route)
  if (
    !location.pathname.startsWith("/customer") &&
    !location.pathname.startsWith("/retailer") &&
    !location.pathname.startsWith("/wholesaler")
  ) {
    return <Navigate to="/customer" replace />;
  }

  return null;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<AuthRedirect />} />

      {/* Auth pages with their own layout */}
      <Route path="/auth">
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* All other routes with main layout */}
      <Route element={<Layout />}>
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

        {/* Fallback route */}
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
