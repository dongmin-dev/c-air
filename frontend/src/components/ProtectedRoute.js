import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check for the user item in localStorage
  const user = localStorage.getItem("user");

  if (!user) {
    // If the user is not logged in, redirect them to the login page
    return <Navigate to="/" replace />;
  }

  // If the user is logged in, render the page they were trying to access
  return children;
};

export default ProtectedRoute;
