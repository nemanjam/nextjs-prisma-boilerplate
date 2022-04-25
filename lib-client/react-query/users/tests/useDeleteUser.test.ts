import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from 'test-client/test-utils';
import { useDeleteUser } from 'lib-client/react-query/users/useDeleteUser';
import { fakeUser } from 'test-client/server/fake-data';

describe('useDeleteUser', () => {
  test('successful delete user mutation hook', async () => {
    const userId = fakeUser.id;

    const { result } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    const { mutate } = result.current;
    mutate(userId);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // assert returns deleted user
    expect(result.current.data.username).toBe(fakeUser.username);
  });
});
