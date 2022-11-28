import { firebasePath } from '@monorepo/multichoice/constant';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import HeaderDoExam from '../../components/DoExam/HeaderDoExam/HeaderDoExam';
import MainDoExam from '../../components/DoExam/MainDoExam/MainDoExam';
import { TOKEN } from '../../constants/contstants';
import { examServices } from '../../services/ExamServices';
import { localServices } from '../../services/LocalServices';
import {
  answerStore,
  examStore,
  IAnswers,
  IInforUserDoExam,
  userStore,
} from '../../store/rootReducer';
import { IQuestion } from '../../types';
import { ITestRealtimeRecord } from '../../types/ICommons';
import { fireGet } from '../../utils/firebase_utils';
import DoExamSkelenton from '../../components/DoExamSkelenton/DoExamSkelenton';

const DoExamRealtime: React.FC = () => {
  const { exam_id } = useParams();
  const { exam, setExamData, setIsSubmitExam } = examStore();
  const { userDoExam, setUserDoexamData, setAnswers, answers } = answerStore();
  const { user } = userStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getExamDetail = async () => {
    try {
      setIsLoading(true);
      const { data } = await examServices.getExamInfor(exam_id || '');

      if (answers.length === 0) {
        const initAnswers: IAnswers[] = data.data.questions.map(
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

      setExamData(data.data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUserDoexamData({
      userName: userDoExam.userName,
      userId: user.id,
    } as IInforUserDoExam);
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
          getExamDetail();
        }
      });
    };
    onValueFirebase();
  }, []);

  return localServices.getData(TOKEN) ? (
    <div className="h-max relative">
      <HeaderDoExam />
      {isLoading ? <DoExamSkelenton /> : <MainDoExam />}
    </div>
  ) : (
    <Navigate to={`/login?redirect=${exam_id}`} />
  );
};

export default DoExamRealtime;
