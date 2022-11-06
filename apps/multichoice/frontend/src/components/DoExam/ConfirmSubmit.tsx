import React from 'react';

import Modal from '../Modal/Modal';

interface IConfirmSubmitProps {
  unSelectAnswer: number;
  onCancleModalConfirm: () => void;
  setConfirmSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModalConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  openModalConfirm?: boolean;
}

const ConfirmSubmit: React.FC<IConfirmSubmitProps> = ({
  unSelectAnswer,
  onCancleModalConfirm,
  setConfirmSubmit,
  openModalConfirm = false,
}) => {
  return (
    <Modal
      openModal={openModalConfirm}
      setOpenModal={setConfirmSubmit}
      size="sm"
      placement="CENTER"
    >
      <div
        className="modal-content px-5 flex flex-col justify-center
       bg-white rounded-md py-8"
      >
        <div className="header text-center">
          <h4 className="text-slate-800 font-semibold text-xl">Nộp Bài</h4>
          {unSelectAnswer > 0 ? (
            <p className="mt-4 text-slate-800 font-semibold">
              Bạn còn{' '}
              <span className="font-semibold">{unSelectAnswer} (câu hỏi)</span>{' '}
              chưa chọn đáp án. Bạn có chắc chắn muốn nộp bài ?
            </p>
          ) : (
            <p className="mt-4 text-slate-800 font-semibold">
              Bạn có chắc chắn muốn nộp bài?
            </p>
          )}
        </div>
        <div className="body ctas flex items-center justify-center gap-x-2 mt-5">
          <button
            className="create-test rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-slate-800 font-bold border border-solid border-slate-800 focus:ring focus:ring-slate-100"
            onClick={() => onCancleModalConfirm()}
          >
            Huỷ
          </button>
          <button
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
            onClick={() => setConfirmSubmit(true)}
          >
            Nộp bài
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmSubmit;
