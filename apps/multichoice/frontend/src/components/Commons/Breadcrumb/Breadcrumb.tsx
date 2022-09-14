import React from 'react';
import BreadcrumbItem from './BreadcrumbItem';

interface IBreadcrumb {
  children?: React.ReactNode;
}

const Breadcrumb: React.FC<IBreadcrumb> & {
  Item: React.FC<IBreadcrumb>;
} = ({ children }) => {
  return <ul className="breadcrumb flex items-center">{children}</ul>;
};

Breadcrumb.Item = BreadcrumbItem;
export default Breadcrumb;
