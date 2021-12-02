import React, { useRef } from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import { getProviders, signIn, useSession, ClientSafeProvider } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userLoginSchema } from 'lib-server/validation';

type Props = {
  providers: Record<string, ClientSafeProvider>;
};

const Login: React.FC<Props> = ({ providers }) => {
  const { data: session } = useSession();

  // axios post to /api/auth/callback/credentials
  // https://next-auth.js.org/configuration/pages#credentials-sign-in
  const onSubmit = async ({ email, password }) => {
    await signIn('credentials', {
      email,
      password,
    });
  };

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(userLoginSchema),
  });
  const { errors } = formState;

  if (session) {
    Router.push('/');
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <p className="has-error">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="name">Password</label>
          <input id="password" type="password" {...register('password')} />
          {errors.password && <p className="has-error">{errors.password.message}</p>}
        </div>

        <button type="submit">Log in</button>
      </form>

      {providers &&
        Object.values(providers)
          .filter((p) => p.type !== 'credentials')
          .map((provider) => (
            <div key={provider.name}>
              <button onClick={() => signIn(provider.id)}>
                Sign in with {provider.name}
              </button>
            </div>
          ))}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return { props: { providers } };
};

export default Login;
