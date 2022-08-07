import React, { useEffect } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { VscUnlock } from 'react-icons/vsc';
import { SubmitHandler, useForm } from 'react-hook-form';
import { titleServices } from '../../../services/TitleServices';
import { classNames } from '../../../helper/classNames';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './form.scss';

interface IFormLogin {
  email: string;
  password: string;
}

const schema = yup
  .object()
  .shape({
    email: yup.string().max(100).required('Email is required !').email(),
    password: yup
      .string()
      .min(8)
      .max(36)
      .lowercase()
      .uppercase()
      .matches(/[0-9]/),
  })
  .required();

const FormLogin = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormLogin>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    titleServices.addSub('Login');
  }, []);

  const onSubmit: SubmitHandler<IFormLogin> = (data) => {
    console.log(data);
  };

  return (
    <div className="wrapper-form">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form max-w-lg mx-auto mt-24"
        autoComplete="off"
      >
        <div className="form-header mb-10 text-center">
          <h2 className="font-semibold text-black mb-5 text-3xl">Login</h2>
          <p className="text-slate-600">
            Inter yor email address and password <br />
            to get access account
          </p>
        </div>
        <div className="form-group ">
          <div
            className={classNames('wrapper-input relative', {
              'no-error': !errors.email,
            })}
          >
            <input
              {...register('email')}
              id="email"
              placeholder="Email Address"
              className={classNames(
                `transition-all duration-200 pl-9 w-full text-stone-600 outline-none border px-2.5 py-4 border-solid
                border-stone-200 focus:border-primary rounded-md`,
                {
                  'border-stone-200 focus:border-primary': !errors.email,
                  'border-red-500 focus:border-red-500': errors.email,
                }
              )}
            />

            <label
              htmlFor="email"
              className="absolute inline-block px-2 left-0 top-1/2 transform -translate-y-1/2"
            >
              <MdOutlineMail
                className={classNames('transition-all duration-200 text-xl', {
                  'fill-slate-400': !errors.email,
                  'fill-red-500': errors.email,
                })}
              />
            </label>
          </div>

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group relative mt-5">
          <div
            className={classNames('wrapper-input relative', {
              'no-error': !errors.password,
            })}
          >
            <input
              {...register('password')}
              id="password"
              type="password"
              placeholder="Password"
              className={classNames(
                `transition-all duration-200 pl-9 w-full text-stone-600 outline-none border px-2.5 py-4 border-solid
              border-stone-200 focus:border-primary rounded-md`,
                {
                  'border-stone-200 focus:border-primary': !errors.password,
                  'border-red-500 focus:border-red-500': errors.password,
                }
              )}
            />
            <label
              htmlFor="password"
              className="absolute inline-block px-2 left-0 top-1/2 transform -translate-y-1/2"
            >
              <VscUnlock
                className={classNames('transition-all duration-200  text-xl', {
                  'fill-slate-400': !errors.email,
                  'fill-red-500': errors.email,
                })}
              />
            </label>
          </div>
        </div>

        <div className="remember-me mt-5">
          <div className="check-box">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
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

export default FormLogin;
