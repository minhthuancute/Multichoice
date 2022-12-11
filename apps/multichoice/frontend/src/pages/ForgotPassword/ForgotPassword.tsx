import React, { useLayoutEffect, useState } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { validation } from '@monorepo/multichoice/validation';
import { ForgotPasswordDto } from '@monorepo/multichoice/dto';
import { titleServices } from '../../services/Title/TitleServices';
import InputAuthen from '../../components/Commons/InputAuthen/InputAuthen';
import Button from '../../components/Commons/Button/Button';
import { Link } from 'react-router-dom';
import { authenServices } from '../../services/Authen/AuthenServices';
import { classNames } from '../../helper/classNames';

const { email } = validation();
const schemaForgotPassword = yup
  .object()
  .shape({
    email: yup
      .string()
      .max(email.maxLength)
      .required('Email is required')
      .email(),
  })
  .required();

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordDto>({
    resolver: yupResolver(schemaForgotPassword),
  });
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  const [resetMsg, setResetMsg] = useState<string>('');

  const onSubmit: SubmitHandler<ForgotPasswordDto> = async ({ email }) => {
    try {
      const payload: ForgotPasswordDto = {
        email,
      };
      const { data } = await authenServices.forgotPassword(payload);
      if (data.status === 201) {
        setResetMsg('Please check your email');
        setResetSuccess(true);
      }
    } catch {
      setResetMsg('Your email is not found');
      setResetSuccess(false);
    }
  };

  useLayoutEffect(() => {
    titleServices.addSub('Forgot password');
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form" autoComplete="off">
      <div className="form-header mb-10 flex items-center md:flex-col xs:flex-col text-center">
        <h2 className="font-medium text-slate-800 mb-4 text-2xl">
          Forgot Password
        </h2>
        <p className="text-slate-800 text-sm">
          Enter your email address below and we'll send you a link to reset your
          password.
        </p>
      </div>

      <InputAuthen
        registerField={register('email')}
        isError={Boolean(errors.email)}
        errMessage={errors.email?.message}
        placeholder="Email Address"
        type="email"
        Icon={MdOutlineMail}
        id="email"
      />
      <div className="remember-me text-right mt-2 text-slate-800">
        <Link
          to="/login"
          className="text-sm transition-all duration-200 hover:text-primary-900"
        >
          Login now
        </Link>
      </div>

      {resetMsg && (
        <p
          className={classNames('text-sm', {
            'text-green-600': resetSuccess,
            'text-red-500': !resetSuccess,
          })}
        >
          {resetMsg}
        </p>
      )}

      <div className="submit mt-5">
        <Button type="submit" widthFull color="success">
          Send
        </Button>
      </div>
    </form>
  );
};

export default ForgotPassword;
