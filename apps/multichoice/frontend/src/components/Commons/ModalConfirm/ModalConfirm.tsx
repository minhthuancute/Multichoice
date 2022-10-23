import React from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import Modal from '../../Modal/Modal';

interface IModalConfirmProps {
  isOpen: boolean;
  title: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  onConfirm: () => void;
  onClose: () => void | React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalConfirm: React.FC<IModalConfirmProps> = ({
  isOpen,
  title,
  onClose,
  onConfirm,
  confirmButtonLabel,
  cancelButtonLabel,
}) => {
  return (
    <Modal openModal={isOpen} setOpenModal={onClose} placement="CENTER">
      <div
        className="modal-content px-5 flex flex-col justify-center
      bg-white rounded-md w-full py-10 h-full"
      >
        <div className="header text-center">
          <RiErrorWarningLine className="text-yellow-400 text-5xl mx-auto" />
          <h4 className="mt-4 text-slate-800 text-lg">{title}</h4>
        </div>
        <div className="body ctas flex items-center justify-center gap-x-2 mt-12">
          <button
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
            text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
            onClick={() => onConfirm()}
          >
            {confirmButtonLabel || 'Xác nhận'}
          </button>

          <button
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
            text-slate-800 font-bold border border-solid border-slate-800"
            onClick={() => onClose()}
          >
            {cancelButtonLabel || 'Hủy'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
