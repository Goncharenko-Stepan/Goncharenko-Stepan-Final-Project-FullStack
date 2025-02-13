import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkJWTToken } from "../utils/apiUtils/authApi.js";

export const PrivateRoute = ({ children }) => {
  const [isNotAuthenticated, setIsNotAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleCheck = async () => {
      const response = await checkJWTToken();
      setIsNotAuthenticated(!response);
      setIsLoading(false);
    };
    handleCheck();
  }, [location.pathname]);
  if (isNotAuthenticated === null) return null;
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return isNotAuthenticated ? <Navigate to="/login" replace /> : children;
};
