import { act, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRender } from 'test/test-utils';
import CreateView from 'views/Create';
import { fakePost, fakePostWithAuthor } from 'test/server/fake-data';
import { Routes } from 'lib-client/constants';
import { createMockRouter } from 'test/Wrapper';

describe('Create View', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
    await userEvent.type(titleInput, fakePost.title);
    await userEvent.type(contentTextArea, fakePost.content);

    // click create
    const createButton = screen.getByRole('button', {
      name: /create/i,
    });
    await userEvent.click(createButton);

    // assert redirect to /post/drafts
    await waitFor(() => expect(router.push).toHaveBeenCalledWith(Routes.SITE.DRAFTS));
  });

  test("update post mutation on success redirects to that post's page", async () => {
    // mocks both usePost and useUpdatePost
    const updatedTitle = `Updated ${fakePostWithAuthor.title}`;

    const router = createMockRouter({
      query: { id: [fakePostWithAuthor.id.toString()] },
      pathname: Routes.SITE.CREATE,
      push: jest.fn(),
    });
    customRender(<CreateView />, { wrapperProps: { router } });

    // wait for loader to disappear
    await waitForElementToBeRemoved(() => screen.getByTestId(/loading/i));

    // edit title
    const titleInput = screen.getByRole('textbox', {
      name: /title/i,
    });
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, updatedTitle);

    // click update
    const updateButton = screen.getByRole('button', {
      name: /update/i,
    });
    await userEvent.click(updateButton);

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

  // form tests

  test('happy path create submit', async () => {
    const onSubmit = jest.fn();

    customRender(<CreateView testOnSubmit={onSubmit} />);

    // get fields
    const titleInput = screen.getByRole('textbox', {
      name: /title/i,
    });
    const contentTextArea = screen.getByRole('textbox', {
      name: /content/i,
    });
    // get create button
    const createButton = screen.getByRole('button', {
      name: /create/i,
    });

    await act(async () => {
      // valid input
      await userEvent.type(titleInput, fakePost.title);
      await userEvent.type(contentTextArea, fakePost.content);
      // click create
      await userEvent.click(createButton);
    });

    // assert onSubmit data
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      title: fakePost.title,
      content: fakePost.content,
    });
  });

  test('required messages onSubmit blank fields', async () => {
    customRender(<CreateView />);

    // get fields
    const titleInput = screen.getByRole('textbox', {
      name: /title/i,
    });
    const contentTextArea = screen.getByRole('textbox', {
      name: /content/i,
    });
    // get create button
    const createButton = screen.getByRole('button', {
      name: /create/i,
    });

    // click create
    await act(async () => {
      await userEvent.click(createButton);
    });

    // assert validation required error messages
    expect(titleInput).toHaveErrorMessage(/must contain at least 6 character/i);
    expect(contentTextArea).toHaveErrorMessage(/must contain at least 6 character/i);
  });

  test.todo('http error 500');
});
