import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { httpReqAsync } from "../../services/httpReqAsync";
import useLocalStorageState from "../../util/useLocalStorageState";

const PrivateRoute = ({ children }) => {
  const [jwt] = useLocalStorageState("", "jwt");
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (jwt) {
      httpReqAsync(`/api/v1/auth/validate?token=${jwt}`, "GET", jwt).then(
        (isValid) => {
          setIsTokenValid(isValid);
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  }, [jwt]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isTokenValid) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
