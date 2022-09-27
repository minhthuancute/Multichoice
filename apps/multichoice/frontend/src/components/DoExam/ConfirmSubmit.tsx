import React from 'react';
import { BiCheckDouble } from 'react-icons/bi';
import { RiErrorWarningLine } from 'react-icons/ri';
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
    >
      <div
        className="modal-content px-5 flex flex-col justify-center
       bg-white rounded-md h-80"
      >
        <div className="header text-center">
          {unSelectAnswer > 0 ? (
            <RiErrorWarningLine className="text-yellow-400 text-5xl mx-auto" />
          ) : (
            <BiCheckDouble className="text-green-600 text-5xl mx-auto" />
          )}
          <h4 className="mt-4 text-slate-800 font-semibold text-2xl">
            Nộp bài
          </h4>
          {unSelectAnswer > 0 ? (
            <p className="mt-4 text-slate-800">
              Bạn còn{' '}
              <span className="font-semibold">{unSelectAnswer} (câu hỏi)</span>{' '}
              chưa chọn đáp án. Bạn có chắc chắn muốn nộp bài ?
            </p>
          ) : (
            <p className="mt-4 text-slate-800">
              Bạn có chắc chắn muốn nộp bài ?
            </p>
          )}
        </div>
        <div className="body ctas flex items-center justify-center gap-x-2 mt-12">
          <button
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
            onClick={() => setConfirmSubmit(true)}
          >
            Nộp bài
          </button>
          <button
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-slate-800 font-bold border border-solid border-slate-800"
            onClick={() => onCancleModalConfirm()}
          >
            Huỷ
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmSubmit;
