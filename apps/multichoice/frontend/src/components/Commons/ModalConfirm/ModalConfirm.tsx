import React from 'react';
import Button from '../Button/Button';
import Modal, { SizeModal } from '../Modal/Modal';

interface IModalConfirmProps {
  visible?: boolean;
  title?: string | React.ReactNode;
  label?: string | React.ReactNode;
  size?: SizeModal;
  onConfirm?: () => void;
  onCancle?: () => void | React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalConfirm: React.FC<IModalConfirmProps> = ({
  visible = false,
  label = '',
  title = '',
  onCancle,
  onConfirm,
  size = 'md',
}) => {
  return (
    <Modal
      headerTitle={label}
      visible={visible}
      setVisibleModal={onCancle}
      placement="CENTER"
      size={size}
    >
      <div>{title}</div>

      <div className="body ctas flex items-center justify-end gap-x-2 mt-6">
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
    </Modal>
  );
};

export default ModalConfirm;
