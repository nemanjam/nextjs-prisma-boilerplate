import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { customRender } from 'test/test-utils';
import UsersView from 'views/Users';
import { fakeUsers } from 'test/server/fake-data';

describe('Users View', () => {
  // almost same like HomeView
  test('renders pagination section and users cards list', async () => {
    customRender(<UsersView />);

    // wait for loaders to disappear (page and UserItem)
    await waitForElementToBeRemoved(() => screen.getAllByTestId(/loading/i));

    // assert title
    const title = screen.getByRole('heading', {
      name: /users/i,
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

    // assert first users's username link
    const usernameLink = screen.getAllByRole('link', {
      name: RegExp(`@${fakeUsers.items[0].username}`, 'i'),
    })[0];
    expect(usernameLink).toBeInTheDocument();
  });

  // test search filters users - same as in HomeView
});
