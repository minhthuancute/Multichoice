import React, { useEffect } from 'react';
import Input from '../../../components/Commons/Input/Input';
import {
  answerStore,
  examStore,
  IAnswers,
  IInforUserDoExam,
  userStore,
} from '../../../store/rootReducer';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { notify } from '../../../helper/notify';
import { iNotification } from 'react-notifications-component';
import { useNavigate, useParams } from 'react-router-dom';

import { examServices } from '../../../services/ExamServices';
import { IExamDetail, IExamResponse, IQuestion } from '../../../types';
import { localServices } from '../../../services/LocalServices';
import { START_EXAM, START_TIME } from '../../../constants/contstants';
import { examDetailStore } from '../../../store/Exam/examDetailStore';

const schemaInfor = yup
  .object()
  .shape({
    user_name: yup.string().min(2, 'User name must be at least 2 characters'),
  })
  .required();

interface IColectInforForm {
  user_name: string;
}

const CollectInfor: React.FC = () => {
  const navigate = useNavigate();
  const { exam_id } = useParams();

  const { exam, setExamData } = examStore();
  const { examDetail, setExamDetailData } = examDetailStore();
  const { setUserDoexamData, setAnswers } = answerStore();
  const { user } = userStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IColectInforForm>({
    resolver: yupResolver(schemaInfor),
  });

  const getExamInfor = async () => {
    try {
      const { data } = await examServices.getExamInfor(exam_id || '');
      const examInfor: IExamResponse = data;
      const initAnswers: IAnswers[] = examInfor.questions.map(
        (questions: IQuestion) => {
          const tempArr: IAnswers = {
            questionID: questions.id,
            answerID: [],
          };
          return tempArr;
        }
      );

      const {
        createdAt,
        description,
        expirationTime,
        id,
        isDraft,
        timeType,
        title,
        typeCategoryName,
        updatedAt,
        url,
      } = examInfor;
      const examDetail: IExamDetail = {
        createdAt,
        description,
        expirationTime,
        id,
        isDraft,
        timeType,
        title,
        typeCategoryName,
        updatedAt,
        url,
      };
      setAnswers(initAnswers);
      setExamData(data);
      setExamDetailData(examDetail);
    } catch {
      //
    }
  };

  const onSubmit: SubmitHandler<IColectInforForm> = async (
    formData: IColectInforForm
  ) => {
    try {
      setUserDoexamData({
        user_name: formData.user_name,
      } as IInforUserDoExam);

      const urlNavigate = '/e/' + exam.url + '/do-exam';
      navigate(urlNavigate);
    } catch (error) {
      notify({
        message: 'Something went wrong !',
        type: 'danger',
      } as iNotification);
    }
  };

  useEffect(() => {
    localServices.setData(START_EXAM, false);
    localServices.clearItem(START_TIME);
    getExamInfor();
  }, []);

  useEffect(() => {
    if (Object.keys(user).length) {
      setUserDoexamData({
        user_name: user.username,
      } as IInforUserDoExam);
      const urlNavigate = '/e/' + exam_id + '/do-exam';
      navigate(urlNavigate);
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-doexam py-6">
      <form
        className="max-w-xl lg:max-w-4xl xl:max-w-6xl mx-4 bg-white colect-infor flex items-center
        shadow-xl min-h-[448px] h-[448px] w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="left h-full w-1/2 xs:hidden lg:block bg-exam bg-cover bg-no-repeat bg-center"></div>
        <div className="right w-full lg:w-1/2 h-full relative">
          <div className="top absolute w-full top-1/2 transform -translate-y-1/2 p-4">
            <div className="text-center">
              <h4 className="text-slate-800 text-2xl font-semibold">
                {exam.title}
              </h4>
              <p className="mt-2">{exam.description}</p>
            </div>
            <div className="mt-5 p-4">
              <Input
                registerField={register('user_name')}
                placeholder="Họ và tên"
                textLabel="Họ và tên người tham gia"
                isError={Boolean(errors.user_name)}
                errMessage={errors.user_name?.message}
                isRequired={true}
                inputSize="md"
                defaultValue={user.username ?? ''}
              />
              <button
                type="submit"
                className="mt-5 btn-primary rounded-md flex justify-center items-center w-full h-12 text-sm
              text-white font-bold bg-primary-900 transition-all duration-200 hover:bg-opacity-90"
              >
                Bắt đầu thi
              </button>
            </div>
          </div>

          <footer className="bottom text-center w-full px-10 py-4 mt-auto absolute bottom-0">
            <p className="text-sm ">
              &copy; 2022 Estates. All rights reserved | Designed by{' '}
              <span className="font-semibold text-primary-900">
                Multichoice Team
              </span>
            </p>
          </footer>
        </div>
      </form>
    </div>
  );
};

export default CollectInfor;
