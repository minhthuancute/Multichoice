import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ANSWERS_EXAM,
  START_EXAM,
  START_TIME,
} from '../../constants/contstants';
import { localServices } from '../../services/LocalServices';
import { examStore, IInforUserDoExam } from '../../store/rootReducer';
import ExamResult from './ExamResult';
import ModalConfirm from '../Commons/ModalConfirm/ModalConfirm';
import { classNames } from '../../helper/classNames';

const HeaderDoExam: React.FC = () => {
  const { exam_id } = useParams();
  const navigate = useNavigate();
  const {
    exam,
    userDoExam,
    setUserData,
    setIsSubmitExam,
    dataExamResult,
    isSubmitExam,
  } = examStore();

  const [openModalResult, setOpenModalResult] = useState<boolean>(false);
  const [openModalConfirmExit, setOpenModalConfirmExit] =
    useState<boolean>(false);

  const handleExitExam = () => {
    localServices.clearItem(START_TIME);
    localServices.clearItem(ANSWERS_EXAM);
    localServices.setData(START_EXAM, false);

    setIsSubmitExam(false);
    setUserData({ is_guest: true } as IInforUserDoExam);
    const urlNavigate = '/e/' + exam_id;
    navigate(urlNavigate);
  };

  return (
    <header
      className="header py-4
       bg-white"
      style={{
        boxShadow: '0 1px 16px 0 rgb(0 0 0 / 8%)',
      }}
    >
      <ExamResult
        setOpenModalResult={setOpenModalResult}
        openModalResult={openModalResult}
        user_name={dataExamResult?.user_name || ''}
        point={dataExamResult?.point || 0}
      />
      <ModalConfirm
        isOpen={openModalConfirmExit}
        title="Bạn có chắc chắn muốn thoát khỏi bài thi?
        Khi thoát khỏi bài thi, kết quả thi của bạn sẽ không được lưu lại."
        onClose={() => setOpenModalConfirmExit(false)}
        onConfirm={handleExitExam}
      />
      <div className="container xs:px-4 md:px-10 flex items-center justify-between">
        <div className="header-left">
          <h4 className=" text-slate-800 font-semibold">{exam.title}</h4>
        </div>

        <div className="header-right flex items-center">
          <button
            className={classNames(
              `px-4 py-1.5 bg-slate-50 rounded-2xl text-sm text-slate-800
              flex items-center font-semibold xs:hidden md:block`,
              {
                'cursor-not-allowed opacity-80': !isSubmitExam,
              }
            )}
            onClick={() => {
              if (!isSubmitExam) return;
              setOpenModalResult(true);
            }}
          >
            Xem lại kết quả
          </button>

          <button
            className="px-4 py-1.5 rounded-2xl text-sm ml-3 border border-white
           flex items-center font-semibold bg-slate-50 text-slate-800"
            onClick={() => setOpenModalConfirmExit(true)}
          >
            Thoát
          </button>
          <div className="user">
            <p className="text-tiny text-slate-800 font-semibold ml-3">
              {userDoExam.user_name}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDoExam;
