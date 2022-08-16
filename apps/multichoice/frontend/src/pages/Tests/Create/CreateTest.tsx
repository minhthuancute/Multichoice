import React from 'react';
import HeaderCreateTest from '../../../components/CreateTest/HeaderCreateTest';
import DefaultLayout from '../../../layouts/DefaultLayout';

const CreateTest: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="create-test">
        <div className="header">
          <HeaderCreateTest />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateTest;
