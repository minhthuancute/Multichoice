import React, { useRef } from 'react';
import FormCreateTest, {
  IFormCreateTestRef,
} from '../../../components/CreateTest/FormCreateTest';
import HeaderCreateTest from '../../../components/CreateTest/HeaderCreateTest';

const CreateTest: React.FC = () => {
  const createTestRef = useRef<IFormCreateTestRef>();

  const submitFormCreateTest = () => {
    if (createTestRef.current) {
      createTestRef?.current.submitForm();
    }
  };

  return (
    <div className="create-test">
      <div className="header">
        <HeaderCreateTest onSubmitCreateTest={submitFormCreateTest} />
      </div>
      <div className="content-page form py-5 bg-slate-100">
        <FormCreateTest ref={createTestRef} />
      </div>
    </div>
  );
};

export default CreateTest;
