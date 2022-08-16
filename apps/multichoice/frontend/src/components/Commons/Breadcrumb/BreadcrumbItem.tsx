import React from 'react';

interface IBreadcrumbItem {
  children?: React.ReactNode;
}

const BreadcrumbItem: React.FC<IBreadcrumbItem> = ({ children }) => {
  return (
    <li
      className="group flex items-center text-sm font-medium text-slate-800
       last:hover:no-underline last:mr-0 last:text-primary-900
      before:content-['/'] before:mx-3 first:before:hidden
      "
    >
      <span className="hover:underline group-last:hover:no-underline">
        {children}
      </span>
    </li>
  );
};

export default BreadcrumbItem;
