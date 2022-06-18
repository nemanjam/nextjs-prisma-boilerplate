import { screen } from '@testing-library/react';
import { customRender } from 'test-client/test-utils';
import DraftsView from 'views/Drafts';
import { fakePosts } from 'test-client/server/fake-data';

describe('Drafts View', () => {
  test('99 renders title, pagination and posts with Publish button', async () => {
    customRender(<DraftsView />);

    // in msw posts
    // fakePosts.items.map((post) => ({ ...post, published: false }))

    // first assert first post has Publish button
    // it requires me and loads last
    const publishButtons = await screen.findAllByRole('button', {
      name: /publish/i,
    });
    expect(publishButtons[0]).toBeInTheDocument();

    // assert title
    const title = screen.getByRole('heading', { name: /drafts/i });
    expect(title).toBeInTheDocument();

    // assert first post's username link
    const usernameLinks = screen.getAllByRole('link', {
      name: RegExp(`@${fakePosts.items[0].author.username}`, 'i'),
    });
    expect(usernameLinks[0]).toBeInTheDocument();
  });
});
