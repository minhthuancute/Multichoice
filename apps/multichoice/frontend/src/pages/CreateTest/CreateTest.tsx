import React from 'react';
import FormCreateTest from '../../components/CreateTest/FormCreateTest';
import HeaderCreateTest from '../../components/HeaderCreateTest/HeaderCreateTest';

const CreateTest: React.FC = () => {
  return (
    <>
      <div className="header">
        <HeaderCreateTest />
      </div>
      <div className="py-5 pb-10">
        <FormCreateTest />
      </div>
    </>
  );
};

export default CreateTest;
