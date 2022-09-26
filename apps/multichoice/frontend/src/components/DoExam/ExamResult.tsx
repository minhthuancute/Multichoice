import React from 'react';
import { BiCheckDouble } from 'react-icons/bi';
import Modal from '../Modal/Modal';

interface IExamResult {
  setOpenModalResult: React.Dispatch<React.SetStateAction<boolean>>;
  openModalResult?: boolean;
  user_name: string;
  point: number;
}

const ExamResult: React.FC<IExamResult> = ({
  setOpenModalResult,
  openModalResult = false,
  user_name = '',
  point,
}) => {
  return (
    <Modal openModal={openModalResult} setOpenModal={setOpenModalResult}>
      <div
        className="modal-content mx-auto mt-10 px-5 flex flex-col justify-center
       bg-white rounded-md max-w-lg w-full h-72"
      >
        <div className="header text-center">
          <BiCheckDouble className="text-green-600 text-5xl mx-auto" />
          <h4 className="mt-4 text-slate-800">
            Cảm ơn <span className="font-semibold">{user_name}</span> đã tham
            gia bài kiểm tra!
          </h4>
          <p className="mt-4">
            Số điểm bài thi bạn đạt được là:{' '}
            <span className="font-semibold text-green-600">{point} (điểm)</span>
          </p>
        </div>
        <div className="body ctas flex items-center justify-center gap-x-2 mt-12">
          <button
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
          text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-primary-800"
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
