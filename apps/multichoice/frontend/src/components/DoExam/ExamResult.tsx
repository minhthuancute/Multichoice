import React from 'react';
import { answerStore } from '../../store/rootReducer';
import Modal from '../Modal/Modal';

interface IExamResult {
  setOpenModalResult: React.Dispatch<React.SetStateAction<boolean>>;
  openModalResult?: boolean;
  point: number;
}

const ExamResult: React.FC<IExamResult> = ({
  setOpenModalResult,
  openModalResult = false,
  point,
}) => {
  return (
    <Modal
      openModal={openModalResult}
      setOpenModal={setOpenModalResult}
      placement="CENTER"
    >
      <div className="flex flex-col justify-center bg-white rounded-md py-6">
        <div className="header text-center">
          <h2 className="text-slate-800 text-xl font-semibold capitalize">
            Kết quả làm bài
          </h2>

          <h4 className="mt-4 text-slate-800 font-semibold">
            Cảm ơn bạn đã tham gia bài kiểm tra!
          </h4>
          <p className="text-slate-800 mt-2 font-semibold">
            Số điểm bài thi bạn đạt được là:{' '}
            <span className="font-semibold text-green-600">{point} (điểm)</span>
          </p>
        </div>
        <div className="body ctas flex items-center gap-x-2 mt-8">
          <button
            className="create-test rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-white font-bold bg-slate-800 ml-auto mr-4"
            onClick={() => setOpenModalResult(false)}
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExamResult;
