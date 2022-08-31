import React, { useLayoutEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { examServices } from '../../../services/ExamServices';
import { examStore, answerStore, IAnswers } from '../../../store/rootReducer';
import { IExamResponse, IQuestion } from '../../../types';

import imgExam from '../../../assets/images/bg-exam.avif';

const Intro: React.FC = () => {
  const { exam_id } = useParams();
  const { setExamData } = examStore();
  const { setAnswers } = answerStore();

  const [exam, setExam] = useState<IExamResponse>();

  const getExamInfor = async () => {
    try {
      const { data } = await examServices.getExamInfor(exam_id || '');
      const examInfor: IExamResponse = data;
      const initAnswers: IAnswers[] = examInfor.questions.map(
        (questions: IQuestion) => {
          const tempArr: IAnswers = {
            questionID: questions.id,
            answersID: [],
          };
          return tempArr;
        }
      );
      setAnswers(initAnswers);
      setExam(data);
      setExamData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    getExamInfor();
  }, []);

  if (!exam) return null;

  return (
    <div className="container h-screen flex items-center">
      <div
        className="colect-infor max-h-[500px] h-full w-full flex items-center
        shadow-xl"
      >
        <div className="left h-full w-[500px]">
          <img
            src={imgExam}
            alt="exam multichoice"
            className="block h-full w-full object-cover"
          />
        </div>
        <div className="right flex-1 h-full relative">
          <div className="top absolute w-full top-1/2 transform -translate-y-1/2">
            <div className="text-center">
              <h4 className="text-slate-800 text-3xl">{exam.title}</h4>
              <p className="mt-2">{exam.description}</p>
            </div>
            <div className="pt-8 px-10">
              <Link
                to="login"
                className="create-test btn-primary rounded-md flex justify-center items-center w-full h-12 text-sm
              text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-opacity-90"
              >
                Tham gia ngay
              </Link>
            </div>
          </div>

          <div className="bottom text-center w-full px-10 py-4 mt-auto absolute bottom-0">
            <p className="text-sm ">
              &copy; 2022 Estates. All rights reserved | Designed by{' '}
              <span className="font-semibold text-primary-900">
                Multichoice Team
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
