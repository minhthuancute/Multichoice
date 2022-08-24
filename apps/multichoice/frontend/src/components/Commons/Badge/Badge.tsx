import React from 'react';
import { classNames } from '../../../helper/classNames';

interface IBadge {
  className: string;
  title: string;
}

const Badge: React.FC<IBadge> = ({ className = '', title = '' }) => {
  return (
    <div className={classNames([className])}>
      <span>{title}</span>
    </div>
  );
};

export default Badge;
