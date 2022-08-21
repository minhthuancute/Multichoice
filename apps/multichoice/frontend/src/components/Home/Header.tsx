import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TOKEN } from '../../constants/contstants';
import { localServices } from '../../services/LocalServices';
import { userStore } from '../../store/rootReducer';
import Navabar from '../Navbar/Navabar';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user } = userStore();

  const handleLogout = () => {
    localServices.clearItem(TOKEN);
    navigate('/login');
  };

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
          <div className="user relative group">
            <div className="content flex items-center">
              <img
                src="https://picsum.photos/200/300"
                alt=""
                className="w-6 h-6 rounded-full mr-2"
              />
              <h3>
                <Link to="/profile" className="text-slate-800 font-medium">
                  {user.username}
                </Link>
              </h3>
            </div>
            <div
              className="dropdown-user p-3 pt-10 bg-white shadow-md absolute right-0 w-[248px] z-50
              transition-all duration-200 invisible opacity-0 group-hover:visible group-hover:opacity-100
            "
            >
              <div className="logout">
                <button
                  className="btn-primary bg-red-500 text-white text-sm w-full py-1 rounded-sm font-medium"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
