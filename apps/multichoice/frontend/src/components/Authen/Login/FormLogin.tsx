import React, { useLayoutEffect, useState } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { VscUnlock } from 'react-icons/vsc';
import { SubmitHandler, useForm } from 'react-hook-form';
import { titleServices } from '../../../services/TitleServices';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { TOKEN, USER } from '../../../constants/contstants';
import Checkbox from '../../Commons/Checkbox/Checkbox';
import InputAuthen from '../InputAuthen';
import { validation } from '@monorepo/multichoice/validation';
// import SignUpOptions from '../SignUpOptions';
import { cookieServices } from '../../../services/CookieServices';
import { authenServices } from '../../../services/AuthenServices';
import { LoginUserDto } from '@monorepo/multichoice/dto';
import { AxiosResponse } from 'axios';
import { userStore } from '../../../store/User/userStore';
import { ILoginResponse } from '../../../types/LoginResponse';
import { localServices } from '../../../services/LocalServices';
import { iNotification } from 'react-notifications-component';
import { notify } from '../../../helper/notify';

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
  const navigate = useNavigate();
  const { setInforUser } = userStore();
  const [userLocal, setUserLocal] = useState<LoginUserDto>();
  const [isRememberUser, setIsRememberUser] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginUserDto>({
    resolver: yupResolver(schemaFormLogin),
  });

  useLayoutEffect(() => {
    titleServices.addSub('Login');
    const dataUser: string = cookieServices.getCookie('USER');
    if (dataUser) {
      setUserLocal(JSON.parse(dataUser));
      reset({ ...JSON.parse(dataUser) });
    }
  }, [reset]);

  // save form data to Cookie
  const handleRememberUser = (data: LoginUserDto): void => {
    // expried in 30 days
    cookieServices.setCookie(USER, data, 30);
  };

  const onSubmit: SubmitHandler<LoginUserDto> = async (
    formData: LoginUserDto
  ) => {
    if (isRememberUser) {
      handleRememberUser(formData);
    }
    try {
      const data: AxiosResponse = await authenServices.login(formData);
      const loginResponse: ILoginResponse = data.data;
      if (loginResponse.success) {
        const { payload, token } = loginResponse.data;
        localServices.setData(TOKEN, token);
        setInforUser(payload, token);
        navigate('/');
      }
    } catch (error) {
      notify({
        message: 'Wrong user name or password !',
        type: 'danger',
      } as iNotification);
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
          <h2 className="font-medium text-black mb-5 text-3xl">Login</h2>
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
          id="email"
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
          id="password"
        />

        <div className="remember-me flex items-center justify-between mt-5 text-slate-800">
          <div className="check-box cursor-pointer flex items-center">
            <Checkbox
              onChange={setIsRememberUser}
              textLabel="Remember me"
              id="remember-me"
            />
          </div>
          <Link
            to="/"
            className="hidden text-sm transition-all duration-200 hover:text-primary-900"
          >
            Forget password?
          </Link>
        </div>

        <div className="submit mt-5">
          <button
            className="w-full py-3 bg-primary-900 rounded-md text-white font-medium"
            type="submit"
          >
            Sign in Now
          </button>
        </div>

        {/* <SignUpOptions isLoginPage={true} /> */}
      </form>
    </div>
  );
};

export default FormLogin;
