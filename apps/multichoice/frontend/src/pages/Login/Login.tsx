import React, { useLayoutEffect, useState } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { VscUnlock } from 'react-icons/vsc';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { validation } from '@monorepo/multichoice/validation';
import { LoginUserDto } from '@monorepo/multichoice/dto';
import { AxiosResponse } from 'axios';
import { iNotification } from 'react-notifications-component';
import { useQuery } from '../../hooks/useQuery';
import { userStore } from '../../store/rootReducer';
import { titleServices } from '../../services/TitleServices';
import { authenServices } from '../../services/AuthenServices';
import { ILoginResponse } from '../../types';
import { localServices } from '../../services/LocalServices';
import { TOKEN } from '../../constants/contstants';
import { notify } from '../../helper/notify';
import { loginError } from '../../constants/msgNotify';
import InputAuthen from '../../components/Authen/InputAuthen';
import AuthenLayout from '../../layouts/AuthenLayout';

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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const { setInforUser } = userStore();

  const [logginError, setLogginError] = useState<string>(
    'Wrong user name or password'
  );

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

  const onSubmit: SubmitHandler<LoginUserDto> = async (
    formData: LoginUserDto
  ) => {
    try {
      const data: AxiosResponse = await authenServices.login(formData);
      const loginResponse: ILoginResponse = data.data;
      if (loginResponse.success) {
        const { payload, token } = loginResponse.data;
        localServices.setData(TOKEN, token);
        setInforUser(payload, token);

        const redirectUrl = query.get('redirect');
        if (redirectUrl) {
          navigate(`/e/${redirectUrl}/do-exam-realtime`);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      notify({
        message: loginError,
        type: 'danger',
      } as iNotification);
    }
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
            <h2 className="font-medium text-black mb-4 text-3xl">Login</h2>
            <p className="text-slate-800 text-sm">
              Enter yor email address and password to get access account
            </p>
          </div>

          <InputAuthen
            registerField={register('email')}
            isError={Boolean(errors.email)}
            errMessage={errors.email?.message}
            placeholder="Email Address"
            typeInput="email"
            Icon={MdOutlineMail}
            id="email"
          />

          <InputAuthen
            className="mt-5"
            registerField={register('password')}
            isError={Boolean(errors.password)}
            errMessage={errors.password?.message}
            placeholder="Password"
            typeInput="password"
            Icon={VscUnlock}
            id="password"
          />

          <div className="remember-me flex justify-end mt-5 text-slate-800">
            <Link
              to="/forgot-password"
              className="text-sm transition-all duration-200 hover:text-primary-900"
            >
              Forgot password?
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
    </AuthenLayout>
  );
};

export default Login;
