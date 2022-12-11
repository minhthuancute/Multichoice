import React from 'react';

const SignUpOptions: React.FC = () => {
  return (
    <div className="signup-options">
      <div className="line my-6">
        <p
          className="flex items-center before:w-1/2
          before:h-0.5 after:w-1/2 after:h-0.5 before:bg-slate-100 after:bg-slate-100"
        >
          <span className="text-sm text-slate-800 font-medium inline-block px-4">
            OR
          </span>
        </p>
      </div>
      <div className="socials">
        <div className="google">
          <button
            className="w-full flex items-center justify-center border border-solid border-slate-200
            rounded-md py-2.5"
          >
            <img src="../../assets/images/google.png" alt="login google" />
            <span className="ml-3 font-medium text-slate-800 text-sm">
              Sign up with Google
            </span>
          </button>
        </div>
        <div className="facebook mt-5">
          <button
            className="w-full flex items-center justify-center border border-solid border-slate-200
            rounded-md py-2.5"
          >
            <img src="../../assets/images/facebook.png" alt="login google" />
            <span className="ml-3 font-medium text-slate-800 text-sm">
              Sign up with Facebook
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpOptions;
