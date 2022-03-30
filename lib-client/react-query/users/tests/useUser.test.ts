import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from 'test/test-utils';
import { useUser } from 'lib-client/react-query/users/useUser';
import { GetUserQueryParams } from 'pages/api/users/profile';
import { fakeUser } from 'test/server/fake-data';

describe('useUser', () => {
  test('successful query hook', async () => {
    const params: GetUserQueryParams = { username: fakeUser.username };

    const { result, waitFor } = renderHook(() => useUser(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data.username).toBe(fakeUser.username);
  });
});
