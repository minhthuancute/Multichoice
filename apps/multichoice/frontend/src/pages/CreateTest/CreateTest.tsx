import React from 'react';
import FormCreateTest from '../../components/CreateTest/FormCreateTest';
import HeaderCreateTest from '../../components/CreateTest/HeaderCreateTest';

const CreateTest: React.FC = () => {
  return (
    <>
      <div className="header">
        <HeaderCreateTest />
      </div>
      <div className="content-page py-5 bg-slate-100">
        <FormCreateTest />
      </div>
    </>
  );
};

export default CreateTest;
