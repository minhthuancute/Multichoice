import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Home/Header';

interface ILayout {
  children?: React.ReactNode;
}

const DefaultLayout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className="layout-default">
      <Header />
      <main className="layout-default__main">
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;
