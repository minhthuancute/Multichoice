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
import { titleServices } from '../../services/TitleServices';
import { authenServices } from '../../services/AuthenServices';
import { ILoginResponse } from '../../types';
import { localServices } from '../../services/LocalServices';
import { TOKEN } from '../../constants/contstants';
import { notify } from '../../helper/notify';
import { loginError } from '../../constants/msgNotify';
import InputAuthen from '../../components/Commons/InputAuthen/InputAuthen';
import AuthenLayout from '../../layouts/AuthenLayout';
import { RedirectQuery } from '../../types/AuthenQuery';
import Button from '../../components/Button/Button';

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
      const data: AxiosResponse = await authenServices.login(formData);
      const loginResponse: ILoginResponse = data.data;
      if (loginResponse.success) {
        const { payload, token } = loginResponse.data;
        localServices.setData(TOKEN, token);
        setInforUser(payload, token);

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

  useLayoutEffect(() => {
    titleServices.addSub('Login');
  }, []);

  return (
    <AuthenLayout>
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

        <div className="remember-me flex justify-end mt-5 text-slate-800">
          <Link
            to="/forgot-password"
            className="text-sm transition-all duration-200 hover:text-primary-900"
          >
            Forgot password?
          </Link>
        </div>

        <div className="submit mt-5">
          <Button type="submit" fullWidth>
            Sign in
          </Button>
        </div>

        {/* <SignUpOptions isLoginPage={true} /> */}
      </form>
    </AuthenLayout>
  );
};

export default Login;
