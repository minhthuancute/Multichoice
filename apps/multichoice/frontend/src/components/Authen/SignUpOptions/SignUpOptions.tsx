import React from 'react';
import { classNames } from '../../../helper/classNames';

interface ISignupOption {
  isLoginPage?: boolean;
}

const SignUpOptions: React.FC<ISignupOption> = ({ isLoginPage = false }) => {
  return (
    <div className="signup-options flex flex-col">
      <div
        className={classNames('line my-10 order-1', {
          'order-3 ': !isLoginPage,
        })}
      >
        <p
          className="flex items-center before:w-1/2
          before:h-0.5 after:w-1/2 after:h-0.5 before:bg-slate-100 after:bg-slate-100"
        >
          <span className="text-sm text-slate-800 font-medium inline-block px-4">
            OR
          </span>
        </p>
      </div>
      <div className="socials order-2">
        <div className="google">
          <button
            className="w-full flex items-center justify-center border border-solid border-slate-200
            rounded-md py-4"
          >
            <img src="../../assets/images/google.png" alt="login google" />
            <span className="ml-3 font-medium text-slate-800">
              Sign up with Google
            </span>
          </button>
        </div>
        <div className="facebook mt-5">
          <button
            className="w-full flex items-center justify-center border border-solid border-slate-200
            rounded-md py-4"
          >
            <img src="../../assets/images/facebook.png" alt="login google" />
            <span className="ml-3 font-medium text-slate-800">
              Sign up with Facebook
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpOptions;
