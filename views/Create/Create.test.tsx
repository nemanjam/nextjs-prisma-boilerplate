import { fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { customRender } from 'test/test-utils';
import CreateView from 'views/Create';
import { fakePosts } from 'test/server/fake-data';

describe('Create View', () => {
  test('create post mutation on success redirects to drafts page', async () => {
    customRender(<CreateView />);

    //
  });

  // only for update, mock usePost
  // await waitForElementToBeRemoved(() => screen.getAllByDisplayValue(/loading.../i)[0]);

  test.todo('form');

  test.todo('render');

  test.todo('http error 500');
});
