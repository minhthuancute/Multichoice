import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderDoExam from '../../components/DoExam/HeaderDoExam/HeaderDoExam';
import {
  IS_SUBMIT_EXAM,
  START_EXAM,
  START_TIME,
} from '../../constants/contstants';
import { examServices } from '../../services/Exam/ExamServices';
import { sessionServices } from '../../services/Applications/SessionServices';
import {
  answerStore,
  examStore,
  userExamStore,
  userStore,
} from '../../store/rootReducer';
import { IPayloadEndExam, IPayloadStartExam } from '../../services/Exam/type';
import { DoExamProvider, IDoExamContext } from '../../contexts/DoExamContext';
import { notify } from '../../helper/notify';
import { iNotification } from 'react-notifications-component';
import ShowQuestion from '../../components/DoExam/ShowQuestion/ShowQuestion';
import NavQuestion from '../../components/DoExam/NavQuestion/NavQuestion';
import CollectInfor from '../../components/CollectInfor/CollectInfor';
import { validObject } from '../../helper/validObject';
import ExamResult from '../../components/DoExam/ExamResult/ExamResult';
import { validArray } from '../../helper/validArray';

const DoExam: React.FC = () => {
  const navigate = useNavigate();
  const { url } = useParams();
  const { exam, getExam } = examStore();
  const { user, isAuthenticated } = userStore();
  const { answers, initAnswers, setPoint } = answerStore();
  const { userID, setUserID, setUserName } = userExamStore();
  const [submited, setSubmited] = useState<boolean>(
    !!sessionServices.getData(IS_SUBMIT_EXAM)
  );
  const [indexQuestion, setIndexQuestion] = useState<number>(0);
  const [visibleModalInfor, setVisibleModalInfor] = useState<boolean>(
    !isAuthenticated() && !sessionServices.getData(START_EXAM)
  );
  const [visibleModalResult, setVisibleModalResult] = useState<boolean>(false);

  const startExam = async (payload: IPayloadStartExam) => {
    if (!sessionServices.getData(START_EXAM)) {
      sessionServices.setData(IS_SUBMIT_EXAM, false);
      sessionServices.setData(START_EXAM, true);
      try {
        const { data } = await examServices.startExam(payload);
        if (data.success) {
          setUserID(data.data.userid);
          setUserName(payload.userName);
        }
      } catch {
        navigate('/');
      }
    }
  };

  const handleSubmitExam = async () => {
    setSubmited(true);
    sessionServices.setData(IS_SUBMIT_EXAM, true);
    try {
      const payloadFixedtime: IPayloadEndExam = {
        url: exam.url,
        userID: userID,
        answerUsers: answers,
      };
      const { data } = await examServices.submitExam(payloadFixedtime);

      if (data.success) {
        setVisibleModalResult(true);
        setPoint(data.data.point);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const { message } = error.response.data;
      notify({
        message: message,
        type: 'danger',
      } as iNotification);
    }
  };

  useEffect(() => {
    getExam(url || '');
    if (!sessionServices.getData(START_TIME) && isAuthenticated()) {
      sessionServices.setData(START_TIME, Date.now());
    }
  }, []);

  useEffect(() => {
    if (validObject(exam)) {
      const payload: IPayloadStartExam = {
        topicID: exam.id,
        userName: user.username,
      };
      if (isAuthenticated()) {
        startExam(payload);
      }
      if (!validArray(answers)) {
        initAnswers(exam.questions);
      }
    }
  }, [exam]);

  const contextValue: IDoExamContext = {
    startExam: startExam,
    handleSubmitExam: handleSubmitExam,
  };

  return (
    <DoExamProvider value={contextValue}>
      <HeaderDoExam submited={submited} />

      {visibleModalInfor ? (
        <CollectInfor
          topicID={exam.id}
          setVisibleModalInfor={setVisibleModalInfor}
        />
      ) : (
        <div className="container mx-auto pt-5 pb-10 lg:px-10 flex gap-x-5">
          <div className="w-full lg:w-2/3 h-full">
            <ShowQuestion
              questions={exam.questions}
              indexQuestion={indexQuestion}
              setIndexQuestion={setIndexQuestion}
              submited={submited}
            />
          </div>
          <div className="w-1/3 xs:hidden lg:block h-full">
            <NavQuestion
              indexQuestion={indexQuestion}
              setIndexQuestion={setIndexQuestion}
            />
          </div>
        </div>
      )}

      <ExamResult
        setVisibleModal={setVisibleModalResult}
        visibleModal={visibleModalResult}
      />
    </DoExamProvider>
  );
};

export default DoExam;
