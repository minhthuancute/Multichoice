import React, { useRef, useState } from 'react';
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
import { IoMdClose } from 'react-icons/io';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

const HeaderDoExam: React.FC = () => {
  const sideBarRef = useRef<HTMLDivElement>(null);

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
  const [activeSideBar, setActiveSideBar] = useState<boolean>(false);

  const handleExitExam = () => {
    localServices.clearItem(START_TIME);
    localServices.clearItem(ANSWERS_EXAM);
    localServices.setData(START_EXAM, false);
    setIsSubmitExam(false);
    setUserData({ is_guest: true } as IInforUserDoExam);
    const urlNavigate = '/exam/' + exam_id;
    navigate(urlNavigate);
  };

  const clickOutSideSidebar = () => {
    setActiveSideBar(false);
  };

  useOnClickOutside(sideBarRef, clickOutSideSidebar);

  return (
    <header
      className="header py-3"
      style={{
        boxShadow: '0 1px 14px 0 rgb(0 0 0 / 10%)',
      }}
    >
      <div
        className={classNames(
          `side-bar fixed z-40 top-0 transition-all duration-400 w-3/4 px-4
         h-full bg-slate-800 overflow-auto py-4 transform`,
          {
            '-translate-x-full': !activeSideBar,
          }
        )}
        ref={sideBarRef}
      >
        <div className="header flex justify-end">
          <button
            type="button"
            className="text-lg"
            onClick={() => setActiveSideBar(false)}
          >
            <IoMdClose className="text-lg text-white" />
          </button>
        </div>
        <div className="ctas mt-4 text-sm font-semibold">
          <p className="pb-3 border-b border-slate-50 border-opacity-40 text-white text-tiny">
            Hello, {userDoExam.user_name}
          </p>
          <button
            className="w-full rounded-md bg-slate-200 py-2 mt-8"
            onClick={() => {
              if (!isSubmitExam) return;
              setOpenModalResult(true);
            }}
          >
            Xem lại kết quả
          </button>
          <button
            className="w-full rounded-md bg-slate-200 py-2 mt-3"
            onClick={() => setOpenModalConfirmExit(true)}
          >
            Thoát
          </button>
        </div>
      </div>

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
        <div
          className="header-left font-semibold text-lg text-slate-800
        flex items-center"
        >
          <ul
            className="mr-3 w-max lg:hidden"
            onClick={() => setActiveSideBar(true)}
          >
            <li className="w-4 h-0.5 bg-slate-600 rounded-md mb-1"></li>
            <li className="w-3 h-0.5 bg-slate-600 rounded-md mb-1"></li>
            <li className="w-2 h-0.5 bg-slate-600 rounded-md"></li>
          </ul>
          <p>{exam.title}</p>
        </div>
        <div className="header-right flex items-center text-slate-800 text-sm font-semibold">
          <div className="ctas items-center hidden lg:flex">
            <button
              className={classNames(
                `px-4 py-1.5 bg-green-100 rounded-2xl ml-4
              flex items-center text-green-600`,
                {
                  'cursor-not-allowed': !isSubmitExam,
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
              className="px-4 py-1.5 bg-slate-100 rounded-2xl ml-4
           flex items-center"
              onClick={() => setOpenModalConfirmExit(true)}
            >
              Thoát
            </button>
          </div>
          <p className="ml-4">Hello, {userDoExam.user_name}</p>
        </div>
      </div>
    </header>
  );
};

export default HeaderDoExam;
