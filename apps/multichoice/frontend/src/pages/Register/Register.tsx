import React, { useLayoutEffect, useState } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { VscUnlock } from 'react-icons/vsc';
import { AiOutlineUser } from 'react-icons/ai';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { validation } from '@monorepo/multichoice/validation';
import { useNavigate } from 'react-router-dom';
import { CreateUserDto } from '@monorepo/multichoice/dto';
import { iNotification } from 'react-notifications-component';
import { useQuery } from '../../hooks/useQuery';
import { authenServices } from '../../services/AuthenServices';
import { notify } from '../../helper/notify';
import { acceptTerm, emailExisted } from '../../constants/msgNotify';
import { titleServices } from '../../services/TitleServices';
import InputAuthen from '../../components/Commons/InputAuthen/InputAuthen';
import Checkbox from '../../components/Commons/Checkbox/Checkbox';
import AuthenLayout from '../../layouts/AuthenLayout';
import { RedirectQuery } from '../../types/AuthenQuery';
import Button from '../../components/Commons/Button/Button';

const { username, email, password } = validation();
const schemaFormRegister = yup
  .object()
  .shape({
    username: yup.string().min(username.minLength).max(username.maxLength),
    email: yup
      .string()
      .max(email.maxLength)
      .required('Email is required')
      .email(),
    password: yup.string().min(password.minLength).max(password.maxLength),
  })
  .required();

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [query] = useQuery<RedirectQuery>();
  const redirectUrl = query.redirect;

  const [isUserAccept, setIsUserAccept] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDto>({
    resolver: yupResolver(schemaFormRegister),
  });

  const onSubmit: SubmitHandler<CreateUserDto> = async (formData) => {
    if (isUserAccept) {
      try {
        const { data } = await authenServices.register(formData);
        if (data.success) {
          const urlNavigate = redirectUrl
            ? `/login?redirect=${redirectUrl}`
            : '/login';
          navigate(urlNavigate);
        }
      } catch (error) {
        notify({
          message: emailExisted,
          type: 'danger',
        } as iNotification);
      }
    } else {
      notify({
        message: acceptTerm,
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
        <div className="form-header mb-10 text-center">
          <h2 className="font-medium text-black mb-4 text-3xl">Sign up Now</h2>
          <p className="text-slate-800 text-sm">
            Enter yor valid email address and password to register your account
          </p>
        </div>

        {/* <SignUpOptions isLoginPage={false} /> */}

        <InputAuthen
          registerField={register('username')}
          isError={Boolean(errors.username)}
          errMessage={errors.username?.message}
          placeholder="User Name"
          type="text"
          Icon={AiOutlineUser}
          id="username"
        />

        <InputAuthen
          className="mt-5"
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

        <div className="remember-me flex items-center justify-between mt-5 text-slate-800">
          <div className="check-box cursor-pointer flex items-center">
            <Checkbox
              // onChange={setIsUserAccept}
              textLabel="<p>
                I accept the <span class='text-primary-900'>Term of Conditions</span>
                and <span class='text-primary-900'>Privacy Policy</span>
              </p>"
              id="accept-term"
            />
          </div>
        </div>

        <div className="submit mt-5">
          <Button type="submit" widthFull color="success" size="lg">
            Sign up
          </Button>
        </div>
      </form>
    </AuthenLayout>
  );
};

export default Register;
