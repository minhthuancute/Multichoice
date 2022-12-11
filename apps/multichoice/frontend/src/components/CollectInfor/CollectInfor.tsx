import React, { useContext, useState } from 'react';
import Modal from '../Commons/Modal/Modal';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../Commons/Input/Input';
import Button from '../Commons/Button/Button';
import { IPayloadStartExam } from '../../services/Exam/type';
import { doExamContext } from '../../contexts/DoExamContext';
import { userExamStore } from '../../store/rootReducer';
import { sessionServices } from '../../services/Applications/SessionServices';
import { START_TIME } from '../../constants/contstants';

interface ICollectInforForm {
  username: string;
}

const collectInforSchema = yup.object().shape({
  username: yup
    .string()
    .required('Please fill out this field')
    .min(2, 'User name must be at least 2 characters'),
});

interface ICollectInforProps {
  topicID: number;
  setVisibleModalInfor: React.Dispatch<React.SetStateAction<boolean>>;
}

const CollectInfor: React.FC<ICollectInforProps> = ({
  topicID,
  setVisibleModalInfor,
}) => {
  const { setUserName } = userExamStore();

  const { startExam } = useContext(doExamContext);
  const [visibleModal, setVisibleModal] = useState<boolean>(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICollectInforForm>({
    resolver: yupResolver(collectInforSchema),
  });

  const onSubmit: SubmitHandler<ICollectInforForm> = async ({ username }) => {
    const payload: IPayloadStartExam = {
      topicID,
      username,
    };
    startExam && startExam(payload);
    setUserName(username);
    setVisibleModalInfor(false);
    sessionServices.setData(START_TIME, Date.now());
  };

  return (
    <Modal
      headerTitle="Đăng nhập"
      visible={visibleModal}
      setVisibleModal={setVisibleModal}
      placement="CENTER"
      hideOnClickOutside={false}
    >
      <>
        <div className="header text-center">
          <h4 className="text-slate-800 text-xl">
            Nhập tên của bạn để bắt đầu bài thi
          </h4>
          <p className="text-slate-800 text-xs mt-1">
            Bạn không thể nộp bài nếu không nhập tên của mình!
          </p>
        </div>
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <Input
              registerField={register('username')}
              placeholder="Tên của bạn"
              isError={Boolean(errors.username)}
              errMessage={errors.username?.message}
            />
          </div>
          <div className="text-end mt-4">
            <Button type="submit" color="success">
              Bắt đầu
            </Button>
          </div>
        </form>
      </>
    </Modal>
  );
};

export default CollectInfor;
