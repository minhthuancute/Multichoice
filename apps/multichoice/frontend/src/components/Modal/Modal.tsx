import React from 'react';
import ReactDOM from 'react-dom';
import { classNames } from '../../helper/classNames';

interface ILayout {
  children?: JSX.Element | JSX.Element[] | string | string[];
  openModal?: boolean;
}

const Modal: React.FC<ILayout> = ({ children, openModal = false }) => {
  return ReactDOM.createPortal(
    openModal ? (
      <div
        className={classNames(
          `modal fixed z-50 top-0 transition-all duration-300 w-full h-screen flex items-center
          justify-center bg-slate-900 bg-opacity-20`,
          {
            'visible opacity-100': openModal,
            'invisible opacity-0': !openModal,
          }
        )}
      >
        {children}
      </div>
    ) : null,
    document.getElementById('modal-root') || ({} as HTMLElement)
  );
};

export default Modal;
