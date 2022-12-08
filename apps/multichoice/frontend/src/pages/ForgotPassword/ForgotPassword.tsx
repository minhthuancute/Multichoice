import React, { useLayoutEffect } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { validation } from '@monorepo/multichoice/validation';
import { LoginUserDto } from '@monorepo/multichoice/dto';
import { useQuery } from '../../hooks/useQuery';
import { userStore } from '../../store/rootReducer';
import { titleServices } from '../../services/Title/TitleServices';

import InputAuthen from '../../components/Commons/InputAuthen/InputAuthen';
import AuthenLayout from '../../layouts/AuthenLayout';
import Button from '../../components/Commons/Button/Button';

const { email, password } = validation();
const schemaFormLogin = yup
  .object()
  .shape({
    email: yup
      .string()
      .max(email.maxLength)
      .required('Email is required')
      .email(),
    password: yup.string().min(password.minLength).max(password.maxLength),
  })
  .required();

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDto>({
    resolver: yupResolver(schemaFormLogin),
  });

  useLayoutEffect(() => {
    titleServices.addSub('Login');
  }, []);

  const onSubmit: SubmitHandler<LoginUserDto> = async (formData) => {
    //
  };

  return (
    <AuthenLayout>
      <div className="wrapper-form">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form"
          autoComplete="off"
        >
          <div className="form-header mb-10 flex items-center md:flex-col xs:flex-col text-center">
            <h2 className="font-medium text-black mb-4 text-3xl">
              Forgot Password
            </h2>
            <p className="text-slate-800 text-sm">
              Enter your email address below and we'll send you a link to reset
              your password.
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
          <div className="submit mt-5">
            <Button
              className="w-full py-3 bg-primary-900 rounded-md text-white font-medium"
              type="submit"
            >
              Reset Password
            </Button>
          </div>

          {/* <SignUpOptions isLoginPage={true} /> */}
        </form>
      </div>
    </AuthenLayout>
  );
};

export default ForgotPassword;
