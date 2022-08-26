import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { classNames } from '../../../helper/classNames';
import { MdOutlineClose } from 'react-icons/md';

type TypeNoti = 'success' | 'danger' | 'warning';
type Placement =
  | 'top-center'
  | 'bottom-center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface INotifications {
  showNotify?: boolean;
  title?: string;
  content: string;
  type?: TypeNoti;
  placement?: Placement;
}

const Notify: React.FC<INotifications> = ({
  showNotify = false,
  title,
  content,
  type = 'success',
  placement = 'top-right',
}) => {
  const [openNotify, setOpenNotify] = useState<boolean>(false);

  useEffect(() => {
    setOpenNotify(showNotify);
    const timeoutNoti = setTimeout(() => {
      setOpenNotify(false);
    }, 2000);
    return () => {
      clearTimeout(timeoutNoti);
    };
  }, [showNotify]);

  return ReactDOM.createPortal(
    <div
      className={classNames(
        `fixed z-50 max-w-xs w-full cursor-pointer transition-all duration-200`,
        {
          'left-4 top-4': placement === 'top-left',
          'right-4 top-4': placement === 'top-right',
          'left-4 bottom-4': placement === 'bottom-left',
          'right-4 bottom-4': placement === 'bottom-right',
          'translate-x-0': openNotify,
          'translate-x-[340px]': !openNotify,
        }
      )}
    >
      <div
        className="w-full px-4 py-2 border-l-8 border-solid rounded-md
      border-violet-900 bg-violet-600 text-white shadow-md flex justify-between"
      >
        <div className="content pr-3">
          <p className="text-sm">{content}</p>
        </div>
        <div className="close mt-0.5">
          <button onClick={() => setOpenNotify(false)}>
            <MdOutlineClose className="fill-white" />
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('noti-root') || ({} as HTMLDivElement)
  );
};

export default Notify;
