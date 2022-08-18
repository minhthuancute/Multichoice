import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import Home from '../../pages/Home/Home';
import { isLogin } from '../../utils/Authen';

interface IPrivateRoute {
  Component: any;
  path?: string;
  isIndex?: boolean;
  rest?: any;
}

const PrivateRoute: React.FC<IPrivateRoute> = ({
  Component,
  isIndex = false,
  ...rest
}) => {
  const logged = isLogin();
  // element={logged ? <Component {...rest} /> : <Navigate to="/login" />}
  return logged ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
