import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router";
import { checkJWTToken } from "../utils/apiUtils/authApi.js";

export const AuthRoute = ({ children }) => {
  const [isNotAuthenticated, setIsNotAuthenticated] = useState(null);

  const authCheck = useMemo(() => {
    let cachedValue = null;
    return async () => {
      if (cachedValue !== null) {
        return cachedValue;
      }
      const response = await checkJWTToken();
      cachedValue = !response;
      return cachedValue;
    };
  }, []);

  useEffect(() => {
    const handleCheck = async () => {
      const result = await authCheck();
      setIsNotAuthenticated(result);
    };
    handleCheck();
  }, [authCheck]);
  if (isNotAuthenticated === null) {
    return;
  }
  return isNotAuthenticated ? children : <Navigate to="/" replace />;
};
