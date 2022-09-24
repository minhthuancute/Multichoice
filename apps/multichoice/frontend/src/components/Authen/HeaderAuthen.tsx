import React, { useLayoutEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../Logo/Logo';

const HeaderAuthen: React.FC = () => {
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
    <header className="header px-10 pt-5 flex items-center justify-between xs:flex-col md:flex-row">
      <div className="header-left">
        <Logo />
      </div>
      <div className="header-right xs:hidden md:block">
        {isLoginPage ? (
          <p className="text-sm">
            Don't have account ?
            <Link
              to="/register"
              className="inline-block ml-1 text-primary-900 font-semibold"
            >
              Sign up now !
            </Link>
          </p>
        ) : (
          <p className="text-sm">
            Already have an account ?
            <Link
              to="/login"
              className="inline-block ml-1 text-primary-900 font-semibold"
            >
              Log in !
            </Link>
          </p>
        )}
      </div>
    </header>
  );
};

export default HeaderAuthen;
