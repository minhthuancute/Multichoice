import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TOKEN } from '../../constants/contstants';
import { classNames } from '../../helper/classNames';
import { localServices } from '../../services/LocalServices';
import { userStore } from '../../store/rootReducer';
import Navabar from '../Navbar/Navabar';
import Logo from '../Logo/Logo';
import Avatar from '../../assets/images/avatar.svg';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user } = userStore();

  const refDropdownUser = useRef<HTMLDivElement>(null);

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const handleLogout = () => {
    localServices.clearItem(TOKEN);
    navigate('/login');
  };

  const onClickOutsideDropdownUser = () => {
    setOpenDropdown(false);
  };

  useOnClickOutside(refDropdownUser, onClickOutsideDropdownUser);
  return (
    <header
      className="bg-white"
      style={{
        boxShadow: 'rgba(0, 0, 0, 0.075) 0 2px 10px 0',
      }}
    >
      <div className="wrapper-header container flex items-center justify-between">
        <div className="header-left logo">
          <Logo />
        </div>

        <div className="header-right flex items-center relative">
          <div className="navbar mr-24">
            <Navabar />
          </div>
          <div className="user group">
            <div className="content flex items-center">
              <img src={Avatar} alt="" className="w-6 h-6 rounded-full mr-2" />
              <h3
                className="text-slate-800 font-medium text-tiny cursor-pointer"
                onClick={() => setOpenDropdown((state) => !state)}
              >
                Hello, {user.username}
              </h3>
            </div>
            <div
              className={classNames(
                `dropdown-user p-4 bg-white shadow-md absolute right-0 top-full w-[296px] z-40
                transition-all duration-200 transform scale-y-0 origin-top`,
                {
                  'scale-y-100': openDropdown,
                }
              )}
              ref={refDropdownUser}
            >
              <ul className="text-sm text-slate-800 mb-5">
                <li className="mb-1.5 font-semibold text-base cursor-pointer">
                  {user.username}
                </li>
                <li className="cursor-pointer">{user.email}</li>
              </ul>
              <ul className="pt-5 border-t border-slate-200 text-sm text-slate-800">
                <Link
                  to="/"
                  className="block duration-200 transition-all
                hover:font-semibold rounded-md mb-3"
                >
                  Quản lý tài khoản
                </Link>
                <Link
                  to="/"
                  className="block duration-200 transition-all
                hover:font-semibold rounded-md mb-3"
                >
                  Đổi mật khẩu
                </Link>
                <li
                  className="btn-primary bg-red-500 text-white text-sm w-full py-1
                  rounded-sm font-semibold text-center pt-10 cursor-pointer border-t"
                  onClick={handleLogout}
                >
                  Đăng Xuất
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
