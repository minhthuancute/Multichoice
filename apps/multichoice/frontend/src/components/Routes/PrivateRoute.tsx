import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLogin } from '../../utils/check_logged';

interface IPrivateRouteProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.FunctionComponent<any>;
}

const PrivateRoute: React.FC<IPrivateRouteProps> = ({ Component, ...rest }) => {
  const loggedIn = isLogin();
  return loggedIn ? <Component {...rest} /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
