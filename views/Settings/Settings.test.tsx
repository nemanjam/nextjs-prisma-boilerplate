import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRender } from 'test/test-utils';
import SettingsView from 'views/Settings';
import { fakeUser } from 'test/server/fake-data';
import { Routes } from 'lib-client/constants';
import { createMockRouter } from 'test/Wrapper';
import { NextRouter } from 'next/router';

describe('Settings View', () => {
  let router: NextRouter = null;

  beforeEach(async () => {
    router = createMockRouter({
      query: { username: fakeUser.username },
      pathname: Routes.SITE.SETTINGS,
    });
    customRender(<SettingsView />, { wrapperProps: { router } });

    // wait for loader to disappear
    await waitForElementToBeRemoved(() => screen.getByText(/loading.../i));
  });

  test('renders user settings view', async () => {
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

  test('update user mutation on success changes name field value', async () => {
    const updatedName = `Updated ${fakeUser.name}`;

    // edit name
    const nameInput = screen.getByRole('textbox', {
      name: /^name$/i,
    });
    userEvent.type(nameInput, `{selectall}${updatedName}`);

    // click submit
    const submitButton = screen.getByRole('button', {
      name: /submit/i,
    });
    userEvent.click(submitButton);

    // no need to explicitly wait for submit, sumbiting..., submit states

    // 55 |     header: isBrowser()
    // > 56 |       ? z.instanceof(File).refine((file) => file.size <= 1024 * 1024 * 2, {

    // assert name field value is updated
    const updatedNameInput = (await screen.findByRole('textbox', {
      name: /^name$/i,
    })) as HTMLInputElement;
    expect(updatedNameInput.value).toBe(updatedName);
  });
});
