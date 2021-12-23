import AuthLayout from 'layouts/AuthLayout';
import { default as AuthView } from 'views/Auth';

const Register: React.FC = () => {
  return (
    <AuthLayout>
      <AuthView isRegisterForm />
    </AuthLayout>
  );
};

export default Register;
