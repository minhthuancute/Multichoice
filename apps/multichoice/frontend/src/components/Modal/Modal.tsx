import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { classNames } from '../../helper/classNames';

type PlacementContent =
  | 'CENTER'
  | 'TOP_CENTER'
  | 'TOP_LEFT'
  | 'TOP-RIGHT'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_RIGHT';

interface ILayout {
  children?: React.ReactNode;
  openModal?: boolean;
  placement?: PlacementContent;
}

const Modal: React.FC<ILayout> = ({
  openModal = false,
  placement = 'TOP_CENTER',
  children,
}) => {
  useEffect(() => {
    const body = document.querySelector('body');
    if (!body) return;
    if (openModal) {
      body.style.overflow = 'hidden';
    }
    return () => {
      body.style.overflow = 'auto';
    };
  }, [openModal]);

  return ReactDOM.createPortal(
    openModal ? (
      <div
        className={classNames(
          `modal fixed z-40 top-0 transition-all duration-300 w-full px-4
         h-full bg-slate-900 bg-opacity-40 overflow-auto py-10 flex`,
          {
            'visible opacity-100': openModal,
            'invisible opacity-0': !openModal,
          }
        )}
      >
        <div
          className={classNames('modal-body w-full', {
            // 'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2':
            //   isCenter,
          })}
        >
          {children}
        </div>
      </div>
    ) : null,
    document.getElementById('modal-root') || ({} as HTMLElement)
  );
};

export default Modal;
