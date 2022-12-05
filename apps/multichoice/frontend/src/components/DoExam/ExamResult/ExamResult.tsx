import React from 'react';
import Button from '../../Commons/Button/Button';
import Modal from '../../Commons/Modal/Modal';

interface IExamResultProps {
  setVisibleModal?: React.Dispatch<React.SetStateAction<boolean>>;
  visibleModal?: boolean;
  point?: number;
}

const ExamResult: React.FC<IExamResultProps> = ({
  setVisibleModal,
  visibleModal = false,
  point = 0,
}) => {
  return (
    <Modal
      visible={visibleModal}
      setVisibleModal={setVisibleModal}
      placement="CENTER"
    >
      <div className="flex flex-col justify-center bg-white rounded-md">
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
        <div className="body text-center mt-8">
          <Button onClick={() => setVisibleModal && setVisibleModal(false)}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExamResult;
