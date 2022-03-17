import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { customRender } from 'test/test-utils';
import HomeView from 'views/Home';
import { fakePosts } from 'test/server/fake-data';

// import userEvent from '@testing-library/user-event';

describe('Home View', () => {
  test('renders title, pagination section and posts list', async () => {
    customRender(<HomeView />);

    // wait for loader to disappear
    await waitForElementToBeRemoved(() => screen.getByText(/loading.../i));

    // expect title
    expect(
      screen.getByRole('heading', {
        name: /home/i,
      })
    ).toBeInTheDocument();

    // expect pagination button 1
    expect(
      screen.getByRole('button', {
        name: /1/i,
      })
    ).toBeInTheDocument();

    // expect search input
    expect(
      screen.getByRole('textbox', {
        name: /search/i,
      })
    ).toBeInTheDocument();

    // expect first post's username link
    expect(
      screen.getAllByRole('link', {
        name: RegExp(`@${fakePosts.items[0].author.username}`, 'i'),
      })[0]
    ).toBeInTheDocument();
  });
});
