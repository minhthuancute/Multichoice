import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { classNames } from '../../helper/classNames';
import './navbar.scss';

interface INav {
  label: string;
  path: string;
  relativePaths?: string[];
}

const Navabar: React.FC = () => {
  const location = useLocation();

  const navs: INav[] = [
    {
      label: 'Tổng quan',
      path: '/',
    },
    {
      label: 'Đề thi',
      path: '/tests',
      relativePaths: ['questions'],
    },
    {
      label: 'Thống kê',
      path: '/statistical',
    },
  ];

  const indexActiveNav = (): number => {
    const currentPath = location.pathname;

    if (currentPath === '/') return 0;
    const currentIndexNav = navs.findIndex((nav) => {
      if (nav.path === '/') return false;
      const relativePaths = nav.relativePaths?.toString();
      const matchedNav =
        currentPath.includes(nav.path) ||
        currentPath.includes(relativePaths || '');

      return matchedNav;
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
                  'active text-primary-900': indexActiveNav() === index,
                }
              )}
            >
              <Link to={nav.path} className="inline-block py-4">
                {nav.label}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};
export default Navabar;
