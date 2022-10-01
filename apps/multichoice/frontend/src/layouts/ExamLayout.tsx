import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Home/Header';

interface ILayout {
  children?: React.ReactNode;
}

const ExamLayout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className="authen-default">
      <Header />
      <main className="layout-authen__main">{children}</main>
      <Outlet />
    </div>
  );
};

export default ExamLayout;
