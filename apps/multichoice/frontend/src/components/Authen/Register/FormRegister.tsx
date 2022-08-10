import React, { useLayoutEffect, useState } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { VscUnlock } from 'react-icons/vsc';

import { SubmitHandler, useForm } from 'react-hook-form';
import { titleServices } from '../../../services/TitleServices';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { localServices } from '../../../services/LocalServices';
import { FORM_LOGIN_LOCAL } from '../../../constants/contstants';
import Checkbox from '../../Commons/Checkbox/Checkbox';

import SignUpOptions from '../SignUpOptions';
import InputAuthen from '../InputAuthen';
import { validation } from '@monorepo/multichoice/validation';
import { authenServices } from '../../../services/AuthenServices';

export interface IFormRegister {
  email: string;
  password: string;
}

const { email, password } = validation();
const schemaFormRegister = yup
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

const FormRegister: React.FC = () => {
  const [isUserAccept, setIsUserAccept] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<IFormRegister>({
    resolver: yupResolver(schemaFormRegister),
  });

  useLayoutEffect(() => {
    titleServices.addSub('Login');
  }, []);

  const onSubmit: SubmitHandler<IFormRegister> = async (formData) => {
    if (isUserAccept) {
      const data = await authenServices.register(formData);
    }
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
              onChange={setIsUserAccept}
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
