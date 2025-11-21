// src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  allowedRoles?: string[];
  children: React.ReactElement;
};

const ProtectedRoute: React.FC<Props> = ({ allowedRoles, children }) => {
  const { isAuthenticated, role } = useAuth();

  // Not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Logged in but NOT allowed → redirect to correct dashboard
  if (allowedRoles && !allowedRoles.includes(role ?? "")) {
    if (role === "customer") return <Navigate to="/customer" replace />;
    if (role === "retailer") return <Navigate to="/retailer" replace />;
    if (role === "wholesaler") return <Navigate to="/wholesaler" replace />;
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
