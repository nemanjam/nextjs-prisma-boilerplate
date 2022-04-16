import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { getProviders, ClientSafeProvider } from 'next-auth/react';
import AuthLayout from 'layouts/AuthLayout';
import AuthView from 'views/Auth';
import { Redirects } from 'lib-client/constants';
import CustomHead from 'components/CustomHead';

type Props = {
  providers: Record<string, ClientSafeProvider>;
};

const Login: FC<Props> = ({ providers }) => {
  return (
    <>
      <CustomHead title="Login page" description="Login" />
      <AuthLayout>
        <AuthView providers={providers} isRegisterForm={false} />
      </AuthLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // leave session, doesn't need user or !user.id, !user.email
  const session = await getSession({ req });

  if (session) return Redirects.HOME;

  const providers = await getProviders();
  return { props: { providers } };
};

export default Login;
