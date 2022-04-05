import { act, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { customRender } from 'test/test-utils';
import PostView from 'views/Post';
import { fakePostWithAuthor } from 'test/server/fake-data';
import { createMockRouter } from 'test/Wrapper';
import { Routes } from 'lib-client/constants';
import userEvent from '@testing-library/user-event';
import { NextRouter } from 'next/router';

describe('Post View', () => {
  let router: NextRouter = null;

  beforeEach(async () => {
    router = createMockRouter({
      query: { id: [fakePostWithAuthor.id.toString()] },
      pathname: `/${fakePostWithAuthor.author.username}${Routes.SITE.POST}`,
      push: jest.fn(),
    });
    customRender(<PostView />, { wrapperProps: { router } });

    // wait for loader to disappear
    await waitForElementToBeRemoved(() => screen.getByText(/loading\.\.\./i));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders post title, username link and edit link', async () => {
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

    // assert Edit href to /post/create/:id
    const editButtonLink = screen.getByText(/^edit$/i).closest('a');
    expect(editButtonLink).toHaveAttribute(
      'href',
      // with or without '/'
      expect.stringMatching(RegExp(`${Routes.SITE.CREATE}${fakePostWithAuthor.id}`, 'i'))
    );
  });

  test('delete button mutation redirects to Home onSuccess', async () => {
    // click delete
    const deleteButton = screen.getByRole('button', {
      name: /delete/i,
    });
    await act(async () => {
      await userEvent.click(deleteButton);
    });

    // assert redirect to home '/'
    await waitFor(() => expect(router.push).toHaveBeenCalledWith(Routes.SITE.HOME));
  });

  test.todo('Publish button mutation');
});
