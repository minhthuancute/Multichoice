import React, { useLayoutEffect } from 'react';
import DefaultLayout from '../../layouts/DefaultLayout';
import { titleServices } from '../../services/TitleServices';

const Home: React.FC = () => {
  useLayoutEffect(() => {
    titleServices.setTitle('Multichoice');
  }, []);

  return (
    <DefaultLayout>
      <div
        className="test-body py-5 bg-slate-100"
        style={{
          height: 'calc(100vh - 53px)',
        }}
      ></div>
    </DefaultLayout>
  );
};

export default Home;
