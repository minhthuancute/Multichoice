// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ReactNotifications } from 'react-notifications-component';
import AppRoutes from '../components/Routes/AppRoutes';
import Splash from '../components/Splash/Splash';
import { userStore } from '../store/rootReducer';

export const App: React.FC = () => {
  const { checkAuthenticated } = userStore();

  useEffect(() => {
    checkAuthenticated();
  }, []);

  return (
    <BrowserRouter>
      <ReactNotifications />
      <Splash />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
