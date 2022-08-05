import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { MdOutlineMail } from 'react-icons/md';
import { VscUnlock } from 'react-icons/vsc';

interface IInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IInputs>();

  const onSubmit: SubmitHandler<IInputs> = (data) => {
    console.log(data);
  };

  return (
    <div className="wrapper-login min-h-screen bg-login bg-no-repeat bg-center">
      <header className="header px-10 pt-5 flex items-center justify-between">
        <h1 className="logo font-semibold text-2xl">
          <Link to="/">Mutilchoise</Link>
        </h1>
        <p className="text-sm">
          Don't have account ?
          <Link to="/register" className="inline-block ml-1 text-primary">
            Sign up now !
          </Link>
        </p>
      </header>
      <main>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="form max-w-lg mx-auto mt-24"
        >
          <div className="form-header mb-10 text-center">
            <h2 className="font-semibold text-black mb-5 text-3xl">Login</h2>
            <p className="text-slate-600">
              Inter yor email address and password <br />
              to get access account
            </p>
          </div>
          <div
            className="form-group relative transition-all duration-200
            border px-2.5 py-4 mb-5 border-solid border-stone-200 rounded-md hover:shadow-md"
          >
            <input
              {...register('email')}
              id="email"
              placeholder="Email Address"
              className="w-full text-stone-600 outline-none px-2.5"
            />
            <label
              htmlFor="email"
              className="absolute left-0 top-1/2 transform -translate-y-1/2"
            >
              <MdOutlineMail className="fill-slate-400 text-xl" />
            </label>
          </div>
          <div
            className="form-group  transition-all duration-200
            border px-2.5 py-4 border-solid border-stone-200 rounded-md hover:shadow-md"
          >
            <input
              {...register('email')}
              id="password"
              placeholder="Password"
              className="group w-full text-stone-600 outline-none px-2.5"
            />
            <label htmlFor="password">
              <VscUnlock className="group-focus:fill-primary fill-slate-400 text-xl" />
            </label>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
