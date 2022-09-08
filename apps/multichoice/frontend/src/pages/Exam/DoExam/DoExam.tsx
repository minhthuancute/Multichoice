import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import HeaderDoExam from '../../../components/DoExam/HeaderDoExam';
import MainDoExam from '../../../components/DoExam/MainDoExam';
import { examServices } from '../../../services/ExamServices';
import { examStore } from '../../../store/rootReducer';

const DoExam: React.FC = () => {
  const { exam_id } = useParams();
  const { setExamData } = examStore();

  const getExamInfor = async () => {
    try {
      const { data } = await examServices.getExamInfor(exam_id || '');
      setExamData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getExamInfor();
  }, []);

  return (
    <div>
      <HeaderDoExam />
      <MainDoExam />
    </div>
  );
};

export default DoExam;
