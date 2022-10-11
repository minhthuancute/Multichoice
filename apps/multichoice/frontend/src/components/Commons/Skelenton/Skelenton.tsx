import React from 'react';
import { classNames } from '../../../helper/classNames';

interface ISkelentonProps {
  className: string;
  height: number;
}

const Skelenton: React.FC<Partial<ISkelentonProps>> = ({
  className = '',
  height = 40,
}) => {
  return (
    <div
      className={classNames(['animate-pulse bg-gray-100 ', className])}
      style={{
        height: height + 'px',
      }}
    ></div>
  );
};

export default React.memo(Skelenton);
