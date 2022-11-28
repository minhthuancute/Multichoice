/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { classNames } from '../../helper/classNames';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import './modal.scss';

type PlacementModal =
  | 'CENTER'
  | 'TOP_CENTER'
  | 'TOP_LEFT'
  | 'TOP-RIGHT'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_RIGHT';

type SizeModal = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '3xl' | 'full';

interface IModalProps {
  visible?: boolean;
  setVisibleModal?: React.Dispatch<React.SetStateAction<any>>;
  children?: React.ReactNode;
  placement?: PlacementModal;
  size?: SizeModal;
}

const Modal: React.FC<IModalProps> = ({
  setVisibleModal,
  visible = false,
  placement = 'TOP_CENTER',
  size = 'md',
  children,
}) => {
  const refModal = useRef<HTMLDivElement>(null);

  const onClickOutSide = () => {
    setVisibleModal && setVisibleModal(false);
  };

  const getSizeModal = (): string => {
    const sizeObj = {
      sm: 'max-w-lg',
      md: 'max-w-xl',
      lg: 'max-w-2xl',
      xl: 'max-w-3xl',
      xxl: 'max-w-4xl',
      '3xl': 'max-w-6xl',
      full: 'max-w-full',
    };
    return sizeObj[size];
  };

  useEffect(() => {
    const body = document.querySelector('body') || ({} as HTMLBodyElement);
    if (visible) {
      body.style.overflow = 'hidden';
    }
    return () => {
      body.style.overflow = 'auto';
    };
  }, [visible]);

  useOnClickOutside(refModal, onClickOutSide);

  return ReactDOM.createPortal(
    visible ? (
      <div
        className={classNames(
          `modal fixed z-40 top-0 transition-all duration-400 w-full px-4
          h-full bg-slate-900 bg-opacity-40 overflow-auto py-10`,
          {
            'visible opacity-100': visible,
            'invisible opacity-0': !visible,
          }
        )}
      >
        <div
          ref={refModal}
          className={classNames(['mx-auto w-full px-4', getSizeModal()], {
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2':
              placement === 'CENTER',
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
