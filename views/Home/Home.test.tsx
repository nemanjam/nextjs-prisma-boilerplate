import {
  act,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRender } from 'test/test-utils';
import HomeView from 'views/Home';
import { fakePosts } from 'test/server/fake-data';

describe('Home View', () => {
  beforeEach(async () => {
    customRender(<HomeView />);

    // wait for loaders to disappear (page and PostItem)
    await waitForElementToBeRemoved(() => screen.getAllByTestId(/loading/i));
  });

  test('renders title, pagination section and posts list', async () => {
    // assert title
    const title = screen.getByRole('heading', {
      name: /home/i,
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

  test('finds post with submited search term', async () => {
    // find input, type in it and submit
    const searchTerm = fakePosts.items[0].title;
    const searchInput = screen.getByRole('textbox', {
      name: /search/i,
    });

    // fix this?
    await act(async () => {
      await userEvent.type(searchInput, searchTerm);
      fireEvent.submit(searchInput);
    });

    // wait for fetching indicator to appear and disappear, no need

    // assert searchTerm in second post's title
    const title = await screen.findByRole('heading', {
      name: RegExp(`${searchTerm}`, 'i'),
    });
    expect(title).toBeInTheDocument();

    // enough, don't recreate entire backend, use e2e tests
    // assert non existing term
  });
});
