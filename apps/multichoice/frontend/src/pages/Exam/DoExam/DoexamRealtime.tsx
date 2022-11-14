import { firebasePath } from '@monorepo/multichoice/constant';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import HeaderDoExam from '../../../components/DoExam/HeaderDoExam';
import MainDoExam from '../../../components/DoExam/MainDoExam';
import { TOKEN } from '../../../constants/contstants';
import {
  examServices,
  IPayloadStartExam,
} from '../../../services/ExamServices';
import { localServices } from '../../../services/LocalServices';
import {
  answerStore,
  examStore,
  IAnswers,
  IInforUserDoExam,
} from '../../../store/rootReducer';
import { IQuestion } from '../../../types';
import { ITestRealtimeRecord } from '../../../types/ICommons';
import { fireGet } from '../../../utils/firebase_utils';
import DoExamSkelenton from './DoExamSkelenton';

const DoExamRealtime: React.FC = () => {
  const navigate = useNavigate();
  const { exam_id } = useParams();
  const { exam, setExamData, setIsSubmitExam } = examStore();
  const { userDoExam, setUserDoexamData, setAnswers } = answerStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRealtime, setIsRealtime] = useState<boolean>(false);

  const startExam = async (topicId: number) => {
    try {
      const payload: IPayloadStartExam = {
        topicID: topicId,
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
  };

  useEffect(() => {
    const shouldNavPageLogin = !localServices.getData(TOKEN);

    if (shouldNavPageLogin) {
      navigate(`/login?redirect=${exam_id}`);
      return;
    }
    return () => {
      setIsSubmitExam(false);
    };
  }, [exam.timeType]);

  useEffect(() => {
    const testPath: string = `${firebasePath}-` + exam_id;

    const onValueFirebase = () => {
      fireGet(testPath, async (data: any) => {
        const recordValue: ITestRealtimeRecord = data;
        setIsLoading(!recordValue?.started);
        if (recordValue?.started && !exam.questions) {
          setIsRealtime(true);
          try {
            setIsLoading(true);
            const { data, status } = await examServices.getExamInfor(
              exam_id || ''
            );
            if (status === 200) {
              const initAnswers: IAnswers[] = data.questions.map(
                (questions: IQuestion) => {
                  const tempArr: IAnswers = {
                    questionID: questions.id,
                    answerID: [],
                  };
                  return tempArr;
                }
              );
              setAnswers(initAnswers);

              // const shouldExpriedTest =
              //   new Date().getTime() >
              //   +recordValue.startTime + +data.expirationTime;
              setExamData(data);
              startExam(data.id);
              setIsLoading(false);
            }
          } catch {
            navigate('/');
            setIsLoading(false);
          }
        }
      });
    };
    onValueFirebase();
  }, []);

  return localServices.getData(TOKEN) ? (
    <div className="h-max relative">
      <HeaderDoExam />
      {isLoading ? <DoExamSkelenton /> : <MainDoExam isRealtime={isRealtime} />}
    </div>
  ) : (
    <Navigate to={`/login?redirect=${exam_id}`} />
  );
};

export default DoExamRealtime;
