import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { httpReqAsync } from '../../services/httpReqAsync';
import useLocalStorageState from '../../util/useLocalStorageState';
import Loader from './Loader';

const PrivateRoute = ({ children }) => {
  const [jwt] = useLocalStorageState('', 'jwt');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (jwt) {
      httpReqAsync(`/api/v1/auth/validate?token=${jwt}`, 'GET', jwt).then(
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
    return (
      <div className="flex flex-col justify-center items-center pt-8">
        <Loader />
      </div>
    );
  }

  if (!isTokenValid) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
