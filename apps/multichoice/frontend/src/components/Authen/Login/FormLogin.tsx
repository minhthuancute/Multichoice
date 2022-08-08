import React, { useLayoutEffect, useState } from 'react';
import { MdOutlineMail } from 'react-icons/md';
import { VscUnlock } from 'react-icons/vsc';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { SubmitHandler, useForm } from 'react-hook-form';
import { titleServices } from '../../../services/TitleServices';
import { classNames } from '../../../helper/classNames';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { localServices } from '../../../services/LocalServices';
import { FORM_LOGIN_LOCAL } from '../../../constants/contstants';
import Checkbox from '../../Commons/Checkbox/Checkbox';
import './form.scss';
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

const FormLogin: React.FC = () => {
  const [dataLocal, setDataLocal] = useState<IFormLogin>();
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isHidePass, setIsHidePass] = useState<boolean>(true);

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

  const toggleHidePass = () => {
    setIsHidePass((state) => !state);
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
          <p className="text-slate-600">
            Inter yor email address and password <br />
            to get access account
          </p>
        </div>

        <InputAuthen
          registerField={register('email')}
          isError={Boolean(errors.email)}
          errMessage={errors.email?.message}
          placeholder="hihi"
          typeInput="email"
          Icon={MdOutlineMail}
        />

        <div className="form-group password mt-5">
          <div
            className={classNames('wrapper-input relative', {
              'no-error': !errors.password,
            })}
          >
            <input
              {...register('password')}
              id="password"
              type={isHidePass ? 'password' : 'text'}
              placeholder="Password"
              className={classNames(
                `transition-all duration-200 pl-9 w-full text-stone-800 outline-none border px-2.5 py-4 border-solid
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
                  'fill-slate-400': !errors.password,
                  'fill-red-500': errors.password,
                })}
              />
            </label>

            <div className="absolute inline-block px-2 right-2 top-1/2 transform -translate-y-1/2">
              <button type="button" onClick={() => toggleHidePass()}>
                {isHidePass ? (
                  <AiOutlineEyeInvisible
                    className={classNames(
                      'transition-all duration-200  text-xl',
                      {
                        'fill-slate-400': !errors.password,
                        'fill-red-500': errors.password,
                      }
                    )}
                  />
                ) : (
                  <AiOutlineEye
                    className={classNames(
                      'transition-all duration-200  text-xl',
                      {
                        'fill-slate-400': !errors.password,
                        'fill-red-500': errors.password,
                      }
                    )}
                  />
                )}
              </button>
            </div>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500 first-letter:capitalize">
              {errors.password.message}
            </p>
          )}
        </div>

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
      </form>
    </div>
  );
};

export default FormLogin;
