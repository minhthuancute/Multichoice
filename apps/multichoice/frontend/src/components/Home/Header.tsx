import React from 'react';
import { Link } from 'react-router-dom';
import { userStore } from '../../store/rootReducer';
import Navabar from '../Navbar/Navabar';

const Header: React.FC = () => {
  const { user } = userStore();

  return (
    <header
      className="bg-white"
      style={{
        boxShadow: 'rgba(0, 0, 0, 0.075) 0 2px 10px 0',
      }}
    >
      <div className="wrapper-header container flex items-center justify-between">
        <div className="header-left logo">
          <h1 className="logo font-medium text-xl">
            <Link to="/">MultiChoice</Link>
          </h1>
        </div>

        <div className="header-right flex items-center">
          <div className="navbar mr-24">
            <Navabar />
          </div>
          <img
            src="https://picsum.photos/200/300"
            alt=""
            className="w-6 h-6 rounded-full mr-2"
          />
          <h3>
            <Link to="/profile">{user.name}</Link>
          </h3>
        </div>
      </div>
    </header>
  );
};

export default Header;
