import React, { useEffect } from 'react';
import { iNotification } from 'react-notifications-component';
import { useParams } from 'react-router-dom';
import { boolean } from 'yup/lib/locale';
import HeaderDoExam from '../../../components/DoExam/HeaderDoExam';
import MainDoExam from '../../../components/DoExam/MainDoExam';
import {
  LAST_EXAM,
  START_EXAM,
  START_TIME,
} from '../../../constants/contstants';
import { notify } from '../../../helper/notify';
import {
  examServices,
  IPayloadStartExam,
} from '../../../services/ExamServices';
import { localServices } from '../../../services/LocalServices';
import { examStore, IInforUserDoExam } from '../../../store/rootReducer';
import { IExamResponse } from '../../../types';

const DoExam: React.FC = () => {
  const { exam_id } = useParams();
  const {
    setExamData,
    exam,
    userDoExam,
    setUserData,
    setIsSubmitExam,
    setIsExpriedExam,
    isSubmitExam,
  } = examStore();

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
        startExam();
      }
    } catch (error) {
      //
    }
  };

  const startExam = async () => {
    const canStartExam: boolean =
      !localServices.getData(START_EXAM) && !isSubmitExam;
    if (canStartExam) {
      setIsExpriedExam(false);
      setIsSubmitExam(false);

      localServices.setData(START_EXAM, true);
      try {
        const payload: IPayloadStartExam = {
          topicID: exam.id,
          username: userDoExam.user_name,
        };
        const { data } = await examServices.startExam(payload);

        if (data.success) {
          localServices.setData(START_TIME, Date.now());
          setUserData({
            user_name: userDoExam.user_name,
            user_id: data.data.userid,
          } as IInforUserDoExam);
        }
      } catch (error) {
        notify({
          message: 'Something went wrong !',
          type: 'danger',
        } as iNotification);
      }
    }
  };

  useEffect(() => {
    getExamInfor();
  }, []);

  return (
    <div>
      <HeaderDoExam />
      <MainDoExam />
    </div>
  );
};

export default DoExam;
