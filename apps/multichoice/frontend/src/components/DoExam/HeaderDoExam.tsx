import React from 'react';
import { START_TIME } from '../../constants/contstants';
import { localServices } from '../../services/LocalServices';
import { examStore } from '../../store/rootReducer';
import CountDown from '../Commons/CountDown/CountDown';

const HeaderDoExam: React.FC = () => {
  const { exam, userDoExam } = examStore();

  const startTime: number = localServices.getData(START_TIME) || 0;
  const endTime: number = +exam.expirationTime;

  return (
    <header className="header py-4 shadow-md bg-primary-900">
      <div className="container flex items-center justify-between">
        <div className="header-left">
          <p className="text-tiny text-white">Hello, {userDoExam.user_name}</p>
        </div>
        <div className="header-right">
          <CountDown startTime={startTime} endTime={endTime} />
        </div>
      </div>
    </header>
  );
};

export default HeaderDoExam;
