import React from 'react';
import { withBem } from 'utils/bem';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRegisterSchema, userLoginSchema } from 'lib-server/validation';
import { Routes } from 'lib-client/constants';
import { signIn, ClientSafeProvider } from 'next-auth/react';

type Props = {
  isRegisterForm?: boolean;
  providers?: Record<string, ClientSafeProvider>;
};

const Auth: React.FC<Props> = ({ isRegisterForm = true, providers }) => {
  const b = withBem('auth');

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(isRegisterForm ? userRegisterSchema : userLoginSchema),
  });
  const { errors } = formState;

  // axios post to /api/auth/callback/credentials
  // https://next-auth.js.org/configuration/pages#credentials-sign-in
  const onSubmitLogin = async ({ email, password }) => {
    await signIn('credentials', {
      email,
      password,
    });
  };

  const onSubmitRegister = async ({ name, username, email, password }) => {
    try {
      await axios.post(Routes.API.USERS, { name, username, email, password });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={b()}>
      <main className={b('content')}>
        <h1 className={b('title')}>{isRegisterForm ? 'Register' : 'Login'}</h1>

        <form
          className={b('form')}
          onSubmit={handleSubmit(isRegisterForm ? onSubmitRegister : onSubmitLogin)}
        >
          {isRegisterForm && (
            <>
              <div className={b('form-field')}>
                <label htmlFor="name">Name</label>
                <input id="name" type="text" {...register('name')} />
                {errors.name && <p className="has-error">{errors.name.message}</p>}
              </div>

              <div className={b('form-field')}>
                <label htmlFor="username">Username</label>
                <input id="username" type="text" {...register('username')} />
                {errors.username && (
                  <p className="has-error">{errors.username.message}</p>
                )}
              </div>
            </>
          )}

          <div className={b('form-field')}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...register('email')} />
            {errors.email && <p className="has-error">{errors.email.message}</p>}
          </div>

          <div className={b('form-field')}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" {...register('password')} />
            {errors.password && <p className="has-error">{errors.password.message}</p>}
          </div>

          {isRegisterForm && (
            <div className={b('form-field')}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="has-error">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          <button type="submit">{isRegisterForm ? 'Register' : 'Login'}</button>
        </form>

        {providers &&
          Object.values(providers)
            .filter((p) => p.type !== 'credentials')
            .map((provider) => (
              <div key={provider.name}>
                <button onClick={() => signIn(provider.id)}>
                  Login with {provider.name}
                </button>
              </div>
            ))}
      </main>
    </div>
  );
};

export default Auth;
