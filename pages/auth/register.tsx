import { FC } from 'react';
import { getSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import AuthLayout from 'layouts/AuthLayout';
import AuthView from 'views/Auth';
import { Redirects } from 'lib-client/constants';
import CustomHead from 'components/CustomHead';

const Register: FC = () => {
  return (
    <>
      <CustomHead title="Register" description="Create new account" />
      <AuthLayout>
        <AuthView isRegisterForm />
      </AuthLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (session) return Redirects.HOME;

  return { props: {} };
};

export default Register;
