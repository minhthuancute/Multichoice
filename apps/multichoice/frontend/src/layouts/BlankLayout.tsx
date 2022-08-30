import React from 'react';
import { Outlet } from 'react-router-dom';

interface ILayout {
  children?: JSX.Element | JSX.Element[] | string | string[];
}

const BlankLayout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className="layout-blank min-h-screen bg-slate-200 bg-no-repeat bg-center">
      <main className="layout-blank">{children}</main>
      <Outlet />
    </div>
  );
};

export default BlankLayout;
