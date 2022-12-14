/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { userStore } from '../../store/rootReducer';

interface IPrivateRoute {
  Component: React.FunctionComponent<any>;
  restricted?: boolean;
}

const PublicRoute: React.FC<IPrivateRoute> = ({
  Component,
  restricted = false,
}) => {
  const { isAuthenticated } = userStore();
  return isAuthenticated && restricted ? (
    <Navigate to="/" replace />
  ) : (
    <Component />
  );
};

export default PublicRoute;
