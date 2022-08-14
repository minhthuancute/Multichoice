import React from 'react';
import { Route } from 'react-router-dom';

interface IPrivateRoute {
  children: JSX.Element | JSX.Element[] | string | string[];
  rest: any;
}

const PrivateRoute: React.FC<IPrivateRoute> = ({ children, ...rest }) => {
  return <Route></Route>;
};
