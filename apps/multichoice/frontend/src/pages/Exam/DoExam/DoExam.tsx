import React, { useEffect } from 'react';
import { iNotification } from 'react-notifications-component';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderDoExam from '../../../components/DoExam/HeaderDoExam';
import MainDoExam from '../../../components/DoExam/MainDoExam';
import { START_EXAM, START_TIME } from '../../../constants/contstants';
import { notify } from '../../../helper/notify';
import { cookieServices } from '../../../services/CookieServices';
import {
  examServices,
  IPayloadStartExam,
} from '../../../services/ExamServices';
import { localServices } from '../../../services/LocalServices';
import { examStore, IInforUserDoExam } from '../../../store/rootReducer';

const DoExam: React.FC = () => {
  const navigate = useNavigate();

  const { exam_id } = useParams();
  const { setExamData, exam, userDoExam, setUserData } = examStore();

  const getExamInfor = async () => {
    try {
      const { data } = await examServices.getExamInfor(exam_id || '');
      setExamData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const startExam = async () => {
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
  };

  useEffect(() => {
    startExam();
  }, []);

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
