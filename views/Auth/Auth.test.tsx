import { act, screen, waitFor } from '@testing-library/react';
import { customRender } from 'test-client/test-utils';
import AuthView from 'views/Auth';
import { Routes } from 'lib-client/constants';
import { createMockRouter } from 'test-client/Wrapper';
import { fakeUser } from 'test-client/server/fake-data';
import userEvent from '@testing-library/user-event';
import { signIn, ClientSafeProvider } from 'next-auth/react';

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
    const title = await screen.findByRole('heading', {
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
    const title = await screen.findByRole('heading', {
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

// mock signIn()
jest.mock('next-auth/react', () => ({
  ...(jest.requireActual('next-auth/react') as Record<string, unknown>), // cast just for spread
  signIn: jest.fn().mockReturnValue({ ok: false }),
}));
const mockedSignIn = jest.mocked(signIn, true); // just for type .mockClear();

describe('Auth View login and register buttons', () => {
  const fakePassword = '123456';

  test('login, facebook login and google login call next-auth signIn', async () => {
    customRender(<AuthView isRegisterForm={false} providers={providers} />);

    // fill email
    const emailInput = await screen.findByRole('textbox', {
      name: /email/i,
    });
    await userEvent.type(emailInput, fakeUser.email);

    // fill password
    const passwordField = screen.getByLabelText(/^password$/i);
    await userEvent.type(passwordField, fakePassword);

    // click login
    const loginButton = screen.getByRole('button', {
      name: /^login$/i,
    });
    await userEvent.click(loginButton);

    // assert login signIn arguments
    await waitFor(() =>
      expect(mockedSignIn).toHaveBeenCalledWith(providers.credentials.id, {
        email: fakeUser.email,
        password: fakePassword,
        redirect: false,
      })
    );
    mockedSignIn.mockClear();

    // click facebook login
    const facebookButton = screen.getByRole('button', {
      name: /login with facebook/i,
    });
    await userEvent.click(facebookButton);

    // assert fb signIn arguments
    await waitFor(() => expect(mockedSignIn).toHaveBeenCalledWith(providers.facebook.id));
    mockedSignIn.mockClear();

    // click google login
    const googleButton = screen.getByRole('button', {
      name: /login with google/i,
    });
    await userEvent.click(googleButton);

    // assert google signIn arguments
    await waitFor(() => expect(mockedSignIn).toHaveBeenCalledWith(providers.google.id));
    mockedSignIn.mockClear();
  });

  test('register calls createUser mutation and redirects to login page', async () => {
    const router = createMockRouter({
      push: jest.fn(),
    });
    customRender(<AuthView isRegisterForm />, { wrapperProps: { router } });

    // fill name
    const nameInput = await screen.findByRole('textbox', {
      name: /^name$/i,
    });
    await userEvent.type(nameInput, fakeUser.name);

    // fill username
    const usernameInput = screen.getByRole('textbox', {
      name: /username/i,
    });
    await userEvent.type(usernameInput, fakeUser.username);

    // fill email
    const emailInput = screen.getByRole('textbox', {
      name: /email/i,
    });
    await userEvent.type(emailInput, fakeUser.email);

    // fill password
    const passwordField = screen.getByLabelText(/^password$/i);
    await userEvent.type(passwordField, fakePassword);

    // fill confirm password
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);
    await userEvent.type(confirmPasswordField, fakePassword);

    // click register
    const registerButton = screen.getByRole('button', {
      name: /register/i,
    });
    await userEvent.click(registerButton);

    // assert redirect to /auth/login/
    await waitFor(() => expect(router.push).toHaveBeenCalledWith(Routes.SITE.LOGIN));
  });
});
