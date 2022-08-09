import React, { useLayoutEffect, useState } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { VscUnlock } from 'react-icons/vsc';
import { SubmitHandler, useForm } from 'react-hook-form';
import { titleServices } from '../../../services/TitleServices';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { localServices } from '../../../services/LocalServices';
import { FORM_LOGIN_LOCAL, USER } from '../../../constants/contstants';
import Checkbox from '../../Commons/Checkbox/Checkbox';
import InputAuthen from '../InputAuthen';
import { validation } from '@monorepo/multichoice/validation';
import SignUpOptions from '../SignUpOptions';
import { cookieServices } from '../../../services/CookieServices';

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
  const [userLocal, setUserLocal] = useState<IFormLogin>();
  const [isRememberUser, setIsRememberUser] = useState<boolean>(false);

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
    const dataUser: string = cookieServices.getCookie('USER');
    setUserLocal(JSON.parse(dataUser));
    console.log('dataUser', dataUser);
  }, []);

  // save form data to Localstorage
  const handleRememberUser = (data: IFormLogin): void => {
    // expried in 30 days
    cookieServices.setCookie(USER, data, 30);
  };

  const onSubmit: SubmitHandler<IFormLogin> = (data) => {
    if (isRememberUser) {
      handleRememberUser(data);
    }
  };

  return (
    <div className="wrapper-form">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form"
        autoComplete="off"
      >
        <div className="form-header mb-10 flex items-center md:flex-col xs:flex-col text-center">
          <h2 className="font-semibold text-black mb-5 text-3xl">Login</h2>
          <p className="text-slate-800">
            Enter yor email address and password <br />
            to get access account
          </p>
        </div>

        <InputAuthen
          defaultValue={userLocal?.email}
          registerField={register('email')}
          isError={Boolean(errors.email)}
          errMessage={errors.email?.message}
          placeholder="Email Address"
          typeInput="email"
          Icon={MdOutlineMail}
        />

        <InputAuthen
          defaultValue={userLocal?.password}
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
            <Checkbox onChange={setIsRememberUser} textLabel="Remember me" />
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
            Sign in Now
          </button>
        </div>

        <SignUpOptions isLoginPage={true} />
      </form>
    </div>
  );
};

export default FormLogin;
