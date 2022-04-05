import { act, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { customRender } from 'test/test-utils';
import PostItem from 'components/PostItem';
import { fakePostWithAuthor } from 'test/server/fake-data';
import { Routes } from 'lib-client/constants';
import userEvent from '@testing-library/user-event';
import { NextRouter } from 'next/router';

describe('PostItem', () => {
  let router: NextRouter = null;

  beforeEach(async () => {
    customRender(<PostItem post={fakePostWithAuthor} />);

    // wait for useMe loader
    await waitForElementToBeRemoved(() => screen.getByText(/loading\.\.\./i));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders post title, user links and buttons', async () => {
    // links
    const userLinkRegex = RegExp(fakePostWithAuthor.author.username, 'i');
    const postLinkRegex = RegExp(
      `${fakePostWithAuthor.author.username}\/post\/${fakePostWithAuthor.id}`,
      'i'
    );
    const editButtonLinkRegex = RegExp(
      `${Routes.SITE.CREATE}${fakePostWithAuthor.id}`,
      'i'
    );

    // assert post's title
    const title = screen.getByRole('heading', {
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
  });

  // replace this
  xtest('delete button mutation redirects to Home onSuccess', async () => {
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
