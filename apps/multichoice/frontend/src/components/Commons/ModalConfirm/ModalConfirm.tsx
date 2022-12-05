import React from 'react';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';

interface IModalConfirmProps {
  visible?: boolean;
  title?: string | React.ReactNode;
  label?: string | React.ReactNode;
  onConfirm?: () => void;
  onCancle?: () => void | React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalConfirm: React.FC<IModalConfirmProps> = ({
  visible = false,
  label = '',
  title = '',
  onCancle,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} placement="CENTER">
      <>
        <div className="header text-center">
          <h2 className="text-slate-800 text-xl font-semibold capitalize">
            {label}
          </h2>
          <h4 className="mt-4 text-slate-800 font-semibold">{title}</h4>
        </div>
        <div className="body ctas flex items-center justify-center gap-x-2 mt-10">
          <Button
            type="button"
            onClick={() => {
              onCancle && onCancle();
            }}
          >
            Hủy
          </Button>
          <Button
            type="button"
            color="success"
            onClick={() => {
              onConfirm && onConfirm();
            }}
          >
            Xác nhận
          </Button>
        </div>
      </>
    </Modal>
  );
};

export default ModalConfirm;
