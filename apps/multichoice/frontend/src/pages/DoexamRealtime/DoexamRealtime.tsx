/* eslint-disable @typescript-eslint/no-explicit-any */
import { firebasePath } from '@monorepo/multichoice/constant';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import HeaderDoExam from '../../components/DoExam/HeaderDoExam/HeaderDoExam';
import { IS_SUBMIT_EXAM } from '../../constants/contstants';
import {
  answerStore,
  examStore,
  userExamStore,
  userStore,
} from '../../store/rootReducer';
import { ITestRealtimeRecord } from '../../types/Commons';
import { fireGet } from '../../utils/firebase_utils';
import DoExamSkelenton from '../../components/DoExam/DoExamSkelenton/DoExamSkelenton';
import { sessionServices } from '../../services/Applications/SessionServices';
import { examServices } from '../../services/Exam/ExamServices';
import { notify } from '../../helper/notify';
import { iNotification } from 'react-notifications-component';
import ShowQuestion from '../../components/DoExam/ShowQuestion/ShowQuestion';
import NavQuestion from '../../components/DoExam/NavQuestion/NavQuestion';
import ExamResult from '../../components/DoExam/ExamResult/ExamResult';
import { DoExamProvider, IDoExamContext } from '../../contexts/DoExamContext';
import { IPayloadEndExam } from '../../services/Exam/type';
import { validObject } from '../../helper/validObject';

const DoExamRealtime: React.FC = () => {
  const { url } = useParams();
  const { user, isAuthenticated } = userStore();
  const { exam, getExam } = examStore();
  const { answers, initAnswers, setPoint } = answerStore();
  const { userID, setUserID, setUserName } = userExamStore();

  const [visibleModalResult, setVisibleModalResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [indexQuestion, setIndexQuestion] = useState<number>(0);
  const [startTimeCountdown, setStartTimeCountdown] = useState<number>(0);
  const [submited, setSubmited] = useState<boolean>(
    !!sessionServices.getData(IS_SUBMIT_EXAM)
  );

  const handleSubmitExam = async () => {
    try {
      const payload: IPayloadEndExam = {
        url: url || '',
        userID: user.id,
        answerUsers: answers,
      };
      const { data } = await examServices.submitExamRealtime(payload);

      if (data.success) {
        setVisibleModalResult(true);
        setPoint(data.data.point);
        setSubmited(true);
        sessionServices.setData(IS_SUBMIT_EXAM, true);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const { message } = error.response.data;
      setSubmited(false);

      notify({
        message: message,
        type: 'danger',
      } as iNotification);
    }
  };

  useEffect(() => {
    const testPath: string = `${firebasePath}-` + url;
    const onValueFirebase = () => {
      fireGet(testPath, async (data: any) => {
        if (data) {
          const recordValue: ITestRealtimeRecord = data;
          setLoading(!recordValue.started);
          if (recordValue.started) {
            console.log(recordValue.startTime);

            setStartTimeCountdown(+recordValue.startTime);
            getExam(url || '');
          }
        }
      });
    };
    onValueFirebase();
  }, []);

  useEffect(() => {
    sessionServices.setData(IS_SUBMIT_EXAM, false);

    if (isAuthenticated) {
      setUserName(user.username);
    }
    if (validObject(exam)) {
      initAnswers(exam.questions);
    }
  }, [exam]);

  const contextValue: IDoExamContext = {
    handleSubmitExam: handleSubmitExam,
  };

  return isAuthenticated ? (
    <DoExamProvider value={contextValue}>
      <HeaderDoExam submited={submited} />
      {loading ? (
        <DoExamSkelenton />
      ) : (
        <div className="container mx-auto pt-5 lg:px-10 flex gap-x-5">
          <div className="w-full lg:w-2/3">
            <ShowQuestion
              questions={exam.questions}
              indexQuestion={indexQuestion}
              setIndexQuestion={setIndexQuestion}
              startTimeCountdown={startTimeCountdown}
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
  ) : (
    <Navigate to={`/login?redirect=${url}`} />
  );
};

export default DoExamRealtime;
