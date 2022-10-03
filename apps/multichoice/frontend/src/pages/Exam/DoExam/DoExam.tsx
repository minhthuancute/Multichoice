import React, { useEffect, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderDoExam from '../../../components/DoExam/HeaderDoExam';
import MainDoExam from '../../../components/DoExam/MainDoExam';
import {
  LAST_EXAM,
  START_EXAM,
  START_TIME,
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

const DoExam: React.FC = () => {
  const navigate = useNavigate();
  const { exam_id } = useParams();
  const { setExamData, exam, setIsSubmitExam, setIsExpriedExam } = examStore();
  const { answers, userDoExam, setUserDoexamData } = answerStore();

  const getExamInfor = async () => {
    try {
      const { data, status } = await examServices.getExamInfor(exam_id || '');
      if (status === 200) {
        const isEmptyLastExam: boolean =
          localServices.getData(LAST_EXAM) === '';
        if (isEmptyLastExam) {
          localServices.setData(LAST_EXAM, data);
        }
        setExamData(data);
        startExam(data.id);
      }
    } catch {
      //
    }
  };

  const startExam = async (id: number) => {
    const canStartExam: boolean = localServices.getData(START_EXAM) === false;

    if (canStartExam) {
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
    (async () => {
      await getExamInfor();
    })();

    return () => {
      localServices.setData(START_EXAM, false);
      localServices.clearItem(START_TIME);
      setIsSubmitExam(false);
    };
  }, []);

  useEffect(() => {
    const emptyusername = userDoExam.user_name;
    if (!emptyusername) {
      navigate('/e/' + exam_id);
    }
  }, []);

  return (
    <div className="h-max relative">
      <HeaderDoExam />
      <MainDoExam />
    </div>
  );
};

export default DoExam;
