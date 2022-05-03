import { screen } from '@testing-library/react';
import { customRender } from 'test-client/test-utils';
import DraftsView from 'views/Drafts';
import { fakePosts } from 'test-client/server/fake-data';

describe('Drafts View', () => {
  test('renders title, pagination and posts with Publish button', async () => {
    customRender(<DraftsView />);

    // first assert first post has Publish button
    // it requires me and loads last
    const publishButton = (
      await screen.findAllByRole('button', {
        name: /publish/i,
      })
    )[0];
    expect(publishButton).toBeInTheDocument();

    // assert title
    const title = screen.getByRole('heading', {
      name: /drafts/i,
    });
    expect(title).toBeInTheDocument();

    // assert first post's username link
    const usernameLink = screen.getAllByRole('link', {
      name: RegExp(`@${fakePosts.items[0].author.username}`, 'i'),
    })[0];
    expect(usernameLink).toBeInTheDocument();
  });
});
