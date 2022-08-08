import React, { useEffect } from 'react';
import FormRegister from '../../components/Authen/Register/FormRegister';
import AuthenLayout from '../../layouts/AuthenLayout';
import { titleServices } from '../../services/TitleServices';

const Register = () => {
  useEffect(() => {
    titleServices.addSub('Register');
  }, []);
  return (
    <AuthenLayout>
      <FormRegister />
    </AuthenLayout>
  );
};

export default Register;
