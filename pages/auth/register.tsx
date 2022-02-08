import { FC } from 'react';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import AuthLayout from 'layouts/AuthLayout';
import AuthView from 'views/Auth';
import { redirectHome } from 'utils';

const Register: FC = () => {
  return (
    <AuthLayout>
      <AuthView isRegisterForm />
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session) {
    return redirectHome;
  }

  return { props: {} };
};

export default Register;
