import React from 'react';
import Modal from '../../Commons/Modal/Modal';

interface IIntroExamProps {
  openModalIntro: boolean;
  setOpenModalIntro: React.Dispatch<React.SetStateAction<boolean>>;
}

const IntroExam: React.FC<IIntroExamProps> = ({
  openModalIntro,
  setOpenModalIntro,
}) => {
  return (
    <Modal
      visible={openModalIntro}
      setVisibleModal={setOpenModalIntro}
      placement="CENTER"
    >
      <div
        className="modal-content px-5 flex flex-col justify-center
      bg-white rounded-md w-full py-8 text-slate-800"
      >
        <h4 className="text-center text-xl font-semibold mb-5 capitalize">
          Hướng dẫn làm bài
        </h4>
        <p>
          <span className="font-semibold">+</span> Đề thi chỉ nộp bài một lần
        </p>
        <p>
          <span className="font-semibold">+</span> Không thể nộp bài khi đã hết
          thời gian
        </p>
        <p>
          <span className="font-semibold">+</span> Bấm <b>"Thoát"</b> để làm lại
          bài thi
        </p>
        <button
          className="create-test btn-primary rounded-md flex justify-center items-center w-32 h-10 text-sm
        text-white font-bold bg-slate-800 mt-5 ml-auto"
          onClick={() => setOpenModalIntro(false)}
        >
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default IntroExam;
