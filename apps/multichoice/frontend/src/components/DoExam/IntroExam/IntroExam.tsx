import React from 'react';
import Button from '../../Commons/Button/Button';
import Modal from '../../Commons/Modal/Modal';

interface IIntroExamProps {
  visibleModalIntro: boolean;
  setVisibleModalIntro: React.Dispatch<React.SetStateAction<boolean>>;
}

const IntroExam: React.FC<IIntroExamProps> = ({
  visibleModalIntro,
  setVisibleModalIntro,
}) => {
  return (
    <Modal
      headerTitle="Hướng dẫn làm bài"
      visible={visibleModalIntro}
      setVisibleModal={setVisibleModalIntro}
      placement="CENTER"
    >
      <>
        <ul className="text-tiny text-slate-800">
          <li>
            - Đề thi chỉ nộp bài một lần và không thể nộp bài khi đã hết thời
            gian.
          </li>
          <li>
            - Bấm <b>"Thoát"</b> để làm lại bài thi.
          </li>
        </ul>

        <div className="text-end mt-6">
          <Button onClick={() => setVisibleModalIntro(false)}>Đóng</Button>
        </div>
      </>
    </Modal>
  );
};

export default IntroExam;
