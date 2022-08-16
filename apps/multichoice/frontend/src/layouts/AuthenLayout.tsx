import React, { useLayoutEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeaderAuthen from '../components/Authen/HeaderAuthen';

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
  }, [location.pathname]);

  return (
    <div className="layout-authen min-h-screen bg-authen bg-no-repeat bg-center">
      <HeaderAuthen />
      <main className="max-w-lg xs:pt-12 md:pt-8 pb-24 px-4 mx-auto">
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
