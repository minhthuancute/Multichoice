import React, { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import HeaderDoExam from '../../components/DoExam/HeaderDoExam/HeaderDoExam';
import MainDoExam from '../../components/DoExam/MainDoExam/MainDoExam';
import {
  IS_SUBMIT_EXAM,
  START_EXAM,
  START_TIME,
  TOKEN,
} from '../../constants/contstants';
import { examServices } from '../../services/Exam/ExamServices';
import { localServices } from '../../services/Applications/LocalServices';
import { sessionServices } from '../../services/Applications/SessionServices';
import { examDetailStore } from '../../store/Exam/examDetailStore';
import {
  answerStore,
  examStore,
  IInforUserDoExam,
} from '../../store/rootReducer';
import { IPayloadStartExam } from '../../services/Exam/type';
import { isLogin } from '../../utils/check_logged';

const DoExam: React.FC = () => {
  const navigate = useNavigate();
  const { url } = useParams();
  const { getExam } = examStore();
  const { setExamDetailData } = examDetailStore();
  const { userDoExam, setUserDoexamData } = answerStore();

  const startExam = async (id: number) => {
    // getExam(exam_id);
    // const id =
    const canStartExam: boolean = sessionServices.getData(START_EXAM) === false;

    if (canStartExam) {
      sessionServices.setData(IS_SUBMIT_EXAM, false);
      sessionServices.setData(START_EXAM, true);
      try {
        const payload: IPayloadStartExam = {
          topicID: id,
          userName: userDoExam.userName,
        };
        const { data } = await examServices.startExam(payload);
        if (data.success) {
          setUserDoexamData({
            userName: userDoExam.userName,
            userId: data.data.userid,
          } as IInforUserDoExam);
        }
      } catch {
        navigate('/');
      }
    }
  };

  useEffect(() => {
    getExam(url || '');

    if (!sessionServices.getData(START_TIME)) {
      sessionServices.setData(START_TIME, Date.now());
    }
    return () => {
      sessionServices.setData(START_EXAM, false);
      sessionServices.clearItem(START_TIME);
    };
  }, []);

  return isLogin() ? (
    <div className="h-max relative">
      <HeaderDoExam />
      <MainDoExam />
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default DoExam;
