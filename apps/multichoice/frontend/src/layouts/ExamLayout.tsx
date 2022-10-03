import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { IS_LOGGOUT_CURRENT_USER } from '../constants/contstants';
import { localServices } from '../services/LocalServices';

interface ILayout {
  children?: React.ReactNode;
}

const ExamLayout: React.FC<ILayout> = ({ children }) => {
  useEffect(() => {
    localServices.setData(IS_LOGGOUT_CURRENT_USER, false);
  }, []);

  return (
    <div className="authen-default">
      <main className="layout-authen__main">{children}</main>
      <Outlet />
    </div>
  );
};

export default ExamLayout;
