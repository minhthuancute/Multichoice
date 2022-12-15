// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { ReactNotifications } from 'react-notifications-component';
import AppRoutes from '../components/Routes/AppRoutes';
import Splash from '../components/Splash/Splash';
import { userStore } from '../store/rootReducer';

const App: React.FC = () => {
  const { checkAuthenticated, isAuthenticated } = userStore();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const blackList = ['/login', '/register'];
    if (!blackList.includes(currentPath) && !isAuthenticated) {
      checkAuthenticated();
    }
  }, []);

  return (
    <>
      <ReactNotifications />
      <Splash />
      <AppRoutes />
    </>
  );
};

export default App;
