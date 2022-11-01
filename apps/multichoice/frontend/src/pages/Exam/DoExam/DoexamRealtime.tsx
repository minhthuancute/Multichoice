import { firebasePath } from '@monorepo/multichoice/constant';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import {
  answerStore,
  examStore,
  IInforUserDoExam,
} from '../../../store/rootReducer';
import { ITestRealtimeRecord } from '../../../types/ICommons';
import { fireGet } from '../../../utils/firebase_utils';
import DoExamSkelenton from './DoExamSkelenton';

const DoExamRealtime: React.FC = () => {
  const navigate = useNavigate();
  const { exam_id } = useParams();
  const { exam, setExamData, setIsSubmitExam, setIsExpriedExam } = examStore();
  const { userDoExam, setUserDoexamData } = answerStore();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const startExam = async (id: number) => {
    const canStartExam: boolean =
      localServices.getData(START_EXAM) === false && !isLoading;

    if (canStartExam) {
      localServices.setData(IS_SUBMIT_EXAM, false);

      setIsExpriedExam(false);
      setIsSubmitExam(false);

      localServices.setData(START_EXAM, true);
      try {
        const payload: IPayloadStartExam = {
          topicID: id,
          username: userDoExam.user_name,
        };
        const { data } = await examServices.startExam(payload);
        if (data.success) {
          setUserDoexamData({
            user_name: userDoExam.user_name,
            user_id: data.data.userid,
          } as IInforUserDoExam);
        }
      } catch {
        //
      }
    }
  };

  useLayoutEffect(() => {
    if (!localServices.getData(START_TIME)) {
      localServices.setData(START_TIME, Date.now());
    }
  }, []);

  useEffect(() => {
    const shouldNavPageLogin = !localServices.getData(TOKEN);

    if (shouldNavPageLogin) {
      navigate(`/login?redirect=${exam_id}`);
      return;
    }
    return () => {
      localServices.setData(START_EXAM, false);
      localServices.clearItem(START_TIME);
      setIsSubmitExam(false);
    };
  }, [exam.timeType]);

  useEffect(() => {
    const testPath: string = `${firebasePath}-` + exam_id;

    const onValueFirebase = () => {
      fireGet(testPath, async (data: any) => {
        const recordValue: ITestRealtimeRecord = data;
        setIsLoading(!recordValue.started);
        if (recordValue?.started && !exam.questions) {
          try {
            const { data, status } = await examServices.getExamInfor(
              exam_id || ''
            );
            if (status === 200) {
              setExamData(data);
              startExam(data.id);
            }
          } catch {
            //
          }
        }
      });
    };
    onValueFirebase();
  }, []);

  return (
    <div className="h-max relative">
      <HeaderDoExam />
      {isLoading ? <DoExamSkelenton /> : <MainDoExam />}
    </div>
  );
};

export default DoExamRealtime;
