import React from 'react';
import { signIn, ClientSafeProvider } from 'next-auth/react';
import Link from 'next/link';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { getErrorClass, withBem } from 'utils/bem';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { userRegisterSchema, userLoginSchema } from 'lib-server/validation';
import { Routes } from 'lib-client/constants';
import Button from 'components/Button';

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
      <section className={b('content')}>
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
                <p className={getErrorClass(errors.name?.message)}>
                  {errors.name?.message}
                </p>
              </div>

              <div className={b('form-field')}>
                <label htmlFor="username">Username</label>
                <input id="username" type="text" {...register('username')} />
                <p className={getErrorClass(errors.username?.message)}>
                  {errors.username?.message}
                </p>
              </div>
            </>
          )}

          <div className={b('form-field')}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...register('email')} />
            <p className={getErrorClass(errors.email?.message)}>
              {errors.email?.message}
            </p>
          </div>

          <div className={b('form-field')}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" {...register('password')} />
            <p className={getErrorClass(errors.password?.message)}>
              {errors.password?.message}
            </p>
          </div>

          {isRegisterForm && (
            <div className={b('form-field')}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
              />
              <p className={getErrorClass(errors.confirmPassword?.message)}>
                {errors.confirmPassword?.message}
              </p>
            </div>
          )}

          <Button variant="secondary" type="submit">
            {isRegisterForm ? 'Register' : 'Login'}
          </Button>
        </form>

        {providers && (
          <div className={b('oauth-buttons')}>
            {Object.values(providers)
              .filter((p) => p.type !== 'credentials')
              .map((provider) => (
                <>
                  {provider.name === 'Facebook' && (
                    <Button key={provider.name} onClick={() => signIn(provider.id)}>
                      Login with Facebook
                    </Button>
                  )}
                  {provider.name === 'Google' && (
                    <Button
                      variant="danger"
                      key={provider.name}
                      onClick={() => signIn(provider.id)}
                    >
                      Login with Google
                    </Button>
                  )}
                </>
              ))}
          </div>
        )}

        <div className={b('link')}>
          {isRegisterForm ? (
            <>
              <span>Already have an account?</span>
              <Link href={Routes.SITE.LOGIN}>
                <a>Login</a>
              </Link>
            </>
          ) : (
            <>
              <span>Don&apos;t have an account?</span>
              <Link href={Routes.SITE.REGISTER}>
                <a>Register</a>
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Auth;
