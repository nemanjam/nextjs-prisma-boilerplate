import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from 'test/test-utils';
import { useUser } from 'lib-client/react-query/users/useUser';
import { fakeUser } from 'test/server/fake-data';
import { UserGetQueryParams } from 'types/models/User';

describe('useUser', () => {
  test('successful query user hook', async () => {
    const params: UserGetQueryParams = { username: fakeUser.username };

    const { result } = renderHook(() => useUser(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => result.current.isSuccess);
    expect(result.current.data.username).toBe(fakeUser.username);
  });
});
