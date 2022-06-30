import { screen } from '@testing-library/react';
import { customRender } from 'test-client/test-utils';
import UserItem from 'components/UserItem';
import { fakeUser } from 'test-client/server/fake-data';
import { Routes } from 'lib-client/constants';

describe('UserItem', () => {
  test('renders title, avatar, username and buttons', async () => {
    // first user is admin
    customRender(<UserItem user={fakeUser} />);

    const userLinkRegex = RegExp(fakeUser.username, 'i');
    const settingsLinkRegex = RegExp(`${Routes.SITE.SETTINGS}${fakeUser.username}`, 'i');

    // assert title
    const title = await screen.findByRole('heading', {
      name: RegExp(`${fakeUser.name}`, 'i'),
    });
    expect(title).toBeInTheDocument();
    expect(title.closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(userLinkRegex)
    );

    // assert avatar
    const avatarImage = screen.getByRole('img', {
      name: RegExp(`${fakeUser.name}`, 'i'),
    });
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage.closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(userLinkRegex)
    );

    // assert username link
    const usernameLink = screen.getByText(RegExp(`@${fakeUser.username}`, 'i'));
    expect(usernameLink).toBeInTheDocument();
    expect(usernameLink.closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(userLinkRegex)
    );

    // asseert Edit button link
    const editButton = screen.getByText(/^edit$/i);
    expect(editButton).toBeInTheDocument();
    expect(editButton.closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(settingsLinkRegex)
    );

    // assert Delete button, cannot delete himself
    const deleteButton = screen.queryByRole('button', {
      name: /delete/i,
    });
    expect(deleteButton).not.toBeInTheDocument();

    //
  });
});
