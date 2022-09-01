import React from 'react';
import FooterDoExam from '../../../components/DoExam/FooterDoExam';
import HeaderDoExam from '../../../components/DoExam/HeaderDoExam';
import MainDoExam from '../../../components/DoExam/MainDoExam';

const DoExam: React.FC = () => {
  return (
    <div>
      <HeaderDoExam />
      <MainDoExam />
      <FooterDoExam />
    </div>
  );
};

export default DoExam;
