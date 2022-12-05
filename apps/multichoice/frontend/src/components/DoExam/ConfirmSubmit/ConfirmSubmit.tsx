import React, { useContext } from 'react';
import { doExamContext } from '../../../contexts/DoExamContext';
import Button from '../../Commons/Button/Button';
import Modal from '../../Commons/Modal/Modal';

interface IConfirmSubmitProps {
  unSelectAnswer: number;
  onCancle: () => void;
  setConfirmSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  visibleModal?: boolean;
}

const ConfirmSubmit: React.FC<IConfirmSubmitProps> = ({
  onCancle,
  unSelectAnswer,
  setConfirmSubmit,
  visibleModal = false,
}) => {
  const { handleSubmitExam } = useContext(doExamContext);

  return (
    <Modal
      visible={visibleModal}
      setVisibleModal={setConfirmSubmit}
      size="sm"
      placement="CENTER"
    >
      <>
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
        <div className="ctas flex items-center justify-center gap-x-2 mt-5">
          <Button type="button" onClick={() => onCancle()}>
            Huỷ
          </Button>
          <Button
            color="success"
            type="button"
            onClick={() => {
              handleSubmitExam();
              onCancle();
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
