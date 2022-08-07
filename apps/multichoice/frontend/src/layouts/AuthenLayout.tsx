import React, { useLayoutEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ILayout {
  children?: JSX.Element | JSX.Element[] | string | string[];
}

const AuthenLayout: React.FC<ILayout> = ({ children }) => {
  const location = useLocation();
  const [isLoginPage, setIsLoginPage] = useState<boolean>(true);

  useLayoutEffect(() => {
    const currentPath = location.pathname;
    const isLoginPage = currentPath.includes('/login');
    if (!isLoginPage) {
      setIsLoginPage(false);
    }
  }, [location.pathname]);

  return (
    <div className="layout-authen min-h-screen bg-login bg-no-repeat bg-center">
      <header className="header px-10 pt-5 flex items-center justify-between">
        <h1 className="logo font-semibold text-2xl">
          <Link to="/">MultiChoice</Link>
        </h1>
        {isLoginPage ? (
          <p className="text-sm">
            Don't have account ?
            <Link to="/register" className="inline-block ml-1 text-primary">
              Sign up now !
            </Link>
          </p>
        ) : (
          <p className="text-sm">
            Already have an account ?
            <Link to="/login" className="inline-block ml-1 text-primary">
              Log in !
            </Link>
          </p>
        )}
      </header>
      <main className="max-w-lg pt-8 pb-24 mx-auto">{children}</main>
    </div>
  );
};

export default AuthenLayout;
