import { Link } from 'react-router-dom';
import React from 'react';

const Logo: React.FC = () => {
  return (
    <h2 className="logo font-semibold text-xl w-20">
      <Link to="/">
        <img alt={'Logo'} src="../assets/images/logo.png" />
      </Link>
    </h2>
  );
};

export default Logo;
