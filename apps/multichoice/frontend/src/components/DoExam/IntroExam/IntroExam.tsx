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
      visible={visibleModalIntro}
      setVisibleModal={setVisibleModalIntro}
      placement="CENTER"
    >
      <>
        <h4 className="text-center text-xl font-semibold mb-5 capitalize">
          Hướng dẫn làm bài
        </h4>
        <ul>
          <li>- Đề thi chỉ nộp bài một lần</li>
          <li>- Không thể nộp bài khi đã hết thời gian</li>
          <li>
            - Bấm <b>"Thoát"</b> để làm lại bài thi
          </li>
        </ul>

        <Button className="mt-5" onClick={() => setVisibleModalIntro(false)}>
          Đóng
        </Button>
      </>
    </Modal>
  );
};

export default IntroExam;
