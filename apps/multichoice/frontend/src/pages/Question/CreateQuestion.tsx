import React, { useRef } from 'react';
import FormCreateQuestion, {
  IFormCreateQuestionRef,
} from '../../components/CreateQuestion/FormCreateQuestion/FormCreateQuestion';
import HeaderCreateQuestion from '../../components/CreateQuestion/HeaderCreateQuestion';

const CreateQuestion: React.FC = () => {
  const createQuestionRef = useRef<IFormCreateQuestionRef>();

  const submitForm = () => {
    if (createQuestionRef.current) {
      createQuestionRef.current.submitFormCreateAnswer();
    }
  };

  return (
    <>
      <div className="header">
        <HeaderCreateQuestion submitForm={submitForm} />
      </div>
      <div className="content-page pt-5 pb-10 bg-slate-100">
        <FormCreateQuestion ref={createQuestionRef} />
      </div>
    </>
  );
};

export default CreateQuestion;
