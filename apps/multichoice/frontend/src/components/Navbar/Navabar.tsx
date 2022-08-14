import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { classNames } from '../../helper/classNames';
import './navbar.scss';

interface INav {
  label: string;
  path: string;
}

const Navabar: React.FC = () => {
  const location = useLocation();

  const [navs] = useState<INav[]>([
    {
      label: 'Tổng quan',
      path: '/',
    },
    {
      label: 'Đề thi',
      path: '/tests',
    },
    {
      label: 'Thống kê',
      path: '/statistic',
    },
  ]);

  const activeNavItem = (): number => {
    const currentPath = location.pathname;
    const currentIndexNav = navs.findIndex((nav: INav) => {
      return currentPath === nav.path;
    });
    return currentIndexNav;
  };

  return (
    <nav>
      <ul className="flex">
        {navs &&
          navs.map((nav: INav, index: number) => (
            <li
              key={nav.label}
              className={classNames(
                `nav-item font-medium text-sm mr-8 last:mr-0`,
                {
                  'active text-primary': activeNavItem() === index,
                }
              )}
            >
              <Link to={nav.path} className="inline-block py-3.5">
                {nav.label}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};
export default Navabar;
