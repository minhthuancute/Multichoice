import React from 'react';

interface IBreadcrumb {
  children?: React.ReactNode;
}

const BreadcrumbItem: React.FC<IBreadcrumb> = ({ children }) => {
  return (
    <li
      className="group flex items-center text-sm font-medium text-slate-800
      last:mr-0 last:text-primary-900
      before:content-['/'] before:mx-3 first:before:hidden"
    >
      <span>{children}</span>
    </li>
  );
};

const Breadcrumb: React.FC<IBreadcrumb> & {
  Item: React.FC<IBreadcrumb>;
} = ({ children }) => {
  return <ul className="breadcrumb flex items-center">{children}</ul>;
};

Breadcrumb.Item = BreadcrumbItem;
export default Breadcrumb;
