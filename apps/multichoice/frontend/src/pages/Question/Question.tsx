import React from 'react';
import CreateQuestion from '../../components/CreateQuestion/CreateQuestion';
import HeaderCreateQuestion from '../../components/HeaderCreateQuestion/HeaderCreateQuestion';

const Question: React.FC = () => {
  return (
    <>
      <div className="header">
        <HeaderCreateQuestion />
      </div>
      <div className="pt-5 pb-10">
        <CreateQuestion />
      </div>
    </>
  );
};

export default Question;
