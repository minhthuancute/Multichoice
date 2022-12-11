import { IUserDoExam } from '@monorepo/multichoice/dto';
import React from 'react';
import Button from '../Commons/Button/Button';
import Modal from '../Commons/Modal/Modal';

interface IConfirmDeleteUserExamProps {
  userData: IUserDoExam;
  onConfirmDelete: () => void;
  setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
  visibleModal?: boolean;
}

const ConfirmDeleteUserExam: React.FC<IConfirmDeleteUserExamProps> = ({
  userData,
  onConfirmDelete,
  setVisibleModal,
  visibleModal = false,
}) => {
  return (
    <Modal
      headerTitle="Xóa bỏ kết quả thi"
      visible={visibleModal}
      setVisibleModal={setVisibleModal}
      placement="CENTER"
      size="sm"
    >
      <>
        <div>
          <p className="text-tiny text-slate-800">
            Bạn có chắc chắn muốn xóa bỏ kết quả thi của:{' '}
            <span className="font-semibold">{userData.username}</span>
          </p>
        </div>
        <div className="body ctas flex items-center justify-end gap-x-2 mt-6">
          <Button type="button" onClick={() => setVisibleModal(false)}>
            Huỷ
          </Button>
          <Button
            color="success"
            type="button"
            onClick={() => onConfirmDelete()}
          >
            Xoá
          </Button>
        </div>
      </>
    </Modal>
  );
};

export default ConfirmDeleteUserExam;
