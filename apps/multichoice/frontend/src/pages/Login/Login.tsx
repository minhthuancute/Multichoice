import React, { useEffect } from 'react';
import { titleServices } from '../../services/TitleServices';
import FormLogin from '../../components/Authen/Login/FormLogin';
import AuthenLayout from '../../layouts/AuthenLayout';
import SignUpOptions from '../../components/Authen/SignUpOptions';

const Login: React.FC = () => {
  useEffect(() => {
    titleServices.addSub('Login');
  }, []);

  return (
    <AuthenLayout>
      <FormLogin />
      <SignUpOptions />
    </AuthenLayout>
  );
};

export default Login;
