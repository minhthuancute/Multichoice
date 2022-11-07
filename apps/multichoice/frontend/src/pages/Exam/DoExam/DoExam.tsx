import React, { useEffect, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderDoExam from '../../../components/DoExam/HeaderDoExam';
import MainDoExam from '../../../components/DoExam/MainDoExam';
import {
  IS_SUBMIT_EXAM,
  START_EXAM,
  START_TIME,
} from '../../../constants/contstants';
import {
  examServices,
  IPayloadStartExam,
} from '../../../services/ExamServices';
import { localServices } from '../../../services/LocalServices';
import { examDetailStore } from '../../../store/Exam/examDetailStore';
import {
  answerStore,
  examStore,
  IInforUserDoExam,
} from '../../../store/rootReducer';

const DoExam: React.FC = () => {
  const navigate = useNavigate();
  const { exam_id } = useParams();
  const { setExamData } = examStore();
  const { setExamDetailData } = examDetailStore();
  const { userDoExam, setUserDoexamData } = answerStore();

  const getExamInfor = async () => {
    try {
      const { data, status } = await examServices.getExamInfor(exam_id || '');
      if (status === 200) {
        setExamData(data);
        startExam(data.id);
        setExamDetailData(data);
      }
    } catch {
      navigate('/');
    }
  };

  const startExam = async (id: number) => {
    const canStartExam: boolean = localServices.getData(START_EXAM) === false;

    if (canStartExam) {
      localServices.setData(IS_SUBMIT_EXAM, false);
      localServices.setData(START_EXAM, true);
      try {
        const payload: IPayloadStartExam = {
          topicID: id,
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
    // window.addEventListener('beforeunload', function (e) {
    //   const confirmationMessage =
    //     'It looks like you have been editing something. ' +
    //     'If you leave before saving, your changes will be lost.';

    //   (e || window.event).returnValue = confirmationMessage;
    //   return confirmationMessage;
    // });
    getExamInfor();

    return () => {
      localServices.setData(START_EXAM, false);
      localServices.clearItem(START_TIME);
    };
  }, []);

  return (
    <div className="h-max relative">
      <HeaderDoExam />
      <MainDoExam />
    </div>
  );
};

export default DoExam;
