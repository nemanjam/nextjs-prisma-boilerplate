import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRender } from 'test/test-utils';
import SettingsView from 'views/Settings';
import { fakeUser } from 'test/server/fake-data';
import { Routes } from 'lib-client/constants';
import { createMockRouter } from 'test/Wrapper';

describe('Settings View', () => {
  test('renders user settings view', async () => {
    const router = createMockRouter({
      query: { username: fakeUser.username },
      pathname: Routes.SITE.SETTINGS,
    });
    customRender(<SettingsView />, { wrapperProps: { router } });

    // wait for loader to disappear
    await waitForElementToBeRemoved(() => screen.getByText(/loading.../i));

    // assert title
    const title = screen.getByRole('heading', {
      name: /settings/i,
    });
    expect(title).toBeInTheDocument();

    // assert header image - async
    const headerImage = await screen.findByRole('img', { name: /header\-image/i });
    expect(headerImage).toBeInTheDocument();
    expect(headerImage).toHaveAttribute(
      'href',
      expect.stringMatching(/^blob:https?:\/\//i)
    );

    // assert username input
    const usernameInput = screen.getByRole('textbox', {
      name: /username/i,
    });
    expect(usernameInput).toBeInTheDocument();

    // assert name input
    const nameInput = screen.getByRole('textbox', {
      name: /^name$/i,
    });
    expect(nameInput).toBeInTheDocument();

    // assert avatar image - async
    const avatarImage = await screen.findByRole('img', { name: /avatar\-image/i });
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute(
      'href',
      expect.stringMatching(/^blob:https?:\/\//i)
    );

    // assert bio text area
    const bioTextArea = screen.getByRole('textbox', {
      name: /^bio$/i,
    });
    expect(bioTextArea).toBeInTheDocument();

    // assert password field
    const passwordField = screen.getByLabelText(/^password$/i);
    expect(passwordField).toBeInTheDocument();

    // assert confirm password field
    const confirmPasswordField = screen.getByLabelText(/confirm password/i);
    expect(confirmPasswordField).toBeInTheDocument();

    // assert submit button
    const submitButton = screen.getByRole('button', {
      name: /submit/i,
    });
    expect(submitButton).toBeInTheDocument();

    // assert reset button
    const resetButton = screen.getByRole('button', {
      name: /reset/i,
    });
    expect(resetButton).toBeInTheDocument();
  });
});
