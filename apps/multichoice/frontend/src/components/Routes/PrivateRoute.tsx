import React from 'react';
import { Navigate } from 'react-router-dom';
import { userStore } from '../../store/rootReducer';

interface IPrivateRouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.FunctionComponent<any>;
}

const PrivateRoute: React.FC<IPrivateRouteProps> = ({ Component, ...rest }) => {
  const { isAuthenticated } = userStore();

  return isAuthenticated() ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default PrivateRoute;
