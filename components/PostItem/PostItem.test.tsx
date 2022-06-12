import { act, screen, waitFor } from '@testing-library/react';
import { customRender } from 'test-client/test-utils';
import PostItem from 'components/PostItem';
import { fakePostWithAuthor as initFakePostWithAuthor } from 'test-client/server/fake-data';
import { Routes } from 'lib-client/constants';
import userEvent from '@testing-library/user-event';
import { createMockRouter } from 'test-client/Wrapper';
import { NextRouter } from 'next/router';

describe('PostItem', () => {
  // show Publish button
  const fakePostWithAuthor = { ...initFakePostWithAuthor, published: false };
  let router: NextRouter;

  beforeEach(async () => {
    router = createMockRouter({
      push: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders post-item title, user links and buttons', async () => {
    customRender(<PostItem post={fakePostWithAuthor} />, { wrapperProps: { router } });

    // links
    const userLinkRegex = RegExp(fakePostWithAuthor.author.username, 'i');
    const postLinkRegex = RegExp(
      `${fakePostWithAuthor.author.username}/post/${fakePostWithAuthor.id}`,
      'i'
    );
    const editButtonLinkRegex = RegExp(
      `${Routes.SITE.CREATE}${fakePostWithAuthor.id}`,
      'i'
    );

    // assert post's title
    const title = await screen.findByRole('heading', {
      name: RegExp(`${fakePostWithAuthor.title}`, 'i'),
    });
    expect(title).toBeInTheDocument();
    expect(title.closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(postLinkRegex)
    );

    // assert post's name link (2 links - desktop and mobile css)
    const nameLink = screen.getAllByRole('link', {
      name: RegExp(fakePostWithAuthor.author.name, 'i'),
    })[0];
    expect(nameLink).toBeInTheDocument();
    expect(nameLink).toHaveAttribute('href', expect.stringMatching(userLinkRegex));

    // assert post's username link
    const usernameLink = screen.getAllByRole('link', {
      name: RegExp(`@${fakePostWithAuthor.author.username}`, 'i'),
    })[0];
    expect(usernameLink).toBeInTheDocument();
    expect(usernameLink).toHaveAttribute('href', expect.stringMatching(userLinkRegex));

    // assert post's time ago link
    const agoLink = screen.getAllByRole('link', { name: /ago$/i })[0];
    expect(agoLink).toBeInTheDocument();
    expect(agoLink).toHaveAttribute('href', expect.stringMatching(postLinkRegex));

    // assert Edit href to /post/create/:id
    const editButtonLink = screen.getByText(/^edit$/i).closest('a');
    expect(editButtonLink).toHaveAttribute(
      'href',
      // with or without '/'
      expect.stringMatching(editButtonLinkRegex)
    );

    // delete, publish buttons
  });

  test('publish button mutation redirects to Post page onSuccess', async () => {
    customRender(<PostItem post={fakePostWithAuthor} />, { wrapperProps: { router } });

    // click publish
    const publishButton = await screen.findByRole('button', {
      name: /publish/i,
    });

    await userEvent.click(publishButton);

    // assert redirect to /username/post/:id
    // useUpdatePost - {query: { username: data.author.username, id: data.id }},
    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith(
        expect.objectContaining({
          query: {
            username: fakePostWithAuthor.author.username,
            id: fakePostWithAuthor.id,
          },
        })
      )
    );
  });

  test.todo('Publish button mutation');
});
