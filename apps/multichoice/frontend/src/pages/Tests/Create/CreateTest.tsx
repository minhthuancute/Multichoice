import React from 'react';
import FormCreateTest from '../../../components/CreateTest/FormCreateTest';
import HeaderCreateTest from '../../../components/CreateTest/HeaderCreateTest';
import DefaultLayout from '../../../layouts/DefaultLayout';

const CreateTest: React.FC = () => {
  return (
    <DefaultLayout>
      <div className="create-test">
        <div className="header">
          <HeaderCreateTest />
        </div>
        <div className="form py-5 bg-slate-100 min-h-screen">
          <FormCreateTest />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateTest;
