import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from 'test/test-utils';
import { useUser } from 'lib-client/react-query/users/useUser';
import { fakeUser } from 'test/server/fake-data';
import { UserGetQueryParams } from 'types/models/User';
import { errorHandler500 } from 'test/server';

describe('useUser hook', () => {
  test('successful query user hook', async () => {
    const params: UserGetQueryParams = { username: fakeUser.username };

    const { result } = renderHook(() => useUser(params), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data.username).toBe(fakeUser.username);
  });

  test('1 fail 500 query user hook', async () => {
    const mockedConsoleError = jest.spyOn(console, 'error').mockImplementation();

    const params: UserGetQueryParams = { username: fakeUser.username };

    // return 500 from msw
    errorHandler500();
    const { result } = renderHook(() => useUser(params), {
      wrapper: createWrapper(),
    });

    // assert error 500
    await waitFor(() => expect(result.current.isError).toBe(true)); // todo: fix this current=null
    expect(result.current.error).toBe('12');

    mockedConsoleError.mockRestore();
  });
});
