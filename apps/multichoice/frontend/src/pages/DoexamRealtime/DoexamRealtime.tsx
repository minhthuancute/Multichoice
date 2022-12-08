/* eslint-disable @typescript-eslint/no-explicit-any */
import { firebasePath } from '@monorepo/multichoice/constant';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import HeaderDoExam from '../../components/DoExam/HeaderDoExam/HeaderDoExam';
import { IS_SUBMIT_EXAM } from '../../constants/contstants';
import { answerStore, examStore, IAnswers } from '../../store/rootReducer';
import { ITestRealtimeRecord } from '../../types/ICommons';
import { fireGet } from '../../utils/firebase_utils';
import DoExamSkelenton from '../../components/DoExam/DoExamSkelenton/DoExamSkelenton';
import { IQuestion } from '../../types';
import { sessionServices } from '../../services/Applications/SessionServices';
import { examServices } from '../../services/Exam/ExamServices';
import { notify } from '../../helper/notify';
import { iNotification } from 'react-notifications-component';
import ShowQuestion from '../../components/DoExam/ShowQuestion/ShowQuestion';
import NavQuestion from '../../components/DoExam/NavQuestion/NavQuestion';
import { validObject } from '../../helper/validObject';
import { isLogin } from '../../utils/check_logged';
import ExamResult, {
  IExamResult,
} from '../../components/DoExam/ExamResult/ExamResult';
import { DoExamProvider, IDoExamContext } from '../../contexts/DoExamContext';
import { IPayloadEndExamRealtime } from '../../services/Exam/type';

const DoExamRealtime: React.FC = () => {
  const { url } = useParams();
  const { exam, getExam } = examStore();
  const { userDoExam, setAnswers, answers } = answerStore();

  const [result, setResult] = useState<IExamResult>();
  const [visibleModalResult, setVisibleModalResult] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [indexQuestion, setIndexQuestion] = useState<number>(0);
  const [expriedRealtime, setExpriedRealtime] = useState<boolean>(false);
  const [startTimeCountdown, setStartTimeCountdown] = useState<number>(0);
  const [submited, setSubmited] = useState<boolean>(false);

  const handleSubmitExam = async () => {
    setSubmited(true);
    sessionServices.setData(IS_SUBMIT_EXAM, true);
    try {
      const payloadRealtime: IPayloadEndExamRealtime = {
        url: url || '',
        userID: userDoExam.userId,
        answerUsers: answers,
      };
      const { data, success } = await examServices.submitExamRealtime(
        payloadRealtime
      );

      if (success) {
        setVisibleModalResult(true);
        setResult({
          userName: data.username,
          point: data.point,
        });
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
        if (data) {
          const recordValue: ITestRealtimeRecord = data;
          setLoading(!recordValue.started);
          setStartTimeCountdown(+recordValue.startTime);
          if (recordValue.started) {
            getExam(url || '');
          }
        }
      });
    };
    onValueFirebase();
  }, []);

  useEffect(() => {
    // if (validObject(exam)) {
    //   const initAnswers: IAnswers[] = exam.questions.map(
    //     (questions: IQuestion) => {
    //       const tempArr: IAnswers = {
    //         questionID: questions.id,
    //         answerID: [],
    //       };
    //       return tempArr;
    //     }
    //   );
    //   setAnswers(initAnswers);
    // }
  }, [exam]);

  const contextValue: IDoExamContext = {
    handleSubmitExam: handleSubmitExam,
  };

  return isLogin() ? (
    <DoExamProvider value={contextValue}>
      <HeaderDoExam submited={submited} />
      {loading ? (
        <DoExamSkelenton />
      ) : (
        <div className="container mx-auto pt-5 lg:px-10 flex gap-x-8">
          <div className="w-full lg:w-2/3 h-full">
            <ShowQuestion
              questions={exam.questions}
              indexQuestion={indexQuestion}
              setIndexQuestion={setIndexQuestion}
              startTimeCountdown={startTimeCountdown}
              expriedRealtime={expriedRealtime}
            />
          </div>
          <div className="w-1/3 xs:hidden lg:block h-full">
            <NavQuestion
              indexQuestion={indexQuestion}
              setIndexQuestion={setIndexQuestion}
              expriedRealtime={expriedRealtime}
              startTimeCountdown={startTimeCountdown}
            />
          </div>
        </div>
      )}

      <ExamResult
        setVisibleModal={setVisibleModalResult}
        visibleModal={visibleModalResult}
        point={result?.point}
      />
    </DoExamProvider>
  ) : (
    <Navigate to={`/login?redirect=${url}`} />
  );
};

export default DoExamRealtime;
