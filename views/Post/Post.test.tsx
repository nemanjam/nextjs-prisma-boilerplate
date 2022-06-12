import { act, screen, waitFor } from '@testing-library/react';
import { customRender } from 'test-client/test-utils';
import PostView from 'views/Post';
import { fakePostWithAuthor } from 'test-client/server/fake-data';
import { createMockRouter } from 'test-client/Wrapper';
import { Routes } from 'lib-client/constants';
import userEvent from '@testing-library/user-event';
import { NextRouter } from 'next/router';

describe('Post View', () => {
  let router: NextRouter;

  beforeEach(async () => {
    router = createMockRouter({
      query: { id: [fakePostWithAuthor.id.toString()] },
      pathname: `/${fakePostWithAuthor.author.username}${Routes.SITE.POST}`,
      back: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders post title, username link and edit link', async () => {
    customRender(<PostView />, { wrapperProps: { router } });

    // first assert Edit button because it depends on useMe provider with isMounted
    // assert Edit href to /post/create/:id
    const editButtonLink = (await screen.findByText(/^edit$/i)).closest('a');
    expect(editButtonLink).toHaveAttribute(
      'href',
      // with or without '/'
      expect.stringMatching(RegExp(`${Routes.SITE.CREATE}${fakePostWithAuthor.id}`, 'i'))
    );

    // assert post's title
    const title = screen.getByRole('heading', {
      name: RegExp(`${fakePostWithAuthor.title}`, 'i'),
    });
    expect(title).toBeInTheDocument();

    // assert post's username link
    const usernameLink = screen.getByRole('link', {
      name: RegExp(`@${fakePostWithAuthor.author.username}`, 'i'),
    });
    expect(usernameLink).toBeInTheDocument();
  });

  test('delete button mutation redirects to Home onSuccess', async () => {
    customRender(<PostView />, { wrapperProps: { router } });

    // click delete
    const deleteButton = await screen.findByRole('button', {
      name: /delete/i,
    });
    await userEvent.click(deleteButton);

    // assert redirect to previous page
    await waitFor(() => expect(router.back).toHaveBeenCalledTimes(1));
  });

  test.todo('Publish button mutation');
});
