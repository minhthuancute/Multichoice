import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TOKEN } from '../../constants/contstants';
import { classNames } from '../../helper/classNames';
import { localServices } from '../../services/LocalServices';
import { userStore } from '../../store/rootReducer';
import Navabar from '../Navbar/Navabar';
import Logo from '../Commons/Logo/Logo';
import Avatar from '../../assets/images/avatar.svg';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import Button from '../Commons/Button/Button';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user } = userStore();

  const refDropdownUser = useRef<HTMLDivElement>(null);
  const refUsername = useRef<HTMLHeadingElement>(null);

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const handleLogout = () => {
    localServices.clearItem(TOKEN);
    navigate('/login');
  };

  const onClickOutsideDropdownUser = () => {
    setOpenDropdown(false);
  };

  useOnClickOutside(refDropdownUser, onClickOutsideDropdownUser, refUsername);
  return (
    <header className="bg-white border-b border-slate-200">
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
                onClick={() => {
                  setOpenDropdown((state) => !state);
                }}
                ref={refUsername}
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
              <ul className="text-sm text-slate-800 mb-4">
                <li className="mb-1 font-semibold text-base cursor-pointer">
                  {user.username}
                </li>
                <li className="cursor-pointer">{user.email}</li>
              </ul>
              <ul className="py-4 border-t border-slate-200 text-sm text-slate-800">
                <Link
                  to="/"
                  className="block duration-200 transition-all
                hover:font-semibold rounded-md mb-2"
                >
                  Quản lý tài khoản
                </Link>
                <Link
                  to="/"
                  className="block duration-200 transition-all
                hover:font-semibold rounded-md"
                >
                  Đổi mật khẩu
                </Link>
              </ul>
              <div className="logout pt-5 border-t border-slate-200">
                <Button
                  color="danger"
                  size="sm"
                  widthFull
                  onClick={handleLogout}
                >
                  {' '}
                  Đăng Xuất
                </Button>
                {/* <button
                  className="bg-red-500 text-white text-sm w-full py-1
                  rounded-sm font-semibold text-center cursor-pointer focus:ring focus:ring-red-100"
                  onClick={handleLogout}
                >
                  Đăng Xuất
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
