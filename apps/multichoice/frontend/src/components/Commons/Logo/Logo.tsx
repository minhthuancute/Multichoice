import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { userStore } from '../../../store/rootReducer';

const Logo: React.FC = () => {
  const { isAuthenticated } = userStore();
  const location = useLocation();
  const [to, setTo] = useState<string>(isAuthenticated ? '/tests' : '#');

  useEffect(() => {
    const currentPath = location.pathname;
    if (to === currentPath) {
      setTo('#');
    } else {
      setTo(isAuthenticated ? '/tests' : '#');
    }
  }, [location]);

  return (
    <h2 className="logo font-semibold text-xl w-20">
      <Link to={to}>
        <img alt={'Logo'} src="../assets/images/logo.png" />
      </Link>
    </h2>
  );
};

export default Logo;
