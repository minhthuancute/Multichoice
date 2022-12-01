/* eslint-disable @typescript-eslint/no-explicit-any */
import { firebasePath } from '@monorepo/multichoice/constant';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import HeaderDoExam from '../../components/DoExam/HeaderDoExam/HeaderDoExam';
import MainDoExam from '../../components/DoExam/MainDoExam/MainDoExam';
import { IS_SUBMIT_EXAM, TOKEN } from '../../constants/contstants';
import { localServices } from '../../services/LocalServices';
import {
  answerStore,
  examStore,
  IAnswers,
  IInforUserDoExam,
  userStore,
} from '../../store/rootReducer';
import { ITestRealtimeRecord } from '../../types/ICommons';
import { fireGet } from '../../utils/firebase_utils';
import DoExamSkelenton from '../../components/DoExam/DoExamSkelenton/DoExamSkelenton';
import { IQuestion } from '../../types';
import { sessionServices } from '../../services/SessionServices';
import {
  examServices,
  IPayloadEndExam,
  IPayloadEndExamRealtime,
} from '../../services/ExamServices';
import { notify } from '../../helper/notify';
import { iNotification } from 'react-notifications-component';
import ShowQuestion from '../../components/DoExam/ShowQuestion/ShowQuestion';
import NavQuestion from '../../components/DoExam/NavQuestion/NavQuestion';
import { validObject } from '../../helper/validObject';

const DoExamRealtime: React.FC = () => {
  const { url } = useParams();
  const { exam, getExam, setIsSubmitExam } = examStore();
  const { userDoExam, setUserDoexamData, setAnswers, answers } = answerStore();
  const { user } = userStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [indexQuestion, setIndexQuestion] = useState<number>(0);
  const [expriedCountdownRealtime, setExpriedCountdownRealtime] =
    useState<boolean>(false);
  const [startTimeCountdown, setStartTimeCountdown] = useState<number>(0);

  // useEffect(() => {
  //   setUserDoexamData({
  //     userName: userDoExam.userName,
  //     userId: user.id,
  //   } as IInforUserDoExam);
  //   return () => {
  //     setIsSubmitExam(false);
  //   };
  // }, [exam.timeType]);

  const handleSubmitExam = async () => {
    sessionServices.setData(IS_SUBMIT_EXAM, true);
    try {
      const payloadRealtime: IPayloadEndExamRealtime = {
        url: url || '',
        userID: userDoExam.userId,
        answerUsers: answers,
      };

      const { data } = await examServices.submitExamRealtime(payloadRealtime);

      if (data.success) {
        // setExamResult({
        //   userName: data.data.username,
        //   point: data.data.point,
        // } as IExamResult);
        // setDataExamResult({
        //   userName: data.data.username,
        //   point: data.data.point,
        // });
        // setOpenModalResult(true);
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
    const testPath: string = `${firebasePath}-` + url;

    const onValueFirebase = () => {
      fireGet(testPath, async (data: any) => {
        const recordValue: ITestRealtimeRecord = data;
        setIsLoading(!recordValue?.started);
        setStartTimeCountdown(+recordValue.startTime);
        if (recordValue?.started) {
          getExam(url || '');
        }
      });
    };
    onValueFirebase();
  }, []);

  useEffect(() => {
    if (validObject(exam)) {
      const initAnswers: IAnswers[] = exam.questions.map(
        (questions: IQuestion) => {
          const tempArr: IAnswers = {
            questionID: questions.id,
            answerID: [],
          };
          return tempArr;
        }
      );
      setAnswers(initAnswers);
    }
  }, [exam]);

  return localServices.getData(TOKEN) ? (
    <>
      <HeaderDoExam />
      {isLoading ? (
        <DoExamSkelenton />
      ) : (
        <div className="container mx-auto pt-5 lg:px-10 flex gap-x-8">
          <div className="w-full lg:w-2/3 h-full">
            <ShowQuestion
              questions={exam.questions}
              indexQuestion={indexQuestion}
              setIndexQuestion={setIndexQuestion}
              startTimeCountdown={startTimeCountdown}
              expriedCountdownRealtime={expriedCountdownRealtime}
              handleSubmitExam={handleSubmitExam}
            />
          </div>
          <div className="w-1/3 xs:hidden lg:block h-full">
            <NavQuestion
              indexQuestion={indexQuestion}
              setIndexQuestion={setIndexQuestion}
              expriedCountdownRealtime={expriedCountdownRealtime}
              startTimeCountdown={startTimeCountdown}
            />
          </div>
        </div>
      )}
    </>
  ) : (
    <Navigate to={`/login?redirect=${url}`} />
  );
};

export default DoExamRealtime;
