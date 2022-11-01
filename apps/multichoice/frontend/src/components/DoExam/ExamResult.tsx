import React from 'react';
import { BiCheckDouble } from 'react-icons/bi';
import { answerStore } from '../../store/rootReducer';
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
  const { userDoExam } = answerStore();
  return (
    <Modal
      openModal={openModalResult}
      setOpenModal={setOpenModalResult}
      size="md"
      placement="CENTER"
    >
      <div className="flex flex-col justify-center bg-white rounded-md py-8">
        <div className="header text-center">
          <h2 className="text-slate-800 text-2xl font-semibold">
            Kết quả làm bài
          </h2>

          <h4 className="mt-4 text-slate-800">
            Cảm ơn{' '}
            <span className="font-semibold">
              {user_name || userDoExam.user_name}
            </span>{' '}
            đã tham gia bài kiểm tra!
          </h4>
          <p className="mt-4">
            Số điểm bài thi bạn đạt được là:{' '}
            <span className="font-semibold text-green-600">{point} (điểm)</span>
          </p>
        </div>
        <div className="body ctas flex items-center gap-x-2 mt-12">
          <button
            className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
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
