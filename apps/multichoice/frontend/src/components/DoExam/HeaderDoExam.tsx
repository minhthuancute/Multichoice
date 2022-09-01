import React from 'react';
import { USER_DO_EXAM } from '../../constants/contstants';
import { sessionServices } from '../../services/SessionServices';

const HeaderDoExam: React.FC = () => {
  const user_name = sessionServices.getData(USER_DO_EXAM);

  return (
    <header
      className="header px-10 py-4 flex items-center justify-between
    shadow-md"
    >
      <div className="header-left">
        <h1 className="logo font-semibold text-xl">MultiChoice</h1>
      </div>
      <div className="header-right">
        <p className="text-tiny text-slate-800">
          Hello, <span className="font-semibold">{user_name}</span>
        </p>
      </div>
    </header>
  );
};

export default HeaderDoExam;
