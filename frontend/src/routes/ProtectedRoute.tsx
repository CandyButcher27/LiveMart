// src/routes/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  allowedRoles?: string[]; // e.g. ['retailer']
  children: React.ReactElement;
};

const ProtectedRoute: React.FC<Props> = ({ allowedRoles, children }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role ?? "")) {
    // Optionally redirect to a default page for your role or login
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
