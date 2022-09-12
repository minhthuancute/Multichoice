import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ANSWERS_EXAM,
  DATA_USER_DO_EXAM,
  START_TIME,
} from '../../constants/contstants';
import { cookieServices } from '../../services/CookieServices';
import { localServices } from '../../services/LocalServices';
import { examStore, IInforUserDoExam } from '../../store/rootReducer';
import { IUserDoExam } from '../../types';
import CountDown from '../Commons/CountDown/CountDown';

const HeaderDoExam: React.FC = () => {
  const { exam_id } = useParams();
  const navigate = useNavigate();

  const { exam, userDoExam, setUserData } = examStore();

  const startTime: number = localServices.getData(START_TIME) || 0;
  const endTime: number = +exam.expirationTime;

  const handleCookieDoexam = () => {
    const dataExam: IUserDoExam = {
      exam_title: exam.title,
      user_id: userDoExam.user_id,
      is_loggout_current_user: true,
    };
    cookieServices.deleteCookie(DATA_USER_DO_EXAM);
    cookieServices.setCookie(DATA_USER_DO_EXAM, dataExam, 30);
  };

  const handleExitExam = () => {
    handleCookieDoexam();
    localServices.clearItem(START_TIME);
    localServices.clearItem(ANSWERS_EXAM);

    setUserData({} as IInforUserDoExam);

    const urlNavigate = '/exam/' + exam_id;
    navigate(urlNavigate);
  };

  return (
    <header className="header py-4 shadow-md bg-primary-900">
      <div className="container flex items-center justify-between">
        <div className="header-left">
          <p className="text-tiny text-white">Hello, {userDoExam.user_name}</p>
        </div>
        <div className="header-right flex items-center">
          <CountDown startTime={startTime} endTime={endTime} key="count-down" />

          <button
            className="px-8 py-2 bg-slate-100 rounded-md text-sm ml-5
          text-black flex items-center font-semibold"
            onClick={handleExitExam}
          >
            Thoát
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderDoExam;
