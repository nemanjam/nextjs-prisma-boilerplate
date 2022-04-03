import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from 'test/test-utils';
import { useDeleteUser } from 'lib-client/react-query/users/useDeleteUser';
import { fakeUser } from 'test/server/fake-data';

describe('useDeleteUser', () => {
  test('successful delete mutation hook', async () => {
    const userId = fakeUser.id;

    const { result, waitFor } = renderHook(() => useDeleteUser(), {
      wrapper: createWrapper(),
    });

    const { mutate } = result.current;
    mutate(userId);

    await waitFor(() => result.current.isSuccess);

    // assert returns deleted user
    expect(result.current.data.username).toBe(fakeUser.username);
  });
});
