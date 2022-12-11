// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ReactNotifications } from 'react-notifications-component';
import AppRoutes from '../components/Routes/AppRoutes';
import Splash from '../components/Splash/Splash';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ReactNotifications />
      <Splash />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
