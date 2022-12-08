import React, { useLayoutEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '../../../hooks/useQuery';
import { RedirectQuery } from '../../../types/AuthenQuery';
import Logo from '../../Commons/Logo/Logo';

const HeaderAuthen: React.FC = () => {
  const location = useLocation();
  const [query] = useQuery<RedirectQuery>();
  const redirectUrl = query.redirect;

  const [isLoginPage, setIsLoginPage] = useState<boolean>(true);

  useLayoutEffect(() => {
    const currentPath = location.pathname;
    const isLoginPage = currentPath.includes('/login');
    if (!isLoginPage) {
      setIsLoginPage(false);
    }
  }, [location.pathname]);

  return (
    <header className="px-10 pt-3 flex items-center justify-between xs:flex-col md:flex-row">
      <div className="header-left">
        <Logo />
      </div>
    </header>
  );
};

export default HeaderAuthen;
