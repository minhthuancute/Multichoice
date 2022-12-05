import React, { useEffect } from 'react';
import Input from '../../components/Commons/Input/Input';
import {
  answerStore,
  examStore,
  IAnswers,
  IInforUserDoExam,
  userStore,
} from '../../store/rootReducer';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { examServices } from '../../services/ExamServices';
import { IExamResponse, IQuestion } from '../../types';
import { localServices } from '../../services/LocalServices';
import {
  IS_SUBMIT_EXAM,
  START_EXAM,
  START_TIME,
  TOKEN,
} from '../../constants/contstants';
import { examDetailStore } from '../../store/Exam/examDetailStore';
import { TopicTimeTypeEnum } from '@monorepo/multichoice/constant';
import { sessionServices } from '../../services/SessionServices';

const schemaInfor = yup
  .object()
  .shape({
    user_name: yup.string().min(2, 'User name must be at least 2 characters'),
  })
  .required();

interface IColectInforForm {
  userName: string;
}

const CollectInfor: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { url } = useParams();

  const { exam, getExam } = examStore();
  const { setExamDetailData } = examDetailStore();
  const { userDoExam, setUserDoexamData, setAnswers } = answerStore();
  const { user } = userStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IColectInforForm>({
    resolver: yupResolver(schemaInfor),
  });

  const onSubmit: SubmitHandler<IColectInforForm> = (formData) => {
    setUserDoexamData({
      userName: formData.userName,
    } as IInforUserDoExam);
    const urlNavigate = location.pathname + '/do-exam';
    navigate(urlNavigate);
  };

  useEffect(() => {
    getExam(url || '');
    // if (exam.questions) {
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
    if (user.username) {
      setUserDoexamData({
        userName: user.username,
      } as IInforUserDoExam);
    }
    sessionServices.setData(IS_SUBMIT_EXAM, false);
    sessionServices.setData(START_EXAM, false);
    sessionServices.clearItem(START_TIME);
  }, []);

  return localServices.getData(TOKEN) || userDoExam.userName ? (
    <Navigate to={location.pathname + '/do-exam'} />
  ) : (
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
                registerField={register('userName')}
                placeholder="Họ và tên"
                textLabel="Họ và tên người tham gia"
                isError={Boolean(errors.userName)}
                errMessage={errors.userName?.message}
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
