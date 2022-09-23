import React from 'react';
import { classNames } from '../../helper/classNames';
import './Polacode.scss';
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
      className={classNames(['rounded-sm', className])}
      dangerouslySetInnerHTML={{
        __html: `
          <div class='show-editor'>
            ${content}
          </div>
        `,
      }}
    ></div>
  );
};

export default PolaCode;
