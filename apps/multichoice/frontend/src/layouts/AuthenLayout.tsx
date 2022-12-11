import React, { useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';
import HeaderAuthen from '../components/Authen/HeaderAuthen/HeaderAuthen';
import { titleServices } from '../services/Title/TitleServices';

interface IAuthenLayout {
  children?: React.ReactNode;
}

const AuthenLayout: React.FC<IAuthenLayout> = ({ children }) => {
  useLayoutEffect(() => {
    return () => {
      titleServices.setTitle();
    };
  }, []);

  return (
    <div className="min-h-screen bg-authen bg-no-repeat bg-center">
      <HeaderAuthen />
      <main className="max-w-lg py-8 px-4 mx-auto">
        {children}
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenLayout;
