import React from 'react'
import { RiErrorWarningLine } from 'react-icons/ri';
import { classNames } from '../../../helper/classNames';
import Modal from '../../Modal/Modal'

interface IModalConfirmProps {
  isOpen: boolean;
  title: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ModalConfirm: React.FC<IModalConfirmProps> = ({
  isOpen, title, onClose, onConfirm, confirmButtonLabel, cancelButtonLabel
}) => {

  return (
    <Modal openModal={isOpen}>
      <div className={classNames(`modal-content mx-auto mt-10 px-5 flex flex-col justify-center bg-white rounded-md max-w-lg w-full h-60`)}>
        <div className={classNames(`header text-center`)}>
          <RiErrorWarningLine className={classNames(`text-red-600 text-5xl mx-auto`)} />
          <h4 className={classNames(`mt-4 text-slate-800 text-tiny`)}>
            {title}
          </h4>
        </div>
        <div className={classNames(`body ctas flex items-center justify-center gap-x-2 mt-12`)}>
          <button
            className={classNames(`create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800`)}
            onClick={() => onConfirm()}
          >
            {confirmButtonLabel || "Xác nhận"}
          </button>

          <button
            className={classNames(`create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-slate-800 font-bold border border-solid border-slate-800`)}
            onClick={() => onClose()}
          >
            {cancelButtonLabel || "Hủy"}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ModalConfirm