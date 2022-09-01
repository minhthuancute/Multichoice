import React from 'react';
import Input from '../../../components/Commons/Input/Input';
import { examStore } from '../../../store/rootReducer';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  examServices,
  IPayloadStartExam,
} from '../../../services/ExamServices';
import { notify } from '../../../helper/notify';
import { iNotification } from 'react-notifications-component';
import { useNavigate } from 'react-router-dom';
import { sessionServices } from '../../../services/SessionServices';
import { USER_DO_EXAM } from '../../../constants/contstants';
import imgExam from '../../../assets/images/bg-exam.png';

const schemaInfor = yup
  .object()
  .shape({
    user_name: yup.string().min(2, 'User name must be at least 2 characters'),
  })
  .required();

interface IColectInfor {
  user_name: string;
}

const CollectInfor: React.FC = () => {
  const navigate = useNavigate();
  const { exam } = examStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IColectInfor>({
    resolver: yupResolver(schemaInfor),
  });

  const onSubmit: SubmitHandler<IColectInfor> = async (
    formData: IColectInfor
  ) => {
    try {
      const payload: IPayloadStartExam = {
        topicID: exam.id,
        username: formData.user_name,
      };
      const { data } = await examServices.startExam(payload);
      console.log(data);

      if (data.success) {
        sessionServices.setData(USER_DO_EXAM, formData.user_name);
        const urlNavigate = '/exam/' + exam.url + '/do-exam';
        navigate(urlNavigate);
      }
    } catch (error) {
      notify({
        message: 'Something went wrong !',
        type: 'danger',
      } as iNotification);
    }
  };

  return (
    <div className="container h-screen flex items-center">
      <form
        className="form colect-infor max-h-[450px] h-full w-full flex items-center
        shadow-xl"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="left h-full w-[500px]">
          <img
            // src={require('../../../assets/images/bg-exam.png')}
            src="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
            alt="exam multichoice"
            className="block h-full w-full object-cover"
          />
        </div>
        <div className="right flex-1 h-full relative">
          <div className="top absolute w-full top-8 transform">
            <div className="text-center">
              <h4 className="text-slate-800 text-3xl">{exam.title}</h4>
              <p className="mt-2">{exam.description}</p>
            </div>
            <div className="pt-8 px-10">
              <Input
                registerField={register('user_name')}
                placeholder="Họ và tên"
                textLabel="Họ và tên người tham gia"
                isError={Boolean(errors.user_name)}
                errMessage={errors.user_name?.message}
                isRequired={true}
                inputSize="md"
              />
              <button
                type="submit"
                className="mt-10 btn-primary rounded-md flex justify-center items-center w-full h-12 text-sm
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
