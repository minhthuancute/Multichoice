import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { classNames } from '../../helper/classNames';

interface ILayout {
  children?: React.ReactNode;
  openModal?: boolean;
}

const Modal: React.FC<ILayout> = ({ openModal = false, children }) => {
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
    <div
      className={classNames(
        `modal fixed z-50 top-0 transition-all duration-300 w-full h-screen flex
          justify-center bg-slate-900 bg-opacity-40 overflow-hidden`,
        {
          'visible opacity-100': openModal,
          'invisible opacity-0': !openModal,
        }
      )}
    >
      {children}
    </div>,
    document.getElementById('modal-root') || ({} as HTMLElement)
  );
};

export default Modal;
