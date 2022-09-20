import React from 'react';
import { classNames } from '../../helper/classNames';

interface IPolaCodeProps {
  content: string;
  className?: string;
}

const PolaCode: React.FC<IPolaCodeProps> = ({
  content = '',
  className = '',
}) => {
  return (
    <div
      className={classNames(['w-max rounded-sm', className])}
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    ></div>
  );
};

export default PolaCode;
