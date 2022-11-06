import React from 'react';
import Modal from '../../Modal/Modal';

interface IModalConfirmProps {
  isOpen: boolean;
  label?: string;
  title: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  onConfirm: () => void;
  onClose: () => void | React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalConfirm: React.FC<IModalConfirmProps> = ({
  isOpen,
  label,
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
          <h2 className="text-slate-800 text-xl font-semibold capitalize">
            {label}
          </h2>
          <h4 className="mt-4 text-slate-800 font-semibold">{title}</h4>
        </div>
        <div className="body ctas flex items-center justify-center gap-x-2 mt-10">
          <button
            className="create-test rounded-md flex justify-center items-center w-32 h-10 text-sm
            text-slate-800 font-bold border border-solid border-slate-800"
            onClick={() => onClose()}
          >
            {cancelButtonLabel || 'Hủy'}
          </button>
          <button
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
            text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
            onClick={() => onConfirm()}
          >
            {confirmButtonLabel || 'Xác nhận'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
