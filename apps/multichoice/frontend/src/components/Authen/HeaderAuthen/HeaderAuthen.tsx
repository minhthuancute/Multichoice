import React from 'react';
import Logo from '../../Commons/Logo/Logo';

const HeaderAuthen: React.FC = () => {
  return (
    <header className="px-10 pt-3 flex items-center justify-between xs:flex-col md:flex-row">
      <div className="header-left">
        <Logo />
      </div>
    </header>
  );
};

export default HeaderAuthen;
