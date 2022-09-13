import React, { useRef } from 'react';
import FormCreateQuestion from '../../components/CreateQuestion/FormCreateQuestion';
import HeaderCreateQuestion from '../../components/CreateQuestion/HeaderCreateQuestion';

const CreateQuestion: React.FC = () => {
  const childRef: any = useRef();

  const submitForm = () => {
    childRef.current.submitForm();
  };

  return (
    <>
      <div className="header">
        <HeaderCreateQuestion submitForm={submitForm} />
      </div>
      <div className="content-page pt-5 pb-10 bg-slate-100">
        <FormCreateQuestion ref={childRef} />
      </div>
    </>
  );
};

export default CreateQuestion;
