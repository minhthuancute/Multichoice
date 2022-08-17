import React, { useEffect, useRef, useState } from 'react';
import FormCreateTest from '../../../components/CreateTest/FormCreateTest';
import HeaderCreateTest from '../../../components/CreateTest/HeaderCreateTest';
import DefaultLayout from '../../../layouts/DefaultLayout';

const CreateTest: React.FC = () => {
  const childRef: any = useRef();
  const [shouldSubmit, setShouldSubmit] = useState<boolean>(false);

  const submitForm = () => {
    setShouldSubmit((state) => !state);
  };

  useEffect(() => {
    console.log(childRef);
    if (shouldSubmit) {
      childRef.current.submitForm();
    }
  }, [shouldSubmit]);

  return (
    <DefaultLayout>
      <div className="create-test">
        <div className="header">
          <HeaderCreateTest submitForm={submitForm} />
        </div>
        <div className="form py-5 bg-slate-100 min-h-screen">
          <FormCreateTest ref={childRef} shouldSubmit={shouldSubmit} />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CreateTest;
