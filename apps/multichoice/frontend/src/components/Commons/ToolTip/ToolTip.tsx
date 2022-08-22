import React from 'react';
import { classNames } from '../../../helper/classNames';

// type Placement = 'top' | 'left' | 'right' | 'bottom';

export interface IToolTip {
  title: string;
  children?: React.ReactNode;
}

const ToolTip: React.FC<IToolTip> = ({ title, children }) => {
  return (
    <div className="relative">
      <div className="childrent-tooltip peer">{children}</div>
      <div
        className={classNames(
          `absolute text-xs w-max -top-2 left-1/2 px-2 py-0.5 opacity-0 invisible
        transform -translate-x-1/2 rounded-md peer-hover:opacity-100 peer-hover:visible
        transition-all duration-200 -translate-y-full bg-slate-800 text-white`
        )}
      >
        {title}
      </div>
    </div>
  );
};

export default ToolTip;
