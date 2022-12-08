import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ANSWERS_EXAM,
  START_EXAM,
  START_TIME,
} from '../../../constants/contstants';
import { localServices } from '../../../services/Applications/LocalServices';
import {
  answerStore,
  examStore,
  IInforUserDoExam,
  userStore,
} from '../../../store/rootReducer';
import ExamResult from '../ExamResult/ExamResult';
import ModalConfirm from '../../Commons/ModalConfirm/ModalConfirm';
import { classNames } from '../../../helper/classNames';
import { IoMdClose } from 'react-icons/io';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
import IntroExam from '../IntroExam/IntroExam';
import { sessionServices } from '../../../services/Applications/SessionServices';
import { validObject } from '../../../helper/validObject';

interface IHeaderDoExamProps {
  submited?: boolean;
}

const HeaderDoExam: React.FC<IHeaderDoExamProps> = ({ submited }) => {
  const sideBarRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { url } = useParams();
  const { exam, dataExamResult } = examStore();
  const { user } = userStore();
  const { userDoExam, setUserDoexamData } = answerStore();

  const [visibleModalIntro, setVisibleModalIntro] = useState<boolean>(false);
  const [visibleModalResult, setVisibleModalResult] = useState<boolean>(false);
  const [visibleModalExit, setVisileModalExit] = useState<boolean>(false);
  const [activeSideBar, setActiveSideBar] = useState<boolean>(false);

  const handleExitExam = () => {
    localServices.clearItem(START_TIME);
    localServices.clearItem(ANSWERS_EXAM);
    sessionServices.setData(START_EXAM, false);

    setUserDoexamData({} as IInforUserDoExam);
    if (validObject(user)) {
      navigate('/');
    } else {
      const urlNavigate = '/e/' + url;
      navigate(urlNavigate);
    }
  };

  const clickOutSideSidebar = () => {
    setActiveSideBar(false);
  };

  useOnClickOutside(sideBarRef, clickOutSideSidebar);

  return (
    <header
      className="py-3 bg-white"
      style={{
        boxShadow: '0 1px 14px 0 rgb(0 0 0 / 10%)',
      }}
    >
      <ExamResult
        setVisibleModal={setVisibleModalResult}
        visibleModal={visibleModalResult}
        point={dataExamResult?.point || 0}
      />

      <ModalConfirm
        visible={visibleModalExit}
        label="Thoát khỏi bài thi"
        title="Bạn có chắc chắn muốn thoát khỏi bài thi?
        Khi thoát khỏi bài thi, kết quả thi của bạn sẽ không được lưu lại."
        onConfirm={handleExitExam}
        onCancle={() => setVisileModalExit(false)}
      />

      <IntroExam
        visibleModalIntro={visibleModalIntro}
        setVisibleModalIntro={setVisibleModalIntro}
      />

      <div
        className={classNames(
          `side-bar fixed z-40 top-0 transition-all duration-400 w-4/5 px-4
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
          <h3
            className="topic-title text-white text-lg pb-4
              border-b border-slate-50 border-opacity-40"
          >
            {exam.title}
          </h3>

          <p className="text-white text-tiny mt-4">
            Hello, {userDoExam.userName || user.username}
          </p>
          <button
            className={classNames(`w-full rounded-md bg-slate-200 py-2 mt-6`, {
              block: submited,
              hidden: !submited,
            })}
            // onClick={() => {
            //   if (isSubmitExam) {
            //     setVisibleModalResult(true);
            //   }
            // }}
          >
            Xem lại kết quả
          </button>
          <button
            className="w-full rounded-md bg-violet-100 py-2 mt-4
            text-violet-500"
            onClick={() => setVisibleModalIntro(true)}
          >
            Hướng dẫn
          </button>
          <button
            className="w-full rounded-md bg-red-100 py-2 mt-4
            text-red-500"
            onClick={() => setVisileModalExit(true)}
          >
            Thoát
          </button>
        </div>
      </div>

      <div className="container xs:px-4 md:px-10 flex items-center justify-between">
        <div
          className="header-left font-semibold text-lg text-slate-800
          flex items-center"
        >
          <ul
            className="mr-3 w-max lg:hidden"
            onClick={() => setActiveSideBar(true)}
          >
            <li className="w-5 h-0.5 bg-slate-600 rounded-md mb-1"></li>
            <li className="w-4 h-0.5 bg-slate-600 rounded-md mb-1"></li>
            <li className="w-3 h-0.5 bg-slate-600 rounded-md"></li>
          </ul>
          <h3 className="topic-title xs:hidden lg:block">{exam.title}</h3>
        </div>
        <div className="header-right flex items-center text-slate-800 text-sm font-semibold">
          <div className="ctas items-center xs:hidden lg:flex">
            <button
              className={classNames(
                `px-4 py-1.5 bg-green-100 rounded-2xl ml-4 text-green-600`,
                {
                  block: submited,
                  hidden: !submited,
                }
              )}
              // onClick={() => {
              //   if (isSubmitExam) {
              //     setVisibleModalResult(true);
              //   }
              // }}
            >
              Xem lại kết quả
            </button>

            <button
              className="px-4 py-1.5 bg-violet-50 text-violet-500 rounded-2xl ml-4
              flex items-center"
              onClick={() => setVisibleModalIntro(true)}
            >
              Hướng dẫn
            </button>

            <button
              className="px-4 py-1.5 bg-slate-100 rounded-2xl ml-4
              flex items-center"
              onClick={() => setVisileModalExit(true)}
            >
              Thoát
            </button>
          </div>
          <p className="ml-4">Hello, {userDoExam.userName || user.username}</p>
        </div>
      </div>
    </header>
  );
};

export default HeaderDoExam;
