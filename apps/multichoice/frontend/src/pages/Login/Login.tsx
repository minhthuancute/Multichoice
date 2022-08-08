import React, { useEffect } from 'react';
import FormLogin from '../../components/Authen/Login/FormLogin';
import AuthenLayout from '../../layouts/AuthenLayout';
import SignUpOptions from '../../components/Authen/SignUpOptions';
import { titleServices } from '../../services/TitleServices';

const Login: React.FC = () => {
  useEffect(() => {
    titleServices.addSub('Login');
  }, []);
  return (
    <AuthenLayout>
      <FormLogin />
      <SignUpOptions isLoginPage={true} />
    </AuthenLayout>
  );
};

export default Login;
