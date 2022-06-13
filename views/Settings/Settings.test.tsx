import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRender } from 'test-client/test-utils';
import SettingsView from 'views/Settings';
import { fakeUser } from 'test-client/server/fake-data';
import { Routes } from 'lib-client/constants';
import { createMockRouter } from 'test-client/Wrapper';
import { NextRouter } from 'next/router';

describe('Settings View', () => {
  let router: NextRouter | null = null;

  beforeEach(async () => {
    router = createMockRouter({
      query: { username: [fakeUser.username] }, // [] nested site route, important
      pathname: Routes.SITE.SETTINGS,
    });
    /* eslint-disable testing-library/no-render-in-setup */
    customRender(<SettingsView />, { wrapperProps: { router } });

    // wait for Dropzone images to load
    await screen.findByTestId(/header-loaded/i);
    await screen.findByTestId(/avatar-loaded/i);
  });

  test('renders user settings view', async () => {
    // assert title
    const title = screen.getByRole('heading', {
      name: /settings/i,
    });
    expect(title).toBeInTheDocument();

    // assert header image
    const headerImage = screen.getByRole('img', { name: /header-image/i });
    expect(headerImage).toBeInTheDocument();
    expect(headerImage).toHaveAttribute(
      'src',
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

    // assert avatar image
    const avatarImage = screen.getByRole('img', { name: /avatar-image/i });
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute(
      'src',
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

    // name field
    const _nameInput = await screen.findByRole('textbox', { name: /^name$/i });
    const nameInput = _nameInput as HTMLInputElement;

    // assert original value
    await waitFor(() => expect(nameInput).toHaveValue(fakeUser.name));

    // NOTE: this fixes a bug in userEvent.clear() or React Hook Form
    // field is frozen for first 2 characters
    // user0 name + 123 -> user0 name3
    await userEvent.type(nameInput, '123');

    // edit name
    // bug: this throws, why???
    await userEvent.clear(nameInput);
    expect(nameInput).toHaveValue('');

    await userEvent.type(nameInput, updatedName);
    expect(nameInput).toHaveValue(updatedName);

    // click submit
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);

    // no need to explicitly wait for submit, sumbiting..., submit states

    // assert name field value is updated after submit
    // not perfect assert
    expect(nameInput).toHaveValue(updatedName);
  });
});
