// src/routes/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthProvider";
import type { ReactElement } from "react";

export default function ProtectedRoute({
  children,
  role,
}: {
  children: ReactElement;
  role?: "seeker" | "employer";
}) {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!session) {
    return (
      <Navigate
        to={`/auth?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (role && profile?.role && profile.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
