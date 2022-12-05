import React from 'react';
import { classNames } from '../../../helper/classNames';

interface ISkelentonProps {
  className?: string;
  children?: React.ReactNode;
}

const Skelenton: React.FC<ISkelentonProps> = ({ className = '', children }) => {
  return (
    <div className={classNames(['animate-pulse ', className])}>{children}</div>
  );
};

export default React.memo(Skelenton);
