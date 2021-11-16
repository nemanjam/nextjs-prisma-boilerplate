import React, { useRef } from 'react';
import { GetServerSideProps } from 'next';
import Router from 'next/router';
import {
  getProviders,
  signIn,
  useSession,
  ClientSafeProvider,
} from 'next-auth/react';

type Props = {
  providers: Record<string, ClientSafeProvider>;
};

const SignIn: React.FC<Props> = ({ providers }) => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    const result = await signIn('credentials', {
      email: enteredEmail,
      password: enteredPassword,
    });
  };
  // console.log('providers', providers);

  if (session) {
    Router.push('/');
  }

  return (
    <>
      <form method="post" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input name="email" type="text" ref={emailInputRef} />

        <label htmlFor="password">Password</label>
        <input name="password" type="password" ref={passwordInputRef} />

        <input type="submit" value="Sign in" />
      </form>

      {providers &&
        Object.values(providers).map(
          (provider) =>
            provider.type !== 'credentials' && (
              <div key={provider.name}>
                <button onClick={() => signIn(provider.id)}>
                  Sign in with {provider.name}
                </button>
              </div>
            )
        )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return { props: { providers } };
};

export default SignIn;
