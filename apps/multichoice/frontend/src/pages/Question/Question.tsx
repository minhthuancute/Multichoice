import React from 'react';
import CreateQuestion from '../../components/CreateQuestion/CreateQuestion';
import HeaderCreateQuestion from '../../components/HeaderCreateQuestion/HeaderCreateQuestion';

const Question: React.FC = () => {
  return (
    <>
      <div className="header">
        <HeaderCreateQuestion />
      </div>
      <div className="content-page pt-5 pb-10 bg-slate-100">
        <CreateQuestion />
      </div>
    </>
  );
};

export default Question;
