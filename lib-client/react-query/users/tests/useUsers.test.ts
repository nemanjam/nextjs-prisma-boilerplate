import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from 'test/test-utils';
import { useUsers } from 'lib-client/react-query/users/useUsers';
import { fakeUsers } from 'test/server/fake-data';
import { UsersGetSearchQueryParams } from 'types/models/User';

describe('useUsers', () => {
  test('successful query users hook', async () => {
    const page = 1;
    const username = fakeUsers.items[0].username;

    const params: UsersGetSearchQueryParams = { page, searchTerm: username };

    const { result } = renderHook(() => useUsers(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data.pagination.currentPage).toBe(page);
    expect(result.current.data.pagination.total).toBe(1);
    expect(result.current.data.items[0].username).toBe(username);
  });
});
