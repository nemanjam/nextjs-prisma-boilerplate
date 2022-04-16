import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from 'test/test-utils';
import { useMe } from 'lib-client/react-query/auth/useMe';
import { fakeUser } from 'test/server/fake-data';

describe('useMe', () => {
  test('successful query hook', async () => {
    // useMe calls useSession() that needs SessionProvider

    const { result, waitFor } = renderHook(() => useMe(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => result.current.isSuccess);

    // assert fakeUser is fetched based on fakeUser.id in session
    expect(result.current.data.username).toBe(fakeUser.username);
  });
});
