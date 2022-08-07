import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { titleServices } from '../../services/TitleServices';
import FormLogin from '../../components/Authen/Login/FormLogin';

const Login: React.FC = () => {
  useEffect(() => {
    titleServices.addSub('Login');
  }, []);

  return (
    <div className="wrapper-login min-h-screen bg-login bg-no-repeat bg-center">
      <header className="header px-10 pt-5 flex items-center justify-between">
        <h1 className="logo font-semibold text-2xl">
          <Link to="/">Multichoise</Link>
        </h1>
        <p className="text-sm">
          Don't have account ?
          <Link to="/register" className="inline-block ml-1 text-primary">
            Sign up now !
          </Link>
        </p>
      </header>
      <FormLogin />
    </div>
  );
};

export default Login;
