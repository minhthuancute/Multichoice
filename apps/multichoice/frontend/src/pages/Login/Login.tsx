import React, { useLayoutEffect } from 'react';
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
import { titleServices } from '../../services/Title/TitleServices';
import { authenServices } from '../../services/Authen/AuthenServices';
import { localServices } from '../../services/Applications/LocalServices';
import { TOKEN } from '../../constants/contstants';
import { notify } from '../../helper/notify';
import { loginError } from '../../constants/msgNotify';
import InputAuthen from '../../components/Commons/InputAuthen/InputAuthen';
import { RedirectQuery } from '../../types/Commons';
import Button from '../../components/Commons/Button/Button';
import SignUpOptions from '../../components/Authen/SignUpOptions/SignUpOptions';

export interface AuthPayload {
  id: number;
  username: string;
  email: string;
}

export interface ILogin extends AxiosResponse {
  data: {
    token: string;
    payload: AuthPayload;
  };
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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [query] = useQuery<RedirectQuery>();
  const redirectUrl = query.redirect;

  const { setInforUser } = userStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDto>({
    resolver: yupResolver(schemaFormLogin),
  });

  const onSubmit: SubmitHandler<LoginUserDto> = async (formData) => {
    try {
      const { data } = await authenServices.login(formData);
      const loginResponse: ILogin = data;
      if (data.success) {
        const { payload, token } = loginResponse.data;
        localServices.setData(TOKEN, token);
        setInforUser(payload, token);
        navigate('/');
      }
    } catch {
      notify({
        message: loginError,
        type: 'danger',
      } as iNotification);
    }
  };

  useLayoutEffect(() => {
    titleServices.addSub('Login');
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div className="form-header mb-8 flex items-center md:flex-col xs:flex-col text-center">
        <h2 className="font-medium text-slate-800 text-2xl">
          Login to Multichoice
        </h2>
        {redirectUrl && (
          <p className="text-slate-800 text-sm mt-1">
            Bạn cần đăng nhập để làm bài
          </p>
        )}
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

      <InputAuthen
        className="mt-5"
        registerField={register('password')}
        isError={Boolean(errors.password)}
        errMessage={errors.password?.message}
        placeholder="Password"
        type="password"
        Icon={VscUnlock}
        id="password"
      />

      <div className="remember-me flex justify-end mt-2 text-slate-800">
        <Link
          to="/forgot-password"
          className="text-sm transition-all duration-200 hover:text-primary-900"
        >
          Forgot password?
        </Link>
      </div>

      <div className="submit mt-5">
        <Button type="submit" widthFull color="success" size="lg">
          Sign in
        </Button>
      </div>

      <div className="text-center mt-3">
        <p className="text-slate-800 text-sm">
          Don't have account ?
          <Link
            to={redirectUrl ? `/register?redirect=${redirectUrl}` : '/register'}
            className="inline-block ml-1 text-primary-900"
          >
            Sign up now !
          </Link>
        </p>
      </div>

      <SignUpOptions />
    </form>
  );
};

export default Login;
