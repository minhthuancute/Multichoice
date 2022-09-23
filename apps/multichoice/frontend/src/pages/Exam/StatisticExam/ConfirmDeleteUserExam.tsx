import { IUserDoExam } from '@monorepo/multichoice/dto';
import React from 'react';
import { IoMdClose } from 'react-icons/io';
import ToolTip from '../../../components/Commons/ToolTip/ToolTip';
import Modal from '../../../components/Modal/Modal';

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
    <Modal openModal={openModalConfirm}>
      <div
        className="modal-content mx-auto mt-10 px-5 flex flex-col justify-center
       bg-white rounded-md max-w-lg w-full h-64"
      >
        <div className="form-header flex justify-end mb-8">
          <ToolTip title="Đóng">
            <button
              type="button"
              className="text-lg"
              onClick={() => setOpenModalConfirm(false)}
            >
              <IoMdClose />
            </button>
          </ToolTip>
        </div>
        <div>
          <h4 className="mt-4 text-slate-800 text-lg text-center">
            Bạn có chắc chắn muốn xóa bỏ kết quả thi của:{' '}
            <span className="font-semibold">{userData.userName}</span>
          </h4>
        </div>
        <div className="body ctas flex items-center justify-center gap-x-2 mt-12">
          <button
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
            onClick={() => onConfirmDelete()}
          >
            Xoá
          </button>
          <button
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-slate-800 font-bold border border-solid border-slate-800"
            onClick={() => setOpenModalConfirm(false)}
          >
            Huỷ
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteUserExam;
