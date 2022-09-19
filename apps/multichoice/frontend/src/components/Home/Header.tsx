import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TOKEN } from '../../constants/contstants';
import { classNames } from '../../helper/classNames';
import { localServices } from '../../services/LocalServices';
import { userStore } from '../../store/rootReducer';
import Navabar from '../Navbar/Navabar';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user } = userStore();

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

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
      {/* <div>
        <ul>
          {demo &&
            demo.map((demo: any) => <li key={demo.start}>{demo.start}</li>)}
        </ul>
      </div> */}

      <div className="wrapper-header container flex items-center justify-between">
        <div className="header-left logo">
          <h1 className="logo font-semibold text-xl">
            <Link to="/">MultiChoice</Link>
          </h1>
        </div>

        <div className="header-right flex items-center relative">
          <div className="navbar mr-24">
            <Navabar />
          </div>
          <div className="user group">
            <div className="content flex items-center">
              <img
                src="https://picsum.photos/200/300"
                alt=""
                className="w-6 h-6 rounded-full mr-2"
              />
              <h3
                className="text-slate-800 font-medium text-tiny cursor-pointer"
                onClick={() => setOpenDropdown((state) => !state)}
              >
                Hello, {user.username}
              </h3>
            </div>
            <div
              className={classNames(
                `dropdown-user p-3 pt-20 bg-slate-50 shadow-md absolute right-0 top-full w-[248px] z-50
                transition-all duration-200 transform scale-y-0 origin-top`,
                {
                  'scale-y-100': openDropdown,
                }
              )}
            >
              <div className="logout">
                <button
                  className="btn-primary bg-primary-900 text-white text-sm w-full py-1 rounded-sm font-semibold"
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
