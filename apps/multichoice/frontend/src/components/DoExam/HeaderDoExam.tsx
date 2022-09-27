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

const HeaderDoExam: React.FC = () => {
  const { exam_id } = useParams();
  const navigate = useNavigate();
  const {
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
    const urlNavigate = '/exam/' + exam_id;
    navigate(urlNavigate);
  };

  return (
    <header className="header py-3 shadow-md">
      <ExamResult
        setOpenModalResult={setOpenModalResult}
        openModalResult={openModalResult}
        user_name={dataExamResult?.user_name || ''}
        point={dataExamResult?.point || 0}
      />
      <ModalConfirm
        isOpen={openModalConfirmExit}
        title="Bạn có chắc chắn muốn thoát khỏi bài thi.
        Khi thoát khỏi bài thi, kết quả thi của bạn sẽ không được lưu lại."
        onClose={() => setOpenModalConfirmExit(false)}
        onConfirm={handleExitExam}
      />
      <div className="container xs:px-4 md:px-10 flex items-center justify-between">
        <div className="header-left">
          <p className="text-tiny text-white">Hello, {userDoExam.user_name}</p>
        </div>
        <div className="header-right flex items-center">
          {isSubmitExam && (
            <button
              className="px-4 py-1.5 bg-slate-100 rounded-sm text-sm ml-5
         flex items-center font-semibold xs:hidden md:block"
              onClick={() => setOpenModalResult(true)}
            >
              Xem lại kết quả
            </button>
          )}

          <button
            className="px-4 py-1.5 border border-slate-800 rounded-sm text-sm ml-5
           flex items-center font-semibold text-slate-800"
            onClick={() => setOpenModalConfirmExit(true)}
          >
            Thoát
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderDoExam;
