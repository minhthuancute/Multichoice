import React from 'react';
import { Link } from 'react-router-dom';

interface ILayout {
  children?: JSX.Element | JSX.Element[] | string | string[];
}

const BlankLayout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className="layout-authen min-h-screen bg-authen bg-no-repeat bg-center">
      <header className="header px-10 pt-5">
        <h1 className="logo font-medium text-xl">
          <Link to="/">MultiChoice</Link>
        </h1>
      </header>
      <main className="max-w-lg xs:pt-12 md:pt-8 pb-24 px-4 mx-auto">
        {children}
      </main>
    </div>
  );
};

export default BlankLayout;
