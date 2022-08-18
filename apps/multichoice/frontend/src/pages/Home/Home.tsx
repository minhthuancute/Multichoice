import React, { useLayoutEffect } from 'react';
import DefaultLayout from '../../layouts/DefaultLayout';
import { titleServices } from '../../services/TitleServices';
import { IDataUser, userStore } from '../../store/rootReducer';
import { UserActionsEnum } from '../../store/User/userTypes';

const Home: React.FC = () => {
  const { dispatch } = userStore();
  useLayoutEffect(() => {
    titleServices.setTitle('Multichoice');
  }, []);

  const demo = () => {
    dispatch({
      type: UserActionsEnum.DEMO,
      userPayload: {} as IDataUser,
    });
  };

  return (
    <DefaultLayout>
      <button onClick={() => demo()}>Click me</button>
    </DefaultLayout>
  );
};

export default Home;
