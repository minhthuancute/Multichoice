import React, { useLayoutEffect, useState } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { VscUnlock } from 'react-icons/vsc';
import { SubmitHandler, useForm } from 'react-hook-form';
import { titleServices } from '../../../services/TitleServices';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { localServices } from '../../../services/LocalServices';
import { FORM_LOGIN_LOCAL } from '../../../constants/contstants';
import Checkbox from '../../Commons/Checkbox/Checkbox';
import InputAuthen from '../InputAuthen';
import { validation } from '@monorepo/multichoice/validation';
import './form.scss';
import SignUpOptions from '../SignUpOptions';

interface IFormLogin {
  email: string;
  password: string;
}

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

const FormLogin: React.FC = () => {
  const [dataLocal, setDataLocal] = useState<IFormLogin>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormLogin>({
    resolver: yupResolver(schemaFormLogin),
  });

  useLayoutEffect(() => {
    titleServices.addSub('Login');
    const dataLocal: IFormLogin = localServices.getData(FORM_LOGIN_LOCAL);
    if (dataLocal) {
      setDataLocal(dataLocal);
    }
  }, []);

  const onSubmit: SubmitHandler<IFormLogin> = (data) => {
    console.log(data);
  };

  const onChangeCheckbox = () => {
    console.log('hihi');
  };

  return (
    <div className="wrapper-form">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form"
        autoComplete="off"
      >
        <div className="form-header mb-10 text-center">
          <h2 className="font-semibold text-black mb-5 text-3xl">Login</h2>
          <p className="text-slate-800">
            Enter yor email address and password <br />
            to get access account
          </p>
        </div>

        <InputAuthen
          registerField={register('email')}
          isError={Boolean(errors.email)}
          errMessage={errors.email?.message}
          placeholder="Email Address"
          typeInput="email"
          Icon={MdOutlineMail}
        />

        <InputAuthen
          className="mt-5"
          registerField={register('password')}
          isError={Boolean(errors.password)}
          errMessage={errors.password?.message}
          placeholder="Password"
          typeInput="password"
          Icon={VscUnlock}
        />

        <div className="remember-me flex items-center justify-between mt-5 text-slate-800">
          <div className="check-box cursor-pointer flex items-center">
            <Checkbox onChange={onChangeCheckbox} textLabel="Remember me" />
          </div>
          <Link
            to="/"
            className="text-sm transition-all duration-200 hover:text-primary"
          >
            Forget password?
          </Link>
        </div>

        <div className="submit mt-5">
          <button
            className="w-full py-4 bg-primary rounded-md text-white font-medium"
            type="submit"
          >
            Sign up Now
          </button>
        </div>

        <SignUpOptions isLoginPage={true} />
      </form>
    </div>
  );
};

export default FormLogin;
