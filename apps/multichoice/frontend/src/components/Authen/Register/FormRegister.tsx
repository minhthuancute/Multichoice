import React, { useLayoutEffect, useState } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { VscUnlock } from 'react-icons/vsc';

import { SubmitHandler, useForm } from 'react-hook-form';
import { titleServices } from '../../../services/TitleServices';
import { classNames } from '../../../helper/classNames';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { localServices } from '../../../services/LocalServices';
import { FORM_LOGIN_LOCAL } from '../../../constants/contstants';
import Checkbox from '../../Commons/Checkbox/Checkbox';

import './form.scss';
import SignUpOptions from '../SignUpOptions';
import InputAuthen from '../InputAuthen';

interface IFormLogin {
  email: string;
  password: string;
}

const schemaFormLogin = yup
  .object()
  .shape({
    email: yup.string().max(100).required('Email is required').email(),
    password: yup.string().min(8).max(36).lowercase().uppercase(),
  })
  .required();

const FormRegister: React.FC = () => {
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
          <h2 className="font-semibold text-black mb-5 text-3xl">
            Sign up Now
          </h2>
          <p className="text-slate-800">
            Inter yor valid email address and password <br />
            to register your account
          </p>
        </div>

        <SignUpOptions isLoginPage={false} />

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
            <Checkbox
              onChange={onChangeCheckbox}
              textLabel="<p>
              I accept the <span style='color: #1e85ff'>Term of Conditions</span>
              and <span style='color: #1e85ff'>Privacy Policy</span>
            </p>"
            />
          </div>
        </div>

        <div className="submit mt-5">
          <button
            className="w-full py-4 bg-primary rounded-md text-white font-medium"
            type="submit"
          >
            Sign in Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormRegister;
