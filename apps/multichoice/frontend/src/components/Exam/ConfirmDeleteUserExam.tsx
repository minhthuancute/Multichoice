import { IUserDoExam } from '@monorepo/multichoice/dto';
import React from 'react';
import Modal from '../Commons/Modal/Modal';

interface IConfirmDeleteUserExamProps {
  userData: IUserDoExam;
  onConfirmDelete: () => void;
  setOpenModalConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  openModalConfirm?: boolean;
}

const ConfirmDeleteUserExam: React.FC<IConfirmDeleteUserExamProps> = ({
  userData,
  onConfirmDelete,
  setOpenModalConfirm,
  openModalConfirm = false,
}) => {
  return (
    <Modal
      visible={openModalConfirm}
      setVisibleModal={setOpenModalConfirm}
      placement="CENTER"
      size="sm"
    >
      <>
        <div>
          <h4 className="text-slate-800 text-lg text-center">
            Bạn có chắc chắn muốn xóa bỏ kết quả thi của:{' '}
            <span className="font-semibold">{userData.username}</span>
          </h4>
        </div>
        <div className="body ctas flex items-center justify-center gap-x-2 mt-12">
          <button
            className="create-test rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-slate-800 font-bold border border-solid border-slate-800 focus:ring focus:ring-slate-100"
            onClick={() => setOpenModalConfirm(false)}
          >
            Huỷ
          </button>
          <button
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
            onClick={() => onConfirmDelete()}
          >
            Xoá
          </button>
        </div>
      </>
    </Modal>
  );
};

export default ConfirmDeleteUserExam;
