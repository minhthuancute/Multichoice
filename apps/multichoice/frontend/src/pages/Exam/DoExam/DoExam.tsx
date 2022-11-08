import React, { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import HeaderDoExam from '../../../components/DoExam/HeaderDoExam';
import MainDoExam from '../../../components/DoExam/MainDoExam';
import {
  IS_SUBMIT_EXAM,
  START_EXAM,
  START_TIME,
  TOKEN,
} from '../../../constants/contstants';
import {
  examServices,
  IPayloadStartExam,
} from '../../../services/ExamServices';
import { localServices } from '../../../services/LocalServices';
import { sessionServices } from '../../../services/SessionServices';
import { examDetailStore } from '../../../store/Exam/examDetailStore';
import {
  answerStore,
  examStore,
  IInforUserDoExam,
} from '../../../store/rootReducer';

const DoExam: React.FC = () => {
  const navigate = useNavigate();
  const { exam_id } = useParams();
  const { setExamData } = examStore();
  const { setExamDetailData } = examDetailStore();
  const { userDoExam, setUserDoexamData } = answerStore();

  const getExamInfor = async () => {
    try {
      const { data, status } = await examServices.getExamInfor(exam_id || '');
      if (status === 200) {
        setExamData(data);
        startExam(data.id);
        setExamDetailData(data);
      }
    } catch {
      navigate('/');
    }
  };

  const startExam = async (id: number) => {
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
        //
      }
    }
  };

  useEffect(() => {
    getExamInfor();
    // window.addEventListener('beforeunload', function (e) {
    //   const confirmationMessage =
    //     'It looks like you have been editing something. ' +
    //     'If you leave before saving, your changes will be lost.';

    //   (e || window.event).returnValue = confirmationMessage;
    //   return confirmationMessage;
    // });
    if (!sessionServices.getData(START_TIME)) {
      sessionServices.setData(START_TIME, Date.now());
    }
    return () => {
      sessionServices.setData(START_EXAM, false);
      sessionServices.clearItem(START_TIME);
    };
  }, []);

  return localServices.getData(TOKEN) || userDoExam.userName ? (
    <div className="h-max relative">
      <HeaderDoExam />
      <MainDoExam />
    </div>
  ) : (
    <Navigate to={`/e/${exam_id}`} />
  );

  // userDoExam.userName && userDoExam.userId ? (
  //   <div className="h-max relative">
  //     <HeaderDoExam />
  //     <MainDoExam />
  //   </div>
  // ) : (
  //   <Navigate to={`/e/${exam_id}`} />
  // );
};

export default DoExam;
