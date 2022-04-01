import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { customRender } from 'test/test-utils';
import ProfileView from 'views/Profile';
import { fakeUser, fakePosts } from 'test/server/fake-data';

describe('Profile View', () => {
  // almost same like HomeView
  test('renders profile card, pagination section and posts list', async () => {
    // first user is admin
    customRender(<ProfileView profile={fakeUser} />);

    // wait for loader to disappear
    await waitForElementToBeRemoved(() => screen.getByText(/loading\.\.\./i));

    // assert title
    const title = screen.getByRole('heading', {
      name: RegExp(`${fakeUser.name}`, 'i'),
    });
    expect(title).toBeInTheDocument();

    // assert pagination button 1
    const paginationButton = screen.getByRole('button', {
      name: /1/i,
    });
    expect(paginationButton).toBeInTheDocument();

    // assert search input
    const searchInput = screen.getByRole('textbox', {
      name: /search/i,
    });
    expect(searchInput).toBeInTheDocument();

    // assert first post's username link
    const usernameLink = screen.getAllByRole('link', {
      name: RegExp(`@${fakePosts.items[0].author.username}`, 'i'),
    })[0];
    expect(usernameLink).toBeInTheDocument();
  });

  // test search filters posts - same as in HomeView
});
