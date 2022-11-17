import React from 'react';

interface IBreadcrumbItem {
  children?: React.ReactNode;
}

const BreadcrumbItem: React.FC<IBreadcrumbItem> = ({ children }) => {
  return (
    <li
      className="group flex items-center text-sm font-medium text-slate-800
      last:mr-0 last:text-primary-900
      before:content-['/'] before:mx-3 first:before:hidden
      "
    >
      <span>{children}</span>
    </li>
  );
};

export default BreadcrumbItem;
