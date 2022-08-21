import React, { useRef } from 'react';
import FormCreateTest from '../../../components/CreateTest/FormCreateTest';
import HeaderCreateTest from '../../../components/CreateTest/HeaderCreateTest';

const CreateTest: React.FC = () => {
  const childRef: any = useRef();

  const submitForm = () => {
    childRef.current.submitForm();
  };

  return (
    <div className="create-test">
      <div className="header">
        <HeaderCreateTest submitForm={submitForm} />
      </div>
      <div className="content-page form py-5 bg-slate-100">
        <FormCreateTest ref={childRef} />
      </div>
    </div>
  );
};

export default CreateTest;
