import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { classNames } from '../../helper/classNames';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

type PlacementContent =
  | 'CENTER'
  | 'TOP_CENTER'
  | 'TOP_LEFT'
  | 'TOP-RIGHT'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_RIGHT';

interface ILayout {
  setOpenModal: React.Dispatch<React.SetStateAction<any>>;
  children?: React.ReactNode;
  openModal?: boolean;
  placement?: PlacementContent;
}

const Modal: React.FC<ILayout> = ({
  setOpenModal,
  openModal = false,
  placement = 'TOP_CENTER',
  children,
}) => {
  const refModal = useRef<HTMLDivElement>(null);

  const onClickOutSide = () => {
    setOpenModal(false);
  };
  useOnClickOutside(refModal, onClickOutSide);

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
         h-full bg-slate-900 bg-opacity-40 overflow-auto py-10`,
          {
            'visible opacity-100': openModal,
            'invisible opacity-0': !openModal,
            'items-center': placement === 'CENTER',
          }
        )}
      >
        <div ref={refModal}>{children}</div>
      </div>
    ) : null,
    document.getElementById('modal-root') || ({} as HTMLElement)
  );
};

export default Modal;
