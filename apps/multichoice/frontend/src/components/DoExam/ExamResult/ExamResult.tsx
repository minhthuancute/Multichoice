import React from 'react';
import { answerStore } from '../../../store/rootReducer';
import Button from '../../Commons/Button/Button';
import Modal from '../../Commons/Modal/Modal';

interface IExamResultProps {
  setVisibleModal?: React.Dispatch<React.SetStateAction<boolean>>;
  visibleModal?: boolean;
}

const ExamResult: React.FC<IExamResultProps> = ({
  setVisibleModal,
  visibleModal = false,
}) => {
  const { point } = answerStore();
  return (
    <Modal
      headerTitle="Kết quả làm bài"
      visible={visibleModal}
      setVisibleModal={setVisibleModal}
      placement="CENTER"
      size="sm"
    >
      <div className="flex flex-col justify-center bg-white rounded-md">
        <div className="header">
          <p className="text-slate-800">
            Cảm ơn bạn đã tham gia bài kiểm tra! Số điểm bài thi bạn đạt được
            là:{' '}
            <span className="font-semibold text-green-600">{point} (điểm)</span>
          </p>
        </div>
        <div className="body text-end mt-6">
          <Button onClick={() => setVisibleModal && setVisibleModal(false)}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExamResult;
