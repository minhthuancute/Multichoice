import React, { useEffect } from 'react';
import FormLogin from '../../components/Authen/Login/FormLogin';
import AuthenLayout from '../../layouts/AuthenLayout';
import { titleServices } from '../../services/TitleServices';

const Login: React.FC = () => {
  useEffect(() => {
    titleServices.addSub('Login');
  }, []);
  return (
    <AuthenLayout>
      <FormLogin />
    </AuthenLayout>
  );
};

export default Login;
