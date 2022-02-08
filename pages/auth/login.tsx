import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { getProviders, ClientSafeProvider } from 'next-auth/react';
import AuthLayout from 'layouts/AuthLayout';
import AuthView from 'views/Auth';
import { redirectHome } from 'utils';

type Props = {
  providers: Record<string, ClientSafeProvider>;
};

const Login: FC<Props> = ({ providers }) => {
  return (
    <AuthLayout>
      <AuthView providers={providers} isRegisterForm={false} />
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // leave session, doesn't need user or !user.id, !user.email
  const session = await getSession({ req });

  if (session) {
    return redirectHome;
  }

  const providers = await getProviders();
  return { props: { providers } };
};

export default Login;
