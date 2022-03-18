import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRender } from 'test/test-utils';
import HomeView from 'views/Home';
import { fakePosts } from 'test/server/fake-data';

describe('Home View', () => {
  test('renders title, pagination section and posts list', async () => {
    customRender(<HomeView />);

    // wait for loader to disappear
    await waitForElementToBeRemoved(() => screen.getByText(/loading.../i));

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
    customRender(<HomeView />);

    // wait for loader to disappear
    await waitForElementToBeRemoved(() => screen.getByText(/loading.../i));

    // find input, type in it and submit
    const searchTerm = 'thisIsSearchTerm';
    const searchInput = screen.getByLabelText(/search/i);
    userEvent.type(searchInput, searchTerm);
    fireEvent.submit(searchInput);

    // assert searchTerm in second post's title
    const title = await screen.findByRole('heading', {
      name: RegExp(`${searchTerm}`, 'i'),
    });
    expect(title).toBeInTheDocument();

    // enough, don't recreate entire backend, use e2e tests
    // assert non existing term
  });
});
