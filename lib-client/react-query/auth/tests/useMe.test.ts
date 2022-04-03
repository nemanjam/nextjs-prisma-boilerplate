import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from 'test/test-utils';
import { useMe } from 'lib-client/react-query/auth/useMe';
import { fakeUser } from 'test/server/fake-data';

describe('useMe', () => {
  test('successful query hook', async () => {
    const { result, waitFor } = renderHook(() => useMe(), {
      wrapper: createWrapper(),
    });

    // const { data: session, status } = useSession(); // this breaks

    await waitFor(() => result.current.isSuccess);

    expect(result.current.me.username).toBe(fakeUser.username);
  });
});
