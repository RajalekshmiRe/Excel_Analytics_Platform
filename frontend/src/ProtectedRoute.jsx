// // src/ProtectedRoute.jsx
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = () => {
//   const token = localStorage.getItem("token");

//   if (!token) return <Navigate to="/login" />;

//   return <Outlet />; // Renders nested routes if logged in
// };

// export default ProtectedRoute;
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem('token'); // check if user is logged in

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the nested route(s)
  return <Outlet />;
};

export default ProtectedRoute;
