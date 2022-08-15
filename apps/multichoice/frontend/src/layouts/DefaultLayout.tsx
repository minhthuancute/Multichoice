import React from 'react';
import Header from '../components/Home/Header';

interface ILayout {
  children?: JSX.Element | JSX.Element[] | string | string[];
}

const DefaultLayout: React.FC<ILayout> = ({ children }) => {
  return (
    <div className="layout-default">
      <Header />
      <main className="layout-default__main">{children}</main>
    </div>
  );
};

export default DefaultLayout;
