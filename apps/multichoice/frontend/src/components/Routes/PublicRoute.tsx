/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLogin } from '../../utils/check_logged';

interface IPrivateRoute {
  Component: React.FunctionComponent<any>;
  restricted?: boolean;
}

const PublicRoute: React.FC<IPrivateRoute> = ({
  Component,
  restricted = false,
}) => {
  const loggedIn = isLogin();

  return loggedIn && restricted ? <Navigate to="/" replace /> : <Component />;
};

export default PublicRoute;
