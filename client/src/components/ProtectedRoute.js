import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { verifyAuth } from "../api/user";

const ProtectedRoute = () => {
  const { isAuthenticated, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        console.log("Starting authentication check...");
        const response = await verifyAuth();
        console.log("Authentication response:", response);

        if (response.status === 200) {
          login();
        } else {
          logout();
        }
      } catch (error) {
        console.error("Error verifying authentication:", error);
        logout(); // Ensure the user is logged out in case of an error
      } finally {
        setIsLoading(false); // Stop loading after the check
      }
    };

    console.log("Sending request to verify-auth endpoint...");
    checkAuthentication();
  }, [login, logout]);

  if (isLoading) {
    return <div>Loading...</div>; // Display a loading state
  }

  // Redirect to the main page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
