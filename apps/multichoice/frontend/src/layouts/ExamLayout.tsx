import React from 'react';
import { Outlet } from 'react-router-dom';

interface ILayout {
  children?: React.ReactNode;
}

const ExamLayout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className="authen-default">
      <main className="layout-authen__main">{children}</main>
      <Outlet />
    </div>
  );
};

export default ExamLayout;
