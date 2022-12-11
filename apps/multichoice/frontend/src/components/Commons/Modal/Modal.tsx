/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { IoMdClose } from 'react-icons/io';
import { classNames } from '../../../helper/classNames';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import ToolTip from '../ToolTip/ToolTip';
import './modal.scss';

type PlacementModal =
  | 'CENTER'
  | 'TOP_CENTER'
  | 'TOP_LEFT'
  | 'TOP-RIGHT'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_RIGHT';

export type SizeModal = 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | '3xl' | 'full';

interface IModalProps {
  visible?: boolean;
  setVisibleModal?: React.Dispatch<React.SetStateAction<any>>;
  headerTitle?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  placement?: PlacementModal;
  size?: SizeModal;
  hideOnClickOutside?: boolean;
}

const Modal: React.FC<IModalProps> = ({
  setVisibleModal,
  visible = false,
  placement = 'TOP_CENTER',
  size = 'md',
  hideOnClickOutside = true,
  headerTitle,
  children,
}) => {
  const refModal = useRef<HTMLDivElement>(null);

  const onClickOutSide = () => {
    if (hideOnClickOutside) {
      setVisibleModal && setVisibleModal(false);
    }
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
          h-full bg-slate-900 bg-opacity-40 overflow-auto py-5`,
          {
            'visible opacity-100': visible,
            'invisible opacity-0': !visible,
            'flex justify-center items-center': placement === 'CENTER',
          }
        )}
      >
        <div
          ref={refModal}
          className={classNames(['mx-auto w-full', getSizeModal()])}
        >
          <div className="modal-content p-5 bg-white rounded-md w-full text-slate-800">
            <div className="modal1-header flex items-start justify-between mb-6">
              <h4 className="text-slate-800 text-xl font-semibold mr-3">
                {headerTitle}
              </h4>
              <ToolTip title="Đóng">
                <button
                  type="button"
                  className="text-xl text-slate-800 font-semibold"
                  onClick={() => {
                    setVisibleModal && setVisibleModal(false);
                  }}
                >
                  <IoMdClose />
                </button>
              </ToolTip>
            </div>
            {children}
          </div>
        </div>
      </div>
    ) : null,
    document.getElementById('modal-root') || ({} as HTMLElement)
  );
};

export default Modal;
