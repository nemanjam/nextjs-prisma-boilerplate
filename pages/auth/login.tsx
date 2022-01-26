import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { getProviders, ClientSafeProvider } from 'next-auth/react';
import { Routes } from 'lib-client/constants';
import AuthLayout from 'layouts/AuthLayout';
import AuthView from 'views/Auth';

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
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: Routes.SITE.HOME,
      },
    };
  }

  const providers = await getProviders();
  return { props: { providers } };
};

export default Login;
