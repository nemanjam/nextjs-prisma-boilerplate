import { FC } from 'react';
import AuthLayout from 'layouts/AuthLayout';
import AuthView from 'views/Auth';

const Register: FC = () => {
  return (
    <AuthLayout>
      <AuthView isRegisterForm />
    </AuthLayout>
  );
};

export default Register;
