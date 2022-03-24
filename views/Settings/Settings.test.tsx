import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRender } from 'test/test-utils';
import CreateView from 'views/Create';
import { fakePost, fakePostWithAuthor } from 'test/server/fake-data';
import { Routes } from 'lib-client/constants';
import { createMockRouter } from 'test/Wrapper';

describe('Create View', () => {
  test('create post mutation onSuccess redirects to drafts page', async () => {
    const router = createMockRouter({
      push: jest.fn(),
    });
    customRender(<CreateView />, { wrapperProps: { router } });

    // fill out form
    const titleInput = screen.getByRole('textbox', {
      name: /title/i,
    });
    const contentTextArea = screen.getByRole('textbox', {
      name: /content/i,
    });
    userEvent.type(titleInput, fakePost.title);
    userEvent.type(contentTextArea, fakePost.content);

    // click create
    const createButton = screen.getByRole('button', {
      name: /create/i,
    });
    userEvent.click(createButton);

    // assert redirect to /post/drafts
    await waitFor(() => expect(router.push).toHaveBeenCalledWith(Routes.SITE.DRAFTS));
  });
});
