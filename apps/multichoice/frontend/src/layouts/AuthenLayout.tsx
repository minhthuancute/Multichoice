import React, { useLayoutEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeaderAuthen from '../components/Authen/HeaderAuthen';
import { titleServices } from '../services/TitleServices';

interface ILayout {
  children?: React.ReactNode;
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

    return () => {
      titleServices.setTitle();
    };
  }, [location.pathname]);

  return (
    <div className="layout-authen min-h-screen bg-authen bg-no-repeat bg-center">
      <HeaderAuthen />
      <main className="max-w-lg py-8 px-4 mx-auto">
        {children}
        <div className="text-center xs:block md:hidden mt-10">
          {isLoginPage ? (
            <p className="text-sm">
              Don't have account ?
              <Link
                to="/register"
                className="inline-block ml-1 text-primary-900"
              >
                Sign up now !
              </Link>
            </p>
          ) : (
            <p className="text-sm">
              Already have an account ?
              <Link to="/login" className="inline-block ml-1 text-primary-900">
                Log in !
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AuthenLayout;
