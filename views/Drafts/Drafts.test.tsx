import { screen } from '@testing-library/react';
import { customRender } from 'test-client/test-utils';
import DraftsView from 'views/Drafts';
import { fakePosts } from 'test-client/server/fake-data';

describe('Drafts View', () => {
  test('renders title, pagination and posts with Publish button', async () => {
    customRender(<DraftsView />);

    // assert title
    const title = await screen.findByRole('heading', {
      name: /drafts/i,
    });
    expect(title).toBeInTheDocument();

    // assert first post's username link
    const usernameLink = screen.getAllByRole('link', {
      name: RegExp(`@${fakePosts.items[0].author.username}`, 'i'),
    })[0];
    expect(usernameLink).toBeInTheDocument();

    // assert first post has Publish button
    const publishButton = screen.getAllByRole('button', {
      name: /publish/i,
    })[0];
    expect(publishButton).toBeInTheDocument();
  });
});
