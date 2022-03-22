import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { customRender } from 'test/test-utils';
import PostView from 'views/Post';
import { fakePostWithAuthor } from 'test/server/fake-data';
import { createMockRouter } from 'test/Wrapper';
import { Routes } from 'lib-client/constants';

describe('Post View', () => {
  test('renders post title, username link and edit link', async () => {
    const router = createMockRouter({
      query: { id: [fakePostWithAuthor.id.toString()] },
      pathname: `/${fakePostWithAuthor.author.username}${Routes.SITE.POST}`,
    });

    customRender(<PostView />, { wrapperProps: { router } });

    // wait for loader to disappear
    await waitForElementToBeRemoved(() => screen.getByText(/loading.../i));

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
    const editButtonLink = screen.getByText(/edit/i).closest('a');
    expect(editButtonLink).toHaveAttribute(
      'href',
      // with or without '/'
      expect.stringMatching(RegExp(`${Routes.SITE.CREATE}${fakePostWithAuthor.id}`, 'i'))
    );
  });

  test.todo('Delete button mutation');

  test.todo('Publish button mutation');
});
