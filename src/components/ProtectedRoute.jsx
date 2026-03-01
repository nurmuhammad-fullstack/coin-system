// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function RequireStudent({ children }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" replace />;
  if (currentUser.role !== "student") return <Navigate to="/teacher/students" replace />;
  return children;
}

export function RequireTeacher({ children }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" replace />;
  if (currentUser.role !== "teacher") return <Navigate to="/student/home" replace />;
  return children;
}
