import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLogin } from '../../utils/Authen';

interface IPrivateRoute {
  Component: any;
  restricted?: boolean;
  rest?: any;
}

const PublicRoute: React.FC<IPrivateRoute> = ({
  Component,
  restricted = false,
  ...rest
}) => {
  const loggedIn = isLogin();

  if (loggedIn && restricted) {
    return <Navigate to="/" />;
  } else {
    return <Component {...rest} />;
  }
};

export default PublicRoute;
