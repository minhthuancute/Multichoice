import React, { useContext } from 'react';
import { doExamContext } from '../../../contexts/DoExamContext';
import { answerStore } from '../../../store/rootReducer';
import Button from '../../Commons/Button/Button';
import Modal from '../../Commons/Modal/Modal';

interface IConfirmSubmitProps {
  setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>;
  visibleModal?: boolean;
}

const ConfirmSubmit: React.FC<IConfirmSubmitProps> = ({
  setVisibleModal,
  visibleModal = false,
}) => {
  const { handleSubmitExam } = useContext(doExamContext);
  const { answers } = answerStore();

  const countUnSelectAnswer = (): number => {
    const count = answers.filter((answer) => {
      return answer?.answerID.length === 0;
    });
    return count.length;
  };

  return (
    <Modal
      headerTitle="Nộp Bài"
      visible={visibleModal}
      setVisibleModal={setVisibleModal}
      size="sm"
      placement="CENTER"
    >
      <>
        <div className="header">
          {countUnSelectAnswer() > 0 ? (
            <p className="text-slate-800">
              Bạn còn{' '}
              <span className="font-semibold">
                {countUnSelectAnswer()} (câu hỏi)
              </span>{' '}
              chưa chọn đáp án. Bạn có chắc chắn muốn nộp bài ?
            </p>
          ) : (
            <p className="mt-4 text-slate-800">
              Bạn có chắc chắn muốn nộp bài?
            </p>
          )}
        </div>
        <div className="ctas flex items-center justify-end gap-x-2 mt-5">
          <Button type="button" onClick={() => setVisibleModal(false)}>
            Huỷ
          </Button>
          <Button
            color="success"
            type="button"
            onClick={() => {
              handleSubmitExam();
              setVisibleModal(false);
            }}
          >
            Nộp bài
          </Button>
        </div>
      </>
    </Modal>
  );
};

export default ConfirmSubmit;
