import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import httpReqAsync from "../../services/httpReqAsync";
import useLocalStorageState from "../../util/useLocalStorageState";

const PrivateRoute = ({ children }) => {
  const [jwt] = useLocalStorageState("", "jwt");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    httpReqAsync(`api/v1/auth/validate?token=${jwt}`, "GET", jwt).then((isValid) => {
      setIsTokenValid(isValid);
      setIsLoading(false);
    });
  }, [jwt]);

  return isLoading ? (
    <div>Loading...</div>
  ) : isTokenValid ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
