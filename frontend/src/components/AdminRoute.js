import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(storedUser);

  if (user.cno.toUpperCase() !== "C0") {
    return <Navigate to="/search" replace />;
  }

  return children;
};

export default AdminRoute;
