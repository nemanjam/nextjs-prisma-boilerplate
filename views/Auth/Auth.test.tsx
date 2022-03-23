import { screen } from '@testing-library/react';
import { ClientSafeProvider } from 'next-auth/react';
import { customRender } from 'test/test-utils';
import AuthView from 'views/Auth';
import { Routes } from 'lib-client/constants';

const authUrl = 'https://localhost:3001/api/auth/';
const providers: Record<string, ClientSafeProvider> = {
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    type: 'oauth',
    signinUrl: `${authUrl}signin/facebook`,
    callbackUrl: `${authUrl}callback/facebook`,
  },
  google: {
    id: 'google',
    name: 'Google',
    type: 'oauth',
    signinUrl: `${authUrl}signin/google`,
    callbackUrl: `${authUrl}callback/google`,
  },
  credentials: {
    id: 'credentials',
    name: 'Credentials',
    type: 'credentials',
    signinUrl: `${authUrl}signin/credentials`,
    callbackUrl: `${authUrl}callback/credentials`,
  },
};

describe('Auth View', () => {
  test('renders Login form, links and buttons', async () => {
    customRender(<AuthView isRegisterForm={false} providers={providers} />);

    // assert title
    const title = screen.getByRole('heading', {
      name: /login/i,
    });
    expect(title).toBeInTheDocument();

    // assert email field
    const emailField = screen.getByRole('textbox', {
      name: /email/i,
    });
    expect(emailField).toBeInTheDocument();

    // assert password field
    const passwordField = screen.getByLabelText(/password/i);
    expect(passwordField).toBeInTheDocument();

    // assert login button
    const loginButton = screen.getByRole('button', {
      name: /^login$/i,
    });
    expect(loginButton).toBeInTheDocument();

    // assert facebook login button
    const facebookButton = screen.getByRole('button', {
      name: /login with facebook/i,
    });
    expect(facebookButton).toBeInTheDocument();

    // assert google login button
    const googleButton = screen.getByRole('button', {
      name: /login with google/i,
    });
    expect(googleButton).toBeInTheDocument();

    // assert home link '/'
    const homeLink = screen.getByRole('link', {
      name: /home/i,
    });
    expect(homeLink).toHaveAttribute('href', Routes.SITE.HOME);

    // assert register link /auth/register/
    const registerLink = screen.getByRole('link', {
      name: /register/i,
    });
    expect(registerLink).toHaveAttribute(
      'href',
      // trim end '/'
      expect.stringMatching(RegExp(`${Routes.SITE.REGISTER}`.replace(/\/$/, ''), 'i'))
    );
  });

  test('renders Register form, links and button', async () => {
    customRender(<AuthView isRegisterForm />);

    // assert title
    const title = screen.getByRole('heading', {
      name: /register/i,
    });
    expect(title).toBeInTheDocument();

    // assert name field
    const nameField = screen.getByRole('textbox', {
      name: /^name$/i,
    });
    expect(nameField).toBeInTheDocument();

    // assert username field
    const usernameField = screen.getByRole('textbox', {
      name: /username/i,
    });
    expect(usernameField).toBeInTheDocument();

    // assert email field
    const emailField = screen.getByRole('textbox', {
      name: /email/i,
    });
    expect(emailField).toBeInTheDocument();

    // assert password field
    const passwordField = screen.getByLabelText(/^password$/i);
    expect(passwordField).toBeInTheDocument();

    // assert confirm password field
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);
    expect(confirmPasswordField).toBeInTheDocument();

    // assert register button
    const loginButton = screen.getByRole('button', {
      name: /register/i,
    });
    expect(loginButton).toBeInTheDocument();

    // assert home link '/'
    const homeLink = screen.getByRole('link', {
      name: /home/i,
    });
    expect(homeLink).toHaveAttribute('href', Routes.SITE.HOME);

    // assert login link /auth/login/
    const registerLink = screen.getByRole('link', {
      name: /login/i,
    });
    expect(registerLink).toHaveAttribute(
      'href',
      // trim end '/'
      expect.stringMatching(RegExp(`${Routes.SITE.LOGIN}`.replace(/\/$/, ''), 'i'))
    );
  });
});
