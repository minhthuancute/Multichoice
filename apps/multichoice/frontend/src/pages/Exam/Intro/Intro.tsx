import React, { useEffect, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CURRENT_USER,
  DATA_USER_DO_EXAM,
  START_TIME,
} from '../../../constants/contstants';
import { cookieServices } from '../../../services/CookieServices';
import { examServices } from '../../../services/ExamServices';
import { localServices } from '../../../services/LocalServices';
import {
  examStore,
  answerStore,
  IAnswers,
  IDataUser,
  IInforUserDoExam,
} from '../../../store/rootReducer';
import { IExamResponse, IQuestion, IUserDoExam } from '../../../types';

const Intro: React.FC = () => {
  const navigate = useNavigate();

  const { exam_id } = useParams();
  const { exam, setExamData, setUserData } = examStore();
  const { setAnswers } = answerStore();

  const getExamInfor = async () => {
    try {
      const { data } = await examServices.getExamInfor(exam_id || '');
      const examInfor: IExamResponse = data;
      const initAnswers: IAnswers[] = examInfor.questions.map(
        (questions: IQuestion) => {
          const tempArr: IAnswers = {
            questionID: questions.id,
            answerID: [],
          };
          return tempArr;
        }
      );
      setAnswers(initAnswers);
      setExamData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserDoexamData = (): IUserDoExam | null => {
    const cookieData = cookieServices.getCookie(DATA_USER_DO_EXAM);
    if (cookieData) {
      const userDoExam: IUserDoExam = JSON.parse(
        cookieServices.getCookie(DATA_USER_DO_EXAM)
      );
      console.log(userDoExam);
      return userDoExam;
    }
    return null;
  };

  useEffect(() => {
    getUserDoexamData();
  }, []);

  const onNavigateLoginExam = () => {
    const userDoExam = getUserDoexamData();
    const currentUser = localServices.getData(CURRENT_USER);
    const currentExamTitle = exam.title;
    const userData: IDataUser = currentUser.state.user;

    const isLoggout =
      userDoExam?.is_loggout_current_user &&
      userDoExam.exam_title === currentExamTitle &&
      userData.id !== userDoExam.user_id;
    console.log(isLoggout);

    if (currentUser.state.user.token && !isLoggout) {
      localServices.setData(START_TIME, Date.now());

      setUserData({
        user_name: userData.username,
        user_id: userData.id,
      } as IInforUserDoExam);
      const urlNavigate = '/exam/' + exam.url + '/do-exam';
      navigate(urlNavigate);
    } else {
      localServices.setData(START_TIME, Date.now());

      const urlNavigate = '/exam/' + exam.url + '/login';
      navigate(urlNavigate);
    }
  };

  useLayoutEffect(() => {
    getExamInfor();
  }, []);

  if (!exam) return null;

  return (
    <div className="container h-screen flex items-center">
      <div
        className="colect-infor max-h-[450px] h-full w-full flex items-center
        shadow-xl"
      >
        <div className="left h-full w-[500px]">
          <img
            src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
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
              <button
                className="create-test btn-primary rounded-md flex justify-center items-center w-full h-11 text-sm
              text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-opacity-90"
                onClick={() => onNavigateLoginExam()}
              >
                Tham gia ngay
              </button>
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
