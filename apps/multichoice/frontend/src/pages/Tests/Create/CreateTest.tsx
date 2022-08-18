import React, { useRef, useState } from 'react';
import FormCreateTest from '../../../components/CreateTest/FormCreateTest';
import HeaderCreateTest from '../../../components/CreateTest/HeaderCreateTest';
import DefaultLayout from '../../../layouts/DefaultLayout';

const CreateTest: React.FC = () => {
  const childRef: any = useRef();

  const submitForm = () => {
    childRef.current.submitForm();
  };

  return (
    <DefaultLayout>
      <div className="create-test">
        <div className="header">
          <HeaderCreateTest submitForm={submitForm} />
        </div>
        <div className="form py-5 bg-slate-100 min-h-screen">
          <FormCreateTest ref={childRef} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateTest;
